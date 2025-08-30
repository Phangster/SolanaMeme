'use client';
import ClickGame from '@/components/ClickGame';
import Layout from '@/components/Layout';
import Leaderboard from '@/components/Leaderboard';
import { useClickCounter } from '@/hooks/useClickCounter';
import { useCountryDetection } from '@/hooks/useCountryDetection';

export default function HomePage() {
    const { country } = useCountryDetection();
    const { 
        leaderboard, 
        error: leaderboardError, 
    } = useClickCounter({ country });

  return (
    <Layout currentRoute="/">
      <div className="max-w-4xl mx-auto text-center">
        <ClickGame />

        {/* Contract Address */}
        <div className="mb-12 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2 font-pixel">Contract Address:</p>
          <p className="font-mono text-lg text-yellow-400 break-all font-pixel">
            5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
          </p>
        </div>

        {/* Leaderboard Accordion - Sticky to bottom */}
        <div className="mt-12 sticky bottom-0">
          <Leaderboard 
            leaderboard={leaderboard}
            isLoading={false}
            error={leaderboardError}
            currentCountry={country}
          />
        </div>
      </div>
    </Layout>
  );
}
