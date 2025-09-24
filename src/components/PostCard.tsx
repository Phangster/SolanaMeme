'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import CommentSection from './CommentSection';
import { truncateWallet, formatTimeAgo } from '@/lib/utils';
import { PostCardProps } from '@/types/interfaces';

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { token, isAuthenticated } = useWalletAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);


  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      alert('Please connect your wallet to like posts');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
          {post.authorInfo.profilePicture?.secureUrl ? (
            <Image
              src={post.authorInfo.profilePicture.secureUrl}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/default-avatar.png"
              alt="Default Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-pixel text-sm font-bold">
            {truncateWallet(post.author)}
          </p>
          <p className="text-gray-400 text-xs font-pixel">
            {formatTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-white text-sm font-pixel leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Post Image */}
        {post.imageUrl && (
          <div className="mt-4">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={800}
              height={400}
              className="w-full rounded-lg border border-gray-600"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              }`}
              disabled={!isAuthenticated}
            >
              <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-pixel text-sm">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleToggleComments}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <span className="text-lg">💬</span>
              <span className="font-pixel text-sm">{post.commentsCount}</span>
            </button>

            {/* Views */}
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-lg">👁️</span>
              <span className="font-pixel text-sm">{post.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          contentId={post._id}
          apiEndpoint="/api/posts"
          placeholder="Add a comment..."
          maxHeight="320px"
        />
      )}
    </div>
  );
};

export default PostCard;
