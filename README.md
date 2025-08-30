# 🐱 YaoMe - Popcat-Style Click Counter Game

A modern, real-time click counter game built with **Next.js**, **MongoDB Atlas**, and **WebSockets**. Click the Yao Ming Face meme image to compete with players worldwide in real-time!

## ✨ Features

- **🎯 Real-Time Updates**: WebSocket-powered instant leaderboard updates
- **🌍 Global Competition**: Compete with players from around the world
- **🚀 Fast Response**: 500ms click batching for smooth gameplay
- **📱 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **🏆 Live Leaderboard**: See rankings update in real-time
- **🎨 Meme Integration**: Yao Ming Face meme with click animations
- **🌐 Country Detection**: Automatic country detection via IP geolocation
- **📊 Click Analytics**: Track your clicks and global statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **Real-Time**: Socket.IO WebSockets
- **Deployment**: Vercel (Frontend) + Railway/Render/Heroku (WebSocket Server)
- **Country API**: ipapi.co for geolocation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### 1. Clone & Install
```bash
git clone <your-repo>
cd solana-meme
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority

# WebSocket Server Configuration
WEBSOCKET_PORT=3001
WEBSOCKET_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001

# Production Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start Development
```bash
# Terminal 1: Start WebSocket server
npm run websocket

# Terminal 2: Start Next.js frontend
npm run dev

# Or run both simultaneously
npm run dev:full
```

### 4. Open Your Browser
Navigate to `http://localhost:3000` and start clicking! 🐱

## 🎮 How to Play

1. **Load the Game**: Your country is automatically detected
2. **Click the Image**: Click the Yao Ming Face meme to count clicks
3. **Watch the Animation**: See the image switch between left/right versions
4. **Compete Globally**: Your clicks are added to your country's total
5. **Check Leaderboard**: View real-time rankings at the bottom of the page
6. **Expand Details**: Click the leaderboard header to see full rankings

## 🏗️ Project Structure

```
solana-meme/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── clicks/        # POST /api/clicks
│   │   │   ├── leaderboard/   # GET /api/leaderboard
│   │   │   ├── test-env/      # Environment test endpoint
│   │   │   └── test-websocket # WebSocket test endpoint
│   │   ├── page.tsx           # Main page
│   │   └── not-found.tsx      # 404 page
│   ├── components/             # React Components
│   │   ├── ClickGame.tsx      # Main game component
│   │   ├── Leaderboard.tsx    # Leaderboard component
│   │   └── YaoMe.tsx          # Game wrapper
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useClickCounter.ts # Click logic & WebSocket
│   │   └── useCountryDetection.ts # Country detection
│   └── lib/                    # Utilities
│       ├── mongodb.ts          # Database connection
│       └── mongodb-config.ts   # MongoDB configuration
├── server.js                   # Standalone WebSocket server
├── public/                     # Static assets
│   ├── ym-left.png            # Yao Ming Face (left)
│   └── ym-right.png           # Yao Ming Face (right)
├── package.json                # Dependencies & scripts
├── env.example                 # Environment variables template
└── README.md                   # This file
```

## 🔌 API Endpoints

### POST `/api/clicks`
Increment country clicks and trigger real-time updates.

**Request Body:**
```json
{
  "country": "US",
  "clicks": 5
}
```

**Response:**
```json
{
  "success": true,
  "country": "US",
  "clicks": 1234,
  "message": "Successfully updated clicks for US",
  "realtime": "WebSocket broadcast triggered"
}
```

### GET `/api/leaderboard`
Get top 20 countries sorted by clicks.

**Response:**
```json
[
  {
    "country": "US",
    "clicks": 1234,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/api/test-env`
Test environment variable loading.

### GET `/api/test-websocket`
Test WebSocket server connectivity and broadcast functionality.

## 🗄️ Database Schema

### Collection: `country_clicks`

```typescript
interface CountryClicks {
  country: string;      // Unique country code (e.g., "US", "SG")
  clicks: number;       // Total clicks for that country
  updatedAt: Date;      // Last update timestamp
}
```

**Indexes:**
- `country` (unique)
- `clicks` (for sorting)

## ⚡ Real-Time Architecture

### WebSocket Flow
```
User Click → 500ms Batch → API Call → Database Update → WebSocket Broadcast → Real-time Update
```

### Components
1. **Frontend**: React hooks with Socket.IO client
2. **Next.js API**: Handles clicks and triggers WebSocket broadcasts
3. **WebSocket Server**: Standalone Node.js server with Socket.IO
4. **Database**: MongoDB Atlas with real-time change detection

### Performance
- **Click Batching**: 500ms intervals (configurable)
- **Update Latency**: ~500ms end-to-end
- **WebSocket**: Persistent connections for instant updates
- **Database**: Optimized queries with proper indexing

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### WebSocket Server
Deploy to any Node.js platform:
- **Railway**: Easy deployment with automatic scaling
- **Render**: Free tier available, good performance
- **Heroku**: Classic platform, reliable

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ | - |
| `WEBSOCKET_PORT` | WebSocket server port | ❌ | 3001 |
| `WEBSOCKET_URL` | WebSocket server URL (Next.js API) | ❌ | http://localhost:3001 |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket URL (Frontend) | ✅ | http://localhost:3001 |
| `NODE_ENV` | Environment mode | ❌ | development |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ | http://localhost:3000 |

### Customization

#### Click Batching
Adjust update frequency in `.env.local`:
```env
BATCH_INTERVAL=500  # 0.5 seconds (default)
BATCH_INTERVAL=100  # 0.1 seconds (super fast)
BATCH_INTERVAL=1000 # 1 second (slower)
```

#### Leaderboard Size
Modify the limit in API routes:
```typescript
// In /api/leaderboard/route.ts
.limit(20) // Change to show more/fewer countries
```

## 🧪 Testing

### Test Environment Variables
```bash
curl http://localhost:3000/api/test-env
```

### Test WebSocket Connection
```bash
curl http://localhost:3000/api/test-websocket
```

### Test Click API
```bash
curl -X POST http://localhost:3000/api/clicks \
  -H "Content-Type: application/json" \
  -d '{"country":"US","clicks":5}'
```

## 🐛 Troubleshooting

### Common Issues

#### WebSocket Connection Failed
- Check `NEXT_PUBLIC_WEBSOCKET_URL` in `.env.local`
- Ensure WebSocket server is running (`npm run websocket`)
- Verify CORS settings in `server.js`

#### Database Connection Error
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure IP whitelist includes your IP

#### Real-time Updates Not Working
- Check WebSocket server logs
- Verify environment variables are loaded
- Test with `/api/test-websocket` endpoint

### Debug Mode
Enable detailed logging in `server.js`:
```javascript
// Add to server.js for debugging
console.log('🔍 Debug mode enabled');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Yao Ming Face Meme**: The iconic meme that inspired this game
- **Next.js Team**: For the amazing React framework
- **Socket.IO**: For real-time WebSocket capabilities
- **MongoDB Atlas**: For the cloud database service
- **Tailwind CSS**: For the beautiful styling framework

---

**Made with ❤️ and lots of clicks! 🐱✨**

*Click the Yao Ming Face to start your global domination!*
