export const dynamic = 'force-dynamic';

import { getTrending, getPopular, getNowPlaying, getTopRated, getTrendingTV, getPopularTV } from '@/services/tmdb';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { Movie, TVShow } from '@/types/types';
import ContinueWatchingRow from '@/components/ContinueWatchingRow';
import RecentlyViewedRow from '@/components/RecentlyViewedRow';
import BoredButton from '@/components/BoredButton';
import TrendingSeriesRow from '@/components/series/TrendingSeriesRow';
import SeriesContinueWatchingRow from '@/components/series/SeriesContinueWatchingRow';

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const emptyMovies: Movie[] = [];
  const emptyShows: TVShow[] = [];
  const [trending, popular, nowPlaying, topRated, trendingTV, popularTV] = await Promise.all([
    safeFetch(() => getTrending('week'), emptyMovies),
    safeFetch(() => getPopular(), emptyMovies),
    safeFetch(() => getNowPlaying(), emptyMovies),
    safeFetch(() => getTopRated(), emptyMovies),
    safeFetch(() => getTrendingTV('week'), emptyShows),
    safeFetch(() => getPopularTV(), emptyShows),
  ]);

  return (
    <div className="page-enter">
      {/* Hero Carousel */}
      {trending.length > 0 && <HeroCarousel movies={trending} />}

      {/* Movie Rows */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 space-y-8 pb-12">
        {/* LocalStorage-driven rows (rendered client-side, invisible until populated) */}
        <ContinueWatchingRow />
        <RecentlyViewedRow />

        {/* Interleave movies & TV — Netflix/Apple TV style */}
        <MovieRow title="Trending Movies" movies={trending.slice(1)} />
        <TrendingSeriesRow title="Trending TV Shows" shows={trendingTV} />
        <SeriesContinueWatchingRow />
        <MovieRow title="Popular Movies" movies={popular} />
        <TrendingSeriesRow title="Popular TV Shows" shows={popularTV} />
        <MovieRow title="Now Playing in Theaters" movies={nowPlaying} />
        <MovieRow title="Top Rated Movies" movies={topRated} />

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-8">
          <Link
            href="/explore"
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
          >
            Explore Movies & TV Shows
          </Link>
          <Link
            href="/series"
            className="px-8 py-3 bg-surface hover:bg-surface-hover border border-border text-foreground font-semibold rounded-lg transition-colors"
          >
            Browse TV Shows
          </Link>
          <BoredButton />
        </div>
      </div>
    </div>
  );
}
