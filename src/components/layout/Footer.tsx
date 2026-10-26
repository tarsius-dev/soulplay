/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#090c12] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission in Indonesian */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-bold font-display text-white">
                Seoul<span className="text-rose-500">Play</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Platform gratis penemuan dan panduan editorial drama Korea dan film terpopuler. Nikmati sinopsis mendalam, panduan musim lengkap, dan tonton melalui pemutar video resmi pihak ketiga.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kebijakan kepatuhan ketat: Tanpa pembajakan, tidak meng-host file video secara langsung.</span>
            </div>
          </div>

          {/* Catalog Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dramas" className="hover:text-rose-400 transition-colors">
                  Drama Korea (Drakor)
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-rose-400 transition-colors">
                  Film Layar Lebar
                </Link>
              </li>
              <li>
                <Link href="/genres/romance" className="hover:text-rose-400 transition-colors">
                  Romantis & Melodrama
                </Link>
              </li>
              <li>
                <Link href="/genres/sageuk" className="hover:text-rose-400 transition-colors">
                  Sageuk (Kerajaan/Sejarah)
                </Link>
              </li>
              <li>
                <Link href="/genres/thriller" className="hover:text-rose-400 transition-colors">
                  Aksi & Thriller Kriminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Informasi & Legalitas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/copyright" className="hover:text-rose-400 transition-colors">
                  Hak Cipta & DMCA
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-rose-400 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-400 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rose-400 transition-colors">
                  Tentang SeoulPlay
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition-colors">
                  Hubungi Redaksi
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-rose-400 text-slate-500 transition-colors">
                  Portal Administrator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SeoulPlay Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat khusus untuk pecinta drama Korea di Indonesia</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
