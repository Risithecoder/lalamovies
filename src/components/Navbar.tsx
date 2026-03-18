'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cmd/Ctrl+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-[#0f0f0f]/80 to-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-accent">Lala</span>
                <span className="text-white">Movies</span>
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden sm:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/explore"
                className="text-sm font-medium text-muted hover:text-white transition-colors"
              >
                Explore
              </Link>
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-hover transition-colors text-muted hover:text-white"
              aria-label="Search movies"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline text-sm">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-border/50 rounded text-muted">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && <SearchBar onClose={closeSearch} />}
    </>
  );
}
