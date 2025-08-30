import { useState } from 'react';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useClickCounter } from '@/hooks/useClickCounter';
import Leaderboard from './Leaderboard';
import Image from 'next/image';

const ClickGame: React.FC = () => {
  const { country, countryName, isLoading: countryLoading, error: countryError } = useCountryDetection();
  const { 
    localClicks, 
    leaderboard, 
    error: leaderboardError, 
    handleClick 
  } = useClickCounter({ country });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showLeftImage, setShowLeftImage] = useState(true);

  const handleImageClick = () => {
    setIsAnimating(true);
    setShowLeftImage(false); // Show right image during click
    
    // After animation, return to left image
    setTimeout(() => {
      setShowLeftImage(true);
      setIsAnimating(false);
    }, 100); // Half the animation duration to show right image briefly
    
    handleClick();
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-0">
              YAOME
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Click as fast as you can! Compete with the world! YAOME!
          </p>
          
          {/* Country Display */}
          <div className="inline-flex items-center gap-2 bg-white shadow-lg rounded-full px-6 py-3 border border-gray-200 mt-8">
            <span className="text-blue-600">📍</span>
            {countryLoading ? (
              <span className="text-gray-500 animate-pulse">Detecting country...</span>
            ) : countryError ? (
              <span className="text-red-500">Country: Unknown</span>
            ) : (
              <span className="text-gray-900 font-medium">
                {countryName} ({country})
              </span>
            )}
          </div>
        </div>

        {/* Click Section - Centered */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Clickable Yao Ming Face Image */}
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-bold text-yellow-500 pt-3">
                {localClicks.toLocaleString()}
            </div>
            <div className="flex items-center justify-center mb-6">
              <Image 
                src={showLeftImage ? "/ym-left.png" : "/ym-right.png"}
                alt="Yao Ming Face" 
                width={400}
                height={400}
                className={`rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isAnimating ? 'scale-110' : 'scale-100'
                }`}
                onClick={handleImageClick}
              />
            </div>
          </div>
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
    </div>
  );
};

export default ClickGame;
