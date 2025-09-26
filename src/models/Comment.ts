import mongoose from 'mongoose';

// Comment Like Schema
export interface ICommentLike extends mongoose.Document {
  wallet: string;
  createdAt: Date;
}

const CommentLikeSchema = new mongoose.Schema({
  wallet: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true 
  },
}, { timestamps: true });

// Main Comment Schema
export interface IComment extends mongoose.Document {
  wallet: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentCommentId?: mongoose.Types.ObjectId; // For replies - references another comment's _id
  likes: ICommentLike[];
  // Reference to the content this comment belongs to
  contentId: mongoose.Types.ObjectId;
  contentType: 'video' | 'post';
}

const CommentSchema = new mongoose.Schema({
  wallet: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true 
  },
  content: { 
    type: String, 
    required: true, 
    maxlength: 500, 
    trim: true 
  },
  parentCommentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  },
  likes: [CommentLikeSchema],
  contentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  contentType: { 
    type: String, 
    required: true, 
    enum: ['video', 'post'] 
  },
}, { 
  timestamps: true,
  _id: true 
});

// Indexes for better performance
CommentSchema.index({ contentId: 1, contentType: 1 });
CommentSchema.index({ parentCommentId: 1 });
CommentSchema.index({ wallet: 1 });
CommentSchema.index({ createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
