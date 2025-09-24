import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
  wallet: string;
  content: string;
  createdAt: Date;
}

export interface ILike extends mongoose.Document {
  wallet: string;
  createdAt: Date;
}

export interface IVideo extends mongoose.Document {
  uploader: string; // wallet address
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  likes: ILike[];
  comments: IComment[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
}, {
  timestamps: true,
});

const LikeSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
}, {
  timestamps: true,
});

const VideoSchema = new mongoose.Schema<IVideo>({
  uploader: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  publicId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  secureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [LikeSchema],
  comments: [CommentSchema],
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
VideoSchema.index({ uploader: 1 });
VideoSchema.index({ status: 1 });
VideoSchema.index({ uploadedAt: -1 });
VideoSchema.index({ 'likes.wallet': 1 });
VideoSchema.index({ views: -1 });

// Compound indexes for complex queries
VideoSchema.index({ status: 1, uploadedAt: -1 });
VideoSchema.index({ uploader: 1, status: 1 });

const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
