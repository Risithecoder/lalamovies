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

export interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
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
