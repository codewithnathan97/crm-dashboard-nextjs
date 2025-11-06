'use client';

import { useEffect, useState } from 'react';
import Card from '@/app/components/Card';
import { DollarSign } from 'lucide-react';
import { Deal } from '@/types';

export default function PipelinePage() {
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

  const stages = [
    { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100 border-gray-300' },
    { id: 'qualification', name: 'Qualification', color: 'bg-blue-50 border-blue-300' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-50 border-purple-300' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-50 border-orange-300' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-50 border-green-300' },
  ];

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize your deals across different stages</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stages.map(stage => {
            const stageDeals = getDealsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div key={stage.id} className="flex flex-col">
                <div className={`${stage.color} border-2 rounded-lg p-4 mb-2`}>
                  <h3 className="font-semibold text-gray-900 mb-1">{stage.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${stageTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stageDeals.length} {stageDeals.length === 1 ? 'deal' : 'deals'}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {deal.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {deal.customerName || 'No customer'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${deal.value?.toLocaleString() || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          {deal.probability || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

