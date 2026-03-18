import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMovies(query);
    return NextResponse.json({
      results: data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      })),
      total_results: data.total_results,
    });
  } catch {
    return NextResponse.json({ results: [], total_results: 0 }, { status: 500 });
  }
}
