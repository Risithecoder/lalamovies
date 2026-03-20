/**
 * SeriesContinueWatchingRow
 * -------------------------
 * Horizontal scroll row showing series episodes the user was watching.
 * Reads all watch_progress_* keys from localStorage on mount.
 * Hidden entirely if no progress exists.
 *
 * Imports from existing project: scroll-row CSS class.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useAllWatchProgress, type WatchProgressEntry } from '@/hooks/useWatchProgress';
import { getEpisodeById, type Series, type Season, type Episode } from '@/lib/seriesData';
import ContinueWatchingCard from './ContinueWatchingCard';

interface ResolvedItem {
  series: Series;
  season: Season;
  episode: Episode;
  progress: WatchProgressEntry;
}

export default function SeriesContinueWatchingRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const allProgress = useAllWatchProgress();

  const items = useMemo<ResolvedItem[]>(() => {
    const result: ResolvedItem[] = [];
    for (const p of allProgress) {
      if (p.completed || p.timestamp <= 0) continue;
      const found = getEpisodeById(p.episodeId);
      if (found) {
        result.push({ ...found, progress: p });
      }
    }
    return result;
  }, [allProgress]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -720 : 720,
      behavior: 'smooth',
    });
  };

  if (!items.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl font-bold text-foreground">Continue Watching Series</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors text-muted hover:text-white"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors text-muted hover:text-white"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="scroll-row px-4 sm:px-0">
        {items.map((item) => (
          <ContinueWatchingCard
            key={item.episode.id}
            series={item.series}
            season={item.season}
            episode={item.episode}
            progress={item.progress}
          />
        ))}
      </div>
    </section>
  );
}
