'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import MovieRow from './MovieRow';

export default function RecentlyViewedRow() {
  const { recentlyViewed } = useRecentlyViewed();

  if (!recentlyViewed.length) return null;

  return <MovieRow title="Recently Viewed" movies={recentlyViewed} />;
}
