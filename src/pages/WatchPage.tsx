/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { catalogStore } from '../lib/catalog/store';
import { useAuth } from '../lib/auth/context';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { ContentAd } from '../components/ads/AdSlot';
import { GlobalSkeletonLoader } from '../components/common/Skeleton';
import { updatePageMeta, generateStructuredDataForEpisode } from '../lib/seo/meta';
import { ArrowLeft, ChevronLeft, ChevronRight, ListVideo, ShieldAlert, Film, Clock } from 'lucide-react';

export const WatchPage: React.FC = () => {
  const [, params] = useRoute('/title/:slug/watch/:episodeSlug');
  const titleSlug = params?.slug || '';
  const episodeSlug = params?.episodeSlug || '';
  const { isAdmin } = useAuth();

  const [data, setData] = useState<any | null>(null);
  const [videoResolution, setVideoResolution] = useState<{
    authorized: boolean;
    embedUrl: string | null;
    provider: string | null;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!titleSlug || !episodeSlug) return;

    const result = catalogStore.getEpisode(titleSlug, episodeSlug, isAdmin);
    setData(result);

    if (result) {
      const { title, episode } = result;
      const res = catalogStore.resolveVideoSource(episode.id, isAdmin);
      setVideoResolution(res);

      const episodeLabel = title.content_type === 'movie' ? 'Film Lengkap' : episode.name;
      updatePageMeta({
        title: `Nonton ${title.name} (${episodeLabel}) Sub Indo`,
        description: episode.synopsis || title.synopsis,
        image: title.backdrop_url || title.poster_url || undefined,
        type: 'video.episode',
      });

      // Inject structured data
      const scriptId = 'json-ld-episode';
      let existing = document.getElementById(scriptId);
      if (!existing) {
        existing = document.createElement('script');
        existing.id = scriptId;
        existing.setAttribute('type', 'application/ld+json');
        document.head.appendChild(existing);
      }
      existing.textContent = JSON.stringify(generateStructuredDataForEpisode(title, episode));
    }

    setLoading(false);
  }, [titleSlug, episodeSlug, isAdmin]);

  if (loading) {
    return <GlobalSkeletonLoader variant="watch" />;
  }

  if (!data) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Episode Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400">
          Episode ini tidak ada, telah dihapus, atau belum dipublikasikan untuk umum.
        </p>
        <Link
          href={`/title/${titleSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Judul</span>
        </Link>
      </div>
    );
  }

  const { title, episode, prevEpisode, nextEpisode, allEpisodes } = data;
  const isMovie = title.content_type === 'movie';

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/title/${title.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Detail {title.name}</span>
        </Link>

        {/* Previous / Next Episode Controls */}
        {!isMovie && (
          <div className="flex items-center gap-2">
            {prevEpisode ? (
              <Link
                href={`/title/${title.slug}/watch/${prevEpisode.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Episode Sebelumnya</span>
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-xs font-medium text-slate-700 cursor-not-allowed">
                Episode Sebelumnya
              </span>
            )}

            {nextEpisode ? (
              <Link
                href={`/title/${title.slug}/watch/${nextEpisode.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-xs font-medium text-white hover:bg-rose-500 transition-colors"
              >
                <span className="hidden sm:inline">Episode Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-xs font-medium text-slate-700 cursor-not-allowed">
                Episode Berikutnya
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Player Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Player and Episode Info */}
        <div className="lg:col-span-3 space-y-6">
          <VideoPlayer
            embedUrl={videoResolution?.embedUrl}
            provider={videoResolution?.provider}
            titleName={title.name}
            episodeName={isMovie ? undefined : episode.name}
            isAuthorized={videoResolution?.authorized ?? false}
            unavailableReason={videoResolution?.message}
          />

          {/* Episode Info Header */}
          <div className="space-y-3 p-6 rounded-xl bg-[#0f1422] border border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-semibold">
                  {isMovie ? 'Tayangan Lengkap' : `Episode ${episode.episode_number}`}
                </span>
                {episode.duration_minutes && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{episode.duration_minutes} menit</span>
                    </span>
                  </>
                )}
              </div>
              <span className="text-slate-500">
                {title.name} ({title.release_year})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              {episode.name}
            </h1>

            {episode.synopsis && (
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
                {episode.synopsis}
              </p>
            )}

            {/* Legal Notice */}
            <div className="pt-4 border-t border-slate-800/60 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-400">Pemberitahuan Penyematan Video Resmi:</strong> SeoulPlay tidak mengunggah, meng-host, atau merekayasa video secara mandiri. Pemutar video ini disematkan secara legal dari pihak ketiga terverifikasi yang mengizinkan penyematan publik. Pemutaran tunduk pada ketentuan layanan penyedia terkait.
              </p>
            </div>
          </div>
        </div>

        {/* Episode Playlist Drawer */}
        {!isMovie && allEpisodes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white px-1">
              <ListVideo className="w-4 h-4 text-rose-500" />
              <span>Daftar Episode ({allEpisodes.length})</span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {allEpisodes.map((ep: any) => {
                const isCurrent = ep.slug === episode.slug;
                return (
                  <Link
                    key={ep.id}
                    href={`/title/${title.slug}/watch/${ep.slug}`}
                    className={`block p-3 rounded-lg border transition-all text-xs ${
                      isCurrent
                        ? 'bg-rose-950/40 border-rose-500/80 text-white shadow-sm'
                        : 'bg-[#0f1422] border-slate-800 text-slate-400 hover:text-white hover:bg-[#131a2a] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={isCurrent ? 'text-rose-400 font-semibold' : 'text-slate-500 font-medium'}>
                        Ep. {ep.episode_number}
                      </span>
                      {ep.duration_minutes && (
                        <span className="text-slate-500 tabular-nums">{ep.duration_minutes}m</span>
                      )}
                    </div>
                    <div className="font-medium text-slate-200 line-clamp-1">{ep.name}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ContentAd />
    </div>
  );
};
