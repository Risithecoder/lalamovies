/**
 * Series Data Module
 * ------------------
 * Defines the Series/Season/Episode type hierarchy, seeds two demo series,
 * and exports helper functions for data access.
 *
 * Imports from existing project: none (standalone data module).
 * Setup: import helpers from '@/lib/seriesData' wherever series data is needed.
 *
 * The default export functions are synchronous but return the same shape as an
 * async API call — swap `getAllSeries()` for `fetch('/api/series').then(r => r.json())`
 * without changing any component imports.
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number; // seconds
  thumbnail: string;
  videoUrl: string; // .m3u8 or .mp4
  description: string;
  introStart: number; // seconds
  introEnd: number; // seconds
  creditsStart: number; // seconds
}

export interface Season {
  seasonNumber: number;
  title: string;
  poster: string;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  tagline: string;
  description: string;
  poster: string;
  backdrop: string;
  genres: string[];
  rating: number;
  year: number;
  status: 'ongoing' | 'completed';
  seasons: Season[];
}

// ── Seed Data ──────────────────────────────────────────────────────────

const HLS_URL =
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const MP4_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';
const MP4_URL = `${MP4_BASE}/BigBuckBunny.mp4`;
const MP4_URL_2 = `${MP4_BASE}/ElephantsDream.mp4`;
const MP4_URL_3 = `${MP4_BASE}/Sintel.mp4`;
const MP4_URL_4 = `${MP4_BASE}/TearsOfSteel.mp4`;

// Verified TMDB image paths (from "Dark" and "Peaky Blinders")
const IMG_BASE = 'https://image.tmdb.org/t/p';

// Dark Horizon — mapped from TMDB "Dark" (ID: 70523)
const DH_POSTER = `${IMG_BASE}/w500/7CFCzWIZZcnxHke3yAQiGPWXHwF.jpg`;
const DH_BACKDROP = `${IMG_BASE}/w1280/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg`;
const DH_STILLS = [
  `${IMG_BASE}/w780/ljQC5U5Ag86vRylCR5gmf78fVaS.jpg`,
  `${IMG_BASE}/w780/oFTNaNwF1g0GCQPTXgHviixMCDM.jpg`,
  `${IMG_BASE}/w780/63pMJ4CLC7MDzjgWWlGZ2NKOG6o.jpg`,
  `${IMG_BASE}/w780/eH3NmNsMv5uNygAn57uOBS3wHqB.jpg`,
  `${IMG_BASE}/w780/piwRYraJ1jUE8pcuQJfWPgs6hdy.jpg`,
];

// Crimson Ledger — mapped from TMDB "Peaky Blinders" (ID: 60574)
const CL_POSTER = `${IMG_BASE}/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg`;
const CL_BACKDROP = `${IMG_BASE}/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg`;
const CL_STILLS = [
  `${IMG_BASE}/w780/wMK677CxhZbgWHonyDMnT84wTf5.jpg`,
  `${IMG_BASE}/w780/n3vGYt82f6YqD1eAHVuAhkQQBAJ.jpg`,
  `${IMG_BASE}/w780/pQluUwtpgk7KJsTfS2CdoJBKcyb.jpg`,
  `${IMG_BASE}/w780/ktATJ6sEfEqu6HfGpE9FD7WIjvq.jpg`,
  `${IMG_BASE}/w780/11HGUikej3bARNmp44vEnkBel5K.jpg`,
];

const seriesDatabase: Series[] = [
  {
    id: 'dark-horizon',
    title: 'Dark Horizon',
    tagline: 'The truth lies beyond the stars',
    description:
      'When a deep-space signal awakens an ancient threat, a crew of misfits aboard the starship Erebus must cross the galaxy to prevent extinction. But the further they travel, the more they realize the signal is changing them — rewriting memory, bending time, and blurring the line between ally and enemy.',
    poster: DH_POSTER,
    backdrop: DH_BACKDROP,
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    rating: 8.6,
    year: 2024,
    status: 'ongoing',
    seasons: [
      {
        seasonNumber: 1,
        title: 'The Signal',
        poster: DH_POSTER,
        episodes: [
          {
            id: 'dh-s1e1',
            episodeNumber: 1,
            title: 'First Contact',
            duration: 3420,
            thumbnail: DH_STILLS[0],
            videoUrl: MP4_URL,
            description:
              'The crew of the Erebus intercepts an uncharted signal from beyond known space.',
            introStart: 0,
            introEnd: 45,
            creditsStart: 3360,
          },
          {
            id: 'dh-s1e2',
            episodeNumber: 2,
            title: 'Ghost Frequency',
            duration: 3180,
            thumbnail: DH_STILLS[1],
            videoUrl: MP4_URL_2,
            description:
              'Strange hallucinations plague the crew as the signal grows stronger.',
            introStart: 0,
            introEnd: 42,
            creditsStart: 3120,
          },
          {
            id: 'dh-s1e3',
            episodeNumber: 3,
            title: 'Entropy',
            duration: 3540,
            thumbnail: DH_STILLS[2],
            videoUrl: HLS_URL,
            description:
              'Time begins to fracture aboard the ship, forcing impossible choices.',
            introStart: 0,
            introEnd: 40,
            creditsStart: 3480,
          },
          {
            id: 'dh-s1e4',
            episodeNumber: 4,
            title: 'Parallax',
            duration: 3300,
            thumbnail: DH_STILLS[3],
            videoUrl: MP4_URL_3,
            description:
              'Commander Reyes discovers a duplicate of herself — one who remembers a different past.',
            introStart: 0,
            introEnd: 44,
            creditsStart: 3240,
          },
          {
            id: 'dh-s1e5',
            episodeNumber: 5,
            title: 'Event Horizon',
            duration: 3660,
            thumbnail: DH_STILLS[4],
            videoUrl: MP4_URL_4,
            description:
              'The Erebus reaches the source of the signal — and nothing can prepare them for what waits.',
            introStart: 0,
            introEnd: 48,
            creditsStart: 3600,
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'The Collapse',
        poster: DH_POSTER,
        episodes: [
          {
            id: 'dh-s2e1',
            episodeNumber: 1,
            title: 'Remnants',
            duration: 3480,
            thumbnail: DH_STILLS[0],
            videoUrl: MP4_URL_2,
            description:
              'Six months after the signal event, the survivors regroup on a dying colony world.',
            introStart: 0,
            introEnd: 50,
            creditsStart: 3420,
          },
          {
            id: 'dh-s2e2',
            episodeNumber: 2,
            title: 'Rift Walker',
            duration: 3300,
            thumbnail: DH_STILLS[1],
            videoUrl: MP4_URL,
            description:
              'A new crew member claims to have crossed between realities — and brings a warning.',
            introStart: 0,
            introEnd: 46,
            creditsStart: 3240,
          },
          {
            id: 'dh-s2e3',
            episodeNumber: 3,
            title: 'Void Song',
            duration: 3600,
            thumbnail: DH_STILLS[2],
            videoUrl: MP4_URL_3,
            description:
              'The signal returns, this time embedding itself in music only children can hear.',
            introStart: 0,
            introEnd: 43,
            creditsStart: 3540,
          },
          {
            id: 'dh-s2e4',
            episodeNumber: 4,
            title: 'Collapse',
            duration: 3720,
            thumbnail: DH_STILLS[3],
            videoUrl: MP4_URL_4,
            description:
              'Reality itself begins to unravel as the crew makes a final stand at the edge of everything.',
            introStart: 0,
            introEnd: 52,
            creditsStart: 3660,
          },
        ],
      },
    ],
  },
  {
    id: 'crimson-ledger',
    title: 'Crimson Ledger',
    tagline: 'Every debt is paid in blood',
    description:
      'In 1920s Chicago, a young accountant discovers that the numbers she balances for a prestigious law firm hide a sprawling criminal empire. Caught between federal agents and ruthless mobsters, she must use her gift for pattern recognition to stay alive — and bring down the family from within.',
    poster: CL_POSTER,
    backdrop: CL_BACKDROP,
    genres: ['Crime', 'Drama', 'Period'],
    rating: 9.1,
    year: 2023,
    status: 'completed',
    seasons: [
      {
        seasonNumber: 1,
        title: 'The Ledger',
        poster: CL_POSTER,
        episodes: [
          {
            id: 'cl-s1e1',
            episodeNumber: 1,
            title: 'Red Ink',
            duration: 3300,
            thumbnail: CL_STILLS[0],
            videoUrl: MP4_URL_4,
            description:
              'Evelyn Park arrives in Chicago with nothing but a mathematics degree and a letter of recommendation.',
            introStart: 0,
            introEnd: 38,
            creditsStart: 3240,
          },
          {
            id: 'cl-s1e2',
            episodeNumber: 2,
            title: 'Double Entry',
            duration: 3180,
            thumbnail: CL_STILLS[1],
            videoUrl: MP4_URL,
            description:
              'Evelyn notices discrepancies in the firm\'s books that don\'t add up — literally.',
            introStart: 0,
            introEnd: 40,
            creditsStart: 3120,
          },
          {
            id: 'cl-s1e3',
            episodeNumber: 3,
            title: 'The Speakeasy',
            duration: 3420,
            thumbnail: CL_STILLS[2],
            videoUrl: MP4_URL_3,
            description:
              'Following a paper trail leads Evelyn to the family\'s underground empire.',
            introStart: 0,
            introEnd: 36,
            creditsStart: 3360,
          },
          {
            id: 'cl-s1e4',
            episodeNumber: 4,
            title: 'Blood Money',
            duration: 3540,
            thumbnail: CL_STILLS[3],
            videoUrl: HLS_URL,
            description:
              'When a witness disappears, Evelyn realizes the stakes are life and death.',
            introStart: 0,
            introEnd: 42,
            creditsStart: 3480,
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'The Reckoning',
        poster: CL_POSTER,
        episodes: [
          {
            id: 'cl-s2e1',
            episodeNumber: 1,
            title: 'New Management',
            duration: 3360,
            thumbnail: CL_STILLS[0],
            videoUrl: MP4_URL_2,
            description:
              'A year later, Evelyn has risen within the firm — but her double life is fraying.',
            introStart: 0,
            introEnd: 44,
            creditsStart: 3300,
          },
          {
            id: 'cl-s2e2',
            episodeNumber: 2,
            title: 'The Wire',
            duration: 3240,
            thumbnail: CL_STILLS[1],
            videoUrl: MP4_URL,
            description:
              'Federal Agent Torres approaches Evelyn with an offer she can\'t refuse.',
            introStart: 0,
            introEnd: 40,
            creditsStart: 3180,
          },
          {
            id: 'cl-s2e3',
            episodeNumber: 3,
            title: 'House of Cards',
            duration: 3480,
            thumbnail: CL_STILLS[2],
            videoUrl: MP4_URL_3,
            description:
              'The family patriarch suspects a mole — and the walls begin to close in.',
            introStart: 0,
            introEnd: 46,
            creditsStart: 3420,
          },
          {
            id: 'cl-s2e4',
            episodeNumber: 4,
            title: 'Balancing the Books',
            duration: 3900,
            thumbnail: CL_STILLS[3],
            videoUrl: MP4_URL_4,
            description:
              'In the explosive finale, every debt comes due and every ledger must balance.',
            introStart: 0,
            introEnd: 50,
            creditsStart: 3840,
          },
          {
            id: 'cl-s2e5',
            episodeNumber: 5,
            title: 'Epilogue: Red Ink Returns',
            duration: 2400,
            thumbnail: CL_STILLS[4],
            videoUrl: MP4_URL,
            description:
              'A coda set years later reveals the true cost of Evelyn\'s choices.',
            introStart: 0,
            introEnd: 30,
            creditsStart: 2340,
          },
        ],
      },
    ],
  },
];

// ── Helper Functions ───────────────────────────────────────────────────

/** Returns all series. Drop-in replaceable with an async API call. */
export function getAllSeries(): Series[] {
  return seriesDatabase;
}

/** Find a series by its ID. */
export function getSeriesById(id: string): Series | undefined {
  return seriesDatabase.find((s) => s.id === id);
}

/** Find a specific episode across all series. */
export function getEpisodeById(
  episodeId: string
): { series: Series; season: Season; episode: Episode } | undefined {
  for (const series of seriesDatabase) {
    for (const season of series.seasons) {
      const episode = season.episodes.find((e) => e.id === episodeId);
      if (episode) return { series, season, episode };
    }
  }
  return undefined;
}

/** Get the next episode in the series (cross-season aware). */
export function getNextEpisode(
  seriesId: string,
  currentEpisodeId: string
): { season: Season; episode: Episode } | undefined {
  const series = getSeriesById(seriesId);
  if (!series) return undefined;

  for (let si = 0; si < series.seasons.length; si++) {
    const season = series.seasons[si];
    const ei = season.episodes.findIndex((e) => e.id === currentEpisodeId);
    if (ei === -1) continue;

    // Next episode in same season
    if (ei < season.episodes.length - 1) {
      return { season, episode: season.episodes[ei + 1] };
    }
    // First episode of next season
    if (si < series.seasons.length - 1) {
      const nextSeason = series.seasons[si + 1];
      return { season: nextSeason, episode: nextSeason.episodes[0] };
    }
  }
  return undefined;
}

/** Get the previous episode in the series (cross-season aware). */
export function getPreviousEpisode(
  seriesId: string,
  currentEpisodeId: string
): { season: Season; episode: Episode } | undefined {
  const series = getSeriesById(seriesId);
  if (!series) return undefined;

  for (let si = 0; si < series.seasons.length; si++) {
    const season = series.seasons[si];
    const ei = season.episodes.findIndex((e) => e.id === currentEpisodeId);
    if (ei === -1) continue;

    // Previous episode in same season
    if (ei > 0) {
      return { season, episode: season.episodes[ei - 1] };
    }
    // Last episode of previous season
    if (si > 0) {
      const prevSeason = series.seasons[si - 1];
      return {
        season: prevSeason,
        episode: prevSeason.episodes[prevSeason.episodes.length - 1],
      };
    }
  }
  return undefined;
}

/** Format seconds to mm:ss or h:mm:ss. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format duration to human-readable (e.g. "57 min"). */
export function formatDurationHuman(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

/** Get total episode count for a series. */
export function getTotalEpisodes(series: Series): number {
  return series.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
}
