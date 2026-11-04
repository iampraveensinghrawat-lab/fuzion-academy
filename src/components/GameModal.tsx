'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Trophy, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';

export default function GameModal() {
  const { activePlayingGame, closeGame, addXp } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (!activePlayingGame) return null;

  const handleClaim = () => {
    addXp(activePlayingGame.xpReward);
    setClaimed(true);
    setTimeout(() => {
      setClaimed(false);
      closeGame();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 animate-fade-in">
      <div
        className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="bg-[#1a2b6b] text-white px-4 py-3 flex items-center justify-between border-b border-indigo-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-pink-400 font-bold">
              🎮
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {activePlayingGame.title}
              </h3>
              <p className="text-[11px] text-indigo-200">
                Play actively to reinforce fluency and vocabulary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Claim XP Button */}
            <button
              onClick={handleClaim}
              disabled={claimed}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                claimed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md'
              }`}
            >
              {claimed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>+{activePlayingGame.xpReward} XP Claimed!</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Finish &amp; Claim +{activePlayingGame.xpReward} XP</span>
                </>
              )}
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={closeGame}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
              title="Close Game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandboxed Game Iframe */}
        <div className="flex-1 w-full bg-slate-900 relative">
          <iframe
            src={activePlayingGame.filePath}
            title={activePlayingGame.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
