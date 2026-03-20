import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies, discoverTV } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mediaType = searchParams.get('mediaType') || 'movie';
  const genre     = searchParams.get('genre');
  const year      = searchParams.get('year');
  const minRating = searchParams.get('minRating');
  const sortBy    = searchParams.get('sortBy') || 'popularity.desc';
  const page      = searchParams.get('page') || '1';

  const params: Record<string, string> = {
    sort_by: sortBy,
    include_adult: 'false',
    page,
  };

  if (genre)     params['with_genres']       = genre;
  if (minRating) params['vote_average.gte']  = minRating;
  if (minRating && Number(minRating) >= 7) params['vote_count.gte'] = '200';

  if (mediaType === 'tv') {
    if (year) params['first_air_date_year'] = year;
  } else {
    if (year) params['primary_release_year'] = year;
  }

  try {
    const results = mediaType === 'tv'
      ? await discoverTV(params)
      : await discoverMovies(params);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
