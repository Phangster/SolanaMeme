# 🐱 YAOME - Real-Time Click Counter Game

A **Popcat-style click counter game** built with Next.js, MongoDB Atlas, and real-time updates using **WebSockets with manual triggers**. Compete with players worldwide in real-time!

## ✨ Features

- **🎯 Real-Time Clicking**: Click the Yao Ming Face image to compete
- **🌍 Country Detection**: Automatic country detection via IP geolocation
- **📊 Live Leaderboard**: Real-time global leaderboard with country flags
- **⚡ Zero Latency**: WebSocket updates triggered immediately after clicks
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS
- **🚀 Production Ready**: Deployable on Vercel with MongoDB Atlas
- **🔌 Any MongoDB Cluster**: Works with M0, M2, M5, M4+ clusters

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas (any cluster type)
- **Real-Time**: Socket.IO WebSockets with manual triggers
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (any cluster type: M0, M2, M5, M4+, etc.)
- Vercel account (for deployment)

### 1. Clone & Install
```bash
git clone <your-repo>
cd solana-meme
npm install
```

### 2. Environment Setup
Create `.env`:
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority

# WebSocket Server Configuration
WEBSOCKET_PORT=3001
WEBSOCKET_URL=http://localhost:3001
```

### 3. Run Both Servers
```bash
# Run both Next.js and WebSocket server simultaneously
npm run dev:full
```

**Or run separately:**
```bash
# Terminal 1: WebSocket Server
npm run websocket

# Terminal 2: Next.js App
npm run dev
```

Visit `http://localhost:3000` and start clicking! 🎯

## 🎮 How to Play

1. **Load the Game**: Your country is automatically detected
2. **Click the Image**: Click the Yao Ming Face to increment your counter
3. **Watch Live**: See your clicks update in real-time
4. **Compete Globally**: View the live leaderboard below
5. **Batch Updates**: Clicks are sent to the server every 5 seconds

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── clicks/route.ts          # POST - Receives user clicks
│   │   └── leaderboard/route.ts     # GET - Fallback leaderboard data
│   ├── page.tsx                     # Main page
│   └── not-found.tsx                # 404 page
├── components/
│   ├── ClickGame.tsx                # Main game component
│   ├── Leaderboard.tsx              # Accordion-style leaderboard
│   └── YaoMe.tsx                    # Game wrapper
├── hooks/
│   ├── useClickCounter.ts           # Click logic & WebSocket updates
│   └── useCountryDetection.ts       # Country detection
├── lib/
│   └── mongodb.ts                   # Database connection
└── models/
    └── CountryClicks.ts             # MongoDB schema

server.js                              # WebSocket server (standalone)
```

## 🔌 API Endpoints

### `POST /api/clicks`
Receives batched clicks from users and triggers WebSocket broadcast.

**Request Body:**
```json
{
  "country": "US",
  "clicks": 25
}
```

**Response:**
```json
{
  "success": true,
  "country": "US",
  "clicks": 1250,
  "message": "Successfully updated clicks for US",
  "realtime": "WebSocket broadcast triggered"
}
```

### `GET /api/leaderboard`
Returns top 20 countries sorted by clicks (fallback endpoint).

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "country": "US",
      "clicks": 1250,
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### WebSocket Server Endpoints
- **Port**: 3001
- **Health Check**: `GET http://localhost:3001/health`
- **Trigger Broadcast**: `POST http://localhost:3001/broadcast`

## 🗄️ Database Schema

### Collection: `country_clicks`

```typescript
interface ICountryClicks {
  country: string;        // Country code (e.g., "US", "SG")
  clicks: number;         // Total clicks for that country
  updatedAt: Date;        // Last update timestamp
}
```

**Indexes:**
- `country` (unique, required)
- `clicks` (for sorting leaderboard)

## 🚀 Real-Time Architecture

### WebSockets with Manual Triggers
- **Zero Latency**: Updates happen instantly when clicks are processed
- **Event-Driven**: WebSocket broadcasts triggered after database updates
- **Efficient**: No polling intervals needed
- **Scalable**: Handles multiple concurrent users efficiently
- **Universal**: Works with ANY MongoDB Atlas cluster type

### Update Flow
```
User Clicks → /api/clicks → Database Update → HTTP Request to WebSocket Server → Broadcast to All Clients → Instant Update
```

### Benefits Over Change Streams
- ✅ **Works with ANY cluster**: M0, M2, M5, M4+, etc.
- ✅ **Simpler Setup**: No complex database configuration
- ✅ **More Reliable**: Manual control over when updates happen
- ✅ **Easier Debugging**: Clear flow of data
- ✅ **Better Performance**: No database watching overhead

## 🌐 Country Detection

- **API**: `https://ipapi.co/json/`
- **Fallback**: "Unknown" if detection fails
- **Privacy**: Only country code, no personal data

## 🎨 UI Components

### ClickGame
- Main game interface
- Click counter display
- Yao Ming Face image (clickable)
- Country detection display

### Leaderboard
- Accordion-style design
- Sticky to bottom of page
- Shows top country and user's country
- Real-time updates via WebSockets

## 🚀 Deployment

### Vercel (Frontend) + WebSocket Server (Backend)

Your app has two parts that need to be deployed separately:

#### **Part 1: Deploy WebSocket Server (Backend)**

Choose one of these platforms for your WebSocket server:

##### **Option A: Railway (Recommended)**
1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → Deploy from GitHub
4. **Select your repository**
5. **Set Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
   WEBSOCKET_PORT=3001
   ```
6. **Deploy** - Railway will automatically run `npm run websocket`
7. **Copy the URL** (e.g., `https://your-app.railway.app`)

##### **Option B: Render**
1. **Go to [Render](https://render.com)**
2. **Sign up/Login** with GitHub
3. **New Web Service** → Connect your repository
4. **Configure**:
   - **Name**: `yaome-websocket`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run websocket`
   - **Environment Variables**: Add `MONGODB_URI`
5. **Deploy** and copy the URL

##### **Option C: Heroku**
1. **Go to [Heroku](https://heroku.com)**
2. **Create New App**
3. **Connect GitHub repository**
4. **Set Environment Variables** in Settings
5. **Deploy** and copy the URL

#### **Part 2: Deploy Next.js App (Frontend) to Vercel**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Go to [Vercel](https://vercel.com)**
3. **Import Project** → Select your GitHub repository
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Environment Variables** (Add these in Vercel dashboard):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
   WEBSOCKET_URL=https://your-websocket-server.com
   ```

6. **Deploy** → Vercel will build and deploy automatically

#### **Part 3: Update WebSocket URL**

After both deployments are complete:

1. **Go back to Vercel dashboard**
2. **Environment Variables** → Edit `WEBSOCKET_URL`
3. **Set to your deployed WebSocket server URL**:
   ```env
   WEBSOCKET_URL=https://your-app.railway.app
   ```
4. **Redeploy** (Vercel will automatically redeploy with new env vars)

### Environment Variables for Production

#### **Frontend (Vercel)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
WEBSOCKET_URL=https://your-websocket-server.com
```

#### **Backend (WebSocket Server)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
WEBSOCKET_PORT=3001
```

### Production Checklist

- ✅ **WebSocket server deployed** and accessible
- ✅ **Next.js app deployed** to Vercel
- ✅ **Environment variables set** in both platforms
- ✅ **MongoDB Atlas** connection string updated
- ✅ **WebSocket URL** points to production server
- ✅ **Domain configured** (optional, Vercel provides one)

### Custom Domain (Optional)

1. **In Vercel**: Go to Domains → Add your custom domain
2. **In WebSocket platform**: Configure custom domain if supported
3. **Update DNS**: Point your domain to Vercel
4. **Update environment variables** with custom domains

### Monitoring & Maintenance

#### **Vercel Dashboard**
- **Analytics**: Page views, performance metrics
- **Functions**: API route performance
- **Deployments**: Automatic deployments on git push

#### **WebSocket Server Platform**
- **Logs**: Monitor server performance
- **Uptime**: Ensure server stays running
- **Scaling**: Auto-scale based on demand

### Troubleshooting Production Issues

#### **WebSocket Connection Fails**
- **Check URL**: Verify `WEBSOCKET_URL` in Vercel
- **CORS**: Ensure WebSocket server allows your Vercel domain
- **Firewall**: Check if platform blocks WebSocket connections

#### **MongoDB Connection Issues**
- **IP Whitelist**: Add Vercel's IPs to MongoDB Atlas
- **Connection String**: Verify production MongoDB URI
- **Network**: Check if MongoDB Atlas is accessible

#### **Performance Issues**
- **Vercel Edge**: Deploy to edge locations for better performance
- **WebSocket Scaling**: Ensure backend can handle user load
- **Database**: Monitor MongoDB Atlas performance

### Cost Optimization

#### **Vercel (Frontend)**
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for team projects
- **Enterprise**: Custom pricing for large scale

#### **WebSocket Server**
- **Railway**: Pay-per-use, starts at ~$5/month
- **Render**: Free tier available, then $7/month
- **Heroku**: Free tier discontinued, starts at $7/month

#### **MongoDB Atlas**
- **M0 (Free)**: 512MB storage, shared RAM
- **M2**: $9/month, 2GB storage
- **M5**: $25/month, 5GB storage

### Security Considerations

- **Environment Variables**: Never commit `.env.local` to git
- **MongoDB Atlas**: Use strong passwords, enable 2FA
- **CORS**: Restrict WebSocket origins in production
- **Rate Limiting**: Implement API rate limiting
- **HTTPS**: Always use HTTPS in production

### Backup & Recovery

- **Database**: MongoDB Atlas provides automatic backups
- **Code**: GitHub serves as your code backup
- **Environment**: Document all environment variables
- **Deployment**: Vercel maintains deployment history

## 🔧 Customization

### Change Update Frequency
Modify the batch interval in `useClickCounter.ts`:
```typescript
const { handleClick } = useClickCounter({ country, batchInterval: 3000 }); // 3 seconds
```

### Modify Leaderboard Size
Change the limit in API routes:
```typescript
.limit(20) // Show top 20 countries
```

### Add New Features
- **User Accounts**: Add authentication
- **Personal Stats**: Track individual user progress
- **Achievements**: Unlockable milestones
- **Social Features**: Share scores on social media

## 🐛 Troubleshooting

### WebSocket Server Not Starting
- **Check Port**: Ensure port 3001 is available
- **Environment Variables**: Verify `MONGODB_URI` is set
- **Dependencies**: Run `npm install` to ensure all packages are installed

### Real-Time Updates Not Working
- **Check WebSocket Server**: Ensure it's running on port 3001
- **Browser Console**: Look for WebSocket connection errors
- **Network Issues**: Ensure stable internet connection

### MongoDB Connection Issues
- **Connection String**: Verify `MONGODB_URI` format
- **IP Whitelist**: Ensure your IP is whitelisted in MongoDB Atlas
- **Credentials**: Check username/password in connection string

### Performance Issues
- **Database Indexes**: Ensure proper indexing on `country` and `clicks`
- **Connection Pool**: MongoDB connection pooling is configured
- **WebSocket Limits**: Monitor connected client count

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Socket.IO** for reliable WebSocket implementation
- **Next.js** for the amazing framework
- **MongoDB Atlas** for cloud database
- **Tailwind CSS** for beautiful styling
- **ipapi.co** for country detection

---

**Ready to click? Start competing with the world! 🐱✨**
