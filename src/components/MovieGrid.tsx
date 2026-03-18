import { Movie } from '@/types/types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  cardWidth?: number;
}

export default function MovieGrid({ movies, cardWidth = 200 }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 justify-center"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth - 40}px, ${cardWidth}px))`,
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} width={cardWidth} />
      ))}
    </div>
  );
}
