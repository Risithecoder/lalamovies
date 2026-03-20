import { Metadata } from 'next';
import { searchMulti } from '@/services/tmdb';
import { generateSlug, getPosterUrl } from '@/services/tmdb';
import Image from 'next/image';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: q
      ? `Search results for "${q}" on LaLaMovies`
      : 'Search for movies and TV shows on LaLaMovies',
  };
}

interface NormalizedResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  let items: NormalizedResult[] = [];
  let totalResults = 0;

  if (query) {
    const data = await searchMulti(query);
    totalResults = data.total_results;
    items = data.results
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((r) => ({
        id: r.id,
        title: r.title || r.name || '',
        poster_path: r.poster_path,
        release_date: r.release_date || r.first_air_date || '',
        vote_average: r.vote_average,
        media_type: r.media_type as 'movie' | 'tv',
      }));
  }

  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="text-muted mb-8">
            {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} found
          </p>
        )}
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted text-lg">
              {query ? 'No results found' : 'Search for movies and TV shows'}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-5 justify-center"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 200px))' }}
          >
            {items.map((item) => (
              <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ item }: { item: NormalizedResult }) {
  const href =
    item.media_type === 'tv'
      ? `/series/${item.id}`
      : `/movie/${generateSlug(item.title, item.release_date)}-${item.id}`;
  const year = item.release_date?.split('-')[0] || '';

  return (
    <Link href={href} className="poster-card group" style={{ width: 200, minWidth: 200 }}>
      <Image
        src={getPosterUrl(item.poster_path)}
        alt={item.title}
        width={200}
        height={300}
        className="object-cover w-full h-full"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+"
      />
      <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-3">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
              item.media_type === 'tv'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {item.media_type === 'tv' ? 'TV' : 'Movie'}
            </span>
            <span className="text-xs text-muted">{year}</span>
            {item.vote_average > 0 && (
              <span className="text-xs text-yellow-400">{item.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
