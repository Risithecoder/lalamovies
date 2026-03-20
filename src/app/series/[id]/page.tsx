/**
 * Series Detail Page — /series/[id]
 * -----------------------------------
 * Server component that handles both:
 * - Numeric IDs → TMDB TV show detail (fetched from API)
 * - String slugs → Local playable series (from seriesData)
 */

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  getTVDetails,
  getTVSeasonDetails,
  getSimilarTV,
  getPosterUrl,
  getBackdropUrl,
} from '@/services/tmdb';
import { getSeriesById } from '@/lib/seriesData';
import TrendingSeriesRow from '@/components/series/TrendingSeriesRow';
import LocalSeriesDetail from './LocalSeriesDetail';
import SeriesPlayerSection from './SeriesPlayerSection';
import WatchlistButton from '@/components/WatchlistButton';

interface SeriesPageProps {
  params: Promise<{ id: string }>;
}

function isNumericId(id: string): boolean {
  return /^\d+$/.test(id);
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { id } = await params;

  if (isNumericId(id)) {
    try {
      const show = await getTVDetails(Number(id));
      const year = show.first_air_date?.split('-')[0] || '';
      return {
        title: `${show.name} (${year}) — LaLaMovies`,
        description: show.overview,
      };
    } catch {
      return { title: 'Series Not Found' };
    }
  }

  const series = getSeriesById(id);
  if (series) {
    return {
      title: `${series.title} (${series.year}) — LaLaMovies`,
      description: series.description,
    };
  }
  return { title: 'Series Not Found' };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { id } = await params;

  // ── Local playable series (string slug like 'dark-horizon') ──
  if (!isNumericId(id)) {
    const series = getSeriesById(id);
    if (!series) {
      return (
        <div className="page-enter pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground font-semibold text-xl mb-2">Series not found</p>
            <Link href="/series" className="text-accent hover:underline">
              Browse all series
            </Link>
          </div>
        </div>
      );
    }
    return <LocalSeriesDetail series={series} />;
  }

  // ── TMDB TV show (numeric ID) ──
  const tmdbId = Number(id);
  let show;
  try {
    show = await getTVDetails(tmdbId);
  } catch {
    return (
      <div className="page-enter pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-semibold text-xl mb-2">Series not found</p>
          <Link href="/series" className="text-accent hover:underline">
            Browse all series
          </Link>
        </div>
      </div>
    );
  }

  // Fetch season details + similar shows in parallel
  const firstSeasonNum = show.seasons?.find((s) => s.season_number > 0)?.season_number || 1;
  const [seasonDetails, similar] = await Promise.all([
    getTVSeasonDetails(tmdbId, firstSeasonNum).catch(() => null),
    getSimilarTV(tmdbId).catch(() => []),
  ]);

  const year = show.first_air_date?.split('-')[0] || '';
  const backdropUrl = getBackdropUrl(show.backdrop_path);

  // Create a Movie-compatible object for the watchlist button
  const movieCompat = {
    id: show.id,
    title: show.name,
    overview: show.overview,
    poster_path: show.poster_path,
    backdrop_path: show.backdrop_path,
    release_date: show.first_air_date || '',
    vote_average: show.vote_average,
    vote_count: show.vote_count,
    popularity: show.popularity,
    genre_ids: show.genre_ids || [],
  };

  return (
    <div className="page-enter">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[350px] w-full overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={show.name}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
            quality={80}
          />
        )}
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-gradient-bottom absolute inset-0" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 sm:w-56 lg:w-64 mx-auto lg:mx-0">
            <div className="poster-card w-full shadow-2xl">
              <Image
                src={getPosterUrl(show.poster_path, 'w500')}
                alt={show.name}
                width={256}
                height={384}
                className="object-cover w-full h-full rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-muted italic mb-4">&ldquo;{show.tagline}&rdquo;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted">
              <span>{year}</span>
              {show.number_of_seasons > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
                </>
              )}
              {show.number_of_episodes > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span>{show.number_of_episodes} Episodes</span>
                </>
              )}
              {show.vote_average > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span className="text-yellow-400">{show.vote_average.toFixed(1)}</span>
                  <span className="text-xs">({show.vote_count.toLocaleString()} votes)</span>
                </>
              )}
            </div>

            {/* Status badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                show.status === 'Returning Series'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : show.status === 'Ended'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {show.status}
            </span>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-surface border border-border rounded-full text-xs text-muted"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
              <p className="text-muted leading-relaxed">{show.overview}</p>
            </div>

            <WatchlistButton movie={movieCompat} />
          </div>
        </div>

        {/* Streaming Player */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Watch Now</h2>
          <SeriesPlayerSection
            tmdbId={tmdbId}
            showName={show.name}
            seasons={show.seasons || []}
            initialSeason={firstSeasonNum}
            initialEpisodes={seasonDetails?.episodes || []}
          />
        </div>

        {/* Similar Shows */}
        {similar.length > 0 && (
          <div className="mt-12">
            <TrendingSeriesRow title="Similar Series" shows={similar} />
          </div>
        )}
      </div>
    </div>
  );
}
