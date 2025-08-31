'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home route
    router.push('/home');
  }, [router]);

  // Show loading while redirecting
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-4">
          <Image 
            src="/ym-left.png"
            alt="Loading Yao Ming Face" 
            width={400}
            height={400}
            className="animate-spin rounded-lg"
            priority
            draggable={false}
          />
        </div>
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </main>
  );
}
