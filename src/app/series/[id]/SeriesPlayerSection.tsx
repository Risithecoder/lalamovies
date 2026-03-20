/**
 * SeriesPlayerSection — client component for streaming TV episodes.
 * Season/episode selector + iframe player + server selector.
 * Mirrors MoviePlayerSection pattern.
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Player from '@/components/Player';
import { TV_STREAMING_SERVERS, getTVStreamUrl } from '@/services/streaming';
import { getPosterUrl } from '@/services/tmdb';
import { TVSeasonSummary, TVEpisodeInfo } from '@/types/types';

interface SeriesPlayerSectionProps {
  tmdbId: number;
  showName: string;
  seasons: TVSeasonSummary[];
  initialSeason: number;
  initialEpisodes: TVEpisodeInfo[];
}

export default function SeriesPlayerSection({
  tmdbId,
  showName,
  seasons,
  initialSeason,
  initialEpisodes,
}: SeriesPlayerSectionProps) {
  const [activeServer, setActiveServer] = useState(TV_STREAMING_SERVERS[0].id);
  const [activeSeason, setActiveSeason] = useState(initialSeason);
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<TVEpisodeInfo[]>(initialEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const streamUrl = getTVStreamUrl(activeServer, tmdbId, activeSeason, activeEpisode);

  // Fetch episodes when season changes
  const handleSeasonChange = useCallback(async (seasonNum: number) => {
    setActiveSeason(seasonNum);
    setActiveEpisode(1);
    setLoadingEpisodes(true);
    try {
      const res = await fetch(`/api/tv-season?id=${tmdbId}&season=${seasonNum}`);
      if (res.ok) {
        const data = await res.json();
        setEpisodes(data.episodes || []);
      }
    } catch {
      // Keep existing episodes on error
    } finally {
      setLoadingEpisodes(false);
    }
  }, [tmdbId]);

  const tryNextServer = useCallback(() => {
    const currentIndex = TV_STREAMING_SERVERS.findIndex((s) => s.id === activeServer);
    const nextIndex = (currentIndex + 1) % TV_STREAMING_SERVERS.length;
    setActiveServer(TV_STREAMING_SERVERS[nextIndex].id);
  }, [activeServer]);

  // Filter out specials (season 0)
  const validSeasons = seasons.filter((s) => s.season_number > 0);

  return (
    <div className="space-y-6">
      {/* Player */}
      <div className="ring-1 ring-border rounded-xl shadow-2xl overflow-hidden">
        <Player
          url={streamUrl}
          title={`${showName} S${activeSeason}E${activeEpisode}`}
          onError={tryNextServer}
        />
      </div>

      {/* Season & Episode Selector */}
      <div className="bg-surface/30 p-4 rounded-xl border border-border">
        {/* Season pills */}
        {validSeasons.length > 1 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Season</h4>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {validSeasons.map((season) => (
                <button
                  key={season.season_number}
                  onClick={() => handleSeasonChange(season.season_number)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSeason === season.season_number
                      ? 'bg-accent text-white shadow-lg shadow-accent/25'
                      : 'bg-surface text-muted hover:bg-surface-hover hover:text-white border border-border/50'
                  }`}
                >
                  Season {season.season_number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode list */}
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Episodes</h4>
          {loadingEpisodes ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted">Loading episodes...</span>
            </div>
          ) : (
            <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep.episode_number)}
                  className={`flex items-start gap-3 p-2 rounded-lg text-left transition-all duration-200 ${
                    activeEpisode === ep.episode_number
                      ? 'bg-accent/15 ring-1 ring-accent/30'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  {/* Thumbnail */}
                  {ep.still_path ? (
                    <div className="relative flex-shrink-0 w-24 aspect-video rounded overflow-hidden">
                      <Image
                        src={getPosterUrl(ep.still_path, 'w185')}
                        alt={ep.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        loading="lazy"
                      />
                      {activeEpisode === ep.episode_number && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-24 aspect-video rounded bg-surface flex items-center justify-center">
                      <span className="text-xs text-muted">E{ep.episode_number}</span>
                    </div>
                  )}

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${
                        activeEpisode === ep.episode_number ? 'text-accent' : 'text-muted'
                      }`}>
                        E{ep.episode_number}
                      </span>
                      {ep.runtime && (
                        <span className="text-xs text-muted">{ep.runtime}m</span>
                      )}
                    </div>
                    <p className={`text-sm font-medium line-clamp-1 ${
                      activeEpisode === ep.episode_number ? 'text-foreground' : 'text-foreground/80'
                    }`}>
                      {ep.name}
                    </p>
                    {ep.overview && (
                      <p className="text-xs text-muted line-clamp-1 mt-0.5">{ep.overview}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Server Selector */}
      <div className="bg-surface/30 p-4 rounded-xl border border-accent/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Streaming Servers
          </h3>
          <span className="text-xs text-muted">{TV_STREAMING_SERVERS.length} Sources</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {TV_STREAMING_SERVERS.map((server) => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeServer === server.id
                  ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25 scale-105 ring-1 ring-white/20'
                  : 'bg-surface text-muted hover:bg-surface-hover hover:text-white hover:scale-105 border border-border/50'
              }`}
            >
              {activeServer === server.id && (
                <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
              )}
              {server.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          If the video doesn&apos;t load, try switching servers. Some servers may be temporarily unavailable.
        </p>
      </div>
    </div>
  );
}
