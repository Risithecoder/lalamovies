import { NextRequest, NextResponse } from 'next/server';
import { getTVSeasonDetails } from '@/services/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  const season = searchParams.get('season');

  if (!id || !season) {
    return NextResponse.json({ error: 'Missing id or season' }, { status: 400 });
  }

  try {
    const data = await getTVSeasonDetails(Number(id), Number(season));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch season' }, { status: 500 });
  }
}
