// Like related interfaces

export interface Like {
  wallet: string;
  createdAt: Date;
}

export interface LikeResponse {
  success: boolean;
  videoId?: string;
  postId?: string;
  totalLikes: number;
  isLiked: boolean;
  message: string;
}
