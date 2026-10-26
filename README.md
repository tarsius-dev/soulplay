# SeoulPlay — Free Korean Drama Discovery & Streaming Platform

SeoulPlay is a free discovery catalog and streaming website for Korean dramas and feature films. Visitors can browse trending titles, search across genres, read curated synopses, explore multi-season episode guides, and watch through authorized external embedded video players with zero registration required.

---

## 1. Key Features

- **Public Viewer Discovery**:
  - No user registration, login, subscriptions, or credit card required.
  - Large cinematic hero banner showcasing featured titles.
  - Categorized browsing: Korean Dramas, Feature Films, and Curated Genres (Romance, Sageuk, Thriller, Melodrama, Mystery, Crime, Fantasy, Comedy).
  - Real-time search by English title, Korean Hangul name, or synopsis keywords.
  - Full title detail pages with original Hangul titles, release years, genres, and episodic guides.
  - Secure 16:9 embedded video playback with click-to-load optimization and Next/Previous episode navigation.
  - Safe fallback placeholder when an episode has no authorized stream configured.

- **Legal Content & Video Embedding Standards**:
  - **Zero Piracy**: Does not scrape pirate sites or rehost copyrighted video media.
  - **Server-Side Hostname Allowlist**: Restricts embed URLs to approved providers (`youtube.com`, `vimeo.com`, `dailymotion.com`, `archive.org`).
  - **Mandatory Admin Confirmation**: Episodes cannot be published with playable external embeds unless the administrator explicitly certifies rights holder authorization.
  - **Secure Sandboxing**: Iframes are restricted to `sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"` with `referrerPolicy="strict-origin-when-cross-origin"`.

- **Editorial Administration Console**:
  - Authenticated via Supabase Auth with server-side Row Level Security (RLS) enforcement.
  - Inventory dashboard with live counts for published titles, drafts, episodes, and genres.
  - Full Title CRUD: Create, edit, publish, unpublish, and delete titles.
  - Season & Episode hierarchy management: Add seasons, configure episode durations, slugs, and video sources.
  - Video provider adapter with automatic embed URL construction from provider IDs.
  - Security settings dashboard displaying hostname allowlists and database connection status.

- **Advertising Architecture**:
  - Configurable ad slots (`HeaderAd`, `ContentAd`, `FooterAd`).
  - **Disabled by default in development** (`VITE_ADS_ENABLED=false`).
  - Pre-configured for Google AdSense and compliant ad networks with strict script deduplication.
  - Clean non-intrusive container when ads are blocked or disabled.

---

## 2. Technology Stack & Project Structure

- **Frontend**: React 19, TypeScript (strict mode), Vite, Tailwind CSS 4, Motion, Lucide Icons.
- **Routing**: Wouter (declarative client-side routing supporting all nested routes).
- **Validation**: Zod (type-safe validation for titles, episodes, video sources, search).
- **Backend / Storage**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS).
- **Deterministic Mock Layer**: In-memory database fallback enabling instant offline development and automated test execution without live cloud credentials.
- **Testing**: Vitest (unit/integration tests) and Playwright (end-to-end smoke tests).

```
├── .env.example                                      # Environment variable specifications
├── supabase/
│   ├── migrations/
│   │   └── 20261023000000_create_seoulplay_schema.sql # PostgreSQL DDL, indexes, RLS policies, and RPC
│   └── seed.sql                                      # Deterministic demo titles, genres, and sample embeds
├── src/
│   ├── assets/images/                                # High-fidelity generated posters and hero backdrops
│   ├── components/
│   │   ├── ads/                                      # AdSlot, HeaderAd, ContentAd, FooterAd
│   │   ├── catalog/                                  # HeroBanner, TitleCard, EpisodeList
│   │   ├── layout/                                   # Navbar (Top Bar Contract), Footer
│   │   └── player/                                   # Secure VideoPlayer with sandbox & allowlist checks
│   ├── lib/
│   │   ├── ads/                                      # Advertising loader and configuration
│   │   ├── auth/                                     # Supabase Auth provider and demo session handler
│   │   ├── catalog/                                  # Unified store supporting Supabase and mock seed
│   │   ├── seo/                                      # Dynamic meta tags & Schema.org JSON-LD
│   │   ├── supabase/                                 # Supabase client initialization
│   │   ├── validation/                               # Zod schemas for titles, episodes, and search
│   │   ├── video/                                    # Hostname validator & provider adapters
│   │   └── types.ts                                  # TypeScript domain interfaces
│   ├── pages/
│   │   ├── HomePage.tsx                              # Hero banner, trending, drama/movie rows, genres
│   │   ├── DramasPage.tsx                            # K-Drama catalog with genre and sort filter
│   │   ├── MoviesPage.tsx                            # Korean feature films catalog
│   │   ├── GenresPage.tsx                            # Dynamic genre route (/genres/:slug)
│   │   ├── SearchPage.tsx                            # Real-time search with URL sync (/search?q=)
│   │   ├── TitleDetailPage.tsx                       # Metadata, poster, synopsis, episodes (/title/:slug)
│   │   ├── WatchPage.tsx                             # Video player & episode playlist (/title/:slug/watch/:ep)
│   │   ├── AboutPage.tsx                             # Platform mission and editorial policy
│   │   ├── ContactPage.tsx                           # Feedback and partnership form
│   │   ├── PrivacyPage.tsx                           # Privacy policy
│   │   ├── TermsPage.tsx                             # Terms of service
│   │   ├── CopyrightPage.tsx                         # DMCA & takedown notice submission
│   │   └── admin/                                    # Administrator Portal:
│   │       ├── AdminLayout.tsx                       # Auth guard and sidebar navigation
│   │       ├── AdminLoginPage.tsx                    # Supabase Auth login
│   │       ├── AdminDashboardPage.tsx                # Inventory metrics and quick actions
│   │       ├── AdminTitlesPage.tsx                   # Title inventory table with search & deletion
│   │       ├── AdminTitleFormPage.tsx                # Create/edit title with Zod validation
│   │       ├── AdminSeasonsPage.tsx                  # Season and episode tree manager
│   │       ├── AdminEpisodeFormPage.tsx              # Episode and video embed editor
│   │       └── AdminSettingsPage.tsx                 # Video allowlist & Supabase config inspector
│   ├── App.tsx                                       # Route configuration
│   └── main.tsx                                      # React DOM entry
├── tests/
│   ├── unit/                                         # Vitest unit tests (video, catalog, schemas, ads)
│   └── e2e/                                          # Playwright smoke tests
└── playwright.config.ts                              # Playwright configuration
```

---

## 3. Getting Started

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Start local development server on port 3000
npm run dev
```

### Running Tests
```bash
# Run unit tests via Vitest
npm run test

# Run TypeScript type verification
npm run lint
```

---

## 4. Environment Variables

Create `.env.local` based on `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_SITE_URL` | Base public canonical URL | `https://seoulplay.example.com` |
| `VITE_SUPABASE_URL` | Cloud Supabase project endpoint | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase anon key | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin provisioning key | *(Never commit to git)* |
| `VITE_APPROVED_VIDEO_HOSTS` | Comma-separated list of approved embed hostnames | `youtube.com,player.vimeo.com,archive.org` |
| `VITE_ADS_ENABLED` | Enable or disable banner advertising | `false` |
| `VITE_ADSENSE_CLIENT` | Google AdSense publisher ID | `ca-pub-XXXXXXXXXXXXXXXX` |

---

## 5. Supabase Database Setup & Administrator Provisioning

### Step 1: Run Migrations
In your Supabase project dashboard, open the **SQL Editor** and run the contents of:
`supabase/migrations/20261023000000_create_seoulplay_schema.sql`

This creates:
- Tables: `titles`, `genres`, `title_genres`, `seasons`, `episodes`, `video_sources`, `admin_profiles`.
- Strict RLS policies preventing unauthorized reads of drafts or direct video sources.
- The `get_authorized_embed_url()` stored function.

### Step 2: Seed Demo Catalog Data
Execute `supabase/seed.sql` to populate initial demo genres and titles.

### Step 3: Securely Provision the First Administrator
1. In the Supabase Dashboard, go to **Authentication → Users** and click **Add User** (e.g. `admin@seoulplay.example.com` with a secure password).
2. Copy the resulting `UUID` of the new user.
3. In the SQL Editor, execute:
   ```sql
   INSERT INTO public.admin_profiles (id, role)
   VALUES ('<INSERT_COPIED_UUID_HERE>', 'administrator')
   ON CONFLICT (id) DO NOTHING;
   ```
4. Sign in at `/admin/login` using those credentials.

*Note: For local evaluation without a live Supabase project, SeoulPlay includes an in-memory deterministic development store. You can test the admin panel immediately using `admin@seoulplay.example.com` / `admin123456`.*

---

## 6. Vercel Deployment Instructions

1. Push the repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New → Project** and select the repository.
3. Configure the environment variables in Vercel project settings:
   - `VITE_SITE_URL` = Your production URL (e.g. `https://seoulplay.vercel.app`)
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `VITE_ADS_ENABLED` = `false` (until AdSense account is approved)
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Deploy and verify `/`, `/dramas`, `/title/queen-of-the-chaebol`, and `/admin/login`.
