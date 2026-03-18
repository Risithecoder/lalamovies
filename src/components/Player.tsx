'use client';

import { useState, useEffect, useRef } from 'react';

interface PlayerProps {
  url: string;
  title: string;
  onError?: () => void;
}

export default function Player({ url, title, onError }: PlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state and start timeout when url changes
  useEffect(() => {
    setIsLoading(true);
    setHasTimedOut(false);

    // If the iframe hasn't meaningfully loaded in 15s, show warning
    timeoutRef.current = setTimeout(() => {
      setHasTimedOut(true);
    }, 15000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black group" style={{ aspectRatio: '16/9' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-hover z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted font-medium animate-pulse">Loading player...</p>
          </div>
        </div>
      )}
      {hasTimedOut && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-semibold text-lg">This server isn&apos;t responding</p>
            <p className="text-muted text-sm">Try switching to a different server below.</p>
            {onError && (
              <button
                onClick={onError}
                className="mt-2 px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
              >
                Try Next Server
              </button>
            )}
          </div>
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
      />
    </div>
  );
}
