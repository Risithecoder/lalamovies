import SkeletonCard from './SkeletonCard';

interface MovieRowSkeletonProps {
  count?: number;
}

export default function MovieRowSkeleton({ count = 8 }: MovieRowSkeletonProps) {
  return (
    <section className="mb-10" aria-hidden="true">
      <div className="shimmer h-6 w-48 rounded mb-4" />
      <div className="scroll-row px-4 sm:px-0">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} width={200} />
        ))}
      </div>
    </section>
  );
}
