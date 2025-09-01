'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Raindrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  delay: number;
}

const RaindropOverlay: React.FC = () => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 9 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 9000);

    // Hide overlay after 10 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    // Generate initial raindrops with staggered delays
    const initialRaindrops: Raindrop[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: -50 - Math.random() * 500, // Start above screen
      speed: 1.5 + Math.random() * 4,
      size: 20 + Math.random() * 60, // Size range: 20-80px
      opacity: 0.4 + Math.random() * 0.6,
      delay: Math.random() * 2000, // Staggered start
    }));

    setRaindrops(initialRaindrops);

    // Animation loop
    const animate = () => {
      setRaindrops(prev => 
        prev.map(drop => ({
          ...drop,
          y: drop.y + drop.speed,
          // Reset raindrop when it goes off screen
          ...(drop.y > (typeof window !== 'undefined' ? window.innerHeight : 800) && {
            y: -50 - Math.random() * 200,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            delay: Math.random() * 1000,
          }),
        }))
      );
    };

    const animationId = setInterval(animate, 16); // ~60fps

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      clearInterval(animationId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/20 to-transparent" />
      
      {/* Raindrops - Yao Ming faces */}
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.x}px`,
            top: `${drop.y}px`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}ms`,
          }}
        >
          <Image 
            src="/ym-right.png"
            alt="Yao Ming Raindrop" 
            width={drop.size}
            height={drop.size}
            className="w-full h-full object-contain"
            priority
            draggable={false}
          />
        </div>
      ))}

      {/* Additional visual effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent animate-pulse" />
    </div>
  );
};

export default RaindropOverlay;
