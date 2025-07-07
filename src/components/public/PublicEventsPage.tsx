import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Search, Filter, MapPin, Clock, Users, Tag, ChevronDown, Calendar as CalendarIcon, List, Grid, ArrowRight } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { mockPublicEvents } from "../../data/mockPublicEvents";

type ViewMode = "grid" | "list" | "calendar";
type EventCategory = "all" | "business" | "technology" | "entertainment" | "education" | "health";

const PublicEventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = mockPublicEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;

    const isUpcoming = isAfter(parseISO(event.date), new Date());
    const matchesUpcoming = !showUpcoming || isUpcoming;

    return matchesSearch && matchesCategory && matchesUpcoming;
  });

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMMM d, yyyy");
  };

  const formatTime = (timeString: string) => {
    return format(parseISO(`2023-01-01T${timeString}`), "h:mm a");
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "virtual":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400";
      case "physical":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400";
      case "hybrid":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "technology":
        return "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-400";
      case "entertainment":
        return "bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400";
      case "education":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
      case "health":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "business", name: "Business & Professional" },
    { id: "technology", name: "Technology" },
    { id: "entertainment", name: "Entertainment & Media" },
    { id: "education", name: "Education" },
    { id: "health", name: "Health & Wellness" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Find and attend events that match your interests and connect with like-minded people</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for events, workshops, conferences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
            <input
              type="checkbox"
              id="upcoming-only"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
              className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="upcoming-only">Upcoming events only</label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-zinc-400">View:</span>
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "calendar" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
              aria-label="Calendar view"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent">
                <option value="all">Any time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This week</option>
                <option value="weekend">This weekend</option>
                <option value="month">This month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Event Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent">
                <option value="all">All Types</option>
                <option value="physical">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
              <input
                type="checkbox"
                id="upcoming-only-mobile"
                checked={showUpcoming}
                onChange={(e) => setShowUpcoming(e.target.checked)}
                className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="upcoming-only-mobile">Upcoming events only</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-xl">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Events Display */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{selectedCategory === "all" ? "All Events" : categories.find((c) => c.id === selectedCategory)?.name}</h2>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-zinc-400 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setShowUpcoming(true);
              }}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>{event.type}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>{event.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                      <p className="text-gray-600 dark:text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(event.time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-zinc-400">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {event.image && (
                        <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>{event.type}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>{event.category}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                        <p className="text-gray-600 dark:text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-zinc-400">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {viewMode === "calendar" && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar View</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Events organized by date</p>
                </div>

                {/* Group events by date */}
                {Array.from(new Set(filteredEvents.map((event) => event.date)))
                  .sort()
                  .map((date) => (
                    <div key={date} className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-700 dark:text-blue-400" />
                        {formatDate(date)}
                      </h4>
                      <div className="space-y-4">
                        {filteredEvents
                          .filter((event) => event.date === date)
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((event) => (
                            <Link key={event.id} to={`/events/${event.id}`} className="flex items-start p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                              <div className="flex-shrink-0 w-16 text-center">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(event.time)}</div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white">{event.title}</h5>
                                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>{event.type}</span>
                                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>{event.category}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                                  <MapPin className="w-3 h-3" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Events Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Events</h2>
          <Link to="/events?featured=true" className="flex items-center text-blue-700 dark:text-blue-400 hover:underline">
            <span>View all</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPublicEvents
            .filter((event) => event.featured)
            .slice(0, 3)
            .map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>{event.type}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>{event.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories
            .filter((c) => c.id !== "all")
            .map((category) => (
              <Link
                key={category.id}
                to={`/events?category=${category.id}`}
                className={`p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-shadow text-center ${getCategoryColor(category.id)
                  .replace("text-", "hover:bg-")
                  .replace("dark:text-", "dark:hover:bg-")
                  .replace("800", "50")
                  .replace("400", "900/10")}`}
              >
                <Tag className={`w-8 h-8 mx-auto mb-3 ${getCategoryColor(category.id).replace("bg-", "").replace("dark:bg-", "dark:")}`} />
                <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PublicEventsPage;
