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
      const res = await fetch('/api/admin/taxi-update', {
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
            {selected ? selected.customer_name : 'Taxi Requests'}
          </h1>
        </div>
        <span className="text-blue-300 text-sm">{requests.length} total</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card list — hidden on mobile when detail is open */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${selected ? 'hidden lg:block' : 'block'}`}>
            {loading ? (
              <div className="p-6 text-gray-400">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-gray-400">No taxi requests yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${selected?.id === r.id ? 'bg-amber-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-[#1B3A5C]">{r.customer_name}</div>
                        <div className="text-xs text-gray-400">{r.customer_phone}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${statusColors[r.status] || 'bg-gray-100'}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{r.pickup_location}</span>
                      <span className="text-gray-400 mx-1">→</span>
                      <span>{r.dropoff_location}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{r.pickup_datetime ? new Date(r.pickup_datetime).toLocaleString() : '—'}</span>
                      {r.price_quoted && (
                        <span className="font-semibold text-[#1B3A5C]">${r.price_quoted}</span>
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
                <h3 className="font-bold text-[#1B3A5C] mb-4">Request Detail</h3>
                <div className="space-y-3 text-sm mb-4">
                  {[
                    ['Customer', selected.customer_name],
                    ['Phone', selected.customer_phone],
                    ['Pickup', selected.pickup_location],
                    ['Drop-off', selected.dropoff_location],
                    ['Date/Time', selected.pickup_datetime ? new Date(selected.pickup_datetime).toLocaleString() : '—'],
                    ['Passengers', selected.passengers],
                    ['Quoted', selected.price_quoted ? `$${selected.price_quoted}` : 'Not quoted'],
                    ['Notes', selected.notes || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400 shrink-0">{label}</span>
                      <span className="font-medium text-right text-sm">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Update Status</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
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
                  <a
                    href={`https://wa.me/${selected.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                  >
                    WhatsApp Customer
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center text-gray-400 text-sm">
                Tap a request to view details.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
