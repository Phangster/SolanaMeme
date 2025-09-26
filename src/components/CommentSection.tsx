'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
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
  const [parentCommentCount, setParentCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToWallet, setReplyingToWallet] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Load comments
  const loadComments = useCallback(async () => {
    if (!contentId) return;
    
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${apiEndpoint}/${contentId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setParentCommentCount(data.totalComments || 0);
      } else {
        console.error('Failed to load comments');
        setComments([]);
        setParentCommentCount(0);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
      setParentCommentCount(0);
    } finally {
      setIsLoadingComments(false);
    }
  }, [contentId, apiEndpoint]);

  // Submit new comment or reply
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentId || !newComment.trim() || !user?.wallet) {
      return;
    }

    // Extract actual comment content (remove @user mention if replying)
    let commentContent = newComment.trim();
    if (replyingTo && replyingToWallet) {
      // Remove the @user mention from the beginning of the content (using first 4 chars)
      const shortWallet = replyingToWallet.substring(0, 4);
      const mentionPattern = new RegExp(`^@${shortWallet}`, 'i');
      commentContent = commentContent.replace(mentionPattern, '').trim();
    }

    // Don't submit if content is empty after removing @mention
    if (!commentContent) {
      return;
    }

    setIsSubmittingComment(true);
    try {

      const requestBody: { content: string; parentCommentId?: string } = {
        content: commentContent,
      };

      // If replying to a comment, include parentCommentId
      if (replyingTo) {
        requestBody.parentCommentId = replyingTo;
      }

      const response = await fetch(`${apiEndpoint}/${contentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setNewComment('');
        setReplyingTo(null);
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

  // Handle reply button click - Instagram style
  const handleReplyClick = (commentId: string, commenterWallet: string) => {
    setReplyingTo(commentId);
    setReplyingToWallet(commenterWallet);
    setReplyText('');
    // Use only first 4 characters for reply mention
    const shortWallet = commenterWallet.substring(0, 4);
    setNewComment(`@${shortWallet}`);
    // Focus the main comment input
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      }
    }, 100);
  };

  // Remove @mention pill
  const removeMention = () => {
    setReplyingTo(null);
    setReplyingToWallet('');
    setReplyText('');
    setNewComment('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };


  // Handle comment like/unlike
  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    if (!isAuthenticated || !token) {
      alert('Please connect your wallet to like comments');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${apiEndpoint}/${contentId}/comments/${commentId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the comment in the state
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: isLiked 
                ? comment.likes?.filter(like => like.wallet !== user?.wallet) || []
                : [...(comment.likes || []), { wallet: user?.wallet || '', createdAt: new Date().toISOString() }]
            };
          }
          // Update replies as well
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply._id === commentId) {
                  return {
                    ...reply,
                    likes: isLiked 
                      ? reply.likes?.filter(like => like.wallet !== user?.wallet) || []
                      : [...(reply.likes || []), { wallet: user?.wallet || '', createdAt: new Date().toISOString() }]
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        }));
      } else {
        console.error('Failed to toggle comment like');
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
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
    <div className={`border-t border-gray-700 bg-gray-850 flex flex-col h-full ${className}`} style={{ maxHeight }}>
      {/* Header */}
      {showHeader && (
        <div className="p-2 border-b border-gray-700 flex-shrink-0">
          <h4 className="text-white font-pixel font-bold">
            Comments {parentCommentCount > 0 && `(${parentCommentCount})`}
          </h4>
        </div>
      )}

      {/* Comments List - Scrollable Area */}
      <div className="flex-1 overflow-y-auto comments-list" style={{ minHeight: '120px' }}>
        {isLoadingComments ? (
          <div className="p-4 space-y-3">
            {/* Skeleton Loading - 3 comment skeletons */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-3 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="p-4 flex flex-col justify-center items-center h-full text-center gap-2">
            <p className="text-white font-pixel text-sm">No comments yet</p>
            <p className="text-gray-400 font-pixel text-[10px]">Start the conversation.</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {comments.map((comment, index) => (
              <div key={comment._id || `comment-${index}`} className="space-y-2">
                {/* Main Comment */}
                <div className="flex gap-3">
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
                    
                    {/* Instagram-style action buttons */}
                    <div className="flex items-center gap-4 mt-2">
                      {/* Reply Button */}
                      {isAuthenticated && (
                        <button
                          onClick={() => handleReplyClick(comment._id, comment.wallet)}
                          className="text-gray-500 hover:text-gray-300 font-pixel text-xs transition-colors"
                        >
                          Reply
                        </button>
                      )}

                      {/* Like Button */}
                      {isAuthenticated && (
                        <button
                          onClick={() => {
                            const isLiked = comment.likes?.some(like => like.wallet === user?.wallet) || false;
                            handleCommentLike(comment._id, isLiked);
                          }}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          {comment.likes?.some(like => like.wallet === user?.wallet) ? (
                            <HeartIcon className="w-4 h-4 text-red-500" />
                          ) : (
                            <HeartOutlineIcon className="w-4 h-4" />
                          )}
                          {comment.likes && comment.likes.length > 0 && (
                            <span className="text-xs font-pixel">
                              {comment.likes.length}
                            </span>
                          )}
                        </button>
                      )}
                      
                    </div>
                  </div>
                </div>

                {/* Replies Section */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-9 space-y-2">
                    {comment.replies.map((reply, replyIndex) => (
                      <div key={reply._id || `reply-${replyIndex}`} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                          {reply.commenterInfo?.profilePicture?.secureUrl ? (
                            <Image
                              src={reply.commenterInfo.profilePicture.secureUrl}
                              alt="Reply Author"
                              width={20}
                              height={20}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src="/default-avatar.png"
                              alt="Reply Author"
                              width={20}
                              height={20}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-pixel text-xs font-bold">
                              {truncateWallet(reply.wallet)}
                            </span>
                            <span className="text-gray-500 text-xs font-pixel">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-xs font-pixel leading-relaxed">
                            {reply.content}
                          </p>
                          
                          {/* Instagram-style action buttons for replies */}
                          <div className="flex items-center gap-4 mt-1">
                            {/* Reply Button for Reply */}
                            {isAuthenticated && (
                              <button
                                onClick={() => handleReplyClick(comment._id, reply.wallet)}
                                className="text-gray-500 hover:text-gray-300 font-pixel text-xs transition-colors"
                              >
                                Reply
                              </button>
                            )}

                            {/* Like Button for Reply */}
                            {isAuthenticated && (
                              <button
                                onClick={() => {
                                  const isLiked = reply.likes?.some(like => like.wallet === user?.wallet) || false;
                                  handleCommentLike(reply._id, isLiked);
                                }}
                                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                {reply.likes?.some(like => like.wallet === user?.wallet) ? (
                                  <HeartIcon className="size-4 text-red-500" />
                                ) : (
                                  <HeartOutlineIcon className="size-4" />
                                )}
                                {reply.likes && reply.likes.length > 0 && (
                                  <span className="text-xs font-pixel">
                                    {reply.likes.length}
                                  </span>
                                )}
                              </button>
                            )}
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Comment Input at Bottom */}
      <div className="p-4 border-t border-gray-700 bg-gray-850 flex-shrink-0">
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
          
          <div className="flex-1 flex gap-2 items-center">
            {/* Simple text input with inline mention */}
            <div className="w-full bg-gray-800 rounded-lg border border-gray-600 focus-within:border-yellow-400 p-2">
              <textarea
                ref={textareaRef}
                placeholder={replyingTo ? `@${replyingToWallet.substring(0, 4)} Add a reply...` : placeholder}
                value={replyingTo ? `@${replyingToWallet.substring(0, 4)}${replyText}` : newComment}
                onChange={(e) => {
                  const value = e.target.value;
                  if (replyingTo) {
                    // Remove the @user part from the value to get just the reply text
                    const shortWallet = replyingToWallet.substring(0, 4);
                    const mentionText = `@${shortWallet}`;
                    const replyText = value.startsWith(mentionText) 
                      ? value.substring(mentionText.length)
                      : value;
                    setReplyText(replyText);
                    setNewComment(value);
                  } else {
                    setNewComment(value);
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace to remove mention
                  if (e.key === 'Backspace' && replyingTo) {
                    const target = e.target as HTMLTextAreaElement;
                    const value = target.value;
                    const shortWallet = replyingToWallet.substring(0, 4);
                    const mentionText = `@${shortWallet}`;
                    
                    // If cursor is at the end of the mention, remove the entire mention
                    if (value === mentionText) {
                      e.preventDefault();
                      removeMention();
                    }
                  }
                }}
                className="w-full bg-transparent text-white font-pixel text-xs outline-none resize-none overflow-y-auto max-h-[100px]"
                disabled={isSubmittingComment}
                maxLength={500}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
                }}
              />
            </div>

            {(() => {
              // Check if we have valid content after cleaning
              let hasValidContent = newComment.trim().length > 0;
              if (replyingTo && replyingToWallet) {
                const shortWallet = replyingToWallet.substring(0, 4);
                const mentionPattern = new RegExp(`^@${shortWallet}`, 'i');
                const cleanedContent = newComment.trim().replace(mentionPattern, '').trim();
                hasValidContent = cleanedContent.length > 0;
              }
              return hasValidContent;
            })() && (
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="size-8 flex items-center justify-center bg-yellow-400 rounded-full text-gray-800 flex-shrink-0"
              >
                <ArrowUpIcon className="size-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
