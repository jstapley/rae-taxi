import VehicleCard from '@/components/VehicleCard';
import { createServerClient } from '@/lib/supabase';

async function getVehicles() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('daily_rate', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load vehicles:', err.message);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Fleet — Private Luxury Car Rentals Antigua',
  description: "Browse Raymond's fleet of private rental vehicles in Antigua. Toyota RAV4, Honda Vezel, Subaru XV — all air-conditioned. Book online today.",
};

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-[#1B3A5C] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">Our Fleet</h1>
          <p className="text-blue-200 text-lg max-w-xl">
            Choose the perfect vehicle for your Antigua adventure. All cars are well-maintained
            and fully air-conditioned.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[#F59E0B] bg-opacity-10 border-b border-[#F59E0B] border-opacity-30 px-4 py-3">
        <div className="max-w-6xl mx-auto text-sm text-[#1B3A5C] flex items-center gap-2">
          <svg className="w-4 h-4 text-[#F59E0B] shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          All vehicles include AC &bull; Insurance options available at checkout &bull; Minimum rental: 1 day &bull; Prices in USD
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {vehicles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-lg">Fleet information unavailable. Please contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 bg-[#1B3A5C] text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Not sure which vehicle?</h3>
          <p className="text-blue-200 mb-5">
            Message us on WhatsApp and we&apos;ll help you choose the right car for your trip.
          </p>
          <a
            href="https://wa.me/12687345386"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
