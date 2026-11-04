'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import FacultyPortalTab from '@/components/FacultyPortalTab';
import MaterialsTab from '@/components/MaterialsTab';
import GamesHubTab from '@/components/GamesHubTab';
import GameModal from '@/components/GameModal';
import { useAppStore } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';
import { LogOut, Phone, ShieldCheck, BookOpen, Users } from 'lucide-react';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useAppStore();
  const { currentUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900 selection:bg-purple-500 selection:text-white">
      {/* Auth Banner & Logout Bar */}
      <div className="bg-purple-950 text-white py-2 px-4 sm:px-8 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Faculty Portal &bull; Logged in as: {currentUser?.name || 'Praveen Singh Rawat'}</span>
          <span className="text-purple-300 hidden sm:inline">&bull; Senior IELTS &amp; Spoken English Trainer</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-rose-600 transition-colors text-white text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Global LMS Header in Teacher Mode */}
      <Header />

      {/* Main Teacher Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'materials' ? (
          <MaterialsTab />
        ) : activeTab === 'games' ? (
          <GamesHubTab />
        ) : (
          <FacultyPortalTab />
        )}
      </main>

      {/* Sandboxed Game Modal for browsing games */}
      <GameModal />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-indigo-100 py-6 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-extrabold text-[#1a2b6b]">
              Fuzion Academy English Hub &bull; Sector-11, Pratap Vihar, Ghaziabad
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Faculty Control Console &bull; Confidential Student Academic Records
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-indigo-700">
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <a href="tel:9582774387">Helpline: 9582774387</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
