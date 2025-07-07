import React, { useState } from "react";
import { Palette, Save, Eye, Globe, Mail, Monitor, Smartphone, Tablet, RefreshCw, Check, X, ExternalLink, Copy, Settings, Image, Link } from "lucide-react";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useNotifications } from "../../../../hooks/useNotifications";
import LoadingButton from "../../../../components/LoadingButton";
import ColorPicker from "../../../../components/ColorPicker";

const WhiteLabel: React.FC = () => {
  const { isLoading, withLoading } = useLoadingState();
  const { showSuccess, showError, showInfo } = useNotifications();

  const [activeTab, setActiveTab] = useState("branding");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Branding settings state
  const [brandingData, setBrandingData] = useState({
    companyName: "TechCorp Events",
    logo: "",
    favicon: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    fontFamily: "Inter",
    customCSS: "",
  });

  // Domain settings state
  const [domainData, setDomainData] = useState({
    customDomain: "events.techcorp.com",
    subdomain: "techcorp",
    sslEnabled: true,
    redirectWww: true,
    status: "active" as "active" | "pending" | "failed",
  });

  // Email settings state
  const [emailData, setEmailData] = useState({
    fromName: "TechCorp Events",
    fromEmail: "noreply@techcorp.com",
    replyToEmail: "support@techcorp.com",
    smtpHost: "smtp.techcorp.com",
    smtpPort: "587",
    smtpUsername: "noreply@techcorp.com",
    smtpPassword: "",
    smtpEncryption: "tls" as "tls" | "ssl" | "none",
    testEmailSent: false,
  });

  const handleBrandingChange = (field: string, value: any) => {
    setBrandingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDomainChange = (field: string, value: any) => {
    setDomainData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailChange = (field: string, value: any) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveBranding = async () => {
    await withLoading("save-branding", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      showSuccess("Branding saved!", "Your white-label branding settings have been updated successfully.");
    });
  };

  const handleSaveDomain = async () => {
    await withLoading("save-domain", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      showSuccess("Domain settings saved!", "Your custom domain configuration has been updated.");
    });
  };

  const handleSaveEmail = async () => {
    await withLoading("save-email", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
      showSuccess("Email settings saved!", "Your SMTP configuration has been updated successfully.");
    });
  };

  const handleTestEmail = async () => {
    await withLoading("test-email", async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate email test
      setEmailData((prev) => ({ ...prev, testEmailSent: true }));
      showSuccess("Test email sent!", "A test email has been sent to verify your SMTP configuration.");
    });
  };

  const handleVerifyDomain = async () => {
    await withLoading("verify-domain", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate domain verification
      setDomainData((prev) => ({ ...prev, status: "active" }));
      showSuccess("Domain verified!", "Your custom domain has been verified and is now active.");
    });
  };

  const handleCopyToClipboard = async (text: string, type: string = "text") => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Copied!", `${type} has been copied to clipboard.`);
    } catch (error) {
      showError("Copy failed", "Failed to copy to clipboard. Please try again.");
    }
  };

  const handleFileUpload = (type: "logo" | "favicon") => {
    showInfo("Upload feature", `${type} upload functionality will be available soon.`);
  };

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Source Sans Pro", label: "Source Sans Pro" },
    { value: "Nunito", label: "Nunito" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "failed":
        return <X className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: "branding", label: "Branding", icon: Palette },
    { id: "domain", label: "Custom Domain", icon: Globe },
    { id: "email", label: "Email Settings", icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">White-label Settings</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded-md transition-colors ${previewMode === "desktop" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-2 rounded-md transition-colors ${previewMode === "tablet" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded-md transition-colors ${previewMode === "mobile" ? "bg-white dark:bg-zinc-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id ? "border-blue-700 text-blue-700 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "branding" && (
            <div className="space-y-8">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={brandingData.companyName}
                      onChange={(e) => handleBrandingChange("companyName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Font Family</label>
                    <select
                      value={brandingData.fontFamily}
                      onChange={(e) => handleBrandingChange("fontFamily", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Logo and Favicon */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logo & Favicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Logo</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Upload your company logo</p>
                      <button onClick={() => handleFileUpload("logo")} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors">
                        Choose File
                      </button>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Favicon</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Upload favicon (32x32px)</p>
                      <button onClick={() => handleFileUpload("favicon")} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors">
                        Choose File
                      </button>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">ICO, PNG 32x32px</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Scheme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ColorPicker label="Primary Color" value={brandingData.primaryColor} onChange={(color) => handleBrandingChange("primaryColor", color)} />
                  <ColorPicker label="Secondary Color" value={brandingData.secondaryColor} onChange={(color) => handleBrandingChange("secondaryColor", color)} />
                  <ColorPicker label="Accent Color" value={brandingData.accentColor} onChange={(color) => handleBrandingChange("accentColor", color)} />
                  <ColorPicker label="Background Color" value={brandingData.backgroundColor} onChange={(color) => handleBrandingChange("backgroundColor", color)} />
                  <ColorPicker label="Text Color" value={brandingData.textColor} onChange={(color) => handleBrandingChange("textColor", color)} />
                </div>
              </div>

              {/* Custom CSS */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom CSS</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Additional CSS Styles</label>
                  <textarea
                    value={brandingData.customCSS}
                    onChange={(e) => handleBrandingChange("customCSS", e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent font-mono text-sm"
                    placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}"
                  />
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">Add custom CSS to further customize the appearance of your white-labeled application.</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <LoadingButton onClick={handleSaveBranding} isLoading={isLoading("save-branding")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Branding</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === "domain" && (
            <div className="space-y-8">
              {/* Domain Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Domain Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Custom Domain</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={domainData.customDomain}
                        onChange={(e) => handleDomainChange("customDomain", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        placeholder="events.yourcompany.com"
                      />
                      <span className={`inline-flex items-center space-x-1 px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(domainData.status)}`}>
                        {getStatusIcon(domainData.status)}
                        <span>{domainData.status}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">Enter your custom domain name. Make sure to point your DNS to our servers.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Subdomain (Alternative)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={domainData.subdomain}
                        onChange={(e) => handleDomainChange("subdomain", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        placeholder="yourcompany"
                      />
                      <span className="text-gray-500 dark:text-zinc-400">.eventmaster.app</span>
                      <button onClick={() => handleCopyToClipboard(`${domainData.subdomain}.eventmaster.app`, "Subdomain URL")} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">Your subdomain is always available, even if you set up a custom domain.</p>
                  </div>
                </div>
              </div>

              {/* DNS Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DNS Configuration</h3>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">To connect your custom domain, add the following DNS records to your domain provider:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-700">
                          <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Type</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Name</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Value</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">TTL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-zinc-700">
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">CNAME</td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">{domainData.customDomain.split(".")[0]}</td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400 flex items-center space-x-2">
                            <span>proxy.eventmaster.app</span>
                            <button onClick={() => handleCopyToClipboard("proxy.eventmaster.app", "CNAME value")} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">3600</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">TXT</td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">_eventmaster.{domainData.customDomain.split(".")[0]}</td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400 flex items-center space-x-2">
                            <span>verify=techcorp-events-12345</span>
                            <button onClick={() => handleCopyToClipboard("verify=techcorp-events-12345", "TXT value")} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">3600</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SSL and Redirect Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SSL & Redirect Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="ssl-enabled"
                      checked={domainData.sslEnabled}
                      onChange={(e) => handleDomainChange("sslEnabled", e.target.checked)}
                      className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="ssl-enabled" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Enable SSL (HTTPS)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="redirect-www"
                      checked={domainData.redirectWww}
                      onChange={(e) => handleDomainChange("redirectWww", e.target.checked)}
                      className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="redirect-www" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Redirect www to non-www (or vice versa)
                    </label>
                  </div>
                </div>
              </div>

              {/* Domain Verification */}
              <div className="flex justify-between items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Domain Status</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    {domainData.status === "active"
                      ? "Your domain is active and working properly."
                      : domainData.status === "pending"
                      ? "Your domain is pending verification. Please add the DNS records and verify."
                      : "Domain verification failed. Please check your DNS settings and try again."}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <LoadingButton onClick={handleVerifyDomain} isLoading={isLoading("verify-domain")} loadingText="Verifying..." variant="secondary" className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Verify Domain</span>
                  </LoadingButton>
                  <LoadingButton onClick={handleSaveDomain} isLoading={isLoading("save-domain")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-8">
              {/* Email Sender Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Sender Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">From Name</label>
                    <input
                      type="text"
                      value={emailData.fromName}
                      onChange={(e) => handleEmailChange("fromName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">From Email</label>
                    <input
                      type="email"
                      value={emailData.fromEmail}
                      onChange={(e) => handleEmailChange("fromEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="noreply@yourcompany.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Reply-To Email</label>
                    <input
                      type="email"
                      value={emailData.replyToEmail}
                      onChange={(e) => handleEmailChange("replyToEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="support@yourcompany.com"
                    />
                  </div>
                </div>
              </div>

              {/* SMTP Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={emailData.smtpHost}
                      onChange={(e) => handleEmailChange("smtpHost", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="smtp.yourcompany.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Port</label>
                    <input
                      type="text"
                      value={emailData.smtpPort}
                      onChange={(e) => handleEmailChange("smtpPort", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      value={emailData.smtpUsername}
                      onChange={(e) => handleEmailChange("smtpUsername", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Password</label>
                    <input
                      type="password"
                      value={emailData.smtpPassword}
                      onChange={(e) => handleEmailChange("smtpPassword", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Encryption</label>
                    <select
                      value={emailData.smtpEncryption}
                      onChange={(e) => handleEmailChange("smtpEncryption", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Templates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Templates</h3>
                  <Link to="/client-dashboard/email-templates" className="text-sm text-blue-700 dark:text-blue-400 hover:underline flex items-center space-x-1">
                    <Settings className="w-4 h-4" />
                    <span>Manage Templates</span>
                  </Link>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Customize email templates to match your brand. You can edit the following templates:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">Welcome Email</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Sent when a new user registers</div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">Password Reset</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Sent when a user requests a password reset</div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">Event Confirmation</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Sent when an attendee registers for an event</div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">Event Reminder</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Sent before an event starts</div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">Invoice</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Sent with payment receipts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Email */}
              <div className="flex justify-between items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Configuration</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{emailData.testEmailSent ? "Test email sent successfully! Please check your inbox." : "Send a test email to verify your SMTP configuration is working correctly."}</p>
                </div>
                <div className="flex space-x-3">
                  <LoadingButton onClick={handleTestEmail} isLoading={isLoading("test-email")} loadingText="Sending..." variant="secondary" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Send Test Email</span>
                  </LoadingButton>
                  <LoadingButton onClick={handleSaveEmail} isLoading={isLoading("save-email")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
          <a
            href="#"
            className="text-sm text-blue-700 dark:text-blue-400 hover:underline flex items-center space-x-1"
            onClick={(e) => {
              e.preventDefault();
              showInfo("Preview", "Opening preview in a new tab.");
            }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in new tab</span>
          </a>
        </div>

        <div className={`border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden ${previewMode === "desktop" ? "w-full h-96" : previewMode === "tablet" ? "w-[768px] h-96 mx-auto" : "w-[375px] h-96 mx-auto"}`}>
          <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ color: brandingData.textColor, fontFamily: brandingData.fontFamily }}>
                {brandingData.companyName}
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4" style={{ color: brandingData.textColor, fontFamily: brandingData.fontFamily }}>
                Your white-labeled event platform
              </p>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{
                  background: brandingData.primaryColor,
                  fontFamily: brandingData.fontFamily,
                }}
              >
                Preview Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabel;
