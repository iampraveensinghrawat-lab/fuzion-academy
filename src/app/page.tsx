'use client';

import React from 'react';
import Header from '@/components/Header';
import DashboardTab from '@/components/DashboardTab';
import GamesHubTab from '@/components/GamesHubTab';
import SpeakingCoachTab from '@/components/SpeakingCoachTab';
import MaterialsTab from '@/components/MaterialsTab';
import LeaderboardTab from '@/components/LeaderboardTab';
import ProfileCertificatesTab from '@/components/ProfileCertificatesTab';
import FacultyPortalTab from '@/components/FacultyPortalTab';
import GameModal from '@/components/GameModal';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Phone, MapPin, Heart } from 'lucide-react';

export default function Home() {
  const { activeTab, currentRole } = useAppStore();

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900 selection:bg-pink-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'games' && <GamesHubTab />}
        {activeTab === 'speaking' && <SpeakingCoachTab />}
        {activeTab === 'materials' && <MaterialsTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'profile' && <ProfileCertificatesTab />}
        {activeTab === 'faculty' && <FacultyPortalTab />}
      </main>

      {/* Global Modals */}
      <GameModal />
      <CertificateModal />

      {/* Footer matching exact layout from Screenshot 2026-11-04 004842.png */}
      <footer className="w-full bg-white border-t border-indigo-100 py-6 text-xs text-gray-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-extrabold text-[#1a2b6b] text-sm">
              Fuzion Academy English Hub (Sector-11, Pratap Vihar, Ghaziabad)
            </p>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Founder: Praveen Singh Rawat &bull; Spoken English, IELTS &amp; Confidence Building.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 font-bold text-indigo-700">
              <Phone className="w-3.5 h-3.5 text-pink-500" />
              <a href="tel:9582774387" className="hover:underline">
                Helpline: 9582774387
              </a>
            </div>
            <p className="text-[11px] text-gray-400">
              &copy; 2026 Fuzion Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
