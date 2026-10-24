'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminTaxiPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('rae-admin-auth') !== '1') {
      router.push('/admin');
      return;
    }
    setAuthed(true);
    setChecked(true);
    loadRequests();
  }, [router]);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/taxi-list');
      const data = res.ok ? await res.json() : [];
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    setUpdating(true);
    try {
      const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      // Direct PATCH to taxi_requests via our API
      const res = await fetch(`/api/admin/taxi-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
        await loadRequests();
      }
    } catch {
      // handle silently
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
          <h1 className="text-xl font-bold">Taxi Requests</h1>
        </div>
        <span className="text-blue-300 text-sm">{requests.length} total</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 text-gray-400">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-gray-400">No taxi requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Route</th>
                      <th className="px-4 py-3 text-left">Date/Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requests.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={`cursor-pointer hover:bg-gray-50 ${selected?.id === r.id ? 'bg-amber-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{r.customer_name}</div>
                          <div className="text-xs text-gray-400">{r.customer_phone}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          <div>{r.pickup_location}</div>
                          <div className="text-gray-400">→ {r.dropoff_location}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {r.pickup_datetime
                            ? new Date(r.pickup_datetime).toLocaleString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[r.status] || 'bg-gray-100'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {r.price_quoted ? `$${r.price_quoted}` : '—'}
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
                <h3 className="font-bold text-[#1B3A5C] mb-4">Request Detail</h3>
                <div className="space-y-2 text-sm mb-4">
                  {[
                    ['Customer', selected.customer_name],
                    ['Phone', selected.customer_phone],
                    ['Pickup', selected.pickup_location],
                    ['Drop-off', selected.dropoff_location],
                    ['Date/Time', selected.pickup_datetime ? new Date(selected.pickup_datetime).toLocaleString() : '—'],
                    ['Passengers', selected.passengers],
                    ['Quoted', selected.price_quoted ? `$${selected.price_quoted}` : '—'],
                    ['Notes', selected.notes || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-medium text-right text-sm break-words max-w-32">{val}</span>
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

                  {/* WhatsApp quick contact */}
                  <a
                    href={`https://wa.me/${selected.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                  >
                    WhatsApp Customer
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center text-gray-400 text-sm">
                Click a request row to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
