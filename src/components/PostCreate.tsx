'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { truncateWallet } from '@/lib/utils';
import { PostCreateProps } from '@/types/interfaces';

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated, onError }) => {
  const { user, token, isAuthenticated } = useWalletAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setContent(value);
      
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      onError?.('Please connect your wallet to post');
      return;
    }

    if (!content.trim()) {
      onError?.('Post content cannot be empty');
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const data = await response.json();
      
      // Reset form
      setContent('');
      setImageUrl('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Call success callback
      onPostCreated?.(data.post);

    } catch (error) {
      console.error('Create post error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      onError?.(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
        <p className="text-gray-400 font-pixel">Connect your wallet to create posts</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
          {user?.profilePicture?.secureUrl ? (
            <Image
              src={user.profilePicture.secureUrl}
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
        <div>
          <p className="text-white font-pixel text-sm">
            {user?.wallet ? truncateWallet(user.wallet) : 'Unknown User'}
          </p>
          <p className="text-gray-400 text-xs font-pixel">What&apos;s on your mind?</p>
        </div>
      </div>

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Textarea */}
        <div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Share your thoughts about $YAO..."
            className="w-full bg-gray-700 text-white p-4 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none resize-none font-pixel text-sm min-h-[100px] max-h-[300px]"
            disabled={isPosting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs font-pixel ${
              content.length > 1800 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {content.length}/2000
            </span>
          </div>
        </div>

        {/* Optional Image URL */}
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Add an image URL (optional)"
            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none font-pixel text-sm"
            disabled={isPosting}
          />
        </div>

        {/* Image Preview */}
        {imageUrl && (
          <div className="relative">
            <Image
              src={imageUrl}
              alt="Post preview"
              width={400}
              height={256}
              className="max-w-full h-auto max-h-64 rounded-lg border border-gray-600"
              onError={() => setImageUrl('')}
            />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-xs font-pixel">🌟 Express yourself!</span>
          </div>
          
          <div className="flex gap-2">
            {/* Only show buttons when there's content */}
            {content.trim() && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setContent('');
                    setImageUrl('');
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-pixel text-sm transition-colors"
                  disabled={isPosting}
                >
                  Clear
                </button>
                
                <button
                  type="submit"
                  disabled={isPosting}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg font-pixel text-sm transition-colors"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
