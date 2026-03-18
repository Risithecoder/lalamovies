'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchResult } from '@/types/types';
import { getPosterUrl, generateSlug } from '@/services/tmdb';

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const abortRef = useRef<AbortController>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setResults(data.results?.slice(0, 8) || []);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f0f]/95 backdrop-blur-lg">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2"
          aria-label="Close search"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search movies..."
            className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Results */}
        <div className="mt-6 space-y-2 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <p className="text-center text-muted py-8">No results found</p>
          )}
          {results.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${generateSlug(movie.title, movie.release_date)}-${movie.id}`}
              onClick={onClose}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors group"
            >
              <div className="w-12 h-18 relative rounded overflow-hidden flex-shrink-0 bg-surface">
                {movie.poster_path ? (
                  <Image
                    src={getPosterUrl(movie.poster_path, 'w185')}
                    alt={movie.title}
                    width={48}
                    height={72}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-xs">N/A</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate group-hover:text-accent transition-colors">
                  {movie.title}
                </h3>
                <p className="text-sm text-muted">
                  {movie.release_date?.split('-')[0] || 'Unknown'} · ⭐ {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
          {query.length >= 2 && results.length > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block text-center text-accent hover:text-accent-hover py-4 font-medium transition-colors"
            >
              View all results →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
