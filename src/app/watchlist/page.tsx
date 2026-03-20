'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import MovieGrid from '@/components/MovieGrid';
import { getSeriesById } from '@/lib/seriesData';
import { getAllWatchProgress } from '@/hooks/useWatchProgress';
import type { Movie } from '@/types/types';

type Tab = 'movies' | 'series';

interface SeriesWatchlistItem {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  continueEpisodeId: string | null;
}

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<Tab>('movies');

  // Separate movies and series from the unified watchlist
  const { movies, seriesItems } = useMemo(() => {
    const movies: Movie[] = [];
    const seriesItems: SeriesWatchlistItem[] = [];

    for (const item of watchlist) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((item as any)._type === 'series') {
        const id = String(item.id);
        const series = getSeriesById(id);
        if (series) {
          // Find continue watching episode
          const progress = getAllWatchProgress().filter(
            (p) => p.seriesId === id && !p.completed && p.timestamp > 0
          );
          const latest = progress.sort((a, b) => b.updatedAt - a.updatedAt)[0];

          seriesItems.push({
            id,
            title: series.title,
            poster: series.poster,
            genres: series.genres,
            continueEpisodeId: latest?.episodeId || series.seasons[0].episodes[0].id,
          });
        }
      } else {
        movies.push(item);
      }
    }
    return { movies, seriesItems };
  }, [watchlist]);

  const totalCount = movies.length + seriesItems.length;

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Watchlist</h1>
          {totalCount > 0 && (
            <span className="text-sm text-muted">
              {totalCount} item{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-muted mb-6">Movies and series you want to watch</p>

        {/* Tab switcher */}
        {(movies.length > 0 || seriesItems.length > 0) && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'movies'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              Movies{movies.length > 0 ? ` (${movies.length})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'series'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              Series{seriesItems.length > 0 ? ` (${seriesItems.length})` : ''}
            </button>
          </div>
        )}

        {/* Movies tab */}
        {activeTab === 'movies' && (
          <>
            {movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="w-16 h-16 text-muted opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-foreground font-semibold text-xl mb-2">No movies in watchlist</p>
                <p className="text-muted mb-6">Start adding movies you want to watch</p>
                <Link
                  href="/explore"
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  Browse Movies
                </Link>
              </div>
            ) : (
              <>
                <MovieGrid movies={movies} />
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => movies.forEach((m) => removeFromWatchlist(m.id))}
                    className="text-sm text-muted hover:text-red-400 transition-colors"
                  >
                    Clear all movies
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Series tab */}
        {activeTab === 'series' && (
          <>
            {seriesItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="w-16 h-16 text-muted opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-foreground font-semibold text-xl mb-2">No series in watchlist</p>
                <p className="text-muted mb-6">Start adding series you want to watch</p>
                <Link
                  href="/series"
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  Browse Series
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="grid gap-5 justify-center sm:justify-start pb-8"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 200px))' }}
                >
                  {seriesItems.map((item) => (
                    <div key={item.id} className="group">
                      <Link href={`/series/${item.id}`} className="poster-card block" style={{ width: '100%' }}>
                        <img
                          src={item.poster}
                          alt={item.title}
                          loading="lazy"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <h3 className="text-white text-sm font-semibold line-clamp-2">{item.title}</h3>
                          <div className="flex gap-1 mt-1">
                            {item.genres.slice(0, 2).map((g) => (
                              <span key={g} className="text-[10px] text-white/60">{g}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-foreground font-medium truncate">{item.title}</p>
                        <Link
                          href={`/series/${item.id}/${item.continueEpisodeId}`}
                          className="text-[10px] font-semibold text-accent hover:underline flex-shrink-0 ml-2"
                        >
                          Resume
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      seriesItems.forEach((s) => removeFromWatchlist(s.id as unknown as number))
                    }
                    className="text-sm text-muted hover:text-red-400 transition-colors"
                  >
                    Clear all series
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
