'use client';
import { Tweet } from 'react-tweet';

interface TwitterFeedProps {
  tweetUrls: string[];
}

const TwitterFeed: React.FC<TwitterFeedProps> = ({ tweetUrls }) => {
  if (tweetUrls.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 font-pixel text-sm">No tweets available</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 justify-center">
      {tweetUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
        >
          <Tweet id={extractTweetId(url)} />
        </div>
      ))}
    </div>
  );
};

// Helper function to extract tweet ID from URL
const extractTweetId = (url: string): string => {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : '';
};

export default TwitterFeed;
