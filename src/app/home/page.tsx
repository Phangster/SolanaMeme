'use client';
import ClickGame from '@/components/ClickGame';
import Layout from '@/components/Layout';
import Leaderboard from '@/components/Leaderboard';
import { useClickCounter } from '@/hooks/useClickCounter';
import { useCountryDetection } from '@/hooks/useCountryDetection';

export default function HomePage() {
    const { country, countryName, isLoading: countryLoading, error: countryError } = useCountryDetection();
    const { 
        leaderboard, 
        error: leaderboardError, 
    } = useClickCounter({ country });

  return (
    <Layout currentRoute="/">
      <div className="flex flex-col min-h-screen">
        {/* Main Content Area - Takes up available space */}
        <div className="flex-1 max-w-4xl mx-auto text-center">
          {/* Country Display */}
            <div className="bg-white shadow-lg w-fit rounded-full px-3 py-2 border border-gray-200 text-xs absolute top-4 left-4 z-20">
                {countryLoading ? (
                <span className="text-gray-500 animate-pulse">Detecting country...</span>
                ) : countryError ? (
                <span className="text-red-500">Country: Unknown</span>
                ) : (
                <span className="text-gray-900 font-medium">
                    {countryName}
                </span>
                )}
            </div>
            
            <ClickGame />

            <div className="mb-12 p-4 bg-gray-900 rounded-lg border border-gray-700 mt-6">
                <p className="text-sm text-gray-400 mb-2 font-pixel">Contract Address:</p>
                <p className="font-mono text-lg text-yellow-400 break-all font-pixel">
                    5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
                </p>
            </div>
        </div>

        {/* Leaderboard - Sticky to bottom, separate from main content */}
        <div className="sticky bottom-0 z-10 pb-20">
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
