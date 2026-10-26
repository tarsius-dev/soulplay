/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { catalogStore } from '../../lib/catalog/store';
import { CatalogStats, Title } from '../../lib/types';
import {
  Film,
  FileEdit,
  Video,
  Tags,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<CatalogStats>({
    publishedTitlesCount: 0,
    draftTitlesCount: 0,
    totalEpisodesCount: 0,
    genresCount: 0,
  });
  const [recentTitles, setRecentTitles] = useState<Title[]>([]);

  useEffect(() => {
    setStats(catalogStore.getCatalogStats());
    const all = (catalogStore as any).titles as Title[];
    setRecentTitles(all.slice(0, 6));
  }, []);

  return (
    <AdminLayout
      title="Dasbor Editorial"
      subtitle="Ringkasan inventaris katalog, status publikasi, dan referensi streaming video."
      action={
        <Link
          href="/admin/titles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Judul Baru</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Judul Terbit</span>
              <Film className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-display text-white tabular-nums">
              {stats.publishedTitlesCount}
            </div>
            <div className="text-[11px] text-emerald-400/80 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Tayang di situs publik</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Draf Judul</span>
              <FileEdit className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold font-display text-white tabular-nums">
              {stats.draftTitlesCount}
            </div>
            <div className="text-[11px] text-amber-400/80 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Tersembunyi dari publik</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Episode</span>
              <Video className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold font-display text-white tabular-nums">
              {stats.totalEpisodesCount}
            </div>
            <div className="text-[11px] text-slate-500">Di seluruh katalog</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Genre Terdaftar</span>
              <Tags className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-bold font-display text-white tabular-nums">
              {stats.genresCount}
            </div>
            <div className="text-[11px] text-slate-500">Romantis, Sageuk, Thriller, dll.</div>
          </div>
        </div>

        {/* Recent Titles Management Table */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Inventaris Katalog Terkini</h3>
            <Link
              href="/admin/titles"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Kelola semua judul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121828] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Judul Drama / Film</th>
                  <th className="py-3 px-4 font-semibold">Tipe</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Tahun Rilis</th>
                  <th className="py-3 px-4 font-semibold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentTitles.map((t) => (
                  <tr key={t.id} className="hover:bg-[#131b2c] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        {t.poster_url && (
                          <img
                            src={t.poster_url}
                            alt=""
                            className="w-7 h-9 object-cover rounded bg-slate-800 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          {t.original_name && (
                            <div className="text-[11px] text-slate-500">{t.original_name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-400">
                      {t.content_type === 'movie' ? 'Film' : 'Drama'}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                          Terbit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                          Draf
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-400">
                      {t.release_year || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/titles/${t.id}/edit`}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Ubah Metadata
                      </Link>
                      <span className="text-slate-600">·</span>
                      <Link
                        href={`/admin/titles/${t.id}/seasons`}
                        className="text-xs text-slate-300 hover:underline"
                      >
                        Musim & Sematan
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
