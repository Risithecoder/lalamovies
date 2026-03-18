import { Metadata } from 'next';
import {
  getTrending,
  getTopRated,
  getNowPlaying,
  getGenres,
  discoverMovies,
  getGenreSlug,
} from '@/services/tmdb';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';
import { Movie, Genre } from '@/types/types';
import FilteredMovieGrid from '@/components/FilteredMovieGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover trending, top rated, and genre-specific movies. Browse curated collections of the best films.',
};

// Curated section configs
const CURATED_SECTIONS: { title: string; params: Record<string, string> }[] = [
  { title: '🧠 Mind-Bending Movies', params: { with_keywords: '310', sort_by: 'vote_average.desc', 'vote_count.gte': '100' } },
  { title: '🚀 Space Movies', params: { with_keywords: '1432', sort_by: 'popularity.desc' } },
  { title: '💎 Hidden Gems', params: { sort_by: 'vote_average.desc', 'vote_count.gte': '200', 'vote_count.lte': '2000', 'vote_average.gte': '7.5' } },
  { title: '🏆 Critically Acclaimed', params: { sort_by: 'vote_average.desc', 'vote_count.gte': '5000' } },
];

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function ExplorePage() {
  const empty: Movie[] = [];
  const emptyGenres: Genre[] = [];

  const [trending, topRated, nowPlaying, genres, ...curatedResults] = await Promise.all([
    safeFetch(() => getTrending('week'), empty),
    safeFetch(() => getTopRated(), empty),
    safeFetch(() => getNowPlaying(), empty),
    safeFetch(() => getGenres(), emptyGenres),
    ...CURATED_SECTIONS.map((s) => safeFetch(() => discoverMovies(s.params), empty)),
  ]);

  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Explore</h1>
        <p className="text-muted mb-10">
          Discover your next favorite movie
        </p>

        {/* Advanced Discover with filters */}
        <FilteredMovieGrid genres={genres} initialMovies={trending} />

        {/* Trending */}
        <MovieRow title="🔥 Trending Now" movies={trending} />

        {/* Browse by Genre */}
        {genres.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">📁 Browse by Genre</h2>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
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

        {/* Top Rated */}
        <MovieRow title="⭐ Top Rated" movies={topRated} />

        {/* Recently Added */}
        <MovieRow title="🍿 Recently Added" movies={nowPlaying} />

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
