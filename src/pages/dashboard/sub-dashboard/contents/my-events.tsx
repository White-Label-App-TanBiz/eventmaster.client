import React, { useState } from 'react';
import { Calendar, Search, Filter, MapPin, Clock, Users, ExternalLink, Download, Star, CheckCircle } from 'lucide-react';

import { useNotifications } from '@/hooks';

import { LoadingButton } from '@/components/user-inputs/buttons';
import { mockUserEvents } from '@/data/mockData';

const MyEvents: React.FC = () => {
  const { showSuccess, showInfo } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredEvents = mockUserEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'attended':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'virtual':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400';
      case 'physical':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const handleEventAction = (action: string, event: any) => {
    switch (action) {
      case 'view':
        showInfo('Event Details', `Viewing details for "${event.title}".`);
        break;
      case 'join':
        showSuccess('Joining Event', `Opening "${event.title}" event link.`);
        break;
      case 'download-ticket':
        showSuccess('Ticket Downloaded', `Ticket for "${event.title}" has been downloaded.`);
        break;
      case 'cancel':
        showSuccess('Registration Cancelled', `Your registration for "${event.title}" has been cancelled.`);
        break;
      case 'rate':
        showInfo('Rate Event', `Opening rating form for "${event.title}".`);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-zinc-600'}`} />);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Events</h1>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockUserEvents.length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Events</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockUserEvents.filter((e) => e.status === 'registered').length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Upcoming</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockUserEvents.filter((e) => e.status === 'attended').length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Attended</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockUserEvents.filter((e) => e.type === 'virtual').length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Virtual Events</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Events</option>
                <option value="registered">Upcoming</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Event Header */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">{event.description}</p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(event.time)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                      <Users className="w-4 h-4" />
                      <span>Organized by {event.provider}</span>
                    </div>
                  </div>

                  {/* Status and Type Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>{event.status === 'registered' ? 'Upcoming' : event.status}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300">{event.ticketType}</span>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}</div>

                  {/* Rating (for attended events) */}
                  {event.status === 'attended' && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(event.rating || 0)}</div>
                      {!event.rating && (
                        <button onClick={() => handleEventAction('rate', event)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          Rate this event
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {event.status === 'registered' && isUpcoming(event.date) && (
                      <>
                        {event.type === 'virtual' ? (
                          <LoadingButton onClick={() => handleEventAction('join', event)} variant="primary" className="w-full flex items-center justify-center space-x-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>Join Event</span>
                          </LoadingButton>
                        ) : (
                          <LoadingButton onClick={() => handleEventAction('download-ticket', event)} variant="primary" className="w-full flex items-center justify-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Download Ticket</span>
                          </LoadingButton>
                        )}
                        <button
                          onClick={() => handleEventAction('cancel', event)}
                          className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Cancel Registration
                        </button>
                      </>
                    )}
                    {event.status === 'attended' && (
                      <LoadingButton onClick={() => handleEventAction('view', event)} variant="secondary" className="w-full flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>View Event Details</span>
                      </LoadingButton>
                    )}
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

export default MyEvents;
