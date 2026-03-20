/**
 * ContinueWatchingCard
 * --------------------
 * Compact landscape card (16:9, 240px wide) for the homepage
 * "Continue Watching" series row. Shows thumbnail with progress bar
 * and "S1 E3 · 12 min left" subtitle text.
 *
 * Imports from existing project: none.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Episode, Season, Series, formatDurationHuman } from '@/lib/seriesData';
import { WatchProgressEntry } from '@/hooks/useWatchProgress';
import WatchProgressBar from './WatchProgressBar';

interface ContinueWatchingCardProps {
  series: Series;
  season: Season;
  episode: Episode;
  progress: WatchProgressEntry;
  className?: string;
}

const ContinueWatchingCard = React.memo(function ContinueWatchingCard({
  series,
  season,
  episode,
  progress,
  className = '',
}: ContinueWatchingCardProps) {
  const remaining = Math.max(0, episode.duration - progress.timestamp);
  const progressRatio = progress.duration > 0 ? progress.timestamp / progress.duration : 0;

  return (
    <Link
      href={`/series/${series.id}/${episode.id}`}
      className={`group block flex-shrink-0 rounded-lg overflow-hidden bg-surface hover:bg-surface-hover transition-colors ${className}`}
      style={{ width: 240, minWidth: 240 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          sizes="240px"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEzNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
          <div className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <WatchProgressBar progress={progressRatio} />
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs font-semibold text-foreground line-clamp-1">{series.title}</p>
        <p className="text-[11px] text-muted mt-0.5">
          S{season.seasonNumber} E{episode.episodeNumber} &middot; {formatDurationHuman(remaining)} left
        </p>
      </div>
    </Link>
  );
});

export default ContinueWatchingCard;
