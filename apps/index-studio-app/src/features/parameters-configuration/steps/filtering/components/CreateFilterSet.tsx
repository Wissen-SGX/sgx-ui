import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBacktest, FilterRule } from '@/contexts/BacktestContext';
import { CustomDropdown } from '@/components/CustomDropdown';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function CreateFilterSet() {
  const navigate = useNavigate();
  const { addFilterSet } = useBacktest();
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [filterSetName, setFilterSetName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now(),
      field: '',
      operator: 'range',
      value: '',
      enabled: true,
    };
    setFilters([...filters, newFilter]);
  };

  const handleUpdateFilter = (index: number, field: string, value: string) => {
    setFilters(filters.map((f, i) => i === index ? { ...f, [field]: value } : f));
  };

  const handleDeleteFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!filterSetName.trim()) {
      alert('Please enter a Filter Set Name');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timestamp = `${formattedDate} ${formattedTime}`;

    addFilterSet({
      name: filterSetName,
      description,
      filters,
      createdBy: 'Current User',
      createdAt: timestamp,
      modifiedBy: 'Current User',
      modifiedAt: timestamp,
    });

    navigate('/parameters/filtering');
  };

  return (
    <div className="max-w-7xl">
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
          Create New Filter Set
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Define filtering criteria to narrow down the universe
        </p>
      </div>

      {/* Filter Set Details */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <h2 className="text-lg mb-4" style={{ color: '#0B236B' }}>
          Filter Set Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Filter Set Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={filterSetName}
              onChange={(e) => setFilterSetName(e.target.value)}
              placeholder="Enter filter set name"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Description <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Rules */}
      <div className="bg-white rounded-lg mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg" style={{ color: '#0B236B' }}>Filter Rules</h2>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                Add conditions to filter stocks from the universe
              </p>
            </div>
            <button
              onClick={handleAddFilter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
            >
              <Plus size={16} />
              Add Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Factor</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Condition</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Value</th>
                <th className="px-6 py-3 text-center text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-sm mb-2" style={{ color: '#6B7280' }}>No filters defined yet</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      Click "Add Filter" to create your first filter rule
                    </div>
                  </td>
                </tr>
              ) : (
                filters.map((rule, index) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: index < filters.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                  >
                    <td className="px-6 py-4">
                      <CustomDropdown
                        options={[
                          'Symbol',
                          'Name',
                          'Date',
                          'Ticker',
                          'SEDOL',
                          'Parent Identifier',
                          'ISIN',
                          'Cntry Terrtry Of Dom',
                          'Listing',
                          'Country of Incorporation',
                          'Market Cap (SO Price)',
                          'RBICS L1 Sector',
                          'RBICS L2 Sector',
                          'RBICS L3 Sector',
                          'RBICS L4 Sector',
                          'RBICS L5 Sector',
                          'RBICS L6 Sector',
                          'Dvd P/O.Y',
                          'Dvd 12M Yid- Net',
                          'Total Return:Y-1',
                          'RIC',
                          'Market Capitalisation (Median) (M USD) 6M',
                          'Turnover (Median) (USD) 6M',
                          'Free-Float (%)',
                        ]}
                        value={rule.field}
                        onChange={(value) => handleUpdateFilter(index, 'field', value)}
                        placeholder="Select factor..."
                      />
                    </td>
                    <td className="px-6 py-4">
                      <CustomDropdown
                        options={['range', '>', '>=', '<', '<=', '=', '!=', 'In', 'Not In']}
                        value={rule.operator}
                        onChange={(value) => handleUpdateFilter(index, 'operator', value)}
                        placeholder="Select condition"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                        placeholder="Enter value..."
                        className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteFilter(index)}
                        className="inline-flex items-center justify-center p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} style={{ color: '#EF4444' }} />
                      </button>
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
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
