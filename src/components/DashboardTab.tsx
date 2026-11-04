'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Flame,
  Award,
  Sparkles,
  Gamepad2,
  Mic,
  FileCheck,
  TrendingUp,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { GAMES_CATALOG } from '@/lib/gamesData';

export default function DashboardTab() {
  const {
    studentName,
    studentLevel,
    studentBatch,
    studentCefr,
    studentXp,
    studentStreak,
    studentAttendance,
    setActiveTab,
    openGame,
    homeworks,
    toggleHomework,
    speakingHistory,
  } = useAppStore();

  const featuredGames = GAMES_CATALOG.filter((g) => g.isPopular).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>English Fluency &amp; Soft Skills Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Continue your daily streak! Practice with AI Speaking Studio or test your tense reflexes in our 100+ Games Arcade.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="text-indigo-200">Current Level:</span>
                <span className="font-bold text-white">{studentCefr}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="text-indigo-200">Batch:</span>
                <span className="font-bold text-yellow-300">{studentBatch}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 min-w-[280px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-amber-400 mb-1">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-2xl font-black">{studentStreak} Days</div>
              <div className="text-[11px] text-indigo-200 uppercase font-semibold">Active Streak</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-pink-400 mb-1">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-pink-300">{studentXp} XP</div>
              <div className="text-[11px] text-indigo-200 uppercase font-semibold">Level {studentLevel} Rank</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-emerald-300">{studentAttendance}%</div>
              <div className="text-[11px] text-indigo-200 uppercase font-semibold">Class Attendance</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-blue-400 mb-1">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-blue-300">88/100</div>
              <div className="text-[11px] text-indigo-200 uppercase font-semibold">Latest Test</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Teacher Remark Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          FA
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-purple-900 uppercase tracking-wide">
              Faculty Feedback &bull; Praveen Sir
            </span>
            <span className="text-[11px] text-purple-600">Updated this week</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 mt-1 font-medium">
            &ldquo;Outstanding fluency and vocabulary usage during roleplay drills. Keep practicing the 60-Second Time Bomb and record your restaurant roleplay before next session.&rdquo;
          </p>
        </div>
      </div>

      {/* 3. Recommended Practice & Homework Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Games & Practice */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Recommended Practice Games
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('games')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore all 100+</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {game.category}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {game.cefrLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{game.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600">
                    +{game.xpReward} XP Reward
                  </span>
                  <button
                    onClick={() => openGame(game)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Speaking Trigger */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  Ready for today&apos;s AI Speaking Drill?
                </h3>
                <p className="text-xs text-indigo-200">
                  Record 2 minutes on &ldquo;Introduce yourself &amp; career goals&rdquo; and receive immediate fluency &amp; grammar metrics.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('speaking')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-bold text-xs shadow-lg whitespace-nowrap"
            >
              Start Recording
            </button>
          </div>
        </div>

        {/* Right 1 Col: Pending Homework & Study Materials */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Pending Tasks &amp; Homework
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm space-y-3">
            {homeworks.map((hw) => (
              <div
                key={hw.id}
                onClick={() => toggleHomework(hw.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  hw.completed
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-70'
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="mt-0.5">
                  {hw.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xs font-bold ${
                      hw.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {hw.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Due: {hw.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick PDF study activity shortcut */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
            <h3 className="font-bold text-xs text-indigo-900 mb-1">
              Class Study Materials (120+ PDFs)
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Practice sheets, discussion cards, and pronunciation guides available for offline study.
            </p>
            <button
              onClick={() => setActiveTab('materials')}
              className="w-full py-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Browse PDF Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
