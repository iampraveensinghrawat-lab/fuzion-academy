'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Sparkles } from 'lucide-react';

interface AuthCardLayoutProps {
  role: 'student' | 'teacher' | 'admin' | 'parent';
  portalTitle: string;
  portalSubtitle: string;
  heroHeadline: string;
  heroDescription: string;
  badgeText: string;
  children: React.ReactNode;
}

export default function AuthCardLayout({
  role,
  portalTitle,
  portalSubtitle,
  heroHeadline,
  heroDescription,
  badgeText,
  children,
}: AuthCardLayoutProps) {
  const roleStyles = {
    student: {
      gradient: 'from-[#1a2b6b] via-indigo-900 to-purple-950',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      accentColor: 'text-indigo-600',
    },
    teacher: {
      gradient: 'from-purple-950 via-indigo-950 to-slate-950',
      badgeBg: 'bg-purple-100 text-purple-800',
      accentColor: 'text-purple-600',
    },
    admin: {
      gradient: 'from-slate-950 via-indigo-950 to-black',
      badgeBg: 'bg-slate-200 text-slate-900',
      accentColor: 'text-slate-800',
    },
    parent: {
      gradient: 'from-emerald-950 via-teal-950 to-slate-950',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      accentColor: 'text-emerald-600',
    },
  };

  const style = roleStyles[role];

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900">
      {/* Top Header */}
      <div className="bg-white border-b border-indigo-100 py-3 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/auth" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 flex items-center justify-center text-white font-black text-lg">
            F
          </div>
          <span className="text-xl font-black text-[#1a2b6b] tracking-tight">
            Fuzion Academy
          </span>
        </Link>

        <Link
          href="/auth"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Switch User Portal</span>
        </Link>
      </div>

      {/* Main Container: Two Columns on Desktop */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Role-Themed Brand Showcase (5 cols) */}
          <div
            className={`lg:col-span-5 bg-gradient-to-br ${style.gradient} p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden`}
          >
            <div className="relative z-10 space-y-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.badgeBg}`}
              >
                {badgeText}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {heroHeadline}
              </h2>

              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                {heroDescription}
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 space-y-2 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Sector-11, Pratap Vihar, Ghaziabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Helpline: 9582774387 &bull; Praveen Sir</span>
              </div>
            </div>

            {/* Subtle decorative glow */}
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Column: Interactive Form Container (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a2b6b] tracking-tight">
                  {portalTitle}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {portalSubtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
