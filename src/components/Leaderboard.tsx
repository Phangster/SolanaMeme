import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  country: string;
  clicks: number;
  updatedAt: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  currentCountry?: string; // Add current country prop
}

// Country flag emojis mapping
const getCountryFlag = (countryCode: string): string => {
  const flagMap: { [key: string]: string } = {
    'US': '🇺🇸', 'SG': '🇸🇬', 'TH': '🇹🇭', 'HK': '🇭🇰', 'TW': '🇹🇼', 'JP': '🇯🇵',
    'KR': '🇰🇷', 'MY': '🇲🇾', 'SA': '🇸🇦', 'ID': '🇮🇩', 'FI': '🇫🇮', 'SE': '🇸🇪',
    'PL': '🇵🇱', 'AE': '🇦🇪', 'DK': '🇩🇰', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'CA': '🇨🇦', 'AU': '🇦🇺', 'BR': '🇧🇷', 'IN': '🇮🇳', 'CN': '🇨🇳', 'RU': '🇷🇺'
  };
  return flagMap[countryCode] || '🌍';
};

// Calculate PPS (clicks per second) based on recent activity
const calculatePPS = (clicks: number): number => {
  // Simple calculation - in a real app, you'd track time-based metrics
  return Math.round((clicks / 1000000) * 100) / 100;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, error, currentCountry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentCountryClicks, setCurrentCountryClicks] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update current country clicks whenever leaderboard or currentCountry changes
  useEffect(() => {
    if (currentCountry && leaderboard.length > 0) {
      const entry = leaderboard.find(entry => entry.country === currentCountry);
      const newClicks = entry?.clicks || 0;
      
      // Only animate if the clicks actually changed
      if (newClicks !== currentCountryClicks) {
        setIsAnimating(true);
        setCurrentCountryClicks(newClicks);
        
        // Reset animation after a short delay
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    } else {
      setCurrentCountryClicks(0);
    }
  }, [leaderboard, currentCountry, currentCountryClicks]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl bg-red-50 border border-red-200 rounded-t-lg shadow-2xl z-10">
        <div className="px-4 py-3">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Leaderboard</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl bg-white rounded-t-lg shadow-2xl border border-gray-200 z-10">
        <div className="px-4 py-3">
          <h3 className="text-gray-900 font-semibold mb-2">Global Leaderboard</h3>
          <p className="text-gray-600 text-sm">No clicks recorded yet. Start clicking to see the leaderboard!</p>
        </div>
      </div>
    );
  }

  // Calculate worldwide total
  const worldwideTotal = leaderboard.reduce((sum, entry) => sum + entry.clicks, 0);
  const worldwidePPS = calculatePPS(worldwideTotal);

  return (
    <div className="mx-auto w-full max-w-2xl bg-white rounded-t-lg shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out z-10">
      {/* Header - Always Visible */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            {/* #1 Country */}
            {leaderboard.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="md:text-2xl">#1</span>
                <span className="text-xl md:text-4xl mb-2">
                  {getCountryFlag(leaderboard[0].country)}
                </span>
                <span className="text-sm md:text-2xl text-white/80 transition-all duration-300">
                  {leaderboard[0].clicks.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Current User's Country */}
            {currentCountry && (
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-4xl mb-2">
                  {getCountryFlag(currentCountry)}
                </span>
                <span className={`text-white/80 transition-all duration-100 text-sm md:text-2xl ${
                  isAnimating ? 'text-xl md:text-4xl font-bold' : ''
                }`}>
                  {currentCountryClicks.toLocaleString()}
                </span>
              </div>
            )}
            <div className={`transform transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>
              <span className="text-white text-xl">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded View - Full Leaderboard */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {/* Worldwide Total */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl">🏆</span>
                <span className="font-bold text-gray-900 text-sm md:text-base">Worldwide</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-xs md:text-sm">
                  {worldwidePPS} PPS
                </div>
                <div className="text-gray-900 font-bold text-sm md:text-lg">
                  {worldwideTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Country Rankings */}
          <div className="divide-y divide-gray-100">
            {leaderboard.map((entry, index) => {
              const pps = calculatePPS(entry.clicks);
              const isTop3 = index < 3;
              
              return (
                <div
                  key={entry.country}
                  className={`px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors ${
                    isTop3 ? 'bg-gradient-to-r from-gray-50 to-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Rank */}
                      <div className="w-6 md:w-8 text-center">
                        {index === 0 ? (
                          <span className="text-xl md:text-2xl">🥇</span>
                        ) : index === 1 ? (
                          <span className="text-xl md:text-2xl">🥈</span>
                        ) : index === 2 ? (
                          <span className="text-xl md:text-2xl">🥉</span>
                        ) : (
                          <span className="text-gray-500 font-medium text-xs md:text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Flag and Country */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-lg md:text-xl">{getCountryFlag(entry.country)}</span>
                        <span className="font-medium text-gray-900 min-w-[60px] md:min-w-[80px] text-xs md:text-sm">
                          {entry.country}
                        </span>
                      </div>
                    </div>

                    {/* PPS and Total Clicks */}
                    <div className="text-right">
                      <div className="text-green-600 font-semibold text-xs md:text-sm">
                        {pps} PPS
                      </div>
                      <div className="font-bold text-sm md:text-base text-gray-900">
                        {entry.clicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;