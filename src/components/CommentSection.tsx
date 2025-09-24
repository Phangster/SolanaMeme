'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { truncateWallet, formatTimeAgo } from '@/lib/utils';
import { Comment, CommentSectionProps } from '@/types/interfaces';

const CommentSection: React.FC<CommentSectionProps> = ({
  contentId,
  apiEndpoint,
  placeholder = 'Add a comment...',
  maxHeight = '320px',
  showHeader = false,
  className = '',
}) => {
  const { user, token, isAuthenticated } = useWalletAuth();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);


  // Load comments
  const loadComments = useCallback(async () => {
    if (!contentId) return;
    
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${apiEndpoint}/${contentId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        console.error('Failed to load comments');
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [contentId, apiEndpoint]);

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentId || !newComment.trim() || !user?.wallet) {
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${apiEndpoint}/${contentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment('');
        // Reload comments to show the new one
        await loadComments();
      } else {
        const errorData = await response.json();
        console.error('Failed to submit comment:', errorData.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Load comments when component mounts or contentId changes
  useEffect(() => {
    if (contentId) {
      loadComments();
    } else {
      setComments([]);
    }
  }, [contentId, loadComments]);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    if (comments.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const commentsContainer = document.querySelector('.comments-list');
        if (commentsContainer) {
          commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
      }, 100);
    }
  }, [comments.length]);

  if (!isAuthenticated) {
    return (
      <div className={`border-t border-gray-700 bg-gray-850 p-4 text-center ${className}`}>
        <p className="text-gray-400 font-pixel text-sm">Connect your wallet to view and add comments</p>
      </div>
    );
  }

  return (
    <div className={`border-t border-gray-700 bg-gray-850 flex flex-col ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <h4 className="text-white font-pixel font-bold">Comments</h4>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto comments-list" style={{ maxHeight }}>
        {isLoadingComments ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            <p className="text-gray-400 font-pixel text-sm">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-400 font-pixel text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {comments.map((comment, index) => (
              <div key={comment._id || `comment-${index}`} className="flex gap-3">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                  {comment.commenterInfo?.profilePicture?.secureUrl ? (
                    <Image
                      src={comment.commenterInfo.profilePicture.secureUrl}
                      alt="Commenter"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/default-avatar.png"
                      alt="Commenter"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-pixel text-xs font-bold">
                      {truncateWallet(comment.wallet)}
                    </span>
                    <span className="text-gray-500 text-xs font-pixel">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs font-pixel leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Comment Input at Bottom */}
      <div className="p-4 border-t border-gray-700 bg-gray-850 flex-shrink-0 sticky bottom-0">
        <form onSubmit={handleSubmitComment} className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
            {user?.profilePicture?.secureUrl ? (
              <Image
                src={user.profilePicture.secureUrl}
                alt="Your Avatar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="Your Avatar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="flex-1 flex gap-2 h-[38px]">
            <textarea
                placeholder={placeholder}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-gray-800 text-white font-pixel text-xs px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none resize-none overflow-y-auto"
                disabled={isSubmittingComment}
                maxLength={500}
                rows={1}
                style={{
                height: 'auto',
                minHeight: '38px'
                }}
                onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
            />
            
            {newComment && newComment.trim().length > 0 && (
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-4 py-2 text-yellow-400 hover:underline font-bold rounded-lg font-pixel text-xs transition-colors whitespace-nowrap flex-shrink-0 self-end"
              >
                {isSubmittingComment ? '...' : 'Post'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
