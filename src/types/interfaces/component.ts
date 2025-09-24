// Component prop interfaces
import { Post } from './post';
import { UploadedVideo } from './video';

export interface CommentSectionProps {
  contentId: string;
  apiEndpoint: string;
  placeholder?: string;
  maxHeight?: string;
  showHeader?: boolean;
  className?: string;
}

export interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

export interface PostCreateProps {
  onPostCreated?: (post: Post) => void;
  onError?: (error: string) => void;
}

export interface VideoUploadProps {
  onUploadSuccess?: (video: UploadedVideo) => void;
}

export interface UploadStatus {
  isOpen: boolean;
  status: 'uploading' | 'success' | 'error';
  message: string;
  progress?: number;
}
