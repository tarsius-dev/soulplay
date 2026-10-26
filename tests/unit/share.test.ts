/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildShareData,
  buildSocialShareLinks,
  isWebShareSupported,
  copyToClipboard,
} from '../../src/lib/share/shareHelper';

describe('Share Helper & Web Share API utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildShareData', () => {
    it('constructs correct metadata for drama', () => {
      const data = buildShareData('Crash Landing on You', 'crash-landing-on-you', 'drama');
      expect(data.title).toContain('Crash Landing on You');
      expect(data.title).toContain('SeoulPlay');
      expect(data.text).toContain('Drama "Crash Landing on You"');
      expect(data.text).toContain('subtitle Indonesia');
      expect(data.url).toContain('/title/crash-landing-on-you');
    });

    it('constructs correct metadata for movie', () => {
      const data = buildShareData('Parasite', 'parasite', 'movie');
      expect(data.text).toContain('Film "Parasite"');
      expect(data.url).toContain('/title/parasite');
    });
  });

  describe('buildSocialShareLinks', () => {
    it('generates valid URLs for all supported social platforms', () => {
      const shareData = {
        title: 'Vincenzo',
        text: 'Tonton Vincenzo di SeoulPlay',
        url: 'https://seoulplay.id/title/vincenzo',
      };

      const links = buildSocialShareLinks(shareData);
      expect(links).toHaveLength(4);

      const whatsapp = links.find((l) => l.id === 'whatsapp');
      expect(whatsapp).toBeDefined();
      expect(whatsapp?.url).toContain('https://api.whatsapp.com/send?text=');
      expect(whatsapp?.url).toContain(encodeURIComponent('https://seoulplay.id/title/vincenzo'));

      const telegram = links.find((l) => l.id === 'telegram');
      expect(telegram).toBeDefined();
      expect(telegram?.url).toContain('https://t.me/share/url?url=');

      const twitter = links.find((l) => l.id === 'twitter');
      expect(twitter).toBeDefined();
      expect(twitter?.url).toContain('https://twitter.com/intent/tweet?text=');

      const facebook = links.find((l) => l.id === 'facebook');
      expect(facebook).toBeDefined();
      expect(facebook?.url).toContain('https://www.facebook.com/sharer/sharer.php?u=');
    });
  });

  describe('isWebShareSupported', () => {
    it('returns true when navigator.share is defined as a function', () => {
      const originalShare = navigator.share;
      try {
        Object.defineProperty(navigator, 'share', {
          value: vi.fn(),
          configurable: true,
          writable: true,
        });
        expect(isWebShareSupported()).toBe(true);
      } finally {
        if (originalShare) {
          Object.defineProperty(navigator, 'share', {
            value: originalShare,
            configurable: true,
            writable: true,
          });
        } else {
          // @ts-ignore
          delete navigator.share;
        }
      }
    });

    it('returns false when navigator.share is undefined', () => {
      const originalShare = navigator.share;
      try {
        // @ts-ignore
        delete navigator.share;
        expect(isWebShareSupported()).toBe(false);
      } finally {
        if (originalShare) {
          Object.defineProperty(navigator, 'share', {
            value: originalShare,
            configurable: true,
            writable: true,
          });
        }
      }
    });
  });

  describe('copyToClipboard', () => {
    it('calls navigator.clipboard.writeText when supported', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      const originalClipboard = navigator.clipboard;

      try {
        Object.defineProperty(navigator, 'clipboard', {
          value: { writeText: writeTextMock },
          configurable: true,
          writable: true,
        });

        const success = await copyToClipboard('https://seoulplay.id/title/test');
        expect(success).toBe(true);
        expect(writeTextMock).toHaveBeenCalledWith('https://seoulplay.id/title/test');
      } finally {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          configurable: true,
          writable: true,
        });
      }
    });
  });
});
