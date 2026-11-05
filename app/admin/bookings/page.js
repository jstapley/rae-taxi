'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('rae-admin-auth') !== '1') {
      router.push('/admin');
      return;
    }
    setAuthed(true);
    setChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authed) return;
    loadBookings();
  }, [authed, statusFilter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const url =
        statusFilter === 'all'
          ? '/api/admin/bookings-list'
          : `/api/admin/bookings-list?status=${statusFilter}`;
      const res = await fetch(url);
      const data = res.ok ? await res.json() : [];
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
        await loadBookings();
      }
    } catch {
      // handle error
    } finally {
      setUpdating(false);
    }
  }

  if (!checked) return null;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#1B3A5C] text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selected ? (
            <button
              onClick={() => setSelected(null)}
              className="lg:hidden text-blue-300 hover:text-white text-sm"
            >
              ← Back
            </button>
          ) : (
            <a href="/admin" className="text-blue-300 hover:text-white text-sm">← Dashboard</a>
          )}
          <h1 className="text-lg font-bold">
            {selected ? selected.customer_name : 'Bookings'}
          </h1>
        </div>
        <span className="text-blue-300 text-sm">{bookings.length} total</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Status filter — hidden when detail is open on mobile */}
        <div className={`flex gap-2 mb-5 overflow-x-auto pb-1 ${selected ? 'hidden lg:flex' : 'flex'}`}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-[#1B3A5C] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card list — hidden on mobile when detail is open */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${selected ? 'hidden lg:block' : 'block'}`}>
            {loading ? (
              <div className="p-6 text-gray-400">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-gray-400">No bookings found.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${selected?.id === b.id ? 'bg-amber-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-semibold text-[#1B3A5C]">{b.customer_name}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${statusColors[b.status] || 'bg-gray-100'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      {b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model}` : '—'}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{b.pickup_date} → {b.dropoff_date}</span>
                      {b.total_amount && (
                        <span className="font-semibold text-[#1B3A5C]">${b.total_amount}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel — full-screen on mobile when open */}
          <div className={selected ? 'block' : 'hidden lg:block'}>
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-[#1B3A5C] mb-4">Booking Detail</h3>
                <div className="space-y-3 text-sm mb-4">
                  {[
                    ['Customer', selected.customer_name],
                    ['Phone', selected.customer_phone],
                    ['Email', selected.customer_email || '—'],
                    ['License', selected.license_number || '—'],
                    ['Vehicle', selected.vehicles ? `${selected.vehicles.year} ${selected.vehicles.make} ${selected.vehicles.model}` : '—'],
                    ['Pickup', selected.pickup_date],
                    ['Drop-off', selected.dropoff_date],
                    ['Total', selected.total_amount ? `$${selected.total_amount} USD` : '—'],
                    ['Notes', selected.notes || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400 shrink-0">{label}</span>
                      <span className="font-medium text-right">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Update Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={updating || selected.status === s}
                        className={`py-3 rounded-xl text-sm font-semibold capitalize transition-colors ${
                          selected.status === s
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-[#1B3A5C] text-white hover:bg-blue-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center text-gray-400 text-sm">
                Tap a booking to view details.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
