/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdConfig {
  enabled: boolean;
  adsenseClientId?: string;
  provider: 'adsense' | 'custom' | 'none';
}

/**
 * Gets advertising configuration from validated environment variables.
 * Advertising is strictly DISABLED by default.
 */
export function getAdConfig(): AdConfig {
  const envEnabled =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADS_ENABLED
      ? import.meta.env.VITE_ADS_ENABLED === 'true'
      : false;

  const clientId =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_CLIENT
      ? (import.meta.env.VITE_ADSENSE_CLIENT as string).trim()
      : '';

  return {
    enabled: envEnabled && Boolean(clientId),
    adsenseClientId: clientId,
    provider: clientId ? 'adsense' : 'none',
  };
}

let scriptInjected = false;

/**
 * Safely loads external advertising scripts only if explicitly enabled in configuration
 * and approved by publisher policies.
 */
export function initializeAdScript(): void {
  const config = getAdConfig();
  if (!config.enabled || !config.adsenseClientId) {
    return;
  }

  if (typeof window === 'undefined' || scriptInjected) {
    return;
  }

  // Prevent duplicate script tags
  const existing = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
  if (existing) {
    scriptInjected = true;
    return;
  }

  // Validate client ID format: ca-pub-XXXXXXXXXXXXXXXX
  if (!/^ca-pub-\d+$/.test(config.adsenseClientId)) {
    console.warn('[SeoulPlay Ads] Invalid AdSense client ID format. Script injection aborted.');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseClientId)}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  scriptInjected = true;
}
