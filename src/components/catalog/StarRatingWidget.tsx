/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ratingStore, TitleRatingSummary } from '../../lib/rating/store';
import { Star, CheckCircle, RotateCcw, ThumbsUp } from 'lucide-react';

interface StarRatingWidgetProps {
  titleId: string;
  titleName: string;
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Kurang Menarik',
  2: 'Cukup',
  3: 'Menghibur',
  4: 'Sangat Bagus',
  5: 'Mahakarya Luar Biasa!',
};

export const StarRatingWidget: React.FC<StarRatingWidgetProps> = ({ titleId, titleName }) => {
  const [summary, setSummary] = useState<TitleRatingSummary>(() => ratingStore.getSummary(titleId));
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    // Sync current title rating
    setSummary(ratingStore.getSummary(titleId));
    setHoverScore(null);
    setJustRated(false);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ titleId: string }>;
      if (customEvent.detail?.titleId === titleId) {
        setSummary(ratingStore.getSummary(titleId));
      }
    };

    window.addEventListener('seoulplay:rating_updated', handleUpdate);
    return () => {
      window.removeEventListener('seoulplay:rating_updated', handleUpdate);
    };
  }, [titleId]);

  const handleRate = (score: number) => {
    const updated = ratingStore.rateTitle(titleId, score);
    setSummary(updated);
    setJustRated(true);
    setTimeout(() => {
      setJustRated(false);
    }, 4000);
  };

  const handleRemove = () => {
    const updated = ratingStore.removeRating(titleId);
    setSummary(updated);
    setJustRated(false);
  };

  const activeHoverOrUserScore = hoverScore ?? summary.userRating ?? null;

  return (
    <div id="penilaian-penonton" className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-rose-500 mb-1">
          <Star className="w-4 h-4 fill-rose-500" />
          <span className="text-xs uppercase tracking-wider font-semibold">Skor & Ulasan</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          Penilaian & Rating Penonton
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Beri penilaian bintang Anda untuk membantu komunitas penggemar drama Korea menemukan karya terbaik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0f1422] p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-xl">
        {/* Left Column: Average Score and Star Overview */}
        <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-8">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Rata-rata Skor Komunitas
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-extrabold font-display text-amber-400 tracking-tight">
                {summary.totalRatings > 0 ? summary.averageScore.toFixed(1) : '0.0'}
              </span>
              <span className="text-lg text-slate-400 font-medium">/ 5.0</span>
            </div>

            {/* Static Stars Display for Average */}
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = summary.averageScore >= starIndex;
                const isHalf =
                  !isFilled && summary.averageScore >= starIndex - 0.7;

                return (
                  <Star
                    key={starIndex}
                    className={`w-5 h-5 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : isHalf
                        ? 'fill-amber-400/50 text-amber-400'
                        : 'fill-slate-800 text-slate-700'
                    }`}
                  />
                );
              })}
              <span className="text-xs text-slate-400 ml-2 font-medium">
                ({summary.totalRatings.toLocaleString('id-ID')} penilaian)
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Berdasarkan evaluasi penonton terverifikasi untuk <strong className="text-slate-200">{titleName}</strong> di platform SeoulPlay.
            </p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="space-y-2 mt-6">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = summary.distribution[starNum as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage =
                summary.totalRatings > 0
                  ? Math.round((count / summary.totalRatings) * 100)
                  : 0;

              return (
                <div key={starNum} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-400 shrink-0 font-medium flex items-center gap-1">
                    <span>{starNum}</span>
                    <Star className="w-3 h-3 fill-slate-500 text-slate-500 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400/80 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono text-[11px]">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: User Rating Interactive Box */}
        <div className="md:col-span-7 flex flex-col justify-center md:pl-2 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-white">
              {summary.userRating ? 'Penilaian Anda untuk Judul Ini' : 'Berikan Penilaian Anda'}
            </h3>
            <p className="text-xs text-slate-400">
              {summary.userRating
                ? 'Terima kasih telah berkontribusi! Anda dapat memperbarui skor kapan saja.'
                : 'Klik bintang di bawah untuk memberikan skor rating Anda:'}
            </p>
          </div>

          {/* Interactive Stars Row */}
          <div className="bg-[#141b29] p-5 rounded-xl border border-slate-700/60 flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHoveredOrActive =
                  activeHoverOrUserScore !== null && star <= activeHoverOrUserScore;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(null)}
                    aria-label={`Beri penilaian ${star} bintang dari 5`}
                    className="p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-150 ${
                        isHoveredOrActive
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'fill-transparent text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Score Label / Active Preview */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="text-xs font-medium">
                {activeHoverOrUserScore ? (
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <span className="text-sm font-bold">{activeHoverOrUserScore} / 5</span>
                    <span className="text-slate-400">—</span>
                    <span>{SCORE_LABELS[activeHoverOrUserScore]}</span>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Arahkan kursor atau sentuh bintang untuk memilih skor
                  </span>
                )}
              </div>

              {summary.userRating && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Hapus Nilai</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Banner upon rating */}
          {justRated && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs animate-in fade-in duration-300">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                Penilaian Anda berhasil disimpan! Skor rata-rata drama ini telah diperbarui secara langsung.
              </span>
            </div>
          )}

          {/* Community assurance */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <ThumbsUp className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>
              Penilaian Anda bersifat anonim, bebas biaya, dan langsung tersimpan di peramban Anda.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Star Badge for display in Hero / Title Card header
 */
export const CompactStarRating: React.FC<{ titleId: string }> = ({ titleId }) => {
  const [summary, setSummary] = useState<TitleRatingSummary>(() => ratingStore.getSummary(titleId));

  useEffect(() => {
    setSummary(ratingStore.getSummary(titleId));
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ titleId: string }>;
      if (customEvent.detail?.titleId === titleId) {
        setSummary(ratingStore.getSummary(titleId));
      }
    };
    window.addEventListener('seoulplay:rating_updated', handleUpdate);
    return () => {
      window.removeEventListener('seoulplay:rating_updated', handleUpdate);
    };
  }, [titleId]);

  const scrollToRating = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('penilaian-penonton');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#penilaian-penonton"
      onClick={scrollToRating}
      className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group"
      title="Lihat ulasan & beri penilaian"
    >
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
      <span className="font-bold tabular-nums">
        {summary.totalRatings > 0 ? summary.averageScore.toFixed(1) : '—'}
      </span>
      <span className="text-slate-400 text-[11px]">
        ({summary.totalRatings.toLocaleString('id-ID')})
      </span>
      {summary.userRating && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
          Nilai Anda: {summary.userRating}★
        </span>
      )}
    </a>
  );
};
