import mongoose from 'mongoose';

export interface ICountryClicks {
  country: string;
  clicks: number;
  updatedAt: Date;
}

const CountryClicksSchema = new mongoose.Schema<ICountryClicks>({
  country: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
CountryClicksSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.CountryClicks || mongoose.model<ICountryClicks>('CountryClicks', CountryClicksSchema);
