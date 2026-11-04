'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Trophy,
  Medal,
  TrendingUp,
  Sparkles,
  BarChart2,
  Flame,
  Award,
  CheckCircle,
} from 'lucide-react';

export default function LeaderboardTab() {
  const { students, studentName } = useAppStore();

  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1a2b6b] tracking-tight">
              Academy Performance &amp; Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time rankings calculated from game scores, speaking studio drills, and homework completion.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200 text-xs font-bold text-indigo-700">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Weekly Reset: Every Sunday midnight</span>
        </div>
      </div>

      {/* 2. Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sortedStudents.slice(0, 3).map((std, idx) => {
          const rankColors = [
            'from-yellow-400 to-amber-600 text-yellow-950 border-amber-300',
            'from-slate-200 to-slate-400 text-slate-900 border-slate-300',
            'from-amber-600 to-amber-800 text-amber-100 border-amber-700',
          ];
          const rankBadges = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];

          return (
            <div
              key={std.id}
              className={`p-6 rounded-3xl bg-white border-2 shadow-sm flex flex-col items-center text-center relative overflow-hidden ${
                std.name === studentName ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-indigo-100'
              }`}
            >
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-gradient-to-r text-white mb-3 shadow-sm bg-indigo-600">
                {rankBadges[idx]}
              </span>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-md my-2">
                {std.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mt-1">{std.name}</h3>
              <p className="text-xs text-gray-500">{std.batch}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-around">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Total XP</span>
                  <span className="text-lg font-black text-indigo-600">{std.xp} XP</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Test Mark</span>
                  <span className="text-lg font-black text-emerald-600">{std.testMarks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-sm sm:text-base text-gray-900">
            Academy-Wide Student Standings
          </h2>
          <span className="text-xs text-gray-500">{sortedStudents.length} Students Enrolled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-5">Rank</th>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">Batch</th>
                <th className="py-3 px-5">Attendance</th>
                <th className="py-3 px-5">Test Marks</th>
                <th className="py-3 px-5">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {sortedStudents.map((std, index) => {
                const isCurrent = std.name === studentName;
                return (
                  <tr
                    key={std.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-indigo-50/70 font-bold' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-black text-gray-700">#{index + 1}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {std.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-gray-900 block">{std.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-indigo-600 font-bold">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {std.batch}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-emerald-600 font-bold">{std.attendance}%</span>
                    </td>
                    <td className="py-3.5 px-5 text-gray-700 font-semibold">{std.testMarks}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-indigo-600 font-black">{std.xp} XP</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
