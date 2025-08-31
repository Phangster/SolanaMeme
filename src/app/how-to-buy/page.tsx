'use client';
import Layout from '@/components/Layout';

export default function HowToBuyPage() {
  return (
    <Layout currentRoute="/how-to-buy">
      <div className="max-w-4xl mx-auto pb-16 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center font-pixel">
          How to buy
        </h1>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="inline-block bg-white text-black px-6 py-3 rounded-lg mb-4">
              <span className="text-lg font-pixel font-bold">step 1</span>
            </div>
            <p className="text-xl text-gray-300">
              Download and install Phantom wallet app
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="inline-block bg-white text-black px-6 py-3 rounded-lg mb-4">
              <span className="text-lg font-pixel font-bold">step 2</span>
            </div>
            <p className="text-xl text-gray-300">
              Send $SOL to your new wallet address, or purchase solana directly in the app
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="inline-block bg-white text-black px-6 py-3 rounded-lg mb-4">
              <span className="text-lg font-pixel font-bold">step 3</span>
            </div>
            <p className="text-xl text-gray-300">
              Use a DEX like Raydium or Jupiter to swap SOL for $$YAO
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="inline-block bg-white text-black px-6 py-3 rounded-lg mb-4">
              <span className="text-lg font-pixel font-bold">step 4</span>
            </div>
            <p className="text-xl text-gray-300">
              Add $$YAO to your wallet using the contract address
            </p>
          </div>

          {/* Contract Address */}
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Contract Address</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Copy this address:</p>
              <p className="font-mono text-lg text-yellow-400 break-all">
                5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">
                <span className="text-yellow-400 font-semibold">Phantom Wallet</span>
              </a>
              <a href="https://raydium.io" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">
                <span className="text-yellow-400 font-semibold">Raydium DEX</span>
              </a>
              <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">
                <span className="text-yellow-400 font-semibold">Jupiter Aggregator</span>
              </a>
              <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">
                <span className="text-yellow-400 font-semibold">Solflare Wallet</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
