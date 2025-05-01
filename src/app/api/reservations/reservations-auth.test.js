import { POST } from '@/app/api/reservations/route';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Mock modules
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] })
  };
  return { Pool: jest.fn(() => mockPool) };
});

jest.mock('googleapis', () => {
  const mockCalendar = {
    events: {
      insert: jest.fn()
    }
  };

  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockReturnValue({
          setCredentials: jest.fn()
        }),
        JWT: jest.fn().mockReturnValue({})
      },
      calendar: jest.fn().mockReturnValue(mockCalendar)
    }
  };
});

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn()
  }
}));

describe('Reservation API Authentication Tests', () => {
  const mockRequest = {
    json: jest.fn().mockResolvedValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      people: 2,
      date: '2025-05-15',
      time: '18:00',
      notes: 'No allergies'
    })
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token';
    process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
    process.env.POSTGRES_URL = 'postgres://testuser:testpass@localhost/testdb';
  });

  test('should correctly set up OAuth credentials', async () => {
    // Mock successful calendar insertion
    google.calendar().events.insert.mockResolvedValueOnce({});

    await POST(mockRequest);

    // Check that OAuth was initialized with correct parameters
    expect(google.auth.OAuth2).toHaveBeenCalledWith(
      'test-client-id',
      'test-client-secret'
    );

    // Check that correct credentials were set
    const mockOAuth2Client = google.auth.OAuth2.mock.results[0].value;
    expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
      refresh_token: 'test-refresh-token'
    });

    // Check that calendar was created with the auth object
    expect(google.calendar).toHaveBeenCalledWith({
      version: 'v3',
      auth: mockOAuth2Client
    });
  });

  test('should handle invalid_grant OAuth error', async () => {
    // Mock OAuth error
    const invalidGrantError = new Error('invalid_grant');
    google.calendar().events.insert.mockRejectedValueOnce(invalidGrantError);

    await POST(mockRequest);

    // Verify error is caught and returned properly
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: expect.stringContaining('invalid_grant') },
      { status: 500 }
    );
  });

  test('should handle missing OAuth credentials', async () => {
    // Remove OAuth environment variables
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REFRESH_TOKEN;

    await POST(mockRequest);

    // Should return an error response
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: expect.stringMatching(/Failed to save reservation/) },
      { status: 500 }
    );
  });
});