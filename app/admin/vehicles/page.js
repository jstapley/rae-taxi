'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('rae-admin-auth') !== '1') {
      router.push('/admin');
      return;
    }
    setAuthed(true);
    setChecked(true);
    loadVehicles();
  }, [router]);

  async function loadVehicles() {
    try {
      const res = await fetch('/api/vehicles');
      const data = res.ok ? await res.json() : [];
      setVehicles(data);
    } catch {
      setVehicles([]);
    }
  }

  async function loadBlockedDates(vehicleId) {
    try {
      const res = await fetch(`/api/admin/blocked-dates?vehicle_id=${vehicleId}`);
      const data = res.ok ? await res.json() : [];
      setBlockedDates(data);
    } catch {
      setBlockedDates([]);
    }
  }

  function selectVehicle(v) {
    setSelected(v);
    loadBlockedDates(v.id);
    setMessage('');
    setStartDate('');
    setEndDate('');
    setNewReason('');
  }

  function expandDateRange(start, end) {
    const dates = [];
    const current = new Date(start + 'T00:00:00');
    const last = new Date((end || start) + 'T00:00:00');
    while (current <= last) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  async function addBlockedDate() {
    if (!startDate || !selected) return;
    setLoading(true);
    try {
      const dates = expandDateRange(startDate, endDate || startDate);
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id: selected.id, dates, reason: newReason }),
      });
      if (res.ok) {
        setMessage(`Blocked ${dates.length} date${dates.length > 1 ? 's' : ''} successfully.`);
        setStartDate('');
        setEndDate('');
        setNewReason('');
        await loadBlockedDates(selected.id);
      } else {
        const err = await res.json();
        setMessage(err.error || 'Error blocking dates.');
      }
    } catch {
      setMessage('Error blocking dates.');
    } finally {
      setLoading(false);
    }
  }

  async function removeBlockedDate(id) {
    try {
      const res = await fetch(`/api/admin/blocked-dates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadBlockedDates(selected.id);
      }
    } catch {
      // handle error
    }
  }

  if (!checked) return null;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#1B3A5C] text-white px-6 py-4 flex items-center gap-4">
        <a href="/admin" className="text-blue-300 hover:text-white text-sm">
          ← Dashboard
        </a>
        <h1 className="text-xl font-bold">Manage Vehicles</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle List */}
          <div className="space-y-3">
            <h2 className="font-bold text-[#1B3A5C] mb-3">Fleet</h2>
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVehicle(v)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-colors hover:border-[#F59E0B] ${
                  selected?.id === v.id ? 'border-[#F59E0B] shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="font-semibold text-[#1B3A5C]">
                  {v.year} {v.make} {v.model}
                </div>
                <div className="text-xs text-gray-400">{v.seats} seats &bull; ${v.daily_rate}/day</div>
              </button>
            ))}
          </div>

          {/* Blocked Dates Management */}
          {selected && (
            <div className="lg:col-span-2">
              <h2 className="font-bold text-[#1B3A5C] mb-3">
                Blocked Dates — {selected.year} {selected.make} {selected.model}
              </h2>

              {/* Add new blocked date */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
                <h3 className="font-semibold text-[#1B3A5C] mb-3">Block Date / Date Range</h3>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">End Date <span className="text-gray-400">(leave blank for single day)</span></label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Reason (optional)</label>
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Maintenance, reserved..."
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addBlockedDate}
                      disabled={!startDate || loading}
                      className="bg-[#1B3A5C] hover:bg-blue-900 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      {loading ? 'Saving...' : 'Block Dates'}
                    </button>
                  </div>
                </div>
                {message && (
                  <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Blocked dates list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#1B3A5C]">
                    Blocked Dates ({blockedDates.length})
                  </h3>
                </div>
                {blockedDates.length === 0 ? (
                  <div className="p-5 text-gray-400 text-sm">No blocked dates for this vehicle.</div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {blockedDates.map((d) => (
                      <li key={d.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(d.date + 'T00:00:00'), 'EEE, MMM d, yyyy')}
                          </div>
                          {d.reason && (
                            <div className="text-xs text-gray-400">{d.reason}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeBlockedDate(d.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {!selected && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              Select a vehicle from the list to manage its blocked dates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
