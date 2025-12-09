'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/lib/stores/useThemeStore';

export default function ThemeManager() {
  const { theme } = useThemeStore();
  const pathname = usePathname();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Force light mode on landing page
    if (pathname === '/') {
      root.classList.remove('dark');
      return;
    }

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, pathname]);

  return null;
}
