/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { GlobalSkeletonLoader } from '../../components/common/Skeleton';
import { catalogStore } from '../../lib/catalog/store';
import { Title } from '../../lib/types';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Layers,
  Star,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export const AdminTitlesPage: React.FC = () => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTitles = () => {
    const all = (catalogStore as any).titles as Title[];
    setTitles([...all]);
    setLoading(false);
  };

  useEffect(() => {
    loadTitles();
  }, []);

  const handleDelete = (id: string) => {
    catalogStore.deleteTitle(id);
    setDeleteConfirmId(null);
    loadTitles();
  };

  const toggleFeatured = (title: Title) => {
    catalogStore.saveTitle({ featured: !title.featured }, title.id);
    loadTitles();
  };

  const filteredTitles = titles.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchSlug = t.slug.toLowerCase().includes(q);
      if (!matchName && !matchSlug) return false;
    }
    return true;
  });

  return (
    <AdminLayout
      title="Katalog Judul"
      subtitle="Buat, edit, terbitkan, atau hapus drama dan film di direktori SeoulPlay."
      action={
        <Link
          href="/admin/titles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Judul Baru</span>
        </Link>
      }
    >
      {loading ? (
        <GlobalSkeletonLoader variant="admin" />
      ) : (
        <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1422] p-4 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul atau slug..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#141b29] border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto justify-end">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Semua ({titles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'published'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Terbit ({titles.filter((t) => t.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Draf ({titles.filter((t) => t.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Titles Table */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121828] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Judul</th>
                <th className="py-3 px-4 font-semibold">Slug</th>
                <th className="py-3 px-4 font-semibold">Tipe</th>
                <th className="py-3 px-4 font-semibold">Unggulan</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTitles.map((t) => (
                <tr key={t.id} className="hover:bg-[#131b2c] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      {t.poster_url && (
                        <img
                          src={t.poster_url}
                          alt=""
                          className="w-8 h-10 object-cover rounded bg-slate-800 shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-slate-100">{t.name}</div>
                        {t.original_name && (
                          <div className="text-[11px] text-slate-500">{t.original_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {t.slug}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-400">
                    {t.content_type === 'movie' ? 'Film' : 'Drama'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleFeatured(t)}
                      className={`p-1 rounded transition-colors ${
                        t.featured
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={t.featured ? 'Judul Unggulan Beranda' : 'Jadikan judul unggulan'}
                    >
                      <Star className={`w-4 h-4 ${t.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                        t.status === 'published'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                          : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                      }`}
                    >
                      {t.status === 'published' ? 'Terbit' : 'Draf'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/title/${t.slug}`}
                      className="p-1.5 text-slate-400 hover:text-white inline-block"
                      title="Lihat halaman publik"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/titles/${t.id}/seasons`}
                      className="p-1.5 text-rose-400 hover:text-rose-300 inline-block"
                      title="Kelola musim dan episode"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/titles/${t.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-white inline-block"
                      title="Ubah metadata judul"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 inline-block"
                      title="Hapus judul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800/50 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-white">Hapus Judul</h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus judul ini? Seluruh musim, episode, dan tautan sematan video yang terkait akan ikut terhapus.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
              >
                Konfirmasi Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
