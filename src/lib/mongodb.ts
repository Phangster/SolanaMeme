import mongoose from 'mongoose';
import { configureMongoDBForChangeStreams } from './mongodb-config';

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
    // Use Change Streams configuration
    const options = configureMongoDBForChangeStreams();
    
    await mongoose.connect(MONGODB_URI, options);

    isConnected = true;
    console.log('✅ MongoDB connected successfully with Change Streams support');

    // Test change stream capability
    try {
      const db = mongoose.connection.db;
      if (db) {
        const adminDb = db.admin();
        const status = await adminDb.replSetGetStatus();
        
        if (status.ok === 1) {
          console.log('🚀 Change Streams are fully supported!');
        } else {
          console.log('⚠️ Change Streams may have limited support');
        }
      }
    } catch (error) {
      console.log('ℹ️ Change Streams support check skipped:', error instanceof Error ? error.message : 'Unknown error');
    }

    return mongoose;
  } catch {
    console.error('Failed to connect to MongoDB');
    return false;
  }
}

export default dbConnect;
