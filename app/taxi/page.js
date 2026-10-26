'use client';

import { useState } from 'react';

export default function TaxiPage() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    pickup_location: '',
    dropoff_location: '',
    pickup_datetime: '',
    passengers: '1',
    notes: '',
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildWhatsAppMessage() {
    const lines = [
      "Hi Raymond! I'd like to request a taxi quote.",
      `Name: ${formData.customer_name}`,
      `Phone: ${formData.customer_phone}`,
      `Pickup: ${formData.pickup_location}`,
      `Drop-off: ${formData.dropoff_location}`,
      `Date/Time: ${formData.pickup_datetime || 'To be confirmed'}`,
      `Passengers: ${formData.passengers}`,
      formData.notes ? `Notes: ${formData.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return lines;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Save to DB (best effort)
    try {
      await fetch('/api/taxi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          passengers: parseInt(formData.passengers, 10),
          price_quoted: null,
          pickup_datetime: formData.pickup_datetime || null,
        }),
      });
    } catch {
      // Don't block WhatsApp if DB fails
    }

    // Open WhatsApp
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/12687345338?text=${encoded}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div
        className="text-white py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2d5986 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🚕</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Raymond&apos;s Private Taxi Service
          </h1>
          <p className="text-blue-200 text-lg">
            Luxury private transportation across Antigua. Airport pickups, hotel transfers,
            island tours — prompt, professional, always with a smile.
          </p>
        </div>
      </div>

      {/* How it works */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { step: '1', label: 'Fill in your details', desc: 'Tell us where you need to go and when.' },
            { step: '2', label: 'We send a quote', desc: 'Raymond will respond via WhatsApp with your price.' },
            { step: '3', label: 'Confirm & ride', desc: 'Approve the quote and Raymond will be there.' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#1B3A5C] font-extrabold text-lg flex items-center justify-center">
                {s.step}
              </div>
              <div className="font-semibold text-[#1B3A5C]">{s.label}</div>
              <div className="text-sm text-gray-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-14 px-4 bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B3A5C] mb-2">Request a Quote</h2>
          <p className="text-gray-500 mb-6">
            Fill in the details below and Raymond will send you a price via WhatsApp — usually within minutes.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="+1 268 555 0000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pickup_location"
                required
                value={formData.pickup_location}
                onChange={handleChange}
                placeholder="e.g. V.C. Bird International Airport, hotel name, address..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>

            {/* Drop-off Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop-off Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dropoff_location"
                required
                value={formData.dropoff_location}
                onChange={handleChange}
                placeholder="e.g. Jolly Beach Resort, English Harbour, hotel name..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>

            {/* Date/Time + Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date &amp; Time of Pickup
                </label>
                <input
                  type="datetime-local"
                  name="pickup_datetime"
                  value={formData.pickup_datetime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </label>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes / Special Requests
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Flight number, arrival time, luggage count, special requirements..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-3 shadow-md"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Request a Quote via WhatsApp
            </button>

            <p className="text-xs text-gray-400 text-center">
              This will open WhatsApp with your details pre-filled. Raymond will reply with your price.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
