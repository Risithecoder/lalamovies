/**
 * SeriesCard
 * ----------
 * Poster card for TV shows fetched from TMDB API.
 * Uses next/image for optimized loading (matches MovieCard pattern).
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TVShow } from '@/types/types';
import { getPosterUrl } from '@/services/tmdb';

interface SeriesCardProps {
  show: TVShow;
  width?: number;
}

const SeriesCard = React.memo(function SeriesCard({
  show,
  width = 200,
}: SeriesCardProps) {
  const year = show.first_air_date?.split('-')[0] || '';

  return (
    <Link
      href={`/series/${show.id}`}
      className="poster-card group"
      style={{ width, minWidth: width }}
    >
      <Image
        src={getPosterUrl(show.poster_path)}
        alt={show.name}
        width={width}
        height={width * 1.5}
        className="object-cover w-full h-full"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-3">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">
            {show.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted">{year}</span>
            {show.vote_average > 0 && (
              <span className="text-xs text-yellow-400">{show.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

export default SeriesCard;
