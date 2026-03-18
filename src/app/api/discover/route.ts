import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const genre    = searchParams.get('genre');
  const year     = searchParams.get('year');
  const minRating = searchParams.get('minRating');
  const sortBy   = searchParams.get('sortBy') || 'popularity.desc';
  const page     = searchParams.get('page') || '1';

  const params: Record<string, string> = {
    sort_by: sortBy,
    include_adult: 'false',
    page,
  };

  if (genre)     params['with_genres']           = genre;
  if (year)      params['primary_release_year']   = year;
  if (minRating) params['vote_average.gte']        = minRating;
  // Require enough votes so low-vote high-rating movies don't dominate
  if (minRating && Number(minRating) >= 7) params['vote_count.gte'] = '200';

  try {
    const movies = await discoverMovies(params);
    return NextResponse.json({ results: movies });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
