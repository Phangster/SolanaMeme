const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (error) {
  console.log('⚠️ .env not found, using system environment variables');
}

// Production configuration
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction 
  ? [process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);

// Define Mongoose model once (avoid recompilation errors)
const CountryClicksSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  clicks: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
CountryClicksSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const CountryClicks = mongoose.model('CountryClicks', CountryClicksSchema);

// MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Create HTTP server
const httpServer = createServer();

// Add HTTP endpoint for triggering broadcasts
httpServer.on('request', (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      environment: isProduction ? 'production' : 'development',
      timestamp: new Date().toISOString(),
      connectedClients: connectedClients.size,
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }));
  } else if (req.method === 'POST' && req.url === '/broadcast') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.action === 'updateLeaderboard') {
          await broadcastLeaderboardUpdate();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Broadcast triggered' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid action' }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Create Socket.IO server with production-ready CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Fallback for production
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store connected clients
const connectedClients = new Map();

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id, 'from:', socket.handshake.headers.origin);
  
  // Store client info
  connectedClients.set(socket.id, { socket });

  // Send initial leaderboard
  sendInitialLeaderboard(socket);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });

  // Handle ping
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Function to send initial leaderboard
const sendInitialLeaderboard = async (socket) => {
  try {
    const leaderboard = await CountryClicks.find({})
      .sort({ clicks: -1 })
      .limit(20)
      .select('country clicks updatedAt')
      .lean();

    socket.emit('leaderboardUpdate', {
      type: 'initial',
      leaderboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending initial leaderboard:', error);
    socket.emit('error', { message: 'Failed to fetch leaderboard' });
  }
};

// Function to broadcast leaderboard updates to all clients
const broadcastLeaderboardUpdate = async () => {
  try {
    const leaderboard = await CountryClicks.find({})
      .sort({ clicks: -1 })
      .limit(20)
      .select('country clicks updatedAt')
      .lean();

    const updateData = {
      type: 'update',
      leaderboard,
      timestamp: new Date().toISOString()
    };

    // Broadcast to all connected clients
    io.emit('leaderboardUpdate', updateData);
    
    console.log('✅ Leaderboard update broadcasted to all clients');
    
  } catch (error) {
    console.error('Error broadcasting leaderboard update:', error);
  }
};

// Make broadcast function available globally
global.broadcastLeaderboardUpdate = broadcastLeaderboardUpdate;

// Start server
const PORT = process.env.WEBSOCKET_PORT || 3001;

const startServer = async () => {
  await connectDB();
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 WebSocket server running on port ${PORT}`);
    console.log(`📡 Ready for real-time connections!`);
    console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
    console.log(`🔒 Production mode: ${isProduction ? 'Enabled' : 'Disabled'}`);
  });
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Shutting down WebSocket server...');
  httpServer.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
