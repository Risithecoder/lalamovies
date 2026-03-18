import { Metadata } from 'next';
import { searchMovies } from '@/services/tmdb';
import MovieGrid from '@/components/MovieGrid';
import { Movie } from '@/types/types';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search Movies',
    description: q
      ? `Search results for "${q}" on LaLaMovies`
      : 'Search for movies on LaLaMovies',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  let movies: Movie[] = [];
  let totalResults = 0;

  if (query) {
    const data = await searchMovies(query);
    movies = data.results;
    totalResults = data.total_results;
  }

  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {query ? `Results for "${query}"` : 'Search Movies'}
        </h1>
        {query && (
          <p className="text-muted mb-8">
            {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} found
          </p>
        )}
        <MovieGrid movies={movies} />
      </div>
    </div>
  );
}
