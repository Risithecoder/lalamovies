/**
 * SkipIntroButton
 * ---------------
 * Timed button visible only between introStart and introEnd.
 * Entrance/exit via CSS transitions (slide in from right, fade out).
 *
 * Imports from existing project: none.
 */

'use client';

import React from 'react';

interface SkipIntroButtonProps {
  visible: boolean;
  onSkip: () => void;
  className?: string;
}

export default function SkipIntroButton({
  visible,
  onSkip,
  className = '',
}: SkipIntroButtonProps) {
  return (
    <button
      onClick={onSkip}
      className={`px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-4 pointer-events-none'
      } ${className}`}
      style={{ transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      Skip Intro
    </button>
  );
}
