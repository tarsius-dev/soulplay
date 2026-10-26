/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { catalogStore } from '../lib/catalog/store';
import { Title, Genre } from '../lib/types';
import { TitleCard } from '../components/catalog/TitleCard';
import { TitleGridSkeleton } from '../components/common/Skeleton';
import { updatePageMeta } from '../lib/seo/meta';
import { Search, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState<'all' | 'drama' | 'movie'>('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [results, setResults] = useState<Title[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    updatePageMeta({
      title: 'Pencarian Drama Korea & Film',
      description: 'Cari drama Korea, film layar lebar, aktor, dan kata kunci di seluruh katalog SeoulPlay.',
    });

    setGenres(catalogStore.getAllGenres());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setQuery(q);
    }
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (trimmed) {
        url.searchParams.set('q', trimmed);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
    }

    const matched = catalogStore.getPublicTitles({
      search: trimmed,
      contentType: contentType !== 'all' ? contentType : undefined,
      genreSlug: selectedGenre !== 'all' ? selectedGenre : undefined,
    });
    setResults(matched);
    setSearching(false);
  }, [query, contentType, selectedGenre]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Search Header and Bar */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Pencarian Katalog SeoulPlay
        </h1>

        {/* Input box */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul drama, nama Hangul (misal: 어둠), atau kata kunci sinopsis..."
            className="w-full pl-12 pr-12 py-3.5 bg-[#0f1422] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm shadow-inner transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Content Type Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#0d121c] rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setContentType('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                contentType === 'all'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setContentType('drama')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                contentType === 'drama'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Drama Saja
            </button>
            <button
              onClick={() => setContentType('movie')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                contentType === 'movie'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Film Saja
            </button>
          </div>

          {/* Genre Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Pilihan Genre:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-[#131a29] border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="all">Semua Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>
            {results.length} judul ditemukan
            {query.trim() ? ` untuk pencarian "${query}"` : ''}
          </span>
          {(query || contentType !== 'all' || selectedGenre !== 'all') && (
            <button
              onClick={() => {
                setQuery('');
                setContentType('all');
                setSelectedGenre('all');
              }}
              className="text-rose-400 hover:underline"
            >
              Reset semua filter
            </button>
          )}
        </div>

        {searching ? (
          <TitleGridSkeleton count={5} />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {results.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-xl bg-[#0e131f] border border-slate-800 p-6">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Judul Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada judul yang sesuai dengan pencarian Anda. Coba gunakan kata kunci seperti "Chaebol", "Shadows", atau "Jeju".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
