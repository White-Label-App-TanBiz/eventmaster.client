import React, { useState } from "react";
import { User, Shield, Bell, Save, Eye, EyeOff, Camera } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import LoadingButton from "../../../../components/LoadingButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError } = useNotifications();

  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    jobTitle: user?.role === "super_admin" ? "Super Administrator" : "Client Administrator",
    company: user?.company || "EventMaster Inc.",
    bio: "Experienced event management professional with over 5 years in the industry.",
    location: "San Francisco, CA",
    timezone: "America/New_York",
    avatar: user?.avatar || "",
  });

  // Security settings state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
  });

  // Notification preferences state
  const [notificationData, setNotificationData] = useState({
    emailDigest: true,
    eventReminders: true,
    paymentAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    productUpdates: true,
    weeklyReports: true,
    instantNotifications: true,
  });

  const handleProfileSave = async () => {
    await withLoading("save-profile", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Saving profile data:", profileData);
      showSuccess("Profile updated!", "Your profile information has been saved successfully.");
    });
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      showError("Password mismatch", "New passwords do not match.");
      return;
    }

    if (securityData.newPassword.length < 8) {
      showError("Password too short", "Password must be at least 8 characters long.");
      return;
    }

    confirm(
      {
        title: "Change Password",
        message: "Are you sure you want to change your password? You will need to log in again with your new password.",
        confirmText: "Change Password",
        cancelText: "Cancel",
        type: "warning",
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
        console.log("Changing password");
        setSecurityData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        showSuccess("Password changed!", "Your password has been updated successfully.");
      },
    );
  };

  const handleNotificationSave = async () => {
    await withLoading("save-notifications", async () => {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
      console.log("Saving notification preferences:", notificationData);
      showSuccess("Notification preferences saved!", "Your notification settings have been updated.");
    });
  };

  const handleToggle2FA = (enabled: boolean) => {
    const action = enabled ? "enable" : "disable";

    confirm(
      {
        title: `${enabled ? "Enable" : "Disable"} Two-Factor Authentication`,
        message: `Are you sure you want to ${action} two-factor authentication? ${enabled ? "This will add an extra layer of security to your account." : "This will remove the extra security layer from your account."}`,
        confirmText: `${enabled ? "Enable" : "Disable"} 2FA`,
        cancelText: "Cancel",
        type: enabled ? "success" : "warning",
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setSecurityData((prev) => ({ ...prev, twoFactorEnabled: enabled }));
        const actionPast = enabled ? "enabled" : "disabled";
        showSuccess(`2FA ${actionPast}!`, `Two-factor authentication has been ${actionPast} for your account.`);
      },
    );
  };

  const handleToggleLoginAlerts = (enabled: boolean) => {
    setSecurityData((prev) => ({ ...prev, loginAlerts: enabled }));
    const actionPast = enabled ? "enabled" : "disabled";
    showSuccess(`Login alerts ${actionPast}!`, `You will ${enabled ? "now receive" : "no longer receive"} notifications for account logins.`);
  };

  const handlePhotoUpload = () => {
    showSuccess("Upload feature", "Photo upload functionality will be available soon.");
  };

  const handlePhotoRemove = () => {
    confirm(
      {
        title: "Remove Profile Picture",
        message: "Are you sure you want to remove your profile picture? Your initials will be displayed instead.",
        confirmText: "Remove Picture",
        cancelText: "Cancel",
        type: "warning",
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
        setProfileData((prev) => ({ ...prev, avatar: "" }));
        showSuccess("Photo removed", "Profile picture has been removed.");
      },
    );
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        {/* Tab Navigation - Mobile Optimized */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center md:justify-start space-x-0 md:space-x-2 py-4 px-2 md:px-4 border-b-2 font-medium text-sm transition-colors min-w-0 flex-1 md:flex-none ${
                    activeTab === tab.id ? "border-blue-700 text-blue-700 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden md:inline truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-2xl font-bold">{profileData.avatar || profileData.firstName.charAt(0) + profileData.lastName.charAt(0)}</div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">Upload a new profile picture or use your initials</p>
                  <div className="mt-2 flex space-x-3">
                    <button onClick={handlePhotoUpload} className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      Upload Photo
                    </button>
                    <button onClick={handlePhotoRemove} className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Timezone</label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <LoadingButton onClick={handleProfileSave} isLoading={isLoading("save-profile")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <LoadingButton onClick={handlePasswordChange} variant="primary">
                    Update Password
                  </LoadingButton>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enable 2FA</h4>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={securityData.twoFactorEnabled} onChange={(e) => handleToggle2FA(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Security Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Alerts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Login Alerts</h4>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">Get notified when someone logs into your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={securityData.loginAlerts} onChange={(e) => handleToggleLoginAlerts(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {(
                    Object.entries({
                      emailDigest: "Daily email digest",
                      eventReminders: "Event reminders",
                      paymentAlerts: "Payment alerts",
                      securityAlerts: "Security alerts",
                      marketingEmails: "Marketing emails",
                      productUpdates: "Product updates",
                      weeklyReports: "Weekly reports",
                    }) as [keyof typeof notificationData, string][]
                  ).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">Receive {label.toLowerCase()} via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notificationData[key]} onChange={(e) => setNotificationData((prev) => ({ ...prev, [key]: e.target.checked }))} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Push Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Instant Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Receive instant notifications in your browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notificationData.instantNotifications} onChange={(e) => setNotificationData((prev) => ({ ...prev, instantNotifications: e.target.checked }))} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <LoadingButton onClick={handleNotificationSave} isLoading={isLoading("save-notifications")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </LoadingButton>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default AccountSettings;
