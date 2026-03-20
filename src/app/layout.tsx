import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import SearchOverlay from '@/components/SearchOverlay';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'LaLaMovies — Stream Movies Online',
    template: '%s | LaLaMovies',
  },
  description: 'Discover and stream thousands of movies. Browse trending, popular, and top rated films with a beautiful, fast interface.',
  keywords: ['movies', 'streaming', 'watch movies online', 'free movies', 'movie streaming'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'LaLaMovies',
    title: 'LaLaMovies — Stream Movies Online',
    description: 'Discover and stream thousands of movies.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaLaMovies — Stream Movies Online',
    description: 'Discover and stream thousands of movies.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Inline script prevents light-mode flash before hydration */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('lala_theme')==='light'){document.documentElement.classList.add('light-mode');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider>
          <NavbarWrapper />
          <SearchOverlay />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

