import { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RotateCw } from 'lucide-react';
import { Button } from '@sgx/ui';
import { useBacktest } from '@/contexts/BacktestContext';
const BacktestStatusCards = lazy(() => import('@/features/backtest/steps/dashboard/components/BacktestStatusCards'));
const BacktestFilters = lazy(() => import('@/features/backtest/steps/dashboard/components/BacktestFilters'));
const BacktestTable = lazy(() => import('@/features/backtest/steps/dashboard/components/BacktestTable'));
import { BacktestStatusCounts } from '@/features/backtest/types';

export default function BacktestDashboardPage() {
  const navigate = useNavigate();
  const { backtestEntries } = useBacktest();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const counts: BacktestStatusCounts = {
    total: backtestEntries.length,
    draft: backtestEntries.filter((e) => e.status === 'Draft').length,
    running: backtestEntries.filter((e) => e.status === 'Running').length,
    completed: backtestEntries.filter((e) => e.status === 'Completed').length,
    launched: backtestEntries.filter((e) => e.status === 'Launched to Production').length,
    failed: backtestEntries.filter((e) => e.status === 'Failed').length,
  };

  const filtered = backtestEntries.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || entry.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || entry.typeLabel === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRun = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Running backtest:', id);
  };

  const handleStop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Stopping backtest:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all your backtesting workflows</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={"white"}
            className="px-5 py-2.5 rounded-lg border flex items-center gap-2 text-sm transition-colors"
            onClick={() => window.location.reload()}
          >
            <RotateCw size={18} />
            Refresh Data
          </Button>
          <Button
            variant={"lightblue"}
            onClick={() => navigate('/backtest/create-index')}
            className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Create New Index
          </Button>
        </div>
      </div>

      <BacktestStatusCards counts={counts} />

      <BacktestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        onRefresh={() => window.location.reload()}
      />

      <BacktestTable entries={filtered} onRun={handleRun} onStop={handleStop} />
    </div>
  );
}
