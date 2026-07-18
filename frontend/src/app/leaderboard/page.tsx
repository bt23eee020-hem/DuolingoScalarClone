'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LeaderboardRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/?tab=leaderboard');
  }, [router]);
  return null;
}
