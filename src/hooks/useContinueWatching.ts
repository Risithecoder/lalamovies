'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ContinueWatchingItem } from '@/types/types';

const MAX_ITEMS = 20;

export function useContinueWatching() {
  const [continueWatching, setContinueWatching] = useLocalStorage<ContinueWatchingItem[]>(
    'lala_continue_watching',
    []
  );

  const saveProgress = useCallback(
    (item: Omit<ContinueWatchingItem, 'timestamp'>) => {
      setContinueWatching((prev) => {
        const filtered = prev.filter((m) => m.movieId !== item.movieId);
        const newItem: ContinueWatchingItem = { ...item, timestamp: Date.now() };
        return [newItem, ...filtered].slice(0, MAX_ITEMS);
      });
    },
    [setContinueWatching]
  );

  const removeFromContinueWatching = useCallback(
    (movieId: number) => {
      setContinueWatching((prev) => prev.filter((m) => m.movieId !== movieId));
    },
    [setContinueWatching]
  );

  return { continueWatching, saveProgress, removeFromContinueWatching };
}
