import React, { useState } from "react";
import { Plus, Search, Filter, Download, Eye, EyeOff, Copy, RefreshCw, AlertTriangle, CheckCircle, XCircle, Activity, Shield, Globe, MoreHorizontal, Edit, Pause, Play, RotateCcw, Settings, Ban } from "lucide-react";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import Modal from "../../../../components/Modal";
import Popover from "../../../../components/Popover";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import LoadingButton from "../../../../components/LoadingButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";

interface ApiLicense {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  licenseKey: string;
  apiKey: string;
  status: "active" | "expired" | "suspended" | "revoked";
  plan: string;
  environment: "production" | "staging" | "development";
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  usage: {
    currentMonth: number;
    lastMonth: number;
    totalRequests: number;
  };
  domains: string[];
  ipWhitelist: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
}

const mockApiLicenses: ApiLicense[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "Sarah Johnson",
    company: "TechCorp Events",
    licenseKey: "LIC-TECH-2024-001-ABCD",
    apiKey: "sk_live_51234567890abcdef...",
    status: "active",
    plan: "Professional",
    environment: "production",
    permissions: ["events.read", "events.write", "customers.read", "analytics.read"],
    rateLimit: {
      requestsPerMinute: 1000,
      requestsPerDay: 50000,
    },
    usage: {
      currentMonth: 12450,
      lastMonth: 8920,
      totalRequests: 156780,
    },
    domains: ["events.techcorp.com", "api.techcorp.com"],
    ipWhitelist: ["192.168.1.100", "10.0.0.50"],
    createdAt: "2024-01-15T10:30:00Z",
    expiresAt: "2025-01-15T10:30:00Z",
    lastUsed: "2024-01-25T14:20:00Z",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Michael Chen",
    company: "Innovate Solutions",
    licenseKey: "LIC-INNO-2024-002-EFGH",
    apiKey: "sk_live_98765432109876543...",
    status: "active",
    plan: "Enterprise",
    environment: "production",
    permissions: ["events.read", "events.write", "customers.read", "customers.write", "analytics.read", "analytics.write", "admin.read"],
    rateLimit: {
      requestsPerMinute: 5000,
      requestsPerDay: 250000,
    },
    usage: {
      currentMonth: 45680,
      lastMonth: 38920,
      totalRequests: 892340,
    },
    domains: ["platform.innovate.co", "api.innovate.co", "events.innovate.co"],
    ipWhitelist: ["203.0.113.0/24", "198.51.100.0/24"],
    createdAt: "2024-01-08T09:15:00Z",
    expiresAt: "2025-01-08T09:15:00Z",
    lastUsed: "2024-01-25T16:45:00Z",
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Emma Rodriguez",
    company: "EventPro Agency",
    licenseKey: "LIC-EVNT-2024-003-IJKL",
    apiKey: "sk_test_11223344556677889...",
    status: "expired",
    plan: "Starter",
    environment: "staging",
    permissions: ["events.read", "customers.read"],
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 5000,
    },
    usage: {
      currentMonth: 0,
      lastMonth: 1240,
      totalRequests: 23450,
    },
    domains: ["test.eventpro.net"],
    ipWhitelist: [],
    createdAt: "2024-01-20T11:45:00Z",
    expiresAt: "2024-01-25T11:45:00Z",
    lastUsed: "2024-01-24T10:30:00Z",
  },
];

const Licenses: React.FC = () => {
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError, showInfo } = useNotifications();

  const [licenses, setLicenses] = useState<ApiLicense[]>(mockApiLicenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState("all");
  const [selectedLicense, setSelectedLicense] = useState<ApiLicense | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Helper functions - moved before they are used
  const isExpiringSoon = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "expired":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      case "suspended":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "revoked":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case "production":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "staging":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400";
      case "development":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const toggleApiKeyVisibility = (licenseId: string) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [licenseId]: !prev[licenseId],
    }));
  };

  const copyToClipboard = async (text: string, type: string = "text") => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Copied!", `${type} has been copied to clipboard.`);
    } catch (error) {
      showError("Copy failed", "Failed to copy to clipboard. Please try again.");
    }
  };

  const maskApiKey = (apiKey: string) => {
    return apiKey.substring(0, 12) + "•".repeat(20) + apiKey.substring(apiKey.length - 4);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLicenseAction = async (action: string, license: ApiLicense) => {
    const actionKey = `${action}-${license.id}`;

    try {
      switch (action) {
        case "view":
          setSelectedLicense(license);
          break;

        case "edit":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
            showSuccess("Edit mode activated", `You can now edit the license for ${license.clientName}.`);
          });
          break;

        case "regenerate":
          confirm(
            {
              title: "Regenerate API Key",
              message: `Are you sure you want to regenerate the API key for ${license.clientName}? The current key will be invalidated immediately and any applications using it will stop working until updated.`,
              confirmText: "Regenerate Key",
              cancelText: "Cancel",
              type: "warning",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
              const newApiKey = `sk_live_${Math.random().toString(36).substring(2, 15)}...`;
              setLicenses((prev) => prev.map((l) => (l.id === license.id ? { ...l, apiKey: newApiKey } : l)));
              showSuccess("API key regenerated!", `A new API key has been generated for ${license.clientName}.`);
            },
          );
          break;

        case "configure":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API call
            showSuccess("Configuration opened", `Opening configuration for ${license.clientName}.`);
          });
          break;

        case "logs":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate API call
            showInfo("Logs loaded", `Viewing API usage logs for ${license.clientName}.`);
          });
          break;

        case "suspend":
          confirm(
            {
              title: "Suspend License",
              message: `Are you sure you want to suspend the license for ${license.clientName}? This will immediately block all API access for this client.`,
              confirmText: "Suspend License",
              cancelText: "Cancel",
              type: "warning",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setLicenses((prev) => prev.map((l) => (l.id === license.id ? { ...l, status: "suspended" } : l)));
              showSuccess("License suspended", `The license for ${license.clientName} has been suspended.`);
            },
          );
          break;

        case "activate":
          confirm(
            {
              title: "Activate License",
              message: `Are you sure you want to activate the license for ${license.clientName}? This will restore API access for this client.`,
              confirmText: "Activate License",
              cancelText: "Cancel",
              type: "success",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setLicenses((prev) => prev.map((l) => (l.id === license.id ? { ...l, status: "active" } : l)));
              showSuccess("License activated", `The license for ${license.clientName} has been activated.`);
            },
          );
          break;

        case "renew":
          confirm(
            {
              title: "Renew License",
              message: `Are you sure you want to renew the license for ${license.clientName}? This will extend the license for another year.`,
              confirmText: "Renew License",
              cancelText: "Cancel",
              type: "success",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
              const newExpiryDate = new Date();
              newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
              setLicenses((prev) =>
                prev.map((l) =>
                  l.id === license.id
                    ? {
                        ...l,
                        status: "active",
                        expiresAt: newExpiryDate.toISOString(),
                      }
                    : l,
                ),
              );
              showSuccess("License renewed", `The license for ${license.clientName} has been renewed for another year.`);
            },
          );
          break;

        case "revoke":
          confirm(
            {
              title: "Revoke License",
              message: `Are you sure you want to permanently revoke the license for ${license.clientName}? This action cannot be undone and will permanently block API access.`,
              confirmText: "Revoke License",
              cancelText: "Cancel",
              type: "danger",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setLicenses((prev) => prev.map((l) => (l.id === license.id ? { ...l, status: "revoked" } : l)));
              showSuccess("License revoked", `The license for ${license.clientName} has been permanently revoked.`);
            },
          );
          break;

        default:
          showError("Unknown action", "The requested action is not supported.");
          break;
      }
    } catch (error) {
      showError("Action failed", `Failed to ${action} license. Please try again.`);
    }
  };

  const handleExport = async () => {
    await withLoading("export", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate export process
      showSuccess("Export completed", "License data has been exported successfully.");
    });
  };

  const handleGenerateLicense = async () => {
    await withLoading("generate", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate license generation
      showSuccess("License generated", "A new API license has been generated successfully.");
    });
  };

  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch = license.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || license.company.toLowerCase().includes(searchTerm.toLowerCase()) || license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || license.status === selectedStatus;
    const matchesEnvironment = selectedEnvironment === "all" || license.environment === selectedEnvironment;
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  // Static license statistics
  const getLicenseStats = () => {
    return {
      activeLicenses: licenses.filter((l) => l.status === "active").length,
      expiringSoon: licenses.filter((l) => isExpiringSoon(l.expiresAt)).length,
      apiRequests: licenses.reduce((sum, l) => sum + l.usage.currentMonth, 0),
      expiredRevoked: licenses.filter((l) => l.status === "expired" || l.status === "revoked").length,
    };
  };

  const licenseStats = getLicenseStats();

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Licenses</h1>
        <div className="flex space-x-3">
          <LoadingButton onClick={handleGenerateLicense} isLoading={isLoading("generate")} loadingText="Generating..." variant="primary" className="flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Generate License</span>
          </LoadingButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Active Licenses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{licenseStats.activeLicenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Expiring Soon</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{licenseStats.expiringSoon}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">API Requests</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{licenseStats.apiRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Expired/Revoked</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{licenseStats.expiredRevoked}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
                <option value="revoked">Revoked</option>
              </select>
              <select value={selectedEnvironment} onChange={(e) => setSelectedEnvironment(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Environments</option>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
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
        {isLoading("fetch-licenses") ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Loading licenses..." />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {filteredLicenses.map((license) => (
                <div key={license.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{license.clientName}</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{license.company}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono">{license.licenseKey}</p>
                      </div>
                      <Popover
                        trigger={
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                        position="bottom-right"
                      >
                        <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleLicenseAction("view", license)} />
                        <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit License" onClick={() => handleLicenseAction("edit", license)} isLoading={isLoading(`edit-${license.id}`)} />
                        <PopoverMenuItem icon={<RefreshCw className="w-4 h-4" />} label="Regenerate API Key" onClick={() => handleLicenseAction("regenerate", license)} />
                        <PopoverMenuItem icon={<Settings className="w-4 h-4" />} label="Configure" onClick={() => handleLicenseAction("configure", license)} isLoading={isLoading(`configure-${license.id}`)} />
                        <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                        {license.status === "active" ? (
                          <PopoverMenuItem icon={<Pause className="w-4 h-4" />} label="Suspend" onClick={() => handleLicenseAction("suspend", license)} className="text-yellow-600 dark:text-yellow-400" />
                        ) : license.status === "suspended" ? (
                          <PopoverMenuItem icon={<Play className="w-4 h-4" />} label="Activate" onClick={() => handleLicenseAction("activate", license)} className="text-emerald-600 dark:text-emerald-400" />
                        ) : null}
                        <PopoverMenuItem icon={<Ban className="w-4 h-4" />} label="Revoke" onClick={() => handleLicenseAction("revoke", license)} className="text-red-600 dark:text-red-400" />
                      </Popover>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(license.status)}`}>{license.status}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEnvironmentColor(license.environment)}`}>{license.environment}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">{license.plan}</span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      <p>Usage: {license.usage.currentMonth.toLocaleString()} requests this month</p>
                      <p>Expires: {formatDate(license.expiresAt)}</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">License Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">API Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {filteredLicenses.map((license) => {
                    return (
                      <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{license.clientName}</div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{license.company}</div>
                            <div className="text-xs text-gray-400 dark:text-zinc-500">{license.plan}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono">{license.licenseKey}</code>
                            <button onClick={() => copyToClipboard(license.licenseKey, "License key")} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono">{showApiKeys[license.id] ? license.apiKey : maskApiKey(license.apiKey)}</code>
                            <button onClick={() => toggleApiKeyVisibility(license.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                              {showApiKeys[license.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => copyToClipboard(license.apiKey, "API key")} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(license.status)}`}>{license.status}</span>
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEnvironmentColor(license.environment)}`}>{license.environment}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{license.usage.currentMonth.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-zinc-400">of {license.rateLimit.requestsPerDay.toLocaleString()}/day</div>
                          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-700 h-1 rounded-full"
                              style={{
                                width: `${Math.min((license.usage.currentMonth / license.rateLimit.requestsPerDay) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{formatDate(license.expiresAt)}</div>
                          {isExpiringSoon(license.expiresAt) && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Expiring soon</span>
                            </div>
                          )}
                          {isExpired(license.expiresAt) && (
                            <div className="text-xs text-red-600 dark:text-red-400 flex items-center space-x-1">
                              <XCircle className="w-3 h-3" />
                              <span>Expired</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Popover
                            trigger={
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            }
                            position="bottom-right"
                          >
                            <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleLicenseAction("view", license)} />
                            <PopoverMenuItem icon={<RefreshCw className="w-4 h-4" />} label="Regenerate API Key" onClick={() => handleLicenseAction("regenerate", license)} />
                            <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                            {license.status === "active" ? (
                              <PopoverMenuItem
                                icon={<Pause className="w-4 h-4" />}
                                label="Suspend License"
                                onClick={() => handleLicenseAction("suspend", license)}
                                className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                              />
                            ) : license.status === "suspended" ? (
                              <PopoverMenuItem
                                icon={<Play className="w-4 h-4" />}
                                label="Activate License"
                                onClick={() => handleLicenseAction("activate", license)}
                                className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              />
                            ) : license.status === "expired" ? (
                              <PopoverMenuItem
                                icon={<RotateCcw className="w-4 h-4" />}
                                label="Renew License"
                                onClick={() => handleLicenseAction("renew", license)}
                                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              />
                            ) : null}
                            <PopoverMenuItem icon={<Ban className="w-4 h-4" />} label="Revoke License" onClick={() => handleLicenseAction("revoke", license)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                          </Popover>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-zinc-400">
              Showing {filteredLicenses.length} of {licenses.length} licenses
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Previous</button>
              <button className="px-3 py-1 text-sm bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-md hover:from-blue-800 hover:to-cyan-800 transition-all">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* License Details Modal */}
      {selectedLicense && (
        <Modal isOpen={!!selectedLicense} onClose={() => setSelectedLicense(null)} title="License Details" size="xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">License Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Client</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLicense.clientName} ({selectedLicense.company})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">License Key</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono">{selectedLicense.licenseKey}</code>
                      <button onClick={() => copyToClipboard(selectedLicense.licenseKey, "License key")}>
                        <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Status</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLicense.status)}`}>{selectedLicense.status}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEnvironmentColor(selectedLicense.environment)}`}>{selectedLicense.environment}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage & Limits</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Current Month Usage</label>
                    <p className="text-gray-900 dark:text-white">{selectedLicense.usage.currentMonth.toLocaleString()} requests</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Rate Limits</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLicense.rateLimit.requestsPerMinute.toLocaleString()}/min, {selectedLicense.rateLimit.requestsPerDay.toLocaleString()}/day
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Requests</label>
                    <p className="text-gray-900 dark:text-white">{selectedLicense.usage.totalRequests.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLicense.permissions.map((permission, index) => (
                  <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Allowed Domains</h3>
                <div className="space-y-2">
                  {selectedLicense.domains.map((domain, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <code className="text-sm bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{domain}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">IP Whitelist</h3>
                <div className="space-y-2">
                  {selectedLicense.ipWhitelist.length > 0 ? (
                    selectedLicense.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <code className="text-sm bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{ip}</code>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-zinc-400">No IP restrictions</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

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

export default Licenses;
