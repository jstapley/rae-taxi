import Link from 'next/link';

export const metadata = {
  title: 'Everyone Loves Raymond — Private Taxi & Peridot Car Rentals Antigua',
  description: "Antigua's trusted transportation services. Book Raymond's private taxi or rent a car with Peridot Car Rentals. Airport transfers, island tours & SUV rentals island-wide.",
  alternates: { canonical: 'https://www.privateluxurytransportationantigua.com' },
};

export default function HomePage() {
  return (
    <>
      {/* Hero — split service selector */}
      <section
        className="relative py-20 px-4 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2d5986 60%, #1B3A5C 100%)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block bg-[#F59E0B] text-[#1B3A5C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
            Antigua · Transportation Services
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            What can we help<br />you with today?
          </h1>
          <p className="text-blue-200 text-lg mb-12">
            Choose the service that fits your needs — private taxi or car rental, we&apos;ve got you covered.
          </p>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Taxi card */}
            <Link
              href="/taxi"
              className="group bg-white/10 hover:bg-[#F59E0B] border-2 border-white/30 hover:border-[#F59E0B] rounded-2xl p-7 text-left transition-all duration-200 hover:text-[#1B3A5C] hover:scale-[1.02]"
            >
              <div className="text-5xl mb-4">🚕</div>
              <h2 className="text-xl font-extrabold mb-2 group-hover:text-[#1B3A5C]">
                Taxi Service
              </h2>
              <p className="text-blue-200 group-hover:text-[#1B3A5C]/80 text-sm leading-relaxed mb-4">
                Airport pickups, hotel transfers &amp; island tours with Raymond.
                Quote via WhatsApp — usually within minutes.
              </p>
              <span className="inline-block bg-[#F59E0B] group-hover:bg-[#1B3A5C] group-hover:text-white text-[#1B3A5C] font-bold px-5 py-2 rounded-xl text-sm transition-colors">
                I need a taxi!
              </span>
            </Link>

            {/* Car rental card */}
            <Link
              href="/car-rental"
              className="group bg-white/10 hover:bg-emerald-500 border-2 border-white/30 hover:border-emerald-500 rounded-2xl p-7 text-left transition-all duration-200 hover:text-white hover:scale-[1.02]"
            >
              <div className="text-5xl mb-4">🚗</div>
              <h2 className="text-xl font-extrabold mb-2">
                Car Rentals
              </h2>
              <p className="text-blue-200 group-hover:text-white/90 text-sm leading-relaxed mb-4">
                Self-drive SUVs from $70/day. Toyota RAV4, Honda Vezel &amp; Subaru XV.
                Discounted rates for 2+ days.
              </p>
              <span className="inline-block bg-emerald-500 group-hover:bg-white group-hover:text-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
                I need a car!
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-white py-6 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1B3A5C]">Taxi:</span>
            <a href="tel:+12687345338" className="hover:text-[#1B3A5C] font-medium">+1 (268) 734-5338</a>
            <span className="text-gray-300">|</span>
            <a href="https://wa.me/12687345338" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-medium hover:underline">WhatsApp</a>
          </div>
          <div className="hidden sm:block w-px h-5 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-700">Car Rentals:</span>
            <a href="tel:+12687869093" className="hover:text-emerald-700 font-medium">+1 (268) 786-9093</a>
            <span className="text-gray-300">|</span>
            <a href="mailto:peridotcarrentals@gmail.com" className="text-emerald-700 font-medium hover:underline">Email Us</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-[#1B3A5C] mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌴', title: 'Local Expertise', desc: 'Born and raised in Antigua. We know every road, resort, and hidden gem on the island.' },
              { icon: '⚡', title: 'Fast Response', desc: 'Taxi quotes via WhatsApp usually within minutes. Car rental bookings confirmed same day.' },
              { icon: '✅', title: 'No Hidden Fees', desc: 'Transparent pricing on everything. What you see is what you pay — always.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-[#16A34A] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-bold mb-1">Not sure which service you need?</h3>
            <p className="text-green-100">Message us on WhatsApp and we&apos;ll point you in the right direction.</p>
          </div>
          <a
            href="https://wa.me/12687345338"
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
