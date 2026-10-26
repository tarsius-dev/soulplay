/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Check, X, ExternalLink } from 'lucide-react';
import {
  buildShareData,
  buildSocialShareLinks,
  isWebShareSupported,
  copyToClipboard,
  SocialShareLink,
} from '../../lib/share/shareHelper';

interface ShareButtonProps {
  title: string;
  slug: string;
  contentType?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  slug,
  contentType = 'drama',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareData, setShareData] = useState(() => buildShareData(title, slug, contentType));
  const modalRef = useRef<HTMLDivElement>(null);

  // Keep shareData refreshed with current window location when mounted
  useEffect(() => {
    setShareData(buildShareData(title, slug, contentType));
  }, [title, slug, contentType]);

  // Handle ESC key to dismiss fallback modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Handle main share button click
  const handleShareClick = async () => {
    // If Web Share API is available, invoke native share sheet
    if (isWebShareSupported()) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        return; // Successfully shared or dismissed via system UI
      } catch (err: unknown) {
        // If aborted by user, don't force modal; if failed due to permissions or unsupport, open fallback modal
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: Open social sharing modal
    setIsModalOpen(true);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const socialLinks: SocialShareLink[] = buildSocialShareLinks(shareData);

  return (
    <>
      {/* Primary Trigger Button */}
      <button
        type="button"
        onClick={handleShareClick}
        aria-label={`Bagikan ${title}`}
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-medium text-sm transition-colors cursor-pointer select-none ${className}`}
      >
        <Share2 className="w-4 h-4 text-rose-400" />
        <span>Bagikan</span>
      </button>

      {/* Fallback Sharing Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md bg-[#121826] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 id="share-modal-title" className="text-base font-semibold text-white">
                    Bagikan Judul
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{title}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup dialog berbagi"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Social Share Grid - standard anchors avoid window.open */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pilih Media Sosial
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${item.colorClass} ${item.hoverClass}`}
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Link Copy Field */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Salin Tautan Langsung
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareData.url}
                  aria-label="Tautan judul"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 font-mono focus:outline-none focus:border-rose-500 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Salin tautan ke clipboard"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer tip */}
            <p className="text-[11px] text-slate-400 text-center">
              Teman Anda dapat langsung menonton tanpa perlu mengunduh aplikasi tambahan.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
