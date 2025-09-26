import mongoose from 'mongoose';

// Note: Comments are now stored in a separate Comment model
// and referenced by ID for better performance and scalability

export interface IPostLike extends mongoose.Document {
  wallet: string;
  createdAt: Date;
}

export interface IPost extends mongoose.Document {
  author: string; // wallet address
  content: string;
  imageUrl?: string; // optional image attachment
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  likes: IPostLike[];
  views: number;
}


const PostLikeSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
}, {
  timestamps: true,
});

const PostSchema = new mongoose.Schema<IPost>({
  author: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000, // Allow longer posts than video descriptions
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved', // Auto-approve text posts, unlike videos
  },
  likes: [PostLikeSchema],
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
PostSchema.index({ author: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 }); // For chronological feed
PostSchema.index({ 'likes.wallet': 1 }); // For like queries

// Virtual for likes count
PostSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count - removed since comments are now in separate collection

// Ensure virtuals are included when converting to JSON
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
