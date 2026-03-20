import { StreamingServer, TVStreamingServer } from '@/types/types';

export const STREAMING_SERVERS: StreamingServer[] = [
  // Primary — these tend to be the most reliable
  { id: 'videasy-base', name: 'VidEasy', label: 'VidEasy', getUrl: (id: number) => `https://player.videasy.net/movie/${id}` },
  { id: 'vidsrc-cc-v2', name: 'VidSrc CC v2', label: 'VidSrc.cc (v2)', getUrl: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}` },
  { id: 'superembed', name: 'SuperEmbed', label: 'SuperEmbed', getUrl: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { id: 'autoembed', name: 'AutoEmbed', label: 'AutoEmbed', getUrl: (id: number) => `https://player.autoembed.cc/embed/movie/${id}` },
  { id: 'vidlink-base', name: 'VidLink', label: 'VidLink', getUrl: (id: number) => `https://vidlink.pro/movie/${id}` },

  // Secondary
  { id: 'vidsrc-cc-v3', name: 'VidSrc CC v3', label: 'VidSrc.cc (v3)', getUrl: (id: number) => `https://vidsrc.cc/v3/embed/movie/${id}` },
  { id: 'embed-su', name: 'Embed SU', label: 'Embed.su', getUrl: (id: number) => `https://embed.su/embed/movie/${id}` },
  { id: 'vidsrc-to', name: 'VidSrc.to', label: 'VidSrc.to', getUrl: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
  { id: 'moviesapi-club', name: 'MoviesAPI', label: 'MoviesAPI', getUrl: (id: number) => `https://moviesapi.club/movie/${id}` },
  { id: 'vidsrc-me', name: 'VidSrc.me', label: 'VidSrc.me', getUrl: (id: number) => `https://vidsrc.me/embed/movie/${id}` },
];

export function getStreamUrl(serverId: string, tmdbId: number): string {
  const server = STREAMING_SERVERS.find((s) => s.id === serverId);
  if (!server) return STREAMING_SERVERS[0].getUrl(tmdbId);
  return server.getUrl(tmdbId);
}

export function getDefaultServer(): StreamingServer {
  return STREAMING_SERVERS[0];
}

// ─── TV Series Streaming Servers ─────────────────────────────

export const TV_STREAMING_SERVERS: TVStreamingServer[] = [
  { id: 'videasy-tv', name: 'VidEasy', label: 'VidEasy', getUrl: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}` },
  { id: 'vidsrc-cc-tv-v2', name: 'VidSrc CC v2', label: 'VidSrc.cc (v2)', getUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
  { id: 'superembed-tv', name: 'SuperEmbed', label: 'SuperEmbed', getUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  { id: 'autoembed-tv', name: 'AutoEmbed', label: 'AutoEmbed', getUrl: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}` },
  { id: 'vidlink-tv', name: 'VidLink', label: 'VidLink', getUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
  { id: 'vidsrc-cc-tv-v3', name: 'VidSrc CC v3', label: 'VidSrc.cc (v3)', getUrl: (id, s, e) => `https://vidsrc.cc/v3/embed/tv/${id}/${s}/${e}` },
  { id: 'embed-su-tv', name: 'Embed SU', label: 'Embed.su', getUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
  { id: 'vidsrc-to-tv', name: 'VidSrc.to', label: 'VidSrc.to', getUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { id: 'moviesapi-tv', name: 'MoviesAPI', label: 'MoviesAPI', getUrl: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}` },
  { id: 'vidsrc-me-tv', name: 'VidSrc.me', label: 'VidSrc.me', getUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}` },
];

export function getTVStreamUrl(serverId: string, tmdbId: number, season: number, episode: number): string {
  const server = TV_STREAMING_SERVERS.find((s) => s.id === serverId);
  if (!server) return TV_STREAMING_SERVERS[0].getUrl(tmdbId, season, episode);
  return server.getUrl(tmdbId, season, episode);
}
