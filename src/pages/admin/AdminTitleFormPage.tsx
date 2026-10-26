/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { catalogStore } from '../../lib/catalog/store';
import { TitleSchema } from '../../lib/validation/schemas';
import { Genre } from '../../lib/types';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';

export const AdminTitleFormPage: React.FC = () => {
  const [, params] = useRoute('/admin/titles/:id/edit');
  const titleId = params?.id;
  const isEditing = Boolean(titleId);

  const [, setLocation] = useLocation();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    original_name: '',
    synopsis: '',
    poster_url: '',
    backdrop_url: '',
    release_year: 2024,
    content_type: 'drama' as 'drama' | 'movie',
    status: 'published' as 'draft' | 'published' | 'archived',
    featured: false,
    genre_ids: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const allGenres = catalogStore.getAllGenres();
    setGenres(allGenres);

    if (isEditing && titleId) {
      const existing = catalogStore.getTitleById(titleId);
      if (existing) {
        setFormData({
          name: existing.name,
          slug: existing.slug,
          original_name: existing.original_name || '',
          synopsis: existing.synopsis,
          poster_url: existing.poster_url || '',
          backdrop_url: existing.backdrop_url || '',
          release_year: existing.release_year || 2024,
          content_type: existing.content_type,
          status: existing.status,
          featured: existing.featured,
          genre_ids: existing.genres?.map((g) => g.id) || [],
        });
      }
    }
  }, [isEditing, titleId]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !isEditing
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug,
    }));
  };

  const toggleGenre = (genreId: string) => {
    setFormData((prev) => {
      const exists = prev.genre_ids.includes(genreId);
      return {
        ...prev,
        genre_ids: exists
          ? prev.genre_ids.filter((id) => id !== genreId)
          : [...prev.genre_ids, genreId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg(null);

    const validation = TitleSchema.safeParse({
      ...formData,
      release_year: Number(formData.release_year) || null,
      poster_url: formData.poster_url.trim() || null,
      backdrop_url: formData.backdrop_url.trim() || null,
      original_name: formData.original_name.trim() || null,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        const field = err.path[0]?.toString() || 'general';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      catalogStore.saveTitle(validation.data as any, titleId);
      setSuccessMsg('Data judul berhasil disimpan.');
      setTimeout(() => {
        setLocation('/admin/titles');
      }, 700);
    } catch (err: any) {
      setErrors({ general: err.message || 'Gagal menyimpan judul.' });
    }
  };

  return (
    <AdminLayout
      title={isEditing ? 'Ubah Metadata Judul' : 'Tambah Judul Baru'}
      subtitle="Konfigurasi nama drama/film, sinopsis, tautan poster, dan status publikasi."
      action={
        <Link
          href="/admin/titles"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </Link>
      }
    >
      <div className="max-w-4xl space-y-6">
        {errors.general && (
          <div className="rounded-lg bg-rose-950/40 border border-rose-800/80 p-3.5 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/80 p-3.5 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Informasi Utama
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Judul (Tampilan) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Queen of the Chaebol"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
                {errors.name && <p className="text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Asli Korea (Hangul)
                </label>
                <input
                  type="text"
                  value={formData.original_name}
                  onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
                  placeholder="Contoh: 어둠 속의 찬란"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="queen-of-the-chaebol"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-rose-500"
                />
                {errors.slug && <p className="text-rose-400 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Jenis Konten *
                </label>
                <select
                  value={formData.content_type}
                  onChange={(e) =>
                    setFormData({ ...formData, content_type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="drama">Drama Korea (Episodik)</option>
                  <option value="movie">Film Korea (Layar Lebar)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tahun Rilis
                </label>
                <input
                  type="number"
                  min="1950"
                  max="2035"
                  value={formData.release_year}
                  onChange={(e) =>
                    setFormData({ ...formData, release_year: parseInt(e.target.value) || 2024 })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-rose-500"
                />
                {errors.release_year && <p className="text-rose-400 mt-1">{errors.release_year}</p>}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Sinopsis Editorial *
              </label>
              <textarea
                required
                rows={4}
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Tuliskan sinopsis mendalam dan latar belakang cerita..."
                className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              />
              {errors.synopsis && <p className="text-rose-400 mt-1">{errors.synopsis}</p>}
            </div>
          </div>

          {/* Media & Artwork */}
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Aset Gambar & Poster
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tautan Poster (Rasio 3:4)
                </label>
                <input
                  type="text"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  placeholder="/src/assets/images/... atau URL valid"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tautan Latar Belakang (Rasio 16:9)
                </label>
                <input
                  type="text"
                  value={formData.backdrop_url}
                  onChange={(e) => setFormData({ ...formData, backdrop_url: e.target.value })}
                  placeholder="/src/assets/images/... atau URL valid"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Taxonomy & Genres */}
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Genre & Klasifikasi
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {genres.map((g) => {
                const checked = formData.genre_ids.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-colors ${
                      checked
                        ? 'bg-rose-950/40 border-rose-500/80 text-white'
                        : 'bg-[#141b29] border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGenre(g.id)}
                      className="accent-rose-500"
                    />
                    <span className="font-medium">{g.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Publication State */}
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Status Publikasi & Visibilitas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Status Katalog *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="published">Terbit (Dapat ditonton di situs publik)</option>
                  <option value="draft">Draf (Hanya dapat dilihat administrator)</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <label htmlFor="featured-checkbox" className="text-slate-300 font-medium cursor-pointer">
                  Tampilkan di Banner Utama Beranda
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/titles"
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-rose-950"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Judul</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
