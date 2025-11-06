'use client';

import { useEffect, useState } from 'react';
import Card from '@/app/components/Card';
import Table from '@/app/components/Table';
import { Plus, Phone, Mail, Calendar, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Activity } from '@/types';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      note: MessageSquare,
      task: FileText,
    };
    return icons[type] || MessageSquare;
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => {
        const Icon = getActivityIcon(value);
        return (
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-2 text-gray-500" />
            <span className="capitalize">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'title',
      label: 'Activity',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          {row.description && (
            <div className="text-sm text-gray-500 truncate max-w-md">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value: any) => {
        if (!value) return '-';
        const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
        return format(date, 'MMM d, yyyy');
      },
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
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track all your customer interactions</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Activity
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading activities...</div>
        ) : (
          <Table columns={columns} data={activities} />
        )}
      </Card>
    </div>
  );
}

