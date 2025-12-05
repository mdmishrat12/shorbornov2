'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth(redirectTo: string = '/') {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [session, status, router, redirectTo]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
}