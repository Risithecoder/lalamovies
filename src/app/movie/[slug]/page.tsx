import { Metadata } from 'next';
import Image from 'next/image';
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getPosterUrl,
  getBackdropUrl,
  generateSlug,
} from '@/services/tmdb';
import MovieRow from '@/components/MovieRow';
import MoviePlayerSection from './MoviePlayerSection';
import TrailerModal from '@/components/TrailerModal';
import WatchlistButton from '@/components/WatchlistButton';
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker';

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return isNaN(id) ? null : id;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = await params;
  const movieId = extractIdFromSlug(slug);
  if (!movieId) return { title: 'Movie Not Found' };

  try {
    const movie = await getMovieDetails(movieId);
    const year = movie.release_date?.split('-')[0] || '';
    return {
      title: `${movie.title} (${year})`,
      description: movie.overview,
      openGraph: {
        title: `${movie.title} (${year}) — LaLaMovies`,
        description: movie.overview,
        images: movie.poster_path
          ? [{ url: getPosterUrl(movie.poster_path, 'w780') }]
          : [],
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title} (${year})`,
        description: movie.overview,
      },
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  const movieId = extractIdFromSlug(slug);

  if (!movieId) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted text-lg">Movie not found</p>
      </div>
    );
  }

  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
  ]);

  const year = movie.release_date?.split('-')[0] || '';
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const topCast = credits.cast.slice(0, 12);
  const director = credits.crew.find((c) => c.job === 'Director');
  const movieSlug = `${generateSlug(movie.title, movie.release_date)}-${movie.id}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    datePublished: movie.release_date,
    image: movie.poster_path ? getPosterUrl(movie.poster_path, 'original') : undefined,
    aggregateRating: movie.vote_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      bestRating: 10,
      ratingCount: movie.vote_count,
    } : undefined,
    director: director ? { '@type': 'Person', name: director.name } : undefined,
    actor: topCast.slice(0, 5).map((a) => ({ '@type': 'Person', name: a.name })),
    genre: movie.genres?.map((g) => g.name),
  };

  return (
    <div className="page-enter">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[350px] w-full overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={movie.title}
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
                src={getPosterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                width={256}
                height={384}
                className="object-cover w-full h-full rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-muted italic mb-4">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted">
              <span>{year}</span>
              {movie.runtime > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </>
              )}
              {movie.vote_average > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span className="text-yellow-400">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-xs">({movie.vote_count.toLocaleString()} votes)</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
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
              <p className="text-muted leading-relaxed">{movie.overview}</p>
            </div>

            {director && (
              <p className="text-sm text-muted mb-6">
                <span className="text-foreground font-medium">Director:</span> {director.name}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <WatchlistButton movie={movie} />
              <TrailerModal movieId={movie.id} movieTitle={movie.title} />
            </div>
          </div>
        </div>

        {/* Streaming Player */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Watch Now</h2>
          <MoviePlayerSection
            movieId={movie.id}
            movieTitle={movie.title}
            movieSlug={movieSlug}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            voteAverage={movie.vote_average}
          />
        </div>

        {/* Side-effect: track this movie as recently viewed */}
        <RecentlyViewedTracker movie={movie} />

        {/* Cast */}
        {topCast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topCast.map((person) => (
                <div
                  key={person.id}
                  className="bg-surface rounded-lg p-3 text-center hover:bg-surface-hover transition-colors"
                >
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-border mb-2">
                    {person.profile_path ? (
                      <Image
                        src={getPosterUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-xl">
                        
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
                  <p className="text-xs text-muted truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Similar Movies" movies={similar} />
          </div>
        )}
      </div>
    </div>
  );
}
