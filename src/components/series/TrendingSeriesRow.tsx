/**
 * TrendingSeriesRow
 * -----------------
 * Horizontal scroll row of SeriesCard components.
 * Accepts TVShow[] as props (fetched server-side, like MovieRow).
 */

'use client';

import { useRef } from 'react';
import { TVShow } from '@/types/types';
import SeriesCard from './SeriesCard';

interface TrendingSeriesRowProps {
  title: string;
  shows: TVShow[];
  cardWidth?: number;
}

export default function TrendingSeriesRow({ title, shows, cardWidth = 200 }: TrendingSeriesRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth * 3 : cardWidth * 3,
      behavior: 'smooth',
    });
  };

  if (!shows || shows.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
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
        {shows.map((show) => (
          <SeriesCard key={show.id} show={show} width={cardWidth} />
        ))}
      </div>
    </section>
  );
}
