/**
 * NextEpisodeOverlay
 * ------------------
 * 5-second countdown overlay with SVG ring animation and Cancel button.
 * Shown when current episode ends or when user clicks "Next Episode".
 *
 * Imports from existing project: none.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Episode } from '@/lib/seriesData';

interface NextEpisodeOverlayProps {
  nextEpisode: Episode;
  seasonNumber: number;
  onNavigate: () => void;
  onCancel: () => void;
  className?: string;
}

export default function NextEpisodeOverlay({
  nextEpisode,
  seasonNumber,
  onNavigate,
  onCancel,
  className = '',
}: NextEpisodeOverlayProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigate();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNavigate]);

  const handleCancel = useCallback(() => {
    setCountdown(-1); // stop countdown
    onCancel();
  }, [onCancel]);

  // SVG ring animation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (countdown / 5) * circumference;

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${className}`}
      style={{ animation: 'fadeIn 0.3s ease forwards' }}
    >
      <div className="flex flex-col items-center gap-6 text-center px-4">
        {/* Countdown ring */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
            {countdown}
          </span>
        </div>

        {/* Next episode info */}
        <div>
          <p className="text-white/60 text-sm mb-1">Next episode</p>
          <p className="text-white font-semibold text-lg">
            S{seasonNumber} E{nextEpisode.episodeNumber} &middot; {nextEpisode.title}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onNavigate}
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
          >
            Play Now
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
