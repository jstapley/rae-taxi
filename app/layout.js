import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RAE Car Rentals & Taxi — Antigua',
  description:
    'Premium car rentals and reliable taxi services across Antigua. Explore the island on your own terms with RAE Rentals & Taxi.',
  keywords: 'car rental Antigua, taxi Antigua, airport transfer Antigua, RAE Rentals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#F8FAFC]`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#1B3A5C] text-white py-10 mt-auto">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">
                RAE <span className="text-[#F59E0B]">Rentals & Taxi</span>
              </h3>
              <p className="text-blue-200 text-sm">
                Your trusted transport partner in Antigua. Car rentals and taxi services
                island-wide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-[#F59E0B]">Quick Links</h4>
              <ul className="space-y-1 text-blue-200 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/vehicles" className="hover:text-white transition-colors">Our Fleet</a></li>
                <li><a href="/taxi" className="hover:text-white transition-colors">Taxi Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-[#F59E0B]">Contact Us</h4>
              <p className="text-blue-200 text-sm mb-2">Available 7 days a week</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNER_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
          <div className="text-center text-blue-300 text-xs mt-8 border-t border-blue-800 pt-4">
            &copy; {new Date().getFullYear()} RAE Car Rentals & Taxi. Antigua & Barbuda. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
