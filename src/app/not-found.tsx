import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-pixel text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link 
          href="/"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-pixel"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
