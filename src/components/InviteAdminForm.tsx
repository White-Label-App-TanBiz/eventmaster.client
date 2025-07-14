import React, { useState } from "react";
import { Mail, Shield, User, Building2, Save } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useLoadingState } from "../hooks/useLoadingState";

interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

interface InviteAdminFormProps {
  onSubmit: (data: { email: string; firstName: string; lastName: string; role: string; permissions: string[] }) => void;
  onCancel: () => void;
}

const InviteAdminForm: React.FC<InviteAdminFormProps> = ({ onSubmit, onCancel }) => {
  const { showError } = useNotifications();
  const { isLoading, withLoading } = useLoadingState();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "admin",
    company: "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "events.view", name: "View Events", description: "Can view event details", checked: true },
    { id: "events.create", name: "Create Events", description: "Can create new events", checked: false },
    { id: "events.edit", name: "Edit Events", description: "Can edit existing events", checked: false },
    { id: "events.delete", name: "Delete Events", description: "Can delete events", checked: false },
    { id: "customers.view", name: "View Customers", description: "Can view customer lists", checked: true },
    { id: "customers.manage", name: "Manage Customers", description: "Can add/remove customers", checked: false },
    { id: "check-in.manage", name: "Manage Check-ins", description: "Can check in customers", checked: false },
    { id: "reports.view", name: "View Reports", description: "Can view event reports and analytics", checked: false },
    { id: "settings.view", name: "View Settings", description: "Can view event settings", checked: false },
    { id: "settings.edit", name: "Edit Settings", description: "Can modify event settings", checked: false },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    setPermissions((prev) => prev.map((permission) => (permission.id === id ? { ...permission, checked } : permission)));
  };

  const handleSelectAllPermissions = (checked: boolean) => {
    setPermissions((prev) => prev.map((permission) => ({ ...permission, checked })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      showError("Email required", "Please enter an email address.");
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError("Name required", "Please enter both first and last name.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Invalid email", "Please enter a valid email address.");
      return;
    }

    const selectedPermissions = permissions.filter((permission) => permission.checked).map((permission) => permission.id);

    if (selectedPermissions.length === 0) {
      showError("Permissions required", "Please select at least one permission.");
      return;
    }

    try {
      await withLoading("invite-admin", async () => {
        onSubmit({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          permissions: selectedPermissions,
        });
      });
    } catch (error) {
      console.error("Error inviting admin:", error);
      showError("Invitation failed", "There was an error sending the invitation. Please try again.");
    }
  };

  const permissionGroups = [
    { name: "Events", permissions: permissions.filter((p) => p.id.startsWith("events.")) },
    { name: "Customers", permissions: permissions.filter((p) => p.id.startsWith("customers.") || p.id.startsWith("check-in.")) },
    { name: "Reports & Settings", permissions: permissions.filter((p) => p.id.startsWith("reports.") || p.id.startsWith("settings.")) },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Admin Information</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email Address *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">An invitation will be sent to this email address.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">First Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Role *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  required
                >
                  <option value="admin">Event Admin</option>
                  <option value="check-in">Check-in Staff</option>
                  <option value="support">Support Staff</option>
                  <option value="analyst">Event Analyst</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => handleSelectAllPermissions(true)} className="text-sm text-blue-700 dark:text-blue-400 hover:underline">
              Select All
            </button>
            <button type="button" onClick={() => handleSelectAllPermissions(false)} className="text-sm text-blue-700 dark:text-blue-400 hover:underline">
              Deselect All
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <div key={group.name} className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={permission.checked}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div>
                      <label htmlFor={permission.id} className="block text-sm font-medium text-gray-900 dark:text-white">
                        {permission.name}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading("invite-admin")}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          {isLoading("invite-admin") ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Invitation...</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>Send Invitation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InviteAdminForm;
