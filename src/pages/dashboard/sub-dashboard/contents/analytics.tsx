import React from 'react';
import { TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';

import { usePeriod, useCurrency } from '@/contexts/hooks';
import { mockBaseMetrics, mockChartData, mockAnalyticsBreakdown, mockSuperAdminAnalytics } from '@/data/mockData';

import { PeriodSelector } from '@/components/user-inputs/inputs';

const Analytics: React.FC = () => {
  const { period, getPeriodData } = usePeriod();
  const { formatCurrency } = useCurrency();

  const periodMetrics = mockBaseMetrics.map((metric) => ({
    ...metric,
    adjustedAmount: getPeriodData(metric.baseAmount, period),
  }));

  const baseTopPerformers = mockSuperAdminAnalytics.topPerformingClients;

  const periodTopPerformers = baseTopPerformers.map((performer) => ({
    ...performer,
    revenue: getPeriodData(performer.revenue, period),
  }));

  const getChartData = () => {
    const baseData = mockChartData.map((item) => item.value);
    const periodMultiplier = {
      last7days: 0.2,
      last30days: 0.7,
      thisweek: 0.15,
      thismonth: 1.0,
      lastmonth: 0.85,
      thisyear: 1.2,
      lastyear: 0.9,
      alltime: 1.5,
    };

    const multiplier = periodMultiplier[period] || 1.0;
    return baseData.map((value) => Math.round(value * multiplier));
  };

  const chartData = getChartData();

  const getAnalyticsBreakdown = () => {
    return {
      subscriptionRevenue: getPeriodData(mockAnalyticsBreakdown.subscriptionRevenue, period),
      transactionFees: getPeriodData(mockAnalyticsBreakdown.transactionFees, period),
      setupFees: getPeriodData(mockAnalyticsBreakdown.setupFees, period),
      dailyActiveUsers: getPeriodData(mockAnalyticsBreakdown.dailyActiveUsers, period),
      sessionDuration: mockAnalyticsBreakdown.sessionDuration,
      bounceRate: mockAnalyticsBreakdown.bounceRate,
      conversionRate: mockAnalyticsBreakdown.conversionRate,
      totalEvents: getPeriodData(mockAnalyticsBreakdown.totalEvents, period),
      virtualEvents: getPeriodData(mockAnalyticsBreakdown.virtualEvents, period),
      physicalEvents: getPeriodData(mockAnalyticsBreakdown.physicalEvents, period),
      avgAttendance: mockAnalyticsBreakdown.avgAttendance,
    };
  };

  const analyticsBreakdown = getAnalyticsBreakdown();
  const totalRevenue = analyticsBreakdown.subscriptionRevenue + analyticsBreakdown.transactionFees + analyticsBreakdown.setupFees;

  return (
    <div className="space-y-6">
      {/* Fixed mobile header layout with proper spacing */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reporting</h1>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:space-x-3 sm:gap-0">
          <div className="col-span-1">
            <PeriodSelector className="w-full" />
          </div>
          <div className="col-span-1">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
              Export Report
            </button>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {periodMetrics.map((metric, index) => {
          const Icon = metric.icon === 'TrendingUp' ? TrendingUp : metric.icon === 'Users' ? Users : metric.icon === 'TrendingDown' ? TrendingDown : Calendar;
          return (
            <div key={index} className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-').replace(' dark:text-', ' dark:bg-')}`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${metric.color}`} />
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}
                >
                  {metric.trend === 'up' ? '↗' : '↘'} {metric.value}
                </div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">{metric.title}</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{metric.description}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-48 lg:h-64 flex items-end justify-between space-x-1 lg:space-x-2">
            {chartData.map((height, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-blue-700 to-cyan-700 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height * 4}px` }}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mt-2">
            {period === 'last7days' || period === 'thisweek' ? (
              <>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </>
            ) : period === 'thismonth' || period === 'lastmonth' || period === 'last30days' ? (
              <>
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </>
            ) : (
              <>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </>
            )}
          </div>
        </div>
        {/* Top Performers */}
        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Clients</h3>
          <div className="space-y-3 lg:space-y-4">
            {periodTopPerformers.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{client.name}</div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">{formatCurrency(client.revenue)}</div>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm ml-2">{client.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Detailed Analytics */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Analytics</h3>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Revenue Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Subscription Revenue</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(analyticsBreakdown.subscriptionRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Transaction Fees</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(analyticsBreakdown.transactionFees)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Setup Fees</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(analyticsBreakdown.setupFees)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-zinc-800">
                  <span className="font-medium text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">User Engagement</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Daily Active Users</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.dailyActiveUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Session Duration</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.sessionDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Bounce Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.bounceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Conversion Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.conversionRate}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Event Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Total Events</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.totalEvents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Virtual Events</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.virtualEvents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Physical Events</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.physicalEvents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Avg. Attendance</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{analyticsBreakdown.avgAttendance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
