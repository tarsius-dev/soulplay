/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../../lib/auth/context';
import {
  LayoutDashboard,
  Film,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { updatePageMeta } from '../../lib/seo/meta';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    updatePageMeta({
      title: `Panel Admin — ${title}`,
      description: subtitle || 'Panel administrasi dan kurasi katalog resmi SeoulPlay.',
    });
    if (!isLoading && !isAdmin) {
      setLocation('/admin/login');
    }
  }, [title, subtitle, isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-slate-400">
        Memverifikasi sesi administrator...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
    { label: 'Katalog & Judul', href: '/admin/titles', icon: Film },
    { label: 'Keamanan & Penyedia', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen -my-8 -mx-4 sm:-mx-6 lg:-mx-8 flex flex-col md:flex-row bg-[#080b10]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0b0e15] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">SeoulPlay Admin</div>
              <div className="text-[10px] text-rose-400 font-medium">Konsol Administrator</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? location === '/admin'
                  : location.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-600/15 text-rose-400 border border-rose-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Kembali ke Situs Publik</span>
            </Link>
          </div>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="text-xs font-medium text-white truncate">{user?.email || 'Administrator'}</div>
            <div className="text-[10px] text-emerald-400">Profil Admin Terverifikasi</div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors"
            title="Keluar dari sesi Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {children}
      </main>
    </div>
  );
};
