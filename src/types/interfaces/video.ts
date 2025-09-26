// Video related interfaces

export interface Video {
  _id?: string;
  publicId?: string;
  secureUrl?: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
  uploadedAt?: string;
  uploader?: string;
  likes?: Array<{
    wallet: string;
    createdAt: string;
  }>;
  likesCount?: number;
  views?: number;
  comments?: Array<{
    wallet: string;
    content: string;
    createdAt: Date;
  }>;
  commentsCount?: number;
}

export interface VideoCreateRequest {
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  uploadedAt?: string;
}

export interface VideoResponse {
  success: boolean;
  video: Video;
  message: string;
}

export interface VideosResponse {
  success: boolean;
  videos: Video[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  count?: number;
}

export interface VideoModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  isAuthenticated: boolean;
  currentUserWallet?: string;
  showTitle?: boolean;
  // Carousel props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos?: any[];
  currentVideoIndex?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVideoChange?: (video: any, index: number) => void;
}

export interface UploadedVideo {
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  uploadedAt: string;
}
