/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ContentType = 'drama' | 'movie';
export type TitleStatus = 'draft' | 'published' | 'archived';
export type EpisodeStatus = 'draft' | 'published';

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Title {
  id: string;
  slug: string;
  name: string;
  original_name?: string | null;
  synopsis: string;
  poster_url?: string | null;
  backdrop_url?: string | null;
  release_year?: number | null;
  content_type: ContentType;
  status: TitleStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  genres?: Genre[];
  seasons_count?: number;
  episodes_count?: number;
}

export interface Season {
  id: string;
  title_id: string;
  season_number: number;
  name?: string | null;
  created_at?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  title_id: string;
  season_id?: string | null;
  slug: string;
  episode_number: number;
  name: string;
  synopsis?: string | null;
  duration_minutes?: number | null;
  status: EpisodeStatus;
  created_at: string;
  updated_at: string;
  video_source?: VideoSource | null;
}

export interface VideoSource {
  id: string;
  episode_id: string;
  provider: 'youtube' | 'vimeo' | 'dailymotion' | 'archive' | 'custom_authorized';
  external_video_id?: string | null;
  embed_url: string;
  authorization_confirmed: boolean;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email?: string;
  role: 'administrator';
  created_at: string;
}

export interface CatalogStats {
  publishedTitlesCount: number;
  draftTitlesCount: number;
  totalEpisodesCount: number;
  genresCount: number;
}
