export const dynamic = 'force-dynamic';

import { getTrending, getPopular, getNowPlaying, getTopRated } from '@/services/tmdb';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { Movie } from '@/types/types';

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const empty: Movie[] = [];
  const [trending, popular, nowPlaying, topRated] = await Promise.all([
    safeFetch(() => getTrending('week'), empty),
    safeFetch(() => getPopular(), empty),
    safeFetch(() => getNowPlaying(), empty),
    safeFetch(() => getTopRated(), empty),
  ]);

  const featuredMovie = trending[0];

  return (
    <div className="page-enter">
      {/* Hero Section */}
      {featuredMovie && <HeroSection movie={featuredMovie} />}

      {/* Movie Rows */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 space-y-2">
        <MovieRow title="🔥 Trending This Week" movies={trending.slice(1)} />
        <MovieRow title="🎬 Popular Movies" movies={popular} />
        <MovieRow title="🍿 Now Playing" movies={nowPlaying} />
        <MovieRow title="⭐ Top Rated" movies={topRated} />

        {/* Explore CTA */}
        <div className="flex justify-center py-8">
          <Link
            href="/explore"
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
          >
            Explore More Movies →
          </Link>
        </div>
      </div>
    </div>
  );
}
