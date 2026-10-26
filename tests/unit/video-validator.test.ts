/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmbedUrl,
  buildEmbedUrlFromId,
  DEFAULT_APPROVED_HOSTS,
} from '../../src/lib/video/validator';

describe('Video Embed Validator & Security Checks', () => {
  it('approves legitimate YouTube HTTPS embed URLs', () => {
    const valid = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ';
    const result = validateEmbedUrl(valid);
    expect(result.isValid).toBe(true);
    expect(result.provider).toBe('youtube');
  });

  it('approves legitimate Vimeo HTTPS embed URLs', () => {
    const valid = 'https://player.vimeo.com/video/76979871';
    const result = validateEmbedUrl(valid);
    expect(result.isValid).toBe(true);
    expect(result.provider).toBe('vimeo');
  });

  it('approves legitimate Internet Archive public domain embeds', () => {
    const valid = 'https://archive.org/embed/korean_cinema_archive';
    const result = validateEmbedUrl(valid);
    expect(result.isValid).toBe(true);
    expect(result.provider).toBe('archive');
  });

  it('rejects unencrypted HTTP URLs strictly', () => {
    const insecure = 'http://www.youtube.com/embed/dQw4w9WgXcQ';
    const result = validateEmbedUrl(insecure);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('secure HTTPS');
  });

  it('rejects unauthorized or unknown third-party domains (pirate streaming sites)', () => {
    const pirateUrl = 'https://pirate-streams-free-kdrama.ru/player/video123';
    const result = validateEmbedUrl(pirateUrl);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('not in the approved video provider allowlist');
  });

  it('rejects malicious URL credential injection', () => {
    const exploit = 'https://admin:password@www.youtube.com/embed/dQw4w9WgXcQ';
    const result = validateEmbedUrl(exploit);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('embedded credentials');
  });

  it('rejects javascript: and data: pseudoprotocols', () => {
    const jsProtocol = 'javascript:alert(1)';
    const result = validateEmbedUrl(jsProtocol);
    expect(result.isValid).toBe(false);

    const dataProtocol = 'data:text/html,<script>alert(1)</script>';
    const resultData = validateEmbedUrl(dataProtocol);
    expect(resultData.isValid).toBe(false);
  });

  it('safely builds embed URL from video ID', () => {
    const url = buildEmbedUrlFromId('youtube', 'dQw4w9WgXcQ');
    expect(url).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1');
  });

  it('rejects video ID with illegal injection characters', () => {
    const maliciousId = 'abc"><script>alert(1)</script>';
    const url = buildEmbedUrlFromId('youtube', maliciousId);
    expect(url).toBeNull();
  });
});
