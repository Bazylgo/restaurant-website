'use client'; // Make it a client component for framer-motion

import React from 'react';
import Image from 'next/image';
import { FaHistory, FaUtensils, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  viewport: { once: true }, // Only animate once when in viewport
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  viewport: { once: true }, // Only animate once when in viewport
};

export default function About() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16"> {/* Removed min-h-screen */}
      <div className="container mx-auto px-4">
        <motion.section
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Our <span className="text-orange-600 italic">Story</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the journey that brought RestoVibe to life, our passion for food, and our commitment to creating memorable dining experiences.
          </p>
        </motion.section>

        <section className="grid md:grid-cols-2 gap-12 mb-12 md:mb-16 items-center">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-lg"
            initial="initial"
            whileInView="animate"
            variants={imageVariants}
            viewport={{ once: true }}
          >
            <Image
              src="/JeDogiArmJa.jpg"
              alt="Our Restaurant Team"
              className="w-full object-cover" // Removed fixed height
              style={{ maxHeight: '500px' }} // Added max height
              width={600}
              height={450} // Keep aspect ratio for resizing
              priority
            />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Our Philosophy</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At RestoVibe, we believe that dining is more than just eating; it&aposs an experience. We are dedicated to using the freshest, locally sourced ingredients to craft dishes that are both innovative and comforting. Our goal is to create a warm and inviting atmosphere where every guest feels like part of our family.
            </p>
            <div className="flex items-center space-x-4">
              <FaHistory className="text-orange-600 text-xl" />
              <p className="text-gray-700">Founded with a passion for culinary excellence.</p>
            </div>
            <div className="flex items-center space-x-4">
              <FaUtensils className="text-orange-600 text-xl" />
              <p className="text-gray-700">Crafted with love by our talented chefs.</p>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 md:mb-16"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Image
                src="/bazyl.jpg" // Replace with actual image
                alt="Chef Bazyl"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
                width={128}
                height={128}
              />
              <h3 className="text-xl font-semibold text-gray-800">Bazyl</h3>
              <p className="text-gray-600 text-sm">Executive Chef</p>
            </div>
            <div className="text-center">
              <Image
                src="/Diego.jpg" // Replace with actual image
                alt="Diego"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
                width={128}
                height={128}
              />
              <h3 className="text-xl font-semibold text-gray-800">Diego</h3>
              <p className="text-gray-600 text-sm">Restaurant Manager</p>
            </div>
            <div className="text-center">
              <Image
                src="/Bruno.jpg" // Replace with actual image
                alt="Bruno"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
                width={128}
                height={128}
              />
              <h3 className="text-xl font-semibold text-gray-800">Bruno</h3>
              <p className="text-gray-600 text-sm">Head Waiter</p>
            </div>
            {/* Add more team members as needed */}
          </div>
        </motion.section>

        <motion.section
          className="bg-gray-100 rounded-2xl shadow-md p-8 md:p-12 mb-8 md:mb-0"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We&apos;d love to hear from you! Whether you have a question about our menu, want to make a reservation for a large group, or just want to say hello, feel free to reach out.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-700">
                  <FaMapMarkerAlt className="text-orange-600" />
                  <span>123 Main Street, Anytown, USA 12345</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-700">
                  <FaPhone className="text-orange-600" />
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-700">
                  <FaEnvelope className="text-orange-600" />
                  <span>info@restovibe.com</span>
                </li>
              </ul>
            </div>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2792014868!2d-74.25908993344693!3d40.69767006478206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1631753362049!5m2!1sen!2sus" // Replace with your actual map URL
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}