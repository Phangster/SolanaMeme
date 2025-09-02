'use client';
import Layout from '@/components/Layout';
import { useState } from 'react';

export default function ShortsPage() {
  const featuredVideo = {
    title: 'A Crypto Investor’s Reality Check',
    description: 'Humor, irony, and astonishment at the unpredictable world of digital assets.',
    url: 'https://res.cloudinary.com/phangster/video/upload/f_auto,q_auto/fbfvyesdazi9nrglrw1m.mp4',
  };

  const communityVideos = [
    {
      title: 'Diamond Hands: The Yao Effect',
      contributor: '@YAOuser1',
      url: 'https://res.cloudinary.com/phangster/video/upload/f_auto,q_auto/beadocfvwo4qaabfaqwh.mp4',
    },
    {
      title: 'A Crypto Investor’s Reality Check',
      contributor: '@YAOuser1',
      url: 'https://res.cloudinary.com/phangster/video/upload/f_auto,q_auto/fbfvyesdazi9nrglrw1m.mp4',
    },
  ];

  const [isMuted, setIsMuted] = useState(true);
  const [communityMutedStates, setCommunityMutedStates] = useState<boolean[]>(
    new Array(communityVideos.length).fill(true)
  );

  return (
    <Layout currentRoute="/shorts">
      <div className="max-w-6xl mx-auto pb-16 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
          $YAO Shorts
        </h1>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Watch the latest videos, memes, and content from the $YAO community. 
          From educational content to pure entertainment, we&apos;ve got it all.
        </p>

        {/* Featured Video */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Featured Video</h2>
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="mb-4 relative">
              <video
                src={featuredVideo.url}
                width="640"
                height="360" 
                style={{height: 'auto', width: '100%', aspectRatio: '640 / 360'}}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="rounded-lg"
                id="featured-video"
              />
              <button
                onClick={() => {
                  const video = document.getElementById('featured-video') as HTMLVideoElement;
                  if (video) {
                    video.muted = !isMuted;
                    setIsMuted(!isMuted);
                    if (!isMuted) {
                      video.play();
                    }
                  }
                }}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isMuted ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                    Unmute
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Mute
                  </>
                )}
              </button>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{featuredVideo.title}</h3>
            <p className="text-gray-400">{featuredVideo.description}</p>
          </div>
        </div>

        {/* Community Content */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Community Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityVideos.map((video, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                <div className="aspect-video rounded mb-3 relative">
                  <video
                    src={video.url}
                    width="100%"
                    height="100%"
                    style={{height: '100%', width: '100%'}}
                    autoPlay
                    muted={communityMutedStates[index]}
                    loop
                    playsInline
                    controls
                    className="rounded"
                    id={`community-video-${index}`}
                  />
                  <button
                    onClick={() => {
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
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-colors text-xs"
                  >
                    {communityMutedStates[index] ? (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        Unmute
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Mute
                      </>
                    )}
                  </button>
                </div>
                <h4 className="font-semibold text-white text-sm">{video.title}</h4>
                <p className="text-xs text-gray-400 mt-2">By {video.contributor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Your Content */}
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Submit Your Content</h2>
          <p className="text-gray-300 mb-6">
            Have a great video about $$YAO? Share it with the community! 
            We&apos;re always looking for creative content creators.
          </p>
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold">
            Submit Video
          </button>
        </div>
      </div>
    </Layout>
  );
}
