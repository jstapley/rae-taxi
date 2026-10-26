export const metadata = {
  title: 'Contact — RAE Car Rentals & Taxi Antigua',
  description: 'Get in touch with RAE Car Rentals & Taxi in Antigua. WhatsApp, email, or use our contact form.',
};

export default function ContactPage() {
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
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#16A34A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1B3A5C]">WhatsApp</div>
                    <a
                      href="https://wa.me/12687345338"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#16A34A] hover:underline text-sm"
                    >
                      +1 (268) 734-5386
                    </a>
                    <div className="text-gray-400 text-xs mt-0.5">Fastest response — usually within minutes</div>
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
                    <div className="text-gray-600 text-sm">Antigua & Barbuda</div>
                    <div className="text-gray-400 text-xs mt-0.5">Island-wide service available</div>
                  </div>
                </div>

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

              <a
                href="https://wa.me/12687345338"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Open WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <div className="bg-[#1B3A5C] text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-1">Ready to book?</h3>
              <p className="text-blue-200 text-sm mb-4">
                Head to our fleet or taxi pages to start your booking.
              </p>
              <div className="space-y-2">
                <a
                  href="/vehicles"
                  className="block w-full text-center bg-[#F59E0B] hover:bg-yellow-500 text-[#1B3A5C] font-bold py-3 rounded-xl transition-colors"
                >
                  Browse Our Fleet
                </a>
                <a
                  href="/taxi"
                  className="block w-full text-center border-2 border-white text-white hover:bg-white hover:text-[#1B3A5C] font-bold py-3 rounded-xl transition-colors"
                >
                  Book a Taxi
                </a>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-bold text-[#1B3A5C] mb-2">Airport Transfers</h3>
              <p className="text-gray-600 text-sm mb-3">
                We offer fixed-price transfers from V.C. Bird International Airport.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">To Jolly Beach</span>
                  <span className="font-bold text-[#1B3A5C]">$50 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To English Harbour</span>
                  <span className="font-bold text-[#1B3A5C]">$75 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
