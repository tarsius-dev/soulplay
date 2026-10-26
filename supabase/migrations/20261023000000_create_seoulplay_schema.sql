-- ====================================================================
-- SeoulPlay Schema & Row Level Security (RLS) Migration
-- Version: 20261023000000
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. titles Table
CREATE TABLE IF NOT EXISTS public.titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    original_name TEXT,
    synopsis TEXT NOT NULL,
    poster_url TEXT,
    backdrop_url TEXT,
    release_year INTEGER CHECK (release_year >= 1950 AND release_year <= 2035),
    content_type TEXT NOT NULL CHECK (content_type IN ('drama', 'movie')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. genres Table
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- 3. title_genres Table (Composite Primary Key)
CREATE TABLE IF NOT EXISTS public.title_genres (
    title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, genre_id)
);

-- 4. seasons Table
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL CHECK (season_number > 0),
    name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(title_id, season_number)
);

-- 5. episodes Table
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    episode_number INTEGER NOT NULL CHECK (episode_number > 0),
    name TEXT NOT NULL,
    synopsis TEXT,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(title_id, slug)
);

-- 6. video_sources Table
-- CRITICAL SECURITY RULE: Never expose video_sources to direct anonymous SELECT queries.
CREATE TABLE IF NOT EXISTS public.video_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    episode_id UUID NOT NULL UNIQUE REFERENCES public.episodes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    external_video_id TEXT,
    embed_url TEXT NOT NULL CHECK (embed_url ~ '^https://'),
    authorization_confirmed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. admin_profiles Table
-- Authenticated users do NOT automatically get admin privileges.
-- Only explicit rows referencing auth.users receive administrator access.
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'administrator' CHECK (role = 'administrator'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Performance Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_titles_status ON public.titles(status);
CREATE INDEX IF NOT EXISTS idx_titles_featured ON public.titles(featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_titles_slug ON public.titles(slug);
CREATE INDEX IF NOT EXISTS idx_titles_content_type ON public.titles(content_type) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_genres_slug ON public.genres(slug);
CREATE INDEX IF NOT EXISTS idx_episodes_title_id ON public.episodes(title_id);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON public.episodes(status);
CREATE INDEX IF NOT EXISTS idx_video_sources_episode ON public.video_sources(episode_id);

-- ====================================================================
-- Helper Functions & Security Checks
-- ====================================================================

-- Function to check if the current session belongs to an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'administrator'
  );
$$;

-- Secure function for anonymous playback resolution:
-- Returns embed information ONLY IF episode is published, title is published, AND authorization_confirmed is true.
CREATE OR REPLACE FUNCTION public.get_authorized_embed_url(p_episode_id UUID)
RETURNS TABLE (
  authorized BOOLEAN,
  provider TEXT,
  embed_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    vs.authorization_confirmed AS authorized,
    vs.provider,
    vs.embed_url
  FROM public.video_sources vs
  JOIN public.episodes ep ON ep.id = vs.episode_id
  JOIN public.titles t ON t.id = ep.title_id
  WHERE vs.episode_id = p_episode_id
    AND vs.authorization_confirmed = true
    AND ep.status = 'published'
    AND t.status = 'published';
END;
$$;

-- ====================================================================
-- Row Level Security (RLS) Configuration
-- ====================================================================

ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- RLS: titles
-- --------------------------------------------------------------------
-- Anonymous users can only read published titles
CREATE POLICY "Public anonymous read published titles"
ON public.titles FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Admins have full access to read all titles (including drafts and archived)
CREATE POLICY "Admin full select titles"
ON public.titles FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin insert titles"
ON public.titles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update titles"
ON public.titles FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete titles"
ON public.titles FOR DELETE
TO authenticated
USING (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: genres & title_genres
-- --------------------------------------------------------------------
CREATE POLICY "Public read genres"
ON public.genres FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin manage genres"
ON public.genres FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read title_genres"
ON public.title_genres FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.titles t
    WHERE t.id = title_genres.title_id AND t.status = 'published'
  )
  OR public.is_admin()
);

CREATE POLICY "Admin manage title_genres"
ON public.title_genres FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: seasons
-- --------------------------------------------------------------------
CREATE POLICY "Public read seasons of published titles"
ON public.seasons FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.titles t
    WHERE t.id = seasons.title_id AND t.status = 'published'
  )
  OR public.is_admin()
);

CREATE POLICY "Admin manage seasons"
ON public.seasons FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: episodes
-- --------------------------------------------------------------------
CREATE POLICY "Public read published episodes"
ON public.episodes FOR SELECT
TO anon, authenticated
USING (
  status = 'published' AND
  EXISTS (
    SELECT 1 FROM public.titles t
    WHERE t.id = episodes.title_id AND t.status = 'published'
  )
);

CREATE POLICY "Admin manage episodes"
ON public.episodes FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: video_sources
-- NO direct anonymous SELECT permitted. Only admins can query directly.
-- Anonymous users invoke get_authorized_embed_url() RPC function.
-- --------------------------------------------------------------------
CREATE POLICY "Admin full access video_sources"
ON public.video_sources FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --------------------------------------------------------------------
-- RLS: admin_profiles
-- --------------------------------------------------------------------
CREATE POLICY "Admins can view own profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (id = auth.uid() AND role = 'administrator');

CREATE POLICY "Admin manage admin_profiles"
ON public.admin_profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
