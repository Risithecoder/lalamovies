import { Metadata } from 'next';
import {
  getTrending,
  getTopRated,
  getNowPlaying,
  getGenres,
  getTVGenres,
  discoverMovies,
  getGenreSlug,
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
} from '@/services/tmdb';
import MovieRow from '@/components/MovieRow';
import TrendingSeriesRow from '@/components/series/TrendingSeriesRow';
import Link from 'next/link';
import { Movie, TVShow, Genre } from '@/types/types';
import FilteredMovieGrid from '@/components/FilteredMovieGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover trending, top rated, and genre-specific movies and TV shows.',
};

// Curated section configs
const CURATED_SECTIONS: { title: string; params: Record<string, string> }[] = [
  { title: 'Mind-Bending Movies', params: { with_keywords: '310', sort_by: 'vote_average.desc', 'vote_count.gte': '100' } },
  { title: 'Space Movies', params: { with_keywords: '1432', sort_by: 'popularity.desc' } },
  { title: 'Hidden Gems', params: { sort_by: 'vote_average.desc', 'vote_count.gte': '200', 'vote_count.lte': '2000', 'vote_average.gte': '7.5' } },
  { title: 'Critically Acclaimed', params: { sort_by: 'vote_average.desc', 'vote_count.gte': '5000' } },
];

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function ExplorePage() {
  const emptyMovies: Movie[] = [];
  const emptyShows: TVShow[] = [];
  const emptyGenres: Genre[] = [];

  const [
    trending, topRated, nowPlaying, movieGenres, tvGenres,
    trendingTV, popularTV, topRatedTV,
    ...curatedResults
  ] = await Promise.all([
    safeFetch(() => getTrending('week'), emptyMovies),
    safeFetch(() => getTopRated(), emptyMovies),
    safeFetch(() => getNowPlaying(), emptyMovies),
    safeFetch(() => getGenres(), emptyGenres),
    safeFetch(() => getTVGenres(), emptyGenres),
    safeFetch(() => getTrendingTV('week'), emptyShows),
    safeFetch(() => getPopularTV(), emptyShows),
    safeFetch(() => getTopRatedTV(), emptyShows),
    ...CURATED_SECTIONS.map((s) => safeFetch(() => discoverMovies(s.params), emptyMovies)),
  ]);

  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Explore</h1>
        <p className="text-muted mb-10">
          Discover your next favorite movie or TV show
        </p>

        {/* Advanced Discover with filters (supports Movies & TV toggle) */}
        <FilteredMovieGrid movieGenres={movieGenres} tvGenres={tvGenres} initialMovies={trending} />

        {/* Trending Movies */}
        <MovieRow title="Trending Movies" movies={trending} />

        {/* Trending TV */}
        <TrendingSeriesRow title="Trending TV Shows" shows={trendingTV} />

        {/* Popular TV */}
        <TrendingSeriesRow title="Popular TV Shows" shows={popularTV} />

        {/* Browse by Genre */}
        {movieGenres.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Browse by Genre</h2>
            <div className="flex flex-wrap gap-3">
              {movieGenres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${getGenreSlug(genre.name)}`}
                  className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-sm text-muted hover:text-white transition-all"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Rated Movies */}
        <MovieRow title="Top Rated Movies" movies={topRated} />

        {/* Top Rated TV */}
        <TrendingSeriesRow title="Top Rated TV Shows" shows={topRatedTV} />

        {/* Recently Added */}
        <MovieRow title="Recently Added" movies={nowPlaying} />

        {/* Curated Sections */}
        {CURATED_SECTIONS.map((section, i) => (
          <MovieRow
            key={section.title}
            title={section.title}
            movies={curatedResults[i]}
          />
        ))}
      </div>
    </div>
  );
}
