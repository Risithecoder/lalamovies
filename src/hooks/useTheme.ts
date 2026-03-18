'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lala_theme');
      const dark = stored !== 'light';
      setIsDark(dark);
      if (!dark) {
        document.documentElement.classList.add('light-mode');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lala_theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.add('light-mode');
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
