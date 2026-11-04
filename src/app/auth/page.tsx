'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Users,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function AuthPortalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f1ff] via-[#f8f9ff] to-white flex flex-col font-sans text-gray-900 selection:bg-pink-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="gradient-topbar text-white text-xs py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 font-medium">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>Sector-11, Pratap Vihar, Ghaziabad</span>
          <span className="opacity-50">|</span>
          <span className="text-indigo-200">Founded by Praveen Singh Rawat</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-pink-300">
          <Phone className="w-3.5 h-3.5" />
          <a href="tel:9582774387">Helpline: 9582774387</a>
        </div>
      </div>

      {/* Main Header / Logo */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">
            <span>F</span>
          </div>
          <div>
            <span className="text-2xl font-black text-[#1a2b6b] tracking-tight block leading-tight">
              Fuzion Academy
            </span>
            <span className="text-xs text-indigo-600 font-bold tracking-wider uppercase block">
              Online Learning ERP &amp; LMS
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-100 hover:border-indigo-300 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          &larr; Back to Academy Home
        </Link>
      </header>

      {/* Hero Welcome Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-extrabold text-indigo-700 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Multi-Portal Authentication Gateway</span>
        </div>

        <p className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-indigo-500">
          WELCOME TO
        </p>

        <h1 className="text-3xl sm:text-5xl font-black text-[#1a2b6b] tracking-tight font-serif">
          FUZION ACADEMY
        </h1>

        <p className="text-sm sm:text-base font-semibold text-gray-700">
          Institute of Spoken English and Soft Skills
        </p>

        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium">
          &ldquo;Your Journey Towards Confident English Starts Here.&rdquo; Select your authorized portal below to log in or create an account.
        </p>
      </div>

      {/* 4 Cards Grid - Modern, Responsive EdTech Design */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1: STUDENT PORTAL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <GraduationCap className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                Learners Track
              </span>

              <h2 className="text-lg font-black text-[#1a2b6b] mt-3 mb-2">
                STUDENT LOGIN
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed">
                Access your English learning dashboard, AI Speaking Lab, interactive games, quizzes, study materials and personal performance reports.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 space-y-2.5">
              <Link
                href="/auth/student/login"
                className="w-full py-2.5 px-4 bg-[#1a2b6b] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Student Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/auth/student/signup"
                className="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
              >
                Create Student Account
              </Link>
            </div>
          </div>

          {/* CARD 2: TEACHER PORTAL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 hover:border-purple-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                Faculty Portal
              </span>

              <h2 className="text-lg font-black text-[#1a2b6b] mt-3 mb-2">
                TEACHER LOGIN
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed">
                Manage your students, assign activities, evaluate performance, monitor speaking progress and access teaching resources.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 space-y-2.5">
              <Link
                href="/auth/teacher/login"
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Teacher Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/auth/teacher/signup"
                className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
              >
                Teacher Registration
              </Link>
              <p className="text-[10px] text-gray-400 text-center italic">
                *Requires admin invitation code
              </p>
            </div>
          </div>

          {/* CARD 3: ADMIN PORTAL (NO PUBLIC SIGNUP) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Administration
              </span>

              <h2 className="text-lg font-black text-[#1a2b6b] mt-3 mb-2">
                ADMIN LOGIN
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed">
                Manage students, teachers, parents, batches, games, quizzes, study materials, AI settings and complete academy operations.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 space-y-2.5">
              <Link
                href="/auth/admin/login"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Admin Login</span>
                <Lock className="w-3.5 h-3.5" />
              </Link>
              <div className="py-2 px-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-gray-500">
                  Authorized Administrators Only
                </span>
              </div>
            </div>
          </div>

          {/* CARD 4: PARENT PORTAL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <Users className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                Guardian Access
              </span>

              <h2 className="text-lg font-black text-[#1a2b6b] mt-3 mb-2">
                PARENT LOGIN
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed">
                Monitor your child&apos;s English learning journey, speaking performance, assignments, achievements, practice activities and progress reports.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 space-y-2.5">
              <Link
                href="/auth/parent/login"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>Parent Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/auth/parent/signup"
                className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
              >
                Create Parent Account
              </Link>
              <p className="text-[10px] text-gray-400 text-center italic">
                *Requires child&apos;s student code
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-indigo-100 py-6 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-extrabold text-[#1a2b6b]">
              Fuzion Academy English Hub &bull; Sector-11, Pratap Vihar, Ghaziabad
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Founder: Praveen Singh Rawat &bull; Spoken English, IELTS &amp; Confidence Building.
            </p>
          </div>
          <p className="text-[11px] text-gray-400">
            &copy; 2026 Fuzion Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
