import { NextRequest, NextResponse } from 'next/server';
import { getMovieVideos } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ key: null }, { status: 400 });
  }

  try {
    const data = await getMovieVideos(Number(id));
    // Prefer official YouTube trailers, then teasers
    const trailer =
      data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
      data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      data.results.find((v) => v.site === 'YouTube' && v.type === 'Teaser');

    return NextResponse.json({ key: trailer?.key ?? null });
  } catch {
    return NextResponse.json({ key: null }, { status: 500 });
  }
}
