import React, { useState } from "react";
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter, Download, Mail, Phone, CreditCard, Play, Pause } from "lucide-react";
import { mockClientAdmins } from "../../../../data/mockData";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import Modal from "../../../../components/Modal";
import Popover from "../../../../components/Popover";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import LoadingButton from "../../../../components/LoadingButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const OrganizersPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [organizers, setOrganizers] = useState(mockClientAdmins);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrganizerForModal, setSelectedOrganizerForModal] = useState<any>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "email" | "billing">("view");

  const filteredOrganizers = organizers.filter((organizer) => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) || organizer.email.toLowerCase().includes(searchTerm.toLowerCase()) || organizer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || organizer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Simple organizer statistics without period filtering
  const getOrganizerStats = () => {
    return {
      totalOrganizers: organizers.length,
      activeOrganizers: organizers.filter((c) => c.status === "active").length,
      newOrganizers: Math.floor(organizers.length * 0.15), // 15% are new
      totalRevenue: organizers.reduce((sum, c) => sum + c.billing.amount, 0),
    };
  };

  const organizerStats = getOrganizerStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "overdue":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      case "cancelled":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const openModal = (type: "view" | "edit" | "email" | "billing", organizer: any) => {
    setModalType(type);
    setSelectedOrganizerForModal(organizer);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrganizerForModal(null);
  };

  const handleOrganizerAction = async (action: string, organizer: any) => {
    const actionKey = `${action}-${organizer.id}`;

    try {
      switch (action) {
        case "view":
          openModal("view", organizer);
          break;

        case "edit":
          openModal("edit", organizer);
          break;

        case "email":
          openModal("email", organizer);
          break;

        case "billing":
          openModal("billing", organizer);
          break;

        case "suspend":
          confirm(
            {
              title: "Suspend Account",
              message: `Are you sure you want to suspend ${organizer.name}'s account? They will lose access to all services immediately.`,
              confirmText: "Suspend Account",
              cancelText: "Cancel",
              type: "warning",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setOrganizers((prev) => prev.map((c) => (c.id === organizer.id ? { ...c, status: "suspended" } : c)));
              showSuccess("Account suspended", `${organizer.name}'s account has been suspended.`);
            }
          );
          break;

        case "activate":
          confirm(
            {
              title: "Activate Account",
              message: `Are you sure you want to activate ${organizer.name}'s account? They will regain access to all services.`,
              confirmText: "Activate Account",
              cancelText: "Cancel",
              type: "success",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setOrganizers((prev) => prev.map((c) => (c.id === organizer.id ? { ...c, status: "active" } : c)));
              showSuccess("Account activated", `${organizer.name}'s account has been activated.`);
            }
          );
          break;

        case "delete":
          confirm(
            {
              title: "Delete Organizer",
              message: `Are you sure you want to permanently delete ${organizer.name}? This action cannot be undone and will remove all associated data.`,
              confirmText: "Delete Organizer",
              cancelText: "Cancel",
              type: "danger",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
              setOrganizers((prev) => prev.filter((c) => c.id !== organizer.id));
              showSuccess("Organizer deleted", `${organizer.name} has been permanently removed.`);
            }
          );
          break;

        default:
          showError("Unknown action", "The requested action is not supported.");
          break;
      }
    } catch (error) {
      showError("Action failed", `Failed to ${action} organizer. Please try again.`);
    }
  };

  const handleExport = async () => {
    await withLoading("export", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate export process
      showSuccess("Export completed", "Organizer data has been exported successfully.");
    });
  };

  const handleSaveEdit = async (updatedData: any) => {
    await withLoading("save-edit", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setOrganizers((prev) => prev.map((c) => (c.id === selectedOrganizerForModal.id ? { ...c, ...updatedData } : c)));
      showSuccess("Organizer updated", `${updatedData.name || selectedOrganizerForModal.name}'s information has been updated.`);
      closeModal();
    });
  };

  const handleSendEmail = async (emailData: any) => {
    await withLoading("send-email", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate email sending
      showSuccess("Email sent", `Email has been sent to ${selectedOrganizerForModal.name} successfully.`);
      closeModal();
    });
  };

  const PopoverMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
    isLoading?: boolean;
  }> = ({ icon, label, onClick, className = "", isLoading = false }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );

  const renderModalContent = () => {
    if (!selectedOrganizerForModal) return null;

    switch (modalType) {
      case "view":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {selectedOrganizerForModal.customBranding.logo ? (
                  <img className="h-16 w-16 rounded-full object-cover" src={selectedOrganizerForModal.customBranding.logo} alt="" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-700 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">{selectedOrganizerForModal.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOrganizerForModal.name}</h3>
                <p className="text-gray-600 dark:text-zinc-400">{selectedOrganizerForModal.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrganizerForModal.status)}`}>{selectedOrganizerForModal.status}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrganizerForModal.paymentStatus)}`}>{selectedOrganizerForModal.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-zinc-400">{selectedOrganizerForModal.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-zinc-400">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Subscription Details</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-zinc-400">Plan: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOrganizerForModal.plan}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-zinc-400">Billing: </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(selectedOrganizerForModal.billing.amount)}/{selectedOrganizerForModal.billing.billingCycle}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-zinc-400">Next Billing: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date(selectedOrganizerForModal.billing.nextBilling).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedOrganizerForModal.features.map((feature: string, index: number) => (
                  <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Account Activity</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Created: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{new Date(selectedOrganizerForModal.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Last Login: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOrganizerForModal.lastLogin ? new Date(selectedOrganizerForModal.lastLogin).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "edit":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Organizer Information</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">Update organizer details for {selectedOrganizerForModal.name}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updatedData = {
                  name: formData.get("name"),
                  email: formData.get("email"),
                  company: formData.get("company"),
                  plan: formData.get("plan"),
                };
                handleSaveEdit(updatedData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedOrganizerForModal.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedOrganizerForModal.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={selectedOrganizerForModal.company}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Plan</label>
                  <select
                    name="plan"
                    defaultValue={selectedOrganizerForModal.plan}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <LoadingButton type="submit" isLoading={isLoading("save-edit")} loadingText="Saving..." variant="primary">
                  Save Changes
                </LoadingButton>
              </div>
            </form>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Email</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                Compose an email to {selectedOrganizerForModal.name} ({selectedOrganizerForModal.email})
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const emailData = {
                  subject: formData.get("subject"),
                  message: formData.get("message"),
                };
                handleSendEmail(emailData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Enter your message here..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <LoadingButton type="submit" isLoading={isLoading("send-email")} loadingText="Sending..." variant="primary" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </LoadingButton>
              </div>
            </form>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Details</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">Billing information for {selectedOrganizerForModal.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Current Plan</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrganizerForModal.plan}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Billing Amount</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedOrganizerForModal.billing.amount)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Billing Cycle</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{selectedOrganizerForModal.billing.billingCycle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Payment Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedOrganizerForModal.paymentStatus)}`}>{selectedOrganizerForModal.paymentStatus}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Next Billing Date</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Date(selectedOrganizerForModal.billing.nextBilling).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Currency</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrganizerForModal.billing.currency}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Billing History</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">January 2024</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Paid on Jan 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedOrganizerForModal.billing.amount)}</p>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Paid</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">December 2023</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Paid on Dec 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedOrganizerForModal.billing.amount)}</p>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Paid</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                Close
              </button>
              <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors">Download Invoice</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (!selectedOrganizerForModal) return "";

    switch (modalType) {
      case "view":
        return "Organizer Details";
      case "edit":
        return "Edit Organizer";
      case "email":
        return "Send Email";
      case "billing":
        return "Billing Details";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organizers</h1>
      </div>

      {/* Organizer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{organizerStats.totalOrganizers}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Organizers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{organizerStats.activeOrganizers}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Active Organizers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{organizerStats.newOrganizers}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">New Organizers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(organizerStats.totalRevenue)}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Revenue</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Filter</span>
              </button>
              <LoadingButton onClick={handleExport} isLoading={isLoading("export")} loadingText="Exporting..." variant="secondary" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Export</span>
              </LoadingButton>
            </div>
          </div>
        </div>

        {/* Loading State for Table */}
        {isLoading("fetch-organizers") ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Loading organizers..." />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {filteredOrganizers.map((organizer) => (
                <div key={organizer.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {organizer.customBranding.logo ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={organizer.customBranding.logo} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{organizer.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{organizer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">{organizer.company}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{organizer.email}</p>
                        </div>
                        <Popover
                          trigger={
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          }
                          position="bottom-right"
                        >
                          <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleOrganizerAction("view", organizer)} />
                          <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Organizer" onClick={() => handleOrganizerAction("edit", organizer)} />
                          <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleOrganizerAction("email", organizer)} />
                          <PopoverMenuItem icon={<CreditCard className="w-4 h-4" />} label="Billing Details" onClick={() => handleOrganizerAction("billing", organizer)} />
                          <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                          {organizer.status === "active" ? (
                            <PopoverMenuItem
                              icon={<Pause className="w-4 h-4" />}
                              label="Suspend Account"
                              onClick={() => handleOrganizerAction("suspend", organizer)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            />
                          ) : organizer.status === "suspended" ? (
                            <PopoverMenuItem
                              icon={<Play className="w-4 h-4" />}
                              label="Activate Account"
                              onClick={() => handleOrganizerAction("activate", organizer)}
                              className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            />
                          ) : null}
                          <PopoverMenuItem
                            icon={<Trash2 className="w-4 h-4" />}
                            label="Delete Organizer"
                            onClick={() => handleOrganizerAction("delete", organizer)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        </Popover>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(organizer.status)}`}>{organizer.status}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(organizer.paymentStatus)}`}>{organizer.paymentStatus}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400">{organizer.plan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Organizer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {filteredOrganizers.map((organizer) => (
                    <tr key={organizer.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {organizer.customBranding.logo ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={organizer.customBranding.logo} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{organizer.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{organizer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{organizer.company}</div>
                            <div className="text-xs text-gray-400 dark:text-zinc-500">{organizer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{organizer.plan}</div>
                        <div className="text-sm text-gray-500 dark:text-zinc-400">{organizer.billing.billingCycle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(organizer.status)}`}>{organizer.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(organizer.paymentStatus)}`}>{organizer.paymentStatus}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(organizer.billing.amount)}</div>
                        <div className="text-sm text-gray-500 dark:text-zinc-400">/{organizer.billing.billingCycle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{organizer.lastLogin ? new Date(organizer.lastLogin).toLocaleDateString() : "Never"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Popover
                          trigger={
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          }
                          position="bottom-right"
                        >
                          <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleOrganizerAction("view", organizer)} />
                          <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Organizer" onClick={() => handleOrganizerAction("edit", organizer)} />
                          <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleOrganizerAction("email", organizer)} />
                          <PopoverMenuItem icon={<CreditCard className="w-4 h-4" />} label="Billing Details" onClick={() => handleOrganizerAction("billing", organizer)} />
                          <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                          {organizer.status === "active" ? (
                            <PopoverMenuItem
                              icon={<Pause className="w-4 h-4" />}
                              label="Suspend Account"
                              onClick={() => handleOrganizerAction("suspend", organizer)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            />
                          ) : organizer.status === "suspended" ? (
                            <PopoverMenuItem
                              icon={<Play className="w-4 h-4" />}
                              label="Activate Account"
                              onClick={() => handleOrganizerAction("activate", organizer)}
                              className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            />
                          ) : null}
                          <PopoverMenuItem
                            icon={<Trash2 className="w-4 h-4" />}
                            label="Delete Organizer"
                            onClick={() => handleOrganizerAction("delete", organizer)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-zinc-400">
              Showing {filteredOrganizers.length} of {organizers.length} organizers
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Previous</button>
              <button className="px-3 py-1 text-sm bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-md hover:from-blue-800 hover:to-cyan-800 transition-all">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={closeModal} title={getModalTitle()} size="xl">
        {renderModalContent()}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ""}
        message={options?.message || ""}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={confirmationLoading}
      />
    </div>
  );
};

export default OrganizersPage;
