import { NextRequest, NextResponse } from 'next/server';
import { searchMulti, getRecommendations, getSimilarTV } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], related: [], total_results: 0 });
  }

  try {
    const data = await searchMulti(query);

    // Filter out "person" results — keep only movies and tv shows
    const results = data.results
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => ({
        id: item.id,
        title: item.title || item.name || '',
        poster_path: item.poster_path,
        release_date: item.release_date || item.first_air_date || '',
        vote_average: item.vote_average,
        genre_ids: item.genre_ids,
        overview: item.overview,
        media_type: item.media_type as 'movie' | 'tv',
      }));

    // Get recommendations based on the top result
    let related: typeof results = [];
    if (results.length > 0) {
      try {
        const top = results[0];
        const resultIds = new Set(results.map((r) => r.id));

        if (top.media_type === 'movie') {
          const recs = await getRecommendations(top.id);
          related = recs
            .filter((m) => !resultIds.has(m.id) && m.poster_path)
            .slice(0, 6)
            .map((movie) => ({
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              genre_ids: movie.genre_ids,
              overview: movie.overview,
              media_type: 'movie' as const,
            }));
        } else {
          const recs = await getSimilarTV(top.id);
          related = recs
            .filter((s) => !resultIds.has(s.id) && s.poster_path)
            .slice(0, 6)
            .map((show) => ({
              id: show.id,
              title: show.name,
              poster_path: show.poster_path,
              release_date: show.first_air_date,
              vote_average: show.vote_average,
              genre_ids: show.genre_ids,
              overview: show.overview,
              media_type: 'tv' as const,
            }));
        }
      } catch {
        // Silently fail — related is a nice-to-have
      }
    }

    return NextResponse.json({
      results,
      related,
      total_results: data.total_results,
    });
  } catch {
    return NextResponse.json({ results: [], related: [], total_results: 0 }, { status: 500 });
  }
}
