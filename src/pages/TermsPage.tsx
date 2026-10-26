/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { updatePageMeta } from '../lib/seo/meta';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Syarat & Ketentuan Penggunaan',
      description: 'Syarat dan ketentuan hukum yang berlaku bagi pengguna situs SeoulPlay Indonesia.',
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-sm text-slate-300 leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold font-display text-white">Syarat & Ketentuan</h1>
        <p className="text-xs text-slate-500 mt-1">Terakhir Diperbarui: Oktober 2026</p>
      </div>

      <p>
        Dengan mengakses dan menikmati konten di SeoulPlay, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan penggunaan di bawah ini.
      </p>

      <h2 className="text-base font-semibold text-white pt-2">1. Penggunaan yang Diizinkan</h2>
      <p>
        SeoulPlay disediakan khusus untuk tujuan hiburan pribadi non-komersial. Pengguna dilarang melakukan scraping data massal otomatis, rekayasa balik (reverse engineering), atau berupaya membobol pembatasan keamanan pemutar video.
      </p>

      <h2 className="text-base font-semibold text-white pt-2">2. Konten Pihak Ketiga</h2>
      <p>
        Ketersediaan materi video sepenuhnya diatur oleh platform penyedia sematan resmi pihak ketiga. SeoulPlay tidak menjamin ketersediaan konten tanpa henti jika pihak penyedia mencabut izin publikasi video tersebut.
      </p>
    </div>
  );
};
