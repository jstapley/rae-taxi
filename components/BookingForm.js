'use client';

import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import InsuranceSelector from './InsuranceSelector';

export default function BookingForm({ vehicle, pickupDate, dropoffDate, insuranceOptions }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    license_number: '',
    license_country: '',
    notes: '',
  });
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const numDays =
    pickupDate && dropoffDate
      ? Math.max(1, differenceInDays(dropoffDate, pickupDate))
      : 0;

  const vehicleRate = Number(vehicle?.daily_rate || 0);
  const insuranceCost = selectedInsurance ? Number(selectedInsurance.price_per_day || 0) : 0;
  const totalPerDay = vehicleRate + insuranceCost;
  const totalAmount = totalPerDay * numDays;

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleInsuranceSelect(opt) {
    setSelectedInsurance(opt);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!pickupDate || !dropoffDate) {
      setError('Please select pickup and drop-off dates from the calendar above.');
      return;
    }
    if (!formData.customer_name || !formData.customer_phone || !formData.license_number) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        vehicle_id: vehicle.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        license_number: formData.license_number,
        license_country: formData.license_country,
        pickup_date: format(pickupDate, 'yyyy-MM-dd'),
        dropoff_date: format(dropoffDate, 'yyyy-MM-dd'),
        insurance_option_id: selectedInsurance?.id || null,
        total_amount: totalAmount,
        notes: formData.notes,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Booking Request Sent!</h3>
        <p className="text-green-600 mb-4">
          We&apos;ve received your request for the {vehicle?.year} {vehicle?.make} {vehicle?.model}.
          We&apos;ll confirm your booking via WhatsApp or email shortly.
        </p>
        <a
          href="https://wa.me/12687345386"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#16A34A] text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Follow up on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-lg font-bold text-[#1B3A5C] mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
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
              Phone Number <span className="text-red-500">*</span>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* License Info */}
      <div>
        <h3 className="text-lg font-bold text-[#1B3A5C] mb-4">Driver&apos;s License</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="license_number"
              required
              value={formData.license_number}
              onChange={handleChange}
              placeholder="DL-123456"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuing Country
            </label>
            <input
              type="text"
              name="license_country"
              value={formData.license_country}
              onChange={handleChange}
              placeholder="Antigua, USA, UK..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Date summary */}
      <div>
        <h3 className="text-lg font-bold text-[#1B3A5C] mb-3">Rental Dates</h3>
        {pickupDate && dropoffDate ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pickup</div>
              <div className="font-semibold text-[#1B3A5C]">
                {format(pickupDate, 'EEE, MMM d, yyyy')}
              </div>
            </div>
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Drop-off</div>
              <div className="font-semibold text-[#1B3A5C]">
                {format(dropoffDate, 'EEE, MMM d, yyyy')}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            Please select your dates using the calendar above.
          </div>
        )}
      </div>

      {/* Insurance */}
      <div>
        <h3 className="text-lg font-bold text-[#1B3A5C] mb-3">Insurance Option</h3>
        <InsuranceSelector
          options={insuranceOptions}
          selected={selectedInsurance?.id || selectedInsurance?.name || null}
          onSelect={handleInsuranceSelect}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests / Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requirements, pickup location preferences, etc."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
        />
      </div>

      {/* Booking Summary */}
      {numDays > 0 && (
        <div className="bg-[#1B3A5C] text-white rounded-2xl p-5">
          <h3 className="font-bold text-lg mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">
                {vehicle?.year} {vehicle?.make} {vehicle?.model}
              </span>
              <span>${vehicleRate}/day</span>
            </div>
            {insuranceCost > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-200">{selectedInsurance?.name} insurance</span>
                <span>+${insuranceCost}/day</span>
              </div>
            )}
            <div className="flex justify-between text-blue-200">
              <span>Duration</span>
              <span>{numDays} day{numDays !== 1 ? 's' : ''}</span>
            </div>
            <div className="border-t border-blue-700 pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#F59E0B]">${totalAmount} USD</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#16A34A] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-md"
      >
        {submitting ? 'Sending Request...' : 'Request Booking'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        This is a booking request — we will confirm availability and contact you within a few hours.
      </p>
    </form>
  );
}
