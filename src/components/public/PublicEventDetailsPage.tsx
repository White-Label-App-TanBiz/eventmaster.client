import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Tag, Share2, Heart, ChevronDown, ChevronUp, ArrowLeft, ExternalLink, Mail, Phone, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { format, parseISO, addHours } from "date-fns";
import { mockPublicEvents } from "../../data/mockPublicEvents";

const PublicEventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState(mockPublicEvents.find((e) => e.id === eventId));
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Find the event based on the ID
    const foundEvent = mockPublicEvents.find((e) => e.id === eventId);
    setEvent(foundEvent);
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (timeString: string) => {
    const startTime = parseISO(`2023-01-01T${timeString}`);
    const endTime = addHours(startTime, 2); // Assuming 2 hours duration
    return `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`;
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Link to="/events" className="inline-flex items-center space-x-2 text-blue-700 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>

      {/* Event Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {event.image && (
          <div className="h-64 md:h-96 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>{event.type}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>{event.category}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400">
              <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400">
              <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <span>{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400">
              <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-zinc-400">
                <Users className="w-5 h-5" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full border ${isFavorite ? "border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"} transition-colors`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>

              <button onClick={handleShare} className="p-2 rounded-full border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors" aria-label="Share event">
                <Share2 className="w-5 h-5" />
              </button>

              <Link to={`/events/${event.id}/register`} className="px-6 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-base font-medium transition-all shadow-lg hover:shadow-xl">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
            <div className={`prose dark:prose-invert max-w-none ${!showFullDescription && "line-clamp-6"}`}>
              <p className="text-gray-700 dark:text-zinc-300">{event.description}</p>

              {/* Additional description content */}
              {event.longDescription && (
                <div className="mt-4">
                  {event.longDescription.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-zinc-300 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {(event.description.length > 300 || event.longDescription) && (
              <button onClick={() => setShowFullDescription(!showFullDescription)} className="mt-4 flex items-center space-x-2 text-blue-700 dark:text-blue-400 hover:underline">
                <span>{showFullDescription ? "Show less" : "Read more"}</span>
                {showFullDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Schedule */}
          {event.schedule && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Schedule</h2>
              <div className="space-y-6">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-24 text-right pr-4 text-gray-500 dark:text-zinc-400">{item.time}</div>
                    <div className="flex-grow pl-4 border-l border-gray-200 dark:border-zinc-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{item.description}</p>}
                      {item.speaker && <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Speaker: {item.speaker}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex space-x-4">
                    {speaker.image ? (
                      <img src={speaker.image} alt={speaker.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <span className="text-blue-700 dark:text-blue-400 text-xl font-bold">{speaker.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{speaker.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{speaker.title}</p>
                      {speaker.bio && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2">{speaker.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Registration Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Registration</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-zinc-400">Price</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</span>
              </div>

              {event.ticketTypes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Ticket Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent">
                    {event.ticketTypes.map((ticket, index) => (
                      <option key={index} value={ticket.type}>
                        {ticket.type} - {ticket.price === 0 ? "Free" : `$${ticket.price}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Link to={`/events/${event.id}/register`} className="w-full block text-center px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-base font-medium transition-all shadow-lg hover:shadow-xl">
                Register Now
              </Link>

              <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
                {event.capacity && (
                  <p>
                    {event.capacity - event.attendees} spots remaining out of {event.capacity}
                  </p>
                )}
                <p className="mt-1">Registration ends on {format(parseISO(event.registrationEndDate || event.date), "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Organizer</h2>
            <div className="flex items-center space-x-4 mb-4">
              {event.organizerImage ? (
                <img src={event.organizerImage} alt={event.organizer} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-blue-700 dark:text-blue-400 text-xl font-bold">{event.organizer.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{event.organizer}</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Event Organizer</p>
              </div>
            </div>

            {event.organizerDescription && <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">{event.organizerDescription}</p>}

            <div className="space-y-2">
              {event.organizerEmail && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${event.organizerEmail}`} className="hover:text-blue-700 dark:hover:text-blue-400">
                    {event.organizerEmail}
                  </a>
                </div>
              )}

              {event.organizerPhone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${event.organizerPhone}`} className="hover:text-blue-700 dark:hover:text-blue-400">
                    {event.organizerPhone}
                  </a>
                </div>
              )}

              {event.organizerWebsite && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                  <Globe className="w-4 h-4" />
                  <a href={event.organizerWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 dark:hover:text-blue-400 flex items-center">
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {event.organizerSocial && (
              <div className="mt-4 flex space-x-4">
                {event.organizerSocial.facebook && (
                  <a href={event.organizerSocial.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {event.organizerSocial.twitter && (
                  <a href={event.organizerSocial.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {event.organizerSocial.instagram && (
                  <a href={event.organizerSocial.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {event.organizerSocial.linkedin && (
                  <a href={event.organizerSocial.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          {event.type !== "virtual" && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                  {/* Placeholder for map */}
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{event.venue || event.location}</h3>
                  {event.address && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{event.address}</p>}
                  {event.directions && (
                    <div className="mt-2">
                      <a href={event.directions} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 dark:text-blue-400 hover:underline flex items-center">
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Events */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPublicEvents
            .filter((e) => e.id !== event.id && e.category === event.category)
            .slice(0, 3)
            .map((similarEvent) => (
              <Link key={similarEvent.id} to={`/events/${similarEvent.id}`} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
                {similarEvent.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={similarEvent.image} alt={similarEvent.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{similarEvent.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(similarEvent.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{similarEvent.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{similarEvent.price === 0 ? "Free" : `$${similarEvent.price}`}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetailsPage;
