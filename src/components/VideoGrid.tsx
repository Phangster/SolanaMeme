'use client';
import React from 'react';
import VideoCard from './VideoCard';

interface UserVideo {
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
}

interface VideoGridProps {
  videos: UserVideo[];
  loading: boolean;
  onVideoClick: (video: UserVideo) => void;
  onAddVideoClick: () => void;
  className?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  loading,
  onVideoClick,
  onAddVideoClick,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 font-pixel">Loading your videos...</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {/* Add Video Button - Always visible */}
      <div 
        className="group relative aspect-[3/4] bg-gray-800 border-2 border-dashed border-gray-600 hover:border-yellow-400 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer flex items-center justify-center"
        onClick={onAddVideoClick}
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-yellow-400 font-pixel text-sm font-bold group-hover:text-yellow-300 transition-colors">
            ADD VIDEO
          </div>
        </div>
      </div>

      {/* Video Thumbnails */}
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onVideoClick={onVideoClick}
          showStatusBadge={true}
          showMuteButton={false}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
