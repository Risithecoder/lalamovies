'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { Movie } from '@/types/types';

interface WatchlistButtonProps {
  movie: Movie;
  variant?: 'icon' | 'full';
}

export default function WatchlistButton({ movie, variant = 'full' }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
        title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <svg
          className={`w-4 h-4 ${inList ? 'text-accent fill-accent' : 'text-white'}`}
          fill={inList ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm ${
        inList
          ? 'bg-accent/20 border border-accent text-accent hover:bg-accent/30'
          : 'bg-surface hover:bg-surface-hover border border-border text-white'
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={inList ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {inList ? 'In Watchlist' : '+ Watchlist'}
    </button>
  );
}
