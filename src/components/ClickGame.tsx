import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useClickCounter } from '@/hooks/useClickCounter';
import Image from 'next/image';
import LoadingPage from './LoadingPage';

interface ClickGameProps {
  isEnabled: boolean;
}

const ClickGame: React.FC<ClickGameProps> = ({ isEnabled }) => {
  const { country } = useCountryDetection();
  const { 
    localClicks, 
    handleClick,
  } = useClickCounter({ country });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showLeftImage, setShowLeftImage] = useState(true);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const currentAudioIndexRef = useRef(0);
  const hasUserInteracted = useRef(false);

  // Initialize audio pool only after first user interaction
  const initializeAudio = useCallback(() => {
    if (hasUserInteracted.current || typeof window === 'undefined') return;
    
    hasUserInteracted.current = true;
    
    // Create multiple audio instances for rapid clicking
    const audioPool: HTMLAudioElement[] = [];
    const poolSize = 5; // Number of audio instances to handle rapid clicks
    
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio('/click-sound.m4a');
      audio.preload = 'auto';
      audio.volume = 1.0; // Set volume to 100% (maximum)
      
      audio.addEventListener('canplaythrough', () => {
        if (i === 0) { // Only set loaded state once
          setIsAudioLoaded(true);
          console.log('Audio pool loaded successfully');
        }
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Audio ${i} loading error:`, e);
        if (i === 0) {
          setIsAudioLoaded(false);
        }
      });
      
      audioPool.push(audio);
    }
    
    audioPoolRef.current = audioPool;
  }, []);

  const playClickSound = useCallback(() => {
    // Initialize audio on first click if not already done
    if (!hasUserInteracted.current) {
      initializeAudio();
    }
    
    if (audioPoolRef.current.length > 0 && isAudioLoaded) {
      // Get current audio instance
      const audio = audioPoolRef.current[currentAudioIndexRef.current];
      
      // Reset audio to beginning and play
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      // Cycle to next audio instance for next click
      currentAudioIndexRef.current = (currentAudioIndexRef.current + 1) % audioPoolRef.current.length;
    }
  }, [isAudioLoaded, initializeAudio]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPoolRef.current.length > 0) {
        audioPoolRef.current.forEach(audio => {
          audio.pause();
        });
        audioPoolRef.current = [];
      }
    };
  }, []);

  const handleImageClick = useCallback(() => {
    // Prevent clicking if game is not enabled
    if (!isEnabled) return;
    
    console.log('Image clicked!'); // Debug log
    
    // Play sound effect
    playClickSound();
    
    setIsAnimating(true);
    setShowLeftImage(false); // Show right image during click
    
    // After animation, return to left image
    setTimeout(() => {
      setShowLeftImage(true);
      setIsAnimating(false);
    }, 100); // Back to 100ms for faster animation
    
    handleClick();
  }, [handleClick, playClickSound, isEnabled]);

  // Handle keyboard events (Shift and Tab keys)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isEnabled) return; // Prevent keyboard clicks if disabled
    
    if (e.key === 'Shift' || e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior
      handleImageClick();
    }
  }, [handleImageClick, isEnabled]);

  // Set up touch event listeners with passive: false
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isEnabled) return; // Prevent touch clicks if disabled
      
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
  }, [handleImageClick, isEnabled]);

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-0">
            YAOME
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Click as fast as you can! Compete with the world! YAOME!
        </p>
      </div>

      {/* Click Section - Centered */}
      <div className="max-w-2xl mx-auto relative">
        {/* Loading Overlay */}
        {!isEnabled && (
          <div className="absolute inset-0 bg-black rounded-lg z-10">
            <LoadingPage 
              message="Loading game..." 
              variant="minimal"
              className="bg-transparent"
            />
          </div>
        )}
        
        {/* Clickable Yao Ming Face Image */}
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-yellow-500 mt-4">
              {localClicks.toLocaleString()}
          </div>
          <div className="flex items-center justify-center mt-3">
            <Image 
              ref={imageRef}
              src={showLeftImage ? "/ym-left.png" : "/ym-right.png"}
              alt="Yao Ming Face" 
              width={400}
              height={400}
              className={`rounded-lg shadow-lg transition-all duration-100 hover:scale-105 touch-manipulation select-none ${
                isAnimating ? 'scale-110' : 'scale-100'
              } ${
                isEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
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
              tabIndex={isEnabled ? 0 : -1}
              priority
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickGame;
