'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import { SearchResult } from '@/types/types';
import { getPosterUrl, generateSlug } from '@/services/tmdb';

interface SearchBarProps {
  onClose: () => void;
}

interface ExtendedResult extends SearchResult {
  overview?: string;
  genre_ids?: number[];
}

function getResultHref(item: ExtendedResult): string {
  if (item.media_type === 'tv') {
    return `/series/${item.id}`;
  }
  return `/movie/${generateSlug(item.title, item.release_date)}-${item.id}`;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExtendedResult[]>([]);
  const [related, setRelated] = useState<ExtendedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const abortRef = useRef<AbortController>(null);

  useEffect(() => {
    // Small delay to let animation start, then focus
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
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
      setRelated([]);
      return;
    }
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
      setRelated(data.related || []);
      setSelectedIndex(-1);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setResults([]);
      setRelated([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 250);
  };

  const allItems = [...results, ...related];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && allItems[selectedIndex]) {
      const item = allItems[selectedIndex];
      window.location.href = getResultHref(item);
      onClose();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('[data-search-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const hasResults = results.length > 0;
  const hasRelated = related.length > 0;
  const showEmpty = !loading && !hasResults && query.length >= 2;

  return (
    <motion.div
      className="fixed inset-0 z-[10001]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />

      {/* Search container — centered like Spotlight */}
      <motion.div
        className="relative z-10 w-full max-w-[600px] mx-auto mt-[12vh] px-4"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            strokeWidth={1.5}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search movies & TV shows..."
            className="w-full bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-10 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors shadow-2xl shadow-black/50"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setRelated([]);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={12} className="text-white/60" />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {(hasResults || hasRelated || loading || showEmpty) && (
          <motion.div
            ref={resultsRef}
            className="mt-2 bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 max-h-[60vh] overflow-y-auto"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {showEmpty && (
              <div className="py-10 text-center">
                <p className="text-white/30 text-sm">No results found</p>
                <p className="text-white/20 text-xs mt-1">Try a different spelling</p>
              </div>
            )}

            {/* Search results */}
            {!loading && hasResults && (
              <div className="p-2">
                <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-3 pt-1 pb-2">
                  Results
                </p>
                {results.map((item, i) => (
                  <ResultItem
                    key={`${item.media_type}-${item.id}`}
                    item={item}
                    index={i}
                    selected={selectedIndex === i}
                    onClose={onClose}
                    onHover={() => setSelectedIndex(i)}
                  />
                ))}
              </div>
            )}

            {/* Related / recommended */}
            {!loading && hasRelated && (
              <div className="p-2 border-t border-white/[0.06]">
                <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-3 pt-1 pb-2 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-accent/60" />
                  You might also like
                </p>
                <div className="grid grid-cols-3 gap-1.5 px-1 pb-1">
                  {related.map((item, i) => (
                    <RelatedCard
                      key={`${item.media_type}-${item.id}`}
                      item={item}
                      index={results.length + i}
                      selected={selectedIndex === results.length + i}
                      onClose={onClose}
                      onHover={() => setSelectedIndex(results.length + i)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* View all link */}
            {!loading && hasResults && (
              <div className="border-t border-white/[0.06]">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="block text-center text-[13px] text-white/40 hover:text-white/70 py-3 transition-colors"
                >
                  View all results
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Keyboard hint */}
        {!hasResults && !loading && query.length < 2 && (
          <div className="mt-3 flex justify-center gap-4">
            <span className="text-[11px] text-white/20 flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">esc</kbd>
              to close
            </span>
            <span className="text-[11px] text-white/20 flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">&uarr;&darr;</kbd>
              to navigate
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Media type badge ── */
function MediaBadge({ type }: { type: 'movie' | 'tv' }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
      type === 'tv'
        ? 'bg-blue-500/20 text-blue-400'
        : 'bg-purple-500/20 text-purple-400'
    }`}>
      {type === 'tv' ? 'TV' : 'Movie'}
    </span>
  );
}

/* ── Result list item ── */
function ResultItem({
  item,
  index,
  selected,
  onClose,
  onHover,
}: {
  item: ExtendedResult;
  index: number;
  selected: boolean;
  onClose: () => void;
  onHover: () => void;
}) {
  return (
    <Link
      href={getResultHref(item)}
      onClick={onClose}
      onMouseEnter={onHover}
      data-search-item={index}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
        selected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'
      }`}
    >
      <div className="w-9 h-[54px] relative rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
        {item.poster_path ? (
          <Image
            src={getPosterUrl(item.poster_path, 'w185')}
            alt={item.title}
            width={36}
            height={54}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">
            N/A
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] text-white/90 font-medium truncate">
            {item.title}
          </h3>
          <MediaBadge type={item.media_type} />
        </div>
        <p className="text-[12px] text-white/30">
          {item.release_date?.split('-')[0] || 'TBA'}
          {item.vote_average ? ` · ${item.vote_average.toFixed(1)}` : ''}
        </p>
      </div>
    </Link>
  );
}

/* ── Related card (poster grid) ── */
function RelatedCard({
  item,
  index,
  selected,
  onClose,
  onHover,
}: {
  item: ExtendedResult;
  index: number;
  selected: boolean;
  onClose: () => void;
  onHover: () => void;
}) {
  return (
    <Link
      href={getResultHref(item)}
      onClick={onClose}
      onMouseEnter={onHover}
      data-search-item={index}
      className={`group relative rounded-xl overflow-hidden aspect-[2/3] transition-all ${
        selected ? 'ring-2 ring-accent/50 scale-[1.02]' : 'hover:scale-[1.02]'
      }`}
    >
      {item.poster_path ? (
        <Image
          src={getPosterUrl(item.poster_path, 'w342')}
          alt={item.title}
          fill
          sizes="180px"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-white/[0.04] flex items-center justify-center text-white/20 text-xs">
          {item.title}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-[11px] text-white font-medium truncate">{item.title}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <MediaBadge type={item.media_type} />
            <p className="text-[10px] text-white/50">
              {item.release_date?.split('-')[0] || 'TBA'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
