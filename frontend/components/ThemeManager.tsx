'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/useThemeStore';

export default function ThemeManager() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
