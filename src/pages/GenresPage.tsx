/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { catalogStore } from '../lib/catalog/store';
import { TitleCard } from '../components/catalog/TitleCard';
import { GlobalSkeletonLoader } from '../components/common/Skeleton';
import { updatePageMeta } from '../lib/seo/meta';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const GenresPage: React.FC = () => {
  const [, params] = useRoute('/genres/:slug');
  const slug = params?.slug || 'romance';

  const [loading, setLoading] = React.useState(true);
  const [genres, setGenres] = React.useState<any[]>([]);
  const [titles, setTitles] = React.useState<any[]>([]);
  const [currentGenre, setCurrentGenre] = React.useState<any>(null);

  React.useEffect(() => {
    const allGenres = catalogStore.getAllGenres();
    const active = allGenres.find((g) => g.slug === slug) || allGenres[0];
    const results = catalogStore.getPublicTitles({ genreSlug: slug });
    
    setGenres(allGenres);
    setCurrentGenre(active);
    setTitles(results);
    setLoading(false);

    if (active) {
      updatePageMeta({
        title: `Drama Korea & Film Genre ${active.name}`,
        description: `Jelajahi rekomendasi drama Korea dan film terbaik dalam genre ${active.name} dengan panduan episode terverifikasi.`,
      });
    }
  }, [slug]);

  if (loading) {
    return <GlobalSkeletonLoader variant="catalog" count={8} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2 text-rose-500 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">Sorotan Genre</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          {currentGenre?.name || 'Genre'}
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl">
          Temukan drama Korea dan karya sinema terbaik dalam kategori {currentGenre?.name}.
        </p>
      </div>

      {/* Genre Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {genres.map((g) => (
          <Link
            key={g.id}
            href={`/genres/${g.slug}`}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              g.slug === slug
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      {/* Titles Grid */}
      {titles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {titles.map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-xl bg-[#0f1422] border border-slate-800">
          <p className="text-slate-400 text-sm">
            Belum ada judul yang diterbitkan dalam kategori {currentGenre?.name}.
          </p>
          <Link href="/dramas" className="mt-3 inline-block text-xs text-rose-400 hover:underline">
            Lihat semua drama Korea
          </Link>
        </div>
      )}
    </div>
  );
};
