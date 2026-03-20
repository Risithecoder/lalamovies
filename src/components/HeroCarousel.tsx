'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/types';
import { getBackdropUrl, getPosterUrl, generateSlug } from '@/services/tmdb';
import TrailerModal from './TrailerModal';

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const slides = movies.slice(0, 8);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-slide every 5s, pause on hover
  useEffect(() => {
    if (isHovered) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, slides.length]);

  if (!slides.length) return null;

  const movie = slides[current];
  const slug = `${generateSlug(movie.title, movie.release_date)}-${movie.id}`;
  const year = movie.release_date?.split('-')[0] || '';

  return (
    <section
      className="relative h-[75vh] min-h-[520px] max-h-[850px] w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backdrop slides */}
      {slides.map((m, i) => {
        const bdUrl = getBackdropUrl(m.backdrop_path);
        return (
          <div
            key={m.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {bdUrl && (
              <Image
                src={bdUrl}
                alt={m.title}
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority={i === 0}
                quality={85}
              />
            )}
          </div>
        );
      })}

      {/* Gradient overlays */}
      <div className="hero-gradient absolute inset-0 z-10" />
      <div className="hero-gradient-bottom absolute inset-0 z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-14 pt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex items-end gap-5 sm:gap-8">
          {/* Poster */}
          <div className="hidden sm:block w-28 lg:w-36 flex-shrink-0">
            <div className="poster-card w-full shadow-2xl">
              <Image
                src={getPosterUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                width={144}
                height={216}
                className="object-cover w-full h-full rounded-lg"
                priority={current === 0}
              />
            </div>
          </div>

          {/* Info */}
          <div
            key={movie.id}
            className="flex-1 min-w-0"
            style={{ animation: 'heroContentIn 0.5s ease forwards' }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight drop-shadow-lg">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 mb-3 text-sm">
              <span className="text-gray-300">{year}</span>
              {movie.vote_average > 0 && (
                <>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-yellow-400 font-medium">{movie.vote_average.toFixed(1)}</span>
                </>
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-300 line-clamp-2 sm:line-clamp-3 max-w-2xl mb-5 leading-relaxed drop-shadow">
              {movie.overview}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href={`/movie/${slug}`}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>
              <TrailerModal
                movieId={movie.id}
                movieTitle={movie.title}
                buttonClassName="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black/40 hover:bg-black/60 text-white font-semibold rounded-lg transition-all hover:scale-105 border border-white/20 backdrop-blur-sm text-sm sm:text-base"
              />
              <Link
                href={`/movie/${slug}`}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-black/40 hover:bg-black/60 text-white font-medium rounded-lg transition-all hover:scale-105 border border-white/20 backdrop-blur-sm"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
