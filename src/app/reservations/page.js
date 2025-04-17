'use client'

import React, { useState } from 'react';
import Image from 'next/image';

export default function Reservations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, like sending it to an API
    alert('Reservation confirmed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Make a <span className="text-orange-600 italic">Reservation</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Reserve your table now and enjoy an unforgettable dining experience with us.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Image section - simplified with no overlay */}
            <div className="md:col-span-2 relative h-64 md:h-full">
              <Image
                src="/Chico.jpg"
                alt="Restaurant ambiance"
                className="w-full h-full object-cover"
                width={800}
                height={1000}
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-bold text-2xl mb-2 text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>Join Us</h3>
                <p className="text-sm text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>Experience the perfect blend of ambiance and exceptional cuisine</p>
              </div>
            </div>

            {/* Form section */}
            <div className="md:col-span-3 p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="people" className="block text-sm font-medium text-gray-700">Party Size</label>
                    <div className="relative">
                      <select
                        id="people"
                        name="people"
                        value={formData.people}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </option>
                        ))}
                        <option value="9">9+ (Please specify in notes)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition appearance-none"
                    >
                      <option value="" disabled>Select a time</option>
                      {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Any dietary restrictions or special occasions?"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition h-24 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 hover:translate-y-0.5 transition duration-300 ease-in-out"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>For large parties or special events, please contact us directly at <span className="font-medium">reservations@yourrestaurant.com</span></p>
        </div>
      </div>
    </div>
  );
}