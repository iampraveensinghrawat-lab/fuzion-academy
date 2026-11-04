'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  GAMES_CATALOG,
  GAME_CATEGORIES,
  GameItem,
} from '@/lib/gamesData';
import { Search, ListChecks, Play, Sparkles } from 'lucide-react';

export default function GamesHubTab() {
  const { openGame } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories (100+)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredGames = GAMES_CATALOG.filter((game) => {
    const matchesCategory =
      selectedCategory === 'All Categories (100+)' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {game.category}
                </span>
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

            {/* Play & Earn XP Button */}
            <div className="mt-5">
              <button
                onClick={() => openGame(game)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play &amp; Earn XP</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-indigo-100">
          <p className="text-gray-500 text-sm">No games found matching your search.</p>
        </div>
      )}
    </div>
  );
}
