'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/?tab=settings');
  }, [router]);
  return null;
}
