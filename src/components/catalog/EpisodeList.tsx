/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'wouter';
import { Season, Episode } from '../../lib/types';
import { Play, Clock } from 'lucide-react';

interface EpisodeListProps {
  titleSlug: string;
  seasons: (Season & { episodes: Episode[] })[];
  isMovie?: boolean;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  titleSlug,
  seasons,
  isMovie = false,
}) => {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  if (!seasons || seasons.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0e131e] p-8 text-center text-slate-400">
        Belum ada episode yang terdaftar untuk judul ini.
      </div>
    );
  }

  const currentSeason = seasons[selectedSeasonIndex] || seasons[0];
  const episodes = currentSeason.episodes || [];

  return (
    <div id="episodes" className="space-y-6">
      {/* Season Selector Tabs */}
      {!isMovie && seasons.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {seasons.map((season, idx) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeasonIndex(idx)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedSeasonIndex === idx
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {season.name || `Musim ${season.season_number}`}
            </button>
          ))}
        </div>
      )}

      {/* Episode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="group relative rounded-xl border border-slate-800/80 bg-[#0f1422] p-5 hover:border-slate-700 hover:bg-[#121828] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 text-xs text-slate-400 mb-2">
                <span className="font-semibold text-rose-400">
                  {isMovie ? 'Tayangan Lengkap' : `Episode ${ep.episode_number}`}
                </span>
                {ep.duration_minutes && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{ep.duration_minutes} menit</span>
                  </div>
                )}
              </div>

              <h4 className="text-base font-semibold text-white group-hover:text-rose-400 transition-colors mb-2">
                {ep.name}
              </h4>

              {ep.synopsis && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {ep.synopsis}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Link
                href={`/title/${titleSlug}/watch/${ep.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 group-hover:bg-rose-600 group-hover:border-rose-600 group-hover:text-white transition-all w-full justify-center"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isMovie ? 'Tonton Film Lengkap' : 'Tonton Episode'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
