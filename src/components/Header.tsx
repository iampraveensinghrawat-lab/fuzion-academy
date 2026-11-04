'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore, UserRole } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';
import {
  MapPin,
  Phone,
  Moon,
  Bell,
  LayoutDashboard,
  Gamepad2,
  Mic,
  BarChart3,
  UserCheck,
  FileText,
  ShieldCheck,
  LogIn,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function Header() {
  const {
    currentRole,
    setRole,
    activeTab,
    setActiveTab,
    studentName,
    studentLevel,
    studentBatch,
  } = useAppStore();
  const { currentUser, logout } = useAuthStore();

  const portalUrl = currentUser
    ? currentUser.role === 'admin'
      ? '/admin/dashboard'
      : currentUser.role === 'teacher'
      ? '/teacher/dashboard'
      : currentUser.role === 'parent'
      ? '/parent/dashboard'
      : '/student/dashboard'
    : '/auth';

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-sm border-b border-indigo-100">
      {/* 1. Top Announcement Bar (Exact match to design screenshot) */}
      <div className="gradient-topbar text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 font-medium">
        <div className="flex items-center gap-2 tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>Sector-11, Pratap Vihar, Ghaziabad</span>
          <span className="opacity-50">|</span>
          <span className="text-indigo-200">
            Founded by Praveen Singh Rawat — Spoken English, IELTS &amp; Soft Skills
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="hidden md:inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full transition-colors text-pink-200"
          >
            <span>Multi-Portal ERP: Student | Faculty | Admin | Parent</span>
          </Link>
          <div className="flex items-center gap-1.5 hover:text-pink-300 transition-colors">
            <Phone className="w-3.5 h-3.5 text-pink-400" />
            <a href="tel:9582774387" className="font-semibold">
              Helpline: 9582774387
            </a>
          </div>
          <button
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-indigo-200"
            title="Toggle Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Branding & Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white font-bold text-xl">
            <span>F</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-[#1a2b6b] tracking-tight">
                Fuzion Academy
              </span>
            </div>
            <p className="text-xs text-indigo-600 font-medium tracking-wide">
              English Learning Hub &amp; LMS
            </p>
          </div>
        </div>

        {/* Role Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Portals Portal Button */}
          <Link
            href="/auth"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Portals Hub</span>
          </Link>

          {/* User Widget / Auth State */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-indigo-100">
              <Link href={portalUrl} className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'FA'}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {currentUser.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </Link>
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative ml-1">
            <button className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar Tabs (Matching exact design screenshot) */}
      <div className="bg-[#f8f9ff] border-t border-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {currentRole === 'student' || currentRole === 'parent' ? (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'games'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>100+ Games Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('speaking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'speaking'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>AI Speaking Coach</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Study Materials (120+ PDFs)</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Performance &amp; Leaderboard</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Profile &amp; Certificates</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Fuzion Academy Faculty Portal</span>
              </button>

              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'games'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Browse Games Library</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Materials Management</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
