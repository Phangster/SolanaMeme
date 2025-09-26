import mongoose from 'mongoose';

// Note: Comments are now stored in a separate Comment model
// and referenced by ID for better performance and scalability

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
  views: number;
  createdAt: Date;
  updatedAt: Date;
}


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
