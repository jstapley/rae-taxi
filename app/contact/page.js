'use client';

import { useState } from 'react';

export const metadata = undefined; // must be server component for metadata — moved to layout

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
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
      <div className="bg-[#1B3A5C] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-blue-200 text-lg">
            We&apos;re available 7 days a week. The fastest way to reach us is WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1B3A5C] mb-4">Get In Touch</h2>
              <div className="space-y-4">

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#16A34A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1B3A5C]">WhatsApp</div>
                    <a href="https://wa.me/12687345338" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] hover:underline text-sm">
                      +1 (268) 734-5338
                    </a>
                    <div className="text-gray-400 text-xs mt-0.5">Fastest response — usually within minutes</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#1B3A5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1B3A5C]">Email</div>
                    <a href="mailto:rae.js.peters@gmail.com" className="text-[#1B3A5C] hover:underline text-sm">
                      rae.js.peters@gmail.com
                    </a>
                    <div className="text-gray-400 text-xs mt-0.5">We&apos;ll respond as soon as possible</div>
                  </div>
                </div>

                {/* Location */}
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
                    <div className="text-gray-400 text-xs mt-0.5">Island-wide service available</div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1B3A5C]">Hours</div>
                    <div className="text-gray-600 text-sm">7 days a week</div>
                    <div className="text-gray-400 text-xs mt-0.5">WhatsApp available extended hours</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="https://wa.me/12687345338"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Open WhatsApp Chat
                </a>
                <a
                  href="tel:+12687345338"
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <span className="text-lg">📞</span>
                  Call Us
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1B3A5C] mb-1">Send a Message</h2>
              <p className="text-gray-500 text-sm mb-5">Fill in the form and Raymond will get back to you shortly.</p>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-[#1B3A5C] mb-1">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">Raymond will be in touch soon.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-4 text-sm text-[#F59E0B] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 268 555 0000"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="How can Raymond help you?"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try WhatsApp instead.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#1B3A5C] hover:bg-blue-900 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
