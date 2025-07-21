import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Shield, Lock, Users, Star, Building2 } from 'lucide-react';
import { mockProductPlans } from '@/data/mockData';
import type { ProductPlan } from '@/types';

import { useCurrency } from '@/contexts/hooks';
import { useLoadingState, useNotifications } from '@/hooks';

import { LoadingButton } from '@/components/user-inputs/buttons';
import { LoadingSpinner } from '@/components/feedbacks';

const CheckoutPage: React.FC = () => {
  const { plan_id } = useParams<{ plan_id: string }>();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const { isLoading, withLoading } = useLoadingState();
  const { showSuccess, showError } = useNotifications();

  const [plan, setPlan] = useState<ProductPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    companyCountry: 'United States',
    companyWebsite: '',
    // Billing Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    // Agreement
    agreeToTerms: false,
    subscribeToUpdates: true,
  });

  useEffect(() => {
    if (plan_id) {
      const foundPlan = mockProductPlans.find((p) => p.id === plan_id);
      if (foundPlan) {
        setPlan(foundPlan);
        setBillingCycle(foundPlan.billingCycle);
      }
    }
  }, [plan_id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculatePrice = () => {
    if (!plan) return 0;

    if (plan.price === 0) return 0;

    if (billingCycle === 'yearly') {
      return plan.price * 12 * 0.8;
    }

    return plan.price;
  };

  const calculateSavings = () => {
    if (!plan || plan.price === 0) return 0;

    if (billingCycle === 'yearly') {
      return plan.price * 12 * 0.2; // 20% savings
    }

    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plan) return;

    if (!formData.companyName.trim()) {
      showError('Company name required', 'Please enter your company name.');
      return;
    }

    if (!formData.email.trim()) {
      showError('Email required', 'Please enter your email address.');
      return;
    }

    if (!formData.agreeToTerms) {
      showError('Terms agreement required', 'Please agree to the terms and conditions.');
      return;
    }

    if (plan.price > 0) {
      if (!formData.cardNumber.trim() || !formData.expiryDate.trim() || !formData.cvv.trim()) {
        showError('Payment information required', 'Please complete all payment fields.');
        return;
      }
    }

    await withLoading('checkout', async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate payment processing

      console.log('Processing checkout:', {
        plan: plan.name,
        billingCycle,
        price: calculatePrice(),
        formData,
      });

      showSuccess('Subscription successful!', `Welcome to ${plan.name}! Your account has been created and you can start using Younivent immediately.`);

      setTimeout(() => {
        navigate('/thank-you', {
          state: {
            subscriptionDetails: {
              planName: plan.name,
              planPrice: plan.price === 0 ? 'Free' : formatCurrency(calculatePrice()),
              billingCycle,
              companyName: formData.companyName,
              email: formData.email,
            },
          },
        });
      }, 2000);
    });
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading plan details..." />
      </div>
    );
  }

  const displayPrice = plan.price === 0 ? 'Free' : formatCurrency(calculatePrice());
  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header with Logo */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-700 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Younivent</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Steps */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Plan Selection</span>
            </div>
            <div className="w-12 h-px bg-gray-300 dark:bg-zinc-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Checkout</span>
            </div>
            <div className="w-12 h-px bg-gray-300 dark:bg-zinc-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">Complete</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Subscription</h2>
          <p className="text-lg text-gray-600 dark:text-zinc-400">
            You're subscribing to the <span className="font-semibold text-blue-700 dark:text-blue-400">{plan.name}</span> plan
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Information */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Company Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
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
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Phone</label>
                    <input
                      type="tel"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Company Website</label>
                    <input
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
              </div>
              {/* Billing Contact */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Billing Contact</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              {/* Payment Information */}
              {plan.price > 0 && (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Information</span>
                  </h3>
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'paypal')}
                          className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Credit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'paypal')}
                          className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">PayPal</span>
                      </label>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Card Number *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">CVV *</label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="123"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'paypal' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-400">You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                  )}
                </div>
              )}
              {/* Terms and Conditions */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="w-4 h-4 text-blue-700 focus:ring-blue-700 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">
                      I agree to the{' '}
                      <a href="#" className="text-blue-700 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-700 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </a>{' '}
                      *
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.subscribeToUpdates}
                      onChange={(e) => handleInputChange('subscribeToUpdates', e.target.checked)}
                      className="w-4 h-4 text-blue-700 focus:ring-blue-700 mt-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">Subscribe to product updates and newsletters</span>
                  </label>
                </div>
              </div>
              {/* Submit Button */}
              <LoadingButton type="submit" isLoading={isLoading('checkout')} loadingText="Processing..." variant="primary" className="w-full flex items-center justify-center space-x-2 py-3 text-base">
                <Lock className="w-5 h-5" />
                <span>{plan.price === 0 ? 'Start Free Plan' : `Subscribe for ${displayPrice}${billingCycle === 'yearly' ? '/year' : '/month'}`}</span>
              </LoadingButton>
            </form>
          </div>
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              {/* Plan Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">{plan.description}</p>
                  </div>
                </div>
                {/* Billing Cycle Selection */}
                {plan.price > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Billing Cycle</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            value="monthly"
                            checked={billingCycle === 'monthly'}
                            onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                            className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(plan.price)}/month</span>
                      </label>
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            value="yearly"
                            checked={billingCycle === 'yearly'}
                            onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                            className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Yearly</span>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">Save 20%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(plan.price * 12 * 0.8)}/year</span>
                          <div className="text-xs text-gray-500 dark:text-zinc-400 line-through">{formatCurrency(plan.price * 12)}</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {/* Features */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-zinc-400">
                    {plan.name} ({billingCycle})
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{plan.price === 0 ? 'Free' : formatCurrency(billingCycle === 'yearly' ? plan.price * 12 : plan.price)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400">Yearly discount (20%)</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">-{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-zinc-800 pt-3">
                  <span>Total</span>
                  <span>
                    {displayPrice}
                    {plan.price > 0 && (billingCycle === 'yearly' ? '/year' : '/month')}
                  </span>
                </div>
              </div>
              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                  <Shield className="w-4 h-4" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
