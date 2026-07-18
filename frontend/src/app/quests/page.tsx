'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function QuestsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/?tab=quests');
  }, [router]);
  return null;
}
