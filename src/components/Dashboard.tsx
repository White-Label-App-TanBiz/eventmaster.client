import React from "react";
import { TrendingUp, Users, DollarSign, Activity, Calendar, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { mockAnalytics } from "../data/mockData";
import { useCurrency } from "../contexts/CurrencyContext";

const Dashboard: React.FC = () => {
  const { formatCurrency } = useCurrency();

  // Use base analytics data without period filtering
  const analytics = mockAnalytics;
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(analytics.monthlyRecurringRevenue),
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-700 dark:text-blue-400",
    },
    {
      title: "Active Customers",
      value: analytics.activeClientAdmins.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-cyan-700 dark:text-cyan-400",
    },
    {
      title: "Total Events",
      value: analytics.totalEvents.toLocaleString(),
      change: "+23.1%",
      trend: "up",
      icon: Calendar,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Total Attendees",
      value: analytics.totalAttendees.toLocaleString(),
      change: "+18.7%",
      trend: "up",
      icon: UserCheck,
      color: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Churn Rate",
      value: `${analytics.churnRate}%`,
      change: "-0.8%",
      trend: "down",
      icon: Activity,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  // Static activity data
  const recentActivities = [
    { action: "New Customer registered", company: "TechCorp Events", time: "2 hours ago" },
    { action: "Payment received", company: "Innovate Solutions", time: "4 hours ago" },
    { action: "API license renewed", company: "EventPro Agency", time: "6 hours ago" },
    { action: "New event created", company: "Global Events Ltd", time: "8 hours ago" },
    { action: "Customer upgraded plan", company: "Event Masters", time: "12 hours ago" },
  ];

  // Static revenue breakdown
  const revenueBreakdown = [
    { plan: "Enterprise", revenue: 23400, percentage: 51, color: "bg-gradient-to-r from-blue-700 to-cyan-700" },
    { plan: "Professional", revenue: 15680, percentage: 34, color: "bg-cyan-700" },
    { plan: "Starter", revenue: 6700, percentage: 15, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={index} className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace("text-", "bg-").replace(" dark:text-", " dark:bg-")}`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {activity.company} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.plan}</span>
                  <span className="text-sm text-gray-500 dark:text-zinc-400">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
