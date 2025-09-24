import { useState, useEffect, useCallback } from 'react';

interface Video {
  _id: string;
  uploader: string;
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  uploadedAt: string;
  likes: Array<{
    wallet: string;
    createdAt: string;
  }>;
  likesCount: number;
  commentsCount: number;
  views: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface UseVideosOptions {
  status?: 'pending' | 'approved' | 'rejected';
  limit?: number;
  page?: number;
  uploader?: string;
  autoFetch?: boolean;
  endpoint?: 'videos' | 'user/videos';
  requireAuth?: boolean;
}

interface UseVideosReturn {
  videos: Video[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  totalVideos: number;
  currentPage: number;
  totalPages: number;
}

export function useVideos(options: UseVideosOptions = {}): UseVideosReturn {
  const {
    status,
    limit = 20,
    page = 1,
    uploader,
    autoFetch = true,
    endpoint = 'videos',
    requireAuth = false
  } = options;

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check authentication for user videos
      if (requireAuth) {
        const token = localStorage.getItem('wallet_token');
        if (!token) {
          throw new Error('Authentication required');
        }
      }

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: currentPage.toString(),
      });

      // Only add status filter if specified
      if (status) {
        params.append('status', status);
      }

      if (uploader) {
        params.append('uploader', uploader);
      }

      // Build headers
      const headers: HeadersInit = {};
      if (requireAuth) {
        const token = localStorage.getItem('wallet_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`/api/${endpoint}?${params.toString()}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
        setTotalVideos(data.pagination?.total || data.count || 0);
        setTotalPages(data.pagination?.pages || 1);
        setHasMore(data.pagination ? data.pagination.page < data.pagination.pages : false);
      } else {
        throw new Error(data.error || 'Failed to fetch videos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  }, [status, limit, currentPage, uploader, endpoint, requireAuth]);

  const refetch = useCallback(async () => {
    await fetchVideos();
  }, [fetchVideos]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchVideos();
    }
  }, [fetchVideos, autoFetch]);

  return {
    videos,
    loading,
    error,
    refetch,
    hasMore,
    totalVideos,
    currentPage,
    totalPages,
  };
}

// Specialized hook for user's own videos (dashboard)
export function useUserVideos() {
  return useVideos({
    limit: 50,
    autoFetch: true,
    endpoint: 'user/videos',
    requireAuth: true,
  });
}

// Specialized hook for community videos (shorts)
export function useCommunityVideos() {
  return useVideos({
    status: 'approved',
    limit: 12,
    autoFetch: true,
    endpoint: 'videos',
    requireAuth: false,
  });
}

// Hook for fetching videos with specific filters
export function useVideosWithFilters(filters: UseVideosOptions) {
  return useVideos(filters);
}
