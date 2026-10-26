/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Title, Genre, Season, Episode, VideoSource, CatalogStats } from '../types';
import { validateEmbedUrl } from '../video/validator';

// Initial Seed Genres (Names in Indonesian, slugs standardized)
export const INITIAL_GENRES: Genre[] = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Romantis', slug: 'romance' },
  { id: '11111111-0000-0000-0000-000000000002', name: 'Thriller', slug: 'thriller' },
  { id: '11111111-0000-0000-0000-000000000003', name: 'Melodrama', slug: 'melodrama' },
  { id: '11111111-0000-0000-0000-000000000004', name: 'Sageuk (Sejarah)', slug: 'sageuk' },
  { id: '11111111-0000-0000-0000-000000000005', name: 'Misteri', slug: 'mystery' },
  { id: '11111111-0000-0000-0000-000000000006', name: 'Kriminal', slug: 'crime' },
  { id: '11111111-0000-0000-0000-000000000007', name: 'Fantasi', slug: 'fantasy' },
  { id: '11111111-0000-0000-0000-000000000008', name: 'Komedi', slug: 'comedy' },
];

// Initial Seed Titles in Indonesian
export const INITIAL_TITLES: Title[] = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    slug: 'queen-of-the-chaebol',
    name: 'Queen of the Chaebol',
    original_name: '어둠 속의 찬란',
    synopsis:
      'Di tengah sengitnya persaingan konglomerat ritel di Seoul, pewaris Park Seo-yoon harus menghadapi intrik dewan direksi serta menjalin kerja sama tak terduga dengan penasihat hukum penuh rahasia. Drama romansa kantor berkelas tinggi tentang ambisi, kesetiaan, dan cinta sejati.',
    poster_url: '/src/assets/images/poster_queen_chaebol_1792737531897.jpg',
    backdrop_url: '/src/assets/images/hero_kdrama_cinematic_1792737531695.jpg',
    release_year: 2024,
    content_type: 'drama',
    status: 'published',
    featured: true,
    created_at: '2024-03-01T08:00:00Z',
    updated_at: '2024-03-01T08:00:00Z',
    genres: [
      { id: '11111111-0000-0000-0000-000000000001', name: 'Romantis', slug: 'romance' },
      { id: '11111111-0000-0000-0000-000000000003', name: 'Melodrama', slug: 'melodrama' },
    ],
  },
  {
    id: '22222222-0000-0000-0000-000000000002',
    slug: 'the-city-of-shadows',
    name: 'The City of Shadows',
    original_name: '어둠의 도시',
    synopsis:
      'Di tengah malam Seoul yang basah diguyur hujan, seorang detektif veteran membongkar sindikat misterius di balik gemerlap Gangnam. Ketika kasus tersebut menyentuh dendam masa lalunya, ia bertekad mengungkap kebenaran tanpa pandang bulu.',
    poster_url: '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    backdrop_url: '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    release_year: 2024,
    content_type: 'movie',
    status: 'published',
    featured: false,
    created_at: '2024-04-10T10:00:00Z',
    updated_at: '2024-04-10T10:00:00Z',
    genres: [
      { id: '11111111-0000-0000-0000-000000000002', name: 'Thriller', slug: 'thriller' },
      { id: '11111111-0000-0000-0000-000000000006', name: 'Kriminal', slug: 'crime' },
    ],
  },
  {
    id: '22222222-0000-0000-0000-000000000003',
    slug: 'the-whispers-of-gyeongbokgung',
    name: 'The Whispers of Gyeongbokgung',
    original_name: '경복궁의 속삭임',
    synopsis:
      'Berlatar era kejayaan Dinasti Joseon, seorang ahli astronomi istana dan seorang cendekiawan wanita yang menyamar menyelidiki pertanda anomali bintang yang menutupi rencana kudeta rahasia di dalam gerbang istana kerajaan.',
    poster_url: '/src/assets/images/poster_joseon_fantasy_1792737533618.jpg',
    backdrop_url: '/src/assets/images/poster_joseon_fantasy_1792737533618.jpg',
    release_year: 2024,
    content_type: 'drama',
    status: 'published',
    featured: true,
    created_at: '2024-05-15T12:00:00Z',
    updated_at: '2024-05-15T12:00:00Z',
    genres: [
      { id: '11111111-0000-0000-0000-000000000004', name: 'Sageuk (Sejarah)', slug: 'sageuk' },
      { id: '11111111-0000-0000-0000-000000000005', name: 'Misteri', slug: 'mystery' },
    ],
  },
  {
    id: '22222222-0000-0000-0000-000000000004',
    slug: 'coastal-whispers',
    name: 'Coastal Whispers',
    original_name: '해변의 기억',
    synopsis:
      'Merasa lelah dengan kehidupan kerja di Seoul, seorang arsitek muda memutuskan menenangkan diri di sebuah desa pesisir Pulau Jeju. Sambil merenovasi rumah batu tua warisan sang nenek, ia menemukan kehangatan dan romansa yang menyejukkan hati.',
    poster_url: '/src/assets/images/poster_jeju_romance_1792737533313.jpg',
    backdrop_url: '/src/assets/images/poster_jeju_romance_1792737533313.jpg',
    release_year: 2024,
    content_type: 'drama',
    status: 'published',
    featured: false,
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-06-01T09:00:00Z',
    genres: [
      { id: '11111111-0000-0000-0000-000000000001', name: 'Romantis', slug: 'romance' },
      { id: '11111111-0000-0000-0000-000000000008', name: 'Komedi', slug: 'comedy' },
    ],
  },
  {
    id: '22222222-0000-0000-0000-000000000005',
    slug: 'signal-in-the-dark',
    name: 'Signal in the Dark (Draft)',
    original_name: '비밀의 신호',
    synopsis:
      'Draf editorial drama yang belum dipublikasikan untuk menguji kepatuhan keamanan data agar judul draf tidak pernah muncul ke publik.',
    poster_url: '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    backdrop_url: '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    release_year: 2025,
    content_type: 'drama',
    status: 'draft',
    featured: false,
    created_at: '2024-07-01T15:00:00Z',
    updated_at: '2024-07-01T15:00:00Z',
    genres: [{ id: '11111111-0000-0000-0000-000000000002', name: 'Thriller', slug: 'thriller' }],
  },
];

// Initial Seasons
export const INITIAL_SEASONS: Season[] = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    title_id: '22222222-0000-0000-0000-000000000001',
    season_number: 1,
    name: 'Musim 1: Takhta Emas',
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    title_id: '22222222-0000-0000-0000-000000000001',
    season_number: 2,
    name: 'Musim 2: Pembalasan',
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    title_id: '22222222-0000-0000-0000-000000000003',
    season_number: 1,
    name: 'Musim 1: Rahasia Bintang',
  },
  {
    id: '33333333-0000-0000-0000-000000000004',
    title_id: '22222222-0000-0000-0000-000000000004',
    season_number: 1,
    name: 'Musim 1: Hari-hari di Pesisir',
  },
];

// Initial Episodes
export const INITIAL_EPISODES: Episode[] = [
  // Queen of the Chaebol Season 1
  {
    id: '44444444-0000-0000-0000-000000000001',
    title_id: '22222222-0000-0000-0000-000000000001',
    season_id: '33333333-0000-0000-0000-000000000001',
    slug: 'episode-1',
    episode_number: 1,
    name: 'Episode 1: Menara Emas',
    synopsis: 'Park Seo-yoon resmi memimpin toserba utama di tengah kejanggalan audit internal yang mengancam kredibilitas keluarga.',
    duration_minutes: 68,
    status: 'published',
    created_at: '2024-03-01T08:00:00Z',
    updated_at: '2024-03-01T08:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000002',
    title_id: '22222222-0000-0000-0000-000000000001',
    season_id: '33333333-0000-0000-0000-000000000001',
    slug: 'episode-2',
    episode_number: 2,
    name: 'Episode 2: Kaca yang Pecah',
    synopsis: 'Manuver mendadak salah satu dewan direksi memaksa Seo-yoon mencari bantuan dari ahli hukum independen, Lee Jin-woo.',
    duration_minutes: 65,
    status: 'published',
    created_at: '2024-03-02T08:00:00Z',
    updated_at: '2024-03-02T08:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000003',
    title_id: '22222222-0000-0000-0000-000000000001',
    season_id: '33333333-0000-0000-0000-000000000001',
    slug: 'episode-3',
    episode_number: 3,
    name: 'Episode 3: Aliansi Tengah Malam',
    synopsis: 'Fakta mengejutkan tentang wasiat mendiang komisaris terbongkar menjelang acara perayaan ulang tahun perusahaan.',
    duration_minutes: 70,
    status: 'published',
    created_at: '2024-03-03T08:00:00Z',
    updated_at: '2024-03-03T08:00:00Z',
  },
  // The City of Shadows (Movie standalone episode)
  {
    id: '44444444-0000-0000-0000-000000000010',
    title_id: '22222222-0000-0000-0000-000000000002',
    season_id: null,
    slug: 'full-movie',
    episode_number: 1,
    name: 'Film Layar Lebar Lengkap',
    synopsis: 'Tayangan sinematik lengkap The City of Shadows.',
    duration_minutes: 124,
    status: 'published',
    created_at: '2024-04-10T10:00:00Z',
    updated_at: '2024-04-10T10:00:00Z',
  },
  // The Whispers of Gyeongbokgung
  {
    id: '44444444-0000-0000-0000-000000000020',
    title_id: '22222222-0000-0000-0000-000000000003',
    season_id: '33333333-0000-0000-0000-000000000003',
    slug: 'episode-1',
    episode_number: 1,
    name: 'Episode 1: Komet Merah',
    synopsis: 'Tanda langit yang langka memicu keresahan diam-diam di antara para menteri istana Joseon.',
    duration_minutes: 62,
    status: 'published',
    created_at: '2024-05-15T12:00:00Z',
    updated_at: '2024-05-15T12:00:00Z',
  },
  // Coastal Whispers
  {
    id: '44444444-0000-0000-0000-000000000030',
    title_id: '22222222-0000-0000-0000-000000000004',
    season_id: '33333333-0000-0000-0000-000000000004',
    slug: 'episode-1',
    episode_number: 1,
    name: 'Episode 1: Angin Jeruk Keprok',
    synopsis: 'Tiba di Jeju dengan dua koper, Ji-woo bertemu dengan pengrajin kayu ramah yang tinggal tepat di sebelah rumahnya.',
    duration_minutes: 58,
    status: 'published',
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-06-01T09:00:00Z',
  },
];

// Initial Video Sources (Verified sample embeds with confirmed authorization)
export const INITIAL_VIDEO_SOURCES: VideoSource[] = [
  {
    id: '55555555-0000-0000-0000-000000000001',
    episode_id: '44444444-0000-0000-0000-000000000001',
    provider: 'youtube',
    external_video_id: 'dQw4w9WgXcQ',
    embed_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    authorization_confirmed: true,
    updated_at: '2024-03-01T08:00:00Z',
  },
  // Note: Episode 2 is left unconfirmed to demonstrate safe fallback placeholder
  {
    id: '55555555-0000-0000-0000-000000000003',
    episode_id: '44444444-0000-0000-0000-000000000020',
    provider: 'youtube',
    external_video_id: 'dQw4w9WgXcQ',
    embed_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    authorization_confirmed: true,
    updated_at: '2024-05-15T12:00:00Z',
  },
];

class CatalogStore {
  private genres: Genre[] = [...INITIAL_GENRES];
  private titles: Title[] = [...INITIAL_TITLES];
  private seasons: Season[] = [...INITIAL_SEASONS];
  private episodes: Episode[] = [...INITIAL_EPISODES];
  private videoSources: VideoSource[] = [...INITIAL_VIDEO_SOURCES];

  private populateTitle(t: Title): Title {
    const seasons = this.seasons.filter((s) => s.title_id === t.id);
    const episodes = this.episodes.filter((e) => e.title_id === t.id);
    return {
      ...t,
      seasons_count: seasons.length,
      episodes_count: episodes.length,
    };
  }

  getPublicTitles(filter?: {
    genreSlug?: string;
    contentType?: string;
    search?: string;
    sort?: string;
  }): Title[] {
    return this.titles
      .filter((t) => t.status === 'published')
      .filter((t) => {
        if (!filter) return true;
        if (filter.genreSlug && filter.genreSlug !== 'all') {
          const hasGenre = t.genres?.some((g) => g.slug === filter.genreSlug);
          if (!hasGenre) return false;
        }
        if (filter.contentType && filter.contentType !== 'all') {
          if (t.content_type !== filter.contentType) return false;
        }
        if (filter.search && filter.search.trim().length > 0) {
          const query = filter.search.trim().toLowerCase();
          const matchName = t.name.toLowerCase().includes(query);
          const matchOrig = t.original_name?.toLowerCase().includes(query) ?? false;
          const matchSynopsis = t.synopsis.toLowerCase().includes(query);
          if (!matchName && !matchOrig && !matchSynopsis) return false;
        }
        return true;
      })
      .map((t) => this.populateTitle(t))
      .sort((a, b) => {
        if (filter?.sort === 'year') {
          return (b.release_year || 0) - (a.release_year || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }

  getFeaturedTitles(): Title[] {
    return this.titles
      .filter((t) => t.status === 'published' && t.featured)
      .map((t) => this.populateTitle(t));
  }

  getTitleBySlug(slug: string, includeDrafts = false): (Title & { seasons: (Season & { episodes: Episode[] })[] }) | null {
    const title = this.titles.find((t) => t.slug === slug);
    if (!title) return null;
    if (title.status !== 'published' && !includeDrafts) return null;

    const populated = this.populateTitle(title);
    const seasons = this.seasons
      .filter((s) => s.title_id === title.id)
      .sort((a, b) => a.season_number - b.season_number)
      .map((s) => {
        const seasonEpisodes = this.episodes
          .filter((e) => e.season_id === s.id && (includeDrafts || e.status === 'published'))
          .sort((a, b) => a.episode_number - b.episode_number);
        return {
          ...s,
          episodes: seasonEpisodes,
        };
      });

    const standaloneEpisodes = this.episodes
      .filter((e) => e.title_id === title.id && !e.season_id && (includeDrafts || e.status === 'published'))
      .sort((a, b) => a.episode_number - b.episode_number);

    return {
      ...populated,
      seasons:
        seasons.length > 0
          ? seasons
          : standaloneEpisodes.length > 0
          ? [{ id: 'standalone', title_id: title.id, season_number: 1, name: 'Film Lengkap', episodes: standaloneEpisodes }]
          : [],
    };
  }

  getTitleById(id: string): Title | null {
    const title = this.titles.find((t) => t.id === id);
    return title ? this.populateTitle(title) : null;
  }

  getEpisode(titleSlug: string, episodeSlug: string, includeDrafts = false): {
    title: Title;
    episode: Episode;
    nextEpisode: Episode | null;
    prevEpisode: Episode | null;
    allEpisodes: Episode[];
  } | null {
    const titleDetail = this.getTitleBySlug(titleSlug, includeDrafts);
    if (!titleDetail) return null;

    const allEpisodes = this.episodes
      .filter((e) => e.title_id === titleDetail.id && (includeDrafts || e.status === 'published'))
      .sort((a, b) => a.episode_number - b.episode_number);

    const episodeIndex = allEpisodes.findIndex((e) => e.slug === episodeSlug);
    if (episodeIndex === -1) return null;

    const episode = allEpisodes[episodeIndex];
    const prevEpisode = episodeIndex > 0 ? allEpisodes[episodeIndex - 1] : null;
    const nextEpisode = episodeIndex < allEpisodes.length - 1 ? allEpisodes[episodeIndex + 1] : null;

    return {
      title: titleDetail,
      episode,
      prevEpisode,
      nextEpisode,
      allEpisodes,
    };
  }

  resolveVideoSource(episodeId: string, isAdmin = false): {
    authorized: boolean;
    source: VideoSource | null;
    embedUrl: string | null;
    provider: string | null;
    message?: string;
  } {
    const source = this.videoSources.find((vs) => vs.episode_id === episodeId);
    if (!source) {
      return {
        authorized: false,
        source: null,
        embedUrl: null,
        provider: null,
        message: 'Belum ada sumber video resmi yang dikonfigurasi untuk episode ini.',
      };
    }

    if (!source.authorization_confirmed && !isAdmin) {
      return {
        authorized: false,
        source: null,
        embedUrl: null,
        provider: null,
        message: 'Izin penyiaran resmi pemegang hak cipta sedang dalam proses verifikasi redaksi.',
      };
    }

    const validation = validateEmbedUrl(source.embed_url);
    if (!validation.isValid) {
      return {
        authorized: false,
        source: isAdmin ? source : null,
        embedUrl: null,
        provider: null,
        message: validation.error || 'Domain penyedia video belum masuk dalam daftar domain yang diizinkan.',
      };
    }

    return {
      authorized: true,
      source: isAdmin ? source : null,
      embedUrl: validation.sanitizedUrl || source.embed_url,
      provider: validation.provider || source.provider,
    };
  }

  getAllGenres(): Genre[] {
    return this.genres;
  }

  getCatalogStats(): CatalogStats {
    return {
      publishedTitlesCount: this.titles.filter((t) => t.status === 'published').length,
      draftTitlesCount: this.titles.filter((t) => t.status === 'draft').length,
      totalEpisodesCount: this.episodes.length,
      genresCount: this.genres.length,
    };
  }

  // Admin Mutations
  saveTitle(data: Partial<Title> & { genre_ids?: string[] }, id?: string): Title {
    const now = new Date().toISOString();
    const resolvedGenres = (data.genre_ids || [])
      .map((gid) => this.genres.find((g) => g.id === gid))
      .filter((g): g is Genre => Boolean(g));

    if (id) {
      const index = this.titles.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Judul tidak ditemukan');
      const updated: Title = {
        ...this.titles[index],
        ...data,
        genres: resolvedGenres.length > 0 ? resolvedGenres : this.titles[index].genres,
        updated_at: now,
      };
      this.titles[index] = updated;
      return this.populateTitle(updated);
    } else {
      const newId = crypto.randomUUID();
      const newTitle: Title = {
        id: newId,
        slug: data.slug || `title-${Date.now()}`,
        name: data.name || 'Tanpa Judul',
        original_name: data.original_name || null,
        synopsis: data.synopsis || '',
        poster_url: data.poster_url || null,
        backdrop_url: data.backdrop_url || null,
        release_year: data.release_year || new Date().getFullYear(),
        content_type: data.content_type || 'drama',
        status: data.status || 'draft',
        featured: data.featured || false,
        created_at: now,
        updated_at: now,
        genres: resolvedGenres,
      };
      this.titles.unshift(newTitle);
      return this.populateTitle(newTitle);
    }
  }

  deleteTitle(id: string): boolean {
    this.titles = this.titles.filter((t) => t.id !== id);
    const seasonIds = this.seasons.filter((s) => s.title_id === id).map((s) => s.id);
    this.seasons = this.seasons.filter((s) => s.title_id !== id);
    const episodeIds = this.episodes.filter((e) => e.title_id === id).map((e) => e.id);
    this.episodes = this.episodes.filter((e) => e.title_id !== id);
    this.videoSources = this.videoSources.filter((vs) => !episodeIds.includes(vs.episode_id));
    return true;
  }

  getSeasonsForTitle(titleId: string): Season[] {
    return this.seasons.filter((s) => s.title_id === titleId).sort((a, b) => a.season_number - b.season_number);
  }

  saveSeason(titleId: string, seasonNumber: number, name?: string): Season {
    const existing = this.seasons.find((s) => s.title_id === titleId && s.season_number === seasonNumber);
    if (existing) {
      existing.name = name;
      return existing;
    }
    const newSeason: Season = {
      id: crypto.randomUUID(),
      title_id: titleId,
      season_number: seasonNumber,
      name: name || `Musim ${seasonNumber}`,
      created_at: new Date().toISOString(),
    };
    this.seasons.push(newSeason);
    return newSeason;
  }

  getEpisodesForTitle(titleId: string): Episode[] {
    return this.episodes.filter((e) => e.title_id === titleId).sort((a, b) => a.episode_number - b.episode_number);
  }

  getEpisodeById(id: string): Episode | null {
    return this.episodes.find((e) => e.id === id) || null;
  }

  saveEpisode(
    data: Partial<Episode> & {
      video_provider?: string;
      external_video_id?: string;
      embed_url?: string;
      authorization_confirmed?: boolean;
    },
    id?: string
  ): Episode {
    const now = new Date().toISOString();
    let episode: Episode;

    if (id) {
      const idx = this.episodes.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Episode tidak ditemukan');
      episode = {
        ...this.episodes[idx],
        ...data,
        updated_at: now,
      };
      this.episodes[idx] = episode;
    } else {
      const newId = crypto.randomUUID();
      episode = {
        id: newId,
        title_id: data.title_id!,
        season_id: data.season_id || null,
        slug: data.slug || `episode-${data.episode_number || Date.now()}`,
        episode_number: data.episode_number || 1,
        name: data.name || 'Episode Baru',
        synopsis: data.synopsis || null,
        duration_minutes: data.duration_minutes || 60,
        status: data.status || 'draft',
        created_at: now,
        updated_at: now,
      };
      this.episodes.push(episode);
    }

    if (data.embed_url && data.embed_url.trim().length > 0) {
      const existingVsIndex = this.videoSources.findIndex((vs) => vs.episode_id === episode.id);
      const vsData: VideoSource = {
        id: existingVsIndex >= 0 ? this.videoSources[existingVsIndex].id : crypto.randomUUID(),
        episode_id: episode.id,
        provider: (data.video_provider as any) || 'custom_authorized',
        external_video_id: data.external_video_id || null,
        embed_url: data.embed_url,
        authorization_confirmed: Boolean(data.authorization_confirmed),
        updated_at: now,
      };

      if (existingVsIndex >= 0) {
        this.videoSources[existingVsIndex] = vsData;
      } else {
        this.videoSources.push(vsData);
      }
    }

    return episode;
  }

  deleteEpisode(id: string): boolean {
    this.episodes = this.episodes.filter((e) => e.id !== id);
    this.videoSources = this.videoSources.filter((vs) => !vs.episode_id.includes(id));
    return true;
  }

  getVideoSourceForEpisode(episodeId: string): VideoSource | null {
    return this.videoSources.find((vs) => vs.episode_id === episodeId) || null;
  }
}

export const catalogStore = new CatalogStore();
