'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { ContinueWatchingItem } from '@/types/types';
import { getPosterUrl } from '@/services/tmdb';

function ContinueWatchingCard({
  item,
  onRemove,
}: {
  item: ContinueWatchingItem;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="relative flex-shrink-0 group" style={{ width: 160 }}>
      <Link href={`/movie/${item.slug}`} className="block">
        <div className="poster-card w-full relative overflow-hidden">
          <Image
            src={getPosterUrl(item.poster_path, 'w342')}
            alt={item.title}
            width={160}
            height={240}
            className="object-cover w-full h-full"
            loading="lazy"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-accent" style={{ width: '30%' }} />
          </div>
        </div>
        <p className="text-xs text-muted mt-1.5 truncate">{item.title}</p>
      </Link>
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(item.movieId);
        }}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        aria-label="Remove from continue watching"
      >
        ×
      </button>
    </div>
  );
}

export default function ContinueWatchingRow() {
  const { continueWatching, removeFromContinueWatching } = useContinueWatching();

  if (!continueWatching.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4">▶ Continue Watching</h2>
      <div className="scroll-row">
        {continueWatching.map((item) => (
          <ContinueWatchingCard
            key={item.movieId}
            item={item}
            onRemove={removeFromContinueWatching}
          />
        ))}
      </div>
    </section>
  );
}
