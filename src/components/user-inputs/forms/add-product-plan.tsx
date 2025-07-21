import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { AddProductPlanFormProps, ProductPlanCreate, ProductPlanUpdate } from './types';

import { useCurrency } from '@/contexts/hooks';
import { useNotifications } from '@/hooks';

const AddProductPlanForm: React.FC<AddProductPlanFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { showSuccess, showError } = useNotifications();
  const { formatCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    features: [''],
    maxProviders: '1' as string, // Changed to string to allow -1 input
    maxEvents: '1' as string, // Changed to string to allow -1 input
    maxCustomers: '100' as string, // Changed to string to allow -1 input
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        currency: initialData.currency,
        billingCycle: initialData.billingCycle,
        features: initialData.features.length > 0 ? initialData.features : [''],
        maxProviders: initialData.maxProviders.toString(),
        maxEvents: initialData.maxEvents.toString(),
        maxCustomers: initialData.maxCustomers.toString(),
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    const maxProviders = parseInt(formData.maxProviders);
    if (isNaN(maxProviders) || (maxProviders !== -1 && maxProviders <= 0)) {
      newErrors.maxProviders = 'Must be -1 (unlimited) or a positive number';
    }

    const maxEvents = parseInt(formData.maxEvents);
    if (isNaN(maxEvents) || (maxEvents !== -1 && maxEvents <= 0)) {
      newErrors.maxEvents = 'Must be -1 (unlimited) or a positive number';
    }

    const maxCustomers = parseInt(formData.maxCustomers);
    if (isNaN(maxCustomers) || (maxCustomers !== -1 && maxCustomers <= 0)) {
      newErrors.maxCustomers = 'Must be -1 (unlimited) or a positive number';
    }

    const validFeatures = formData.features.filter((feature) => feature.trim() !== '');
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validFeatures = formData.features.filter((feature) => feature.trim() !== '');
      try {
        if (isEditing) {
          const planData: ProductPlanUpdate = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            currency: formData.currency,
            billingCycle: formData.billingCycle,
            features: validFeatures,
            maxProviders: parseInt(formData.maxProviders),
            maxEvents: parseInt(formData.maxEvents),
            maxCustomers: parseInt(formData.maxCustomers),
            isActive: formData.isActive,
          };
          onSubmit(planData);
        } else {
          const planData: ProductPlanCreate = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            currency: formData.currency,
            billingCycle: formData.billingCycle,
            features: validFeatures,
            maxProviders: parseInt(formData.maxProviders),
            maxEvents: parseInt(formData.maxEvents),
            maxCustomers: parseInt(formData.maxCustomers),
            isActive: formData.isActive,
          };
          onSubmit(planData);
        }

        const actionText = isEditing ? 'updated' : 'created';
        showSuccess(`Plan ${actionText} successfully!`, `Your product plan has been ${actionText}.`);
      } catch (error) {
        const actionText = isEditing ? 'update' : 'create';
        showError(`Failed to ${actionText} plan`, `There was an error ${actionText === 'create' ? 'creating' : 'updating'} the product plan. Please try again.`);
      }
    } else {
      showError('Validation failed', 'Please fix the errors in the form before submitting.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }));
  };

  const displayPrice = () => {
    if (formData.price === 0) {
      return 'Free';
    }

    return formatCurrency(formData.price);
  };

  const displayLimitValue = (value: string) => {
    const numValue = parseInt(value);
    if (numValue === -1) {
      return 'Unlimited';
    }
    return value;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Plan Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
            }`}
            placeholder="e.g., Professional"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Billing Cycle</label>
          <select
            value={formData.billingCycle}
            onChange={(e) => handleInputChange('billingCycle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
          }`}
          placeholder="Describe what this plan offers..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Price *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400">$</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Enter 0 for a free plan</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            disabled={formData.price === 0}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {formData.price === 0 && <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Currency is not applicable for free plans</p>}
        </div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Price Preview</h4>
            <p className="text-sm text-gray-500 dark:text-zinc-400">How this plan will be displayed</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{displayPrice()}</div>
            {formData.price > 0 && <div className="text-sm text-gray-500 dark:text-zinc-400">/{formData.billingCycle}</div>}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Plan Limits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Max Providers *</label>
            <input
              type="text"
              value={formData.maxProviders}
              onChange={(e) => handleInputChange('maxProviders', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
                errors.maxProviders ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
              placeholder="-1 for unlimited"
            />
            {errors.maxProviders && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxProviders}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Enter -1 for unlimited, or a positive number</p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Preview: {displayLimitValue(formData.maxProviders)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Max Events *</label>
            <input
              type="text"
              value={formData.maxEvents}
              onChange={(e) => handleInputChange('maxEvents', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
                errors.maxEvents ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
              placeholder="-1 for unlimited"
            />
            {errors.maxEvents && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxEvents}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Enter -1 for unlimited, or a positive number</p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Preview: {displayLimitValue(formData.maxEvents)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Max Customers *</label>
            <input
              type="text"
              value={formData.maxCustomers}
              onChange={(e) => handleInputChange('maxCustomers', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all ${
                errors.maxCustomers ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
              placeholder="-1 for unlimited"
            />
            {errors.maxCustomers && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxCustomers}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">Enter -1 for unlimited, or a positive number</p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Preview: {displayLimitValue(formData.maxCustomers)}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Features *</h4>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature</span>
          </button>
        </div>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  placeholder="Enter feature description"
                />
              </div>
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.features && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.features}</p>}
      </div>
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300 rounded focus:ring-blue-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{isEditing ? 'Keep this plan active' : 'Activate this plan immediately'}</span>
        </label>
      </div>
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-xl"
        >
          {isEditing ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
};

export default AddProductPlanForm;
