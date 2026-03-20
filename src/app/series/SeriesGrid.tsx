/**
 * SeriesGrid — client component for the /series catalogue.
 * Handles tab switching between Trending / Popular / Top Rated.
 */

'use client';

import { useState } from 'react';
import { TVShow } from '@/types/types';
import SeriesCard from '@/components/series/SeriesCard';

interface SeriesGridProps {
  trending: TVShow[];
  popular: TVShow[];
  topRated: TVShow[];
}

const TABS = [
  { key: 'trending', label: 'Trending' },
  { key: 'popular', label: 'Popular' },
  { key: 'topRated', label: 'Top Rated' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function SeriesGrid({ trending, popular, topRated }: SeriesGridProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('trending');

  const showsMap: Record<TabKey, TVShow[]> = { trending, popular, topRated };
  const shows = showsMap[activeTab];

  return (
    <>
      {/* Tab pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-accent text-white'
                : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {shows.length > 0 ? (
        <div
          className="grid gap-5 justify-center sm:justify-start pb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 200px))' }}
        >
          {shows.map((show) => (
            <SeriesCard key={show.id} show={show} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-foreground font-semibold text-xl mb-2">
            No series found
          </p>
          <p className="text-muted">Try a different category</p>
        </div>
      )}
    </>
  );
}
