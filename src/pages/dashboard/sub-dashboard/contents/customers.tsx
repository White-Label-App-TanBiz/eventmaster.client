import React, { useState } from 'react';
import { Search, Filter, Download, Mail, MoreHorizontal, Eye, UserCheck, UserX } from 'lucide-react';

import { useNotifications } from '@/hooks';

import { Popover } from '@/components/feedbacks';
import { LoadingButton } from '@/components/user-inputs/buttons';
import { mockCustomers } from '@/data/mockData';

const Customers: React.FC = () => {
  const { showSuccess, showInfo } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getCheckInColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'not-checked-in':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const handleCustomerAction = (action: string, customer: any) => {
    switch (action) {
      case 'view':
        showInfo('View Customer', `Viewing details for ${customer.name}.`);
        break;
      case 'email':
        showSuccess('Email Sent', `Email sent to ${customer.name}.`);
        break;
      case 'check-in':
        showSuccess('Check-in Successful', `${customer.name} has been checked in.`);
        break;
      case 'cancel':
        showSuccess('Registration Cancelled', `${customer.name}'s registration has been cancelled.`);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const PopoverMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
  }> = ({ icon, label, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <LoadingButton onClick={() => showInfo('Export Customers', 'Exporting customer list.')} variant="secondary" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export List</span>
        </LoadingButton>
      </div>
      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockCustomers.length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Customers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockCustomers.filter((a) => a.status === 'confirmed').length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Confirmed</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockCustomers.filter((a) => a.checkInStatus === 'checked-in').length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Checked In</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockCustomers.filter((a) => a.status === 'pending').length}</div>
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
                placeholder="Search customers..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">{customer.email}</div>
                      <div className="text-xs text-gray-400 dark:text-zinc-500">{customer.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.eventName}</div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">{customer.ticketType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>{customer.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCheckInColor(customer.checkInStatus)}`}>
                      {customer.checkInStatus === 'checked-in' ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDate(customer.registrationDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover
                      trigger={
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      position="bottom-right"
                    >
                      <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleCustomerAction('view', customer)} />
                      <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleCustomerAction('email', customer)} />
                      {customer.checkInStatus === 'not-checked-in' && (
                        <PopoverMenuItem
                          icon={<UserCheck className="w-4 h-4" />}
                          label="Check In"
                          onClick={() => handleCustomerAction('check-in', customer)}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      )}
                      <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                      <PopoverMenuItem
                        icon={<UserX className="w-4 h-4" />}
                        label="Cancel Registration"
                        onClick={() => handleCustomerAction('cancel', customer)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      />
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{customer.email}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{customer.company}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>{customer.status}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCheckInColor(customer.checkInStatus)}`}>
                      {customer.checkInStatus === 'checked-in' ? 'Checked In' : 'Not Checked In'}
                    </span>
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
                  <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleCustomerAction('view', customer)} />
                  <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleCustomerAction('email', customer)} />
                  {customer.checkInStatus === 'not-checked-in' && (
                    <PopoverMenuItem
                      icon={<UserCheck className="w-4 h-4" />}
                      label="Check In"
                      onClick={() => handleCustomerAction('check-in', customer)}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                  <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                  <PopoverMenuItem
                    icon={<UserX className="w-4 h-4" />}
                    label="Cancel Registration"
                    onClick={() => handleCustomerAction('cancel', customer)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  />
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
