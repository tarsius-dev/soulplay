/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdminLayout } from './AdminLayout';
import { getApprovedHosts } from '../../lib/video/validator';
import { getAdConfig } from '../../lib/ads/config';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import {
  ShieldCheck,
  Server,
  DollarSign,
  Terminal,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const hosts = getApprovedHosts();
  const adConfig = getAdConfig();

  return (
    <AdminLayout
      title="Pengaturan Platform & Keamanan"
      subtitle="Periksa domain penyedia video yang disetujui, status koneksi Supabase, panduan pendaftaran admin pertama, dan konfigurasi iklan."
    >
      <div className="max-w-4xl space-y-8 text-xs">
        {/* Approved Video Providers */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-semibold text-white">
              Daftar Domain Penyedia Video Resmi yang Diizinkan
            </h3>
          </div>

          <p className="text-slate-300 leading-relaxed">
            SeoulPlay menerapkan validasi nama host (domain) yang ketat pada setiap tautan sematan video. URL yang mengarah ke domain di luar daftar ini akan ditolak secara otomatis oleh sistem keamanan.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {hosts.map((host) => (
              <span
                key={host}
                className="font-mono text-[11px] bg-[#141b29] border border-slate-700 text-rose-300 px-2.5 py-1 rounded"
              >
                {host}
              </span>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            Untuk menambahkan mitra konten resmi atau CDN baru, tambahkan domain ke{' '}
            <code className="text-slate-200">VITE_APPROVED_VIDEO_HOSTS</code> pada berkas konfigurasi environment Anda.
          </div>
        </div>

        {/* Database & Supabase Status */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              Runtime Database & Autentikasi
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-sm font-medium text-white">
              {isSupabaseConfigured
                ? 'Terhubung ke Database Cloud Supabase PostgreSQL'
                : 'Mode Penyimpanan Lokal (Data Uji Coba Terenkripsi)'}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {isSupabaseConfigured
              ? 'Seluruh kueri katalog dan autentikasi administrator disinkronkan secara langsung dengan database Supabase PostgreSQL.'
              : 'Menggunakan penyimpanan data demo lokal dengan kompatibilitas skema PostgreSQL penuh. Anda dapat menghubungkan proyek Supabase live dengan mengisi variabel VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.'}
          </p>
        </div>

        {/* Administrator Provisioning Instructions */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Panduan Pendaftaran Administrator Pertama yang Aman
            </h3>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Demi menjaga keamanan tingkat tinggi, SeoulPlay tidak menyediakan formulir pendaftaran admin di halaman publik. Untuk mendaftarkan administrator pertama di proyek Supabase baru:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1 leading-relaxed">
            <li>
              Buka Supabase Dashboard, masuk ke menu <strong>Authentication → Users</strong> lalu klik <strong>Add User</strong> (misal: <code className="text-slate-200">admin@seoulplay.example.com</code>).
            </li>
            <li>
              Salin UUID <code className="text-slate-200">id</code> pengguna yang baru saja dibuat.
            </li>
            <li>
              Buka menu <strong>SQL Editor</strong> di Supabase, lalu jalankan perintah SQL berikut untuk memberikan hak administrator:
            </li>
          </ol>

          <div className="rounded-lg bg-[#0b0e14] border border-slate-800 p-3.5 font-mono text-[11px] text-slate-300 overflow-x-auto">
            INSERT INTO public.admin_profiles (id, role)<br />
            VALUES ('&lt;MASUKKAN_UUID_PENGGUNA_DI_SINI&gt;', 'administrator')<br />
            ON CONFLICT (id) DO NOTHING;
          </div>
        </div>

        {/* Advertising Configuration */}
        <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Arsitektur Periklanan & Monetisasi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-[#141b29] rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Status Iklan</span>
              <span className="text-sm font-semibold text-white">
                {adConfig.enabled ? 'Aktif' : 'Nonaktif (Bawaan Mode Pengembangan)'}
              </span>
            </div>

            <div className="p-3 bg-[#141b29] rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Integrasi Penyedia</span>
              <span className="text-sm font-semibold text-white">
                {adConfig.adsenseClientId ? adConfig.adsenseClientId : 'Belum Dikonfigurasi'}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Monetisasi tidak pernah diaktifkan tanpa verifikasi resmi dari jaringan iklan terkait. Tidak ada iklan yang muncul di dalam panel konsol administrator.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
