import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Download, Mail, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { mockPublicEvents } from '../../data/mockPublicEvents';

interface RegistrationDetails {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  ticketType: string;
  quantity: number;
  total: number;
  attendeeName: string;
  attendeeEmail: string;
}

const RegistrationThankYouPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const registrationDetails = location.state?.registrationDetails as RegistrationDetails;
  const event = mockPublicEvents.find(e => e.id === eventId);
  
  // Generate a random confirmation number
  const confirmationNumber = `EM-${Math.floor(100000 + Math.random() * 900000)}`;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If no registration details are available, redirect to the event page
    if (!registrationDetails && eventId) {
      navigate(`/events/${eventId}`);
    }
  }, [registrationDetails, eventId, navigate]);

  if (!event || !registrationDetails) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Registration</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">We couldn't find your registration details.</p>
        <Link 
          to="/events" 
          className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const handleDownloadTicket = () => {
    alert('Ticket download functionality would be implemented here.');
  };

  const handleAddToCalendar = () => {
    alert('Add to calendar functionality would be implemented here.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${event.title}`,
        text: `I'm attending ${event.title} on ${registrationDetails.eventDate}. Join me!`,
        url: window.location.origin + `/events/${eventId}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/events/${eventId}`);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Registration Successful!
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-zinc-400 mb-2">
          You're all set for {event.title}
        </p>
        
        <p className="text-gray-500 dark:text-zinc-500">
          A confirmation email has been sent to {registrationDetails.attendeeEmail}
        </p>
      </div>

      {/* Ticket Information */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-700 to-cyan-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Event Ticket</h2>
          <p className="opacity-90">Confirmation #{confirmationNumber}</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Date</p>
                  <p className="text-gray-600 dark:text-zinc-400">{registrationDetails.eventDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Time</p>
                  <p className="text-gray-600 dark:text-zinc-400">{registrationDetails.eventTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-600 dark:text-zinc-400">{event.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Attendee</p>
                <p className="text-gray-600 dark:text-zinc-400">{registrationDetails.attendeeName}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Ticket Type</p>
                <p className="text-gray-600 dark:text-zinc-400">{registrationDetails.ticketType} x {registrationDetails.quantity}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Order Total</p>
                <p className="text-gray-600 dark:text-zinc-400">
                  {registrationDetails.total === 0 ? 'Free' : `$${registrationDetails.total}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadTicket}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Ticket</span>
            </button>
            
            <button
              onClick={handleAddToCalendar}
              className="flex items-center space-x-2 px-4 py-2 border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Calendar</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Important Information</h3>
        
        <div className="space-y-4 text-gray-700 dark:text-zinc-300">
          <p>Please arrive 15 minutes before the event starts to check in. You'll need to show your ticket (printed or digital) and a valid ID that matches the registration name.</p>
          
          {event.type === 'virtual' && (
            <p>You'll receive an email with the link to join the virtual event 24 hours before it starts. Make sure to check your spam folder if you don't see it.</p>
          )}
          
          <p>If you have any questions or need to make changes to your registration, please contact us at support@eventmaster.com or call (555) 123-4567.</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Check your email</p>
              <p className="text-sm text-gray-600 dark:text-zinc-400">We've sent a confirmation email with all the details to {registrationDetails.attendeeEmail}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Save the date</p>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Add this event to your calendar so you don't miss it</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Prepare for the event</p>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Review any pre-event materials or requirements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          to={`/events/${eventId}`}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event</span>
        </Link>
        
        <Link 
          to="/events"
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RegistrationThankYouPage;