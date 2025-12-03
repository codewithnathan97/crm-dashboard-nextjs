'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Info } from 'lucide-react';
import Link from 'next/link';
import { Deal, Customer, DealStage } from '@/types';

export interface DealModalProps {
  mode: 'create' | 'edit';
  deal?: Deal;
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STAGE_PROBABILITY: Record<DealStage, number> = {
  'prospecting': 10,
  'qualification': 25,
  'proposal': 50,
  'negotiation': 75,
  'closed-won': 100,
  'closed-lost': 0,
};

export default function DealModal({
  mode,
  deal,
  customers,
  isOpen,
  onClose,
  onSuccess,
}: DealModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    customerName: '',
    value: '',
    stage: 'prospecting' as DealStage,
    probability: 10,
    expectedCloseDate: '',
    description: '',
    assignedTo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && deal) {
      setFormData({
        title: deal.title || '',
        customerId: deal.customerId?.toString() || '',
        customerName: deal.customerName || '',
        value: deal.value?.toString() || '',
        stage: deal.stage as DealStage || 'prospecting',
        probability: deal.probability || 10,
        expectedCloseDate: deal.expectedCloseDate || '',
        description: deal.description || '',
        assignedTo: deal.assignedTo || '',
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        title: '',
        customerId: '',
        customerName: '',
        value: '',
        stage: 'prospecting',
        probability: 10,
        expectedCloseDate: '',
        description: '',
        assignedTo: '',
      });
    }
    setErrors({});
  }, [mode, deal]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Validation functions
  const validateTitle = (value: string): string | null => {
    if (!value.trim()) return 'Deal title is required';
    if (value.length > 200) return 'Title too long (max 200 characters)';
    return null;
  };

  const validateCustomer = (value: string): string | null => {
    if (!value) return 'Please select a customer';
    return null;
  };

  const validateValue = (value: string): string | null => {
    if (!value) return 'Deal value is required';
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return 'Value must be positive';
    return null;
  };

  const validateStage = (value: string): string | null => {
    if (!value) return 'Please select a stage';
    return null;
  };

  const handleFieldBlur = (field: string, value: string) => {
    let error: string | null = null;

    switch (field) {
      case 'title':
        error = validateTitle(value);
        break;
      case 'customerId':
        error = validateCustomer(value);
        break;
      case 'value':
        error = validateValue(value);
        break;
      case 'stage':
        error = validateStage(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleError = validateTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const customerError = validateCustomer(formData.customerId);
    if (customerError) newErrors.customerId = customerError;

    const valueError = validateValue(formData.value);
    if (valueError) newErrors.value = valueError;

    const stageError = validateStage(formData.stage);
    if (stageError) newErrors.stage = stageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const requestBody = {
        title: formData.title,
        customerId: parseInt(formData.customerId),
        customerName: formData.customerName,
        value: parseFloat(formData.value),
        stage: formData.stage,
        probability: formData.probability,
        expectedCloseDate: formData.expectedCloseDate || null,
        description: formData.description || null,
        assignedTo: formData.assignedTo || null,
      };

      const url = mode === 'edit' && deal ? `/api/deals/${deal.id}` : '/api/deals';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save deal');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
      setErrors({ submit: 'Failed to save deal. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageChange = (newStage: DealStage) => {
    setFormData((prev) => ({
      ...prev,
      stage: newStage,
      probability: STAGE_PROBABILITY[newStage],
    }));
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id.toString() === customerId);
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer ? `${customer.name}${customer.company ? ` - ${customer.company}` : ''}` : '',
    }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create Deal' : 'Edit Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={(e) => handleFieldBlur('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter deal title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          {/* Customer */}
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer <span className="text-red-500">*</span>
            </label>
            {customers.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No customers found. Please{' '}
                <Link href="/dashboard/customers" className="text-blue-600 hover:underline">
                  create a customer first
                </Link>
                .
              </div>
            ) : (
              <>
                <select
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  onBlur={(e) => handleFieldBlur('customerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}{customer.company ? ` - ${customer.company}` : ''}
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId}</p>}
              </>
            )}
          </div>

          {/* Value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deal Value <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="value"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                onBlur={(e) => handleFieldBlur('value', e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
            {errors.value && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.value}</p>}
          </div>

          {/* Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stage <span className="text-red-500">*</span>
            </label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => handleStageChange(e.target.value as DealStage)}
              onBlur={(e) => handleFieldBlur('stage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
            {errors.stage && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stage}</p>}
          </div>

          {/* Probability (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Probability (auto-calculated)
              <span className="inline-block ml-1" title="Automatically calculated based on stage">
                <Info className="inline-block w-4 h-4 text-gray-400" />
              </span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                {formData.probability}%
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${formData.probability}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Expected Close Date */}
          <div>
            <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expected Close Date
            </label>
            <input
              type="date"
              id="expectedCloseDate"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={1000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Add deal details..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/1000
            </p>
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              maxLength={100}
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter name"
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || customers.length === 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Deal' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}