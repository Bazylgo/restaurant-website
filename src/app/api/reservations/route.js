import { Pool } from 'pg';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

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

    // 2. Add to Google Calendar
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth });

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
    return NextResponse.json({ error: `Failed to save reservation: ${error.message}` }, { status: 500 });
  }
}