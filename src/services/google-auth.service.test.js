import { createOAuth2Client, createServiceAccountAuth, createCalendarClient } from './google-auth.service';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

jest.mock('googleapis', () => {
  const mockCalendar = jest.fn();
  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockReturnValue({
          setCredentials: jest.fn()
        })
      },
      calendar: mockCalendar
    }
  };
});

jest.mock('google-auth-library', () => {
  return {
    JWT: jest.fn()
  };
});

describe('Google Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment variables
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test-service@example.com';
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  });

  test('createOAuth2Client should initialize with correct credentials', () => {
    const auth = createOAuth2Client();

    expect(google.auth.OAuth2).toHaveBeenCalledWith(
      'test-client-id',
      'test-client-secret'
    );

    expect(auth.setCredentials).toHaveBeenCalledWith({
      refresh_token: 'test-refresh-token',
    });
  });

  test('createOAuth2Client should throw error when environment variables are missing', () => {
    delete process.env.GOOGLE_CLIENT_ID;

    expect(() => createOAuth2Client()).toThrow('Missing Google OAuth credentials');
  });

  test('createServiceAccountAuth should initialize with correct credentials', () => {
    createServiceAccountAuth();

    expect(JWT).toHaveBeenCalledWith({
      email: 'test-service@example.com',
      key: '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  });

  test('createServiceAccountAuth should throw error when environment variables are missing', () => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    expect(() => createServiceAccountAuth()).toThrow('Missing Google service account credentials');
  });

  test('createCalendarClient should use OAuth client by default', () => {
    createCalendarClient();

    expect(google.auth.OAuth2).toHaveBeenCalled();
    expect(JWT).not.toHaveBeenCalled();
    expect(google.calendar).toHaveBeenCalledWith({
      version: 'v3',
      auth: expect.any(Object)
    });
  });

  test('createCalendarClient should use service account when requested', () => {
    createCalendarClient(true);

    expect(google.auth.OAuth2).not.toHaveBeenCalled();
    expect(JWT).toHaveBeenCalled();
    expect(google.calendar).toHaveBeenCalledWith({
      version: 'v3',
      auth: expect.any(Object)
    });
  });

  test('createCalendarClient should handle authentication errors', () => {
    google.auth.OAuth2.mockImplementationOnce(() => {
      throw new Error('Authentication failed');
    });

    expect(() => createCalendarClient()).toThrow('Failed to create Google authentication client');
  });
});