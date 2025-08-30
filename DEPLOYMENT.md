# 🚀 YaoMe Game - Production Deployment Guide

Complete guide to deploy your YaoMe click counter game to production with real-time WebSocket updates.

## 📋 Deployment Overview

Your app has **two components** that need to be deployed separately:

1. **🌐 Frontend**: Next.js app deployed to **Vercel**
2. **🔌 Backend**: WebSocket server deployed to **Railway/Render/Heroku**

## 🎯 Prerequisites

- ✅ **GitHub Repository**: Code pushed to GitHub
- ✅ **MongoDB Atlas**: Database cluster set up
- ✅ **Environment Variables**: All variables documented
- ✅ **Local Testing**: App works locally with `npm run dev:full`

## 🚀 Part 1: Deploy WebSocket Server (Backend)

### Option A: Railway (Recommended) 🚂

**Railway** is the easiest platform for Node.js apps with automatic scaling.

#### 1. Setup Railway
1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login** with GitHub account
3. **Create New Project** → Deploy from GitHub

#### 2. Configure Project
1. **Select your repository**: `solana-meme`
2. **Branch**: `main` (or your default branch)
3. **Root Directory**: `./` (leave as default)

#### 3. Environment Variables
Add these in Railway dashboard:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NODE_ENV=production

# Optional (Railway sets these automatically)
WEBSOCKET_PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### 4. Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm run websocket`
- **Health Check Path**: `/health`

#### 5. Deploy
- Click **Deploy** button
- Wait for build to complete
- **Copy the URL** (e.g., `https://your-app.railway.app`)

---

### Option B: Render 🌐

**Render** offers a free tier and good performance for Node.js apps.

#### 1. Setup Render
1. **Go to [Render](https://render.com)**
2. **Sign up/Login** with GitHub account
3. **New Web Service** → Connect your repository

#### 2. Configure Service
- **Name**: `yaome-websocket`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

#### 3. Build & Deploy
- **Build Command**: `npm install`
- **Start Command**: `npm run websocket`
- **Plan**: Free (or choose paid for better performance)

#### 4. Environment Variables
Add in Render dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NODE_ENV=production
WEBSOCKET_PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### 5. Deploy
- Click **Create Web Service**
- Wait for deployment
- **Copy the URL** (e.g., `https://yaome-websocket.onrender.com`)

---

### Option C: Heroku 🦸

**Heroku** is a classic platform with reliable Node.js support.

#### 1. Setup Heroku
1. **Go to [Heroku](https://heroku.com)**
2. **Sign up/Login** with GitHub account
3. **Create New App**

#### 2. Connect Repository
1. **Deploy** tab → **GitHub**
2. **Connect** your `solana-meme` repository
3. **Enable automatic deploys** from `main` branch

#### 3. Configure Build
- **Build Command**: `npm install`
- **Start Command**: `npm run websocket`

#### 4. Environment Variables
In **Settings** → **Config Vars**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NODE_ENV=production
WEBSOCKET_PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### 5. Deploy
- Click **Deploy Branch**
- Wait for deployment
- **Copy the URL** (e.g., `https://your-app.herokuapp.com`)

---

## 🌐 Part 2: Deploy Next.js App (Frontend) to Vercel

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Setup Vercel
1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub account
3. **Import Project** → Select your `solana-meme` repository

### 3. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

### 4. Environment Variables
Add these in Vercel dashboard:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NEXT_PUBLIC_WEBSOCKET_URL=https://your-websocket-server.com

# Optional
NODE_ENV=production
WEBSOCKET_URL=https://your-websocket-server.com
```

**⚠️ Important**: `NEXT_PUBLIC_WEBSOCKET_URL` must be set to your deployed WebSocket server URL!

### 5. Deploy
- Click **Deploy** button
- Vercel will automatically build and deploy
- Wait for deployment to complete
- **Copy your app URL** (e.g., `https://your-app.vercel.app`)

---

## 🔗 Part 3: Connect Frontend & Backend

### 1. Update WebSocket URL
After both deployments are complete:

1. **Go to Vercel dashboard**
2. **Settings** → **Environment Variables**
3. **Edit** `NEXT_PUBLIC_WEBSOCKET_URL`
4. **Set to your deployed WebSocket server URL**:
   ```env
   NEXT_PUBLIC_WEBSOCKET_URL=https://your-app.railway.app
   # or
   NEXT_PUBLIC_WEBSOCKET_URL=https://yaome-websocket.onrender.com
   # or
   NEXT_PUBLIC_WEBSOCKET_URL=https://your-app.herokuapp.com
   ```

### 2. Redeploy Frontend
- Vercel will automatically redeploy with new environment variables
- Wait for redeployment to complete

---

## ✅ Production Checklist

### WebSocket Server ✅
- [ ] **Deployed** and accessible via HTTPS
- [ ] **Environment variables** set correctly
- [ ] **Health check** endpoint working (`/health`)
- [ ] **Broadcast endpoint** working (`/broadcast`)
- [ ] **MongoDB connection** established

### Frontend ✅
- [ ] **Deployed** to Vercel successfully
- [ ] **Environment variables** set in Vercel
- [ ] **WebSocket URL** points to production server
- [ ] **Build** completed without errors
- [ ] **App accessible** via Vercel URL

### Database ✅
- [ ] **MongoDB Atlas** cluster running
- [ ] **Connection string** updated for production
- [ ] **IP whitelist** includes Vercel IPs
- [ ] **Database user** has correct permissions

### Testing ✅
- [ ] **Frontend loads** without errors
- [ ] **WebSocket connects** to production server
- [ ] **Clicks register** and update database
- [ ] **Real-time updates** work across browsers
- [ ] **Leaderboard updates** in real-time

---

## 🔧 Environment Variables Reference

### Frontend (Vercel)
```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NEXT_PUBLIC_WEBSOCKET_URL=https://your-websocket-server.com

# Optional
NODE_ENV=production
WEBSOCKET_URL=https://your-websocket-server.com
```

### Backend (WebSocket Server)
```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority
NODE_ENV=production

# Optional
WEBSOCKET_PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

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

---

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

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- **Analytics**: Page views, performance metrics
- **Functions**: API route performance
- **Deployments**: Automatic deployments on git push
- **Logs**: Function execution logs

### WebSocket Server Platform

#### Railway
- **Logs**: Real-time logs in dashboard
- **Metrics**: CPU, memory, network usage
- **Scaling**: Automatic scaling based on demand
- **Uptime**: 99.9% SLA

#### Render
- **Logs**: Application logs in dashboard
- **Metrics**: Response times, error rates
- **Uptime**: 99.9% SLA
- **Scaling**: Manual scaling options

#### Heroku
- **Logs**: `heroku logs --tail`
- **Metrics**: Application metrics in dashboard
- **Scaling**: Manual dyno scaling
- **Uptime**: 99.9% SLA

### MongoDB Atlas
- **Performance**: Query performance, connection count
- **Storage**: Database size, index usage
- **Backups**: Automatic backup status
- **Alerts**: Set up monitoring alerts

---

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

### WebSocket Server

#### Railway
- **Pay-per-use**: Starts at ~$5/month
- **Scaling**: Automatic based on usage
- **Free tier**: Available for testing

#### Render
- **Free tier**: Available with limitations
- **Paid plans**: Start at $7/month
- **Scaling**: Manual scaling options

#### Heroku
- **Free tier**: Discontinued
- **Basic dyno**: $7/month
- **Standard dyno**: $25/month

### MongoDB Atlas
- **M0 (Free)**: 512MB storage, shared RAM
- **M2**: $9/month, 2GB storage, 2GB RAM
- **M5**: $25/month, 5GB storage, 5GB RAM
- **M10**: $57/month, 10GB storage, 10GB RAM

---

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

---

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

---

## 🚀 Performance Optimization

### Frontend (Vercel)
- **Edge Functions**: Deploy to edge locations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **CDN**: Global content delivery

### WebSocket Server
- **Connection Pooling**: Efficient client management
- **Message Batching**: Group updates when possible
- **Error Handling**: Graceful degradation
- **Monitoring**: Track connection count and performance

### Database
- **Indexes**: Ensure proper indexing on `country` and `clicks`
- **Connection Pooling**: Optimize MongoDB connections
- **Query Optimization**: Use efficient aggregation pipelines
- **Monitoring**: Track slow queries and performance

---

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

---

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

---

**Need help? Check the troubleshooting section or reach out to the community! 🚀**

*Happy clicking and may the best country win! 🐱🌍*
