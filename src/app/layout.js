'use client';
import "./globals.css";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  // State for toggling the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="en">
      <head>
        <title>Restaurant Website</title>
      </head>
      <body className="bg-white text-gray-900">
        <header className="fixed top-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600" onClick={closeMenu}>
              🍽 RestoVibe
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/menu" className="hover:text-orange-600">Menu</Link>
              <Link href="/reservations" className="hover:text-orange-600">Reservations</Link>
              <Link href="/about" className="hover:text-orange-600">About Us</Link>
            </nav>

            {/* Mobile hamburger */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X size={24} className="text-orange-600" /> : <Menu size={24} className="text-orange-600" />}
            </button>
          </div>

          {/* Mobile menu overlay */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 z-40 flex flex-col items-center space-y-4">
              <Link href="/menu" className="text-lg text-orange-600 hover:text-orange-800" onClick={closeMenu}>
                Menu
              </Link>
              <Link href="/reservations" className="text-lg text-orange-600 hover:text-orange-800" onClick={closeMenu}>
                Reservations
              </Link>
              <Link href="/about" className="text-lg text-orange-600 hover:text-orange-800" onClick={closeMenu}>
                About Us
              </Link>
            </div>
          )}
        </header>

        {/* Padding below fixed header */}
        <main className="pt-24 px-4">{children}</main>

        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 RestoVibe. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
