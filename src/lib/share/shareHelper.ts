/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

export interface SocialShareLink {
  id: 'whatsapp' | 'telegram' | 'twitter' | 'facebook';
  name: string;
  url: string;
  colorClass: string;
  hoverClass: string;
}

/**
 * Builds standard metadata payload for sharing a drama or movie
 */
export function buildShareData(
  title: string,
  slug: string,
  contentType: string = 'drama'
): ShareDataPayload {
  const typeLabel = contentType.toLowerCase() === 'movie' ? 'Film' : 'Drama';
  const shareTitle = `${title} - Streaming Subtitle Indonesia di SeoulPlay`;
  const shareText = `Tonton ${typeLabel} "${title}" dengan takarir subtitle Indonesia resmi berkualitas tinggi di SeoulPlay!`;
  
  let shareUrl = `https://seoulplay.id/title/${slug}`;
  if (typeof window !== 'undefined' && window.location) {
    shareUrl = window.location.href;
  }

  return {
    title: shareTitle,
    text: shareText,
    url: shareUrl,
  };
}

/**
 * Generates platform-specific direct share URLs
 */
export function buildSocialShareLinks(data: ShareDataPayload): SocialShareLink[] {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedText = encodeURIComponent(`${data.text}\n`);
  const encodedCombined = encodeURIComponent(`${data.text} ${data.url}`);

  return [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedCombined}`,
      colorClass: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30',
      hoverClass: 'hover:bg-emerald-600/20 hover:border-emerald-500/50',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      colorClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      hoverClass: 'hover:bg-sky-500/20 hover:border-sky-500/50',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      colorClass: 'bg-slate-700/20 text-slate-200 border-slate-600/40',
      hoverClass: 'hover:bg-slate-700/40 hover:border-slate-500/60',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      colorClass: 'bg-blue-600/10 text-blue-400 border-blue-500/30',
      hoverClass: 'hover:bg-blue-600/20 hover:border-blue-500/50',
    },
  ];
}

/**
 * Checks if Web Share API is available in the current client browser environment
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Safely copies text to the user's clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy execCommand fallback
    }
  }

  // Fallback for older browsers or restricted contexts
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch {
      return false;
    }
  }

  return false;
}
