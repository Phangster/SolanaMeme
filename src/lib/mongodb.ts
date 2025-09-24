import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return mongoose;
  }

  try {
    // Basic MongoDB connection without change streams
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    return mongoose;
  } catch {
    console.error('Failed to connect to MongoDB');
    return false;
  }
}

export default dbConnect;
