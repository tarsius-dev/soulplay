/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { catalogStore } from '../lib/catalog/store';
import { Title, Genre } from '../lib/types';
import { HeroBanner } from '../components/catalog/HeroBanner';
import { TitleCard } from '../components/catalog/TitleCard';
import { HeaderAd, ContentAd, FooterAd } from '../components/ads/AdSlot';
import { GlobalSkeletonLoader } from '../components/common/Skeleton';
import { updatePageMeta } from '../lib/seo/meta';
import { ArrowRight, Sparkles, TrendingUp, Film, Tv } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredTitles, setFeaturedTitles] = useState<Title[]>([]);
  const [trendingTitles, setTrendingTitles] = useState<Title[]>([]);
  const [dramaTitles, setDramaTitles] = useState<Title[]>([]);
  const [movieTitles, setMovieTitles] = useState<Title[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageMeta({
      title: 'Beranda',
      description: 'Temukan dan streaming drama Korea serta film terbaru gratis dengan panduan episode lengkap, sinopsis terkurasi, dan pemutar resmi terverifikasi.',
    });

    const feat = catalogStore.getFeaturedTitles();
    setFeaturedTitles(feat);

    const all = catalogStore.getPublicTitles();
    setTrendingTitles(all.slice(0, 4));
    setDramaTitles(all.filter((t) => t.content_type === 'drama'));
    setMovieTitles(all.filter((t) => t.content_type === 'movie'));
    setGenres(catalogStore.getAllGenres());
    setLoading(false);
  }, []);

  if (loading) {
    return <GlobalSkeletonLoader variant="home" />;
  }

  const heroTitle = featuredTitles[0] || trendingTitles[0];

  return (
    <div className="space-y-12">
      {/* Header Ad Slot (Disabled by default) */}
      <HeaderAd />

      {/* Cinematic Hero */}
      {heroTitle && <HeroBanner title={heroTitle} />}

      {/* Trending Titles Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Sedang Tren Minggu Ini
            </h2>
          </div>
          <Link
            href="/dramas"
            className="text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {trendingTitles.map((title, idx) => (
            <TitleCard key={title.id} title={title} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* Content Ad (Disabled by default) */}
      <ContentAd />

      {/* Recently Added Korean Dramas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Drama Korea Populer
            </h2>
          </div>
          <Link
            href="/dramas"
            className="text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
          >
            <span>Jelajahi Drakor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {dramaTitles.slice(0, 4).map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      </section>

      {/* Korean Movies Section */}
      {movieTitles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Film Layar Lebar Korea
              </h2>
            </div>
            <Link
              href="/movies"
              className="text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
            >
              <span>Jelajahi Film</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {movieTitles.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>
        </section>
      )}

      {/* Genre Collections */}
      <section className="space-y-4 pt-6 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Pilihan Genre Favorit
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.slug}`}
              className="p-4 rounded-xl bg-[#0f1420] border border-slate-800 hover:border-rose-500/50 hover:bg-[#131a2b] transition-all group flex flex-col justify-between"
            >
              <span className="text-sm font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                {genre.name}
              </span>
              <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                Buka koleksi <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Ad Slot (Disabled by default) */}
      <FooterAd />
    </div>
  );
};
