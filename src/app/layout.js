import "./globals.css";
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Restaurant Website</title>
      </head>
      <body className="bg-white text-gray-900">
        <header className="fixed top-0 w-full z-50 bg-white bg-opacity-80 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              🍽 RestoVibe
            </Link>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/menu" className="hover:text-orange-600">Menu</Link>
                <Link href="/reservations" className="hover:text-orange-600">Reservations</Link>
                <Link href="/about" className="hover:text-orange-600">About Us</Link>
              </nav>
              {/* You can add mobile navigation or other elements here if needed */}
            </div>
          </div>
        </header>

        <main className="mt-16">{children}</main> {/* Add top margin to avoid overlap */}

        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 RestoVibe. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}