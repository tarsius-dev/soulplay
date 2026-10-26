/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { catalogStore } from '../lib/catalog/store';
import { Title, Genre } from '../lib/types';
import { TitleCard } from '../components/catalog/TitleCard';
import { GlobalSkeletonLoader } from '../components/common/Skeleton';
import { updatePageMeta } from '../lib/seo/meta';
import { Tv, Filter } from 'lucide-react';

export const DramasPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [dramas, setDramas] = useState<Title[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageMeta({
      title: 'Koleksi Drama Korea (Drakor)',
      description: 'Jelajahi katalog lengkap drama Korea mulai dari romantis, sageuk, misteri, hingga melodrama.',
    });
    setGenres(catalogStore.getAllGenres());
  }, []);

  useEffect(() => {
    const results = catalogStore.getPublicTitles({
      contentType: 'drama',
      genreSlug: selectedGenre,
      sort: sortBy,
    });
    setDramas(results);
    setLoading(false);
  }, [selectedGenre, sortBy]);

  if (loading) {
    return <GlobalSkeletonLoader variant="catalog" count={10} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <Tv className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">Katalog Serial</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Drama Korea (Drakor)
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Nikmati serial drama Korea romantis, misteri penuh intrik, dan kisah sejarah megah dengan panduan episode lengkap.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d121c] p-4 rounded-xl border border-slate-800">
        {/* Genre Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedGenre === 'all'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Semua Genre
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.slug)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedGenre === g.slug
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#131a29] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-rose-500"
          >
            <option value="newest">Terbaru Ditambahkan</option>
            <option value="year">Tahun Rilis</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {dramas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {dramas.map((drama) => (
            <TitleCard key={drama.id} title={drama} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-xl bg-[#0f1420] border border-slate-800">
          <p className="text-slate-400 text-sm">Tidak ada drama yang cocok dengan filter yang dipilih.</p>
          <button
            onClick={() => setSelectedGenre('all')}
            className="mt-3 text-xs text-rose-400 hover:underline"
          >
            Bersihkan filter genre
          </button>
        </div>
      )}
    </div>
  );
};
