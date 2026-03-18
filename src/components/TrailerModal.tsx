'use client';

import { useState, useEffect, useCallback } from 'react';

interface TrailerModalProps {
  movieId: number;
  movieTitle: string;
}

export default function TrailerModal({ movieId, movieTitle }: TrailerModalProps) {
  const [open, setOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, close]);

  const handleOpen = async () => {
    setOpen(true);
    if (trailerKey !== undefined) return; // already fetched
    setLoading(true);
    try {
      const res = await fetch(`/api/trailer?id=${movieId}`);
      const data = await res.json();
      setTrailerKey(data.key ?? null);
    } catch {
      setTrailerKey(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border text-white font-medium rounded-lg transition-colors text-sm"
      >
        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
        Watch Trailer
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold truncate pr-4">{movieTitle} — Trailer</h3>
              <button
                onClick={close}
                className="text-muted hover:text-white transition-colors flex-shrink-0"
                aria-label="Close trailer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={`${movieTitle} trailer`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-3">
                  <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.893L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>No trailer available for this movie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
