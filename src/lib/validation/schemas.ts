/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

// Slug regex: lowercase alphanumeric characters and hyphens, 2-100 chars
export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const TitleSchema = z.object({
  name: z.string().min(1, 'Title name is required').max(200, 'Title name too long'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be under 100 characters')
    .regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens (e.g. queen-of-the-chaebol)'),
  original_name: z.string().max(200).optional().nullable(),
  synopsis: z.string().min(10, 'Synopsis must be at least 10 characters').max(3000),
  poster_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  backdrop_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  release_year: z
    .number()
    .int()
    .min(1950, 'Year must be 1950 or later')
    .max(2035, 'Year cannot exceed 2035')
    .optional()
    .nullable(),
  content_type: z.enum(['drama', 'movie']),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  genre_ids: z.array(z.string().uuid('Invalid genre ID')).default([]),
});

export const EpisodeSchema = z.object({
  title_id: z.string().uuid('Invalid title ID'),
  season_id: z.string().uuid('Invalid season ID').optional().nullable(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens (e.g. episode-1)'),
  episode_number: z.number().int().min(1, 'Episode number must be 1 or higher'),
  name: z.string().min(1, 'Episode name is required').max(200),
  synopsis: z.string().max(2000).optional().nullable(),
  duration_minutes: z.number().int().min(1).max(600).optional().nullable(),
  status: z.enum(['draft', 'published']),
  // Video embed configuration
  video_provider: z.enum(['youtube', 'vimeo', 'dailymotion', 'archive', 'custom_authorized']).optional(),
  external_video_id: z.string().max(200).optional().nullable(),
  embed_url: z
    .string()
    .url('Embed URL must be a valid HTTPS URL')
    .startsWith('https://', 'Video embeds must use secure HTTPS')
    .optional()
    .nullable()
    .or(z.literal('')),
  authorization_confirmed: z.boolean().default(false),
}).refine(
  (data) => {
    // If an episode is published and has an embed URL, authorization must be confirmed!
    if (data.status === 'published' && data.embed_url && data.embed_url.trim().length > 0) {
      return data.authorization_confirmed === true;
    }
    return true;
  },
  {
    message: 'Legal authorization confirmation is strictly required / Konfirmasi izin hak cipta resmi wajib dicentang untuk mempublikasikan episode dengan video.',
    path: ['authorization_confirmed'],
  }
);

export const SearchQuerySchema = z.object({
  q: z.string().max(100).optional().default(''),
  genre: z.string().max(50).optional().default('all'),
  type: z.enum(['all', 'drama', 'movie']).optional().default('all'),
  sort: z.enum(['newest', 'year', 'popular']).optional().default('newest'),
});

export type TitleInput = z.infer<typeof TitleSchema>;
export type EpisodeInput = z.infer<typeof EpisodeSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
