/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X, Play } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Drama Korea', href: '/dramas' },
    { label: 'Film Korea', href: '/movies' },
    { label: 'Genre', href: '/genres/romance' },
    { label: 'Pencarian', href: '/search' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-rose-400 transition-colors">
            Seoul<span className="text-rose-500">Play</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Clean Indonesian labels) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive =
              location === link.href || (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-rose-400 font-semibold border-b-2 border-rose-500'
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Search Action Only (No Admin button visible in public frontend) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#141b29] border border-slate-700/80 text-slate-300 hover:text-white hover:border-rose-500/50 hover:bg-[#182133] transition-all"
            aria-label="Cari drama"
          >
            <Search className="w-3.5 h-3.5 text-rose-400" />
            <span>Cari Judul...</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/search" className="p-2 text-slate-400 hover:text-white" aria-label="Cari drama">
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (No admin links) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0d121c] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
