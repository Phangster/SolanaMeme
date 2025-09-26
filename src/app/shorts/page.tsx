'use client';
import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useCommunityVideos } from '@/hooks/useVideos';
import { truncateWallet } from '@/lib/utils';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';

interface CommunityVideo {
  _id: string;
  uploader: string;
  publicId: string;
  secureUrl: string;
  title: string;
  description: string;
  uploadedAt: string;
  likes: Array<{
    wallet: string;
    createdAt: string;
  }>;
  likesCount: number;
  commentsCount: number;
  views: number;
}

export default function ShortsPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, user } = useWalletAuth();
  const [isMuted, setIsMuted] = useState(true);
  const [communityMutedStates, setCommunityMutedStates] = useState<boolean[]>([]);
  
  // Use the video fetching hook
  const { videos: communityVideos, loading } = useCommunityVideos();
  
  // Video modal state
  const [selectedVideo, setSelectedVideo] = useState<CommunityVideo | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const featuredVideo = {
    title: "A Crypto Investor's Reality Check",
    description: "Humor, irony, and astonishment at the unpredictable world of digital assets.",
    url: 'https://res.cloudinary.com/phangster/video/upload/f_auto,q_auto/fbfvyesdazi9nrglrw1m.mp4',
  };

  // Initialize mute states for community videos
  useEffect(() => {
    if (communityVideos.length > 0) {
      setCommunityMutedStates(new Array(communityVideos.length).fill(true));
    }
  }, [communityVideos.length]);

  const handleVideoClick = (video: CommunityVideo) => {
    const index = communityVideos.findIndex(v => v._id === video._id);
    setCurrentVideoIndex(index);
    setSelectedVideo(video);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVideoChange = (video: any, index: number) => {
    setCurrentVideoIndex(index);
    setSelectedVideo(video);
  };

  const handleSubmitVideo = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else if (connected) {
      router.push('/dashboard');
    } else {
      setVisible(true);
    }
  };

  return (
    <Layout currentRoute="/shorts">
      <div className="min-h-screen bg-black text-white py-20">

        {/* Hero Section */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
            $YAO Shorts
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Watch the latest videos, memes, and content from the $YAO community. 
            From educational content to pure entertainment, we&apos;ve got it all.
          </p>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <video
                  src={featuredVideo.url}
                  className="mx-auto mb-6 max-w-md w-full h-auto rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2 font-pixel">
                {featuredVideo.title}
              </h1>
              <p className="text-gray-300 mb-8 font-pixel">
                {featuredVideo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Community Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Community Content</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-400 font-pixel">Loading community videos...</p>
              </div>
            ) : communityVideos.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-300 mb-2 font-pixel">No Community Videos Yet</h3>
                <p className="text-gray-400 font-pixel">Be the first to upload a video!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3">
                {communityVideos.map((video, index) => (
                  <VideoCard
                    key={video._id}
                    video={{
                      _id: video._id,
                      publicId: video.publicId,
                      secureUrl: video.secureUrl,
                      title: video.title,
                      description: video.description,
                      status: 'approved' as const,
                      uploadedAt: video.uploadedAt,
                      likes: video.likes,
                      likesCount: video.likesCount,
                      views: video.views,
                      commentsCount: video.commentsCount,
                      uploader: truncateWallet(video.uploader)
                    }}
                    onVideoClick={(videoCard) => handleVideoClick(videoCard as CommunityVideo)}
                    showStatusBadge={false}
                    showMuteButton={true}
                    isMuted={communityMutedStates[index]}
                    videoId={`community-video-${index}`}
                    onMuteToggle={() => {
                      const videoElement = document.getElementById(`community-video-${index}`) as HTMLVideoElement;
                      if (videoElement) {
                        const newMutedState = !communityMutedStates[index];
                        videoElement.muted = newMutedState;
                        const newStates = [...communityMutedStates];
                        newStates[index] = newMutedState;
                        setCommunityMutedStates(newStates);
                        if (!newMutedState) {
                          videoElement.play();
                        }
                      }
                    }}
                    className="aspect-[3/4]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Your Content */}
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Submit Your Content</h2>
          <p className="text-gray-300 mb-6">
            Have a great video about $YAO? Share it with the community! 
            We&apos;re always looking for creative content creators.
          </p>
          
          {/* Dynamic button based on auth state */}
          <div className="space-y-3">
            <button 
              onClick={handleSubmitVideo}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold font-pixel"
            >
              {isAuthenticated ? 'Upload Video' : connected ? 'Go to Dashboard' : 'Connect Wallet to Upload'}
            </button>
            
            {/* Helper text */}
            <p className="text-sm text-gray-400 font-pixel">
              {isAuthenticated 
                ? '' 
                : connected 
                ? 'Complete authentication in your dashboard to upload videos.'
                : 'Connect your Solana wallet to start uploading videos.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted(!isMuted)}
          isAuthenticated={isAuthenticated}
          currentUserWallet={user?.wallet}
          showTitle={true}
          videos={communityVideos}
          currentVideoIndex={currentVideoIndex}
          onVideoChange={handleVideoChange}
        />
      )}
    </Layout>
  );
}