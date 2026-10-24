'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format } from 'date-fns';

export default function AvailabilityCalendar({ blockedDates = [], onRangeSelect }) {
  const [range, setRange] = useState(undefined);

  // Convert string dates to local-time Date objects (appending T00:00:00 prevents UTC timezone shift)
  const disabledDays = blockedDates.map((d) => new Date(d + 'T00:00:00'));

  // Also disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSelect(selectedRange) {
    setRange(selectedRange);
    if (onRangeSelect) {
      onRangeSelect(selectedRange);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <h3 className="text-[#1B3A5C] font-semibold mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select Your Dates
      </h3>

      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={handleSelect}
        disabled={[{ before: today }, ...disabledDays]}
        modifiersClassNames={{
          selected: 'rdp-selected',
          range_start: 'rdp-range_start',
          range_end: 'rdp-range_end',
          range_middle: 'rdp-range_middle',
        }}
        styles={{
          root: { '--rdp-accent-color': '#F59E0B', '--rdp-accent-background-color': '#FEF3C7' },
        }}
      />

      {/* Selected range display */}
      {range?.from && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <div className="flex gap-6">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wide">Pickup</span>
              <div className="font-semibold text-[#1B3A5C]">
                {format(range.from, 'EEE, MMM d, yyyy')}
              </div>
            </div>
            {range.to && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Drop-off</span>
                <div className="font-semibold text-[#1B3A5C]">
                  {format(range.to, 'EEE, MMM d, yyyy')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#F59E0B] rounded-full inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded-full inline-block" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
