import mongoose from 'mongoose';

export interface IUploadedVideo {
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  views: number;
}

export interface IUser extends mongoose.Document {
  wallet: string;
  clicks: number;
  uploadedVideos: IUploadedVideo[];
  profilePicture?: {
    publicId: string;
    secureUrl: string;
    uploadedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UploadedVideoSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
  },
  secureUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const UserSchema = new mongoose.Schema<IUser>({
  wallet: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0,
  },
  uploadedVideos: [UploadedVideoSchema],
  profilePicture: {
    publicId: {
      type: String,
      required: false,
    },
    secureUrl: {
      type: String,
      required: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Index for better query performance
// Note: wallet field already has unique: true which creates an index
UserSchema.index({ clicks: -1 }); // For leaderboard queries

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
