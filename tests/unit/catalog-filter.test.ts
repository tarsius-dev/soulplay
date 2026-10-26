/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { catalogStore } from '../../src/lib/catalog/store';

describe('Catalog Store & Privacy Boundaries', () => {
  it('strictly excludes draft titles from public catalog queries', () => {
    const publicTitles = catalogStore.getPublicTitles();
    // Verify that all returned titles have status 'published'
    expect(publicTitles.every((t) => t.status === 'published')).toBe(true);

    // Verify specifically that our seed draft title 'signal-in-the-dark' is excluded
    const draftFound = publicTitles.some((t) => t.slug === 'signal-in-the-dark');
    expect(draftFound).toBe(false);
  });

  it('rejects anonymous retrieval of draft title by slug', () => {
    const result = catalogStore.getTitleBySlug('signal-in-the-dark', false);
    expect(result).toBeNull();
  });

  it('allows administrator retrieval of draft title by slug', () => {
    const result = catalogStore.getTitleBySlug('signal-in-the-dark', true);
    expect(result).not.toBeNull();
    expect(result?.name).toContain('Signal in the Dark');
    expect(result?.status).toBe('draft');
  });

  it('filters titles accurately by search query', () => {
    const results = catalogStore.getPublicTitles({ search: 'Chaebol' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('queen-of-the-chaebol');
  });

  it('filters titles accurately by Korean Hangul query', () => {
    const results = catalogStore.getPublicTitles({ search: '어둠' });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('filters titles by content type', () => {
    const movies = catalogStore.getPublicTitles({ contentType: 'movie' });
    expect(movies.every((m) => m.content_type === 'movie')).toBe(true);

    const dramas = catalogStore.getPublicTitles({ contentType: 'drama' });
    expect(dramas.every((d) => d.content_type === 'drama')).toBe(true);
  });

  it('refuses to expose video source embed when authorization is not confirmed', () => {
    // Episode 2 of Queen of the Chaebol ('44444444-0000-0000-0000-000000000002') has no confirmed authorized source
    const resolution = catalogStore.resolveVideoSource('44444444-0000-0000-0000-000000000002', false);
    expect(resolution.authorized).toBe(false);
    expect(resolution.embedUrl).toBeNull();
  });

  it('resolves valid video source when authorization is verified and domain is approved', () => {
    // Episode 1 ('44444444-0000-0000-0000-000000000001') has a verified YouTube embed
    const resolution = catalogStore.resolveVideoSource('44444444-0000-0000-0000-000000000001', false);
    expect(resolution.authorized).toBe(true);
    expect(resolution.embedUrl).toContain('https://www.youtube-nocookie.com');
  });
});
