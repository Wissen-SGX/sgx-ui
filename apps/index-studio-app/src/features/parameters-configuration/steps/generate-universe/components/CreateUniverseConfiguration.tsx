import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBacktest } from '@/contexts/BacktestContext';
import { ArrowLeft, Play } from 'lucide-react';

export default function CreateUniverseConfiguration() {
  const navigate = useNavigate();
  const {
    universes,
    filterSets,
    universeConfigurations,
    addUniverseConfiguration,
    runUniverseConfiguration,
  } = useBacktest();

  const [configName, setConfigName] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState('');
  const [selectedFilterSet, setSelectedFilterSet] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [frequency, setFrequency] = useState('Monthly');

  const handleSaveAndRun = () => {
    if (!configName || !selectedUniverse || !selectedFilterSet || !reviewDate) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timestamp = `${formattedDate} ${formattedTime}`;

    addUniverseConfiguration({
      name: configName,
      universeId: Number(selectedUniverse),
      filterSetId: Number(selectedFilterSet),
      reviewDate,
      frequency,
      status: 'Draft',
      createdBy: 'Current User',
      createdAt: timestamp,
      generatedFiles: [],
    });

    const newId = universeConfigurations.length > 0
      ? Math.max(...universeConfigurations.map(c => c.id)) + 1
      : 1;

    setTimeout(() => {
      runUniverseConfiguration(newId);
    }, 100);

    navigate('/parameters/configure-universe');
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/parameters/configure-universe')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <ArrowLeft size={18} />
          Back to Generate Universe
        </button>
        <h1 className="text-2xl mb-1" style={{ color: '#0B236B' }}>
          Generate New Universe
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Configure universe with filters and generate output files
        </p>
      </div>

      <div className="bg-white rounded-lg p-6" style={{ border: '1px solid #E5E7EB' }}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Generation Name *
            </label>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="Enter generation name"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #E5E7EB', color: '#0B236B' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Universe *
            </label>
            <select
              value={selectedUniverse}
              onChange={(e) => setSelectedUniverse(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #E5E7EB', color: '#0B236B' }}
            >
              <option value="">Select Universe</option>
              {universes.map((universe) => (
                <option key={universe.id} value={universe.id}>
                  {universe.universeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Filter Set *
            </label>
            <select
              value={selectedFilterSet}
              onChange={(e) => setSelectedFilterSet(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #E5E7EB', color: '#0B236B' }}
            >
              <option value="">Select Filter Set</option>
              {filterSets.map((filterSet) => (
                <option key={filterSet.id} value={filterSet.id}>
                  {filterSet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Review Date *
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #E5E7EB', color: '#0B236B' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>
              Frequency *
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #E5E7EB', color: '#0B236B' }}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => navigate('/parameters/configure-universe')}
            className="px-6 py-2.5 rounded-lg transition-all hover:bg-gray-50"
            style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndRun}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
          >
            <Play size={16} />
            Save & Run
          </button>
        </div>
      </div>
    </div>
  );
}
