'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ShopRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/?tab=shop');
  }, [router]);
  return null;
}
