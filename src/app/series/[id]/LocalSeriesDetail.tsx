/**
 * LocalSeriesDetail — client component for playable series.
 * Handles episode grid, watch progress, and watchlist toggle.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getTotalEpisodes,
  formatDurationHuman,
  type Series,
} from '@/lib/seriesData';
import { getAllWatchProgress, type WatchProgressEntry } from '@/hooks/useWatchProgress';
import SeasonSelector from '@/components/series/SeasonSelector';
import EpisodeCard from '@/components/series/EpisodeCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import { getBackdropUrl } from '@/services/tmdb';

interface LocalSeriesDetailProps {
  series: Series;
  tmdbBackdrop?: string | null;
  tmdbPoster?: string | null;
}

export default function LocalSeriesDetail({ series, tmdbBackdrop, tmdbPoster }: LocalSeriesDetailProps) {
  const [activeSeason, setActiveSeason] = useState(1);
  const [progressMap, setProgressMap] = useState<Record<string, WatchProgressEntry>>({});

  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = useMemo(
    () => watchlist.some((item) => (item as { id: number | string }).id === series.id),
    [watchlist, series]
  );

  useEffect(() => {
    const entries = getAllWatchProgress();
    const map: Record<string, WatchProgressEntry> = {};
    for (const e of entries) {
      if (e.seriesId === series.id) {
        map[e.episodeId] = e;
      }
    }
    setProgressMap(map);
  }, [series.id]);

  const currentSeason = series.seasons.find((s) => s.seasonNumber === activeSeason) || series.seasons[0];

  const continueEpisode = useMemo(() => {
    let best: { episodeId: string; timestamp: number } | null = null;
    for (const ep of Object.values(progressMap)) {
      if (!ep.completed && ep.timestamp > 0) {
        if (!best || ep.updatedAt > (progressMap[best.episodeId]?.updatedAt || 0)) {
          best = { episodeId: ep.episodeId, timestamp: ep.timestamp };
        }
      }
    }
    return best?.episodeId || null;
  }, [progressMap]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(series.id as unknown as number);
    } else {
      addToWatchlist({
        id: series.id as unknown as number,
        title: series.title,
        overview: series.description,
        poster_path: tmdbPoster || series.poster,
        backdrop_path: tmdbBackdrop || series.backdrop,
        release_date: String(series.year),
        vote_average: series.rating,
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        // @ts-expect-error extending watchlist to support series
        _type: 'series',
      });
    }
  };

  const backdropUrl = tmdbBackdrop ? getBackdropUrl(tmdbBackdrop) : series.backdrop;

  return (
    <div className="page-enter min-h-screen">
      {/* Hero section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={series.title}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
            quality={80}
          />
        )}
        <div className="absolute inset-0 hero-gradient-bottom" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="max-w-2xl">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  series.status === 'ongoing'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {series.status === 'ongoing' ? 'Ongoing' : 'Completed'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
                {series.title}
              </h1>
              <p className="text-white/60 text-sm sm:text-base italic mb-4">
                {series.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-4">
                <span className="text-yellow-400 font-semibold">{series.rating.toFixed(1)}</span>
                <span>{series.year}</span>
                <span>{series.seasons.length} Season{series.seasons.length > 1 ? 's' : ''}</span>
                <span>{getTotalEpisodes(series)} Episodes</span>
              </div>

              <div className="flex gap-2 mb-5">
                {series.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded bg-white/10 text-white/80 text-xs font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-6">
                {series.description}
              </p>

              <div className="flex gap-3">
                <Link
                  href={`/series/${series.id}/${
                    continueEpisode || series.seasons[0].episodes[0].id
                  }`}
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {continueEpisode ? 'Continue Watching' : 'Watch Now'}
                </Link>
                <button
                  onClick={handleWatchlistToggle}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    isInWatchlist
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeasonSelector
        seasons={series.seasons}
        activeSeason={activeSeason}
        onSelect={setActiveSeason}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {continueEpisode && (() => {
          const ep = currentSeason.episodes.find((e) => e.id === continueEpisode);
          if (!ep) return null;
          const prog = progressMap[ep.id];
          return (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wide">
                Continue Watching
              </h3>
              <div className="max-w-md">
                <EpisodeCard
                  episode={ep}
                  seriesId={series.id}
                  seasonNumber={currentSeason.seasonNumber}
                  progress={prog ? prog.timestamp / prog.duration : 0}
                  isCompleted={false}
                  isContinueWatching
                />
              </div>
            </div>
          );
        })()}

        <h3 className="text-lg font-bold text-foreground mb-4">
          {currentSeason.title || `Season ${currentSeason.seasonNumber}`}
          <span className="text-muted text-sm font-normal ml-2">
            {currentSeason.episodes.length} episodes &middot;{' '}
            {formatDurationHuman(
              currentSeason.episodes.reduce((sum, e) => sum + e.duration, 0)
            )}
          </span>
        </h3>

        <div
          className="grid gap-4 pb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {currentSeason.episodes.map((episode, i) => {
            const prog = progressMap[episode.id];
            return (
              <div
                key={episode.id}
                style={{
                  animation: `slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms both`,
                }}
              >
                <EpisodeCard
                  episode={episode}
                  seriesId={series.id}
                  seasonNumber={currentSeason.seasonNumber}
                  progress={prog ? prog.timestamp / prog.duration : 0}
                  isCompleted={prog?.completed || false}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
