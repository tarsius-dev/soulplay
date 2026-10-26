/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { catalogStore } from '../../lib/catalog/store';
import { EpisodeSchema } from '../../lib/validation/schemas';
import {
  validateEmbedUrl,
  buildEmbedUrlFromId,
  DEFAULT_APPROVED_HOSTS,
} from '../../lib/video/validator';
import { Title } from '../../lib/types';
import { ArrowLeft, Save, AlertCircle, Check, ShieldCheck, Film } from 'lucide-react';

export const AdminEpisodeFormPage: React.FC = () => {
  const [, params] = useRoute('/admin/episodes/:id/edit');
  const episodeId = params?.id;
  const isEditing = Boolean(episodeId && episodeId !== 'new');

  const [, setLocation] = useLocation();

  const [title, setTitle] = useState<Title | null>(null);
  const [formData, setFormData] = useState({
    title_id: '',
    season_id: '',
    slug: 'episode-1',
    episode_number: 1,
    name: '',
    synopsis: '',
    duration_minutes: 60,
    status: 'published' as 'draft' | 'published',
    video_provider: 'youtube' as 'youtube' | 'vimeo' | 'dailymotion' | 'archive' | 'custom_authorized',
    external_video_id: '',
    embed_url: '',
    authorization_confirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const paramTitleId = urlParams.get('titleId') || '';
    const paramSeasonId = urlParams.get('seasonId') || '';
    const paramNextNum = parseInt(urlParams.get('nextNum') || '1') || 1;

    if (isEditing && episodeId) {
      const existing = catalogStore.getEpisodeById(episodeId);
      if (existing) {
        const t = catalogStore.getTitleById(existing.title_id);
        setTitle(t);
        const vs = catalogStore.getVideoSourceForEpisode(existing.id);

        setFormData({
          title_id: existing.title_id,
          season_id: existing.season_id || '',
          slug: existing.slug,
          episode_number: existing.episode_number,
          name: existing.name,
          synopsis: existing.synopsis || '',
          duration_minutes: existing.duration_minutes || 60,
          status: existing.status,
          video_provider: vs?.provider || 'youtube',
          external_video_id: vs?.external_video_id || '',
          embed_url: vs?.embed_url || '',
          authorization_confirmed: vs?.authorization_confirmed || false,
        });
      }
    } else if (paramTitleId) {
      const t = catalogStore.getTitleById(paramTitleId);
      setTitle(t);
      setFormData((prev) => ({
        ...prev,
        title_id: paramTitleId,
        season_id: paramSeasonId,
        episode_number: paramNextNum,
        slug: `episode-${paramNextNum}`,
        name: `Episode ${paramNextNum}`,
      }));
    }
  }, [isEditing, episodeId]);

  const handleGenerateEmbed = () => {
    if (!formData.external_video_id.trim()) return;
    const built = buildEmbedUrlFromId(formData.video_provider, formData.external_video_id);
    if (built) {
      setFormData((prev) => ({ ...prev, embed_url: built }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg(null);

    const validation = EpisodeSchema.safeParse({
      ...formData,
      season_id: formData.season_id.trim() || null,
      synopsis: formData.synopsis.trim() || null,
      external_video_id: formData.external_video_id.trim() || null,
      embed_url: formData.embed_url.trim() || null,
      duration_minutes: Number(formData.duration_minutes) || null,
      episode_number: Number(formData.episode_number) || 1,
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

    if (formData.embed_url && formData.embed_url.trim().length > 0) {
      const urlCheck = validateEmbedUrl(formData.embed_url);
      if (!urlCheck.isValid) {
        setErrors({
          embed_url: urlCheck.error || 'Alamat embed video tidak lolos verifikasi izin domain.',
        });
        return;
      }
    }

    try {
      catalogStore.saveEpisode(validation.data as any, isEditing ? episodeId : undefined);
      setSuccessMsg('Konfigurasi episode dan pemutar video berhasil disimpan.');
      setTimeout(() => {
        if (formData.title_id) {
          setLocation(`/admin/titles/${formData.title_id}/seasons`);
        } else {
          setLocation('/admin/titles');
        }
      }, 700);
    } catch (err: any) {
      setErrors({ general: err.message || 'Gagal menyimpan episode.' });
    }
  };

  return (
    <AdminLayout
      title={isEditing ? `Ubah Episode: ${formData.name}` : 'Tambah Episode Baru'}
      subtitle={title ? `Konfigurasi penayangan video untuk ${title.name}` : undefined}
      action={
        <Link
          href={formData.title_id ? `/admin/titles/${formData.title_id}/seasons` : '/admin/titles'}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Musim</span>
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
          {/* Episode Info */}
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Metadata Episode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nomor Episode *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.episode_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      episode_number: parseInt(e.target.value) || 1,
                      slug: `episode-${parseInt(e.target.value) || 1}`,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Episode *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Episode 1: Menara Emas"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white"
                />
                {errors.name && <p className="text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Slug URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="episode-1"
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white font-mono"
                />
                {errors.slug && <p className="text-rose-400 mt-1">{errors.slug}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Durasi (Menit)
                </label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Status Publikasi *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white"
                >
                  <option value="published">Terbit (Dapat ditonton di situs publik)</option>
                  <option value="draft">Draf (Pratinjau internal admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Sinopsis Episode
              </label>
              <textarea
                rows={3}
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Garis besar alur cerita pada episode ini..."
                className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Authorized Video Embed Configuration */}
          <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-white">
                  Konfigurasi Pemutar Video Resmi
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Mode Kepatuhan Ketat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Penyedia Video yang Disetujui
                </label>
                <select
                  value={formData.video_provider}
                  onChange={(e) =>
                    setFormData({ ...formData, video_provider: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white"
                >
                  <option value="youtube">YouTube Authorized Stream</option>
                  <option value="vimeo">Vimeo Player</option>
                  <option value="dailymotion">Dailymotion Player</option>
                  <option value="archive">Internet Archive (Domain Publik)</option>
                  <option value="custom_authorized">Mitra Konten Berizin Khusus</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  ID Video Eksternal (Opsional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.external_video_id}
                    onChange={(e) => setFormData({ ...formData, external_video_id: e.target.value })}
                    placeholder="Contoh: dQw4w9WgXcQ"
                    className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateEmbed}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded whitespace-nowrap"
                  >
                    Buat URL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL Embed Terverifikasi (HTTPS Saja)
                </label>
                <input
                  type="url"
                  value={formData.embed_url}
                  onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                  placeholder="https://www.youtube-nocookie.com/embed/..."
                  className="w-full px-3 py-2 bg-[#141b29] border border-slate-700 rounded-lg text-white font-mono"
                />
                {errors.embed_url && (
                  <p className="text-rose-400 mt-1">{errors.embed_url}</p>
                )}
              </div>
            </div>

            {/* Approved hostnames helper */}
            <div className="p-3 bg-[#121828] rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Domain penyedia resmi yang diizinkan:</span>{' '}
              {DEFAULT_APPROVED_HOSTS.join(', ')}
            </div>

            {/* MANDATORY LEGAL AUTHORIZATION CHECKBOX */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required={formData.status === 'published' && Boolean(formData.embed_url)}
                  checked={formData.authorization_confirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, authorization_confirmed: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 accent-rose-500 rounded shrink-0"
                />
                <div>
                  <div className="font-semibold text-rose-200 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Konfirmasi Hak Cipta & Izin Sematan Resmi *</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Saya menyatakan bahwa URL sematan video di atas berasal dari pemegang lisensi resmi atau platform penyiaran yang secara sah mengizinkan penyematan publik (embed) tanpa membobol enkripsi atau perlindungan hak cipta.
                  </p>
                </div>
              </label>
              {errors.authorization_confirmed && (
                <p className="text-rose-400 text-xs pl-7">
                  {errors.authorization_confirmed}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href={formData.title_id ? `/admin/titles/${formData.title_id}/seasons` : '/admin/titles'}
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-rose-950"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Episode & Sumber Video</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
