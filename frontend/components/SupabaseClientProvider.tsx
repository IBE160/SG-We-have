'use client';

import { useEffect } from 'react';
import { verifySupabaseClient } from '@/lib/supabase';

export function SupabaseClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    verifySupabaseClient();
  }, []);

  return <>{children}</>;
}
