import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CreditCard, Lock, Check, User, Mail, Phone, Building2, Shield } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { mockPublicEvents } from '../../data/mockPublicEvents';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  ticketType: string;
  quantity: number;
  specialRequirements?: string;
  agreeToTerms: boolean;
  // Payment details
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry: string;
}

const EventRegistrationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState(mockPublicEvents.find(e => e.id === eventId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    ticketType: '',
    quantity: 1,
    specialRequirements: '',
    agreeToTerms: false,
    // Payment details
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States'
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Find the event based on the ID
    const foundEvent = mockPublicEvents.find(e => e.id === eventId);
    setEvent(foundEvent);
    
    // Set default ticket type if available
    if (foundEvent && foundEvent.ticketTypes && foundEvent.ticketTypes.length > 0) {
      setFormData(prev => ({
        ...prev,
        ticketType: foundEvent.ticketTypes[0].type
      }));
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
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

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };

  const formatTime = (timeString: string) => {
    return format(parseISO(`2023-01-01T${timeString}`), 'h:mm a');
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (!event.ticketTypes) {
      return event.price * formData.quantity;
    }
    
    const selectedTicket = event.ticketTypes.find(ticket => ticket.type === formData.ticketType);
    return selectedTicket ? selectedTicket.price * formData.quantity : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/events/${eventId}/thank-you`, { 
        state: { 
          registrationDetails: {
            eventTitle: event.title,
            eventDate: formatDate(event.date),
            eventTime: formatTime(event.time),
            ticketType: formData.ticketType,
            quantity: formData.quantity,
            total: calculateTotal(),
            attendeeName: `${formData.firstName} ${formData.lastName}`,
            attendeeEmail: formData.email
          }
        }
      });
    }, 2000);
  };

  const getSelectedTicketPrice = () => {
    if (!event.ticketTypes) {
      return event.price;
    }
    
    const selectedTicket = event.ticketTypes.find(ticket => ticket.type === formData.ticketType);
    return selectedTicket ? selectedTicket.price : 0;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to={`/events/${eventId}`} 
          className="inline-flex items-center space-x-2 text-blue-700 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      {/* Registration Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Register for {event.title}</h1>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-gray-600 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Registration Steps */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
          }`}>
            {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
          </div>
          <div className={`w-16 h-1 ${
            currentStep > 1 ? 'bg-blue-700' : 'bg-gray-200 dark:bg-zinc-700'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
          }`}>
            {currentStep > 2 ? <Check className="w-5 h-5" /> : 2}
          </div>
          <div className={`w-16 h-1 ${
            currentStep > 2 ? 'bg-blue-700' : 'bg-gray-200 dark:bg-zinc-700'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 3 ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
          }`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-zinc-400">
          <span>Attendee Info</span>
          <span>Payment</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Registration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Attendee Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Job Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="Dietary restrictions, accessibility needs, etc."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      required
                      className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="agree-terms" className="text-sm text-gray-700 dark:text-zinc-300">
                      I agree to the <a href="#" className="text-blue-700 dark:text-blue-400 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-700 dark:text-blue-400 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-600 dark:text-zinc-400">Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                      <span className="text-sm text-gray-600 dark:text-zinc-400">We accept all major credit cards</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Expiration Date *
                      </label>
                      <input
                        type="text"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        required
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                        required
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Billing Country *
                    </label>
                    <select
                      value={formData.billingCountry}
                      onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl ml-auto ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : currentStep === 1 ? (
                  'Continue to Payment'
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>
        </div>

        <div>
          {/* Order Summary */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{formatDate(event.date)} at {formatTime(event.time)}</p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{event.location}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Ticket Type
                  </label>
                  <select
                    value={formData.ticketType}
                    onChange={(e) => handleInputChange('ticketType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    {event.ticketTypes ? (
                      event.ticketTypes.map((ticket, index) => (
                        <option key={index} value={ticket.type}>
                          {ticket.type} - {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                        </option>
                      ))
                    ) : (
                      <option value="standard">Standard - ${event.price}</option>
                    )}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Quantity
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-zinc-400">Price per ticket</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getSelectedTicketPrice() === 0 ? 'Free' : `$${getSelectedTicketPrice()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-zinc-400">Quantity</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.quantity}</span>
                </div>
                {getSelectedTicketPrice() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-zinc-400">Service Fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">$2.50</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-zinc-800">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {calculateTotal() === 0 ? 'Free' : `$${calculateTotal() + (getSelectedTicketPrice() > 0 ? 2.50 : 0)}`}
                  </span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 dark:text-zinc-400 flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Secure checkout powered by EventMaster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;