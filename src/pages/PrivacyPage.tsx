/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { updatePageMeta } from '../lib/seo/meta';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Kebijakan Privasi',
      description: 'Kebijakan privasi penonton, perlindungan data pribadi, dan standar penggunaan cookie di SeoulPlay Indonesia.',
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-sm text-slate-300 leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold font-display text-white">Kebijakan Privasi</h1>
        <p className="text-xs text-slate-500 mt-1">Terakhir Diperbarui: Oktober 2026</p>
      </div>

      <p>
        Privasi Anda sangat kami hargai. SeoulPlay dirancang sebagai situs direktori hiburan bebas hambatan yang tidak mewajibkan penonton untuk mendaftar akun, mengisi data pribadi, atau memasukkan informasi pembayaran.
      </p>

      <h2 className="text-base font-semibold text-white pt-2">1. Informasi yang Tidak Kami Kumpulkan</h2>
      <p>
        Kami tidak mengumpulkan nama, nomor telepon, atau data keuangan penonton umum. Kami tidak menyimpan riwayat tontonan pribadi yang terhubung dengan identitas penonton.
      </p>

      <h2 className="text-base font-semibold text-white pt-2">2. Pemutar Sematan Pihak Ketiga</h2>
      <p>
        Ketika Anda memutar video melalui pemutar sematan eksternal resmi (seperti YouTube atau Vimeo), penyedia layanan tersebut dapat menetapkan cookie analitik sesuai kebijakan privasi masing-masing. Kami menggunakan atribut iframe terlindungi (sandbox) dan header perujuk yang aman untuk melindungi privasi perangkat Anda.
      </p>

      <h2 className="text-base font-semibold text-white pt-2">3. Iklan dan Cookie</h2>
      <p>
        Penayangan iklan dinonaktifkan secara bawaan dalam versi pengembangan. Jika diaktifkan di masa mendatang, mitra periklanan tepercaya dapat menayangkan iklan kontekstual yang patuh pada regulasi perlindungan data pribadi.
      </p>
    </div>
  );
};
