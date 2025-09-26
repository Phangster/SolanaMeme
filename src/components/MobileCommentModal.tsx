'use client';
import React, { useEffect } from 'react';
import CommentSection from './CommentSection';

interface MobileCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  apiEndpoint: string;
  placeholder?: string;
}

const MobileCommentModal: React.FC<MobileCommentModalProps> = ({
  isOpen,
  onClose,
  contentId,
  apiEndpoint,
  placeholder = 'Add a comment...',
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal Content */}
      <div className="relative w-full h-full bg-gray-900 rounded-t-2xl transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-700 flex-shrink-0 relative">
          <h3 className="text-white font-pixel font-bold text-xs md:text-lg">Comments</h3>
          <button
            onClick={onClose}
            className="absolute right-2 text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comments Section - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <CommentSection
            contentId={contentId}
            apiEndpoint={apiEndpoint}
            placeholder={placeholder}
            maxHeight="100%"
            className="h-full"
            showHeader={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileCommentModal;
