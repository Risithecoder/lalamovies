'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Movie } from '@/types/types';

const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<Movie[]>(
    'lala_recently_viewed',
    []
  );

  const addToRecentlyViewed = useCallback(
    (movie: Movie) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((m) => m.id !== movie.id);
        return [movie, ...filtered].slice(0, MAX_ITEMS);
      });
    },
    [setRecentlyViewed]
  );

  return { recentlyViewed, addToRecentlyViewed };
}
