'use client';

import { Genre } from '@/types/types';

export interface FilterState {
  genreId: string;
  year: string;
  minRating: string;
  sortBy: string;
}

interface FilterBarProps {
  genres: Genre[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) => CURRENT_YEAR - i);
const RATINGS = ['0', '5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];
const SORT_OPTIONS = [
  { value: 'popularity.desc',    label: 'Most Popular' },
  { value: 'vote_average.desc',  label: 'Top Rated' },
  { value: 'release_date.desc',  label: 'Newest First' },
  { value: 'release_date.asc',   label: 'Oldest First' },
];

const selectClass =
  'bg-[var(--surface)] border border-[var(--border)] text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-accent transition-colors cursor-pointer';

export default function FilterBar({ genres, filters, onChange }: FilterBarProps) {
  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActive =
    filters.genreId || filters.year || filters.minRating !== '0' || filters.sortBy !== 'popularity.desc';

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Genre */}
      <select
        value={filters.genreId}
        onChange={(e) => update('genreId', e.target.value)}
        className={selectClass}
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={String(g.id)}>{g.name}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={filters.year}
        onChange={(e) => update('year', e.target.value)}
        className={selectClass}
      >
        <option value="">Any Year</option>
        {YEARS.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>

      {/* Rating */}
      <select
        value={filters.minRating}
        onChange={(e) => update('minRating', e.target.value)}
        className={selectClass}
      >
        <option value="0">Any Rating</option>
        {RATINGS.filter((r) => r !== '0').map((r) => (
          <option key={r} value={r}>⭐ {r}+</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => update('sortBy', e.target.value)}
        className={selectClass}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Reset */}
      {hasActive && (
        <button
          onClick={() => onChange({ genreId: '', year: '', minRating: '0', sortBy: 'popularity.desc' })}
          className="text-xs text-muted hover:text-white transition-colors px-2 py-1"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
