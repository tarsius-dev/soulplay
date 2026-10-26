/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { catalogStore } from '../../lib/catalog/store';
import { Title, Season, Episode } from '../../lib/types';
import {
  ArrowLeft,
  Plus,
  Video,
  CheckCircle2,
  Clock,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

export const AdminSeasonsPage: React.FC = () => {
  const [, params] = useRoute('/admin/titles/:id/seasons');
  const titleId = params?.id || '';

  const [title, setTitle] = useState<Title | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // Modal / Form state for new season
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [newSeasonNumber, setNewSeasonNumber] = useState(1);
  const [newSeasonName, setNewSeasonName] = useState('');

  const loadData = () => {
    if (!titleId) return;
    const t = catalogStore.getTitleById(titleId);
    setTitle(t);
    const s = catalogStore.getSeasonsForTitle(titleId);
    setSeasons(s);
    const e = catalogStore.getEpisodesForTitle(titleId);
    setEpisodes(e);
    setNewSeasonNumber(s.length + 1);
  };

  useEffect(() => {
    loadData();
  }, [titleId]);

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleId) return;
    catalogStore.saveSeason(titleId, newSeasonNumber, newSeasonName.trim() || undefined);
    setShowAddSeason(false);
    setNewSeasonName('');
    loadData();
  };

  const handleDeleteEpisode = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus episode ini?')) {
      catalogStore.deleteEpisode(id);
      loadData();
    }
  };

  if (!title) {
    return (
      <AdminLayout title="Judul Tidak Ditemukan">
        <div className="text-slate-400">Judul yang diminta tidak dapat ditemukan.</div>
      </AdminLayout>
    );
  }

  const isMovie = title.content_type === 'movie';

  return (
    <AdminLayout
      title={`Musim & Episode: ${title.name}`}
      subtitle={`Konfigurasi struktur episode dan tautan pemutar video resmi untuk ${title.name}.`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/titles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar</span>
          </Link>
          {!isMovie && (
            <button
              onClick={() => setShowAddSeason(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Musim</span>
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-8 max-w-5xl">
        {/* Movie standalone episodes */}
        {isMovie ? (
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Tautan Pemutar Film Layar Lebar</h3>
                <p className="text-xs text-slate-400">Konfigurasi pemutar video untuk tayangan film penuh.</p>
              </div>
              <Link
                href={`/admin/episodes/new?titleId=${title.id}`}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500"
              >
                Konfigurasi Sematan Film
              </Link>
            </div>

            <div className="space-y-2">
              {episodes.map((ep) => {
                const vs = catalogStore.getVideoSourceForEpisode(ep.id);
                return (
                  <div
                    key={ep.id}
                    className="p-4 rounded-lg bg-[#141b29] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white text-sm">{ep.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        Durasi: {ep.duration_minutes || '—'} menit · Status: {ep.status === 'published' ? 'Terbit' : 'Draf'}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {vs && vs.authorization_confirmed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tautan Resmi Aktif ({vs.provider})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Belum ada sematan terverifikasi</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/episodes/${ep.id}/edit`}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        Ubah Sumber Video
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Multi-Season TV Drama layout */
          <div className="space-y-6">
            {seasons.length === 0 ? (
              <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-8 text-center text-slate-400 space-y-3">
                <Video className="w-8 h-8 mx-auto text-rose-500/50" />
                <p>Belum ada musim yang dibuat untuk drama ini.</p>
                <button
                  onClick={() => setShowAddSeason(true)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500"
                >
                  Buat Musim 1
                </button>
              </div>
            ) : (
              seasons.map((season) => {
                const seasonEpisodes = episodes.filter((e) => e.season_id === season.id);
                return (
                  <div
                    key={season.id}
                    className="rounded-xl bg-[#0f1422] border border-slate-800 overflow-hidden"
                  >
                    <div className="p-4 bg-[#121828] border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {season.name || `Musim ${season.season_number}`}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {seasonEpisodes.length} Episode
                        </p>
                      </div>
                      <Link
                        href={`/admin/episodes/new?titleId=${title.id}&seasonId=${season.id}&nextNum=${seasonEpisodes.length + 1}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Episode</span>
                      </Link>
                    </div>

                    <div className="p-4 space-y-2">
                      {seasonEpisodes.length === 0 ? (
                        <div className="text-xs text-slate-500 py-3 text-center">
                          Belum ada episode yang ditambahkan ke musim ini.
                        </div>
                      ) : (
                        seasonEpisodes.map((ep) => {
                          const vs = catalogStore.getVideoSourceForEpisode(ep.id);
                          return (
                            <div
                              key={ep.id}
                              className="p-3.5 rounded-lg bg-[#141b29] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-rose-400">
                                    Ep. {ep.episode_number}
                                  </span>
                                  <span className="font-medium text-white">{ep.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  {ep.duration_minutes && <span>{ep.duration_minutes} menit</span>}
                                  <span>·</span>
                                  <span>Slug: {ep.slug}</span>
                                  <span>·</span>
                                  {ep.status === 'published' ? (
                                    <span className="text-emerald-400 font-medium">Terbit</span>
                                  ) : (
                                    <span className="text-amber-400 font-medium">Draf</span>
                                  )}
                                </div>
                                <div>
                                  {vs && vs.authorization_confirmed ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Tautan resmi aktif ({vs.provider})</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                                      <Clock className="w-3 h-3" />
                                      <span>Menunggu verifikasi sematan video</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <Link
                                  href={`/admin/episodes/${ep.id}/edit`}
                                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                                >
                                  Edit & Stream
                                </Link>
                                <button
                                  onClick={() => handleDeleteEpisode(ep.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                                  title="Hapus episode"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Add Season Modal */}
      {showAddSeason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Tambah Musim Baru</h3>
            <form onSubmit={handleCreateSeason} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nomor Musim *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newSeasonNumber}
                  onChange={(e) => setNewSeasonNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama / Babak Musim (Opsional)
                </label>
                <input
                  type="text"
                  value={newSeasonName}
                  onChange={(e) => setNewSeasonName(e.target.value)}
                  placeholder="Contoh: Musim 2: Pembalasan"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSeason(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-500"
                >
                  Buat Musim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
