'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PostCreate from './PostCreate';
import PostCard from './PostCard';
import LoadingPage from './LoadingPage';
import { Post } from '@/types/interfaces';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(`/api/posts?skip=${skip}&limit=${limit}&status=approved`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }, []);

  const loadInitialPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const initialPosts = await fetchPosts(0, 10);
      setPosts(initialPosts);
      setHasMore(initialPosts.length === 10);
    } catch (error) {
      setError('Failed to load posts. Please try again.');
      console.error('Error loading initial posts:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const morePosts = await fetchPosts(posts.length, 10);
      
      if (morePosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...morePosts]);
        setHasMore(morePosts.length === 10);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPosts, posts.length, loadingMore, hasMore]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => 
      prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Load initial posts on mount
  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingPage message="Loading feed..." variant="minimal" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400 font-pixel text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Post Creation */}
      <PostCreate 
        onPostCreated={handlePostCreated}
        onError={handleError}
      />

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-gray-300 mb-2 font-pixel">No Posts Yet</h3>
            <p className="text-gray-400 font-pixel">Be the first to share something with the $YAO community!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdate={handlePostUpdate}
              />
            ))}

            {/* Load More Indicator */}
            {loadingMore && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-400 font-pixel">Loading more posts...</p>
              </div>
            )}

            {/* End of Feed Message */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-gray-400 font-pixel">You&apos;ve reached the end! Time to create some new content.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center py-6">
        <button
          onClick={loadInitialPosts}
          disabled={loading}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg font-pixel transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>
    </div>
  );
};

export default Feed;
