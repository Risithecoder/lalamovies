# LaLaMovies 🎬

A modern movie streaming and discovery platform built with Next.js, TypeScript, and Tailwind CSS.

![LaLaMovies](https://image.tmdb.org/t/p/original/placeholder.jpg)

## Features

- 🔥 Trending, Popular, and Top Rated movie sections
- 🎬 Movie detail pages with streaming player
- 🔍 Instant search with live results
- 📁 Genre browsing
- 🧠 Curated collections (Mind-Bending, Space, Hidden Gems)
- 📱 Fully responsive design
- ⚡ Server-side rendering for fast load times
- 🔎 SEO optimized with Open Graph & JSON-LD schema
- 🗺️ Auto-generated sitemap

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Movie Data | TMDB API |
| Streaming | Vidfast embed player |
| Hosting | Vercel |
| CDN/DNS | Cloudflare |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lalamovies.git
cd lalamovies

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your TMDB API key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | ✅ | Your TMDB API key |
| `NEXT_PUBLIC_SITE_URL` | Optional | Site URL for SEO (default: `https://lalamovies.com`) |

## Project Structure

```
src/
├── app/
│   ├── api/search/       # Search API route
│   ├── explore/          # Explore page
│   ├── genre/[slug]/     # Genre pages
│   ├── movie/[slug]/     # Movie detail pages
│   ├── search/           # Search results page
│   ├── globals.css       # Global styles & design tokens
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   ├── robots.ts         # Robots.txt
│   └── sitemap.ts        # Dynamic sitemap
├── components/
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── MovieRow.tsx
│   ├── Navbar.tsx
│   ├── Player.tsx
│   ├── SearchBar.tsx
│   └── ServerSelector.tsx
├── services/
│   ├── streaming.ts      # Streaming server config
│   └── tmdb.ts           # TMDB API service with caching
└── types/
    └── types.ts          # TypeScript interfaces
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables:
   - `TMDB_API_KEY` — your TMDB API key
   - `NEXT_PUBLIC_SITE_URL` — your domain
4. Deploy!

### Cloudflare DNS Setup

1. Add your domain to Cloudflare
2. Point DNS records to Vercel:
   - `A` record → `76.76.21.21`
   - `CNAME` record for `www` → `cname.vercel-dns.com`
3. Set SSL mode to **Full (strict)**

## License

MIT
