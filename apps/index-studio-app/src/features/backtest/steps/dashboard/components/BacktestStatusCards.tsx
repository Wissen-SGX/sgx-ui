import { Edit, FileText, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BacktestStatusCounts } from '@/features/backtest/types';

interface BacktestStatusCardsProps {
  counts: BacktestStatusCounts;
}

export default function BacktestStatusCards({ counts }: BacktestStatusCardsProps) {
  const cards = [
    { label: 'Total', value: counts.total, icon: <Edit size={16} className="text-gray-400" />, bg: 'white' },
    { label: 'Draft', value: counts.draft, icon: <FileText size={16} className="text-gray-400" />, bg: 'white' },
    { label: 'Running', value: counts.running, icon: <RefreshCw size={16} style={{ color: '#F59E0B' }} />, bg: '#FFFBEB' },
    { label: 'Completed', value: counts.completed, icon: <CheckCircle size={16} style={{ color: '#16A34A' }} />, bg: '#F0FDF4' },
    { label: 'Queued', value: counts.queued, icon: <Clock size={16} style={{ color: '#0094B3' }} />, bg: '#EFF6FF' },
    { label: 'Failed', value: counts.failed, icon: <XCircle size={16} style={{ color: '#DC2626' }} />, bg: '#FEF2F2' },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border rounded-lg p-4"
          style={{ borderColor: '#E5E7EB', backgroundColor: card.bg }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs text-gray-600 uppercase">{card.label}</div>
            {card.icon}
          </div>
          <div className="text-2xl" style={{ color: '#0B236B' }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
