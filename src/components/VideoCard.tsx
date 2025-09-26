'use client';
import React from 'react';
import { EyeIcon, HeartIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface VideoCardProps {
  video: {
    _id: string;
    publicId: string;
    secureUrl: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: string;
    likes: Array<{
      wallet: string;
      createdAt: string;
    }>;
    likesCount: number;
    views: number;
    commentsCount?: number; // Optional for community videos
    uploader?: string; // For community videos
  };
  onVideoClick: (video: VideoCardProps['video']) => void;
  showStatusBadge?: boolean;
  showMuteButton?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  videoId?: string; // For mute functionality
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onVideoClick,
  showStatusBadge = true,
  showMuteButton = false,
  isMuted = true,
  onMuteToggle,
  videoId,
  className = ''
}) => {
  return (
        <div
          className={`group relative aspect-[3/4] bg-black overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer ${className}`}
          onClick={() => onVideoClick(video)}
        >
      {/* Video Thumbnail */}
      <video
        src={video.secureUrl}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        id={videoId}
      />
      
      {/* Status Badge */}
      {showStatusBadge && (
        <div className={`absolute top-2 right-2 p-2 rounded-full text-xs font-pixel shadow-lg border-2 ${
          video.status === 'approved' 
            ? 'bg-green-500 text-white border-green-400' 
            : video.status === 'pending'
            ? 'bg-yellow-500 text-black border-yellow-400'
            : 'bg-red-500 text-white border-red-400'
        }`}>
          <div className="flex items-center gap-1">
            <span className="font-bold uppercase tracking-wide">
              {video.status}
            </span>
          </div>
        </div>
      )}

      {/* Mute/Unmute Button */}
      {showMuteButton && onMuteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMuteToggle();
          }}
          className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1 rounded-lg flex items-center gap-1 transition-colors text-xs z-10"
        >
            {isMuted ? (
                <SpeakerXMarkIcon className="size-4" />
            ) : (
                <SpeakerWaveIcon className="size-4" />
            )}
        </button>
      )}

      {/* Hover Stats Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-6 text-white font-pixel text-sm">
            <span className="flex items-center gap-2">
              <EyeIcon className="size-5" /> {video.views || 0}
            </span>
            <span className="flex items-center gap-2">
              <HeartIcon className="size-5" /> {video.likesCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Video Title Overlay (for community videos) */}
      {video.uploader && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h4 className="font-semibold text-white text-sm font-pixel truncate">{video.title}</h4>
          <p className="text-xs text-gray-300 font-pixel truncate">By {video.uploader}</p>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
