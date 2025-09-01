'use client';
import ClickGame from '@/components/ClickGame';
import Layout from '@/components/Layout';
import Leaderboard from '@/components/Leaderboard';
import LoadingPage from '@/components/LoadingPage';
import { useClickCounter } from '@/hooks/useClickCounter';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function HomePage() {
    const { country, countryName, isLoading: countryLoading, error: countryError } = useCountryDetection();
    const { 
        leaderboard, 
        error: leaderboardError,
        isLoading: leaderboardLoading,
    } = useClickCounter({ country });
    const { isMobile } = useWindowSize();

    // Check if both country detection and leaderboard are loaded
    // Allow game to be enabled if leaderboard is loaded, even if country detection fails
    const isFullyLoaded = !leaderboardLoading && (!countryLoading || country !== 'Unknown');

    // Show loading page while data is being fetched
    if (leaderboardLoading || countryLoading) {
        return (
            <Layout currentRoute="/" isLoading={true}>
                <LoadingPage message="Loading $YAO Country and Leaderboard..."  />
            </Layout>
        );
    }

  return (
    <Layout currentRoute="/" isLoading={false}>
      <div className="flex flex-col min-h-screen pt-20">
        {/* Main Content Area - Takes up available space */}
        <div className="flex-1 max-w-4xl mx-auto text-center">
          {/* Country Display */}
            <div className="bg-white shadow-lg w-fit rounded-full px-3 py-2 border border-gray-200 text-xs absolute top-4 left-4 z-20">
                {countryLoading ? (
                <span className="text-gray-500 animate-pulse">Detecting country...</span>
                ) : countryError ? (
                <span className="text-orange-500">Country: Unknown</span>
                ) : (
                <span className="text-gray-900 font-medium">
                    {countryName}
                </span>
                )}
            </div>
            
            <ClickGame isEnabled={isFullyLoaded} />

            <div className="mb-12 p-4 bg-gray-900 rounded-lg border border-gray-700 mt-6">
                <p className="text-sm text-gray-400 mb-2 font-pixel">Contract Address:</p>
                <p className="font-mono text-lg text-yellow-400 break-all font-pixel">
                    5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
                </p>
            </div>
        </div>

        {/* Leaderboard - Sticky to bottom, separate from main content */}
        <div className={`sticky bottom-0 z-10 ${isMobile ? 'pb-20' : 'pb-0'}`}>
          <Leaderboard 
            leaderboard={leaderboard}
            isLoading={leaderboardLoading}
            error={leaderboardError}
            currentCountry={country}
          />
        </div>
      </div>
    </Layout>
  );
}
