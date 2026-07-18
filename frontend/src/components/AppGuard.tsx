'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useRouter, usePathname } from 'next/navigation';
import AuthPage from './AuthPage';

export default function AppGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading, user is logged out, and we are on a subpage, redirect to root
    if (!loading && !user && pathname !== '/') {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="text-6xl animate-bounce">🦉</div>
          <div className="mt-4 h-2.5 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Loading Duolingo...</span>
        </div>
      </div>
    );
  }

  // If user is null and not on root path, display Auth page
  if (!user && pathname !== '/') {
    return <AuthPage />;
  }

  return <>{children}</>;
}
