import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.TMDB_API_KEY;
  const hasKey = !!key && key.length > 0;
  
  // Test direct TMDB fetch
  let tmdbStatus = 'not tested';
  if (hasKey) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`);
      tmdbStatus = `${res.status} ${res.statusText}`;
    } catch (e) {
      tmdbStatus = `fetch error: ${e}`;
    }
  }

  return NextResponse.json({
    hasKey,
    keyLength: key?.length ?? 0,
    tmdbStatus,
    nodeEnv: process.env.NODE_ENV,
  });
}
