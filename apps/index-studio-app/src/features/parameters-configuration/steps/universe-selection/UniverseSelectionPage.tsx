import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBacktest } from '@/contexts/BacktestContext';
import { CustomDropdown } from '@/components/CustomDropdown';
import { CreateUniverseModal } from '@/features/parameters-configuration/steps/universe-selection/components/CreateUniverseModal';
import { Plus, Edit2, Eye, MoreVertical, Search, Trash2 } from 'lucide-react';

export default function UniverseSelectionPage() {
  const navigate = useNavigate();
  const { universes, addUniverse, deleteUniverse } = useBacktest();
  const [showTable, setShowTable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = (itemId: number) => {
    if (openMenuId === itemId) {
      setOpenMenuId(null);
    } else {
      const button = buttonRefs.current[itemId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.right - 192,
        });
      }
      setOpenMenuId(itemId);
    }
  };

  const typeOptions = ['All Types', ...Array.from(new Set(universes.map(u => u.type)))];

  const filteredUniverses = universes.filter((universe) => {
    const matchesSearch =
      searchQuery === '' ||
      universe.universeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      universe.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (selectedType === 'All Types' || universe.type === selectedType);
  });

  const clearFilters = () => {
    setSelectedType('All Types');
    setSearchQuery('');
  };

  const handleCreateUniverse = (universeName: string, description: string, file: File | null) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    addUniverse({
      universeName,
      type: 'Custom Universe',
      description,
      uploadHistory: [
        {
          id: 1,
          fileName: file?.name || 'uploaded_file.csv',
          uploadedBy: 'Current User',
          uploadedAt: `${formattedDate} ${formattedTime}`,
          fileSize: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
          status: 'Active',
        },
      ],
      createdAt: formattedDate,
      updatedAt: formattedDate,
    });
  };

  return (
    <>
      <CreateUniverseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateUniverse}
      />

      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1" style={{ color: '#0B236B' }}>
              Universe Selection
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Manage universe files for your backtests
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
          >
            <Plus size={18} />
            Create New Universe
          </button>
        </div>

        {showTable && (
          <div className="bg-white rounded-lg mb-6" style={{ border: '1px solid #E5E7EB' }}>
            <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>Search</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
                    <input
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>Type</label>
                  <CustomDropdown
                    options={typeOptions}
                    value={selectedType}
                    onChange={setSelectedType}
                    placeholder="All Types"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm" style={{ color: '#6B7280' }}>
                  Showing {filteredUniverses.length} of {universes.length} records
                </div>
                {(selectedType !== 'All Types' || searchQuery !== '') && (
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
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Universe Name</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Type</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Description</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Latest Upload</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Last Updated</th>
                    <th className="px-6 py-3 text-right text-xs uppercase tracking-wider" style={{ color: '#6B7280' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniverses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-sm" style={{ color: '#6B7280' }}>No universes match your filters</div>
                      </td>
                    </tr>
                  ) : (
                    filteredUniverses.map((item, index) => {
                      const latestUpload = item.uploadHistory.find(u => u.status === 'Active');
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                          style={{ borderBottom: index < filteredUniverses.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                        >
                          <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.universeName}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>
                            <span
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: item.type === 'Global Universe' ? '#E0F2FE' : '#F0FDF4',
                                color: item.type === 'Global Universe' ? '#0369A1' : '#15803D',
                              }}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>{item.description}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>
                            {latestUpload ? latestUpload.fileName : 'No uploads'}
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>{item.updatedAt}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/parameters/universe/${item.id}/history`)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View upload history"
                              >
                                <Eye size={16} style={{ color: '#6B7280' }} />
                              </button>
                              <button
                                onClick={() => navigate(`/parameters/universe/${item.id}/edit`)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit universe details"
                              >
                                <Edit2 size={16} style={{ color: '#6B7280' }} />
                              </button>
                              {item.type !== 'Global Universe' && (
                                <button
                                  ref={(el) => { if (el) buttonRefs.current[item.id] = el; }}
                                  onClick={() => handleMenuToggle(item.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="More options"
                                >
                                  <MoreVertical size={16} style={{ color: '#6B7280' }} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
              Show Saved Configurations ({universes.length})
            </button>
          </div>
        )}

        {openMenuId !== null && (
          <div
            ref={menuRef}
            className="fixed w-48 rounded-lg shadow-lg border"
            style={{
              backgroundColor: 'white',
              borderColor: '#E5E7EB',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 9999,
            }}
          >
            <button
              onClick={() => {
                const universe = universes.find(u => u.id === openMenuId);
                if (universe) {
                  const confirmed = window.confirm(`Are you sure you want to delete ${universe.universeName}?`);
                  if (confirmed) deleteUniverse(openMenuId);
                }
                setOpenMenuId(null);
              }}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 rounded-lg"
              style={{ color: '#EF4444' }}
            >
              <Trash2 size={16} />
              Delete Universe
            </button>
          </div>
        )}
      </div>
    </>
  );
}
