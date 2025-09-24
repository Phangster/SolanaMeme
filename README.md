# 🎯 $YAO - Solana Meme Social Platform

A comprehensive **Solana-powered social platform** combining click gaming, video sharing, Instagram-like posting, and wallet authentication. Built with **Next.js**, **MongoDB Atlas**, **Solana Web3**, and **real-time WebSockets**.

## ✨ Platform Features

### 🎮 **Click Game**
- **🎯 Real-Time Competition**: WebSocket-powered global click counter
- **🌍 Country Leaderboards**: Compete with players worldwide
- **🎨 Yao Ming Meme**: Interactive clicking with animations
- **📊 Personal Stats**: Track individual clicks with wallet authentication

### 📱 **Social Media Features**
- **📝 Instagram-Style Posts**: Create text posts with optional images
- **💬 Real-Time Comments**: Comment on posts and videos with profile pictures
- **❤️ Like System**: Like posts and videos with heart animations
- **📺 Video Sharing**: Upload and share community videos
- **🎭 Profile Pictures**: Upload custom avatars via Cloudinary

### 🔐 **Solana Wallet Integration**
- **🔌 Multi-Wallet Support**: Phantom, Solflare, and more
- **🔑 Signature Authentication**: Secure login with wallet signatures
- **💳 Personal Dashboards**: Wallet-specific user profiles
- **🎫 JWT Sessions**: 7-day authenticated sessions

### 📺 **Video Platform**
- **🎬 Video Uploads**: Community video sharing with moderation
- **📱 TikTok-Style Feed**: Vertical video browsing experience
- **🎵 Audio Controls**: Individual mute/unmute for each video
- **📊 Video Analytics**: Views, likes, and engagement tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account (for media hosting)
- Solana wallet (Phantom/Solflare) for testing

### 1. Clone & Install
```bash
git clone <your-repo>
cd solana-meme
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yaome?retryWrites=true&w=majority

# WebSocket Configuration
WEBSOCKET_PORT=3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Cloudinary Media Hosting
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=user_uploads

# Solana Configuration
NEXT_PUBLIC_SOLSCAN_BASE_URL=https://solscan.io/token/
NEXT_PUBLIC_CONTRACT_ADDRESS=5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
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
Navigate to `http://localhost:3000` and start exploring! 🎉

## 🏗️ Platform Architecture

### 📱 **Pages**
- **Home** (`/`) - Click game and global leaderboards
- **Dashboard** (`/dashboard`) - Personal profile and content management
- **Feed** (`/feed`) - Instagram-style social posts
- **Shorts** (`/shorts`) - TikTok-style video feed
- **Chart** (`/chart`) - Token price analytics
- **How to Buy** (`/how-to-buy`) - Token purchase guide
- **Origins** (`/origins`) - Project story and background

### 🔌 **API Endpoints**

#### **Authentication**
- `POST /api/auth/challenge` - Generate wallet challenge
- `POST /api/auth/verify` - Verify signature & issue JWT
- `GET /api/me` - Get current user data

#### **Social Features**
- `GET /api/posts` - Fetch social feed
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Like/unlike posts
- `POST /api/posts/[id]/comments` - Add comments

#### **Video Platform**
- `GET /api/videos` - Fetch video feed
- `POST /api/user/videos` - Upload video
- `POST /api/videos/[id]/like` - Like videos
- `POST /api/videos/[id]/comments` - Comment on videos

#### **User Management**
- `POST /api/user/clicks` - Track personal clicks
- `POST /api/user/profile-picture` - Upload avatar

#### **Global Features**
- `POST /api/clicks` - Global click tracking
- `GET /api/leaderboard` - Country rankings

## 🎨 Key Components

### **Reusable Components**

#### **CommentSection** - Universal commenting
```typescript
<CommentSection
  contentId={postId}
  contentType="post" // or "video"
  apiEndpoint="/api/posts"
  inputType="textarea" // or "input"
  placeholder="Add a comment..."
/>
```

#### **Tabs** - Navigation system
```typescript
<Tabs
  tabs={[
    { id: 'videos', label: 'Videos', icon: '🎬', count: 5 },
    { id: 'posts', label: 'Posts', icon: '📝', count: 12 }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
/>
```

#### **VideoGrid** - Video gallery
```typescript
<VideoGrid
  videos={userVideos}
  loading={loading}
  onVideoClick={setSelectedVideo}
  onAddVideoClick={() => setShowUploadModal(true)}
/>
```

### **Utility Functions**
```typescript
import { truncateWallet, formatTimeAgo } from '@/lib/utils';

truncateWallet("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")
// Result: "7xKX...sgAsU"

formatTimeAgo("2024-01-01T10:00:00Z")
// Result: "2h" or "3d" or "Just now"
```

## 🗄️ Database Schema

### **Users Collection**
```typescript
interface User {
  wallet: string;                    // Solana wallet address (unique)
  clicks: number;                    // Personal click count
  profilePicture?: {                 // Optional profile picture
    publicId: string;
    secureUrl: string;
    uploadedAt: Date;
  };
  uploadedVideos: Video[];           // User's video uploads
  createdAt: Date;
  updatedAt: Date;
}
```

### **Posts Collection**
```typescript
interface Post {
  author: string;                    // Wallet address
  content: string;                   // Post text (max 2000 chars)
  imageUrl?: string;                 // Optional image
  status: 'approved';                // Auto-approved
  likes: Like[];                     // User likes
  comments: Comment[];               // User comments
  views: number;                     // View count
  createdAt: Date;
}
```

### **Videos Collection**
```typescript
interface Video {
  uploader: string;                  // Wallet address
  publicId: string;                  // Cloudinary public ID
  secureUrl: string;                 // Cloudinary URL
  title: string;                     // Video title
  description: string;               // Description
  status: 'pending' | 'approved' | 'rejected';
  likes: Like[];                     // User likes
  comments: Comment[];               // User comments
  views: number;                     // View count
  uploadedAt: Date;
}
```

## 🔐 Wallet Authentication

### **Security Features**
- **Signature Verification**: Cryptographic authentication
- **No Private Keys**: Never store or transmit private keys
- **JWT Tokens**: Secure session management (7 days)
- **Rate Limiting**: Prevent abuse and spam

### **Supported Wallets**
- **Phantom** - Most popular Solana wallet
- **Solflare** - Web and mobile wallet
- **Backpack** - Modern Solana wallet
- **And more** via Solana Wallet Adapter

## 🎯 Content Management

### **Posts System**
- **Rich Text**: 2000 character limit
- **Image Support**: Optional image attachments
- **Auto-Approval**: Posts go live immediately
- **Engagement**: Real-time likes and comments

### **Video System**
- **Upload Pipeline**: Cloudinary integration
- **Moderation Queue**: Manual approval process
- **Format Support**: MP4, MOV, AVI, WebM
- **Size Limits**: 100MB maximum per video

### **Comment System**
- **Universal**: Works for posts and videos
- **Auto-Expanding**: Textarea grows with content
- **Profile Integration**: Shows user avatars
- **Chronological**: Oldest to newest display

## 🚀 Deployment Guide

### **Environment Variables for Production**

#### **Vercel (Frontend)**
   ```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_WEBSOCKET_URL=https://your-railway-app.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
JWT_SECRET=your-production-secret
```

#### **Railway (WebSocket Server)**
   ```env
MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.com
```

### **Deployment Steps**
1. **Deploy WebSocket server** to Railway
2. **Deploy frontend** to Vercel  
3. **Update WebSocket URL** in Vercel environment
4. **Test real-time functionality**

## 🧪 Development Tools

### **Testing Commands**
```bash
# Test environment variables
npm run test:env

# Test WebSocket connection
npm run test:websocket

# Test database connection
npm run test:db
```

### **Debug Mode**
```bash
# Enable detailed logging
DEBUG=* npm run dev
```

## 🔮 Future Features

### **Planned Additions**
- **NFT Gallery** - Display Solana NFTs
- **Token Rewards** - Earn $YAO for engagement
- **Live Streaming** - Real-time video broadcasts
- **Mobile App** - React Native companion
- **Advanced Analytics** - Detailed user insights

### **Community Features**
- **User Following** - Follow other users
- **Direct Messaging** - Private conversations
- **Groups/Communities** - Topic-based discussions
- **Events** - Community gatherings and contests

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create feature branch**
3. **Follow code standards** (TypeScript, ESLint)
4. **Test thoroughly**
5. **Submit pull request**

### **Development Guidelines**
- **TypeScript** for all new code
- **Component-based** architecture
- **Reusable utilities** in `/lib/utils.ts`
- **Consistent styling** with Tailwind CSS

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Yao Ming Meme** - The legendary face that inspired it all
- **Solana Community** - Amazing blockchain ecosystem  
- **Next.js Team** - Incredible React framework
- **MongoDB** - Reliable database platform
- **Cloudinary** - Powerful media management
- **Open Source Community** - Tools and inspiration

---

## 🎉 Ready to Build the Future!

Your **$YAO Social Platform** combines the best of:
- 🎮 **Gaming** (Click competition)
- 📱 **Social Media** (Posts, comments, likes)
- 📺 **Video Platform** (Upload, share, engage)
- 🔐 **Web3** (Solana wallet integration)
- ⚡ **Real-Time** (WebSocket updates)

### **Start Building Your Community! 🚀**

**Made with ❤️ and lots of $YAO energy! 🎯✨**

*Connect your wallet and join the $YAO revolution!*
