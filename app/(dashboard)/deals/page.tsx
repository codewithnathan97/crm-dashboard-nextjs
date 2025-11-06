'use client';

import { useEffect, useState } from 'react';
import Card from '@/app/components/Card';
import Table from '@/app/components/Table';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Deal } from '@/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
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
          ${value?.toLocaleString() || 0}
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
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
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
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your sales opportunities</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Deal
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading deals...</div>
        ) : (
          <Table columns={columns} data={deals} />
        )}
      </Card>
    </div>
  );
}

