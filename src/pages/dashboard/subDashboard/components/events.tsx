import React, { useState } from "react";
import { Calendar, Plus, Search, Filter, MapPin, Users, Clock, MoreHorizontal, Edit, Eye, Trash2, Copy, Share2 } from "lucide-react";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import Popover from "../../../../components/Popover";
import LoadingButton from "../../../../components/LoadingButton";
import Modal from "../../../../components/Modal";
import AddEventForm from "../../../../components/AddEventForm";

const Events: React.FC = () => {
  const { showSuccess, showInfo } = useNotifications();
  const { confirm, isOpen, options, handleConfirm, handleCancel, isLoading: confirmationLoading } = useConfirmation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Mock events data
  const mockEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring the latest innovations",
      date: "2024-03-15",
      time: "09:00",
      endTime: "17:00",
      location: "San Francisco Convention Center",
      type: "physical",
      status: "published",
      customers: 250,
      maxCustomers: 500,
      price: 299,
      provider: "Michael Chen",
      ticketTypes: [
        { type: "Early Bird", price: 199, description: "Limited availability" },
        { type: "Standard", price: 299, description: "Regular admission" },
        { type: "VIP", price: 499, description: "VIP access with exclusive perks" },
      ],
      schedule: [
        { time: "09:00", title: "Registration", description: "Check-in and badge pickup" },
        { time: "10:00", title: "Opening Keynote", description: "Welcome address", speaker: "Sarah Johnson" },
        { time: "12:00", title: "Lunch Break", description: "Networking lunch" },
      ],
      registrationEndDate: "2024-03-14",
    },
    {
      id: "2",
      title: "Virtual Marketing Summit",
      description: "Learn the latest marketing strategies from industry experts",
      date: "2024-03-20",
      time: "14:00",
      endTime: "18:00",
      location: "Online",
      type: "virtual",
      status: "draft",
      customers: 0,
      maxCustomers: 1000,
      price: 0,
      provider: "Sarah Johnson",
      ticketTypes: [
        { type: "Free Access", price: 0, description: "Standard access" },
        { type: "Premium", price: 49, description: "Includes workshop materials and recordings" },
      ],
      schedule: [
        { time: "14:00", title: "Welcome", description: "Introduction to the summit" },
        { time: "14:15", title: "Digital Marketing Trends", description: "Overview of current trends", speaker: "John Smith" },
      ],
      registrationEndDate: "2024-03-19",
    },
    {
      id: "3",
      title: "Product Launch Event",
      description: "Exclusive launch event for our new product line",
      date: "2024-03-25",
      time: "18:00",
      endTime: "21:00",
      location: "New York City",
      type: "physical",
      status: "published",
      customers: 150,
      maxCustomers: 200,
      price: 150,
      provider: "Michael Chen",
      ticketTypes: [
        { type: "Standard", price: 150, description: "Regular admission" },
        { type: "VIP", price: 250, description: "VIP access with product samples" },
      ],
      schedule: [
        { time: "18:00", title: "Doors Open", description: "Welcome drinks" },
        { time: "19:00", title: "Product Reveal", description: "Official unveiling", speaker: "Emma Rodriguez" },
      ],
      registrationEndDate: "2024-03-24",
    },
  ];

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "draft":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "virtual":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "physical":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400";
      case "hybrid":
        return "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const handleEventAction = (action: string, event: any) => {
    switch (action) {
      case "edit":
        setEditingEvent(event);
        setShowAddModal(true);
        break;
      case "view":
        showInfo("View Event", `Viewing details for "${event.title}".`);
        break;
      case "duplicate":
        showSuccess("Event Duplicated", `Created a copy of "${event.title}".`);
        break;
      case "share":
        showSuccess("Share Link Copied", `Share link for "${event.title}" copied to clipboard.`);
        break;
      case "delete":
        confirm(
          {
            title: "Delete Event",
            message: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
            confirmText: "Delete Event",
            cancelText: "Cancel",
            type: "danger",
          },
          () => {
            showSuccess("Event Deleted", `"${event.title}" has been deleted.`);
          },
        );
        break;
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const handleSubmitEvent = (eventData: any) => {
    if (editingEvent) {
      showSuccess("Event Updated", `"${eventData.title}" has been updated successfully.`);
    } else {
      showSuccess("Event Created", `"${eventData.title}" has been created successfully.`);
    }
    setShowAddModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PopoverMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
  }> = ({ icon, label, onClick, className = "" }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${className}`}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
        <LoadingButton onClick={handleAddEvent} variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </LoadingButton>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockEvents.length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Events</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockEvents.filter((e) => e.status === "published").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Published</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockEvents.reduce((sum, e) => sum + e.customers, 0)}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Customers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockEvents.filter((e) => e.type === "virtual").length}</div>
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
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
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
              <div key={event.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">{event.description}</p>
                  </div>
                  <Popover
                    trigger={
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    position="bottom-right"
                  >
                    <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleEventAction("view", event)} />
                    <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Event" onClick={() => handleEventAction("edit", event)} />
                    <PopoverMenuItem icon={<Copy className="w-4 h-4" />} label="Duplicate" onClick={() => handleEventAction("duplicate", event)} />
                    <PopoverMenuItem icon={<Share2 className="w-4 h-4" />} label="Share" onClick={() => handleEventAction("share", event)} />
                    <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                    <PopoverMenuItem icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={() => handleEventAction("delete", event)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                  </Popover>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.time} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.customers} / {event.maxCustomers} customers
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>{event.status}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={editingEvent ? "Edit Event" : "Create New Event"} size="xl">
        <AddEventForm initialData={editingEvent} onSubmit={handleSubmitEvent} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Confirmation Modal */}
      {isOpen && options && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCancel}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 transform transition-all">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{options.title}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">{options.message}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none"
                  >
                    {options.cancelText || "Cancel"}
                  </button>
                  <button onClick={handleConfirm} disabled={confirmationLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none">
                    {confirmationLoading ? "Processing..." : options.confirmText || "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
