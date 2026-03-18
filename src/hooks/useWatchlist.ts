'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Movie } from '@/types/types';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('lala_watchlist', []);

  const addToWatchlist = useCallback(
    (movie: Movie) => {
      setWatchlist((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [movie, ...prev];
      });
    },
    [setWatchlist]
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
    },
    [setWatchlist]
  );

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
