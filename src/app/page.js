'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {

  return (
    <div className="font-sans text-gray-900 bg-white transition-colors duration-300 overflow-hidden">

      <main className="bg-white text-gray-900">
        {/* Hero Section */}
        <section
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/Dzeki.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 text-center px-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Discover <span className="text-orange-500">Flavors</span> That Inspire
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              A refined dining experience where passion meets the plate.
            </p>
            <Link
              href="/reservations"
              className="inline-block px-8 py-3 rounded-full text-lg font-medium bg-orange-600 text-white hover:bg-orange-500 transition-shadow shadow-lg hover:shadow-xl"
            >
              Reserve a Table
            </Link>
          </motion.div>
        </section>

        {/* About Section */}
        <motion.section
          className="py-10 bg-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Rooted in tradition and elevated with modern flair, our dishes are handcrafted with the finest local ingredients.
              We believe in creating moments as memorable as our meals.
            </p>
            <Link
              href="/about"
              className="inline-block px-8 py-3 rounded-full text-lg font-medium bg-orange-600 text-white hover:bg-orange-500 transition-shadow shadow-lg hover:shadow-xl"
            >
              See our story!
            </Link>
          </div>
        </motion.section>

        {/* Menu Section */}
        <motion.section
          className="py-24 bg-gray-100"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Curated For Every Palate</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore a menu where classic cuisine meets creative artistry — appetizers, entrees, and desserts that are always memorable.
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-3 bg-orange-600 text-white text-lg rounded-full hover:bg-orange-500 transition duration-300 shadow-md"
            >
              View Menu
            </Link>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="py-24 bg-gray-900 text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dine With Us?</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-6">
              Whether you are celebrating or just craving something special, we’ll make your experience exceptional.
            </p>
            <Link
              href="/reservations"
              className="inline-block px-8 py-3 bg-orange-600 text-white text-lg rounded-full hover:bg-orange-500 transition duration-300 shadow-lg"
            >
              Book Your Table
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
