import React, { useState } from "react";
import { Search, Filter, Download, Mail, MoreHorizontal, Eye, UserCheck, UserX } from "lucide-react";
import { useNotifications } from "../../../../hooks/useNotifications";
import Popover from "../../../../components/Popover";
import LoadingButton from "../../../../components/LoadingButton";

const AttendeesPage: React.FC = () => {
  const { showSuccess, showInfo } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock attendees data
  const mockAttendees = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc.",
      status: "confirmed",
      registrationDate: "2024-02-15",
      eventName: "Tech Conference 2024",
      ticketType: "VIP",
      checkInStatus: "checked-in",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 987-6543",
      company: "Marketing Pro",
      status: "pending",
      registrationDate: "2024-02-18",
      eventName: "Virtual Marketing Summit",
      ticketType: "Standard",
      checkInStatus: "not-checked-in",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      phone: "+1 (555) 456-7890",
      company: "Innovation Labs",
      status: "confirmed",
      registrationDate: "2024-02-20",
      eventName: "Product Launch Event",
      ticketType: "Early Bird",
      checkInStatus: "checked-in",
    },
  ];

  const filteredAttendees = mockAttendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || attendee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getCheckInColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "not-checked-in":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const handleAttendeeAction = (action: string, attendee: any) => {
    switch (action) {
      case "view":
        showInfo("View Attendee", `Viewing details for ${attendee.name}.`);
        break;
      case "email":
        showSuccess("Email Sent", `Email sent to ${attendee.name}.`);
        break;
      case "check-in":
        showSuccess("Check-in Successful", `${attendee.name} has been checked in.`);
        break;
      case "cancel":
        showSuccess("Registration Cancelled", `${attendee.name}'s registration has been cancelled.`);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendees</h1>
        <LoadingButton onClick={() => showInfo("Export Attendees", "Exporting attendee list.")} variant="secondary" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export List</span>
        </LoadingButton>
      </div>

      {/* Attendee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockAttendees.length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Attendees</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockAttendees.filter((a) => a.status === "confirmed").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Confirmed</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockAttendees.filter((a) => a.checkInStatus === "checked-in").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Checked In</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockAttendees.filter((a) => a.status === "pending").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Pending</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{attendee.name}</div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">{attendee.email}</div>
                      <div className="text-xs text-gray-400 dark:text-zinc-500">{attendee.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{attendee.eventName}</div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">{attendee.ticketType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendee.status)}`}>{attendee.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCheckInColor(attendee.checkInStatus)}`}>{attendee.checkInStatus === "checked-in" ? "Checked In" : "Not Checked In"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDate(attendee.registrationDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover
                      trigger={
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      position="bottom-right"
                    >
                      <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleAttendeeAction("view", attendee)} />
                      <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleAttendeeAction("email", attendee)} />
                      {attendee.checkInStatus === "not-checked-in" && (
                        <PopoverMenuItem icon={<UserCheck className="w-4 h-4" />} label="Check In" onClick={() => handleAttendeeAction("check-in", attendee)} className="text-emerald-600 dark:text-emerald-400" />
                      )}
                      <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                      <PopoverMenuItem icon={<UserX className="w-4 h-4" />} label="Cancel Registration" onClick={() => handleAttendeeAction("cancel", attendee)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredAttendees.map((attendee) => (
            <div key={attendee.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{attendee.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{attendee.email}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{attendee.company}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendee.status)}`}>{attendee.status}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCheckInColor(attendee.checkInStatus)}`}>{attendee.checkInStatus === "checked-in" ? "Checked In" : "Not Checked In"}</span>
                  </div>
                </div>
                <Popover
                  trigger={
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  }
                  position="bottom-right"
                >
                  <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleAttendeeAction("view", attendee)} />
                  <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleAttendeeAction("email", attendee)} />
                  {attendee.checkInStatus === "not-checked-in" && (
                    <PopoverMenuItem icon={<UserCheck className="w-4 h-4" />} label="Check In" onClick={() => handleAttendeeAction("check-in", attendee)} className="text-emerald-600 dark:text-emerald-400" />
                  )}
                  <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                  <PopoverMenuItem icon={<UserX className="w-4 h-4" />} label="Cancel Registration" onClick={() => handleAttendeeAction("cancel", attendee)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeesPage;
