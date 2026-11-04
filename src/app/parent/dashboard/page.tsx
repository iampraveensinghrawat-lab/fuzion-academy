'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useAppStore } from '@/lib/store';
import CertificateModal from '@/components/CertificateModal';
import {
  Users,
  Award,
  Flame,
  CalendarCheck,
  FileCheck,
  Mic,
  BookOpen,
  CheckCircle,
  Clock,
  LogOut,
  Phone,
  Eye,
  Plus,
  HeartHandshake,
  Shield,
  Download,
} from 'lucide-react';

export default function ParentDashboardPage() {
  const router = useRouter();
  const { currentUser, accounts, linkChildToParent, logout } = useAuthStore();
  const { homeworks, speakingHistory, setCertificateModalOpen } = useAppStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  // Find linked students
  const linkedCodes = currentUser?.linkedStudentCodes || ['FA-STU-101'];
  const allStudents = accounts.filter((a) => a.role === 'student');
  const linkedStudents = allStudents.filter((s) =>
    linkedCodes.includes(s.studentCode || '')
  );

  const [selectedStudentCode, setSelectedStudentCode] = useState(linkedCodes[0] || 'FA-STU-101');
  const [newStudentCodeInput, setNewStudentCodeInput] = useState('');
  const [linkMessage, setLinkMessage] = useState<{ text: string; success: boolean } | null>(null);

  const activeChild =
    linkedStudents.find((s) => s.studentCode === selectedStudentCode) ||
    linkedStudents[0] ||
    allStudents[0];

  const handleLinkNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentCodeInput.trim() || !currentUser) return;

    const res = linkChildToParent(currentUser.id, newStudentCodeInput);
    setLinkMessage({ text: res.message, success: res.success });
    if (res.success) {
      setNewStudentCodeInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Parent Bar */}
      <div className="bg-emerald-950 text-white py-2 px-4 sm:px-8 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>Parent &amp; Guardian Portal &bull; Welcome, {currentUser?.name || 'Sunita Sharma'} ({currentUser?.relationship || 'Mother'})</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-rose-600 transition-colors text-white text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-indigo-100 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-md">
              FA
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                Parent Progress &amp; Academic Supervision
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Verified spoken English growth, attendance, assessment reports &amp; teacher notes
              </p>
            </div>
          </div>

          {/* Child Selector Pills (Supports multiple children) */}
          <div className="flex items-center gap-2 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 px-2">Viewing Child:</span>
            {linkedStudents.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedStudentCode(child.studentCode!)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedStudentCode === child.studentCode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-100'
                }`}
              >
                {child.name} ({child.studentCode})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Child Profile & Metrics Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-300">
                Student Profile &bull; Read-Only Parent Oversight
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {activeChild?.name || 'Rahul Sharma'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                Enrolled in <span className="font-bold text-white">{activeChild?.course || 'Spoken English & Fluency'}</span> &bull; Batch: <span className="font-bold text-yellow-300">{activeChild?.batch || 'B1-Evening'}</span>
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs text-emerald-200">
                <span>Student ID: <span className="font-mono font-bold text-white">{activeChild?.studentCode || 'FA-STU-101'}</span></span>
                <span>&bull;</span>
                <span>CEFR Level: <span className="font-bold text-emerald-300">{activeChild?.cefrLevel || 'Intermediate (B1)'}</span></span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-pulse" />
                <div className="text-xl font-black">{activeChild?.streak || 7} Days</div>
                <div className="text-[10px] uppercase font-bold text-emerald-200">Speaking Streak</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <CalendarCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-xl font-black">{activeChild?.attendanceRate || 92}%</div>
                <div className="text-[10px] uppercase font-bold text-emerald-200">Attendance</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <FileCheck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xl font-black">88/100</div>
                <div className="text-[10px] uppercase font-bold text-emerald-200">Latest Test</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-black text-yellow-300">{activeChild?.xp || 420} XP</div>
                <div className="text-[10px] uppercase font-bold text-emerald-200">Rank: Level {activeChild?.level || 4}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns: Left Teacher Feedback & Speaking; Right Homework & Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Teacher Feedback Banner */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    FA
                  </span>
                  <span>Teacher&apos;s Academic Remarks &bull; Praveen Sir</span>
                </h3>
                <span className="text-[11px] text-gray-400">Updated this week</span>
              </div>
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                &ldquo;Outstanding fluency and vocabulary usage during roleplay drills. Rahul shows high confidence when answering spontaneous questions. Ensure he spends 15 minutes daily on the 60-Second Time Bomb game to solidify irregular past verb conjugations.&rdquo;
              </div>
            </div>

            {/* Child's AI Speaking Assessment Summary */}
            <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pink-500" />
                  <span>AI Speaking Lab Performance (Recent Session)</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  88% Overall Score
                </span>
              </div>

              {speakingHistory && speakingHistory[0] && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="font-bold text-gray-700 block">Prompt Practiced:</span>
                    <span className="text-gray-900 font-medium">{speakingHistory[0].promptTitle}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-indigo-50 rounded-xl">
                      <span className="text-[10px] text-gray-500 block font-bold">Fluency</span>
                      <span className="text-base font-black text-indigo-700">{speakingHistory[0].fluencyScore}%</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl">
                      <span className="text-[10px] text-gray-500 block font-bold">Grammar</span>
                      <span className="text-base font-black text-emerald-700">{speakingHistory[0].grammarScore}%</span>
                    </div>
                    <div className="p-2.5 bg-purple-50 rounded-xl">
                      <span className="text-[10px] text-gray-500 block font-bold">Pace</span>
                      <span className="text-base font-black text-purple-700">{speakingHistory[0].wpm} WPM</span>
                    </div>
                  </div>

                  {speakingHistory[0].strengths && (
                    <div className="pt-2">
                      <span className="font-bold text-gray-700 block mb-1">Evaluator Observed Strengths:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11px]">
                        {speakingHistory[0].strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Homework Status */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Assigned Practice &amp; Homework</span>
              </h3>

              <div className="space-y-2">
                {homeworks.map((hw) => (
                  <div
                    key={hw.id}
                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                      hw.completed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {hw.completed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className={`font-bold ${hw.completed ? 'text-gray-700' : 'text-gray-900'}`}>
                        {hw.title}
                      </p>
                      <span className="text-[10px] text-gray-500">Due: {hw.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Course Certificate Preview */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Verified Course Certificate</span>
                </h3>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <h4 className="font-bold text-gray-900">
                  Spoken English &amp; Fluency Course Completion
                </h4>
                <p className="text-[11px] text-gray-600">
                  Issued to: <span className="font-bold">{activeChild?.name}</span> &bull; ID: FA-CERT-2026-889
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setCertificateModalOpen(true)}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                  <button
                    onClick={() => setCertificateModalOpen(true)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700"
                    title="Download / Print"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Link Another Child Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Sibling / Another Student</span>
              </h3>
              <p className="text-[11px] text-gray-500">
                Have another child studying at Fuzion Academy? Enter their student admission code below.
              </p>

              <form onSubmit={handleLinkNewChild} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. FA-STU-102"
                  value={newStudentCodeInput}
                  onChange={(e) => setNewStudentCodeInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono uppercase bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Link
                </button>
              </form>

              {linkMessage && (
                <p
                  className={`text-[11px] font-bold ${
                    linkMessage.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {linkMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      <CertificateModal />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-indigo-100 py-6 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-extrabold text-[#1a2b6b]">
            Fuzion Academy &bull; Sector-11, Pratap Vihar, Ghaziabad &bull; Parent Support Desk
          </p>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <a href="tel:9582774387">Helpline: 9582774387</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
