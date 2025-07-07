import React from "react";
import { TrendingUp, Users, DollarSign, Activity, Calendar, UserCheck, ArrowUpRight, ArrowDownRight, Package, CreditCard, MapPin, Clock, BarChart3, MessageSquare, Search, ArrowRight, Ticket, Star, CheckCircle, Bell } from "lucide-react";
import PageLayout from "../../layouts/page";
import { mockAnalytics } from "../../data/mockData";
import { useCurrency } from "../../contexts/CurrencyContext";
import { UserRole, useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import LoadingButton from "../../components/LoadingButton";

const NewDashboard: React.FC = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { showInfo } = useNotifications();

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

  const recentActivities = [
    { action: "New Customer registered", company: "TechCorp Events", time: "2 hours ago" },
    { action: "Payment received", company: "Innovate Solutions", time: "4 hours ago" },
    { action: "API license renewed", company: "EventPro Agency", time: "6 hours ago" },
    { action: "New event created", company: "Global Events Ltd", time: "8 hours ago" },
    { action: "Customer upgraded plan", company: "Event Masters", time: "12 hours ago" },
  ];

  const revenueBreakdown = [
    { plan: "Enterprise", revenue: 23400, percentage: 51, color: "bg-gradient-to-r from-blue-700 to-cyan-700" },
    { plan: "Professional", revenue: 15680, percentage: 34, color: "bg-cyan-700" },
    { plan: "Starter", revenue: 6700, percentage: 15, color: "bg-emerald-600" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = (role: UserRole) => {
    switch (role) {
      case "client_admin":
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
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          stat.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                        }`}
                      >
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
            {/* Quick Actions */}
            <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-center cursor-pointer">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Organizers</span>
                </div>
                <div className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors text-center cursor-pointer">
                  <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Product Plans</span>
                </div>
                <div className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-center cursor-pointer">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Payment Gateways</span>
                </div>
                <div className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors text-center cursor-pointer">
                  <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "organizer":
        const organizerStats = [
          {
            title: "Total Events",
            value: "12",
            change: "+3",
            trend: "up",
            icon: Calendar,
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Total Attendees",
            value: "1,250",
            change: "+125",
            trend: "up",
            icon: UserCheck,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            title: "Revenue",
            value: "$15,750",
            change: "+8.2%",
            trend: "up",
            icon: DollarSign,
            color: "text-purple-600 dark:text-purple-400",
          },
          {
            title: "Conversion Rate",
            value: "3.8%",
            change: "+0.5%",
            trend: "up",
            icon: Activity,
            color: "text-orange-600 dark:text-orange-400",
          },
        ];

        const upcomingEvents = [
          {
            id: "1",
            title: "Tech Conference 2024",
            date: "2024-03-15",
            time: "09:00",
            location: "San Francisco Convention Center",
            attendees: 250,
            maxAttendees: 500,
          },
          {
            id: "2",
            title: "Virtual Marketing Summit",
            date: "2024-03-20",
            time: "14:00",
            location: "Online",
            attendees: 180,
            maxAttendees: 1000,
          },
          {
            id: "3",
            title: "Product Launch Event",
            date: "2024-03-25",
            time: "18:00",
            location: "New York City",
            attendees: 150,
            maxAttendees: 200,
          },
        ];

        const recentRegistrations = [
          { name: "John Smith", email: "john@example.com", event: "Tech Conference 2024", time: "2 hours ago" },
          { name: "Jane Doe", email: "jane@example.com", event: "Virtual Marketing Summit", time: "4 hours ago" },
          { name: "Bob Wilson", email: "bob@example.com", event: "Product Launch Event", time: "6 hours ago" },
          { name: "Alice Johnson", email: "alice@example.com", event: "Tech Conference 2024", time: "8 hours ago" },
        ];

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organizer Dashboard</h1>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {organizerStats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
                return (
                  <div key={index} className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace("text-", "bg-").replace(" dark:text-", " dark:bg-")}`}>
                        <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                      </div>
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          stat.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                        }`}
                      >
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
              {/* Upcoming Events */}
              <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
                  <button onClick={() => showInfo("View All Events", "Navigating to events page.")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{event.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.attendees} / {event.maxAttendees} attendees
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Registrations */}
              <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Registrations</h2>
                  <button onClick={() => showInfo("View All Attendees", "Navigating to attendees page.")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentRegistrations.map((registration, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-700 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{registration.name}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-zinc-400">{registration.email}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">{registration.time}</p>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{registration.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
                <button onClick={() => showInfo("View Analytics", "Navigating to analytics page.")} className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  <BarChart3 className="w-4 h-4" />
                  <span>View Detailed Analytics</span>
                </button>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[35, 45, 30, 25, 40, 50, 60, 45, 50, 55, 70, 65].map((height, index) => (
                  <div key={index} className="flex-1 bg-gradient-to-t from-blue-700 to-cyan-700 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height * 2}px` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mt-2">
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
              </div>
            </div>
          </div>
        );
      case "admin":
        const adminStats = [
          {
            title: "Assigned Events",
            value: "5",
            icon: Calendar,
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Total Attendees",
            value: "850",
            icon: Users,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            title: "Check-ins Today",
            value: "42",
            icon: CheckCircle,
            color: "text-purple-600 dark:text-purple-400",
          },
        ];

        const adminUpcomingEvents = [
          {
            id: "1",
            title: "Tech Conference 2024",
            date: "2024-03-15",
            time: "09:00",
            location: "San Francisco Convention Center",
            attendees: 250,
            maxAttendees: 500,
            role: "Check-in Manager",
          },
          {
            id: "2",
            title: "Virtual Marketing Summit",
            date: "2024-03-20",
            time: "14:00",
            location: "Online",
            attendees: 180,
            maxAttendees: 1000,
            role: "Attendee Support",
          },
          {
            id: "3",
            title: "Product Launch Event",
            date: "2024-03-25",
            time: "18:00",
            location: "New York City",
            attendees: 150,
            maxAttendees: 200,
            role: "Event Assistant",
          },
        ];

        const adminRecentActivities = [
          { action: "Checked in attendee", name: "John Smith", event: "Tech Conference 2024", time: "2 hours ago" },
          { action: "Answered support question", name: "Jane Doe", event: "Virtual Marketing Summit", time: "4 hours ago" },
          { action: "Updated event details", event: "Product Launch Event", time: "6 hours ago" },
          { action: "Added new attendee", name: "Bob Wilson", event: "Tech Conference 2024", time: "8 hours ago" },
        ];

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {adminStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace("text-", "bg-").replace(" dark:text-", " dark:bg-")}`}>
                        <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">{stat.title}</p>
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assigned Events */}
              <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Events</h2>
                  <button onClick={() => showInfo("View All Events", "Navigating to events page.")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {adminUpcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{event.title}</h3>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 text-xs font-medium rounded-full">{event.role}</div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-zinc-400">Attendees</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {event.attendees} / {event.maxAttendees}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Activities */}
              <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
                <div className="space-y-4">
                  {adminRecentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.action.includes("Checked in") ? (
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : activity.action.includes("Answered") ? (
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        ) : activity.action.includes("Updated") ? (
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action} {activity.name && <span className="font-semibold">{activity.name}</span>}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-blue-600 dark:text-blue-400">{activity.event}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => showInfo("Check-in Attendee", "Opening check-in interface.")}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-center"
                >
                  <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Check-in Attendee</span>
                </button>
                <button
                  onClick={() => showInfo("View Events", "Navigating to events page.")}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors text-center"
                >
                  <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">View Events</span>
                </button>
                <button
                  onClick={() => showInfo("Manage Attendees", "Navigating to attendees page.")}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-center"
                >
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Attendees</span>
                </button>
                <button
                  onClick={() => showInfo("Support Chat", "Opening support chat interface.")}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors text-center"
                >
                  <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Support Chat</span>
                </button>
              </div>
            </div>
          </div>
        );
      case "attendee":
        const attendeeUpcomingEvents = [
          {
            id: "1",
            title: "Tech Conference 2024",
            date: "2024-03-15",
            time: "09:00",
            location: "San Francisco Convention Center",
            type: "physical",
            ticketType: "VIP",
          },
          {
            id: "2",
            title: "Virtual Marketing Summit",
            date: "2024-03-20",
            time: "14:00",
            location: "Online",
            type: "virtual",
            ticketType: "Standard",
          },
        ];

        const recommendedEvents = [
          {
            id: "3",
            title: "Web Development Workshop",
            date: "2024-04-05",
            time: "10:00",
            location: "Online",
            type: "virtual",
            price: 99,
            organizer: "Dev Academy",
            rating: 4.8,
          },
          {
            id: "4",
            title: "Networking Mixer",
            date: "2024-04-10",
            time: "18:00",
            location: "Chicago Downtown",
            type: "physical",
            price: 25,
            organizer: "Business Connect",
            rating: 4.5,
          },
          {
            id: "5",
            title: "AI in Business Seminar",
            date: "2024-04-15",
            time: "13:00",
            location: "Online",
            type: "virtual",
            price: 0,
            organizer: "Future Tech Institute",
            rating: 4.7,
          },
        ];

        const notifications = [
          { message: "Your ticket for Tech Conference 2024 is ready", time: "1 day ago" },
          { message: "Virtual Marketing Summit starts in 3 days", time: "2 days ago" },
          { message: "New recommended events based on your interests", time: "3 days ago" },
        ];

        const renderStars = (rating: number) => {
          return (
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : i < rating ? "text-yellow-400 fill-current opacity-50" : "text-gray-300 dark:text-zinc-600"}`} />
              ))}
              <span className="ml-1 text-xs text-gray-600 dark:text-zinc-400">{rating.toFixed(1)}</span>
            </div>
          );
        };

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h1>
            </div>
            {/* Search Events */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Your Next Event</h2>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for events, workshops, conferences..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>
                <LoadingButton onClick={() => showInfo("Search Events", "Searching for events.")} variant="primary" className="md:w-auto">
                  Search Events
                </LoadingButton>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Events */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Upcoming Events</h2>
                  <button onClick={() => showInfo("View All Events", "Navigating to my events page.")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                {attendeeUpcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {attendeeUpcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                event.type === "virtual" ? "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400" : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                              }`}
                            >
                              {event.type}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">{event.ticketType}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          {event.type === "virtual" ? (
                            <button
                              onClick={() => showInfo("Join Event", `Opening ${event.title} virtual event.`)}
                              className="px-3 py-1 text-sm bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all"
                            >
                              Join Event
                            </button>
                          ) : (
                            <button
                              onClick={() => showInfo("View Ticket", `Viewing ticket for ${event.title}.`)}
                              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all"
                            >
                              <Ticket className="w-3 h-3" />
                              <span>View Ticket</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-zinc-400 mb-4">You don't have any upcoming events</p>
                    <button onClick={() => showInfo("Explore Events", "Navigating to event discovery.")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                      Explore Events
                    </button>
                  </div>
                )}
              </div>
              {/* Notifications */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                  <button onClick={() => showInfo("Mark All Read", "Marking all notifications as read.")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Mark All Read
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex-shrink-0">
                          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-zinc-400">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
            {/* Recommended Events */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>By {event.organizer}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.type === "virtual" ? "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400" : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                          }`}
                        >
                          {event.type}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                      </div>
                      {renderStars(event.rating)}
                    </div>
                    <button
                      onClick={() => showInfo("Register", `Opening registration for ${event.title}.`)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-sm transition-all"
                    >
                      Register Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Support Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h2>
                  <p className="text-gray-600 dark:text-zinc-400 max-w-lg">Our support team is here to help with any questions about events, registration, or technical issues.</p>
                </div>
                <button onClick={() => showInfo("Contact Support", "Opening support chat.")} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
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
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          stat.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                        }`}
                      >
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
    }
  };

  return <PageLayout>{renderContent(user?.role || "super_admin")}</PageLayout>;
};

export default NewDashboard;
