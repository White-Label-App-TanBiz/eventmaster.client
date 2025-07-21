import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Server, Database, Globe, Settings, Terminal, Copy, CheckCircle, HelpCircle, ExternalLink, Code, Rocket, Mail } from 'lucide-react';

import { useNotifications, useLoadingState } from '@/hooks';

import { LoadingButton } from '@/components/user-inputs/buttons';

interface FormData {
  nodeVersion: string;
  npmVersion: string;
  webServer: string;
  companyName: string;
  companyEmail: string;
  adminEmail: string;
  adminPassword: string;
  customDomain: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpEncryption: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  deploymentMethod: string;
  sslMethod: string;
  serverChecklist: {
    nodeInstalled: boolean;
    npmInstalled: boolean;
    webServerInstalled: boolean;
    gitInstalled: boolean;
    sshAccess: boolean;
  };
  [key: string]: any;
}

const WhiteLabelSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo, showError } = useNotifications();
  const { isLoading, withLoading } = useLoadingState();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    // Server Environment
    nodeVersion: '18.x',
    npmVersion: '9.x',
    webServer: 'nginx',
    // Application Configuration
    companyName: '',
    companyEmail: '',
    adminEmail: '',
    adminPassword: '',
    customDomain: '',
    // SMTP Settings
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    // Database Configuration
    dbHost: 'localhost',
    dbPort: '5432',
    dbName: 'younivent',
    dbUser: 'postgres',
    dbPassword: '',
    // Deployment
    deploymentMethod: 'pm2',
    sslMethod: 'letsencrypt',
    // Checklist
    serverChecklist: {
      nodeInstalled: false,
      npmInstalled: false,
      webServerInstalled: false,
      gitInstalled: false,
      sshAccess: false,
    },
  });

  const totalSteps = 7;

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === '') {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinish = async () => {
    await withLoading('finish-setup', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      showSuccess('Setup completed!', 'Your white-label installation is now ready to use.');
      navigate('/client-dashboard/white-label');
    });
  };

  const handleCopyToClipboard = async (text: string, description: string = 'Text') => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Copied!', `${description} has been copied to clipboard.`);
    } catch (error) {
      showError('Copy failed', 'Failed to copy to clipboard. Please try again.');
    }
  };

  const isStepComplete = (step: number) => {
    return completedSteps.includes(step);
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = isStepComplete(stepNumber);

            return (
              <React.Fragment key={stepNumber}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-700 text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'}`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-xs mt-2 ${isActive ? 'text-blue-700 dark:text-blue-400 font-medium' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-zinc-400'}`}
                  >
                    {getStepName(stepNumber)}
                  </span>
                </div>
                {/* Connector Line (except after last step) */}
                {stepNumber < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 ${isCompleted && isStepComplete(stepNumber + 1) ? 'bg-emerald-600' : isCompleted || (isActive && stepNumber > 1) ? 'bg-blue-700' : 'bg-gray-200 dark:bg-zinc-700'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const getStepName = (step: number) => {
    switch (step) {
      case 1:
        return 'Welcome';
      case 2:
        return 'Environment';
      case 3:
        return 'Configuration';
      case 4:
        return 'Database';
      case 5:
        return 'Deployment';
      case 6:
        return 'DNS & SSL';
      case 7:
        return 'Finalize';
      default:
        return `Step ${step}`;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Rocket className="w-6 h-6" />;
      case 2:
        return <Server className="w-6 h-6" />;
      case 3:
        return <Settings className="w-6 h-6" />;
      case 4:
        return <Database className="w-6 h-6" />;
      case 5:
        return <Terminal className="w-6 h-6" />;
      case 6:
        return <Globe className="w-6 h-6" />;
      case 7:
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <HelpCircle className="w-6 h-6" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <Rocket className="w-8 h-8 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Younivent White-Label Setup</h2>
              <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
                This wizard will guide you through the process of setting up your own white-labeled event management platform. Follow each step to configure and deploy your custom instance.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What You'll Need</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Server className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">A Linux Server</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Ubuntu 20.04 LTS or later recommended with at least 2GB RAM and 1 CPU core</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">A Domain Name</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">A domain or subdomain that you can configure DNS settings for</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Database className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">PostgreSQL Database</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">PostgreSQL 13 or later, either installed locally or a managed service</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMTP Server</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">SMTP credentials for sending emails (can use services like SendGrid, Mailgun, etc.)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Command Line Access</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">SSH access to your server with sudo privileges</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 text-blue-700 dark:text-blue-400 mr-2" />
                Need Help?
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">
                If you need assistance with your white-label setup, our support team is here to help. We also offer professional installation services if you prefer.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => showInfo('Documentation', 'Opening documentation in a new tab.')}
                  className="flex items-center space-x-2 px-4 py-2 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Documentation</span>
                </button>
                <button
                  onClick={() => showInfo('Contact Support', 'Opening support contact form.')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Server Environment Setup</h2>
              <p className="text-gray-600 dark:text-zinc-400">Ensure your server meets the following requirements before proceeding with the installation.</p>
            </div>
            {/* Server Requirements */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Server className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Operating System</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Ubuntu 20.04 LTS or later</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">Recommended</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-zinc-400">
                      <span className="text-lg font-mono">$</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Memory</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Minimum 2GB RAM</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-zinc-400">
                      <span className="text-lg font-mono">$</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">CPU</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Minimum 1 CPU core (2+ recommended)</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-zinc-400">
                      <span className="text-lg font-mono">$</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Storage</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Minimum 20GB SSD storage</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">Required</span>
                </div>
              </div>
            </div>
            {/* Software Requirements */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Software Requirements</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.serverChecklist.nodeInstalled}
                        onChange={(e) => handleInputChange('serverChecklist', 'nodeInstalled', e.target.checked)}
                        className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">Node.js</span>
                    </label>
                    <select
                      value={formData.nodeVersion}
                      onChange={(e) => handleInputChange('', 'nodeVersion', e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="18.x">v18.x LTS</option>
                      <option value="20.x">v20.x LTS</option>
                      <option value="21.x">v21.x Current</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Installation command:</p>
                      <button
                        onClick={() => handleCopyToClipboard('curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs', 'Node.js installation command')}
                        className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                      curl -fsSL https://deb.nodesource.com/setup_{formData.nodeVersion} | sudo -E bash - && sudo apt-get install -y nodejs
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.serverChecklist.npmInstalled}
                        onChange={(e) => handleInputChange('serverChecklist', 'npmInstalled', e.target.checked)}
                        className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">npm</span>
                    </label>
                    <select
                      value={formData.npmVersion}
                      onChange={(e) => handleInputChange('', 'npmVersion', e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="9.x">v9.x</option>
                      <option value="10.x">v10.x</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">npm is included with Node.js installation</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.serverChecklist.webServerInstalled}
                        onChange={(e) => handleInputChange('serverChecklist', 'webServerInstalled', e.target.checked)}
                        className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">Web Server</span>
                    </label>
                    <select
                      value={formData.webServer}
                      onChange={(e) => handleInputChange('', 'webServer', e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="nginx">Nginx</option>
                      <option value="apache">Apache</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Installation command:</p>
                      <button
                        onClick={() => handleCopyToClipboard('sudo apt-get update && sudo apt-get install -y nginx', 'Nginx installation command')}
                        className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                      {formData.webServer === 'nginx' ? 'sudo apt-get update && sudo apt-get install -y nginx' : 'sudo apt-get update && sudo apt-get install -y apache2'}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.serverChecklist.gitInstalled}
                        onChange={(e) => handleInputChange('serverChecklist', 'gitInstalled', e.target.checked)}
                        className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">Git</span>
                    </label>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-zinc-400">Installation command:</p>
                      <button
                        onClick={() => handleCopyToClipboard('sudo apt-get update && sudo apt-get install -y git', 'Git installation command')}
                        className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo apt-get update && sudo apt-get install -y git</pre>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.serverChecklist.sshAccess}
                        onChange={(e) => handleInputChange('serverChecklist', 'sshAccess', e.target.checked)}
                        className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">SSH Access</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Ensure you have SSH access to your server with sudo privileges</p>
                </div>
              </div>
            </div>
            {/* PM2 Installation */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Process Manager (PM2)</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">PM2 is a process manager for Node.js applications that keeps your application running in the background.</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Installation command:</p>
                  <button
                    onClick={() => handleCopyToClipboard('sudo npm install -g pm2', 'PM2 installation command')}
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo npm install -g pm2</pre>
              </div>
            </div>
            {/* Verification */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verify Installation</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Run these commands to verify that everything is installed correctly:</p>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Check Node.js version:</p>
                    <button onClick={() => handleCopyToClipboard('node -v', 'Node.js version command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">node -v</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Check npm version:</p>
                    <button onClick={() => handleCopyToClipboard('npm -v', 'npm version command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">npm -v</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Check PM2 version:</p>
                    <button onClick={() => handleCopyToClipboard('pm2 -v', 'PM2 version command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">pm2 -v</pre>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Configuration</h2>
              <p className="text-gray-600 dark:text-zinc-400">Configure the core settings for your white-labeled application.</p>
            </div>
            {/* Basic Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('', 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="Your Company Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Email *</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('', 'companyEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="info@yourcompany.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Admin Email *</label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('', 'adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="admin@yourcompany.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Admin Password *</label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => handleInputChange('', 'adminPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="••••••••••••"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Must be at least 8 characters with letters, numbers, and special characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Custom Domain *</label>
                  <input
                    type="text"
                    value={formData.customDomain}
                    onChange={(e) => handleInputChange('', 'customDomain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="events.yourcompany.com"
                    required
                  />
                </div>
              </div>
            </div>
            {/* SMTP Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SMTP Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Configure SMTP settings to enable email functionality in your application.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Host *</label>
                  <input
                    type="text"
                    value={formData.smtpHost}
                    onChange={(e) => handleInputChange('', 'smtpHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="smtp.yourcompany.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Port *</label>
                  <input
                    type="text"
                    value={formData.smtpPort}
                    onChange={(e) => handleInputChange('', 'smtpPort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="587"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Username *</label>
                  <input
                    type="text"
                    value={formData.smtpUser}
                    onChange={(e) => handleInputChange('', 'smtpUser', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">SMTP Password *</label>
                  <input
                    type="password"
                    value={formData.smtpPassword}
                    onChange={(e) => handleInputChange('', 'smtpPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Encryption</label>
                  <select
                    value={formData.smtpEncryption}
                    onChange={(e) => handleInputChange('', 'smtpEncryption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Environment Variables */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Environment Variables</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">These environment variables will be automatically generated based on your configuration.</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Environment variables:</p>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(
                        `NODE_ENV=production
PORT=3000
APP_NAME="${formData.companyName}"
APP_URL=https://${formData.customDomain}
ADMIN_EMAIL=${formData.adminEmail}
SMTP_HOST=${formData.smtpHost}
SMTP_PORT=${formData.smtpPort}
SMTP_USER=${formData.smtpUser}
SMTP_PASSWORD=******
SMTP_ENCRYPTION=${formData.smtpEncryption}
DATABASE_URL=postgresql://${formData.dbUser}:******@${formData.dbHost}:${formData.dbPort}/${formData.dbName}`,
                        'Environment variables',
                      )
                    }
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                  {`NODE_ENV=production
PORT=3000
APP_NAME="${formData.companyName || 'Your Company Name'}"
APP_URL=https://${formData.customDomain || 'events.yourcompany.com'}
ADMIN_EMAIL=${formData.adminEmail || 'admin@yourcompany.com'}
SMTP_HOST=${formData.smtpHost || 'smtp.yourcompany.com'}
SMTP_PORT=${formData.smtpPort}
SMTP_USER=${formData.smtpUser || 'username'}
SMTP_PASSWORD=******
SMTP_ENCRYPTION=${formData.smtpEncryption}
DATABASE_URL=postgresql://${formData.dbUser || 'postgres'}:******@${formData.dbHost}:${formData.dbPort}/${formData.dbName}`}
                </pre>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Database Setup</h2>
              <p className="text-gray-600 dark:text-zinc-400">Configure your PostgreSQL database for the application.</p>
            </div>
            {/* Database Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PostgreSQL Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Database Host *</label>
                  <input
                    type="text"
                    value={formData.dbHost}
                    onChange={(e) => handleInputChange('', 'dbHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="localhost"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Database Port *</label>
                  <input
                    type="text"
                    value={formData.dbPort}
                    onChange={(e) => handleInputChange('', 'dbPort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="5432"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Database Name *</label>
                  <input
                    type="text"
                    value={formData.dbName}
                    onChange={(e) => handleInputChange('', 'dbName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="younivent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Database User *</label>
                  <input
                    type="text"
                    value={formData.dbUser}
                    onChange={(e) => handleInputChange('', 'dbUser', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="postgres"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Database Password *</label>
                  <input
                    type="password"
                    value={formData.dbPassword}
                    onChange={(e) => handleInputChange('', 'dbPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            {/* PostgreSQL Installation */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PostgreSQL Installation</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">If you need to install PostgreSQL on your server, follow these steps:</p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">1. Install PostgreSQL:</p>
                    <button
                      onClick={() => handleCopyToClipboard('sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib', 'PostgreSQL installation command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">2. Create a database and user:</p>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          `sudo -u postgres psql -c "CREATE DATABASE ${formData.dbName};"
sudo -u postgres psql -c "CREATE USER ${formData.dbUser} WITH ENCRYPTED PASSWORD '${formData.dbPassword}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${formData.dbName} TO ${formData.dbUser};"`,
                          'Database creation commands',
                        )
                      }
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                    {`sudo -u postgres psql -c "CREATE DATABASE ${formData.dbName || 'younivent'};"
sudo -u postgres psql -c "CREATE USER ${formData.dbUser || 'postgres'} WITH ENCRYPTED PASSWORD '${formData.dbPassword ? '********' : 'your_password'}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${formData.dbName || 'younivent'} TO ${formData.dbUser || 'postgres'};"`}
                  </pre>
                </div>
              </div>
            </div>
            {/* Database Connection String */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Connection String</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Your application will use this connection string to connect to the database:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Connection string:</p>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(`postgresql://${formData.dbUser}:${formData.dbPassword}@${formData.dbHost}:${formData.dbPort}/${formData.dbName}`, 'Database connection string')
                    }
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                  postgresql://{formData.dbUser || 'postgres'}:{formData.dbPassword ? '********' : 'your_password'}@{formData.dbHost}:{formData.dbPort}/{formData.dbName}
                </pre>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Deployment</h2>
              <p className="text-gray-600 dark:text-zinc-400">Follow these steps to deploy the Younivent application on your server.</p>
            </div>
            {/* Download Application */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download Application</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">First, download the Younivent application package to your server:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Clone the repository:</p>
                  <button
                    onClick={() => handleCopyToClipboard('git clone https://github.com/younivent/white-label.git /var/www/younivent', 'Git clone command')}
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">git clone https://github.com/younivent/white-label.git /var/www/younivent</pre>
              </div>
            </div>
            {/* Configure Environment */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configure Environment</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Create and configure the environment variables file:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Create .env file:</p>
                  <button
                    onClick={() => handleCopyToClipboard(`cd /var/www/younivent && cp .env.example .env && nano .env`, 'Create .env command')}
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">cd /var/www/younivent && cp .env.example .env && nano .env</pre>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-4 mb-2">Add the following environment variables to the .env file:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Environment variables:</p>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(
                        `NODE_ENV=production
PORT=3000
APP_NAME="${formData.companyName}"
APP_URL=https://${formData.customDomain}
ADMIN_EMAIL=${formData.adminEmail}
SMTP_HOST=${formData.smtpHost}
SMTP_PORT=${formData.smtpPort}
SMTP_USER=${formData.smtpUser}
SMTP_PASSWORD=${formData.smtpPassword}
SMTP_ENCRYPTION=${formData.smtpEncryption}
DATABASE_URL=postgresql://${formData.dbUser}:${formData.dbPassword}@${formData.dbHost}:${formData.dbPort}/${formData.dbName}`,
                        'Environment variables',
                      )
                    }
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                  {`NODE_ENV=production
PORT=3000
APP_NAME="${formData.companyName || 'Your Company Name'}"
APP_URL=https://${formData.customDomain || 'events.yourcompany.com'}
ADMIN_EMAIL=${formData.adminEmail || 'admin@yourcompany.com'}
SMTP_HOST=${formData.smtpHost || 'smtp.yourcompany.com'}
SMTP_PORT=${formData.smtpPort}
SMTP_USER=${formData.smtpUser || 'username'}
SMTP_PASSWORD=${formData.smtpPassword ? '********' : 'your_password'}
SMTP_ENCRYPTION=${formData.smtpEncryption}
DATABASE_URL=postgresql://${formData.dbUser || 'postgres'}:${formData.dbPassword ? '********' : 'your_password'}@${formData.dbHost}:${formData.dbPort}/${formData.dbName}`}
                </pre>
              </div>
            </div>
            {/* Install Dependencies and Build */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Install Dependencies and Build</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Install the required dependencies and build the application:</p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Install dependencies:</p>
                    <button
                      onClick={() => handleCopyToClipboard('cd /var/www/younivent && npm install', 'Install dependencies command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">cd /var/www/younivent && npm install</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Run database migrations:</p>
                    <button
                      onClick={() => handleCopyToClipboard('cd /var/www/younivent && npm run migrate', 'Run migrations command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">cd /var/www/younivent && npm run migrate</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Build the application:</p>
                    <button
                      onClick={() => handleCopyToClipboard('cd /var/www/younivent && npm run build', 'Build command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">cd /var/www/younivent && npm run build</pre>
                </div>
              </div>
            </div>
            {/* Start Application with PM2 */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Start Application with PM2</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Use PM2 to start and manage your application:</p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Start the application:</p>
                    <button
                      onClick={() => handleCopyToClipboard('cd /var/www/younivent && pm2 start npm --name "younivent" -- start', 'PM2 start command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">cd /var/www/younivent && pm2 start npm --name "younivent" -- start</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Save PM2 configuration:</p>
                    <button onClick={() => handleCopyToClipboard('pm2 save', 'PM2 save command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">pm2 save</pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Setup PM2 to start on boot:</p>
                    <button onClick={() => handleCopyToClipboard('pm2 startup', 'PM2 startup command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">pm2 startup</pre>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">DNS and SSL Configuration</h2>
              <p className="text-gray-600 dark:text-zinc-400">Configure your domain's DNS settings and set up SSL certificates for secure HTTPS access.</p>
            </div>
            {/* Web Server Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{formData.webServer === 'nginx' ? 'Nginx' : 'Apache'} Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Create a server configuration file for your domain:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Create configuration file:</p>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(
                        formData.webServer === 'nginx'
                          ? `sudo nano /etc/nginx/sites-available/${formData.customDomain || 'younivent'}`
                          : `sudo nano /etc/apache2/sites-available/${formData.customDomain || 'younivent'}.conf`,
                        'Create config file command',
                      )
                    }
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                  {formData.webServer === 'nginx'
                    ? `sudo nano /etc/nginx/sites-available/${formData.customDomain || 'younivent'}`
                    : `sudo nano /etc/apache2/sites-available/${formData.customDomain || 'younivent'}.conf`}
                </pre>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-4 mb-2">Add the following configuration:</p>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Server configuration:</p>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(
                        formData.webServer === 'nginx'
                          ? `server {
    listen 80;
    server_name ${formData.customDomain || 'events.yourcompany.com'};
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`
                          : `<VirtualHost *:80>
    ServerName ${formData.customDomain || 'events.yourcompany.com'}
    
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full
    
    <Proxy *>
        Require all granted
    </Proxy>
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>`,
                        'Server configuration',
                      )
                    }
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                  {formData.webServer === 'nginx'
                    ? `server {
    listen 80;
    server_name ${formData.customDomain || 'events.yourcompany.com'};
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`
                    : `<VirtualHost *:80>
    ServerName ${formData.customDomain || 'events.yourcompany.com'}
    
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full
    
    <Proxy *>
        Require all granted
    </Proxy>
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>`}
                </pre>
              </div>
            </div>
            {/* Enable Site Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enable Site Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Enable the site configuration and restart the web server:</p>
              <div className="space-y-4">
                {formData.webServer === 'nginx' ? (
                  <>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Create symbolic link:</p>
                        <button
                          onClick={() => handleCopyToClipboard(`sudo ln -s /etc/nginx/sites-available/${formData.customDomain || 'younivent'} /etc/nginx/sites-enabled/`, 'Nginx symlink command')}
                          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                        sudo ln -s /etc/nginx/sites-available/{formData.customDomain || 'younivent'} /etc/nginx/sites-enabled/
                      </pre>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Test configuration:</p>
                        <button onClick={() => handleCopyToClipboard('sudo nginx -t', 'Nginx test command')} className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo nginx -t</pre>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Restart Nginx:</p>
                        <button
                          onClick={() => handleCopyToClipboard('sudo systemctl restart nginx', 'Nginx restart command')}
                          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo systemctl restart nginx</pre>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Enable site:</p>
                        <button
                          onClick={() => handleCopyToClipboard(`sudo a2ensite ${formData.customDomain || 'younivent'}.conf`, 'Apache enable site command')}
                          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo a2ensite {formData.customDomain || 'younivent'}.conf</pre>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Enable proxy modules:</p>
                        <button
                          onClick={() => handleCopyToClipboard('sudo a2enmod proxy proxy_http', 'Apache enable modules command')}
                          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo a2enmod proxy proxy_http</pre>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Restart Apache:</p>
                        <button
                          onClick={() => handleCopyToClipboard('sudo systemctl restart apache2', 'Apache restart command')}
                          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo systemctl restart apache2</pre>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* DNS Configuration */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DNS Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Configure your domain's DNS settings to point to your server:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-700">
                      <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Record Type</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Name</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">Value</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700 dark:text-zinc-300">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-zinc-700">
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">A</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">{formData.customDomain ? formData.customDomain.split('.')[0] : '@'}</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">YOUR_SERVER_IP</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">3600</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">CNAME</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">www</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">{formData.customDomain || 'events.yourcompany.com'}</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-zinc-400">3600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-4">Replace "YOUR_SERVER_IP" with your actual server IP address. DNS changes may take up to 24-48 hours to propagate.</p>
            </div>
            {/* SSL Certificate */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SSL Certificate Setup</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Set up SSL certificates using Let's Encrypt for secure HTTPS access:</p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">1. Install Certbot:</p>
                    <button
                      onClick={() => handleCopyToClipboard('sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx', 'Certbot installation command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                    sudo apt-get update && sudo apt-get install -y certbot {formData.webServer === 'nginx' ? 'python3-certbot-nginx' : 'python3-certbot-apache'}
                  </pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">2. Obtain SSL certificate:</p>
                    <button
                      onClick={() => handleCopyToClipboard(`sudo certbot --${formData.webServer} -d ${formData.customDomain || 'events.yourcompany.com'}`, 'Certbot command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">
                    sudo certbot --{formData.webServer} -d {formData.customDomain || 'events.yourcompany.com'}
                  </pre>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">3. Setup auto-renewal:</p>
                    <button
                      onClick={() => handleCopyToClipboard('sudo certbot renew --dry-run', 'Certbot renewal test command')}
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 rounded font-mono overflow-x-auto">sudo certbot renew --dry-run</pre>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Installation Complete!</h2>
              <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Congratulations! You've successfully set up your white-labeled Younivent platform. Here's a summary of your installation and next steps.
              </p>
            </div>
            {/* Installation Summary */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Installation Summary</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Application URL</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a href={`https://${formData.customDomain || 'events.yourcompany.com'}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:underline">
                        https://{formData.customDomain || 'events.yourcompany.com'}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Admin Dashboard</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a
                        href={`https://${formData.customDomain || 'events.yourcompany.com'}/admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        https://{formData.customDomain || 'events.yourcompany.com'}/admin
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Admin Credentials</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Email: {formData.adminEmail || 'admin@yourcompany.com'}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Next Steps */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 dark:text-blue-400 font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Log in to your admin dashboard</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Access your admin dashboard using the credentials you configured during setup.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 dark:text-blue-400 font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Customize your branding</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Update your logo, colors, and other branding elements in the White-Label settings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 dark:text-blue-400 font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Set up payment gateways</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Configure payment gateways to start accepting payments for events.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 dark:text-blue-400 font-medium">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Create your first event</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Start creating events and inviting customers to your platform.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Support Resources */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Documentation</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a
                        href="#"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          showInfo('Documentation', 'Opening documentation in a new tab.');
                        }}
                      >
                        View our comprehensive documentation
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a href="mailto:support@younivent.com" className="text-blue-700 dark:text-blue-400 hover:underline">
                        support@younivent.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">API Reference</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a
                        href="#"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          showInfo('API Reference', 'Opening API reference in a new tab.');
                        }}
                      >
                        Explore our API documentation
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Knowledge Base</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <a
                        href="#"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          showInfo('Knowledge Base', 'Opening knowledge base in a new tab.');
                        }}
                      >
                        Browse our help articles
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Step Indicator */}
        {renderStepIndicator()}
        {/* Step Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">{getStepIcon(currentStep)}</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getStepName(currentStep)}</h2>
          </div>
          {renderStepContent()}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex space-x-3">
            {currentStep < totalSteps && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Skip
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <LoadingButton onClick={handleFinish} isLoading={isLoading('finish-setup')} loadingText="Completing..." variant="primary" className="flex items-center space-x-2">
                <span>Complete Setup</span>
                <Check className="w-4 h-4" />
              </LoadingButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelSetupPage;
