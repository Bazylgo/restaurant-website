import { createCalendarClient } from '@/services/google-auth.service';
import { mockGoogleCalendarClient, setupGoogleAuthEnvVars, cleanupGoogleAuthEnvVars, simulateInvalidGrantError } from '@/tests/auth-mock-helper';

// Mock the Google Auth service module
jest.mock('@/services/google-auth.service');

// Mock the pg module
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] })
  };
  return { Pool: jest.fn(() => mockPool) };
});

// Create a test server using Next.js API route handler
import { createRequest, createResponse } from 'node-mocks-http';
import { POST } from '@/app/api/reservations/route';

describe('Reservation API Integration Tests', () => {
  let mockCalendar;
  let req;
  let res;

  const testReservation = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123456789',
    people: 2,
    date: '2025-05-15',
    time: '18:00',
    notes: 'No allergies'
  };

  beforeAll(() => {
    setupGoogleAuthEnvVars();
  });

  afterAll(() => {
    cleanupGoogleAuthEnvVars();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCalendar = mockGoogleCalendarClient();
    createCalendarClient.mockReturnValue(mockCalendar);

    // Create mock request with JSON data
    req = createRequest({
      method: 'POST',
      body: testReservation,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Create a mock JSON function for the request
    req.json = jest.fn().mockResolvedValue(testReservation);

    // Create mock response
    res = createResponse();
  });

  test('successfully creates a reservation and adds to calendar', async () => {
    const response = await POST(req);
    const data = await response.json();

    expect(createCalendarClient).toHaveBeenCalled();
    expect(mockCalendar.events.insert).toHaveBeenCalledWith({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: expect.objectContaining({
        summary: `Reservation for ${testReservation.name}`,
        description: expect.stringContaining(testReservation.email),
      }),
    });

    expect(data).toEqual({ success: true });
  });

  test('handles Google Calendar authentication failure', async () => {
    // Simulate invalid_grant error
    createCalendarClient.mockReturnValue(simulateInvalidGrantError());

    const response = await POST(req);
    const data = await response.json();

    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Google Calendar authentication failed');
  });

  test('handles missing Google Calendar ID', async () => {
    // Temporarily remove the Calendar ID
    const originalCalendarId = process.env.GOOGLE_CALENDAR_ID;
    delete process.env.GOOGLE_CALENDAR_ID;

    const response = await POST(req);
    const data = await response.json();

    expect(data).toHaveProperty('error');

    // Restore the Calendar ID
    process.env.GOOGLE_CALENDAR_ID = originalCalendarId;
  });
});