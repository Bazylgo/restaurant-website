import { Pool } from 'pg';
import { NextResponse } from 'next/server';
import { createCalendarClient } from '@/services/google-auth.service';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(request) {
  const body = await request.json();

  const { name, email, phone, people, date, time, notes } = body;

  try {
    // 1. Save to database
    await pool.query(
      `INSERT INTO reservations (full_name, email, phone, party_size, date, time, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, email, phone, people, date, time, notes]
    );

    // 2. Add to Google Calendar using the refactored auth service
    const calendar = createCalendarClient();

    // Combine date and time into a single ISO format string
    const startDateTime = new Date(`${date}T${time}:00`); // Create a Date object
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Adding 1 hour

    const event = {
      summary: `Reservation for ${name}`,
      description: `Phone: ${phone}, Email: ${email}, People: ${people}\nNotes: ${notes}`,
      start: {
        dateTime: startDateTime.toISOString(), // ISO string format for Google Calendar
        timeZone: 'Europe/Warsaw',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Warsaw',
      },
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation Error:', error);

    // More detailed error handling
    let errorMessage = `Failed to save reservation: ${error.message}`;
    let statusCode = 500;

    if (error.message.includes('invalid_grant')) {
      errorMessage = 'Google Calendar authentication failed. Please contact the administrator.';
    } else if (!process.env.GOOGLE_CALENDAR_ID) {
      errorMessage = 'Missing Google Calendar configuration. Please contact the administrator.';
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}