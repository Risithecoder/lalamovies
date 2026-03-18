'use client';

import { useState, useEffect, useCallback } from 'react';
import { Genre, Movie } from '@/types/types';
import FilterBar, { FilterState } from './FilterBar';
import MovieGrid from './MovieGrid';
import MovieRowSkeleton from './MovieRowSkeleton';

const DEFAULT_FILTERS: FilterState = {
  genreId: '',
  year: '',
  minRating: '0',
  sortBy: 'popularity.desc',
};

interface FilteredMovieGridProps {
  genres: Genre[];
  initialMovies?: Movie[];
}

export default function FilteredMovieGrid({ genres, initialMovies = [] }: FilteredMovieGridProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.genreId)                  params.set('genre',     f.genreId);
      if (f.year)                     params.set('year',      f.year);
      if (f.minRating && f.minRating !== '0') params.set('minRating', f.minRating);
      params.set('sortBy', f.sortBy);

      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      setMovies(data.results ?? []);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      fetchMovies(newFilters);
    },
    [fetchMovies]
  );

  // Load initial popular movies on mount if none provided
  useEffect(() => {
    if (!initialMovies.length) {
      fetchMovies(DEFAULT_FILTERS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4">🔍 Discover Movies</h2>
      <FilterBar genres={genres} filters={filters} onChange={handleFilterChange} />
      {loading ? (
        <MovieRowSkeleton count={12} />
      ) : (
        <MovieGrid movies={movies} emptyMessage="No movies match your filters. Try adjusting them." />
      )}
    </section>
  );
}
