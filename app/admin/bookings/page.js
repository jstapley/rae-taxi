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
      <div className="bg-[#1B3A5C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin" className="text-blue-300 hover:text-white text-sm">
            ← Dashboard
          </a>
          <h1 className="text-xl font-bold">Bookings</h1>
        </div>
        <span className="text-blue-300 text-sm">{bookings.length} total</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
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
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 text-gray-400">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-gray-400">No bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Vehicle</th>
                      <th className="px-4 py-3 text-left">Dates</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelected(b)}
                        className={`cursor-pointer hover:bg-gray-50 ${selected?.id === b.id ? 'bg-amber-50' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium">{b.customer_name}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {b.pickup_date}<br />{b.dropoff_date}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {b.total_amount ? `$${b.total_amount}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-[#1B3A5C] mb-4">Booking Detail</h3>
                <div className="space-y-2 text-sm mb-4">
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
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-gray-400">{label}</span>
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
                        className={`py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
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
                Click a booking row to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
