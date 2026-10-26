import Link from 'next/link';
import Image from 'next/image';

const fleetPreview = [
  { name: 'Toyota RAV4',  year: 2022, seats: 5, rate: 75, image: '/vehicles/rav4.webp' },
  { name: 'Honda Vezel',  year: 2020, seats: 5, rate: 70, image: null },
  { name: 'Subaru XV',    year: 2019, seats: 5, rate: 65, image: null },
];

const features = [
  {
    icon: '🚘',
    title: 'Reliable Fleet',
    desc: 'Well-maintained vehicles with AC, ready for island adventures. Choose from economy to spacious minivan.',
  },
  {
    icon: '🗺️',
    title: 'Island-Wide Taxi',
    desc: 'Fixed-price transfers from the airport and flexible taxi service to any destination across Antigua.',
  },
  {
    icon: '📱',
    title: 'Easy Booking',
    desc: 'Book online in minutes or reach us instantly on WhatsApp. No hidden fees, transparent pricing.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center justify-center text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1B3A5C 0%, #2d5986 50%, #1B3A5C 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-20">
          <div className="inline-block bg-[#F59E0B] text-[#1B3A5C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
            Raymond&apos;s · Antigua
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Antigua&apos;s Private{' '}
            <span className="text-[#F59E0B]">Luxury Transportation</span>
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Raymond&apos;s delivers prompt, professional shuttle service and car rentals across Antigua.
            Airport transfers, island tours, private transportation — always with a smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vehicles"
              className="bg-[#16A34A] hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
            >
              Browse Our Fleet
            </Link>
            <Link
              href="/taxi"
              className="border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#1B3A5C] font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Book a Taxi
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-[#1B3A5C] mb-10">
            Why Choose RAE?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#F8FAFC] rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Preview */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-[#1B3A5C]">Our Fleet</h2>
            <Link
              href="/vehicles"
              className="text-[#F59E0B] font-semibold hover:underline text-sm"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleetPreview.map((v) => (
              <div
                key={v.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <span className="text-6xl">🚗</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#1B3A5C]">{v.name}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span>{v.year}</span>
                    <span>&bull;</span>
                    <span>{v.seats} seats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#1B3A5C]">
                      ${v.rate}
                      <span className="text-sm font-normal text-gray-400">/day</span>
                    </span>
                    <Link
                      href="/vehicles"
                      className="bg-[#1B3A5C] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View &amp; Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Taxi CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1B3A5C] mb-3">
            Private Taxi Service Across Antigua
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
            Airport arrivals, hotel transfers, island tours — Raymond provides prompt, professional private transportation.
            All prices are regulated and based on 1–2 passengers. Request a quote and Raymond will respond via WhatsApp.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: '✈️', label: 'Airport Arrivals', desc: 'Pre-arranged pickup with meet & greet. Regulated fares.' },
              { icon: '🏨', label: 'Hotel Transfers', desc: 'Door-to-door service to any resort or hotel on the island.' },
              { icon: '🌴', label: 'Island Tours', desc: 'Full or half-day private tours. Raymond knows every corner of Antigua.' },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8FAFC] rounded-2xl px-6 py-7 border border-gray-100 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-bold text-[#1B3A5C] mb-1">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
          <Link
            href="/taxi"
            className="inline-block bg-[#16A34A] hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-md"
          >
            Request a Taxi Quote
          </Link>
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="bg-[#16A34A] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-bold mb-1">Need help deciding?</h3>
            <p className="text-green-100">Chat with us on WhatsApp — we usually respond within minutes.</p>
          </div>
          <a
            href="https://wa.me/12687345386"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#16A34A] font-bold px-8 py-4 rounded-xl text-lg hover:bg-green-50 transition-colors flex items-center gap-3 whitespace-nowrap shadow"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message Us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
