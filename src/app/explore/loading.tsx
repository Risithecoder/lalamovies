import MovieRowSkeleton from '@/components/MovieRowSkeleton';

export default function ExploreLoading() {
  return (
    <div className="page-enter pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="shimmer h-9 w-32 rounded mb-2" />
        <div className="shimmer h-5 w-56 rounded mb-10" />
        <MovieRowSkeleton />
        {/* Genre pills skeleton */}
        <div className="mb-10">
          <div className="shimmer h-6 w-40 rounded mb-4" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="shimmer h-9 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    </div>
  );
}
