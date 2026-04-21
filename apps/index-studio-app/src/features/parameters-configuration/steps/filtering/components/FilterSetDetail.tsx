import { useNavigate, useParams } from 'react-router-dom';
import { useBacktest } from '@/contexts/BacktestContext';
import { ArrowLeft, Filter, Clock, User } from 'lucide-react';

export default function FilterSetDetail() {
  const navigate = useNavigate();
  const { filterId } = useParams();
  const { filterSets } = useBacktest();

  const filterSet = filterSets.find(f => f.id === Number(filterId));

  if (!filterSet) {
    return (
      <div className="max-w-7xl">
        <button
          onClick={() => navigate('/parameters/filtering')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <ArrowLeft size={18} />
          Back to Filtering
        </button>
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Filter set not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/parameters/filtering')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <ArrowLeft size={18} />
          Back to Filtering
        </button>
        <h1 className="text-2xl mb-1" style={{ color: '#0B236B' }}>
          {filterSet.name}
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          {filterSet.description}
        </p>
      </div>

      {/* Filter Set Info Card */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Created By</p>
            <div className="flex items-center gap-2">
              <User size={16} style={{ color: '#0094B3' }} />
              <p className="text-sm" style={{ color: '#0B236B' }}>{filterSet.createdBy}</p>
            </div>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Created At</p>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#0094B3' }} />
              <p className="text-sm" style={{ color: '#0B236B' }}>{filterSet.createdAt}</p>
            </div>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Modified By</p>
            <div className="flex items-center gap-2">
              <User size={16} style={{ color: '#0094B3' }} />
              <p className="text-sm" style={{ color: '#0B236B' }}>{filterSet.modifiedBy}</p>
            </div>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Modified At</p>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#0094B3' }} />
              <p className="text-sm" style={{ color: '#0B236B' }}>{filterSet.modifiedAt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Rules Table */}
      <div className="bg-white rounded-lg mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-lg" style={{ color: '#0B236B' }}>
            Filter Rules
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            {filterSet.filters.length} filter rule{filterSet.filters.length !== 1 ? 's' : ''} defined
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Factor
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Value
                </th>
                <th className="px-6 py-3 text-center text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filterSet.filters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-sm" style={{ color: '#6B7280' }}>
                      No filter rules defined
                    </div>
                  </td>
                </tr>
              ) : (
                filterSet.filters.map((rule, index) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: index < filterSet.filters.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Filter size={16} style={{ color: '#0094B3' }} />
                        <span className="text-sm" style={{ color: '#0B236B' }}>
                          {rule.field || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>
                      {rule.operator}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>
                      {rule.value || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: rule.enabled ? '#DCFCE7' : '#F3F4F6',
                          color: rule.enabled ? '#166534' : '#6B7280',
                        }}
                      >
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => navigate('/parameters/filtering')}
          className="px-6 py-2.5 rounded-lg transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          Back
        </button>
        <button
          onClick={() => navigate('/parameters/filtering/create')}
          className="px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
        >
          Edit Filter Set
        </button>
      </div>
    </div>
  );
}
