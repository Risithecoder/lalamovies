import { TVShow } from '@/types/types';
import SeriesCard from './series/SeriesCard';

interface SeriesGridProps {
  shows: TVShow[];
  cardWidth?: number;
  emptyMessage?: string;
}

export default function SeriesGrid({ shows, cardWidth = 200, emptyMessage = 'No TV shows found' }: SeriesGridProps) {
  if (!shows || shows.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-lg">{emptyMessage}</p>
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
      {shows.map((show) => (
        <SeriesCard key={show.id} show={show} width={cardWidth} />
      ))}
    </div>
  );
}
