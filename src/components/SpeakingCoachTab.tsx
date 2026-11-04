'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { SPEAKING_PROMPTS, SpeakingPrompt } from '@/lib/speakingPrompts';
import {
  Mic,
  MicOff,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2,
  RefreshCw,
  Trophy,
  History,
  Languages,
  BookOpen,
  ArrowRight,
  Edit3,
  Flame,
  ShieldAlert,
  GraduationCap,
  Sparkle,
} from 'lucide-react';

export default function SpeakingCoachTab() {
  const { saveSpeakingAssessment, speakingHistory } = useAppStore();
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(SPEAKING_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [accent, setAccent] = useState<'en-IN' | 'en-US' | 'en-GB'>('en-IN');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'coach' | 'history'>('coach');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBase64Ref = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);

  // Initialize Speech Recognition with continuous stream & restart protection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = accent;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser or type your spoken response below.');
          }
        };

        // If the browser halts recognition on silence while user is still recording, restart it
        recognition.onend = () => {
          if (isRecordingRef.current) {
            try {
              recognition.start();
            } catch (err) {
              // Ignore restart collision
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [accent]);

  // Start Voice & Audio Recording
  const startRecording = async () => {
    setErrorMessage('');
    setTranscript('');
    setAnalysisResult(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    audioBase64Ref.current = '';

    // Request raw audio stream for high-fidelity acoustic analysis
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result && typeof reader.result === 'string') {
              audioBase64Ref.current = reader.result;
            }
          };
          reader.readAsDataURL(audioBlob);

          // Stop all microphone tracks cleanly
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(250); // Slice audio every 250ms
      }
    } catch (micErr: any) {
      console.warn('MediaRecorder microphone capture:', micErr.message);
    }

    // Start Web Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = accent;
        recognitionRef.current.start();
      } catch (e) {
        // Recognition might already be running
      }
    }

    isRecordingRef.current = true;
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop Recording
  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  // Submit Spoken Content to Honest AI Examiner
  const runAiEvaluation = async () => {
    setErrorMessage('');

    if (isRecording) {
      stopRecording();
    }

    const trimmedText = transcript.trim();
    if (!trimmedText && audioChunksRef.current.length === 0) {
      setErrorMessage('Please speak into your microphone or type your response in the box before analyzing.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/speaking-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: trimmedText,
          audioBase64: audioBase64Ref.current,
          audioMimeType: 'audio/webm',
          promptTitle: selectedPrompt.title,
          category: selectedPrompt.category,
          durationSeconds: recordingSeconds || 30,
          accent,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Evaluation failed');
      }

      const data = await res.json();
      setAnalysisResult(data);

      if (data.actualTranscript && !transcript) {
        setTranscript(data.actualTranscript);
      }

      // Save to persistent progress store
      saveSpeakingAssessment({
        promptTitle: selectedPrompt.title,
        category: selectedPrompt.category,
        transcript: data.actualTranscript || trimmedText,
        overallScore: data.overallScore || 70,
        ieltsBand: data.ieltsBand || 6.0,
        cefrLevel: data.cefrLevel || 'B2',
        fluencyScore: data.fluencyScore || 68,
        grammarScore: data.grammarScore || 72,
        vocabScore: data.vocabScore || 70,
        pronunciationScore: data.pronunciationScore || 70,
        wordCount: data.wordCount || trimmedText.split(/\s+/).length,
        wpm: data.wpm || 110,
        strengths: data.strengths || ['Good attempt to address the prompt.'],
        weaknesses: data.weaknesses || [],
        corrections: data.corrections || [],
        vocabularyUpgrades: data.vocabularyUpgrades || [],
        pronunciationNotes: data.pronunciationNotes || [],
        fillerAnalysis: data.fillerAnalysis || { count: 0, detected: [] },
        teacherAdvice: data.teacherAdvice || '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const currentWordCount = words.length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Hero Gradient Banner */}
      <div className="rounded-3xl gradient-speaking text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Certified IELTS &amp; Spoken English AI Examiner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Fuzion Academy Speaking Lab
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Real, unvarnished IELTS examiner assessment. Detects actual grammatical slips, mother tongue influence (MTI), filler density, vocabulary upgrades, and gives honest feedback from Praveen Sir.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex items-center bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('coach')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'coach'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speaking Studio</span>
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'history'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Assessment History ({speakingHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'history' ? (
        /* History View */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-lg text-gray-900">Your Speaking Performance History</h2>
              <p className="text-xs text-gray-500">Track your honest IELTS Band score progression over time.</p>
            </div>
            <button
              onClick={() => setActiveSubTab('coach')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              Start New Speaking Test &rarr;
            </button>
          </div>

          {speakingHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs space-y-2">
              <Mic className="w-10 h-10 mx-auto text-gray-300" />
              <p className="font-bold">No speaking tests recorded yet.</p>
              <p>Complete your first speaking practice above to generate an examiner report.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {speakingHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl border border-indigo-100 hover:border-indigo-300 bg-gradient-to-r from-gray-50 to-indigo-50/30 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {rec.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-900 mt-1">{rec.promptTitle}</h4>
                      <p className="text-[11px] text-gray-400">{rec.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {rec.ieltsBand && (
                        <div className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-center">
                          <span className="text-[10px] block font-semibold uppercase">IELTS</span>
                          <span className="text-sm font-black">Band {rec.ieltsBand}</span>
                        </div>
                      )}
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-900 text-white text-center">
                        <span className="text-[10px] block font-semibold uppercase">Score</span>
                        <span className="text-sm font-black">{rec.overallScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-700 italic">
                    &ldquo;{rec.transcript}&rdquo;
                  </div>

                  {rec.teacherAdvice && (
                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900">
                      <span className="font-bold block text-indigo-950 mb-0.5">Examiner Assessment:</span>
                      {rec.teacherAdvice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Main Studio Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Select Speaking Prompt (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Select Speaking Task
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {SPEAKING_PROMPTS.length} Prompts
              </span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
              {SPEAKING_PROMPTS.map((p) => {
                const isSelected = selectedPrompt.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (isRecording) stopRecording();
                      setSelectedPrompt(p);
                      setAnalysisResult(null);
                      setTranscript('');
                      setErrorMessage('');
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-1 ring-indigo-400'
                        : 'bg-white border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.category === 'INTERVIEW'
                            ? 'bg-blue-100 text-blue-700'
                            : p.category === 'ROLEPLAY'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {p.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">{p.estimatedTime}</span>
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 leading-snug">
                      {p.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Prompt Detail, Recording Studio & AI Analysis (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
              {/* Prompt Header */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {selectedPrompt.category}
                  </span>

                  {/* Accent / Speech Engine Selector */}
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700">
                    <Languages className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Accent:</span>
                    <select
                      value={accent}
                      onChange={(e) => setAccent(e.target.value as any)}
                      className="bg-transparent font-bold text-indigo-700 focus:outline-none cursor-pointer"
                    >
                      <option value="en-IN">Indian English (en-IN)</option>
                      <option value="en-US">US English (en-US)</option>
                      <option value="en-GB">UK English (en-GB)</option>
                    </select>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                  {selectedPrompt.title}
                </h2>

                <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm text-gray-700 italic">
                  &ldquo;{selectedPrompt.instructions}&rdquo;
                </div>
              </div>

              {/* Microphone Recording Container */}
              <div className="bg-slate-50/90 border-2 border-dashed border-indigo-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
                <div className="relative inline-block">
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping" />
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 ${
                      isRecording
                        ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse'
                        : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 hover:opacity-90'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>

                <div>
                  <p className="text-sm font-extrabold text-gray-800">
                    {isRecording
                      ? `Recording Active (${formatTime(recordingSeconds)}) — Click to Finish Speaking`
                      : 'Click the Microphone to Record Your Speech'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRecording
                      ? 'Speak continuously. Your voice is being captured with active acoustic sampling.'
                      : `Accent tuned for ${accent === 'en-IN' ? 'Indian English' : accent}. Speak naturally without artificial pauses.`}
                  </p>
                </div>

                {/* Animated Waveform when recording */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[40, 70, 95, 60, 85, 45, 90, 75, 50, 65, 80, 55, 70, 90].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-600 rounded-full animate-wave-bar"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.07}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Live Transcript / Editable Transcription Box */}
                <div className="mt-4 p-4 bg-white rounded-2xl border border-indigo-100 text-left shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                        {isEditingTranscript ? 'Edit Transcript' : 'Spoken Transcript'}
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        {currentWordCount} words
                      </span>
                      {recordingSeconds > 0 && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                          ~{Math.round(currentWordCount / (Math.max(recordingSeconds, 1) / 60))} WPM
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingTranscript ? 'Done Editing' : 'Edit / Type Text'}</span>
                    </button>
                  </div>

                  {isEditingTranscript ? (
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Type or edit what you spoke here..."
                      rows={4}
                      className="w-full p-2.5 text-xs text-gray-800 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium min-h-[60px]">
                      {transcript || (
                        <span className="text-gray-400 italic">
                          Speak into your microphone or click &ldquo;Edit / Type Text&rdquo; to input your spoken response...
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Quick Practice Test Samples */}
                {!isRecording && !transcript && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="text-[11px] text-gray-400 font-semibold">Test with Sample Speech:</span>
                    <button
                      onClick={() => {
                        setTranscript(
                          "Actually my city is Delhi, it is very crowded place. Yesterday I did went to market and discuss about prices with shopkeeper. Me and my friend was having fun, but the weather was too much cold."
                        );
                        setRecordingSeconds(25);
                      }}
                      className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-bold transition-colors"
                    >
                      Sample ESL Speech (Grammar Challenges)
                    </button>
                    <button
                      onClick={() => {
                        setTranscript(
                          "I have been working as a software developer for the past three years. My primary responsibility encompasses designing scalable microservices. I am keen on refining my articulation and diplomatic communication so that I can lead international project calls effortlessly."
                        );
                        setRecordingSeconds(30);
                      }}
                      className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-bold transition-colors"
                    >
                      Sample Professional Speech (Advanced)
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Recording</span>
                    </button>
                  ) : (
                    (transcript || audioChunksRef.current.length > 0) && (
                      <button
                        onClick={runAiEvaluation}
                        disabled={isAnalyzing}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:bg-gray-400"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Examiner Analyzing (IELTS Bands &amp; Grammar)...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>EVALUATE WITH HONEST AI EXAMINER</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* AI Assessment Results Section */}
              {analysisResult && (
                <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/50 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-lg space-y-6 animate-scale-in">
                  {/* Result Header with IELTS Band & CEFR */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md font-black text-xl">
                        {analysisResult.ieltsBand ? `B${Math.round(analysisResult.ieltsBand)}` : 'FA'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base sm:text-lg text-gray-900">
                            Examiner Assessment Report
                          </h3>
                          {analysisResult.cefrLevel && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              CEFR {analysisResult.cefrLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-indigo-700 font-semibold">
                          Fuzion Academy IELTS &amp; Spoken English Evaluation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {analysisResult.ieltsBand && (
                        <div className="px-4 py-2 rounded-2xl bg-purple-700 text-white text-center shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-wider block">IELTS Band</span>
                          <span className="text-2xl font-black">{analysisResult.ieltsBand}</span>
                        </div>
                      )}
                      <div className="px-4 py-2 rounded-2xl bg-indigo-950 text-white text-center shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider block">Overall</span>
                        <span className="text-2xl font-black">{analysisResult.overallScore}<span className="text-xs font-normal text-indigo-200">/100</span></span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Official IELTS Scoring Metric Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold uppercase block">Fluency &amp; Coherence</span>
                      <span className="text-xl font-black text-indigo-600">{analysisResult.fluencyScore}%</span>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analysisResult.fluencyScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold uppercase block">Grammar &amp; Accuracy</span>
                      <span className="text-xl font-black text-emerald-600">{analysisResult.grammarScore}%</span>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${analysisResult.grammarScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold uppercase block">Lexical Resource</span>
                      <span className="text-xl font-black text-purple-600">{analysisResult.vocabScore}%</span>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysisResult.vocabScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold uppercase block">Pronunciation</span>
                      <span className="text-xl font-black text-blue-600">{analysisResult.pronunciationScore}%</span>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${analysisResult.pronunciationScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Praveen Sir's Honest Examiner Feedback Card */}
                  {analysisResult.teacherAdvice && (
                    <div className="p-5 bg-white rounded-2xl border-2 border-indigo-300 shadow-sm space-y-2 relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          PSR
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-indigo-950">
                            Examiner Praveen Sir&apos;s Direct Assessment
                          </h4>
                          <span className="text-[10px] text-gray-500">Unfiltered Feedback &amp; Prescribed Daily Drills</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-medium pl-9 italic">
                        &ldquo;{analysisResult.teacherAdvice}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Specific Grammatical & Syntactic Corrections */}
                  {analysisResult.corrections && analysisResult.corrections.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Critical Grammatical Corrections ({analysisResult.corrections.length})</span>
                      </h4>
                      <div className="space-y-2.5">
                        {analysisResult.corrections.map((corr: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-2xl border border-rose-200 text-xs space-y-2 shadow-sm"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              {corr.grammarRule && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                                  {corr.grammarRule}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-rose-600 font-semibold line-through bg-rose-50 px-2 py-0.5 rounded">
                                {corr.original}
                              </span>
                              <span className="text-gray-400 font-bold">&rarr;</span>
                              <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded">
                                {corr.corrected}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-700 leading-relaxed">
                              {corr.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vocabulary Upgrades (Band 8+ Collocations) */}
                  {analysisResult.vocabularyUpgrades && analysisResult.vocabularyUpgrades.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <Sparkle className="w-4 h-4 text-purple-600" />
                        <span>Band 8.0+ Vocabulary Upgrades</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {analysisResult.vocabularyUpgrades.map((v: any, idx: number) => (
                          <div key={idx} className="bg-white p-3.5 rounded-2xl border border-purple-200 shadow-sm space-y-1 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-500 line-through">{v.used}</span>
                              <span className="text-purple-400 font-bold">&rarr;</span>
                              <span className="text-purple-700 font-black">{v.betterAlternative}</span>
                            </div>
                            {v.contextExample && (
                              <p className="text-[11px] text-gray-600 italic mt-1">
                                &ldquo;{v.contextExample}&rdquo;
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pronunciation & Phonetic Coaching Tips */}
                  {analysisResult.pronunciationNotes && analysisResult.pronunciationNotes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span>Pronunciation &amp; Accent Coaching (MTI Corrections)</span>
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.pronunciationNotes.map((p: any, idx: number) => (
                          <div key={idx} className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-blue-900">{p.word}</span>
                              {p.phonetic && (
                                <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {p.phonetic}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-700">{p.coachingTip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filler Word Density Analysis */}
                  {analysisResult.fillerAnalysis && (
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Filler Word Analysis</span>
                        </h4>
                        <span className="text-xs font-black text-amber-700">
                          {analysisResult.fillerAnalysis.count} Fillers Detected
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700">
                        {analysisResult.fillerAnalysis.impact}
                      </p>
                    </div>
                  )}

                  {/* Observed Strengths & Critical Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    {analysisResult.strengths && (
                      <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Observed Strengths</span>
                        </h4>
                        <ul className="text-xs text-gray-700 space-y-1.5">
                          {analysisResult.strengths.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                      <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>Key Weaknesses to Fix</span>
                        </h4>
                        <ul className="text-xs text-gray-700 space-y-1.5">
                          {analysisResult.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">✕</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
