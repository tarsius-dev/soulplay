/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  validateEmbedUrl,
  SECURE_IFRAME_SANDBOX,
  SECURE_IFRAME_ALLOW,
  SUPPORTED_PROVIDERS,
} from '../../lib/video/validator';
import { AlertCircle, ShieldCheck, Film, Play } from 'lucide-react';

interface VideoPlayerProps {
  embedUrl?: string | null;
  provider?: string | null;
  titleName: string;
  episodeName?: string;
  isAuthorized?: boolean;
  unavailableReason?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  embedUrl,
  provider,
  titleName,
  episodeName,
  isAuthorized = false,
  unavailableReason,
}) => {
  const [hasStarted, setHasStarted] = useState(false);

  // If there's no embed URL or authorization is not confirmed:
  if (!embedUrl || !isAuthorized) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#0d121d] border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80" />
        <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
            Streaming Video Resmi Belum Tersedia
          </h3>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            {unavailableReason ||
              'Episode ini saat ini belum memiliki pemutar video resmi yang telah dikonfirmasi hak distribusinya. SeoulPlay tidak memfasilitasi streaming bajakan.'}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Katalog informasi editorial dan panduan episode tetap dapat Anda akses di bawah.</span>
          </div>
        </div>
      </div>
    );
  }

  // Validate the URL through the strict security allowlist
  const validation = validateEmbedUrl(embedUrl);
  if (!validation.isValid) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#0d121d] border border-rose-900/40 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800/50 flex items-center justify-center mb-3 text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-rose-300 mb-1">
          Kesalahan Verifikasi Tautan Pemutar
        </h4>
        <p className="text-xs text-rose-200/70 max-w-md">
          {validation.error || 'Alamat embed video yang dikonfigurasi tidak lolos verifikasi izin domain.'}
        </p>
      </div>
    );
  }

  const providerDisplayName =
    provider && SUPPORTED_PROVIDERS[provider]?.name
      ? SUPPORTED_PROVIDERS[provider].name
      : 'Pemutar Resmi Terverifikasi';

  const safeUrl = validation.sanitizedUrl || embedUrl;
  const frameTitle = `Pemutar Video: ${titleName}${episodeName ? ` - ${episodeName}` : ''}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl group">
      {/* Click-to-load poster gate */}
      {!hasStarted ? (
        <div
          className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#121826] via-[#0d111a] to-[#080b11] text-center p-6 cursor-pointer"
          onClick={() => setHasStarted(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setHasStarted(true);
          }}
          aria-label={`Buka pemutar video: ${frameTitle}`}
        >
          <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-200 mb-4">
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </div>
          <div className="text-base font-semibold text-white tracking-tight mb-1">
            Putar Sekarang: {episodeName || titleName}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-rose-400 font-medium">{providerDisplayName}</span>
            <span>·</span>
            <span>Klik untuk memuat pemutar video resmi</span>
          </div>
        </div>
      ) : (
        <iframe
          src={safeUrl}
          title={frameTitle}
          sandbox={SECURE_IFRAME_SANDBOX}
          allow={SECURE_IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0 absolute inset-0"
        />
      )}
    </div>
  );
};
