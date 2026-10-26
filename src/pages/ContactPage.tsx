/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../lib/seo/meta';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    updatePageMeta({
      title: 'Hubungi Redaksi SeoulPlay',
      description: 'Sampaikan pertanyaan, masukan katalog, atau kerja sama distribusi konten dengan tim SeoulPlay Indonesia.',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Hubungi SeoulPlay
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Punya pertanyaan editorial, saran penambahan judul drakor, atau penawaran kerja sama?
        </p>
      </div>

      <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-semibold text-white">Pesan Anda Terkirim</h3>
            <p className="text-xs text-slate-300">
              Terima kasih, {name}. Tim kami telah menerima pesan Anda dan akan segera memberikan balasan melalui email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Rian Pratama"
                className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Alamat Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rian@example.com"
                className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Pesan atau Masukan *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pesan Anda di sini..."
                className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Kirim Pesan</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
