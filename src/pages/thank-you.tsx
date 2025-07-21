import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Mail, Calendar, Users, Star, Building2, Gift, Sparkles, ExternalLink, Settings } from 'lucide-react';

import { useAuth } from '@/contexts/hooks';

import { LoadingButton } from '@/components/user-inputs/buttons';

interface SubscriptionDetails {
  planName: string;
  planPrice: string;
  billingCycle: string;
  companyName: string;
  email: string;
}

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const subscriptionDetails: SubscriptionDetails = location.state?.subscriptionDetails || {
    planName: 'Professional',
    planPrice: '$299',
    billingCycle: 'monthly',
    companyName: 'Your Company',
    email: user?.email || 'your@email.com',
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice...');
  };

  const nextSteps = [
    {
      icon: Users,
      title: 'Set up your team',
      description: 'Invite team members and assign roles to get started quickly.',
      action: 'Invite Team',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Calendar,
      title: 'Create your first event',
      description: 'Start planning your first event with our intuitive event builder.',
      action: 'Create Event',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Settings,
      title: 'Customize your branding',
      description: 'Upload your logo and customize colors to match your brand.',
      action: 'Customize',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const benefits = [
    'Full access to all premium features',
    'Priority customer support',
    'Advanced analytics and reporting',
    'Custom branding options',
    'API access for integrations',
    '99.9% uptime guarantee',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-700 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Younivent</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Welcome aboard!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Younivent! 🎉</h1>
          <p className="text-xl text-gray-600 dark:text-zinc-400 mb-2">Your subscription has been successfully activated</p>
          <p className="text-gray-500 dark:text-zinc-500">Thank you for choosing Younivent. You're all set to start creating amazing events!</p>
        </div>
        {/* Subscription Details */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription Details</h2>
            <LoadingButton onClick={handleDownloadInvoice} variant="secondary" size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Invoice</span>
            </LoadingButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Plan</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{subscriptionDetails.planName}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Company</label>
                <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{subscriptionDetails.companyName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Billing</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {subscriptionDetails.planPrice}/{subscriptionDetails.billingCycle}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Email</label>
                <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{subscriptionDetails.email}</p>
              </div>
            </div>
          </div>
        </div>
        {/* What's Included */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>What's Included in Your Plan</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-zinc-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Next Steps */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>Recommended Next Steps</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-opacity-10 mb-4 ${step.color.replace('text-', 'bg-').replace(' dark:text-', ' dark:bg-')}`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">{step.description}</p>
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">{step.action} →</button>
                </div>
              );
            })}
          </div>
        </div>
        {/* Support Information */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help Getting Started?</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">Our support team is here to help you make the most of Younivent. We've also sent you a welcome email with helpful resources.</p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Documentation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="text-center">
          <LoadingButton onClick={handleGoToDashboard} variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
            <span>Get Started with Younivent</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
