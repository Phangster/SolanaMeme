'use client';
import React from 'react';

interface UserVideo {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

interface User {
  wallet?: string;
  clicks?: number;
  createdAt?: string;
}

interface GlobalStats {
  totalClicks: number;
  isLoading: boolean;
}

interface ActivityTabProps {
  user: User | null;
  userVideos: UserVideo[];
  globalStats: GlobalStats;
  className?: string;
}

const ActivityTab: React.FC<ActivityTabProps> = ({
  user,
  userVideos,
  globalStats,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Detailed Click Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 font-pixel">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 font-pixel mb-2">
              {user?.clicks?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-400 font-pixel">Your Personal Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 font-pixel mb-2">
              {globalStats.isLoading ? '...' : globalStats.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 font-pixel">Global Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 font-pixel mb-2">
              {globalStats.totalClicks > 0 && user?.clicks ? 
                ((user.clicks / globalStats.totalClicks) * 100).toFixed(3) + '%' : 
                '0.000%'
              }
            </div>
            <div className="text-sm text-gray-400 font-pixel">Your Contribution</div>
          </div>
        </div>
      </div>

      {/* Video Status Grid */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 font-pixel">Video Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Approved Videos */}
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center flex flex-col gap-2">
            <div className="text-sm text-gray-400 font-pixel">Approved</div>
            <div className="text-2xl font-bold text-green-400 font-pixel">
              {userVideos.filter(v => v.status === 'approved').length}
            </div>
          </div>

          {/* Pending Videos */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-center flex flex-col gap-2">
            <div className="text-sm text-gray-400 font-pixel">Pending</div>
            <div className="text-2xl font-bold text-yellow-400 font-pixel">
              {userVideos.filter(v => v.status === 'pending').length}
            </div>
          </div>

          {/* Rejected Videos */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center flex flex-col gap-2">
            <div className="text-sm text-gray-400 font-pixel">Rejected</div>
            <div className="text-2xl font-bold text-red-400 font-pixel">
              {userVideos.filter(v => v.status === 'rejected').length}
            </div>
          </div>
        </div>
      </div>

      {/* Community Performance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 font-pixel">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Content */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 font-pixel mb-2">
              {userVideos.length}
            </div>
            <div className="text-sm text-gray-400 font-pixel">Total Videos</div>
          </div>

          {/* Approval Rate */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 font-pixel mb-2">
              {userVideos.length > 0 
                ? `${Math.round((userVideos.filter(v => v.status === 'approved').length / userVideos.length) * 100)}%`
                : '0%'
              }
            </div>
            <div className="text-sm text-gray-400 font-pixel">Success Rate</div>
          </div>

          {/* Member Rank */}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 font-pixel mb-2">
              {user?.clicks && user.clicks > 1000 ? 'Elite' :
               user?.clicks && user.clicks > 500 ? 'Active' :
               user?.clicks && user.clicks > 100 ? 'Member' : 'Newbie'}
            </div>
            <div className="text-sm text-gray-400 font-pixel">Community Status</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="space-y-3">
          {/* Join Date */}
          <div className="flex items-center gap-3 text-gray-300 font-pixel text-sm">
            <span>Member Since</span>
            <span className="text-gray-500 ml-auto">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivityTab;
