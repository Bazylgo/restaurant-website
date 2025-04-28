'use client';
import "./globals.css";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

// Create a SessionProvider wrapper component
function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Navigation component with auth status
function Navigation({ isMenuOpen, setIsMenuOpen }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600" onClick={closeMenu}>
          🍽 RestoVibe
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/menu" className="hover:text-orange-600">Menu</Link>
          <Link href="/reservations" className="hover:text-orange-600">Reservations</Link>
          <Link href="/about" className="hover:text-orange-600">About Us</Link>

          {/* Auth links for desktop */}
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="hover:text-orange-600">
                {session.user.name || session.user.email}
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-orange-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Sign in
            </Link>
          )}
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

          {/* Auth links for mobile */}
          {session ? (
            <>
              <Link href="/profile" className="text-lg text-orange-600 hover:text-orange-800" onClick={closeMenu}>
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="text-lg cursor-pointer text-orange-600 hover:text-orange-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-lg text-orange-600 hover:text-orange-800" onClick={closeMenu}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default function Layout({ children }) {
  // State for toggling the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Restaurant Website</title>
      </head>
      <body className="bg-white text-gray-900">
        <Providers>
          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* Padding below fixed header */}
          <main className="pt-24 px-4">{children}</main>
          <Toaster position="top-center" />
          <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="container mx-auto text-center">
              <p>&copy; 2025 RestoVibe. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}