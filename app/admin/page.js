'use client';

// TODO: Replace this client-side password check with proper authentication
// (NextAuth.js, Supabase Auth, or middleware-based auth) before going to production.

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'rae2024';

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('rae-admin-auth', '1');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">RAE Rentals & Taxi Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#1B3A5C] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-sm`} style={{ background: color }}>
      <div className="text-4xl font-extrabold mb-1">{value ?? '—'}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ totalBookings: 0, pendingBookings: 0, totalTaxi: 0 });
  const [bookings, setBookings] = useState([]);
  const [taxiRequests, setTaxiRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, tRes] = await Promise.all([
          fetch('/api/admin/bookings-list'),
          fetch('/api/admin/taxi-list'),
        ]);
        const bData = bRes.ok ? await bRes.json() : [];
        const tData = tRes.ok ? await tRes.json() : [];

        setBookings(bData.slice(0, 10));
        setTaxiRequests(tData.slice(0, 10));
        setStats({
          totalBookings: bData.length,
          pendingBookings: bData.filter((b) => b.status === 'pending').length,
          totalTaxi: tData.length,
        });
      } catch {
        // API may not be connected yet
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Admin Header */}
      <div className="bg-[#1B3A5C] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">RAE Admin Dashboard</h1>
          <p className="text-blue-300 text-xs">Rentals & Taxi Management</p>
        </div>
        <button
          onClick={onLogout}
          className="text-blue-300 hover:text-white text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Nav */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { href: '/admin/bookings', label: 'Manage Bookings' },
            { href: '/admin/vehicles', label: 'Manage Vehicles' },
            { href: '/admin/taxi', label: 'Taxi Requests' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="bg-[#1B3A5C] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Bookings" value={stats.totalBookings} color="#1B3A5C" />
          <StatCard label="Pending Bookings" value={stats.pendingBookings} color="#F59E0B" />
          <StatCard label="Taxi Requests" value={stats.totalTaxi} color="#16A34A" />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-[#1B3A5C]">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-[#F59E0B] text-sm font-medium hover:underline">
              View All
            </a>
          </div>
          {loading ? (
            <div className="p-6 text-gray-400 text-sm">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-gray-400 text-sm">No bookings yet.</div>
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
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{b.customer_name}</td>
                      <td className="px-4 py-3 text-gray-500">{b.vehicles?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {b.pickup_date} → {b.dropoff_date}
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

        {/* Recent Taxi Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-[#1B3A5C]">Recent Taxi Requests</h2>
            <a href="/admin/taxi" className="text-[#F59E0B] text-sm font-medium hover:underline">
              View All
            </a>
          </div>
          {loading ? (
            <div className="p-6 text-gray-400 text-sm">Loading...</div>
          ) : taxiRequests.length === 0 ? (
            <div className="p-6 text-gray-400 text-sm">No taxi requests yet.</div>
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
                  {taxiRequests.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{t.customer_name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {t.pickup_location} → {t.dropoff_location}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {t.pickup_datetime
                          ? new Date(t.pickup_datetime).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[t.status] || 'bg-gray-100'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {t.price_quoted ? `$${t.price_quoted}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('rae-admin-auth') === '1') {
      setAuthed(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!authed) {
    return <LoginForm onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        sessionStorage.removeItem('rae-admin-auth');
        setAuthed(false);
      }}
    />
  );
}
