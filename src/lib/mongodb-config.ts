import mongoose from 'mongoose';

// MongoDB Atlas Change Streams Configuration
export const configureMongoDBForChangeStreams = () => {
  // Enable change streams by setting read preference
  mongoose.set('bufferCommands', false);
  
  // Configure for change streams
  const options: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    // Enable change streams
    readPreference: 'primary',
    // Ensure we can watch collections
    readConcern: new mongoose.mongo.ReadConcern('majority')
  };

  return options;
};

// Function to check if change streams are supported
export const checkChangeStreamSupport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, configureMongoDBForChangeStreams());
    
    // Test change stream capability
    const db = mongoose.connection.db;
    if (db) {
      const adminDb = db.admin();
      
      // Check if we're on a replica set (required for change streams)
      const status = await adminDb.replSetGetStatus();
      
      if (status.ok === 1) {
        console.log('✅ MongoDB Atlas supports Change Streams (Replica Set detected)');
        return true;
      } else {
        console.log('⚠️ MongoDB Atlas may not support Change Streams (Standalone detected)');
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Error checking Change Stream support:', error);
    return false;
  }
};

// Export the configuration
export default configureMongoDBForChangeStreams;
