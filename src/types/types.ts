export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  popularity: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  imdb_id: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface StreamingServer {
  id: string;
  name: string;
  label: string;
  getUrl: (tmdbId: number) => string;
}

export interface TVStreamingServer {
  id: string;
  name: string;
  label: string;
  getUrl: (tmdbId: number, season: number, episode: number) => string;
}

export interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

// Raw result from TMDB /search/multi endpoint
export interface MultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;          // movies
  name?: string;           // tv shows
  poster_path: string | null;
  release_date?: string;   // movies
  first_air_date?: string; // tv shows
  vote_average: number;
  overview?: string;
  genre_ids?: number[];
  backdrop_path?: string | null;
  popularity: number;
}

export interface ContinueWatchingItem {
  movieId: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  slug: string;
  timestamp: number;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

// ─── TV Series (TMDB) ───────────────────────────────────────

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  origin_country?: string[];
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  tagline: string;
  status: string;
  seasons: TVSeasonSummary[];
}

export interface TVSeasonSummary {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  overview: string;
  air_date: string;
}

export interface TVSeasonDetails {
  id: number;
  season_number: number;
  name: string;
  episodes: TVEpisodeInfo[];
}

export interface TVEpisodeInfo {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
  vote_average: number;
}
