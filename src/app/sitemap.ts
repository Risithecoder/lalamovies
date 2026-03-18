import { MetadataRoute } from 'next';
import { getTrending, getGenres, generateSlug, getGenreSlug } from '@/services/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lalamovies.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Genre pages
  try {
    const genres = await getGenres();
    const genrePages: MetadataRoute.Sitemap = genres.map((genre) => ({
      url: `${baseUrl}/genre/${getGenreSlug(genre.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Trending movie pages
    const trending = await getTrending('week');
    const moviePages: MetadataRoute.Sitemap = trending.map((movie) => ({
      url: `${baseUrl}/movie/${generateSlug(movie.title, movie.release_date)}-${movie.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...genrePages, ...moviePages];
  } catch {
    return staticPages;
  }
}
