import MovieRowSkeleton from '@/components/MovieRowSkeleton';

export default function HomeLoading() {
  return (
    <div className="pt-6">
      {/* Hero skeleton */}
      <div className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full shimmer" />

      {/* Row skeletons */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-2">
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    </div>
  );
}
