'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { EyeIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { truncateWallet } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';

interface VideoEngagementProps {
  videoId: string;
  initialLikes: Array<{
    wallet: string;
    createdAt: string;
  }>;
  initialLikesCount: number;
  initialViews: number;
  isAuthenticated: boolean;
  currentUserWallet?: string;
  onViewTracked?: (newViews: number) => void;
  className?: string;
  showLatestLiker?: boolean;
  showViewCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  commentsCount?: number;
  onCommentClick?: () => void;
}

export default function VideoEngagement({
  videoId,
  initialLikes,
  initialLikesCount,
  initialViews,
  isAuthenticated,
  currentUserWallet,
  onViewTracked,
  className = '',
  showLatestLiker = true,
  showViewCount = true,
  size = 'md',
  commentsCount = 0,
  onCommentClick
}: VideoEngagementProps) {
  const { isMobile, isTablet } = useWindowSize();
  const [videoLikes, setVideoLikes] = useState(initialLikesCount);
  const [latestLiker, setLatestLiker] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [videoViews, setVideoViews] = useState(initialViews);

  // Track video view
  const trackVideoView = useCallback(async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/view`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setVideoViews(data.views);
        onViewTracked?.(data.views);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [videoId, onViewTracked]);

  // Initialize likes and views
  useEffect(() => {
    setVideoLikes(initialLikesCount);
    setVideoViews(initialViews);
    
    // Set latest liker (most recent like)
    if (initialLikes && initialLikes.length > 0) {
      const sortedLikes = [...initialLikes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestLiker(sortedLikes[0].wallet);
    } else {
      setLatestLiker(null);
    }
    
    // Check if current user has already liked this video
    if (currentUserWallet && initialLikes) {
      const userHasLiked = initialLikes.some(like => like.wallet === currentUserWallet);
      setIsLiked(userHasLiked);
    } else {
      setIsLiked(false);
    }

    // Track view
    trackVideoView();
  }, [videoId, initialLikes, initialLikesCount, initialViews, currentUserWallet, trackVideoView]);

  // Handle video like/unlike
  const handleLikeVideo = async () => {
    if (!isAuthenticated || !currentUserWallet) {
      alert('Please connect your wallet to like videos');
      return;
    }

    if (isLiking) return; // Prevent double clicks

    setIsLiking(true);
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wallet_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideoLikes(data.totalLikes);
        setIsLiked(!isLiked); // Toggle like state
        
        if (!isLiked) {
          // User just liked, set as latest liker
          setLatestLiker(currentUserWallet);
        } else {
          // User just unliked, find new latest liker
          if (initialLikes && initialLikes.length > 1) {
            const remainingLikes = initialLikes.filter(like => like.wallet !== currentUserWallet);
            const sortedLikes = remainingLikes.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setLatestLiker(sortedLikes[0].wallet);
          } else {
            setLatestLiker(null);
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to toggle like:', errorData.error);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      icon: 'size-4',
      text: 'text-xs',
      button: 'size-5'
    },
    md: {
      icon: 'size-5',
      text: 'text-sm',
      button: 'size-6'
    },
    lg: {
      icon: 'size-6',
      text: 'text-base',
      button: 'size-7'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLikeVideo}
          disabled={isLiking || !isAuthenticated}
          className={`transition-colors ${
            isLiked 
              ? 'text-red-500 hover:text-red-400' 
              : 'text-gray-400 hover:text-red-500'
          } ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <HeartIcon className={`${currentSize.button} ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Mobile Comment Button - Mobile and Tablet */}
        {(isMobile || isTablet) && onCommentClick && (
          <button
            onClick={onCommentClick}
            className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            <ChatBubbleLeftIcon className={currentSize.button} />
            <span className={`font-pixel ${currentSize.text} ml-1`}>
              {commentsCount}
            </span>
          </button>
        )}

        {showViewCount && (
          <span className={`flex items-center gap-2 text-gray-400 font-pixel ${currentSize.text}`}>
            <EyeIcon className={currentSize.icon} /> 
            {videoViews || 0}
          </span>
        )} 
      </div>

      {/* Like Count and Latest Liker */}
      {showLatestLiker && videoLikes > 0 && (
        <p className={`text-white font-pixel ${currentSize.text} pt-2`}>
          {latestLiker && (
            <span>
              Liked by <span className="font-semibold">{truncateWallet(latestLiker)}</span>
              {videoLikes > 1 && ` and ${videoLikes - 1} other${videoLikes > 2 ? 's' : ''}`}
            </span>
          )}
          {!latestLiker && `${videoLikes} like${videoLikes > 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
}
