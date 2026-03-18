'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('lala_theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    } catch {
      // ignore
    }
  }, []);

  return <>{children}</>;
}
