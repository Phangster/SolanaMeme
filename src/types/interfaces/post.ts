// Post related interfaces

export interface Post {
  _id: string;
  author: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  views: number;
  authorInfo: {
    wallet: string;
    profilePicture?: {
      secureUrl: string;
    } | null;
  };
}

export interface PostCreateRequest {
  content: string;
  imageUrl?: string;
}

export interface PostResponse {
  success: boolean;
  post: Post;
  message: string;
}

export interface PostUpdateRequest {
  content?: string;
  imageUrl?: string;
}
