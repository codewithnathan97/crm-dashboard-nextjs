'use client';

import Card from '@/app/components/Card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed insights and reports</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500 dark:text-gray-400">Advanced analytics and reporting features coming soon</p>
        </div>
      </Card>
    </div>
  );
}

