'use client';

import { useEffect, useState } from 'react';
import Card from '@/app/components/Card';
import Table from '@/app/components/Table';
import Toast from '@/app/components/Toast';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import DealModal from '@/app/components/DealModal';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Deal, Customer } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; dealId?: number }>({
    isOpen: false
  });

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      addToast('Failed to load deals. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      addToast('Failed to load customers.', 'error');
    }
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete.dealId) return;

    try {
      const response = await fetch(`/api/deals/${confirmDelete.dealId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete deal');
      }

      setConfirmDelete({ isOpen: false });
      fetchDeals();
      addToast('Deal deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting deal:', error);
      setConfirmDelete({ isOpen: false });
      addToast('Failed to delete deal. Please try again.', 'error');
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'prospecting': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'qualification': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'proposal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'closed-won': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'closed-lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[stage] || colors['prospecting'];
  };

  const columns = [
    {
      key: 'title',
      label: 'Deal',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500">{row.customerName || 'No customer'}</div>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: number) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {value != null ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0'}
        </span>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(value)}`}>
          {value?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value || 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{value || 0}%</span>
        </div>
      ),
    },
    {
      key: 'expectedCloseDate',
      label: 'Expected Close',
      render: (value: any) => {
        if (!value) return '-';
        const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
        return format(date, 'MMM d, yyyy');
      },
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value: string) => (
        <span className="text-sm text-gray-900 dark:text-white">{value || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: any) => {
        if (!value) return '-';
        const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
        return format(date, 'MMM d, yyyy');
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, row: Deal) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalMode('edit');
              setSelectedDeal(row);
            }}
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition"
            aria-label="Edit deal"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete({ isOpen: true, dealId: row.id });
            }}
            className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition"
            aria-label="Delete deal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your sales opportunities</p>
        </div>
        <button
          onClick={() => setModalMode('create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Deal
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-500 dark:text-gray-400">Loading deals...</span>
          </div>
        ) : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No deals yet</p>
            <button
              onClick={() => setModalMode('create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Deal
            </button>
          </div>
        ) : (
          <Table columns={columns} data={deals} />
        )}
      </Card>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Deal Modal (Create/Edit) */}
      {modalMode && (
        <DealModal
          mode={modalMode}
          deal={selectedDeal || undefined}
          customers={customers}
          isOpen={modalMode !== null}
          onClose={() => {
            setModalMode(null);
            setSelectedDeal(null);
          }}
          onSuccess={() => {
            fetchDeals();
            addToast(
              modalMode === 'create' ? 'Deal created successfully' : 'Deal updated successfully',
              'success'
            );
            setModalMode(null);
            setSelectedDeal(null);
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false })}
      />
    </div>
  );
}

