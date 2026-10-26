/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'wouter';
import { Title } from '../../lib/types';
import { Film, Play, Star } from 'lucide-react';
import { ratingStore } from '../../lib/rating/store';

interface TitleCardProps {
  title: Title;
  priority?: boolean;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, priority = false }) => {
  const [imageError, setImageError] = useState(false);

  const primaryGenre = title.genres && title.genres.length > 0 ? title.genres[0].name : null;
  const isMovie = title.content_type === 'movie';

  return (
    <Link
      href={`/title/${title.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl"
    >
      <div className="flex flex-col">
        {/* 3:4 Poster Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#141b29] border border-slate-800/80 shadow-md group-hover:shadow-rose-950/30 group-hover:border-slate-700 transition-all duration-300">
          {title.poster_url && !imageError ? (
            <img
              src={title.poster_url}
              alt={`${title.name} poster`}
              loading={priority ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#151c2c] to-[#0c101a] text-slate-500">
              <Film className="w-8 h-8 mb-2 text-rose-500/40" />
              <span className="text-xs font-medium text-slate-400 line-clamp-2">{title.name}</span>
            </div>
          )}

          {/* Star Rating Badge on Card */}
          {(() => {
            const rating = ratingStore.getSummary(title.id);
            if (rating.totalRatings <= 0) return null;
            return (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-slate-700/60 flex items-center gap-1 text-[11px] font-semibold text-amber-300 shadow-sm z-10">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rating.averageScore.toFixed(1)}</span>
              </div>
            );
          })()}

          {/* Hover overlay with quick play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Card Details (Zero-Pill rule: clean unboxed text with typographic separators) */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{isMovie ? 'Film' : 'Drakor'}</span>
            {title.release_year && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="tabular-nums">{title.release_year}</span>
              </>
            )}
            {primaryGenre && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{primaryGenre}</span>
              </>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-1">
            {title.name}
          </h3>

          {title.original_name && (
            <p className="text-xs text-slate-500 font-light truncate">
              {title.original_name}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
