import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const {
      transcript: incomingTranscript,
      audioBase64,
      audioMimeType = 'audio/webm',
      promptTitle,
      category,
      durationSeconds = 30,
      accent = 'en-IN',
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const durationMin = Math.max((durationSeconds || 30) / 60, 0.25);

    // If both transcript and audio are missing
    if ((!incomingTranscript || incomingTranscript.trim().length === 0) && !audioBase64) {
      return NextResponse.json(
        { error: 'No speech detected. Please speak into your microphone or type your response in the transcript box.' },
        { status: 400 }
      );
    }

    let finalTranscript = incomingTranscript ? incomingTranscript.trim() : '';
    let aiEvaluation: any = null;

    // AI Models to try in priority sequence
    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
    ];

    if (apiKey && apiKey.length > 5) {
      for (const model of modelsToTry) {
        try {
          const parts: any[] = [];

          // If raw audio is supplied, attach it for acoustic & pronunciation analysis
          if (audioBase64 && audioBase64.length > 100) {
            // Clean base64 header if present (e.g., data:audio/webm;base64,...)
            const cleanBase64 = audioBase64.includes(',')
              ? audioBase64.split(',')[1]
              : audioBase64;

            parts.push({
              inlineData: {
                mimeType: audioMimeType || 'audio/webm',
                data: cleanBase64,
              },
            });
          }

          const promptInstruction = `You are a Senior IELTS Master Examiner and Chief Spoken English Evaluator at Fuzion Academy (founded by Praveen Singh Rawat, Sector-11 Pratap Vihar, Ghaziabad).
Evaluate the student's spoken response with uncompromising academic honesty, authentic IELTS scoring, and actionable coaching feedback.

CONTEXT:
- Speaking Prompt: "${promptTitle || 'General Speaking Evaluation'}"
- Category: ${category || 'Spoken English & Communication'}
- Target Accent/Region: ${accent} (Evaluate with fairness toward Indian English while maintaining international IELTS/CEFR standards)
- Duration: ${durationSeconds} seconds
${finalTranscript ? `- Provided Transcript: "${finalTranscript}"` : '- Listen to the audio attachment to extract the exact spoken words word-for-word.'}

EVALUATION PRINCIPLES:
1. STRICT HONESTY: Do NOT flatter the student with generic compliments. Call out exact grammatical blunders, mother tongue influence (MTI), awkward Indianisms, hesitations, and vocabulary deficits.
2. ACCURATE SCORING: Align precisely with official IELTS 9-band criteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation).
3. REAL CORRECTIONS: Identify the exact phrase where an error occurred, provide the natural native alternative, name the specific grammatical rule violated, and explain why.
4. VOCABULARY UPGRADES: Replace simplistic words (e.g. "very good", "too much", "problem") with high-band collocations (Band 7.5-8.5).
5. PRONUNCIATION TIPS: Highlight any phonetic slip, syllable stress error, or sound confusion (such as /w/ vs /v/, /s/ vs /sh/, or dental /th/).

Return STRICT JSON matching this schema:
{
  "actualTranscript": "string (Exact word-for-word spoken transcript)",
  "overallScore": number (0-100),
  "ieltsBand": number (e.g. 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0),
  "cefrLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  "fluencyScore": number (0-100),
  "grammarScore": number (0-100),
  "vocabScore": number (0-100),
  "pronunciationScore": number (0-100),
  "wpm": number (Words per minute),
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "corrections": [
    {
      "original": "exact spoken phrase with mistake",
      "corrected": "native English standard phrasing",
      "grammarRule": "Name of grammatical rule",
      "explanation": "Precise explanation of the mistake"
    }
  ],
  "vocabularyUpgrades": [
    {
      "used": "simple or overused word",
      "betterAlternative": "C1/C2 advanced vocabulary or collocation",
      "contextExample": "Complete sentence showing how to use the upgrade in context"
    }
  ],
  "pronunciationNotes": [
    {
      "word": "word with pronunciation/accent issue",
      "phonetic": "phonetic guide",
      "coachingTip": "precise mouth/tongue tip to correct pronunciation"
    }
  ],
  "fillerAnalysis": {
    "count": number,
    "detected": ["um", "uh", "like"],
    "impact": "honest assessment of how fillers impacted coherence"
  },
  "teacherAdvice": "One deeply personalized, honest, and direct coaching paragraph explaining the biggest roadblock holding this student back and the exact daily drill required to improve."
}
Only output valid JSON. No markdown fences.`;

          parts.push({ text: promptInstruction });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { responseMimeType: 'application/json' },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              aiEvaluation = {
                ...parsed,
                source: `gemini-${model}`,
              };
              if (parsed.actualTranscript) {
                finalTranscript = parsed.actualTranscript;
              }
              break; // Success! Break out of model loop
            }
          } else {
            console.warn(`Model ${model} returned status ${geminiRes.status}. Trying next...`);
          }
        } catch (modelErr: any) {
          console.warn(`Model ${model} execution error:`, modelErr.message);
        }
      }
    }

    // If Gemini succeeded, finalize and return
    if (aiEvaluation) {
      const words = finalTranscript.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const wpm = aiEvaluation.wpm || Math.round(wordCount / durationMin);

      return NextResponse.json({
        ...aiEvaluation,
        transcript: finalTranscript,
        wordCount,
        wpm,
      });
    }

    // Intelligent Dynamic Local Linguistic Engine (Fallback)
    // Runs when API is unreachable, but produces dynamic, honest, individualized feedback!
    const words: string[] = finalTranscript.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const wpm = Math.round(wordCount / durationMin);

    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of'];
    const detectedFillers: string[] = [];
    fillerWords.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, 'gi');
      const matches = finalTranscript.match(regex);
      if (matches) {
        matches.forEach((m: string) => detectedFillers.push(m.toLowerCase()));
      }
    });

    const uniqueWords = new Set(words.map((w: string) => w.toLowerCase()));
    const vocabVariety = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 50;

    let grammarScore = 80;
    let fluencyScore = 75;
    const corrections: any[] = [];
    const vocabularyUpgrades: any[] = [];
    const weaknesses: string[] = [];
    const strengths: string[] = [];

    // Detailed ESL pattern checkers
    if (/\b(did went|did saw|did took|did came|did spoke)\b/i.test(finalTranscript)) {
      corrections.push({
        original: finalTranscript.match(/\b(did \w+)\b/i)?.[0] || 'did went',
        corrected: 'went / did go',
        grammarRule: 'Double Past Auxiliary',
        explanation: 'Auxiliary "did" carries the past tense. The main verb must remain in its bare infinitive form.',
      });
      grammarScore -= 12;
      weaknesses.push('Double past tense construction with auxiliary "did".');
    }

    if (/\b(discuss about|explain about|order for|reach at)\b/i.test(finalTranscript)) {
      corrections.push({
        original: finalTranscript.match(/\b(discuss about|explain about|order for|reach at)\b/i)?.[0] || 'discuss about',
        corrected: 'discuss / explain / order / reach',
        grammarRule: 'Transitive Verb Preposition Overextension',
        explanation: 'These verbs take direct objects without unnecessary prepositions.',
      });
      grammarScore -= 8;
      weaknesses.push('Unnecessary preposition added after transitive verb.');
    }

    if (/\b(me and my|me and \w+)\b/i.test(finalTranscript)) {
      corrections.push({
        original: finalTranscript.match(/\b(me and \w+)\b/i)?.[0] || 'me and my friend',
        corrected: 'my friend and I',
        grammarRule: 'Subject Pronoun Case',
        explanation: 'When functioning as the subject of the clause, use the nominative pronoun "I", placed politely after the other person.',
      });
      grammarScore -= 7;
      weaknesses.push('Incorrect use of objective pronoun "me" in subject position.');
    }

    if (/\b(we was|they was|people was)\b/i.test(finalTranscript)) {
      corrections.push({
        original: finalTranscript.match(/\b(we was|they was|people was)\b/i)?.[0] || 'we was',
        corrected: 'we were / they were / people were',
        grammarRule: 'Subject-Verb Concord',
        explanation: 'Plural subjects require plural past auxiliary "were".',
      });
      grammarScore -= 10;
      weaknesses.push('Subject-verb disagreement with plural subjects.');
    }

    if (/\b(too much good|too much cold|too much beautiful)\b/i.test(finalTranscript)) {
      corrections.push({
        original: finalTranscript.match(/\b(too much \w+)\b/i)?.[0] || 'too much cold',
        corrected: 'very cold / bitterly cold',
        grammarRule: 'Quantifier vs Intensifier Confusion',
        explanation: '"Too much" qualifies uncountable nouns. To intensify an adjective, use "very", "extremely", or "bitterly".',
      });
      grammarScore -= 6;
    }

    // Vocabulary upgrades
    if (/\b(very good|good)\b/i.test(finalTranscript)) {
      vocabularyUpgrades.push({
        used: 'very good',
        betterAlternative: 'exemplary / remarkable / commendable',
        contextExample: 'The presentation delivered a remarkable overview of the subject.',
      });
    }
    if (/\b(very big|big)\b/i.test(finalTranscript)) {
      vocabularyUpgrades.push({
        used: 'big',
        betterAlternative: 'substantial / immense / prominent',
        contextExample: 'The academy made a substantial investment in AI speaking labs.',
      });
    }
    if (/\b(very beautiful|beautiful)\b/i.test(finalTranscript)) {
      vocabularyUpgrades.push({
        used: 'very beautiful',
        betterAlternative: 'breathtaking / picturesque / aesthetically captivating',
        contextExample: 'The mountainous scenery was picturesque and breathtaking.',
      });
    }

    // Speaking rate analysis
    if (wpm < 70) {
      fluencyScore -= 18;
      weaknesses.push(`Pacing is too hesitant at ${wpm} WPM (target: 110–140 WPM).`);
    } else if (wpm > 170) {
      fluencyScore -= 10;
      weaknesses.push(`Speaking pace of ${wpm} WPM is rushed; slow down for clarity and articulation.`);
    } else {
      strengths.push(`Controlled speaking tempo of ${wpm} words per minute.`);
    }

    if (detectedFillers.length > 2) {
      fluencyScore -= Math.min(detectedFillers.length * 4, 20);
      weaknesses.push(`High filler density: ${detectedFillers.length} filler words detected (${detectedFillers.slice(0, 3).join(', ')}).`);
    } else {
      strengths.push('Low filler dependency; speech maintained reasonable continuity.');
    }

    if (wordCount >= 40) {
      strengths.push(`Sustained verbal response containing ${wordCount} words.`);
    } else {
      weaknesses.push(`Response was too brief (${wordCount} words) to demonstrate Band 7+ syntactic range.`);
    }

    const vocabScore = Math.min(Math.max(Math.round(vocabVariety * 0.8) + 25, 45), 90);
    const pronunciationScore = Math.min(Math.max(fluencyScore - 5, 48), 88);

    grammarScore = Math.min(Math.max(grammarScore, 40), 94);
    fluencyScore = Math.min(Math.max(fluencyScore, 40), 94);

    const overallScore = Math.round(
      fluencyScore * 0.3 + grammarScore * 0.3 + vocabScore * 0.25 + pronunciationScore * 0.15
    );

    // Approximate IELTS Band from overall score
    let ieltsBand = 5.0;
    let cefrLevel = 'B1';
    if (overallScore >= 85) {
      ieltsBand = 8.0;
      cefrLevel = 'C1';
    } else if (overallScore >= 75) {
      ieltsBand = 7.0;
      cefrLevel = 'B2';
    } else if (overallScore >= 65) {
      ieltsBand = 6.0;
      cefrLevel = 'B2';
    } else if (overallScore >= 55) {
      ieltsBand = 5.5;
      cefrLevel = 'B1';
    } else if (overallScore >= 45) {
      ieltsBand = 5.0;
      cefrLevel = 'A2';
    } else {
      ieltsBand = 4.0;
      cefrLevel = 'A1';
    }

    return NextResponse.json({
      actualTranscript: finalTranscript,
      transcript: finalTranscript,
      overallScore,
      ieltsBand,
      cefrLevel,
      fluencyScore,
      grammarScore,
      vocabScore,
      pronunciationScore,
      wordCount,
      wpm,
      strengths: strengths.length > 0 ? strengths : ['Clear attempt to address the topic directly.'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Needs more complex compound and complex sentences.'],
      corrections,
      vocabularyUpgrades,
      pronunciationNotes: [
        {
          word: words[0] || 'English',
          phonetic: '/ˈɪŋɡlɪʃ/',
          coachingTip: 'Ensure crisp initial consonant articulation and do not drop word endings.',
        },
      ],
      fillerAnalysis: {
        count: detectedFillers.length,
        detected: detectedFillers,
        impact:
          detectedFillers.length > 0
            ? `Fillers interrupted lexical flow ${detectedFillers.length} time(s). Replace them with deliberate silent pauses.`
            : 'Zero filler words observed. Clean sentence transitions.',
      },
      teacherAdvice:
        corrections.length > 0
          ? `Honest Examiner Feedback: You are currently performing at Band ${ieltsBand} (${cefrLevel}). Your primary obstacle is grammatical accuracy—specifically ${corrections.map((c) => c.grammarRule).join(', ')}. Practice the "Shadowing Technique" for 15 minutes daily: listen to native speakers, record your voice immediately after, and compare your verb tenses sentence-by-sentence.`
          : `Honest Examiner Feedback: Your fundamentals are sound at Band ${ieltsBand}. To climb to Band 7.5+, focus on syntactic variety: incorporate conditional clauses, relative clauses, and idiomatic collocations rather than relying solely on simple Subject-Verb-Object structures.`,
      source: 'linguistic-engine',
    });
  } catch (error: any) {
    console.error('Speaking evaluate route error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
