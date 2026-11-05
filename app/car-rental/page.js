'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PERIDOT_PHONE = '12687869093';
const PERIDOT_PHONE_DISPLAY = '+1 (268) 786-9093';

export default function CarRentalPage() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => r.json())
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact/car-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <div className="text-white py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
            Antigua · Car Rentals
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Peridot Car Rentals
          </h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore Antigua at your own pace. Well-maintained SUVs with AC, available island-wide.
            Discounted rates for 2+ days — no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:+${PERIDOT_PHONE}`}
              className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
            >
              📞 Call {PERIDOT_PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${PERIDOT_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-800 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Why Peridot */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-[#1B3A5C] mb-10">Why Rent with Peridot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🚗', title: 'Modern Fleet', desc: 'Fully AC\'d SUVs maintained to the highest standard. Perfect for Antigua\'s roads.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'From $70/day for 2+ days. One-day rentals just $5 more. No surprises at checkout.' },
              { icon: '🏝️', title: 'Island-Wide Service', desc: 'Pickup and drop-off anywhere on the island. We come to your hotel or the airport.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#F8FAFC] rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Fleet */}
      <section className="py-14 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B3A5C] mb-2 text-center">Our Fleet</h2>
          <p className="text-gray-500 text-center mb-10">Click a vehicle to view details and make a booking</p>
          {vehicles.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Loading vehicles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {v.image_url ? (
                      <Image src={v.image_url} alt={v.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="text-6xl">🚗</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#1B3A5C]">{v.name}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Available</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                      {v.year && <span>{v.year}</span>}
                      {v.year && v.seats && <span>&bull;</span>}
                      {v.seats && <span>{v.seats} seats</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-[#1B3A5C]">
                          ${v.daily_rate}
                          <span className="text-sm font-normal text-gray-400">/day</span>
                        </span>
                        <div className="text-xs text-gray-400 mt-0.5">2+ days · 1 day ${v.daily_rate + 5}</div>
                      </div>
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B3A5C] mb-2 text-center">Get in Touch</h2>
          <p className="text-gray-500 text-center mb-10">Have a question? Send us a message and we'll get back to you quickly.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#1B3A5C] mb-4 text-lg">Peridot Car Rentals</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-emerald-700 text-lg">📞</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1B3A5C]">Phone / WhatsApp</div>
                      <a href={`tel:+${PERIDOT_PHONE}`} className="text-emerald-700 hover:underline text-sm">{PERIDOT_PHONE_DISPLAY}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#1B3A5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1B3A5C]">Email</div>
                      <a href="mailto:peridotcarrentals@gmail.com" className="text-[#1B3A5C] hover:underline text-sm">peridotcarrentals@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#1B3A5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1B3A5C]">Location</div>
                      <div className="text-gray-600 text-sm">Antigua &amp; Barbuda</div>
                      <div className="text-gray-400 text-xs">Island-wide pickup &amp; drop-off</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${PERIDOT_PHONE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    WhatsApp Us
                  </a>
                  <a
                    href={`tel:+${PERIDOT_PHONE}`}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    📞 Call Us
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#1B3A5C] mb-1 text-lg">Send an Enquiry</h3>
              <p className="text-gray-500 text-sm mb-5">We'll reply within a few hours.</p>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-[#1B3A5C] mb-1">Enquiry Sent!</h3>
                  <p className="text-gray-500 text-sm">The Peridot team will be in touch soon.</p>
                  <button onClick={() => setStatus(null)} className="mt-4 text-sm text-emerald-700 hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="+1 268 ..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" required rows={4} value={formData.message} onChange={handleChange}
                      placeholder="Dates needed, number of people, pickup location..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please call or WhatsApp us instead.</p>
                  )}
                  <button type="submit" disabled={status === 'sending'}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Need a taxi instead? */}
      <section className="py-10 px-4 bg-[#1B3A5C] text-white text-center">
        <p className="text-blue-200 mb-3">Need a taxi or private driver instead?</p>
        <Link href="/taxi" className="inline-block bg-[#F59E0B] hover:bg-yellow-500 text-[#1B3A5C] font-bold px-8 py-3 rounded-xl transition-colors">
          Book Raymond&apos;s Taxi Service
        </Link>
      </section>

    </div>
  );
}
