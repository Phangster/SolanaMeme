'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { SpeakerWaveIcon, SpeakerXMarkIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useWindowSize } from '@/hooks/useWindowSize';
import VideoEngagement from './VideoEngagement';
import CommentSection from './CommentSection';
import MobileCommentModal from './MobileCommentModal';
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
  showTitle = false,
  videos = [],
  currentVideoIndex = 0,
  onVideoChange
}) => {
  const { isMobile, isTablet, isDesktop } = useWindowSize();
  const [showMobileCommentModal, setShowMobileCommentModal] = useState(false);

  if (!isOpen || !video._id || !video.secureUrl) return null;

  const handleMobileCommentClick = () => {
    setShowMobileCommentModal(true);
  };

  const handleCloseMobileModal = () => {
    setShowMobileCommentModal(false);
  };

  // Carousel navigation functions
  const handlePreviousVideo = () => {
    if (videos.length > 0 && currentVideoIndex > 0) {
      const prevVideo = videos[currentVideoIndex - 1];
      onVideoChange?.(prevVideo, currentVideoIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (videos.length > 0 && currentVideoIndex < videos.length - 1) {
      const nextVideo = videos[currentVideoIndex + 1];
      onVideoChange?.(nextVideo, currentVideoIndex + 1);
    }
  };

  const canGoPrevious = videos.length > 0 && currentVideoIndex > 0;
  const canGoNext = videos.length > 0 && currentVideoIndex < videos.length - 1;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 md:w-[calc(100vw-320px)]"
      onClick={(e) => {
        // Only close if not clicking on mobile comment modal
        if (!showMobileCommentModal) {
          onClose();
        }
      }}
    >
      {/* Previous Video Button - Outside modal frame */}
      {canGoPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePreviousVideo();
          }}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white hover:bg-gray-400 text-black p-1 rounded-full transition-all duration-300 z-[110] border border-gray-600 hover:border-gray-500 shadow-lg"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
      )}

      {/* Next Video Button - Outside modal frame */}
      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextVideo();
          }}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white hover:bg-gray-400 text-black p-1 rounded-full transition-all duration-300 z-[110] border border-gray-600 hover:border-gray-500 shadow-lg"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      )}
      <div 
          className="relative w-[80vw] md:w-[65vw] h-[600px] flex flex-col xl:flex-row bg-black rounded-lg overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-6 bg-gray-800 hover:bg-gray-700 text-white hover:text-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 z-20 border-2 border-gray-600 hover:border-yellow-400 shadow-lg"
        >
          <XMarkIcon className="size-4" />
        </button>

        {/* Video Section - Top on mobile, Left on desktop */}
        <div className="flex-1 flex items-center justify-center bg-black relative h-[30vh] xl:h-full">
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
            className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-lg flex items-center gap-2 transition-all duration-300 z-10"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="size-4" />
            ) : (
              <SpeakerWaveIcon className="size-4" />
            )}
          </button>
        </div>

        {/* Comments Section - Bottom on mobile/tablet, Right on desktop */}
        <div className="w-full xl:w-96 bg-gray-900 border-t xl:border-t-0 xl:border-l border-gray-700 flex flex-col">
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
          <div className="p-4 xl:border-b border-gray-700">
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
              commentsCount={video.commentsCount || 0}
              onCommentClick={(isMobile || isTablet) ? handleMobileCommentClick : undefined}
            />
          </div>

          {/* Comments Section */}
          {isDesktop && (
            <CommentSection
              contentId={video._id!}
              apiEndpoint="/api/videos"
              placeholder="Add a comment..."
              maxHeight="400px"
              className="flex-1"
            />
          )}
        </div>
      </div>

      {/* Mobile Comment Modal */}
      {(isMobile || isTablet) && (
        <MobileCommentModal
          isOpen={showMobileCommentModal}
          onClose={handleCloseMobileModal}
          contentId={video._id!}
          apiEndpoint="/api/videos"
          placeholder="Add a comment..."
        />
      )}
    </div>
  );
};

export default VideoModal;
