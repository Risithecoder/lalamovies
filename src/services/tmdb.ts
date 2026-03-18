import { Movie, MovieDetails, MovieCredits, Genre, TMDBResponse } from '@/types/types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// In-memory cache with TTL
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });
  const url = `${TMDB_BASE}${endpoint}?${searchParams}`;
  
  const cached = getCached<T>(url);
  if (cached) return cached;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  
  const data: T = await res.json();
  setCache(url, data);
  return data;
}

// ─── Movie Lists ──────────────────────────────────────────────

export async function getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
  return data.results;
}

export async function getPopular(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>('/movie/popular', { page: String(page) });
  return data.results;
}

export async function getTopRated(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>('/movie/top_rated', { page: String(page) });
  return data.results;
}

export async function getNowPlaying(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>('/movie/now_playing', { page: String(page) });
  return data.results;
}

export async function getUpcoming(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', { page: String(page) });
  return data.results;
}

// ─── Movie Details ────────────────────────────────────────────

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch<MovieDetails>(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  return tmdbFetch<MovieCredits>(`/movie/${id}/credits`);
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/similar`);
  return data.results;
}

export async function getRecommendations(id: number): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);
  return data.results;
}

// ─── Search ───────────────────────────────────────────────────

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>('/search/movie', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

// ─── Genres ───────────────────────────────────────────────────

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
    include_adult: 'false',
  });
}

// ─── Discover (Curated Sections) ─────────────────────────────

export async function discoverMovies(params: Record<string, string>): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBResponse<Movie>>('/discover/movie', {
    sort_by: 'popularity.desc',
    include_adult: 'false',
    ...params,
  });
  return data.results;
}

// ─── Helpers ──────────────────────────────────────────────────

export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/no-poster.svg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function generateSlug(title: string, releaseDate: string): string {
  const year = releaseDate ? releaseDate.split('-')[0] : 'unknown';
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${year}`;
}

export function parseSlug(slug: string): { name: string; year: string } {
  const parts = slug.split('-');
  const year = parts.pop() || '';
  const name = parts.join(' ');
  return { name, year };
}

// Genre slug mapping
export const GENRE_SLUG_MAP: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'science-fiction': 878,
  'thriller': 53,
  'tv-movie': 10770,
  'war': 10752,
  'western': 37,
};

export function getGenreSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
