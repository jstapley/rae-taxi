export const metadata = {
  title: 'RAE Admin Dashboard',
  description: 'Manage bookings, taxi requests and blog posts for RAE Taxi & Rentals Antigua.',
  manifest: '/admin-manifest.json',
  themeColor: '#1B3A5C',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RAE Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
