import React, { useState } from 'react';

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

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, isLoading, error, currentCountry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="sticky bottom-0 mx-auto w-full max-w-2xl bg-white rounded-t-lg shadow-2xl border border-gray-200 animate-pulse z-10">
        <div className="h-6 bg-gray-200 rounded-t-lg mb-4"></div>
        <div className="space-y-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sticky bottom-0 mx-auto w-full max-w-2xl bg-red-50 border border-red-200 rounded-t-lg shadow-2xl z-10">
        <div className="px-4 py-3">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Leaderboard</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="sticky bottom-0 mx-auto w-full max-w-2xl bg-white rounded-t-lg shadow-2xl border border-gray-200 z-10">
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
    <div className="sticky bottom-0 mx-auto w-full max-w-2xl bg-white rounded-t-lg shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out z-10">
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
                <span className="text-2xl">#1</span>
                <span className="text-4xl mb-2">
                  {getCountryFlag(leaderboard[0].country)}
                </span>
                <span className="text-white/80">
                  {leaderboard[0].clicks.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Current User's Country */}
            {currentCountry && (
              <div className="flex items-center gap-2">
                <span className="text-4xl mb-2">
                  {getCountryFlag(currentCountry)}
                </span>
                <span className="text-white/80">
                  {(() => {
                    const userCountry = leaderboard.find(entry => entry.country === currentCountry);
                    return userCountry ? `${userCountry.clicks.toLocaleString()}` : '0';
                  })()}
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
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="font-bold text-gray-900">Worldwide</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-sm">
                  {worldwidePPS} PPS
                </div>
                <div className="text-gray-900 font-bold text-lg">
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
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    isTop3 ? 'bg-gradient-to-r from-gray-50 to-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-8 text-center">
                        {index === 0 ? (
                          <span className="text-2xl">🥇</span>
                        ) : index === 1 ? (
                          <span className="text-2xl">🥈</span>
                        ) : index === 2 ? (
                          <span className="text-2xl">🥉</span>
                        ) : (
                          <span className="text-gray-500 font-medium text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Flag and Country */}
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getCountryFlag(entry.country)}</span>
                        <span className="font-medium text-gray-900 min-w-[80px]">
                          {entry.country}
                        </span>
                      </div>
                    </div>

                    {/* PPS and Total Clicks */}
                    <div className="text-right">
                      <div className="text-green-600 font-semibold text-sm">
                        {pps} PPS
                      </div>
                      <div className="text-gray-900 font-bold">
                        {entry.clicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Total Countries: {leaderboard.length}</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
