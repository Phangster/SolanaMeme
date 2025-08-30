'use client';
import Layout from '@/components/Layout';

export default function ShortsPage() {
  return (
    <Layout currentRoute="/shorts">
      <div className="max-w-6xl mx-auto pb-16 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
          $TROLL Shorts
        </h1>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Watch the latest videos, memes, and content from the $TROLL community. 
          From educational content to pure entertainment, we&apos;ve got it all.
        </p>

        {/* Featured Video */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Featured Video</h2>
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Featured Video Player</p>
                <p className="text-xs text-gray-600">&ldquo;How $TROLL Became the Internet&apos;s Favorite Memecoin&rdquo;</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">How $TROLL Became the Internet&apos;s Favorite Memecoin</h3>
            <p className="text-gray-400">Learn the story behind the most iconic memecoin in crypto history.</p>
          </div>
        </div>

        {/* Community Content */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Community Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                <div className="aspect-video bg-gray-800 rounded mb-3 flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white text-sm">Community Video {item}</h4>
                <p className="text-xs text-gray-400">By @trolluser{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Your Content */}
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Submit Your Content</h2>
          <p className="text-gray-300 mb-6">
            Have a great video about $TROLL? Share it with the community! 
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
