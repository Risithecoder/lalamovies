/**
 * SeasonSelector
 * --------------
 * Horizontal scrollable pill-tab row for season selection.
 * Sticky positioning on scroll with mobile horizontal scrolling.
 *
 * Imports from existing project: none.
 */

'use client';

import React from 'react';
import { Season } from '@/lib/seriesData';

interface SeasonSelectorProps {
  seasons: Season[];
  activeSeason: number; // seasonNumber
  onSelect: (seasonNumber: number) => void;
  className?: string;
}

const SeasonSelector = React.memo(function SeasonSelector({
  seasons,
  activeSeason,
  onSelect,
  className = '',
}: SeasonSelectorProps) {
  return (
    <div className={`sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-3 border-b border-border ${className}`}>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0" style={{ scrollbarWidth: 'none' }}>
        {seasons.map((season) => {
          const isActive = season.seasonNumber === activeSeason;
          return (
            <button
              key={season.seasonNumber}
              onClick={() => onSelect(season.seasonNumber)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/25'
                  : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              Season {season.seasonNumber}
              <span className="ml-1.5 text-xs opacity-70">
                {season.episodes.length} ep
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default SeasonSelector;
