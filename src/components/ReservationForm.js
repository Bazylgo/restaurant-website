//page.js
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Calendar from '../app/reservations/Calendar'; // Assuming Calendar.js is in the same directory
import { format } from 'date-fns';

export default function Reservations() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '', // Will store the formatted date string
    time: '',
    people: 1,
    notes: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const blockedReservationTimes = ['2025-04-20', new Date(2025, 3, 25)]; // Example blocked dates
  const [isFormValid, setIsFormValid] = useState(false);

// Add this new effect to ensure the Calendar component always reflects current time availability
  useEffect(() => {

    const { name, email, phone, date, time, people } = formData;
    setIsFormValid(name && email && phone && date && time && people); // If all required fields are filled, set to true

    // This effect runs whenever availableTimes changes
    console.log('Available times updated in state:', availableTimes);

    // Force the Calendar to recognize the new time availability
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Forcing Calendar update for ${formattedDate} with new times`);

      // This is just to notify that times have changed
      // The actual times are passed through the generateAvailableTimesForCalendar prop
    }
  }, [availableTimes, selectedDate, formData]);

  const handleDateTimeSelect = (date, time = null) => {
    setSelectedDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');

    // Update the date in form data
    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate,
      // Only update time if provided
      ...(time ? { time } : {})
    }));

    // Clear any error messages when a valid date is selected
    setErrorMessage('');

    // Get current party size and immediately calculate available times
    const partySize = parseInt(formData.people) || 1;
    console.log(`Date selected: ${formattedDate}, Party size: ${partySize} - Calculating available times`);
    calculateAvailableTimes(date, partySize);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // First update the form data with the new value
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // Specifically for party size changes, immediately trigger recalculation
      if (name === 'people' && selectedDate) {
        console.log('Party size changed to:', value, '- Immediately recalculating times');
        const partySize = parseInt(value) || 1;

        // We need to force this calculation to happen after state update
        // Use setTimeout with 0ms delay to push this to the next event loop cycle
        setTimeout(() => {
          calculateAvailableTimes(selectedDate, partySize);
        }, 0);
      }

      return updatedData;
    });
  };

  const calculateAvailableTimes = (date, partySize) => {
    // Ensure partySize is a number
    partySize = parseInt(partySize) || 1;

    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayOfWeek = format(date, 'EEEE');

    console.log(`CALCULATING TIMES for Date=${formattedDate}, Day=${dayOfWeek}, Party Size=${partySize}`);

    // Start with all possible times
    const allTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
    let unavailableTimes = [];

    // Date-specific unavailability
    if (formattedDate === '2025-04-26') {
      console.log('Adding date-specific restrictions for April 26');
      unavailableTimes = [...unavailableTimes, '18:00', '18:30', '19:00'];
    }

    // Party size and day of week restrictions - with explicit logging
    if (partySize > 4 && dayOfWeek === 'Friday') {
      console.log('Adding prime time restrictions for large party on Friday');
      unavailableTimes = [...unavailableTimes, '19:30', '20:00', '20:30'];
    } else {
      console.log('No Friday prime time restrictions needed (party size ≤ 4 or not Friday)');
    }

    if (partySize > 6) {
      console.log('Adding early time restrictions for very large party (>6)');
      unavailableTimes = [...unavailableTimes, '17:00', '17:30'];
    } else {
      console.log('No early time restrictions needed (party size ≤ 6)');
    }

    // Filter available times
    const filteredTimes = allTimes.filter(time => !unavailableTimes.includes(time));

    console.log('RESULT - Unavailable times:', unavailableTimes);
    console.log('RESULT - Available times:', filteredTimes);

    // Update available times in state - this is critical
    setAvailableTimes(filteredTimes);

    // Update the time selection if needed
    if (formData.time && !filteredTimes.includes(formData.time)) {
      // If current time is no longer available, select the first available time
      console.log(`Previously selected time ${formData.time} is no longer available, selecting ${filteredTimes[0] || ''}`);
      setFormData(prev => ({
        ...prev,
        time: filteredTimes.length > 0 ? filteredTimes[0] : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!selectedDate) {
      setErrorMessage('Please select a valid date');
      return;
    }

    if (!formData.time) {
      setErrorMessage('Please select a time');
      return;
    }

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
		alert(`Reservation confirmed for ${formData.name} on ${formData.date} at ${formData.time} for ${formData.people} people!`);
		setErrorMessage('');
	  } else {
		setErrorMessage(result.error || 'Something went wrong');
	  }
    } catch (err) {
      console.error(err);
      setErrorMessage('Server error. Please try again.');
    }
  };

  const handleUnavailableDaySelected = (message) => {
    setErrorMessage(message);
  };

  // Instead of using useEffect, we'll let the handleDateTimeSelect and
  // handleInputChange functions manage the available times calculation

  const isTimeBlocked = (time) => {
    return !availableTimes.includes(time);
  };

  // Custom function to generate time options for the date
  const generateAvailableTimesForCalendar = (day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const formattedSelectedDay = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    if (formattedDay === formattedSelectedDay) {
      // For the selected date, use our calculated available times
      console.log('Calendar component requesting times for selected date, returning:', availableTimes);
      return availableTimes;
    }

    // For other dates, calculate preliminary times
    console.log('Calendar requesting times for non-selected date:', formattedDay);
    return ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4" id="reservation-title">
            Make a <span className="text-orange-600 italic">Reservation</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Reserve your table now and enjoy an unforgettable dining experience with us.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Image section */}
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
                <h3 className="font-bold text-2xl mb-2 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>Join Us</h3>
                <p className="text-sm text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>Experience the perfect blend of ambiance and exceptional cuisine</p>
              </div>
            </div>

            {/* Form section */}
            <div className="md:col-span-3 p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5" aria-labelledby="reservation-title">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                    {errorMessage}
                  </div>
                )}

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
                      aria-required="true"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
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
                      aria-required="true"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
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
                      aria-required="true"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
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
                        aria-required="true"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </option>
                        ))}
                        <option value="9">9+ (Please specify in notes)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700" aria-hidden="true">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <Calendar
                    onDateSelect={handleDateTimeSelect}
                    blockedTimes={blockedReservationTimes}
                    onSelectUnavailableDay={handleUnavailableDaySelected}
                    // Pass our custom function to override the Calendar's default time generation
                    generateAvailableTimes={generateAvailableTimesForCalendar}
                  />

                  {selectedDate && !formData.time && (
                    <p className="mt-2 text-sm text-gray-600">
                      Please select a time slot after choosing a date.
                    </p>
                  )}

                  {selectedDate && formData.time && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      Your reservation: {format(selectedDate, 'EEEE, MMMM d')} at {formData.time}
                    </p>
                  )}

                  <input
                    type="hidden"
                    id="date"
                    name="date"
                    value={formData.date}
                    readOnly
                  />
                  <input
                    type="hidden"
                    id="time"
                    name="time"
                    value={formData.time}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions or special occasions?"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition h-24 resize-none"
                    aria-label="Special requests or notes for your reservation"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full md:w-auto px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 hover:translate-y-0.5 transition duration-300 ease-in-out ${
                      (!isFormValid) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-disabled={!isFormValid}
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
