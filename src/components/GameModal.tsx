'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Trophy, Maximize2, Minimize2, CheckCircle2, Loader2 } from 'lucide-react';

export default function GameModal() {
  const { activePlayingGame, closeGame, addXp } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [htmlDoc, setHtmlDoc] = useState<string | null>(null);
  const [loadingGame, setLoadingGame] = useState<boolean>(false);

  useEffect(() => {
    if (!activePlayingGame) {
      setHtmlDoc(null);
      return;
    }

    const path = activePlayingGame.filePath;

    // 1. If it's a Data URL, decode it directly for srcDoc
    if (path.startsWith('data:text/html')) {
      try {
        if (path.includes('base64,')) {
          const b64 = path.split('base64,')[1];
          const decoded = atob(b64);
          setHtmlDoc(decoded);
          return;
        } else {
          const raw = decodeURIComponent(path.split(',')[1] || '');
          setHtmlDoc(raw);
          return;
        }
      } catch (e) {
        console.warn('Data URL decode notice:', e);
      }
    }

    // 2. If it's a Supabase Cloud Storage or Remote URL, fetch HTML to guarantee execution via srcDoc
    if (path.startsWith('http')) {
      setLoadingGame(true);
      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((text) => {
          if (
            text.includes('<html') ||
            text.includes('<!DOCTYPE') ||
            text.includes('<body') ||
            text.includes('<script') ||
            text.includes('<div') ||
            text.includes('<canvas')
          ) {
            setHtmlDoc(text);
          } else {
            // Fallback: proxy via game-runner API
            setHtmlDoc(null);
          }
        })
        .catch((err) => {
          console.warn('Failed to load raw HTML, falling back to game-runner API:', err);
          setHtmlDoc(null);
        })
        .finally(() => setLoadingGame(false));
    } else {
      // Local bundled game in /games/*.html
      setHtmlDoc(null);
    }
  }, [activePlayingGame]);

  if (!activePlayingGame) return null;

  const handleClaim = () => {
    addXp(activePlayingGame.xpReward);
    setClaimed(true);
    setTimeout(() => {
      setClaimed(false);
      closeGame();
    }, 1200);
  };

  const getEffectiveSrc = () => {
    if (htmlDoc) return undefined;
    const path = activePlayingGame.filePath;
    if (path.startsWith('http')) {
      return `/api/game-runner?url=${encodeURIComponent(path)}`;
    }
    return path;
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
          {loadingGame && !htmlDoc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-10 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-xs font-semibold text-indigo-200">
                Initializing interactive game engine...
              </p>
            </div>
          )}

          <iframe
            key={activePlayingGame.id + (htmlDoc ? '-doc' : '-src')}
            srcDoc={htmlDoc || undefined}
            src={getEffectiveSrc()}
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
