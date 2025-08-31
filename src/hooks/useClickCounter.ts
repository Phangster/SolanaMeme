import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseClickCounterProps {
  country: string;
  batchInterval?: number; // milliseconds
}

interface LeaderboardEntry {
  country: string;
  clicks: number;
  updatedAt: string;
}

export const useClickCounter = ({ country, batchInterval = 500 }: UseClickCounterProps) => {
  const [localClicks, setLocalClicks] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyUpdated, setRecentlyUpdated] = useState<Set<string>>(new Set());
  
  const pendingClicks = useRef(0);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Function to send batched clicks to the server
  const sendBatchedClicks = useCallback(async () => {
    if (pendingClicks.current === 0) return;

    try {
      const response = await fetch('/api/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          clicks: pendingClicks.current,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send clicks');
      }

      // Reset pending clicks after successful send
      pendingClicks.current = 0;
    } catch (err) {
      console.error('Error sending batched clicks:', err);
      setError('Failed to sync clicks with server');
    }
  }, [country]);

  // Function to handle a click
  const handleClick = useCallback(() => {
    setLocalClicks(prev => prev + 1);
    pendingClicks.current += 1;

    // Immediately update the leaderboard with the new click
    setLeaderboard(prevLeaderboard => {
      const updatedLeaderboard = [...prevLeaderboard];
      const userCountryIndex = updatedLeaderboard.findIndex(entry => entry.country === country);
      
      if (userCountryIndex !== -1) {
        // Update existing country entry
        updatedLeaderboard[userCountryIndex] = {
          ...updatedLeaderboard[userCountryIndex],
          clicks: updatedLeaderboard[userCountryIndex].clicks + 1
        };
      } else {
        // Add new country entry if it doesn't exist
        updatedLeaderboard.push({
          country,
          clicks: 1,
          updatedAt: new Date().toISOString()
        });
      }
      
      // Sort by clicks (highest first)
      updatedLeaderboard.sort((a, b) => b.clicks - a.clicks);
      
      return updatedLeaderboard;
    });

    // Track this country as recently updated for animation
    setRecentlyUpdated(prev => new Set([...prev, country]));
    
    // Remove from recently updated after animation duration
    setTimeout(() => {
      setRecentlyUpdated(prev => {
        const newSet = new Set(prev);
        newSet.delete(country);
        return newSet;
      });
    }, 300); // 300ms animation duration

    // Clear existing timeout and set new one
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      sendBatchedClicks();
    }, batchInterval);
  }, [sendBatchedClicks, batchInterval, country]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!country || country === 'Unknown') return;

    // Set loading to true when starting connection
    setIsLoading(true);

    // Get WebSocket URL from environment or fallback to localhost
    const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
    console.log('🔌 Connecting to WebSocket server:', websocketUrl);

    // Create Socket.IO connection
    const socket = io(websocketUrl);
    socketRef.current = socket;

    // Set a timeout to prevent infinite loading
    const connectionTimeout = setTimeout(() => {
      if (socketRef.current && !socketRef.current.connected) {
        console.warn('⚠️ WebSocket connection timeout, setting loading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Handle connection
    socket.on('connect', () => {
      console.log('✅ WebSocket connected to:', websocketUrl);
      setError(null);
      clearTimeout(connectionTimeout);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected from:', websocketUrl);
      setError('Real-time connection lost');
      setIsLoading(false);
      clearTimeout(connectionTimeout);
    });

    // Handle leaderboard updates
    socket.on('leaderboardUpdate', (data: { leaderboard?: LeaderboardEntry[]; type?: string }) => {
      try {
        console.log('📡 Received WebSocket data:', data);
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
          setError(null);
          setIsLoading(false); // Set loading to false when first data is received
          clearTimeout(connectionTimeout);
          
          // Log update type for debugging
          if (data.type === 'update') {
            console.log('🎯 Real-time leaderboard update received');
          }
        }
      } catch (err) {
        console.error('Error processing WebSocket data:', err);
      }
    });

    // Handle errors
    socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket error occurred');
      setIsLoading(false); // Set loading to false on error
      clearTimeout(connectionTimeout);
    });

    // Handle pong responses
    socket.on('pong', (data: { timestamp: string }) => {
      console.log('🏓 WebSocket ping-pong working:', data.timestamp);
    });

    // Cleanup function
    return () => {
      clearTimeout(connectionTimeout);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [country]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    localClicks,
    leaderboard,
    error,
    isLoading,
    recentlyUpdated,
    handleClick,
  };
};
