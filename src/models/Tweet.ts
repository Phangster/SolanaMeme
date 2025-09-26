import mongoose, { Document, Schema } from 'mongoose';

export interface ITweetConfig extends Document {
  urls: string[];
  updatedAt: Date;
}

const TweetConfigSchema = new Schema<ITweetConfig>({
  urls: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

export default mongoose.models.TweetConfig || mongoose.model<ITweetConfig>('TweetConfig', TweetConfigSchema);
