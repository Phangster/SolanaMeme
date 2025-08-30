import { useState, useRef, useEffect, useCallback } from 'react';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useClickCounter } from '@/hooks/useClickCounter';
import Image from 'next/image';

const ClickGame: React.FC = () => {
  const { country, countryName, isLoading: countryLoading, error: countryError } = useCountryDetection();
  const { 
    localClicks, 
    handleClick 
  } = useClickCounter({ country });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showLeftImage, setShowLeftImage] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = useCallback(() => {
    console.log('Image clicked!'); // Debug log
    setIsAnimating(true);
    setShowLeftImage(false); // Show right image during click
    
    // After animation, return to left image
    setTimeout(() => {
      setShowLeftImage(true);
      setIsAnimating(false);
    }, 100); // Back to 100ms for faster animation
    
    handleClick();
  }, [handleClick]);

  // Handle keyboard events (Shift and Tab keys)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Shift' || e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior
      handleImageClick();
    }
  }, [handleImageClick]);

  // Set up touch event listeners with passive: false
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      console.log('Touch start detected!'); // Debug log
      e.preventDefault();
      handleImageClick();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while touching
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Add event listeners with passive: false
    imageElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    imageElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    imageElement.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      imageElement.removeEventListener('touchstart', handleTouchStart);
      imageElement.removeEventListener('touchmove', handleTouchMove);
      imageElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleImageClick]);

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
                ref={imageRef}
                src={showLeftImage ? "/ym-left.png" : "/ym-right.png"}
                alt="Yao Ming Face" 
                width={400}
                height={400}
                className={`rounded-lg shadow-lg cursor-pointer transition-all duration-100 hover:scale-105 touch-manipulation select-none ${
                  isAnimating ? 'scale-110' : 'scale-100'
                }`}
                onClick={handleImageClick}
                onKeyDown={handleKeyDown}
                style={{ 
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                tabIndex={0}
                priority
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickGame;
