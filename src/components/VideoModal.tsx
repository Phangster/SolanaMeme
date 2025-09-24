'use client';
import React from 'react';
import Image from 'next/image';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import VideoEngagement from './VideoEngagement';
import CommentSection from './CommentSection';
import { truncateWallet, formatTimeAgo } from '@/lib/utils';
import { VideoModalProps } from '@/types/interfaces';

const VideoModal: React.FC<VideoModalProps> = ({
  video,
  isOpen,
  onClose,
  isMuted,
  onMuteToggle,
  isAuthenticated,
  currentUserWallet,
  showTitle = false
}) => {
  if (!isOpen || !video._id || !video.secureUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 md:w-[calc(100vw-320px)]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-7xl h-[90vh] lg:h-[600px] flex flex-col lg:flex-row bg-black rounded-lg overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white hover:text-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 z-20 border-2 border-gray-600 hover:border-yellow-400 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Section - Top on mobile, Left on desktop */}
        <div className="flex-1 flex items-center justify-center bg-black p-4 relative">
          <video
            src={video.secureUrl}
            className="w-full h-full object-contain rounded-lg"
            controls
            autoPlay
            loop
            muted={isMuted}
          />
          
          {/* Mute/Unmute Button */}
          <button
            onClick={onMuteToggle}
            className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 z-10"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="size-8" />
            ) : (
              <SpeakerWaveIcon className="size-8" />
            )}
          </button>
        </div>

        {/* Comments Section - Bottom on mobile, Right on desktop */}
        <div className="w-full lg:w-96 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
                <Image
                  src="/default-avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-pixel font-bold text-sm">
                  {video.uploader ? truncateWallet(video.uploader) : 'User'}
                </h3>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Title - Only for shorts */}
              {showTitle && (
                <h3 className="text-white font-pixel font-bold text-sm">
                  {video.title}
                </h3>
              )}
              <p className="text-gray-300 font-pixel text-sm">
                {video.description || ''}
              </p>
              <p className="text-gray-400 font-pixel text-xs">
                {video.uploadedAt ? formatTimeAgo(video.uploadedAt) : ''}
              </p>
            </div>
          </div>

          {/* Video Engagement Section */}
          <div className="p-4 border-b border-gray-700">
            <VideoEngagement
              videoId={video._id!}
              initialLikes={video.likes || []}
              initialLikesCount={video.likesCount || 0}
              initialViews={video.views || 0}
              isAuthenticated={isAuthenticated}
              currentUserWallet={currentUserWallet}
              size="sm"
              showLatestLiker={true}
              showViewCount={true}
            />
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col">
            <CommentSection
              contentId={video._id!}
              apiEndpoint="/api/videos"
              placeholder="Add a comment..."
              maxHeight="400px"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
