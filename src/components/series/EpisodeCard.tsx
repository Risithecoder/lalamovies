/**
 * EpisodeCard
 * -----------
 * Episode thumbnail card with 16:9 aspect ratio, progress bar, badges,
 * and shimmer loading skeleton.
 *
 * Imports from existing project: none.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Episode, formatDurationHuman } from '@/lib/seriesData';
import WatchProgressBar from './WatchProgressBar';

interface EpisodeCardProps {
  episode: Episode;
  seriesId: string;
  seasonNumber: number;
  progress?: number; // 0–1 watch progress
  isCompleted?: boolean;
  isContinueWatching?: boolean;
  className?: string;
}

const EpisodeCard = React.memo(function EpisodeCard({
  episode,
  seriesId,
  seasonNumber,
  progress = 0,
  isCompleted = false,
  isContinueWatching = false,
  className = '',
}: EpisodeCardProps) {
  return (
    <Link
      href={`/series/${seriesId}/${episode.id}`}
      className={`group block rounded-lg overflow-hidden bg-surface hover:bg-surface-hover transition-colors ${
        isContinueWatching ? 'ring-2 ring-accent/50' : ''
      } ${className}`}
    >
      {/* Thumbnail container */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+"
        />

        {/* Episode number badge (top-left) */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          S{seasonNumber} E{episode.episodeNumber}
        </div>

        {/* Duration badge (top-right) */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {formatDurationHuman(episode.duration)}
        </div>

        {/* Completed checkmark badge */}
        {isCompleted && (
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500/90 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
          <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Watch progress bar */}
        <WatchProgressBar progress={progress} />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-white transition-colors">
          {episode.title}
        </h3>
        <p className="text-xs text-muted mt-1 line-clamp-1">{episode.description}</p>
      </div>
    </Link>
  );
});

export default EpisodeCard;
