import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showCustomRange?: boolean;
  customRangeFrom?: string;
  customRangeTo?: string;
  onCustomRangeChange?: (from: string, to: string) => void;
}

function getWeekdayOccurrence(date: Date): string {
  const dayOfMonth = date.getDate();
  const weekInMonth = Math.ceil(dayOfMonth / 7);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const ordinal = ['1st', '2nd', '3rd', '4th', '5th'][weekInMonth - 1] || `${weekInMonth}th`;
  return `${ordinal} ${dayName} of the Month`;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  className = '',
  disabled = false,
  showCustomRange = false,
  customRangeFrom = '',
  customRangeTo = '',
  onCustomRangeChange,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240;
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    if (disabled) return;
    onChange(option);
    if (option !== 'Custom Range') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2.5 border rounded-lg text-sm text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: '#E5E7EB',
          backgroundColor: disabled ? '#F9FAFB' : 'white',
          color: value ? '#0B236B' : '#9CA3AF',
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={16}
          style={{
            color: '#0B236B',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {isOpen && (
        <div
          className="fixed border rounded-lg shadow-lg"
          style={{
            backgroundColor: 'white',
            borderColor: '#E5E7EB',
            maxHeight: '240px',
            overflowY: 'auto',
            zIndex: 9999,
            left: dropdownRef.current?.getBoundingClientRect().left + 'px',
            top:
              dropdownPosition === 'below'
                ? (dropdownRef.current?.getBoundingClientRect().bottom ?? 0) + 4 + 'px'
                : 'auto',
            bottom:
              dropdownPosition === 'above'
                ? window.innerHeight - (dropdownRef.current?.getBoundingClientRect().top ?? 0) + 4 + 'px'
                : 'auto',
            width: dropdownRef.current?.getBoundingClientRect().width + 'px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F3F4F6',
          }}
        >
          {options.map((option, index) => (
            <div key={index}>
              <div
                onClick={() => handleSelect(option)}
                className="px-4 py-2 cursor-pointer text-sm transition-colors"
                style={{
                  color: '#0B236B',
                  backgroundColor: value === option ? '#E0F2FE' : 'white',
                  borderLeft: value === option ? '3px solid #0094B3' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (value !== option) e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  if (value !== option) e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {option.replace(/\s*\(vs benchmark\)/i, '').replace(/\s*\(Annualized\)/i, '')}
              </div>

              {option === 'Custom Range' && value === 'Custom Range' && showCustomRange && (
                <div
                  className="px-4 py-4 border-t space-y-3"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#0B236B' }}>Date *</label>
                    <input
                      type="date"
                      value={customRangeFrom}
                      onChange={(e) => onCustomRangeChange?.(e.target.value, customRangeTo)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#0B236B' }}>Trade Day</label>
                    <div
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50"
                      style={{ borderColor: '#E5E7EB', color: '#0B236B' }}
                    >
                      {customRangeFrom ? getWeekdayOccurrence(new Date(customRangeFrom)) : 'Select a date first'}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 rounded-lg text-white text-sm"
                    style={{ backgroundColor: '#0094B3' }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
