/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'wouter';
import { Title } from '../../lib/types';
import { Play, Info } from 'lucide-react';

interface HeroBannerProps {
  title: Title;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ title }) => {
  const genreNames = title.genres?.map((g) => g.name).join(' · ');

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[620px] flex items-end overflow-hidden rounded-2xl bg-[#0d121c] border border-slate-800/80 shadow-2xl mb-12">
      {/* Background Image / Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={title.backdrop_url || title.poster_url || '/src/assets/images/hero_kdrama_cinematic_1792737531695.jpg'}
          alt={`${title.name} backdrop`}
          className="w-full h-full object-cover object-top opacity-60 scale-105 filter brightness-95"
        />
        {/* Measured dark gradient scrims ensuring WCAG AA legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14]/90 via-[#0b0e14]/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl p-6 sm:p-10 lg:p-14 space-y-4">
        {/* Original Korean Name Kicker */}
        {title.original_name && (
          <div className="text-sm font-medium tracking-wide text-rose-400">
            {title.original_name}
          </div>
        )}

        {/* Title Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight">
          {title.name}
        </h1>

        {/* Unboxed Metadata Line (No pills rule) */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
          <span className="font-semibold text-rose-300">
            {title.content_type === 'movie' ? 'Film Layar Lebar' : 'Serial Drama Korea'}
          </span>
          {title.release_year && (
            <>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="tabular-nums">{title.release_year}</span>
            </>
          )}
          {genreNames && (
            <>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>{genreNames}</span>
            </>
          )}
          {title.episodes_count !== undefined && title.episodes_count > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="tabular-nums">{title.episodes_count} Episode</span>
            </>
          )}
        </div>

        {/* Synopsis */}
        <p className="text-sm sm:text-base text-slate-300 line-clamp-3 max-w-2xl leading-relaxed">
          {title.synopsis}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href={`/title/${title.slug}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/50 hover:shadow-rose-900/40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Tonton Sekarang</span>
          </Link>

          <Link
            href={`/title/${title.slug}#episodes`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>Daftar Episode</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
