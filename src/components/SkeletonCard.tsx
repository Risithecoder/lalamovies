interface SkeletonCardProps {
  width?: number;
}

export default function SkeletonCard({ width = 200 }: SkeletonCardProps) {
  return (
    <div
      className="poster-card shimmer flex-shrink-0 rounded-lg"
      style={{ width, minWidth: width }}
      aria-hidden="true"
    />
  );
}
