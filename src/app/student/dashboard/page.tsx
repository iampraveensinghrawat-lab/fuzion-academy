'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import DashboardTab from '@/components/DashboardTab';
import GamesHubTab from '@/components/GamesHubTab';
import SpeakingCoachTab from '@/components/SpeakingCoachTab';
import MaterialsTab from '@/components/MaterialsTab';
import LeaderboardTab from '@/components/LeaderboardTab';
import ProfileCertificatesTab from '@/components/ProfileCertificatesTab';
import GameModal from '@/components/GameModal';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';
import { LogOut, Phone } from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useAppStore();
  const { currentUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900 selection:bg-pink-500 selection:text-white">
      {/* Auth Banner & Logout Bar */}
      <div className="bg-[#1a2b6b] text-white py-1.5 px-4 sm:px-8 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Student Portal Active &bull; Logged in as: {currentUser?.name || 'Rahul Sharma'}</span>
          <span className="opacity-60 hidden sm:inline">({currentUser?.studentCode || 'FA-STU-101'})</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-600 transition-colors text-white text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Global LMS Header */}
      <Header />

      {/* Main Student Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'games' && <GamesHubTab />}
        {activeTab === 'speaking' && <SpeakingCoachTab />}
        {activeTab === 'materials' && <MaterialsTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'profile' && <ProfileCertificatesTab />}
      </main>

      {/* Global Sandboxed Modals */}
      <GameModal />
      <CertificateModal />

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
          <div className="flex items-center gap-1.5 font-bold text-indigo-700">
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <a href="tel:9582774387">Helpline: 9582774387</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
