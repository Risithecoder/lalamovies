'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { Movie } from '@/types/types';

export default function RecentlyViewedTracker({ movie }: { movie: Movie }) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    addToRecentlyViewed(movie);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.id]);

  return null;
}
