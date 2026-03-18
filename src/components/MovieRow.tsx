'use client';

import { useRef } from 'react';
import { Movie } from '@/types/types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  cardWidth?: number;
}

export default function MovieRow({ title, movies, cardWidth = 200 }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = cardWidth * 3;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl font-bold text-white">{title}</h2>
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} width={cardWidth} />
        ))}
      </div>
    </section>
  );
}
