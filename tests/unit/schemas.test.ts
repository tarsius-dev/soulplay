/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { TitleSchema, EpisodeSchema } from '../../src/lib/validation/schemas';

describe('Zod Validation Schemas', () => {
  it('validates a correct Title record', () => {
    const valid = {
      name: 'Crash Landing on My Heart',
      slug: 'crash-landing-on-my-heart',
      original_name: '사랑의 불시착',
      synopsis: 'A paragliding heiress accidentally lands in an uncharted mountain territory.',
      release_year: 2024,
      content_type: 'drama',
      status: 'published',
      featured: true,
      genre_ids: [],
    };
    const parsed = TitleSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid slug with uppercase letters or special symbols', () => {
    const invalidSlug = {
      name: 'Bad Slug Title',
      slug: 'Bad_Slug!Title',
      synopsis: 'Valid synopsis long enough for validation checks.',
      content_type: 'drama',
      status: 'published',
      featured: false,
    };
    const parsed = TitleSchema.safeParse(invalidSlug);
    expect(parsed.success).toBe(false);
  });

  it('enforces legal authorization confirmation when publishing episode with embed URL', () => {
    const unconfirmedPublished = {
      title_id: '123e4567-e89b-12d3-a456-426614174000',
      slug: 'episode-1',
      episode_number: 1,
      name: 'Episode 1',
      status: 'published',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      authorization_confirmed: false, // Refused!
    };
    const parsed = EpisodeSchema.safeParse(unconfirmedPublished);
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.message).toContain('Legal authorization confirmation is strictly required');
  });

  it('passes episode validation when legal authorization is explicitly confirmed', () => {
    const confirmedPublished = {
      title_id: '123e4567-e89b-12d3-a456-426614174000',
      slug: 'episode-1',
      episode_number: 1,
      name: 'Episode 1',
      status: 'published',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      authorization_confirmed: true,
    };
    const parsed = EpisodeSchema.safeParse(confirmedPublished);
    expect(parsed.success).toBe(true);
  });
});
