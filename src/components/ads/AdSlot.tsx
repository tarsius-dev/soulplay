/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { getAdConfig, initializeAdScript } from '../../lib/ads/config';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default',
  format = 'auto',
  className = '',
}) => {
  const config = getAdConfig();

  useEffect(() => {
    if (config.enabled) {
      initializeAdScript();
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (e) {
        // Silently swallow adblocker errors
      }
    }
  }, [config.enabled]);

  // Clean empty layout when advertising is disabled (default in development)
  if (!config.enabled) {
    return null;
  }

  return (
    <div
      className={`ad-container my-4 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-[#0f141f] border border-slate-800/60 p-2 text-center text-xs text-slate-500 ${className}`}
      aria-label="Advertisement"
    >
      <span className="mb-1 text-[10px] tracking-wider uppercase text-slate-600">Sponsor</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px', width: '100%' }}
        data-ad-client={config.adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const HeaderAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot format="horizontal" className={`max-w-4xl mx-auto ${className || ''}`} />
);

export const ContentAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot format="rectangle" className={`max-w-2xl mx-auto ${className || ''}`} />
);

export const FooterAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot format="horizontal" className={`max-w-5xl mx-auto ${className || ''}`} />
);
