/**
 * Series Catalogue Page — /series
 * --------------------------------
 * Server component that fetches TV shows from TMDB API.
 * Mirrors the existing movie browsing pattern.
 */

import { Metadata } from 'next';
import { getTrendingTV, getPopularTV, getTopRatedTV } from '@/services/tmdb';
import { TVShow } from '@/types/types';
import SeriesGrid from './SeriesGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Series — LaLaMovies',
  description: 'Browse trending and popular TV series',
};

export default async function SeriesCataloguePage() {
  const emptyShows: TVShow[] = [];

  const [trending, popular, topRated] = await Promise.all([
    getTrendingTV('week').catch(() => emptyShows),
    getPopularTV().catch(() => emptyShows),
    getTopRatedTV().catch(() => emptyShows),
  ]);

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Series
        </h1>
        <p className="text-muted mb-8">Browse our collection of TV series</p>

        <SeriesGrid
          trending={trending}
          popular={popular}
          topRated={topRated}
        />
      </div>
    </div>
  );
}
