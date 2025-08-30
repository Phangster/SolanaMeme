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

## 🚀 Quick Deploy

**Frontend**: Deploy to **Vercel** (Next.js optimized)  
**Backend**: Deploy to **Railway** (WebSocket server)  
**Database**: **MongoDB Atlas** (free tier available)

*See [Deployment Guide](#-deployment) below for complete instructions.*

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

### Frontend (Vercel) 🌐

**Vercel** is the recommended platform for Next.js apps with automatic deployments and global CDN.

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### 2. Deploy to Vercel
1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub account
3. **Import Project** → Select your `solana-meme` repository
4. **Configure Project** (auto-detected):
   - Framework Preset: Next.js ✅
   - Root Directory: `./` ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
5. **Set Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
   NEXT_PUBLIC_WEBSOCKET_URL=https://your-websocket-server.com
   ```
6. **Deploy** → Vercel builds and deploys automatically
7. **Copy your app URL** (e.g., `https://your-app.vercel.app`)

### WebSocket Backend (Railway) 🔌

**Railway** is the recommended platform for your WebSocket server - simple, reliable, and cost-effective.

#### Why Railway?
- ✅ **Easy Setup**: Connect GitHub, set env vars, deploy
- ✅ **Automatic Scaling**: Handles traffic spikes automatically
- ✅ **Free Tier**: Available for testing and development
- ✅ **Cost Effective**: Pay-per-use, starts at ~$5/month
- ✅ **Reliable**: 99.9% uptime SLA

#### Deploy to Railway
1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login** with GitHub account
3. **Create New Project** → Deploy from GitHub
4. **Select your repository**: `solana-meme`
5. **Set Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
   NODE_ENV=production
   ```
6. **Deploy Settings**:
   - Build Command: `npm install`
   - Start Command: `npm run websocket`
7. **Deploy** → Railway handles everything automatically
8. **Copy the URL** (e.g., `https://your-app.railway.app`)

### Complete Deployment Flow 🔄

1. **Deploy WebSocket Backend to Railway**
2. **Deploy Frontend to Vercel**
3. **Update WebSocket URL** in Vercel environment variables
4. **Test real-time functionality**

## 🧪 Testing Production Deployment

### 1. Test WebSocket Server Health
```bash
curl https://your-websocket-server.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "connectedClients": 0,
  "mongodb": "connected"
}
```

### 2. Test WebSocket Broadcast
```bash
curl -X POST https://your-websocket-server.com/broadcast \
  -H "Content-Type: application/json" \
  -d '{"action":"updateLeaderboard"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Broadcast triggered"
}
```

### 3. Test Frontend Connection
1. **Open your Vercel app** in browser
2. **Open Developer Tools** → Console
3. **Look for WebSocket connection logs**:
   ```
   🔌 Connecting to WebSocket server: https://your-websocket-server.com
   ✅ WebSocket connected to: https://your-websocket-server.com
   ```

### 4. Test Real-time Updates
1. **Open app in two different browsers**
2. **Click in one browser**
3. **Watch leaderboard update in real-time** in the other browser

## 🚨 Troubleshooting Production Issues

### WebSocket Connection Fails

#### Symptoms
- Console shows "WebSocket connection failed"
- Leaderboard doesn't update in real-time
- Error: "Failed to fetch"

#### Solutions
1. **Check URL**: Verify `NEXT_PUBLIC_WEBSOCKET_URL` in Vercel
2. **CORS Issues**: Ensure WebSocket server allows your Vercel domain
3. **HTTPS**: Ensure WebSocket server uses HTTPS in production
4. **Firewall**: Check if platform blocks WebSocket connections

#### Debug Steps
```bash
# Test WebSocket server health
curl https://your-websocket-server.com/health

# Check if server is accessible
curl -I https://your-websocket-server.com

# Test from different location
curl https://your-websocket-server.com/health
```

### MongoDB Connection Issues

#### Symptoms
- WebSocket server logs show "MongoDB connection failed"
- Health check shows "mongodb: disconnected"
- Database operations fail

#### Solutions
1. **IP Whitelist**: Add Vercel's IPs to MongoDB Atlas
2. **Connection String**: Verify production MongoDB URI
3. **Network Access**: Check if MongoDB Atlas is accessible
4. **Credentials**: Verify username/password

#### Debug Steps
```bash
# Test MongoDB connection locally
MONGODB_URI="your-production-uri" node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Failed:', err.message));
"
```

### Real-time Updates Not Working

#### Symptoms
- Clicks register but leaderboard doesn't update
- WebSocket connects but no data received
- Manual refresh shows updates

#### Solutions
1. **Check Broadcast**: Verify `/broadcast` endpoint works
2. **WebSocket Events**: Ensure `leaderboardUpdate` events are emitted
3. **Client Connection**: Verify clients are connected to WebSocket
4. **Database Triggers**: Check if database updates trigger broadcasts

#### Debug Steps
```bash
# Test broadcast functionality
curl -X POST https://your-websocket-server.com/broadcast \
  -H "Content-Type: application/json" \
  -d '{"action":"updateLeaderboard"}'

# Check WebSocket server logs for broadcast events
```

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- **Analytics**: Page views, performance metrics
- **Functions**: API route performance
- **Deployments**: Automatic deployments on git push
- **Logs**: Function execution logs

### Railway Dashboard
- **Logs**: Real-time logs in dashboard
- **Metrics**: CPU, memory, network usage
- **Scaling**: Automatic scaling based on demand
- **Uptime**: 99.9% SLA

### MongoDB Atlas
- **Performance**: Query performance, connection count
- **Storage**: Database size, index usage
- **Backups**: Automatic backup status
- **Alerts**: Set up monitoring alerts

## 💰 Cost Optimization

### Frontend (Vercel)
- **Hobby Plan**: Free for personal projects
  - 100GB bandwidth/month
  - 100 serverless function executions/day
  - Automatic deployments
- **Pro Plan**: $20/month for team projects
  - Unlimited bandwidth
  - Unlimited function executions
  - Team collaboration

### WebSocket Server (Railway)
- **Pay-per-use**: Starts at ~$5/month
- **Scaling**: Automatic based on usage
- **Free tier**: Available for testing

### MongoDB Atlas
- **M0 (Free)**: 512MB storage, shared RAM
- **M2**: $9/month, 2GB storage, 2GB RAM
- **M5**: $25/month, 5GB storage, 5GB RAM
- **M10**: $57/month, 10GB storage, 10GB RAM

## 🔒 Security Considerations

### Environment Variables
- ✅ **Never commit** `.env.local` to git
- ✅ **Use Vercel's** environment variable system
- ✅ **Rotate secrets** regularly
- ✅ **Limit access** to production environment variables

### MongoDB Atlas
- ✅ **Strong passwords** (12+ characters, mixed case, symbols)
- ✅ **Enable 2FA** on your account
- ✅ **IP whitelist** only necessary IPs
- ✅ **Database user** with minimal required permissions

### CORS Configuration
- ✅ **Restrict origins** in production
- ✅ **Use HTTPS** for all connections
- ✅ **Validate requests** on server side
- ✅ **Rate limiting** for API endpoints

### WebSocket Security
- ✅ **HTTPS/WSS** in production
- ✅ **Origin validation** for connections
- ✅ **Authentication** (if implementing user accounts)
- ✅ **Input validation** for all messages

## 🔄 Backup & Recovery

### Database Backups
- **MongoDB Atlas**: Automatic daily backups
- **Retention**: 7 days for M0, 30 days for paid plans
- **Point-in-time**: Restore to any moment in retention period
- **Export**: Manual exports to JSON/CSV

### Code Backup
- **GitHub**: Primary code repository
- **Vercel**: Automatic deployment history
- **Environment**: Document all environment variables
- **Configuration**: Save platform-specific settings

### Recovery Procedures

#### Database Recovery
1. **Access MongoDB Atlas** dashboard
2. **Go to Backup** section
3. **Select restore point** from timeline
4. **Choose collections** to restore
5. **Execute restore** operation

#### Application Recovery
1. **Redeploy from GitHub** (automatic with Vercel)
2. **Verify environment variables** are set
3. **Test WebSocket connection**
4. **Verify real-time updates** working

## 🚀 Performance Optimization

### Frontend (Vercel)
- **Edge Functions**: Deploy to edge locations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **CDN**: Global content delivery

### WebSocket Server (Railway)
- **Connection Pooling**: Efficient client management
- **Message Batching**: Group updates when possible
- **Error Handling**: Graceful degradation
- **Monitoring**: Track connection count and performance

### Database
- **Indexes**: Ensure proper indexing on `country` and `clicks`
- **Connection Pooling**: Optimize MongoDB connections
- **Query Optimization**: Use efficient aggregation pipelines
- **Monitoring**: Track slow queries and performance

## 🎯 Next Steps After Deployment

### 1. Monitor Performance
- **Set up alerts** for downtime
- **Track user engagement** metrics
- **Monitor database performance**
- **Watch WebSocket connection counts**

### 2. Scale as Needed
- **Upgrade MongoDB Atlas** cluster if needed
- **Scale WebSocket server** based on user load
- **Optimize frontend** performance
- **Add CDN** for global users

### 3. Feature Enhancements
- **User accounts** and personal stats
- **Achievement system** and milestones
- **Social features** and sharing
- **Mobile app** development

### 4. Marketing & Growth
- **Share on social media**
- **Submit to game directories**
- **Create promotional content**
- **Gather user feedback**

## 🎉 Congratulations!

You've successfully deployed your YaoMe click counter game to production! 

### What You've Accomplished
- ✅ **Full-stack application** deployed
- ✅ **Real-time WebSocket** server running
- ✅ **MongoDB Atlas** database connected
- ✅ **Vercel frontend** live and accessible
- ✅ **Production environment** configured
- ✅ **Real-time updates** working globally

### Your Game is Now Live! 🐱✨
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-websocket-server.com`
- **Database**: MongoDB Atlas cluster

### Start Competing! 🏆
1. **Share your game** with friends
2. **Watch the leaderboard** grow
3. **Compete globally** in real-time
4. **Monitor performance** and scale

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

## 🧪 Local Testing

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

## 🐛 Local Troubleshooting

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
