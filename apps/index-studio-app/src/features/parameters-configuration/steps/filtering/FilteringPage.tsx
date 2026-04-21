import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, MoreVertical, Search, Copy } from 'lucide-react';
import { useBacktest } from '@/contexts/BacktestContext';

export default function FilteringPage() {
  const navigate = useNavigate();
  const { filterSets, deleteFilterSet, addFilterSet } = useBacktest();
  const [showTable, setShowTable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFilterSets = filterSets.filter((filterSet) => {
    return (
      searchQuery === '' ||
      filterSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filterSet.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const clearFilters = () => setSearchQuery('');

  const handleClone = (filterSet: typeof filterSets[0]) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timestamp = `${formattedDate} ${formattedTime}`;

    addFilterSet({
      name: `${filterSet.name} (Copy)`,
      description: filterSet.description,
      filters: filterSet.filters.map(f => ({ ...f, id: Date.now() + Math.random() })),
      createdBy: 'Current User',
      createdAt: timestamp,
      modifiedBy: 'Current User',
      modifiedAt: timestamp,
    });
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1" style={{ color: '#0B236B' }}>
            Filtering
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Define filtering criteria to narrow down the universe
          </p>
        </div>
        <button
          onClick={() => navigate('/parameters/filtering/create')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
        >
          <Plus size={18} />
          Create New Filter Set
        </button>
      </div>

      {showTable && (
        <div className="bg-white rounded-lg mb-6" style={{ border: '1px solid #E5E7EB' }}>
          <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="max-w-md mb-4">
              <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>Filter Set Name</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: '#6B7280' }}>
                Showing {filteredFilterSets.length} of {filterSets.length} records
              </div>
              {searchQuery !== '' && (
                <button
                  onClick={clearFilters}
                  className="text-sm px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                  style={{ color: '#0094B3', border: '1px solid #0094B3' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Filter Set Name</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Description</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Filter Count</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Added By</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Added Time</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Modified By</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Modified Time</th>
                  <th className="px-6 py-3 text-right text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFilterSets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-sm" style={{ color: '#6B7280' }}>No filter sets match your filters</div>
                    </td>
                  </tr>
                ) : (
                  filteredFilterSets.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: index < filteredFilterSets.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                    >
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.name}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.description}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.filters.length} filters</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.createdBy}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.createdAt}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.modifiedBy}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.modifiedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/parameters/filtering/${item.id}/view`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} style={{ color: '#6B7280' }} />
                          </button>
                          <button
                            onClick={() => navigate('/parameters/filtering/create')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} style={{ color: '#6B7280' }} />
                          </button>
                          <button
                            onClick={() => handleClone(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Clone"
                          >
                            <Copy size={16} style={{ color: '#6B7280' }} />
                          </button>
                          <button
                            onClick={() => {
                              const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
                              if (confirmed) deleteFilterSet(item.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <MoreVertical size={16} style={{ color: '#6B7280' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showTable && (
        <div className="mb-6">
          <button
            onClick={() => setShowTable(true)}
            className="px-4 py-2 rounded-lg text-sm transition-all hover:bg-gray-50"
            style={{ border: '1px solid #E5E7EB', color: '#0094B3' }}
          >
            Show Saved Filter Sets ({filterSets.length})
          </button>
        </div>
      )}
    </div>
  );
}
