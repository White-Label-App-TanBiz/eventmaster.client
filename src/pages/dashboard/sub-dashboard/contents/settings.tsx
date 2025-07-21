import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Shield, Database, Mail, Webhook, Save, Upload, Download, AlertTriangle, Eye, Edit, Send } from 'lucide-react';
import type { Language } from '@/contexts/types';

import { useLanguage, languages } from '@/contexts/language';
import { useLoadingState, useConfirmation, useNotifications } from '@/hooks';

import { ColorPicker } from '@/components/user-inputs/inputs';
import { LoadingButton } from '@/components/user-inputs/buttons';
import { Modal, ConfirmationModal } from '@/components/user-inputs/modals';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  enabled: boolean;
}

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError, showInfo } = useNotifications();

  const [activeTab, setActiveTab] = useState('general');

  // Email template states
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [showEmailEditModal, setShowEmailEditModal] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<EmailTemplate | null>(null);
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<EmailTemplate | null>(null);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Younivent',
    siteDescription: 'Professional Event Management Platform',
    defaultLanguage: language,
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    maintenanceMode: false,
  });

  const [brandingSettings, setBrandingSettings] = useState({
    logo: '',
    favicon: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    customCSS: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowedDomains: '',
    ipWhitelist: '',
    enableAuditLog: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@younivent.com',
    fromName: 'Younivent',
    testEmail: '',
  });

  // Email templates with realistic content
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}!',
      content: `Dear {{user_name}},

Welcome to {{company_name}}! We're excited to have you on board.

Your account has been successfully created and you can now start using our platform to manage your events.

Getting Started:
1. Complete your profile setup
2. Create your first event
3. Invite team members
4. Explore our features

If you have any questions, our support team is here to help at {{support_email}}.

Best regards,
The {{company_name}} Team

---
This email was sent to {{user_email}}. If you didn't create this account, please contact us immediately.`,
      variables: ['user_name', 'user_email', 'company_name', 'support_email'],
      enabled: true,
    },
    {
      id: 'password_reset',
      name: 'Password Reset',
      subject: 'Reset your {{company_name}} password',
      content: `Hello {{user_name}},

We received a request to reset your password for your {{company_name}} account.

Click the link below to reset your password:
{{reset_link}}

This link will expire in 24 hours for security reasons.

If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.

Best regards,
The {{company_name}} Team

---
This email was sent to {{user_email}}.`,
      variables: ['user_name', 'user_email', 'company_name', 'reset_link'],
      enabled: true,
    },
    {
      id: 'event_reminder',
      name: 'Event Reminder',
      subject: 'Reminder: {{event_name}} is tomorrow!',
      content: `Hi {{customer_name}},

This is a friendly reminder that you're registered for {{event_name}}.

Event Details:
📅 Date: {{event_date}}
🕐 Time: {{event_time}}
📍 Location: {{event_location}}

What to bring:
- Your confirmation email
- A valid ID
- Any materials mentioned in the event description

We're looking forward to seeing you there!

If you need to make any changes to your registration or have questions, please contact the event provider at {{provider_email}}.

Best regards,
{{provider_name}}
{{company_name}}

---
This email was sent to {{customer_email}}.`,
      variables: ['customer_name', 'customer_email', 'event_name', 'event_date', 'event_time', 'event_location', 'provider_name', 'provider_email', 'company_name'],
      enabled: true,
    },
    {
      id: 'invoice',
      name: 'Invoice Notification',
      subject: 'Invoice {{invoice_number}} from {{company_name}}',
      content: `Dear {{customer_name}},

Thank you for your business! Please find your invoice details below:

Invoice #: {{invoice_number}}
Date: {{invoice_date}}
Due Date: {{due_date}}
Amount: {{amount}}

Services:
{{service_details}}

Payment Instructions:
{{payment_instructions}}

You can view and download your invoice by clicking here: {{invoice_link}}

If you have any questions about this invoice, please contact our billing department at {{billing_email}}.

Thank you for choosing {{company_name}}.

Best regards,
The {{company_name}} Team

---
This email was sent to {{customer_email}}.`,
      variables: [
        'customer_name',
        'customer_email',
        'company_name',
        'invoice_number',
        'invoice_date',
        'due_date',
        'amount',
        'service_details',
        'payment_instructions',
        'invoice_link',
        'billing_email',
      ],
      enabled: true,
    },
    {
      id: 'subscription_renewal',
      name: 'Subscription Renewal',
      subject: 'Your {{plan_name}} subscription will renew soon',
      content: `Hello {{customer_name}},

This is a friendly reminder that your {{plan_name}} subscription will automatically renew on {{renewal_date}}.

Subscription Details:
- Plan: {{plan_name}}
- Renewal Date: {{renewal_date}}
- Amount: {{amount}}
- Payment Method: {{payment_method}}

Your subscription includes:
{{plan_features}}

To make changes to your subscription or update your payment method, please visit your account settings: {{account_link}}

If you have any questions, please contact our support team at {{support_email}}.

Thank you for being a valued customer!

Best regards,
The {{company_name}} Team

---
This email was sent to {{customer_email}}.`,
      variables: ['customer_name', 'customer_email', 'company_name', 'plan_name', 'renewal_date', 'amount', 'payment_method', 'plan_features', 'account_link', 'support_email'],
      enabled: true,
    },
  ]);

  const [webhookSettings, setWebhookSettings] = useState({
    webhookUrl: '',
    webhookSecret: '',
    enabledEvents: {
      userCreated: true,
      userUpdated: false,
      paymentReceived: true,
      eventCreated: true,
      eventUpdated: false,
    },
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'branding', label: 'Branding & Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email Configuration', icon: Mail },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const handleSaveSettings = async (settingsType: string) => {
    await withLoading(`save-${settingsType.toLowerCase()}`, async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log(`Saving ${settingsType} settings`);
      showSuccess('Settings saved!', `${settingsType} settings have been updated successfully.`);
    });
  };

  const handleTestEmail = async () => {
    if (!emailSettings.testEmail) {
      showError('Email required', 'Please enter an email address to send the test email.');
      return;
    }

    await withLoading('test-email', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate email sending
      console.log('Sending test email to:', emailSettings.testEmail);
      showInfo('Test email sent!', `A test email has been sent to ${emailSettings.testEmail}.`);
    });
  };

  const handlePreviewEmail = (template: EmailTemplate) => {
    setSelectedEmailTemplate(template);
    setShowEmailPreviewModal(true);
  };

  const handleEditEmail = (template: EmailTemplate) => {
    setEditingEmailTemplate({ ...template });
    setShowEmailEditModal(true);
  };

  const handleSaveEmailTemplate = async () => {
    if (!editingEmailTemplate) return;

    await withLoading('save-email-template', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setEmailTemplates((prev) => prev.map((template) => (template.id === editingEmailTemplate.id ? editingEmailTemplate : template)));

      setShowEmailEditModal(false);
      setEditingEmailTemplate(null);
      showSuccess('Email template saved!', `The ${editingEmailTemplate.name} template has been updated successfully.`);
    });
  };

  const handleSendTestEmail = async (template: EmailTemplate) => {
    if (!emailSettings.testEmail) {
      showError('Test email required', 'Please enter a test email address in the Email Configuration section.');
      return;
    }

    await withLoading(`test-email-${template.id}`, async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate email sending
      console.log(`Sending test email for template: ${template.name} to: ${emailSettings.testEmail}`);
      showSuccess('Test email sent!', `A test email using the "${template.name}" template has been sent to ${emailSettings.testEmail}.`);
    });
  };

  const handleToggleEmailTemplate = (templateId: string) => {
    setEmailTemplates((prev) => prev.map((template) => (template.id === templateId ? { ...template, enabled: !template.enabled } : template)));

    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      const action = template.enabled ? 'disabled' : 'enabled';
      showSuccess(`Template ${action}!`, `The "${template.name}" template has been ${action}.`);
    }
  };

  const renderEmailTemplateVariables = (variables: string[]) => {
    return (
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2">Available Variables:</label>
        <div className="flex flex-wrap gap-1">
          {variables.map((variable, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded font-mono">
              {`{{${variable}}}`}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const handleTestWebhook = async () => {
    if (!webhookSettings.webhookUrl) {
      showError('Webhook URL required', 'Please enter a webhook URL to test.');
      return;
    }

    await withLoading('test-webhook', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate webhook test
      console.log('Testing webhook:', webhookSettings.webhookUrl);
      showInfo('Webhook test sent!', 'A test payload has been sent to your webhook URL.');
    });
  };

  const handleDatabaseBackup = () => {
    confirm(
      {
        title: 'Create Database Backup',
        message: 'Are you sure you want to create a database backup? This process may take several minutes and could affect system performance.',
        confirmText: 'Create Backup',
        cancelText: 'Cancel',
        type: 'info',
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate backup process
        console.log('Creating database backup');
        showSuccess('Backup started!', 'Database backup has been initiated. You will receive an email when complete.');
      },
    );
  };

  const handleDatabaseRestore = () => {
    confirm(
      {
        title: 'Restore Database',
        message: 'Are you sure you want to restore the database? This will overwrite all current data and cannot be undone. The system will be temporarily unavailable during the restore process.',
        confirmText: 'Restore Database',
        cancelText: 'Cancel',
        type: 'danger',
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate restore process
        console.log('Restoring database');
        showInfo('Restore initiated', 'Database restore process has been started.');
      },
    );
  };

  const handleMaintenanceModeToggle = (enabled: boolean) => {
    const action = enabled ? 'enable' : 'disable';

    confirm(
      {
        title: `${enabled ? 'Enable' : 'Disable'} Maintenance Mode`,
        message: `Are you sure you want to ${action} maintenance mode? ${enabled ? 'This will prevent all users from accessing the system.' : 'This will restore normal system access for all users.'}`,
        confirmText: `${enabled ? 'Enable' : 'Disable'} Maintenance Mode`,
        cancelText: 'Cancel',
        type: enabled ? 'warning' : 'success',
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
        setGeneralSettings((prev) => ({ ...prev, maintenanceMode: enabled }));
        const actionPast = enabled ? 'enabled' : 'disabled';
        showSuccess(`Maintenance mode ${actionPast}!`, `System maintenance mode has been ${actionPast}.`);
      },
    );
  };

  const handlePhotoUpload = (type: 'logo' | 'favicon') => {
    showInfo('Upload feature', `${type === 'logo' ? 'Logo' : 'Favicon'} upload functionality will be available soon.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        {/* Tab Navigation - Mobile Optimized */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="flex overflow-x-auto px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center md:justify-start space-x-0 md:space-x-2 py-4 px-2 md:px-4 border-b-2 font-medium text-sm transition-colors min-w-0 flex-shrink-0 ${
                    activeTab === tab.id ? 'border-blue-700 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Default Language</label>
                  <select
                    value={generalSettings.defaultLanguage}
                    onChange={(e) => {
                      const newLang = e.target.value as Language;
                      setGeneralSettings((prev) => ({ ...prev, defaultLanguage: newLang }));
                      setLanguage(newLang);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    {Object.entries(languages).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.flag} {info.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, dateFormat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Site Description</label>
                <textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">Enable maintenance mode to prevent user access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={generalSettings.maintenanceMode} onChange={(e) => handleMaintenanceModeToggle(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-end">
                <LoadingButton onClick={() => handleSaveSettings('General')} isLoading={isLoading('save-general')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Branding & Appearance</h3>

              {/* Logo and Favicon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg flex items-center justify-center">
                      {brandingSettings.logo ? <img src={brandingSettings.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" /> : <Upload className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => handlePhotoUpload('logo')}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                      >
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Recommended: 200x60px, PNG or SVG</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Favicon</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg flex items-center justify-center">
                      {brandingSettings.favicon ? <img src={brandingSettings.favicon} alt="Favicon" className="w-8 h-8 object-contain" /> : <Upload className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => handlePhotoUpload('favicon')}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                      >
                        Upload Favicon
                      </button>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Recommended: 32x32px, ICO or PNG</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Settings - Compact 2-column layout */}
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Color Scheme</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ColorPicker label="Primary Color" value={brandingSettings.primaryColor} onChange={(color) => setBrandingSettings((prev) => ({ ...prev, primaryColor: color }))} />

                  <ColorPicker label="Secondary Color" value={brandingSettings.secondaryColor} onChange={(color) => setBrandingSettings((prev) => ({ ...prev, secondaryColor: color }))} />

                  <ColorPicker label="Accent Color" value={brandingSettings.accentColor} onChange={(color) => setBrandingSettings((prev) => ({ ...prev, accentColor: color }))} />
                </div>
              </div>

              {/* Typography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Font Family</label>
                <select
                  value={brandingSettings.fontFamily}
                  onChange={(e) => setBrandingSettings((prev) => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              {/* Custom CSS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Custom CSS</label>
                <textarea
                  value={brandingSettings.customCSS}
                  onChange={(e) => setBrandingSettings((prev) => ({ ...prev, customCSS: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent font-mono text-sm"
                  placeholder="/* Add your custom CSS here */"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Custom CSS will be applied to all client interfaces</p>
              </div>

              <div className="flex justify-end">
                <LoadingButton onClick={() => handleSaveSettings('Branding')} isLoading={isLoading('save-branding')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings((prev) => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Minimum Password Length</label>
                  <input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings((prev) => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 8 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Allowed Domains (one per line)</label>
                <textarea
                  value={securitySettings.allowedDomains}
                  onChange={(e) => setSecuritySettings((prev) => ({ ...prev, allowedDomains: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="example.com&#10;company.org"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Require Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Force all users to enable 2FA</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.requireTwoFactor}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, requireTwoFactor: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enable Audit Log</h4>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Track all user actions and system changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAuditLog}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, enableAuditLog: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <LoadingButton onClick={() => handleSaveSettings('Security')} isLoading={isLoading('save-security')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Configuration</h3>

              {/* SMTP Settings */}
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">SMTP Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpHost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpUsername: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Password</label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">From Email</label>
                    <input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, fromEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">From Name</label>
                    <input
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, fromName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Test Email */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Test Email Configuration</h4>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={emailSettings.testEmail}
                    onChange={(e) => setEmailSettings((prev) => ({ ...prev, testEmail: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="test@example.com"
                  />
                  <LoadingButton onClick={handleTestEmail} isLoading={isLoading('test-email')} loadingText="Sending..." variant="primary">
                    Send Test
                  </LoadingButton>
                </div>
              </div>

              {/* Email Templates */}
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Email Templates</h4>
                <div className="space-y-4">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">{template.name}</h5>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={template.enabled} onChange={() => handleToggleEmailTemplate(template.id)} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreviewEmail(template)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEditEmail(template)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <LoadingButton
                            onClick={() => handleSendTestEmail(template)}
                            isLoading={isLoading(`test-email-${template.id}`)}
                            loadingText="Sending..."
                            variant="secondary"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Send className="w-4 h-4" />
                            <span>Test</span>
                          </LoadingButton>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-2">{template.content.substring(0, 150)}...</p>
                      {renderEmailTemplateVariables(template.variables)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <LoadingButton onClick={() => handleSaveSettings('Email')} isLoading={isLoading('save-email')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Webhook Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={webhookSettings.webhookUrl}
                    onChange={(e) => setWebhookSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="https://your-app.com/webhooks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Webhook Secret</label>
                  <input
                    type="password"
                    value={webhookSettings.webhookSecret}
                    onChange={(e) => setWebhookSettings((prev) => ({ ...prev, webhookSecret: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="Your webhook secret key"
                  />
                </div>
              </div>

              {/* Enabled Events */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Enabled Events</h4>
                <div className="space-y-3">
                  {Object.entries({
                    userCreated: 'User Created',
                    userUpdated: 'User Updated',
                    paymentReceived: 'Payment Received',
                    eventCreated: 'Event Created',
                    eventUpdated: 'Event Updated',
                  }).map(([key, label]) => {
                    type EventKey = keyof typeof webhookSettings.enabledEvents;
                    const typedKey = key as EventKey;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-zinc-300">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={webhookSettings.enabledEvents[typedKey]}
                            onChange={(e) =>
                              setWebhookSettings((prev) => ({
                                ...prev,
                                enabledEvents: {
                                  ...prev.enabledEvents,
                                  [typedKey]: e.target.checked,
                                },
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test Webhook */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Test Webhook</h4>
                <LoadingButton onClick={handleTestWebhook} isLoading={isLoading('test-webhook')} loadingText="Testing..." variant="primary">
                  Send Test Payload
                </LoadingButton>
              </div>

              <div className="flex justify-end">
                <LoadingButton onClick={() => handleSaveSettings('Webhook')} isLoading={isLoading('save-webhook')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </LoadingButton>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Management</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backup */}
                <div className="p-6 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Database Backup</h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">Create a backup of your database. This may take several minutes.</p>
                  <LoadingButton onClick={handleDatabaseBackup} variant="success" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Create Backup</span>
                  </LoadingButton>
                </div>

                {/* Restore */}
                <div className="p-6 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Database Restore</h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">Restore your database from a backup file.</p>
                  <LoadingButton onClick={handleDatabaseRestore} variant="danger" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Restore Backup</span>
                  </LoadingButton>
                </div>
              </div>

              {/* Database Stats */}
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Database Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2GB</div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">Database Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">15,432</div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">23</div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">Tables</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Important</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Database operations can affect system performance. It's recommended to perform these actions during maintenance windows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Preview Modal */}
      <Modal isOpen={showEmailPreviewModal} onClose={() => setShowEmailPreviewModal(false)} title="Email Template Preview" size="lg">
        {selectedEmailTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">Subject</label>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-white font-medium">{selectedEmailTemplate.subject}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2">Content</label>
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-sans">{selectedEmailTemplate.content}</pre>
              </div>
            </div>

            {renderEmailTemplateVariables(selectedEmailTemplate.variables)}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
              <LoadingButton
                onClick={() => handleSendTestEmail(selectedEmailTemplate)}
                isLoading={isLoading(`test-email-${selectedEmailTemplate.id}`)}
                loadingText="Sending..."
                variant="primary"
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Test Email</span>
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Email Edit Modal */}
      <Modal isOpen={showEmailEditModal} onClose={() => setShowEmailEditModal(false)} title="Edit Email Template" size="xl">
        {editingEmailTemplate && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Template Name</label>
              <input
                type="text"
                value={editingEmailTemplate.name}
                onChange={(e) => setEditingEmailTemplate((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Subject Line</label>
              <input
                type="text"
                value={editingEmailTemplate.subject}
                onChange={(e) => setEditingEmailTemplate((prev) => (prev ? { ...prev, subject: e.target.value } : null))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="Enter email subject line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email Content</label>
              <textarea
                value={editingEmailTemplate.content}
                onChange={(e) => setEditingEmailTemplate((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent font-mono text-sm"
                placeholder="Enter email content..."
              />
            </div>

            {renderEmailTemplateVariables(editingEmailTemplate.variables)}

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingEmailTemplate.enabled}
                  onChange={(e) => setEditingEmailTemplate((prev) => (prev ? { ...prev, enabled: e.target.checked } : null))}
                  className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Enable this template</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEmailEditModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <LoadingButton onClick={handleSaveEmailTemplate} isLoading={isLoading('save-email-template')} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={confirmationLoading}
      />
    </div>
  );
};

export default Settings;
