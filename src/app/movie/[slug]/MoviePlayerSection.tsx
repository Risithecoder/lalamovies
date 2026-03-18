'use client';

import { useState, useCallback, useEffect } from 'react';
import Player from '@/components/Player';
import ServerSelector from '@/components/ServerSelector';
import { getStreamUrl, STREAMING_SERVERS } from '@/services/streaming';
import { useContinueWatching } from '@/hooks/useContinueWatching';

interface MoviePlayerSectionProps {
  movieId: number;
  movieTitle: string;
  movieSlug: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

export default function MoviePlayerSection({
  movieId,
  movieTitle,
  movieSlug,
  posterPath,
  releaseDate,
  voteAverage,
}: MoviePlayerSectionProps) {
  const [activeServer, setActiveServer] = useState(STREAMING_SERVERS[0].id);
  const streamUrl = getStreamUrl(activeServer, movieId);
  const { saveProgress } = useContinueWatching();

  // Save to "Continue Watching" once per movie visit
  useEffect(() => {
    saveProgress({
      movieId,
      title: movieTitle,
      poster_path: posterPath,
      release_date: releaseDate,
      vote_average: voteAverage,
      slug: movieSlug,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const tryNextServer = useCallback(() => {
    const currentIndex = STREAMING_SERVERS.findIndex((s) => s.id === activeServer);
    const nextIndex = (currentIndex + 1) % STREAMING_SERVERS.length;
    setActiveServer(STREAMING_SERVERS[nextIndex].id);
  }, [activeServer]);

  return (
    <div className="space-y-6">
      <div className="ring-1 ring-border rounded-xl shadow-2xl overflow-hidden">
        <Player url={streamUrl} title={movieTitle} onError={tryNextServer} />
      </div>
      <div className="bg-surface/30 p-4 rounded-xl border border-accent/20">
        <ServerSelector activeServer={activeServer} onSelect={setActiveServer} />
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
