import Link from 'next/link';
import Image from 'next/image';

export default function VehicleCard({ vehicle }) {
  const imageSrc = vehicle.image_url || null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-52 bg-gray-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-7xl">🚗</div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-[#1B3A5C]">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.available !== false ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2">
              Available
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2">
              Unavailable
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {vehicle.seats} seats
          </span>
          <span>&bull;</span>
          <span>Air-conditioned</span>
        </div>

        {/* Description */}
        {vehicle.description && (
          <p className="text-gray-500 text-sm mb-4 flex-1 leading-relaxed">
            {vehicle.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-extrabold text-[#1B3A5C]">
              ${Number(vehicle.daily_rate).toFixed(0)}
            </span>
            <span className="text-sm text-gray-400">/day USD</span>
            <div className="text-xs text-gray-400 mt-0.5">
              2+ days · 1 day ${Number(vehicle.daily_rate) + 5}
            </div>
          </div>
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="bg-[#1B3A5C] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            View &amp; Book
          </Link>
        </div>
      </div>
    </div>
  );
}
