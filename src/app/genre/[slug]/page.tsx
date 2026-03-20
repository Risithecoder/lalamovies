import { Metadata } from 'next';
import { getMoviesByGenre, getGenres, GENRE_SLUG_MAP } from '@/services/tmdb';
import MovieGrid from '@/components/MovieGrid';

interface GenrePageProps {
  params: Promise<{ slug: string }>;
}

async function resolveGenre(slug: string) {
  // Try direct mapping first
  const directId = GENRE_SLUG_MAP[slug];
  if (directId) {
    const genres = await getGenres();
    const genre = genres.find((g) => g.id === directId);
    return { id: directId, name: genre?.name || slug };
  }

  // Fallback: match by name
  const genres = await getGenres();
  const genre = genres.find(
    (g) => g.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
  if (genre) return { id: genre.id, name: genre.name };

  return null;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = await resolveGenre(slug);
  const name = genre?.name || slug.replace(/-/g, ' ');
  return {
    title: `${name} Movies`,
    description: `Browse ${name.toLowerCase()} movies. Discover the best ${name.toLowerCase()} films on LaLaMovies.`,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  const genre = await resolveGenre(slug);

  if (!genre) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted text-lg">Genre not found</p>
      </div>
    );
  }

  const data = await getMoviesByGenre(genre.id);

  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{genre.name} Movies</h1>
        <p className="text-muted mb-8">
          {data.total_results.toLocaleString()} movies found
        </p>
        <MovieGrid movies={data.results} />
      </div>
    </div>
  );
}
