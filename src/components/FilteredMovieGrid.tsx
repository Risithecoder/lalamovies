'use client';

import { useState, useEffect, useCallback } from 'react';
import { Genre, Movie, TVShow } from '@/types/types';
import FilterBar, { FilterState, MediaType } from './FilterBar';
import MovieGrid from './MovieGrid';
import SeriesGrid from './SeriesGrid';
import MovieRowSkeleton from './MovieRowSkeleton';

const DEFAULT_FILTERS: FilterState = {
  mediaType: 'movie',
  genreId: '',
  year: '',
  minRating: '0',
  sortBy: 'popularity.desc',
};

interface FilteredMovieGridProps {
  movieGenres: Genre[];
  tvGenres: Genre[];
  initialMovies?: Movie[];
}

export default function FilteredMovieGrid({ movieGenres, tvGenres, initialMovies = [] }: FilteredMovieGridProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('mediaType', f.mediaType);
      if (f.genreId)                             params.set('genre',     f.genreId);
      if (f.year)                                params.set('year',      f.year);
      if (f.minRating && f.minRating !== '0')    params.set('minRating', f.minRating);
      params.set('sortBy', f.sortBy);

      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();

      if (f.mediaType === 'tv') {
        setTvShows(data.results ?? []);
      } else {
        setMovies(data.results ?? []);
      }
    } catch {
      if (f.mediaType === 'tv') {
        setTvShows([]);
      } else {
        setMovies([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      fetchContent(newFilters);
    },
    [fetchContent]
  );

  // Load initial popular movies on mount if none provided
  useEffect(() => {
    if (!initialMovies.length) {
      fetchContent(DEFAULT_FILTERS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeGenres = filters.mediaType === 'tv' ? tvGenres : movieGenres;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Discover {filters.mediaType === 'tv' ? 'TV Shows' : 'Movies'}
      </h2>
      <FilterBar genres={activeGenres} filters={filters} onChange={handleFilterChange} />
      {loading ? (
        <MovieRowSkeleton count={12} />
      ) : filters.mediaType === 'tv' ? (
        <SeriesGrid shows={tvShows} emptyMessage="No TV shows match your filters. Try adjusting them." />
      ) : (
        <MovieGrid movies={movies} emptyMessage="No movies match your filters. Try adjusting them." />
      )}
    </section>
  );
}
