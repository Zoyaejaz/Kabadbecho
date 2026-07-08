import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Package, Calendar,
  Download, BarChart3, PieChart, Activity
} from 'lucide-react';

const AnalyticsReports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-07');

  // Mock analytics data
  const dashboardStats = {
    totalPickups: 156,
    pickupsGrowth: 12.5,
    activeUsers: 89,
    usersGrowth: 8.3,
    totalRevenue: 45280,
    revenueGrowth: 15.7,
    avgPickupValue: 290,
    valueGrowth: 5.2,
  };

  const pickupsPerDay = [
    { date: '2025-01-01', pickups: 18 },
    { date: '2025-01-02', pickups: 24 },
    { date: '2025-01-03', pickups: 22 },
    { date: '2025-01-04', pickups: 28 },
    { date: '2025-01-05', pickups: 20 },
    { date: '2025-01-06', pickups: 26 },
    { date: '2025-01-07', pickups: 18 },
  ];

  const scrapCategoryDistribution = [
    { category: 'Plastic', count: 45, percentage: 28.8, revenue: 12500 },
    { category: 'Paper', count: 38, percentage: 24.4, revenue: 8900 },
    { category: 'Metal', count: 32, percentage: 20.5, revenue: 15600 },
    { category: 'Electronics', count: 28, percentage: 17.9, revenue: 6800 },
    { category: 'Glass', count: 13, percentage: 8.3, revenue: 1480 },
  ];

  const topUsers = [
    { name: 'Vikram Singh', pickups: 20, revenue: 5800 },
    { name: 'Amit Patel', pickups: 15, revenue: 4200 },
    { name: 'Rajesh Kumar', pickups: 12, revenue: 3600 },
    { name: 'Priya Sharma', pickups: 8, revenue: 2400 },
    { name: 'Sneha Reddy', pickups: 3, revenue: 900 },
  ];

  const maxPickups = Math.max(...pickupsPerDay.map(d => d.pickups));
  const maxCategory = Math.max(...scrapCategoryDistribution.map(c => c.count));

  const exportReport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#5D4037]">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">High-level operational insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-[#66BB6A] text-white rounded-lg hover:bg-[#4CAF50] transition-colors"
          >
            <Download size={18} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D4037] text-white rounded-lg hover:bg-[#4e362e] transition-colors"
          >
            <Download size={18} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent appearance-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent"
          />
          <button className="px-4 py-2 bg-[#5D4037] text-white rounded-lg hover:bg-[#4e362e] transition-colors">
            Apply Filter
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#E8F5E9] rounded-lg">
              <Package className="text-[#66BB6A]" size={24} />
            </div>
            <span className={`text-sm font-medium ${dashboardStats.pickupsGrowth > 0 ? 'text-[#66BB6A]' : 'text-red-600'}`}>
              {dashboardStats.pickupsGrowth > 0 ? '↑' : '↓'} {Math.abs(dashboardStats.pickupsGrowth)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Pickups</h3>
          <p className="text-3xl font-bold text-[#5D4037] mt-1">{dashboardStats.totalPickups}</p>
          <p className="text-xs text-gray-500 mt-2">Completed pickups this period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#E8F5E9] rounded-lg">
              <Users className="text-[#66BB6A]" size={24} />
            </div>
            <span className={`text-sm font-medium ${dashboardStats.usersGrowth > 0 ? 'text-[#66BB6A]' : 'text-red-600'}`}>
              {dashboardStats.usersGrowth > 0 ? '↑' : '↓'} {Math.abs(dashboardStats.usersGrowth)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Active Users</h3>
          <p className="text-3xl font-bold text-[#5D4037] mt-1">{dashboardStats.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-2">Users with pickups this period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#E8F5E9] rounded-lg">
              <DollarSign className="text-[#66BB6A]" size={24} />
            </div>
            <span className={`text-sm font-medium ${dashboardStats.revenueGrowth > 0 ? 'text-[#66BB6A]' : 'text-red-600'}`}>
              {dashboardStats.revenueGrowth > 0 ? '↑' : '↓'} {Math.abs(dashboardStats.revenueGrowth)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-[#5D4037] mt-1">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Revenue generated this period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#E8F5E9] rounded-lg">
              <TrendingUp className="text-[#66BB6A]" size={24} />
            </div>
            <span className={`text-sm font-medium ${dashboardStats.valueGrowth > 0 ? 'text-[#66BB6A]' : 'text-red-600'}`}>
              {dashboardStats.valueGrowth > 0 ? '↑' : '↓'} {Math.abs(dashboardStats.valueGrowth)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Avg Pickup Value</h3>
          <p className="text-3xl font-bold text-[#5D4037] mt-1">₹{dashboardStats.avgPickupValue}</p>
          <p className="text-xs text-gray-500 mt-2">Average value per pickup</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pickups Per Day Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-[#66BB6A]" size={24} />
              <h2 className="text-lg font-bold text-[#5D4037]">Pickups Per Day</h2>
            </div>
            <Activity className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-3">
            {pickupsPerDay.map((day, index) => {
              const barWidth = (day.pickups / maxPickups) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-bold text-[#66BB6A]">{day.pickups}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-[#66BB6A] h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-600">Total this week:</span>
            <span className="font-bold text-[#5D4037]">
              {pickupsPerDay.reduce((sum, d) => sum + d.pickups, 0)} pickups
            </span>
          </div>
        </div>

        {/* Scrap Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="text-[#66BB6A]" size={24} />
              <h2 className="text-lg font-bold text-[#5D4037]">Scrap Category Distribution</h2>
            </div>
            <Package className="text-gray-400" size={20} />
          </div>

          <div className="space-y-3">
            {scrapCategoryDistribution.map((category, index) => {
              const colors = ['bg-[#66BB6A]', 'bg-[#81C784]', 'bg-[#5D4037]', 'bg-[#A1887F]', 'bg-[#4CAF50]'];
              const textColors = ['text-[#66BB6A]', 'text-[#81C784]', 'text-[#5D4037]', 'text-[#A1887F]', 'text-[#4CAF50]'];
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                      <span className="text-gray-700 font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{category.count} pickups</span>
                      <span className={`font-bold ${textColors[index]}`}>{category.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${colors[index]} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-5">
                    Revenue: ₹{category.revenue.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="text-[#66BB6A]" size={24} />
            <h2 className="text-lg font-bold text-[#5D4037]">Top Users by Activity</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pickups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topUsers.map((user, index) => {
                const activityPercent = (user.pickups / topUsers[0].pickups) * 100;
                return (
                  <tr key={index} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#66BB6A] text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#5D4037]">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#66BB6A]">{user.pickups}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#5D4037]">₹{user.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#66BB6A] h-full rounded-full"
                          style={{ width: `${activityPercent}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default AnalyticsReports;
