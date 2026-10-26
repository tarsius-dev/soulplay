/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { updatePageMeta } from '../lib/seo/meta';
import { Film, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Tentang SeoulPlay',
      description: 'Mengenal SeoulPlay, misi kami menghadirkan katalog drama Korea legal, terkurasi, dan bebas biaya untuk penonton Indonesia.',
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Tentang SeoulPlay
        </h1>
        <p className="text-rose-400 text-sm mt-1">
          Menghubungkan penonton Indonesia dengan mahakarya sinema dan drama Korea terbaik.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          <strong>SeoulPlay</strong> hadir dengan satu komitmen utama: menjadikan penemuan drama Korea dan film bermutu tinggi lebih mudah diakses, legal, terkurasi dengan rapi, dan sepenuhnya gratis tanpa mewajibkan registrasi akun atau langganan berbayar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <Film className="w-6 h-6 text-rose-500" />
            <h3 className="text-base font-semibold text-white">Kurasi Editorial Berkualitas</h3>
            <p className="text-xs text-slate-400">
              Setiap judul dilengkapi judul asli Hangul, sinopsis mendalam, klasifikasi genre yang tepat, dan panduan urutan episode yang runtut.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Streaming Sah & Bebas Bajakan</h3>
            <p className="text-xs text-slate-400">
              Kami tidak melakukan scraping situs bajakan. Semua pemutaran video menggunakan pemutar sematan resmi berlisensi.
            </p>
          </div>
        </div>

        <p>
          Baik Anda baru pertama kali menonton drama Korea romantis maupun penggemar berat kisah sejarah sageuk atau thriller kriminal, SeoulPlay menyediakan ruang nyaman dan bersih untuk melengkapi pengalaman menonton Anda.
        </p>
      </div>
    </div>
  );
};
