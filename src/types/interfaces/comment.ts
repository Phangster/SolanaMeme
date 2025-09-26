// Comment related interfaces

export interface CommentLike {
  wallet: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  wallet: string;
  content: string;
  createdAt: string;
  parentCommentId?: string; // For replies
  replies?: Comment[]; // Nested replies
  likes?: CommentLike[]; // Comment likes
  contentId: string; // Reference to video or post
  contentType: 'video' | 'post';
  commenterInfo?: {
    wallet: string;
    profilePicture?: {
      secureUrl: string;
    } | null;
  };
}

export interface CommentCreateRequest {
  content: string;
  parentCommentId?: string; // For replies
}

export interface CommentResponse {
  success: boolean;
  comment: Comment;
  message: string;
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  totalComments: number;
  hasMore?: boolean;
}
