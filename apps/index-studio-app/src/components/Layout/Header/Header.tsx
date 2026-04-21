import React from 'react';
import { Bell, Settings, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@sgx/ui';

// Props Type
interface HeaderComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header = ({ searchTerm, setSearchTerm }: HeaderComponentProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shadow-md">
      {/* Search Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative flex-1 max-w-md">
          {/* Search Icon */}
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

          {/* Input */}
          <input
            type="text"
            placeholder="Search Indices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent"
          />

          {/* Clear Button */}
          {searchTerm && (
            <Button
              variant="neutral"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0! text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification */}
        <Button variant="ghost" size="sm" radius="md" className="p-2!" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" radius="md" className="p-2!" aria-label="Settings" onClick={() => navigate('/ui-components')}>
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#1a3a5c] text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-[#0f2844] transition-colors">
          U
        </div>
      </div>
    </header>
  );
};
