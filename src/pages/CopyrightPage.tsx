/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { updatePageMeta } from '../lib/seo/meta';
import { ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export const CopyrightPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [workTitle, setWorkTitle] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    updatePageMeta({
      title: 'Hak Cipta & Kebijakan Penghapusan Konten (DMCA)',
      description: 'Pernyataan kepatuhan hak cipta SeoulPlay, prinsip penyematan video resmi, dan prosedur pengajuan penarikan konten (takedown notice).',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle || !ownerName || !infringingUrl || !contactEmail) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">Kepatuhan & Hak Kekayaan Intelektual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Hak Cipta & Kebijakan Penghapusan Konten
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          SeoulPlay berkomitmen mematuhi peraturan hak cipta internasional, Digital Millennium Copyright Act (DMCA), dan ketentuan hak kekayaan intelektual Republik Indonesia.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">1. Prinsip Tidak Meng-host File Video</h2>
          <p>
            SeoulPlay beroperasi murni sebagai direktori penemuan editorial dan katalog metadata informasi. Kami sama sekali tidak mengunggah, menyimpan, mencadangkan (cache), atau merekayasa ulang file video di peladen (server) kami. Semua pemutaran video berjalan melalui pemutar sematan (embed player) pihak ketiga yang sah (seperti YouTube, Vimeo, Dailymotion, dll.) yang memiliki kontrol teknis penuh atas distribusi materi mereka.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">2. Standar Verifikasi Izin Penyematan</h2>
          <p>
            Setiap tautan pemutar video yang terpasang diwajibkan melewati konfirmasi administratif untuk memastikan berasal dari kanal resmi pemegang lisensi atau platform penyiaran yang secara tegas memperbolehkan fitur penyematan eksternal (embed). Kami menolak dengan tegas tautan yang berasal dari situs pembajakan ilegal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">3. Prosedur Pemberitahuan dan Penarikan (Takedown)</h2>
          <p>
            Jika Anda adalah pemilik hak cipta yang sah atau agen kuasanya, dan meyakini bahwa materi metadata atau sematan pemutar di SeoulPlay melanggar hak cipta Anda, silakan ajukan laporan resmi melalui formulir di bawah ini. Tim redaksi kami akan memproses dan menghapus referensi terkait dalam kurun waktu 1x24 jam kerja.
          </p>
        </section>
      </div>

      {/* Takedown Notice Submission Form */}
      <div className="rounded-xl bg-[#0f1422] border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-white font-display text-lg font-semibold">
          <Mail className="w-5 h-5 text-rose-500" />
          <span>Formulir Permintaan Penarikan Konten / DMCA</span>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/80 p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">Pemberitahuan Berhasil Dikirim</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Terima kasih. Permintaan penarikan untuk judul "{workTitle}" telah masuk ke antrean investigasi tim redaksi untuk penanganan segera.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Karya Berhak Cipta *
                </label>
                <input
                  type="text"
                  required
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="Contoh: Queen of the Chaebol"
                  className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Pemilik Hak Cipta / Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Contoh: CJ ENM / Studio Dragon"
                  className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tautan Halaman SeoulPlay Terkait *
              </label>
              <input
                type="url"
                required
                value={infringingUrl}
                onChange={(e) => setInfringingUrl(e.target.value)}
                placeholder="https://seoulplay.example.com/title/..."
                className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Kontak Resmi Pemilik / Perwakilan *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="legal@perusahaan.com"
                className="w-full px-3 py-2 rounded-lg bg-[#141b29] border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
              >
                Kirim Laporan Hak Cipta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
