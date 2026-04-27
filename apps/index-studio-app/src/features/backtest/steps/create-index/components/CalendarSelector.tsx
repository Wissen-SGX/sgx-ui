interface CalendarSelectorProps {
  calendarOptions: string[];
  selectedCalendars: string[];
  onToggle: (calendar: string) => void;
}

export function CalendarSelector({ calendarOptions, selectedCalendars, onToggle }: CalendarSelectorProps) {
  return (
    <div>
      <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
        Calendar
      </label>
      <div className="space-y-2">
        {calendarOptions.map((calendar) => (
          <label
            key={calendar}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#E5E7EB' }}
          >
            <input
              type="checkbox"
              checked={selectedCalendars.includes(calendar)}
              onChange={() => onToggle(calendar)}
              className="w-4 h-4"
              style={{ accentColor: '#0094B3' }}
            />
            <span className="text-sm" style={{ color: '#0B236B' }}>{calendar}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
