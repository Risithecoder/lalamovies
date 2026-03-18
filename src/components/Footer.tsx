import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="text-xl font-bold">
              <span className="text-accent">Lala</span>
              <span className="text-white">Movies</span>
            </Link>
            <p className="text-sm text-muted mt-1">Discover and stream movies</p>
          </div>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
          <p>© {new Date().getFullYear()} LaLaMovies. Movie data from TMDB.</p>
          <p className="mt-1">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
