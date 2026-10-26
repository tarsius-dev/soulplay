/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Title, Episode } from '../types';

export function updatePageMeta({
  title,
  description,
  image,
  type = 'website',
  canonicalUrl,
}: {
  title: string;
  description: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
}) {
  if (typeof document === 'undefined') return;

  const siteSuffix = 'SeoulPlay — Nonton & Temukan Drama Korea Gratis';
  const fullTitle = !title || title === 'Beranda' ? siteSuffix : `${title} | ${siteSuffix}`;
  document.title = fullTitle;

  const setMeta = (name: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      if (isProperty) el.setAttribute('property', name);
      else el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', fullTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:type', type, true);
  setMeta('og:site_name', 'SeoulPlay', true);
  setMeta('og:locale', 'id_ID', true);

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);

  if (image) {
    setMeta('og:image', image, true);
    setMeta('twitter:image', image);
  }

  // Canonical link
  if (canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }
}

export function generateStructuredDataForTitle(
  title: Title,
  rating?: { ratingValue: number; ratingCount: number }
) {
  const isMovie = title.content_type === 'movie';
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': isMovie ? 'Movie' : 'TVSeries',
    inLanguage: 'id',
    name: title.name,
    alternateName: title.original_name || undefined,
    description: title.synopsis,
    image: title.poster_url || undefined,
    datePublished: title.release_year ? `${title.release_year}-01-01` : undefined,
    genre: title.genres?.map((g) => g.name) || [],
  };

  if (rating && rating.ratingCount > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

export function generateStructuredDataForEpisode(title: Title, episode: Episode) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVEpisode',
    inLanguage: 'id',
    name: episode.name,
    episodeNumber: episode.episode_number,
    description: episode.synopsis || title.synopsis,
    partOfSeries: {
      '@type': 'TVSeries',
      name: title.name,
    },
    duration: episode.duration_minutes ? `PT${episode.duration_minutes}M` : undefined,
  };
}
