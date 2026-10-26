/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { AuthProvider } from './lib/auth/context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { DramasPage } from './pages/DramasPage';
import { MoviesPage } from './pages/MoviesPage';
import { GenresPage } from './pages/GenresPage';
import { SearchPage } from './pages/SearchPage';
import { TitleDetailPage } from './pages/TitleDetailPage';
import { WatchPage } from './pages/WatchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CopyrightPage } from './pages/CopyrightPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminTitlesPage } from './pages/admin/AdminTitlesPage';
import { AdminTitleFormPage } from './pages/admin/AdminTitleFormPage';
import { AdminSeasonsPage } from './pages/admin/AdminSeasonsPage';
import { AdminEpisodeFormPage } from './pages/admin/AdminEpisodeFormPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// 404 Not Found Page
const NotFoundPage = () => (
  <div className="py-28 max-w-md mx-auto text-center space-y-4">
    <div className="text-5xl font-bold font-display text-rose-500">404</div>
    <h1 className="text-2xl font-bold font-display text-white">Halaman Tidak Ditemukan</h1>
    <p className="text-xs text-slate-400">
      Halaman yang Anda tuju tidak dapat ditemukan. Alamat tautan mungkin telah berpindah atau tidak lagi tersedia.
    </p>
    <div className="pt-2">
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-block"
      >
        Kembali ke Beranda SeoulPlay
      </Link>
    </div>
  </div>
);

export default function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin') && location !== '/admin/login';

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#0b0e14] text-[#f1f5f9]">
        {/* Render Navbar on all pages except inside the admin management workspace */}
        {!isAdminRoute && <Navbar />}

        <main className={`flex-1 ${!isAdminRoute ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full' : ''}`}>
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={HomePage} />
            <Route path="/dramas" component={DramasPage} />
            <Route path="/movies" component={MoviesPage} />
            <Route path="/genres/:slug" component={GenresPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/title/:slug" component={TitleDetailPage} />
            <Route path="/title/:slug/watch/:episodeSlug" component={WatchPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/copyright" component={CopyrightPage} />

            {/* Admin Routes */}
            <Route path="/admin/login" component={AdminLoginPage} />
            <Route path="/admin" component={AdminDashboardPage} />
            <Route path="/admin/titles" component={AdminTitlesPage} />
            <Route path="/admin/titles/new" component={AdminTitleFormPage} />
            <Route path="/admin/titles/:id/edit" component={AdminTitleFormPage} />
            <Route path="/admin/titles/:id/seasons" component={AdminSeasonsPage} />
            <Route path="/admin/episodes/new" component={AdminEpisodeFormPage} />
            <Route path="/admin/episodes/:id/edit" component={AdminEpisodeFormPage} />
            <Route path="/admin/settings" component={AdminSettingsPage} />

            {/* Fallback 404 */}
            <Route component={NotFoundPage} />
          </Switch>
        </main>

        {/* Render Footer on public pages */}
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}
