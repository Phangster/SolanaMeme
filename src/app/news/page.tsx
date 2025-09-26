'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TwitterFeed from '@/components/TwitterFeed';

export default function NewsPage() {
  const [tweetUrls, setTweetUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('/api/tweets');
        const data = await response.json();
        
        if (data.success) {
          setTweetUrls(data.tweets);
        }
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <Layout currentRoute="/news">
      <div className="min-h-screen pt-20">
        <div className="flex-1 max-w-4xl mx-auto text-center px-4">
            <div className="mb-2">
                <h1 className="text-3xl font-pixel font-bold text-white mb-2">
                News Feed
                </h1>
                <p className="text-gray-400 font-pixel text-sm">
                Latest updates and announcements
                </p>
            </div>
            {loading ? (
                <div className="text-center items-center justify-center h-full">
                    <p className="text-gray-400 font-pixel text-sm">Loading tweets...</p>
                </div>
            ) : 
                <TwitterFeed tweetUrls={tweetUrls} />
            }
        </div>
      </div>
    </Layout>
  );
}
