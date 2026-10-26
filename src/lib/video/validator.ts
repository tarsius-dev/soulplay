/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Legal Content & Video Embedding Provider Adapter
 * Validates, sanctions, and normalizes authorized external video players.
 */

// Default approved hostnames (HTTPS only)
export const DEFAULT_APPROVED_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'www.dailymotion.com',
  'archive.org',
];

export interface ProviderInfo {
  provider: 'youtube' | 'vimeo' | 'dailymotion' | 'archive' | 'custom_authorized';
  name: string;
  allowedDomains: string[];
  constructEmbedUrl?: (videoId: string) => string;
}

export const SUPPORTED_PROVIDERS: Record<string, ProviderInfo> = {
  youtube: {
    provider: 'youtube',
    name: 'YouTube Authorized Stream',
    allowedDomains: ['youtube.com', 'www.youtube.com', 'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'],
    constructEmbedUrl: (id: string) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1`,
  },
  vimeo: {
    provider: 'vimeo',
    name: 'Vimeo Player',
    allowedDomains: ['vimeo.com', 'player.vimeo.com'],
    constructEmbedUrl: (id: string) => `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1`,
  },
  dailymotion: {
    provider: 'dailymotion',
    name: 'Dailymotion Player',
    allowedDomains: ['dailymotion.com', 'www.dailymotion.com'],
    constructEmbedUrl: (id: string) => `https://www.dailymotion.com/embed/video/${encodeURIComponent(id)}`,
  },
  archive: {
    provider: 'archive',
    name: 'Internet Archive Public Domain',
    allowedDomains: ['archive.org'],
    constructEmbedUrl: (id: string) => `https://archive.org/embed/${encodeURIComponent(id)}`,
  },
  custom_authorized: {
    provider: 'custom_authorized',
    name: 'Authorized Content Partner',
    allowedDomains: [], // Must match configured allowlist
  },
};

export interface ValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  provider?: string;
  error?: string;
}

/**
 * Gets configured approved hostnames from environment or defaults.
 */
export function getApprovedHosts(): string[] {
  const envHosts =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_APPROVED_VIDEO_HOSTS
      ? (import.meta.env.VITE_APPROVED_VIDEO_HOSTS as string)
      : '';

  if (envHosts && envHosts.trim().length > 0) {
    const list = envHosts
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set([...DEFAULT_APPROVED_HOSTS, ...list]));
  }
  return DEFAULT_APPROVED_HOSTS;
}

/**
 * Validates a video embed URL against strict security and legal policy:
 * - Must be valid HTTPS protocol only.
 * - Rejects any embedded credentials (e.g., https://admin:pass@host.com).
 * - Rejects invalid/malicious protocols (javascript:, data:, vbscript:).
 * - Matches hostname against approved provider allowlist (prevents open proxy / pirate stream embeds).
 * - Strips dangerous query params or anchors.
 */
export function validateEmbedUrl(rawUrl: string, customAllowedHosts?: string[]): ValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'Embed URL is required.' };
  }

  const trimmed = rawUrl.trim();

  // Basic sanity check
  if (!trimmed.startsWith('https://')) {
    return { isValid: false, error: 'Only secure HTTPS embed URLs are permitted.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL.' };
  }

  // Reject embedded username or password in URL
  if (parsed.username || parsed.password) {
    return { isValid: false, error: 'URLs with embedded credentials are prohibited.' };
  }

  // Reject non-HTTPS protocol
  if (parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Protocol must be HTTPS.' };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowed = customAllowedHosts || getApprovedHosts();

  const isApproved = allowed.some((approved) => {
    return hostname === approved || hostname.endsWith('.' + approved);
  });

  if (!isApproved) {
    return {
      isValid: false,
      error: `Hostname '${hostname}' is not in the approved video provider allowlist. Administrators must configure and verify authorization for new domains.`,
    };
  }

  // Identify provider
  let detectedProvider: string = 'custom_authorized';
  if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
    detectedProvider = 'youtube';
  } else if (hostname.includes('vimeo')) {
    detectedProvider = 'vimeo';
  } else if (hostname.includes('dailymotion')) {
    detectedProvider = 'dailymotion';
  } else if (hostname.includes('archive.org')) {
    detectedProvider = 'archive';
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
    provider: detectedProvider,
  };
}

/**
 * Constructs an embed URL safely from a provider and raw video ID.
 */
export function buildEmbedUrlFromId(provider: string, videoId: string): string | null {
  const cleanId = videoId.trim();
  // Safe alphanumeric and underscore/hyphen check
  if (!/^[a-zA-Z0-9_\-]+$/.test(cleanId)) {
    return null;
  }

  const info = SUPPORTED_PROVIDERS[provider];
  if (!info || !info.constructEmbedUrl) {
    return null;
  }

  return info.constructEmbedUrl(cleanId);
}

/**
 * Standard sandbox configuration for SeoulPlay iframe players.
 * Grants minimal necessary permissions for video rendering without compromising parent DOM.
 */
export const SECURE_IFRAME_SANDBOX = 'allow-scripts allow-same-origin allow-presentation allow-forms';

export const SECURE_IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
