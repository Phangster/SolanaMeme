'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/components/LoadingPage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home route
    router.push('/home');
  }, [router]);

  // Show loading while redirecting
  return (
    <main>
      <LoadingPage message="Be Patient $YAO..." />
    </main>
  );
}
