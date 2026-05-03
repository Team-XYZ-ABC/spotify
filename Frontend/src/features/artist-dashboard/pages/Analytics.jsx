import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Analytics = () => {
  // Mock data - replace with real API data
  const [metrics] = useState({
    totalStreams: 1250000,
    monthlyListeners: 45000,
    followers: 89000,
    saves: 12000,
    revenue: 2500.50,
  });

  const [streamData] = useState([
    { date: "2024-04-01", streams: 45000 },
    { date: "2024-04-02", streams: 52000 },
    { date: "2024-04-03", streams: 48000 },
    { date: "2024-04-04", streams: 61000 },
    { date: "2024-04-05", streams: 55000 },
    { date: "2024-04-06", streams: 67000 },
    { date: "2024-04-07", streams: 59000 },
  ]);

  const [topTracks] = useState([
    { name: "Song One", streams: 250000, change: "+12%" },
    { name: "Song Two", streams: 180000, change: "+8%" },
    { name: "Song Three", streams: 150000, change: "+15%" },
    { name: "Song Four", streams: 120000, change: "+5%" },
    { name: "Song Five", streams: 95000, change: "+3%" },
  ]);

  const [demographics] = useState([
    { name: "18-24", value: 35, color: "#1DB954" },
    { name: "25-34", value: 28, color: "#1ed760" },
    { name: "35-44", value: 20, color: "#22ff64" },
    { name: "45+", value: 17, color: "#4ade80" },
  ]);

  const [recentActivity] = useState([
    {
      action: "New follower",
      detail: "John Doe followed you",
      time: "2 hours ago",
    },
    {
      action: "Track saved",
      detail: "Song One saved by 150 users",
      time: "4 hours ago",
    },
    {
      action: "Playlist added",
      detail: 'Song Two added to "Chill Vibes"',
      time: "6 hours ago",
    },
    {
      action: "Stream milestone",
      detail: "Reached 1M total streams",
      time: "1 day ago",
    },
  ]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">
          Track your music performance and audience insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Total Streams</div>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.totalStreams)}
          </div>
          <div className="text-xs text-green-400 mt-1">
            +12% from last month
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Monthly Listeners</div>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.monthlyListeners)}
          </div>
          <div className="text-xs text-green-400 mt-1">+8% from last month</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Followers</div>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.followers)}
          </div>
          <div className="text-xs text-green-400 mt-1">
            +15% from last month
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Saves</div>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.saves)}
          </div>
          <div className="text-xs text-green-400 mt-1">+7% from last month</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Revenue</div>
          <div className="text-2xl font-bold">
            ${metrics.revenue.toFixed(2)}
          </div>
          <div className="text-xs text-green-400 mt-1">
            +20% from last month
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stream Trends */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Stream Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={streamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="streams"
                stroke="#1DB954"
                strokeWidth={2}
                dot={{ fill: "#1DB954", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Demographics */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Audience Demographics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {demographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {demographics.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                >
                </div>
                <span className="text-sm text-gray-300">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tracks */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Top Tracks</h3>
          <div className="space-y-3">
            {topTracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1DB954] rounded flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{track.name}</div>
                    <div className="text-sm text-gray-400">
                      {formatNumber(track.streams)} streams
                    </div>
                  </div>
                </div>
                <div className="text-green-400 text-sm font-medium">
                  {track.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-2 h-2 bg-[#1DB954] rounded-full mt-2 shrink-0">
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-gray-400 text-sm">{activity.detail}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
