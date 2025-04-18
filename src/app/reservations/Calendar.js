//calendar.js
'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, addDays, isAfter, isBefore } from 'date-fns';

const Calendar = ({ onDateSelect, blockedTimes = [], onSelectUnavailableDay, generateAvailableTimes }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (selectedDate && generateAvailableTimes) {
      const times = generateAvailableTimes(selectedDate);
      setAvailableTimes(times);
      setShowTimeSelector(true);
    }
  }, [generateAvailableTimes, selectedDate]);

  const today = new Date();

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const defaultGenerateAvailableTimes = (day) => {
    // This would ideally come from your API based on the selected day
    // For now, we'll return a static set with some variations
    const dayOfWeek = format(day, 'EEEE');
    const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

    // Example: Fewer slots on weekends
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
      return times.filter((_, index) => index % 2 === 0); // Every other time slot
    }

    return times;
  };

  const handleDateClick = (day) => {
    if (isPastDate(day)) {
      if (onSelectUnavailableDay) {
        onSelectUnavailableDay("Cannot book in the past");
      }
      return;
    }

    if (isDateBlocked(day)) {
      if (onSelectUnavailableDay) {
        onSelectUnavailableDay("Cannot book on the selected day");
      }
      return;
    }

    setSelectedDate(day);
    onDateSelect(day);

    // Generate and show available times for the selected date
    // Use the prop function if provided, otherwise use the default
    const timesGenerator = generateAvailableTimes || defaultGenerateAvailableTimes;
    const times = timesGenerator(day);
    setAvailableTimes(times);
    setShowTimeSelector(true);
  };

  const handleTimeSelect = (time) => {
    onDateSelect(selectedDate, time);
    setShowTimeSelector(false);
  };

  const isDateBlocked = (date) => {
    return blockedTimes.some(blocked => {
      const blockedDate = typeof blocked === 'string' ? parseISO(blocked) : blocked;
      return isSameDay(date, blockedDate);
    });
  };

  const isPastDate = (date) => {
    // Set hours to 0 to compare only dates, not times
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    return isBefore(date, todayStart);
  };

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4" role="region" aria-label="Calendar navigation">
        <button
          onClick={prevMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 transition"
          aria-label="Previous month"
        >
          <span aria-hidden="true">←</span>
        </button>
        <h2 className="text-xl font-semibold" id="month-label">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button
          onClick={nextMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 transition"
          aria-label="Next month"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div key={i} className="text-center font-semibold" role="columnheader" aria-label={format(day, 'EEEE')}>
          {format(day, 'EE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1 mb-2" role="row">{days}</div>;
  };

  const daysOfMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = [];
    let days = [];
    let currentDate = startDate;
    let weekNumber = 0;

    while (currentDate <= endDate) {
      weekNumber++;
      for (let i = 0; i < 7; i++) {
        const day = currentDate;
        const isCurrent = isSameDay(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isBlocked = isDateBlocked(day);
        const isPast = isPastDate(day);
        const isWithinMonth = isSameMonth(day, currentMonth);
        const isSelectable = isWithinMonth && !isBlocked && !isPast;

        days.push(
          <div
            key={day.toISOString()}
            role="gridcell"
            aria-label={format(day, 'PPPP')}
            aria-selected={isSelected}
            aria-disabled={!isSelectable}
            tabIndex={isSelectable ? 0 : -1}
            className={`
              text-center py-2 rounded-lg transition
              ${isWithinMonth ? 'text-gray-800' : 'text-gray-400'}
              ${isCurrent ? 'ring-2 ring-orange-500 bg-orange-50' : ''}
              ${isSelected ? 'bg-orange-600 text-white font-medium' : ''}
              ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
              ${isBlocked ? 'bg-red-200 text-red-800 cursor-not-allowed' : ''}
              ${isSelectable ? 'hover:bg-orange-100 cursor-pointer' : ''}
              ${isSelected && isBlocked ? 'bg-red-500 text-white' : ''}
            `}
            onClick={() => handleDateClick(day)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDateClick(day);
              }
            }}
          >
            {format(day, 'd')}
          </div>
        );
        currentDate = addDays(currentDate, 1);
      }
      rows.push(<div key={`week-${weekNumber}`} className="grid grid-cols-7 gap-1" role="row">{days}</div>);
      days = [];
    }
    return <div role="rowgroup">{rows}</div>;
  };

  const timeSelector = () => {
    if (!showTimeSelector || !selectedDate) return null;

    return React.createElement(
      'div',
      {
        className:
          'mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50 transition-all duration-300',
        style: { minHeight: '140px' },
        role: 'region',
        'aria-label': 'Time selection',
      },
      [
        React.createElement(
          'h3',
          { className: 'text-sm font-medium text-gray-700 mb-2', key: 'heading' },
          `Available Times for ${format(selectedDate, 'MMMM d')}`
        ),
        availableTimes.length > 0
          ? React.createElement(
              'div',
              { className: 'grid grid-cols-3 gap-2', key: 'times-grid' },
              availableTimes.map((time) =>
                React.createElement(
                  'button',
                  {
                    key: time,
                    className:
                      'text-sm px-2 py-2 bg-white border border-gray-200 rounded hover:bg-orange-50 hover:border-orange-200 transition',
                    onClick: () => handleTimeSelect(time),
                    'aria-label': `Select time: ${time}`,
                  },
                  time
                )
              )
            )
          : React.createElement(
              'p',
              { className: 'text-gray-400 text-sm italic', key: 'no-times' },
              'No available times for this selection.'
            ),
      ]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md" role="application" aria-label="Reservation calendar">
      {header()}
      <div role="grid" aria-labelledby="month-label">
        {daysOfWeek()}
        {daysOfMonth()}
      </div>
      {timeSelector()}
    </div>
  );
};

export default Calendar;