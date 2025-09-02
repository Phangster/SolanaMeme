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
- **Video Hosting**: Cloudinary (for video content)
- **Deployment**: Vercel (Frontend) + Railway/Render/Heroku (WebSocket Server)
- **Country API**: ipapi.co for geolocation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account (for video hosting)
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

# Cloudinary Configuration (for video hosting)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
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

## 📹 Cloudinary Video Integration

This project uses **Cloudinary** for hosting and delivering video content with automatic optimization and global CDN.

### 🎯 Why Cloudinary?

- **🚀 Performance**: Global CDN with automatic optimization
- **📱 Responsive**: Automatic format selection (MP4, WebM)
- **🔧 Easy Integration**: Simple URL-based transformations
- **💰 Cost-Effective**: Free tier available with generous limits
- **🌐 Global Delivery**: Fast video loading worldwide

### 📋 Cloudinary Setup Steps

#### 1. Create Cloudinary Account
1. **Go to [cloudinary.com](https://cloudinary.com)**
2. **Sign up for a free account**
3. **Verify your email address**

#### 2. Get Your Cloud Name
1. **Go to your [Cloudinary Dashboard](https://cloudinary.com/console)**
2. **Copy your Cloud Name** from the dashboard
3. **This is your unique identifier** (e.g., `phangster`)

#### 3. Upload Your Videos
1. **Go to [Media Library](https://cloudinary.com/console/media_library)**
2. **Upload your video files** (MP4 recommended)
3. **Note the Public IDs** of your uploaded videos

#### 4. Configure Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

#### 5. Update Video URLs in Code
In `src/app/shorts/page.tsx`, update your video arrays:

```typescript
const featuredVideo = {
  title: 'Your Video Title',
  description: 'Your video description',
  url: 'https://res.cloudinary.com/your_cloud_name/video/upload/f_auto,q_auto/your_public_id.mp4',
};

const communityVideos = [
  {
    title: 'Community Video 1',
    contributor: '@username',
    url: 'https://res.cloudinary.com/your_cloud_name/video/upload/f_auto,q_auto/your_public_id.mp4',
  },
  // ... more videos
];
```

### 🎬 Video URL Format

#### Direct Video URL (Recommended)
```
https://res.cloudinary.com/{cloud_name}/video/upload/{transformations}/{public_id}.mp4
```

**Example:**
```
https://res.cloudinary.com/phangster/video/upload/f_auto,q_auto/fbfvyesdazi9nrglrw1m.mp4
```

#### URL Parameters Explained
- `f_auto` - Automatic format selection (MP4/WebM)
- `q_auto` - Automatic quality optimization
- `w_auto` - Automatic width scaling (optional)
- `h_auto` - Automatic height scaling (optional)

### 🎮 Video Features in Your App

#### Featured Video
- **Autoplay**: Starts playing when page loads (muted for browser compliance)
- **Mute/Unmute Toggle**: Clear button to enable/disable audio
- **Loop**: Video plays continuously
- **Responsive**: Scales to fit container

#### Community Videos
- **Grid Layout**: Multiple videos in responsive grid
- **Individual Controls**: Each video has its own mute/unmute button
- **Autoplay**: All videos start playing automatically (muted)
- **Independent State**: Muting one video doesn't affect others

### 🔧 Video Optimization Tips

#### 1. File Preparation
- **Format**: Use MP4 (H.264) for best compatibility
- **Resolution**: 1920x1080 (1080p) or 1280x720 (720p)
- **Duration**: Keep videos under 30 seconds for better performance
- **File Size**: Aim for under 10MB per video

#### 2. Cloudinary Transformations
```javascript
// High quality, auto format
f_auto,q_auto

// Responsive with specific dimensions
f_auto,q_auto,w_640,h_360,c_fill

// Lower quality for faster loading
f_auto,q_eco

// Specific quality level
f_auto,q_80
```

#### 3. Performance Optimization
- **Lazy Loading**: Videos only load when scrolled into view
- **Muted Autoplay**: Complies with browser autoplay policies
- **Progressive Enhancement**: Fallback images for slow connections

### 🚀 Production Deployment

#### Vercel Environment Variables
Add to your Vercel project settings:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

#### Video URL Updates
Ensure all video URLs use your production cloud name:
```typescript
// Update all video URLs to use your cloud name
const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/${publicId}.mp4`;
```

### 📊 Cloudinary Dashboard Features

#### Media Library
- **Upload Management**: Drag & drop video uploads
- **Public ID Management**: Custom naming for your videos
- **Folder Organization**: Organize videos in folders
- **Bulk Operations**: Upload multiple videos at once

#### Analytics
- **Bandwidth Usage**: Track video delivery costs
- **View Statistics**: See how often videos are accessed
- **Performance Metrics**: Monitor loading times
- **Usage Alerts**: Get notified of usage limits

#### Transformations
- **Real-time Preview**: Test transformations before implementing
- **URL Builder**: Visual tool for building transformation URLs
- **Preset Creation**: Save common transformation sets
- **Quality Optimization**: Automatic quality adjustments

### 💰 Cloudinary Pricing

#### Free Tier
- **25 GB storage**
- **25 GB bandwidth/month**
- **25,000 transformations/month**
- **Perfect for development and small projects**

#### Paid Plans
- **Plus**: $89/month - 100 GB storage, 100 GB bandwidth
- **Advanced**: $249/month - 500 GB storage, 500 GB bandwidth
- **Enterprise**: Custom pricing for large-scale applications

### 🔒 Security Best Practices

#### 1. Access Control
- **Signed URLs**: For private video content
- **Token Authentication**: Secure video access
- **IP Restrictions**: Limit access by IP address
- **Time-based URLs**: Expiring video links

#### 2. Content Protection
- **Watermarking**: Add your logo to videos
- **Hotlink Protection**: Prevent unauthorized embedding
- **Domain Restrictions**: Limit where videos can be embedded
- **DRM Support**: For premium content protection

### 🐛 Troubleshooting

#### Common Issues

##### Videos Not Loading
- **Check Cloud Name**: Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- **Verify Public IDs**: Ensure video public IDs match exactly
- **Network Issues**: Check if Cloudinary is accessible
- **CORS Problems**: Ensure proper CORS configuration

##### Autoplay Not Working
- **Browser Policies**: Most browsers block autoplay with sound
- **Muted Requirement**: Videos must be muted for autoplay
- **User Interaction**: Some browsers require user interaction first
- **Mobile Limitations**: iOS Safari has strict autoplay policies

##### Performance Issues
- **File Size**: Large video files cause slow loading
- **Quality Settings**: Use `q_auto` for automatic optimization
- **Format Selection**: `f_auto` chooses best format for device
- **CDN Issues**: Check Cloudinary's status page

#### Debug Steps
```javascript
// Test video URL accessibility
fetch('https://res.cloudinary.com/your_cloud_name/video/upload/f_auto,q_auto/your_public_id.mp4')
  .then(response => console.log('Video accessible:', response.ok))
  .catch(error => console.error('Video error:', error));

// Check environment variable
console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
```

### 📱 Mobile Optimization

#### Responsive Video
- **Aspect Ratio**: Use `aspect-video` class for 16:9 ratio
- **Touch Controls**: Ensure video controls are touch-friendly
- **Bandwidth Awareness**: Use lower quality on mobile networks
- **Battery Optimization**: Pause videos when not visible

#### iOS Safari Considerations
- **Autoplay Restrictions**: Very limited autoplay support
- **Fullscreen Behavior**: Videos may open in fullscreen
- **Audio Policies**: Strict audio autoplay blocking
- **Touch Events**: Require user interaction for audio

### 🎯 Best Practices

#### 1. Video Content
- **Keep it Short**: 10-30 seconds for best engagement
- **High Quality**: Use good lighting and clear audio
- **Compelling Thumbnails**: First frame should be engaging
- **Consistent Branding**: Maintain visual consistency

#### 2. Technical Implementation
- **Lazy Loading**: Only load videos when needed
- **Error Handling**: Provide fallbacks for failed loads
- **Loading States**: Show spinners while videos load
- **Accessibility**: Include captions and descriptions

#### 3. Performance Monitoring
- **Track Loading Times**: Monitor video performance
- **User Engagement**: Measure video completion rates
- **Bandwidth Usage**: Monitor Cloudinary usage
- **Error Rates**: Track failed video loads

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
   FRONTEND_URL=xxxx-git-main-xxx.vercel.app
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

## 🔧 Setting Environment Variables in Vercel

### After Generating WebSocket URL in Railway

Once you have your WebSocket server running on Railway and have generated the public domain, you need to set the environment variables in Vercel:

#### 1. Go to Vercel Dashboard
1. **Visit [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Select your project** (solana-meme)
3. **Click "Settings" tab**

#### 2. Navigate to Environment Variables
1. **In the left sidebar, click "Environment Variables"**
2. **You'll see a section to add new variables**

#### 3. Add Required Environment Variables

**Add these one by one:**

##### Variable 1: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority`
- **Environment**: Production ✅, Preview ✅, Development ✅
- **Click "Add"**

##### Variable 2: NEXT_PUBLIC_WEBSOCKET_URL (CRITICAL!)
- **Name**: `NEXT_PUBLIC_WEBSOCKET_URL`
- **Value**: `https://your-app-name-production.up.railway.app` (your Railway WebSocket URL)
- **Environment**: Production ✅, Preview ✅, Development ✅
- **Click "Add"**

#### 4. Redeploy Your App
1. **After adding all environment variables**
2. **Go to "Deployments" tab**
3. **Click "Redeploy" on your latest deployment**
4. **Or push a new commit** to trigger automatic deployment

#### 5. Verify Environment Variables
1. **In "Settings" → "Environment Variables"**
2. **You should see all three variables listed**
3. **Make sure they're assigned to Production environment**

### Example Environment Variables in Vercel

```env
# Required for database connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority

# Required for frontend WebSocket connection (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_WEBSOCKET_URL=https://solanameme-production.up.railway.app
```

### ⚠️ Important Notes

- **`NEXT_PUBLIC_WEBSOCKET_URL`** is **CRITICAL** - this is what your frontend uses
- **Must start with `NEXT_PUBLIC_`** to be accessible in the browser
- **Use HTTPS URLs** from Railway (not the internal `.railway.internal` URLs)
- **Redeploy after adding variables** for changes to take effect
- **Check all environments** (Production, Preview, Development) if needed
- **Only need 2 environment variables** - MONGODB_URI and NEXT_PUBLIC_WEBSOCKET_URL

### 🔍 Testing Environment Variables

After setting variables and redeploying:

1. **Visit your Vercel app**
2. **Open Developer Tools → Console**
3. **Look for WebSocket connection logs**:
   ```
   🔌 Connecting to WebSocket server: https://solanameme-production.up.railway.app
   ✅ WebSocket connected to: https://solanameme-production.up.railway.app
   ```

If you see connection errors, double-check your `NEXT_PUBLIC_WEBSOCKET_URL` value!

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
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for video hosting | ✅ | - |
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
