/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { catalogStore } from '../lib/catalog/store';
import { useAuth } from '../lib/auth/context';
import { EpisodeList } from '../components/catalog/EpisodeList';
import { ContentAd } from '../components/ads/AdSlot';
import { StarRatingWidget, CompactStarRating } from '../components/catalog/StarRatingWidget';
import { ShareButton } from '../components/catalog/ShareButton';
import { GlobalSkeletonLoader } from '../components/common/Skeleton';
import { ratingStore } from '../lib/rating/store';
import { updatePageMeta, generateStructuredDataForTitle } from '../lib/seo/meta';
import { Play, ArrowLeft, Film, ShieldCheck } from 'lucide-react';

export const TitleDetailPage: React.FC = () => {
  const [, params] = useRoute('/title/:slug');
  const slug = params?.slug || '';
  const { isAdmin } = useAuth();

  const [titleData, setTitleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const found = catalogStore.getTitleBySlug(slug, isAdmin);
    setTitleData(found);
    setLoading(false);

    if (found) {
      updatePageMeta({
        title: `${found.name} (${found.release_year || 'Terbaru'}) — Sinopsis & Info Nonton`,
        description: found.synopsis,
        image: found.backdrop_url || found.poster_url || undefined,
        type: found.content_type === 'movie' ? 'video.movie' : 'video.tv_show',
      });

      const ratingSummary = ratingStore.getSummary(found.id);

      // Inject JSON-LD Schema.org
      const scriptId = 'json-ld-title';
      let existing = document.getElementById(scriptId);
      if (!existing) {
        existing = document.createElement('script');
        existing.id = scriptId;
        existing.setAttribute('type', 'application/ld+json');
        document.head.appendChild(existing);
      }
      existing.textContent = JSON.stringify(
        generateStructuredDataForTitle(found, {
          ratingValue: ratingSummary.averageScore,
          ratingCount: ratingSummary.totalRatings,
        })
      );
    }
  }, [slug, isAdmin]);

  if (loading) {
    return <GlobalSkeletonLoader variant="detail" />;
  }

  if (!titleData) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Judul Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400">
          Judul yang Anda minta tidak tersedia, telah diarsipkan, atau masih berstatus draf internal.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const isMovie = titleData.content_type === 'movie';
  const firstEpisode = titleData.seasons?.[0]?.episodes?.[0];
  const watchHref = firstEpisode
    ? `/title/${titleData.slug}/watch/${firstEpisode.slug}`
    : null;

  return (
    <div className="space-y-12">
      {/* Back link */}
      <div>
        <Link
          href={isMovie ? '/movies' : '/dramas'}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke {isMovie ? 'Film Korea' : 'Drama Korea'}</span>
        </Link>
      </div>

      {/* Main Title Hero Header */}
      <div className="relative rounded-2xl bg-[#0f1422] border border-slate-800/80 overflow-hidden shadow-2xl">
        {/* Backdrop visual scrim */}
        {titleData.backdrop_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={titleData.backdrop_url}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-top opacity-20 filter blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-[#0f1422]/90 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Vertical 3:4 Poster */}
          <div className="w-44 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 bg-[#141b29]">
            <img
              src={titleData.poster_url || '/src/assets/images/poster_queen_chaebol_1792737531897.jpg'}
              alt={`${titleData.name} cover`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            {titleData.original_name && (
              <div className="text-sm font-medium tracking-wide text-rose-400">
                {titleData.original_name}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {titleData.name}
            </h1>

            {/* Unboxed Metadata Line (No pills rule) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
              <span className="font-semibold text-rose-300">
                {isMovie ? 'Film Layar Lebar' : 'Serial Drama Korea'}
              </span>
              {titleData.release_year && (
                <>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="tabular-nums">{titleData.release_year}</span>
                </>
              )}
              {titleData.genres && titleData.genres.length > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>{titleData.genres.map((g: any) => g.name).join(', ')}</span>
                </>
              )}
              <span aria-hidden="true" className="text-slate-500">·</span>
              <CompactStarRating titleId={titleData.id} />
              {titleData.status === 'draft' && (
                <>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-amber-400 font-semibold">[Pratinjau Draf Admin]</span>
                </>
              )}
            </div>

            {/* Editorial Synopsis */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sinopsis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
                {titleData.synopsis}
              </p>
            </div>

            {/* Action Bar: Watch CTA & Share */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {watchHref && (
                <Link
                  href={watchHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/60"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isMovie ? 'Tonton Film Lengkap' : 'Mulai Menonton Episode 1'}</span>
                </Link>
              )}

              <ShareButton
                title={titleData.name}
                slug={titleData.slug}
                contentType={titleData.content_type}
              />

              <div className="flex items-center gap-1.5 text-xs text-slate-400 sm:ml-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pemutar Resmi Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Content Ad */}
      <ContentAd />

      {/* Episodes Section */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {isMovie ? 'Video Film Utama' : 'Musim & Daftar Episode'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih episode di bawah ini untuk memulai pemutaran streaming resmi.
          </p>
        </div>

        <EpisodeList
          titleSlug={titleData.slug}
          seasons={titleData.seasons || []}
          isMovie={isMovie}
        />
      </section>

      {/* Star Rating & Audience Reviews Section */}
      <section>
        <StarRatingWidget titleId={titleData.id} titleName={titleData.name} />
      </section>
    </div>
  );
};
