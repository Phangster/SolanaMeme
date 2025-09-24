// Comment related interfaces

export interface Comment {
  _id: string;
  wallet: string;
  content: string;
  createdAt: string;
  commenterInfo?: {
    wallet: string;
    profilePicture?: {
      secureUrl: string;
    } | null;
  };
}

export interface CommentCreateRequest {
  content: string;
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
