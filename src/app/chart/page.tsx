'use client';
import Layout from '@/components/Layout';

export default function ChartPage() {
  return (
    <Layout currentRoute="/chart">
      <div className="max-w-6xl mx-auto pb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
          $TROLL Chart
        </h1>
        
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Track the performance of $TROLL with real-time charts, market data, and trading information.
        </p>

        {/* Main Chart */}
        <div className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">$TROLL Price Chart</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-semibold">1H</button>
                <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">24H</button>
                <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">7D</button>
                <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">1M</button>
                <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">1Y</button>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="mt-2 text-lg text-gray-500">Interactive Price Chart</p>
                <p className="text-sm text-gray-600">Real-time $TROLL price data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Current Price</h3>
            <p className="text-3xl font-bold text-yellow-400">$0.000123</p>
            <p className="text-sm text-green-400 mt-1">+12.34% (24h)</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Market Cap</h3>
            <p className="text-3xl font-bold text-white">$1.23M</p>
            <p className="text-sm text-gray-500 mt-1">Circulating Supply</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">24h Volume</h3>
            <p className="text-3xl font-bold text-white">$456K</p>
            <p className="text-sm text-gray-500 mt-1">Trading Volume</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Holders</h3>
            <p className="text-3xl font-bold text-white">12,345</p>
            <p className="text-sm text-gray-500 mt-1">Active Wallets</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-700 p-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Ready to Trade?</h2>
          <p className="text-gray-300 mb-6">
            Start trading $TROLL on your favorite decentralized exchange and join the community!
          </p>
          <div className="space-x-4">
            <a 
              href="https://raydium.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
            >
              Trade on Raydium
            </a>
            <a 
              href="https://jup.ag" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold"
            >
              Trade on Jupiter
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
