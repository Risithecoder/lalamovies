'use client';

import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import MovieGrid from '@/components/MovieGrid';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Watchlist</h1>
          {watchlist.length > 0 && (
            <span className="text-sm text-muted">{watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <p className="text-muted mb-8">Movies you want to watch</p>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="w-16 h-16 text-muted opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-white font-semibold text-xl mb-2">Your watchlist is empty</p>
            <p className="text-muted mb-6">Start adding movies you want to watch</p>
            <Link
              href="/explore"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
            >
              Browse Movies →
            </Link>
          </div>
        ) : (
          <>
            <MovieGrid movies={watchlist} />
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => watchlist.forEach((m) => removeFromWatchlist(m.id))}
                className="text-sm text-muted hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
