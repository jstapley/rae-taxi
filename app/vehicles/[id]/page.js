'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import BookingForm from '@/components/BookingForm';

const vehicleImages = {
  RAV4: '/vehicles/rav4.webp',
  Voxy: '/vehicles/toyota-voxy.jpg',
  Fit:  '/vehicles/honda-fit.jpg',
};

// Static fallback data used when Supabase is not yet connected (pilot mode)
const STATIC_VEHICLES = {
  'rav4-placeholder': {
    id: 'rav4-placeholder',
    name: 'RAV4',
    make: 'Toyota',
    model: 'RAV4',
    year: 2013,
    seats: 5,
    daily_rate: 75,
    available: true,
    description: 'Comfortable SUV perfect for exploring the island. Air-conditioned with ample boot space.',
  },
  'voxy-placeholder': {
    id: 'voxy-placeholder',
    name: 'Voxy',
    make: 'Toyota',
    model: 'Voxy',
    year: 2025,
    seats: 8,
    daily_rate: 110,
    available: true,
    description: 'Brand new spacious minivan ideal for groups and families. Features modern amenities and plenty of luggage space.',
  },
  'fit-placeholder': {
    id: 'fit-placeholder',
    name: 'Fit',
    make: 'Honda',
    model: 'Fit',
    year: 2018,
    seats: 4,
    daily_rate: 55,
    available: true,
    description: 'Economical and easy to drive. Great fuel efficiency for getting around Antigua.',
  },
};

const STATIC_INSURANCE = [
  { id: 'none', name: 'None', description: 'No additional insurance. Driver assumes full liability.', price_per_day: 0 },
  { id: 'basic', name: 'Basic CDW', description: 'Collision Damage Waiver — reduces your liability in case of an accident.', price_per_day: 15 },
  { id: 'full', name: 'Full Cover', description: 'Full protection including CDW, theft protection, and third-party liability.', price_per_day: 25 },
];

export default function VehicleDetailPage() {
  const params = useParams();
  const id = params.id;

  const [vehicle, setVehicle] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/vehicles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVehicle(data.vehicle);
          setBlockedDates(data.blockedDates || []);
          setInsuranceOptions(data.insuranceOptions || []);
        } else {
          // Fall back to static data for pilot mode
          const staticVehicle = STATIC_VEHICLES[id];
          if (staticVehicle) {
            setVehicle(staticVehicle);
            setInsuranceOptions(STATIC_INSURANCE);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        // Fall back to static data on network/Supabase errors
        const staticVehicle = STATIC_VEHICLES[id];
        if (staticVehicle) {
          setVehicle(staticVehicle);
          setInsuranceOptions(STATIC_INSURANCE);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleRangeSelect(range) {
    setPickupDate(range?.from || null);
    setDropoffDate(range?.to || null);
  }

  function scrollToForm() {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-[#1B3A5C] text-lg font-medium animate-pulse">Loading vehicle...</div>
      </div>
    );
  }

  if (notFound || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-center px-4">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-[#1B3A5C] mb-2">Vehicle Not Found</h2>
        <p className="text-gray-500 mb-6">This vehicle may not exist or is no longer available.</p>
        <a href="/vehicles" className="bg-[#1B3A5C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors">
          View All Vehicles
        </a>
      </div>
    );
  }

  const imageSrc = vehicleImages[vehicle.name] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-[#1B3A5C] text-white py-4 px-4">
        <div className="max-w-6xl mx-auto text-sm flex items-center gap-2 text-blue-300">
          <a href="/vehicles" className="hover:text-white transition-colors">Our Fleet</a>
          <span>/</span>
          <span className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Vehicle info */}
          <div>
            <div className="relative rounded-2xl h-72 overflow-hidden mb-6 shadow-sm bg-gray-100">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="h-full flex items-center justify-center text-9xl">🚗</div>
              )}
            </div>

            {/* Vehicle specs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold text-[#1B3A5C]">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                {vehicle.available !== false ? (
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
                    Unavailable
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-5 leading-relaxed">{vehicle.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Make', value: vehicle.make },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Year', value: vehicle.year },
                  { label: 'Seats', value: `${vehicle.seats} passengers` },
                  { label: 'Daily Rate', value: `$${Number(vehicle.daily_rate).toFixed(0)} USD` },
                  { label: 'Air Conditioning', value: 'Included' },
                ].map((spec) => (
                  <div key={spec.label} className="bg-[#F8FAFC] rounded-xl p-3">
                    <div className="text-xs text-gray-400 uppercase tracking-wide">{spec.label}</div>
                    <div className="font-semibold text-[#1B3A5C] mt-0.5">{spec.value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToForm}
                className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-lg"
              >
                Book This Vehicle
              </button>
            </div>

            {/* What's included */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#1B3A5C] mb-3">What&apos;s Included</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {['Full tank of fuel on pickup', 'Air conditioning', '24/7 WhatsApp support', 'Insurance options at checkout'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Calendar + Booking */}
          <div>
            {/* Availability Calendar */}
            <AvailabilityCalendar
              blockedDates={blockedDates}
              onRangeSelect={handleRangeSelect}
            />

            {/* Booking Form */}
            <div id="booking-form" className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1B3A5C] mb-5">Complete Your Booking Request</h2>
              <BookingForm
                vehicle={vehicle}
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                insuranceOptions={insuranceOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
