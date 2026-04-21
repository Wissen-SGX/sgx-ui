import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBacktest } from '@/contexts/BacktestContext';
import { ArrowLeft, Upload } from 'lucide-react';

export default function UniverseEditDetails() {
  const navigate = useNavigate();
  const { universeId } = useParams();
  const { universes, updateUniverse } = useBacktest();
  const [universeName, setUniverseName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const universe = universes.find(u => u.id === Number(universeId));

  useEffect(() => {
    if (universe) {
      setUniverseName(universe.universeName);
      setDescription(universe.description);
    }
  }, [universe]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!universeName.trim()) {
      alert('Please enter a universe name');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!universe) {
      alert('Universe not found');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let updatedHistory = universe.uploadHistory;

    if (selectedFile) {
      updatedHistory = universe.uploadHistory.map(upload => ({
        ...upload,
        status: 'Archived' as const,
      }));

      const newUpload = {
        id: Math.max(...universe.uploadHistory.map(u => u.id), 0) + 1,
        fileName: selectedFile.name,
        uploadedBy: 'Current User',
        uploadedAt: `${formattedDate} ${formattedTime}`,
        fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'Active' as const,
      };

      updatedHistory = [...updatedHistory, newUpload];
    }

    updateUniverse(Number(universeId), {
      universeName,
      description,
      uploadHistory: updatedHistory,
      updatedAt: formattedDate,
    });

    navigate('/parameters/universe');
  };

  if (!universe) {
    return (
      <div className="max-w-7xl">
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Universe not found
          </p>
        </div>
      </div>
    );
  }

  const isGlobalUniverse = universe.type === 'Global Universe';

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/parameters/universe')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
          style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <ArrowLeft size={18} />
          Back to Universe Selection
        </button>
        <h1 className="text-2xl mb-1" style={{ color: '#0B236B' }}>
          Edit Universe
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Update universe details and upload new files
        </p>
      </div>

      {/* Universe Info */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Type</p>
            <span
              className="inline-block px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: universe.type === 'Global Universe' ? '#E0F2FE' : '#F0FDF4',
                color: universe.type === 'Global Universe' ? '#0369A1' : '#15803D',
              }}
            >
              {universe.type}
            </span>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Current Active File</p>
            <p className="text-sm" style={{ color: '#0B236B' }}>
              {universe.uploadHistory.find(u => u.status === 'Active')?.fileName || 'No active file'}
            </p>
          </div>
        </div>

        {isGlobalUniverse && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE047' }}>
            <p className="text-sm" style={{ color: '#92400E' }}>
              <strong>Note:</strong> The name of the Global Universe cannot be changed. You can only update the description and upload files.
            </p>
          </div>
        )}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <h2 className="text-lg mb-4" style={{ color: '#0B236B' }}>
          Universe Details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Universe Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={universeName}
              onChange={(e) => setUniverseName(e.target.value)}
              disabled={isGlobalUniverse}
              placeholder="Enter universe name"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{
                borderColor: '#E5E7EB',
                color: '#0B236B',
              }}
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
              style={{
                borderColor: '#E5E7EB',
                color: '#0B236B',
              }}
            />
          </div>
        </div>
      </div>

      {/* Upload New File Section */}
      <div className="bg-white rounded-lg p-6 mb-6" style={{ border: '1px solid #E5E7EB' }}>
        <h2 className="text-lg mb-4" style={{ color: '#0B236B' }}>
          Upload New File (Optional)
        </h2>

        <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4" style={{ borderColor: '#E5E7EB' }}>
          <input
            type="file"
            id="file-upload"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload size={48} style={{ color: '#0094B3' }} className="mb-4" />
              <p className="text-base mb-2" style={{ color: '#0B236B' }}>
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                CSV, XLSX, XLS (max 10MB)
              </p>
            </div>
          </label>
        </div>

        {selectedFile && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#0B236B' }}>
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 rounded-lg text-sm transition-all hover:bg-gray-200"
                style={{ color: '#EF4444', border: '1px solid #EF4444' }}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE047' }}>
            <p className="text-sm" style={{ color: '#92400E' }}>
              <strong>Note:</strong> Uploading a new file will archive the current active file and make this new file active.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => navigate('/parameters/universe')}
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
