import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies, generateSlug } from '@/services/tmdb';

const MOOD_PARAMS: Record<string, Record<string, string>> = {
  comedy:    { with_genres: '35', sort_by: 'popularity.desc' },
  horror:    { with_genres: '27', sort_by: 'popularity.desc' },
  action:    { with_genres: '28', sort_by: 'popularity.desc' },
  romance:   { with_genres: '10749', sort_by: 'vote_average.desc', 'vote_count.gte': '500' },
  scifi:     { with_genres: '878', sort_by: 'popularity.desc' },
  mystery:   { with_genres: '9648', sort_by: 'vote_average.desc', 'vote_count.gte': '200' },
  drama:     { with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '1000' },
  adventure: { with_genres: '12', sort_by: 'popularity.desc' },
};

export async function GET(request: NextRequest) {
  const mood = request.nextUrl.searchParams.get('mood') || 'action';
  const params = MOOD_PARAMS[mood] ?? MOOD_PARAMS['action'];

  try {
    // Random page 1-3 for variety
    const page = String(Math.floor(Math.random() * 3) + 1);
    const movies = await discoverMovies({ ...params, page });

    if (!movies.length) {
      return NextResponse.json({ error: 'No movies found' }, { status: 404 });
    }

    const movie = movies[Math.floor(Math.random() * movies.length)];
    const slug = `${generateSlug(movie.title, movie.release_date)}-${movie.id}`;

    return NextResponse.json({ slug, title: movie.title, poster_path: movie.poster_path });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
