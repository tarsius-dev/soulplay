/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../../lib/auth/context';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { updatePageMeta } from '../../lib/seo/meta';

export const AdminLoginPage: React.FC = () => {
  const { signIn, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('admin@seoulplay.example.com');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: 'Masuk Administrator',
      description: 'Masuk ke portal kurasi dan manajemen konten SeoulPlay.',
    });
    if (isAdmin) {
      setLocation('/admin');
    }
  }, [isAdmin, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      setLocation('/admin');
    } else {
      setError(res.error || 'Autentikasi gagal. Silakan periksa kembali email dan kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Masuk Administrator SeoulPlay
          </h1>
          <p className="text-xs text-slate-400">
            Akses khusus tim internal untuk mengelola katalog judul, episode, dan tautan streaming.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="rounded-lg bg-rose-950/40 border border-rose-800/80 p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Alamat Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seoulplay.example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141b29] border border-slate-700 text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141b29] border border-slate-700 text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Memverifikasi...' : 'Masuk sebagai Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Environment Status Badge */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              {isSupabaseConfigured ? (
                <span>Terhubung ke Supabase PostgreSQL Auth. Akun akan dicocokkan dengan tabel <code className="text-slate-300">admin_profiles</code>.</span>
              ) : (
                <span>Mode Pratinjau Lokal Aktif. Kredensial demo admin telah terisi di atas untuk keperluan evaluasi dan pengujian langsung.</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
            ← Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    </div>
  );
};
