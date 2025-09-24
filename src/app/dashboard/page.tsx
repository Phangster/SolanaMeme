'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useUserVideos } from '@/hooks/useVideos';
import Layout from '@/components/Layout';
import LoadingPage from '@/components/LoadingPage';
import { truncateWallet } from '@/lib/utils';
import VideoUpload from '@/components/VideoUpload';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import Tabs from '@/components/Tabs';
import TabContent from '@/components/TabContent';
import VideoGrid from '@/components/VideoGrid';
import ActivityTab from '@/components/ActivityTab';
import VideoModal from '@/components/VideoModal';

interface GlobalStats {
  totalClicks: number;
  isLoading: boolean;
}

interface UserVideo {
  _id: string;
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  likes: Array<{
    wallet: string;
    createdAt: string;
  }>;
  likesCount: number;
  views: number;
}



export default function DashboardPage() {
  const router = useRouter();
  const { connected, publicKey, disconnect } = useWallet();
  const { isAuthenticated, user, logout, isLoading: authLoading } = useWalletAuth();
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalClicks: 0,
    isLoading: true,
  });

  // Use the video fetching hook
  const { videos: userVideos, loading: videosLoading, refetch: refetchVideos } = useUserVideos();
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'posts' | 'activity'>('videos');
  
  
  
  

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    // Only redirect after a reasonable delay to allow auth to complete
    const redirectTimer = setTimeout(() => {
      if (!authLoading && (!connected || !isAuthenticated)) {
        router.push('/');
      }
    }, 1000); // Wait 1 second before redirecting

    return () => clearTimeout(redirectTimer);
  }, [connected, isAuthenticated, authLoading, router]);

  // Fetch global stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          
          const leaderboardData = data.leaderboard || data;
          const totalClicks = leaderboardData.reduce((sum: number, country: { clicks: number }) => sum + country.clicks, 0);
          
          setGlobalStats({
            totalClicks,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching global stats:', error);
        setGlobalStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchGlobalStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchGlobalStats, 30000);
    return () => clearInterval(interval);
  }, []);


  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) {
          setSelectedVideo(null);
        } else if (showUploadModal) {
          setShowUploadModal(false);
        } else if (showProfileModal) {
          setShowProfileModal(false);
        }
      }
    };

    if (selectedVideo || showUploadModal || showProfileModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo, showUploadModal, showProfileModal]);


  const handleDisconnect = async () => {
    try {
      // Clear authentication state
      logout();
      // Disconnect wallet
      await disconnect();
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Show loading while checking authentication or if clearly not authenticated
  if (authLoading || (!connected && !authLoading)) {
    return (
      <Layout currentRoute="/dashboard" isLoading={true}>
        <LoadingPage message="Loading YAO Dashboard..." />
      </Layout>
    );
  }

  // If connected but not authenticated, show loading briefly
  if (connected && !isAuthenticated && !authLoading) {
    return (
      <Layout currentRoute="/dashboard" isLoading={true}>
        <LoadingPage message="Authenticating..." />
      </Layout>
    );
  }

  return (
    <>
    <Layout currentRoute="/dashboard">
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 font-pixel">
                  YAO DASHBOARD
                </h1>
                <p className="text-lg text-gray-300 font-pixel mt-2">
                  Welcome, YAO Member!
                </p>
              </div>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative group">
              <div 
                className="size-[200px] rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg cursor-pointer transition-all duration-300 group-hover:border-yellow-300"
                onClick={() => setShowProfileModal(true)}
              >
                {user?.profilePicture?.secureUrl ? (
                  <Image
                    src={user.profilePicture.secureUrl}
                    alt="Profile Picture"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                  />
                ) : (
                  <Image
                    src="/default-avatar.png"
                    alt="Default Profile"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                  />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white font-pixel font-bold text-center">
                      {user?.profilePicture ? 'Edit Photo' : 'Add Photo'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-xl mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Wallet Info */}
              <div className="text-center flex-1">
                <h2 className="md:text-xl font-bold font-pixel mb-2">WALLET CONNECTED</h2>
                <div className="flex lg:flex-row flex-col gap-2">
                  <div className="bg-black text-yellow-400 px-6 py-3 rounded-lg font-mono text flex-1">
                    {user?.wallet ? truncateWallet(user.wallet) : 
                    publicKey ? truncateWallet(publicKey.toString()) : 'Connected'}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-pixel text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Content Tabs Section */}
          <div className="rounded-lg overflow-hidden mb-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <Tabs
                tabs={[
                  {
                    id: 'videos',
                    label: 'Videos',
                    icon: null,
                    count: userVideos.length,
                    disabled: false
                  },
                  {
                    id: 'activity',
                    label: 'Activity',
                    icon: null,
                    disabled: false
                  }
                ]}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as 'videos' | 'posts' | 'activity')}
                variant="underline"
              />
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {/* Videos Tab */}
              <TabContent activeTab={activeTab} tabId="videos" lazy={true}>
                <VideoGrid
                  videos={userVideos}
                  loading={videosLoading}
                  onVideoClick={setSelectedVideo}
                  onAddVideoClick={() => setShowUploadModal(true)}
                />
              </TabContent>

              {/* Posts Tab */}
              <TabContent activeTab={activeTab} tabId="posts" lazy={true}>
                <div className="text-center py-12">
                  <h3 className="text-xl font-bold text-gray-300 mb-2 font-pixel">Posts Coming Soon</h3>
                  <p className="text-gray-400 font-pixel">Text posts and social content will be available here.</p>
                </div>
              </TabContent>

              {/* Activity Tab */}
              <TabContent activeTab={activeTab} tabId="activity" lazy={true}>
                <ActivityTab
                  user={user}
                  userVideos={userVideos}
                  globalStats={globalStats}
                />
              </TabContent>
              </div>
          </div>
        </div>
      </div>

    </Layout>

    {/* Video Modal */}
    {selectedVideo && (
      <VideoModal
        video={{
          ...selectedVideo,
          uploader: publicKey?.toString()
        }}
        isOpen={true}
        onClose={() => setSelectedVideo(null)}
        isMuted={true}
        onMuteToggle={() => {}}
        isAuthenticated={isAuthenticated}
        currentUserWallet={user?.wallet}
        showTitle={false}
      />
    )}

    {/* Upload Video Modal - Outside Layout for full-screen centering */}
    {showUploadModal && (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center md:p-4 md:w-[calc(100vw-320px)]"
        onClick={() => setShowUploadModal(false)}
      >
        <div 
          className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[98vh] md:max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowUploadModal(false)}
            className="absolute top-2 right-2 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white hover:text-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 z-20 border-2 border-gray-600 hover:border-yellow-400 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Upload Component */}
          <VideoUpload 
            onUploadSuccess={() => {              
              setShowUploadModal(false);
              refetchVideos();
            }}
          />
        </div>
      </div>
    )}

    {/* Profile Picture Upload Modal - Outside Layout for full-screen centering */}
    {showProfileModal && (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center md:p-4 md:w-[calc(100vw-320px)]"
        onClick={() => setShowProfileModal(false)}
      >
        <div 
          className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[98vh] md:max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute top-2 right-2 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white hover:text-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 z-20 border-2 border-gray-600 hover:border-yellow-400 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Profile Picture Upload Component */}
          <div className="bg-gray-900 rounded-lg p-6">
            <ProfilePictureUpload 
              onUploadSuccess={() => {
                setShowProfileModal(false);
              }}
              onError={(error) => {
                console.error('Profile picture upload error:', error);
              }}
            />
          </div>
        </div>
      </div>
    )}
  </>
  );
}
