'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Hook that safely returns search params after client-side hydration.
 * This prevents "useSearchParams should be wrapped in a suspense boundary" errors during prerendering.
 */
export function useSearchParamsSafe() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? searchParams : null;
}
