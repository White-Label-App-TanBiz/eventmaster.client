import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, UserPlus, Shield, Mail } from "lucide-react";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import Popover from "../../../../components/Popover";
import LoadingButton from "../../../../components/LoadingButton";
import Modal from "../../../../components/Modal";
import InviteAdminForm from "../../../../components/InviteAdminForm";

const SubAdminsPage: React.FC = () => {
  const { showSuccess, showInfo } = useNotifications();
  const { confirm, isOpen, options, handleConfirm, handleCancel, isLoading: confirmationLoading } = useConfirmation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Mock sub-admins data
  const mockSubAdmins = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+1 (555) 123-4567",
      role: "Event Manager",
      status: "active",
      permissions: ["events.manage", "attendees.view", "reports.view"],
      lastLogin: "2024-02-25T14:30:00Z",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 987-6543",
      role: "Registration Manager",
      status: "active",
      permissions: ["attendees.manage", "check-in.manage"],
      lastLogin: "2024-02-24T16:45:00Z",
      createdAt: "2024-01-20T09:30:00Z",
    },
    {
      id: "3",
      name: "Lisa Wilson",
      email: "lisa.wilson@example.com",
      phone: "+1 (555) 456-7890",
      role: "Content Manager",
      status: "inactive",
      permissions: ["events.edit", "content.manage"],
      lastLogin: "2024-02-20T11:20:00Z",
      createdAt: "2024-02-01T14:15:00Z",
    },
  ];

  const filteredSubAdmins = mockSubAdmins.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || admin.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
      case "suspended":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const handleSubAdminAction = (action: string, admin: any) => {
    switch (action) {
      case "view":
        showInfo("View Sub-Admin", `Viewing details for ${admin.name}.`);
        break;
      case "edit":
        setSelectedAdmin(admin);
        setShowPermissionsModal(true);
        break;
      case "email":
        showSuccess("Email Sent", `Email sent to ${admin.name}.`);
        break;
      case "activate":
        confirm(
          {
            title: "Activate Admin",
            message: `Are you sure you want to activate ${admin.name}'s account?`,
            confirmText: "Activate",
            cancelText: "Cancel",
            type: "success",
          },
          () => {
            showSuccess("Admin Activated", `${admin.name} has been activated.`);
          },
        );
        break;
      case "deactivate":
        confirm(
          {
            title: "Deactivate Admin",
            message: `Are you sure you want to deactivate ${admin.name}'s account? They will no longer have access to the system.`,
            confirmText: "Deactivate",
            cancelText: "Cancel",
            type: "warning",
          },
          () => {
            showSuccess("Admin Deactivated", `${admin.name} has been deactivated.`);
          },
        );
        break;
      case "delete":
        confirm(
          {
            title: "Remove Admin",
            message: `Are you sure you want to permanently remove ${admin.name}? This action cannot be undone.`,
            confirmText: "Remove",
            cancelText: "Cancel",
            type: "danger",
          },
          () => {
            showSuccess("Admin Removed", `${admin.name} has been removed from the team.`);
          },
        );
        break;
    }
  };

  const handleInviteAdmin = (data: any) => {
    showSuccess("Invitation Sent", `An invitation has been sent to ${data.email}.`);
    setShowInviteModal(false);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub Admins</h1>
        <LoadingButton onClick={() => setShowInviteModal(true)} variant="primary" className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Invite Sub-Admin</span>
        </LoadingButton>
      </div>

      {/* Sub-Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockSubAdmins.length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Total Sub-Admins</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockSubAdmins.filter((a) => a.status === "active").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Active</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockSubAdmins.filter((a) => a.permissions.includes("events.manage")).length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Event Managers</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockSubAdmins.filter((a) => a.status === "inactive").length}</div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">Inactive</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sub-admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Sub-Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {filteredSubAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{admin.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</div>
                        <div className="text-sm text-gray-500 dark:text-zinc-400">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admin.status)}`}>{admin.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.slice(0, 2).map((permission, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded">
                          {permission}
                        </span>
                      ))}
                      {admin.permissions.length > 2 && <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded">+{admin.permissions.length - 2} more</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDate(admin.lastLogin)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover
                      trigger={
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      position="bottom-right"
                    >
                      <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleSubAdminAction("view", admin)} />
                      <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Permissions" onClick={() => handleSubAdminAction("edit", admin)} />
                      <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleSubAdminAction("email", admin)} />
                      <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                      {admin.status === "active" ? (
                        <PopoverMenuItem icon={<Shield className="w-4 h-4" />} label="Deactivate" onClick={() => handleSubAdminAction("deactivate", admin)} className="text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <PopoverMenuItem icon={<Shield className="w-4 h-4" />} label="Activate" onClick={() => handleSubAdminAction("activate", admin)} className="text-emerald-600 dark:text-emerald-400" />
                      )}
                      <PopoverMenuItem icon={<Trash2 className="w-4 h-4" />} label="Remove" onClick={() => handleSubAdminAction("delete", admin)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredSubAdmins.map((admin) => (
            <div key={admin.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{admin.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">{admin.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">{admin.email}</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{admin.role}</p>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admin.status)}`}>{admin.status}</span>
                    </div>
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
                  <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleSubAdminAction("view", admin)} />
                  <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Permissions" onClick={() => handleSubAdminAction("edit", admin)} />
                  <PopoverMenuItem icon={<Mail className="w-4 h-4" />} label="Send Email" onClick={() => handleSubAdminAction("email", admin)} />
                  <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                  {admin.status === "active" ? (
                    <PopoverMenuItem icon={<Shield className="w-4 h-4" />} label="Deactivate" onClick={() => handleSubAdminAction("deactivate", admin)} className="text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <PopoverMenuItem icon={<Shield className="w-4 h-4" />} label="Activate" onClick={() => handleSubAdminAction("activate", admin)} className="text-emerald-600 dark:text-emerald-400" />
                  )}
                  <PopoverMenuItem icon={<Trash2 className="w-4 h-4" />} label="Remove" onClick={() => handleSubAdminAction("delete", admin)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Admin Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Sub-Admin" size="lg">
        <InviteAdminForm onSubmit={handleInviteAdmin} onCancel={() => setShowInviteModal(false)} />
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} title={`Edit Permissions: ${selectedAdmin?.name}`} size="lg">
        {selectedAdmin && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{selectedAdmin.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedAdmin.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{selectedAdmin.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Current Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAdmin.permissions.map((permission: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Update Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "events.view", name: "View Events" },
                  { id: "events.create", name: "Create Events" },
                  { id: "events.edit", name: "Edit Events" },
                  { id: "events.delete", name: "Delete Events" },
                  { id: "attendees.view", name: "View Attendees" },
                  { id: "attendees.manage", name: "Manage Attendees" },
                  { id: "check-in.manage", name: "Manage Check-ins" },
                  { id: "reports.view", name: "View Reports" },
                  { id: "settings.view", name: "View Settings" },
                  { id: "settings.edit", name: "Edit Settings" },
                ].map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={permission.id}
                      defaultChecked={selectedAdmin.permissions.includes(permission.id)}
                      className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor={permission.id} className="text-sm text-gray-700 dark:text-zinc-300">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <button onClick={() => setShowPermissionsModal(false)} className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  showSuccess("Permissions Updated", `Permissions for ${selectedAdmin.name} have been updated.`);
                  setShowPermissionsModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
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
                  <button
                    onClick={handleConfirm}
                    disabled={confirmationLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none ${
                      options.type === "danger" ? "bg-red-600 hover:bg-red-700" : options.type === "warning" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
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

export default SubAdminsPage;
