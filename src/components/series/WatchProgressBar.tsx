/**
 * WatchProgressBar
 * ----------------
 * Reusable thin progress bar for episode thumbnails and cards.
 * Shows watch completion as a colored bar at the bottom of a container.
 *
 * Imports from existing project: none.
 */

import React from 'react';

interface WatchProgressBarProps {
  progress: number; // 0–1
  className?: string;
}

const WatchProgressBar = React.memo(function WatchProgressBar({
  progress,
  className = '',
}: WatchProgressBarProps) {
  if (progress <= 0) return null;

  return (
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white/20 ${className}`}>
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  );
});

export default WatchProgressBar;
