'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import {
  GAMES_CATALOG,
  GAME_CATEGORIES,
  GameItem,
} from '@/lib/gamesData';
import { Search, ListChecks, Play, Sparkles, Trash2, RefreshCw, Loader2, X, Upload } from 'lucide-react';

export default function GamesHubTab() {
  const { openGame, customGames, addGame, deleteGame, updateGame, deletedGameIds, currentRole } = useAppStore();
  const [cloudGames, setCloudGames] = useState<GameItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories (100+)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Replace Activity Modal State
  const [replacingGame, setReplacingGame] = useState<GameItem | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceTitle, setReplaceTitle] = useState('');
  const [replaceCategory, setReplaceCategory] = useState<any>('Speaking');
  const [replaceCefrLevel, setReplaceCefrLevel] = useState<any>('B1 Intermediate');
  const [replaceXpReward, setReplaceXpReward] = useState<number>(50);
  const [replaceQuestionsCount, setReplaceQuestionsCount] = useState<number>(50);
  const [replaceDescription, setReplaceDescription] = useState('');
  const [replaceUploading, setReplaceUploading] = useState(false);
  const [replaceError, setReplaceError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live games from Supabase cloud database across all devices
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data.games && Array.isArray(data.games)) {
          setCloudGames(data.games);
        }
      })
      .catch((err) => console.warn('Cloud games fetch notice:', err));
  }, []);

  // Merge: Cloud games take precedence, then local custom games, then pre-bundled catalog
  const mergedCustom = [...cloudGames, ...(customGames || [])];
  const uniqueCustom = Array.from(new Map(mergedCustom.map((g) => [g.id, g])).values());
  const customIds = new Set(uniqueCustom.map((g) => g.id));
  const allGames = [
    ...uniqueCustom,
    ...GAMES_CATALOG.filter((g) => !customIds.has(g.id)),
  ].filter((g) => !(deletedGameIds || []).includes(g.id));

  const filteredGames = allGames.filter((game) => {
    const matchesCategory =
      selectedCategory === 'All Categories (100+)' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openReplaceModal = (game: GameItem) => {
    setReplacingGame(game);
    setReplaceTitle(game.title);
    setReplaceCategory(game.category);
    setReplaceCefrLevel(game.cefrLevel);
    setReplaceXpReward(game.xpReward);
    setReplaceQuestionsCount(game.questionsCount);
    setReplaceDescription(game.description || '');
    setReplaceFile(null);
    setReplaceError('');
  };

  const handleDeleteGame = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the games catalog?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await fetch(`/api/games?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err: any) {
      console.warn('Delete game API notice:', err);
    } finally {
      deleteGame(id);
      setCloudGames((prev) => prev.filter((g) => g.id !== id));
      setDeletingId(null);
    }
  };

  const handleModalReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingGame) return;

    setReplaceUploading(true);
    setReplaceError('');

    try {
      let publicUrl = replacingGame.filePath;

      // If a new HTML file is provided, upload directly to Supabase storage
      if (replaceFile && supabase) {
        const timestamp = Date.now();
        const cleanName = replaceFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${timestamp}_${cleanName}`;

        const { error: uploadErr } = await supabase.storage
          .from('games')
          .upload(storagePath, replaceFile, {
            contentType: 'text/html',
            upsert: true,
          });

        if (uploadErr) {
          throw new Error(`Cloud storage upload failed: ${uploadErr.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('games')
          .getPublicUrl(storagePath);

        publicUrl = urlData.publicUrl;
      }

      const updatedPayload = {
        id: replacingGame.id,
        title: replaceTitle.trim() || replacingGame.title,
        category: replaceCategory,
        cefrLevel: replaceCefrLevel,
        description: replaceDescription.trim(),
        questionsCount: replaceQuestionsCount,
        xpReward: replaceXpReward,
        fileUrl: publicUrl,
      };

      await fetch('/api/games', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      const updatedGame: GameItem = {
        id: replacingGame.id,
        title: replaceTitle.trim() || replacingGame.title,
        category: replaceCategory,
        cefrLevel: replaceCefrLevel,
        description: replaceDescription.trim(),
        questionsCount: replaceQuestionsCount,
        xpReward: replaceXpReward,
        filePath: publicUrl,
        isCustom: true,
        isPopular: true,
      };

      updateGame(replacingGame.id, updatedGame);
      setCloudGames((prev) => {
        const exists = prev.some((g) => g.id === replacingGame.id);
        if (exists) {
          return prev.map((g) => (g.id === replacingGame.id ? updatedGame : g));
        }
        return [updatedGame, ...prev];
      });

      setReplacingGame(null);
    } catch (err: any) {
      setReplaceError(err.message || 'Failed to replace activity');
    } finally {
      setReplaceUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Filters Card (Exact layout from design screenshot) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#1a2b6b] tracking-tight">
                100+ Fuzion Academy English Games Hub
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-black uppercase">
                Interactive
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Every game features 50 unique non-repeating questions, instant feedback, scoring, timer, and XP rewards.
            </p>
          </div>

          {/* Controls: Dropdown & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-white text-xs font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {GAME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search game by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 text-xs font-medium placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid of Game Cards (Exact layout from Screenshot 2026-11-04 004812.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl p-5 border-2 border-indigo-100/90 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Top Row: Category pill & CEFR level */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {game.category}
                  </span>
                  {(game as any).isCustom && (
                    <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Faculty Game
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-gray-400">
                  {game.cefrLevel}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-base text-[#1a2b6b] group-hover:text-indigo-600 transition-colors line-clamp-1">
                {game.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                {game.description}
              </p>

              {/* 50 Unique Questions indicator */}
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 font-semibold mt-4">
                <ListChecks className="w-3.5 h-3.5" />
                <span>{game.questionsCount} Unique Questions</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openGame(game)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play &amp; Earn XP</span>
                </button>

                {(currentRole === 'teacher' || currentRole === 'admin') && (
                  <>
                    <button
                      onClick={() => openReplaceModal(game)}
                      className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Replace with another HTML game or update details"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Replace</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id, game.title)}
                      disabled={deletingId === game.id}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      title="Remove this game activity"
                    >
                      {deletingId === game.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-indigo-100">
          <p className="text-gray-500 text-sm">No games found matching your search.</p>
        </div>
      )}

      {/* Replace Activity Modal */}
      {replacingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Replace Activity / Game
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload a replacement .html game file or edit activity configuration.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplacingGame(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalReplace} className="space-y-4">
              {/* Optional Replacement HTML File */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Replacement .html Game File (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-2xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setReplaceFile(file);
                    }}
                    className="hidden"
                    id="replace-game-input"
                  />
                  <label htmlFor="replace-game-input" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-gray-800 block">
                      {replaceFile ? replaceFile.name : 'Click to select new replacement .html game'}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {replaceFile
                        ? `${(replaceFile.size / 1024).toFixed(1)} KB selected`
                        : 'Leave blank to keep existing game file and only update title/level/XP'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={replaceTitle}
                  onChange={(e) => setReplaceTitle(e.target.value)}
                  placeholder="e.g. Master Vocabulary Challenge"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Category & CEFR Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={replaceCategory}
                    onChange={(e) => setReplaceCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Grammar">Grammar</option>
                    <option value="Vocab">Vocab</option>
                    <option value="Idioms">Idioms</option>
                    <option value="Business">Business</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Translation">Translation</option>
                    <option value="IELTS">IELTS</option>
                    <option value="Fluency">Fluency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CEFR Level</label>
                  <select
                    value={replaceCefrLevel}
                    onChange={(e) => setReplaceCefrLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="A1 Beginner">A1 Beginner</option>
                    <option value="A2 Elementary">A2 Elementary</option>
                    <option value="B1 Intermediate">B1 Intermediate</option>
                    <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                    <option value="C1 Advanced">C1 Advanced</option>
                  </select>
                </div>
              </div>

              {/* XP Reward & Questions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={replaceXpReward}
                    onChange={(e) => setReplaceXpReward(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Questions Count</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={replaceQuestionsCount}
                    onChange={(e) => setReplaceQuestionsCount(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={replaceDescription}
                  onChange={(e) => setReplaceDescription(e.target.value)}
                  placeholder="Overview of learning objectives and gameplay..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {replaceError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {replaceError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplacingGame(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replaceUploading}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 ${
                    replaceUploading
                      ? 'bg-amber-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {replaceUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Save &amp; Replace Activity</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
