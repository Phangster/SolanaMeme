'use client';
import Layout from '@/components/Layout';
import Feed from '@/components/Feed';

export default function FeedPage() {
  return (
    <Layout currentRoute="/feed">
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 font-pixel mb-4">
              $YAO Feed
            </h1>
            <p className="text-lg text-gray-300 font-pixel">
              Share your thoughts, memes, and connect with the $YAO community
            </p>
          </div>

          {/* Feed Component */}
          <Feed />
        </div>
      </div>
    </Layout>
  );
}
