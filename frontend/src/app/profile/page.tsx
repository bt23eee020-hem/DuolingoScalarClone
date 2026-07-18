'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/?tab=profile');
  }, [router]);
  return null;
}
