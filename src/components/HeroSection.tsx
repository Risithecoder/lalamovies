import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/types';
import { getBackdropUrl, getPosterUrl, generateSlug } from '@/services/tmdb';

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const slug = `${generateSlug(movie.title, movie.release_date)}-${movie.id}`;
  const year = movie.release_date?.split('-')[0] || '';
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full overflow-hidden">
      {/* Backdrop Image */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
          quality={85}
        />
      )}

      {/* Gradient overlays */}
      <div className="hero-gradient absolute inset-0" />
      <div className="hero-gradient-bottom absolute inset-0" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 max-w-[1400px] mx-auto">
        <div className="flex items-end gap-6">
          {/* Poster */}
          <div className="hidden sm:block w-32 lg:w-40 flex-shrink-0">
            <div className="poster-card w-full">
              <Image
                src={getPosterUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                width={160}
                height={240}
                className="object-cover w-full h-full rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 mb-4 text-sm text-muted">
              <span>{year}</span>
              {movie.vote_average > 0 && (
                <>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                </>
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-300 line-clamp-3 max-w-2xl mb-6">
              {movie.overview}
            </p>
            <div className="flex gap-3">
              <Link
                href={`/movie/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>
              <Link
                href={`/movie/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover text-white font-medium rounded-lg transition-colors"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
