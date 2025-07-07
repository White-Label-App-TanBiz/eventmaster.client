import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Tag, Users, DollarSign, Image, Save, X, Plus, Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useLoadingState } from '../hooks/useLoadingState';

interface EventFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  address?: string;
  type: 'virtual' | 'physical' | 'hybrid';
  category: 'business' | 'technology' | 'entertainment' | 'education' | 'health';
  price: number;
  capacity: number;
  image?: string;
  ticketTypes: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  schedule: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  registrationEndDate: string;
}

interface AddEventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { showError } = useNotifications();
  const { isLoading, withLoading } = useLoadingState();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    endTime: '17:00',
    location: '',
    address: '',
    type: 'physical',
    category: 'business',
    price: 0,
    capacity: 100,
    image: '',
    ticketTypes: [{ type: 'General Admission', price: 0, description: 'Standard entry to the event' }],
    schedule: [{ time: '09:00', title: 'Event Start', description: '' }],
    registrationEndDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketTypeChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedTicketTypes = [...prev.ticketTypes];
      updatedTicketTypes[index] = {
        ...updatedTicketTypes[index],
        [field]: value
      };
      return {
        ...prev,
        ticketTypes: updatedTicketTypes
      };
    });
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { type: '', price: 0, description: '' }]
    }));
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length <= 1) {
      showError('Cannot remove', 'You must have at least one ticket type.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const handleScheduleChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedSchedule = [...prev.schedule];
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [field]: value
      };
      return {
        ...prev,
        schedule: updatedSchedule
      };
    });
  };

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: '', title: '', description: '' }]
    }));
  };

  const removeScheduleItem = (index: number) => {
    if (formData.schedule.length <= 1) {
      showError('Cannot remove', 'You must have at least one schedule item.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      showError('Title required', 'Please enter an event title.');
      return;
    }
    
    if (!formData.description.trim()) {
      showError('Description required', 'Please enter an event description.');
      return;
    }
    
    if (!formData.location.trim()) {
      showError('Location required', 'Please enter an event location.');
      return;
    }
    
    // Validate ticket types
    const hasEmptyTicketType = formData.ticketTypes.some(ticket => !ticket.type.trim());
    if (hasEmptyTicketType) {
      showError('Invalid ticket type', 'All ticket types must have a name.');
      return;
    }
    
    // Validate schedule items
    const hasEmptyScheduleItem = formData.schedule.some(item => !item.time.trim() || !item.title.trim());
    if (hasEmptyScheduleItem) {
      showError('Invalid schedule item', 'All schedule items must have a time and title.');
      return;
    }
    
    try {
      await withLoading('submit-event', async () => {
        onSubmit(formData);
      });
    } catch (error) {
      console.error('Error submitting event:', error);
      showError('Submission failed', 'There was an error submitting the event. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="e.g., Tech Conference 2024"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Provide a detailed description of your event..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Event Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                required
              >
                <option value="physical">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                required
              >
                <option value="business">Business & Professional</option>
                <option value="technology">Technology</option>
                <option value="entertainment">Entertainment & Media</option>
                <option value="education">Education</option>
                <option value="health">Health & Wellness</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Date and Time</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Event Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                End Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Registration End Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={formData.registrationEndDate}
                onChange={(e) => handleInputChange('registrationEndDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              This is the last date attendees can register for your event.
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Location</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Location / Venue Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder={formData.type === 'virtual' ? 'Online' : 'e.g., San Francisco Convention Center'}
                required
              />
            </div>
          </div>
          
          {formData.type !== 'virtual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="Full address of the venue"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tickets and Capacity */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tickets and Capacity</h3>
          <button
            type="button"
            onClick={addTicketType}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ticket Type</span>
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Event Capacity *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                min="1"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              Maximum number of attendees allowed for this event.
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Ticket Types *
            </label>
            
            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Ticket #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Ticket Name *
                    </label>
                    <input
                      type="text"
                      value={ticket.type}
                      onChange={(e) => handleTicketTypeChange(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="e.g., General Admission, VIP, Early Bird"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => handleTicketTypeChange(index, 'price', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={ticket.description || ''}
                    onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="Describe what's included with this ticket"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Schedule</h3>
          <button
            type="button"
            onClick={addScheduleItem}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule Item</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.schedule.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Item #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleScheduleChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="e.g., Opening Ceremony, Workshop, Lunch Break"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="Brief description of this schedule item"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Speaker (if applicable)
                </label>
                <input
                  type="text"
                  value={item.speaker || ''}
                  onChange={(e) => handleScheduleChange(index, 'speaker', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="Name and title of the speaker"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading('submit-event')}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          {isLoading('submit-event') ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddEventForm;