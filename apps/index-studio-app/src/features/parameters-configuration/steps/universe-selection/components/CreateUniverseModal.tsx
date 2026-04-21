import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface CreateUniverseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (universeName: string, description: string, file: File | null) => void;
}

export function CreateUniverseModal({ isOpen, onClose, onSave }: CreateUniverseModalProps) {
  const [universeName, setUniverseName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!universeName) {
      alert('Please enter a universe name');
      return;
    }
    if (!description) {
      alert('Please enter a description');
      return;
    }
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    onSave(universeName, description, selectedFile);
    setUniverseName('');
    setDescription('');
    setSelectedFile(null);
    onClose();
  };

  const handleCancel = () => {
    setUniverseName('');
    setDescription('');
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleCancel}
      />

      <div
        className="relative rounded-lg shadow-xl max-w-2xl w-full mx-4"
        style={{ border: '1px solid #E5E7EB', backgroundColor: 'white', zIndex: 10000 }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-xl" style={{ color: '#0B236B' }}>
            Create New Universe
          </h2>
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} style={{ color: '#6B7280' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Universe Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={universeName}
              onChange={(e) => setUniverseName(e.target.value)}
              placeholder="Enter universe name"
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

          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Upload File <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#E5E7EB' }}>
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload size={32} style={{ color: '#0094B3' }} className="mb-2" />
                  <p className="text-sm mb-1" style={{ color: '#0B236B' }}>
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    CSV, XLSX, XLS (max 10MB)
                  </p>
                </div>
              </label>
            </div>
            {selectedFile && (
              <div
                className="mt-2 flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: '#F9FAFB' }}
              >
                <span className="text-sm" style={{ color: '#0B236B' }}>
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs px-2 py-1 rounded hover:bg-gray-200"
                  style={{ color: '#EF4444' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={handleCancel}
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
            Create Universe
          </button>
        </div>
      </div>
    </div>
  );
}
