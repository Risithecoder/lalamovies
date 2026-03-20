/**
 * Video Player Page — /series/[id]/[episodeId]
 * ----------------------------------------------
 * Full-screen video player for series episodes.
 * Uses the custom VideoPlayer component with HLS support.
 *
 * Imports from existing project: none (standalone page).
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSeriesById, getEpisodeById } from '@/lib/seriesData';
import VideoPlayer from '@/components/series/VideoPlayer';

export default function EpisodePlayerPage() {
  const params = useParams<{ id: string; episodeId: string }>();
  const router = useRouter();

  const series = getSeriesById(params.id);
  const result = getEpisodeById(params.episodeId);

  if (!series || !result) {
    return (
      <div className="page-enter pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-semibold text-xl mb-2">Episode not found</p>
          <Link href={`/series/${params.id}`} className="text-accent hover:underline">
            Back to series
          </Link>
        </div>
      </div>
    );
  }

  const { season, episode } = result;

  const handleNavigateToEpisode = (episodeId: string) => {
    router.push(`/series/${params.id}/${episodeId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Back button (always visible at top-left, above player) */}
      <Link
        href={`/series/${params.id}`}
        className="absolute top-4 left-4 z-[110] w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <VideoPlayer
        episode={episode}
        season={season}
        seriesId={series.id}
        seriesTitle={series.title}
        onNavigateToEpisode={handleNavigateToEpisode}
      />
    </div>
  );
}
