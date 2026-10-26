-- ====================================================================
-- SeoulPlay Seed Data
-- Fictional / Demo Korean Dramas & Authorized Embed Configuration
-- ====================================================================

-- 1. Insert Genres
INSERT INTO public.genres (id, name, slug) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Romance', 'romance'),
  ('11111111-0000-0000-0000-000000000002', 'Thriller', 'thriller'),
  ('11111111-0000-0000-0000-000000000003', 'Melodrama', 'melodrama'),
  ('11111111-0000-0000-0000-000000000004', 'Sageuk (Historical)', 'sageuk'),
  ('11111111-0000-0000-0000-000000000005', 'Mystery', 'mystery'),
  ('11111111-0000-0000-0000-000000000006', 'Crime', 'crime'),
  ('11111111-0000-0000-0000-000000000007', 'Fantasy', 'fantasy'),
  ('11111111-0000-0000-0000-000000000008', 'Comedy', 'comedy')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Titles
INSERT INTO public.titles (id, slug, name, original_name, synopsis, poster_url, backdrop_url, release_year, content_type, status, featured) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    'queen-of-the-chaebol',
    'Queen of the Chaebol',
    '어둠 속의 찬란',
    'In the cutthroat world of Seoul’s premier retail empire, heiress Park Seo-yoon must navigate treacherous boardroom rivalries and an unexpected alliance with an enigmatic legal advisor. A high-stakes corporate romance delving into ambition, loyalty, and redemption.',
    '/src/assets/images/poster_queen_chaebol_1792737531897.jpg',
    '/src/assets/images/hero_kdrama_cinematic_1792737531695.jpg',
    2024,
    'drama',
    'published',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'the-city-of-shadows',
    'The City of Shadows',
    '어둠의 도시',
    'A rain-soaked Seoul detective chases a clandestine network operating behind Gangnam’s gleaming facade. When a case turns deeply personal, he must decide how far into the abyss he is willing to descend.',
    '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    2024,
    'movie',
    'published',
    false
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'the-whispers-of-gyeongbokgung',
    'The Whispers of Gyeongbokgung',
    '경복궁의 속삭임',
    'Set during the golden epoch of the Joseon Dynasty, a brilliant royal astrologer and an undercover female scholar investigate celestial anomalies masking a silent conspiracy within the palace gates.',
    '/src/assets/images/poster_joseon_fantasy_1792737533618.jpg',
    '/src/assets/images/poster_joseon_fantasy_1792737533618.jpg',
    2024,
    'drama',
    'published',
    true
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'coastal-whispers',
    'Coastal Whispers',
    '해변의 기억',
    'Burnt out by high-pressure Seoul startup culture, a former architect retreats to an idyllic Jeju seaside village to renovate an inherited stone cottage, finding solace and unexpected romance in the sound of the ocean waves.',
    '/src/assets/images/poster_jeju_romance_1792737533313.jpg',
    '/src/assets/images/poster_jeju_romance_1792737533313.jpg',
    2024,
    'drama',
    'published',
    false
  ),
  (
    '22222222-0000-0000-0000-000000000005',
    'signal-in-the-dark',
    'Signal in the Dark (Draft)',
    '비밀의 신호',
    'Unpublished editorial draft drama title used to verify that draft titles are strictly invisible to anonymous visitors and only accessible to authenticated administrators.',
    '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    '/src/assets/images/poster_midnight_detective_1792737532305.jpg',
    2025,
    'drama',
    'draft',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Title Genres
INSERT INTO public.title_genres (title_id, genre_id) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000006'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 4. Insert Seasons
INSERT INTO public.seasons (id, title_id, season_number, name) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 1, 'Season 1: Ascendance'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 2, 'Season 2: Retribution'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 1, 'Season 1: The Omens'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', 1, 'Season 1: Coastal Days')
ON CONFLICT (title_id, season_number) DO NOTHING;

-- 5. Insert Episodes
INSERT INTO public.episodes (id, title_id, season_id, slug, episode_number, name, synopsis, duration_minutes, status) VALUES
  (
    '44444444-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'episode-1',
    1,
    'Episode 1: The Golden Tower',
    'Park Seo-yoon takes command of the flagship department store as unexpected irregularities emerge in the annual audit.',
    68,
    'published'
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    '22222222-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    'episode-2',
    2,
    'Episode 2: Shattered Glass',
    'A hostile boardroom maneuver forces Seo-yoon to seek counsel from legal strategist Lee Jin-woo.',
    65,
    'published'
  ),
  (
    '44444444-0000-0000-0000-000000000010',
    '22222222-0000-0000-0000-000000000002',
    NULL,
    'full-movie',
    1,
    'Full Feature Film',
    'The complete cinematic cut of The City of Shadows.',
    124,
    'published'
  ),
  (
    '44444444-0000-0000-0000-000000000020',
    '22222222-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000003',
    'episode-1',
    1,
    'Episode 1: The Red Comet',
    'An auspicious celestial sign sparks quiet unrest among the ministers in the royal court.',
    62,
    'published'
  )
ON CONFLICT (title_id, slug) DO NOTHING;

-- 6. Insert Video Sources (Verified authorized sample embeds)
-- Note: Episode 2 is deliberately left without an authorized source to verify fallback.
INSERT INTO public.video_sources (id, episode_id, provider, external_video_id, embed_url, authorization_confirmed) VALUES
  (
    '55555555-0000-0000-0000-000000000001',
    '44444444-0000-0000-0000-000000000001',
    'youtube',
    'dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    true
  ),
  (
    '55555555-0000-0000-0000-000000000003',
    '44444444-0000-0000-0000-000000000020',
    'youtube',
    'dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    true
  )
ON CONFLICT (episode_id) DO NOTHING;
