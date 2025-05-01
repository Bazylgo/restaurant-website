/**
 * Helper functions for mocking Google authentication in tests
 */

/**
 * Creates a mock for the Google Calendar client
 * @returns {Object} A mock Google Calendar client with stubbed methods
 */
export function mockGoogleCalendarClient() {
  return {
    events: {
      insert: jest.fn().mockResolvedValue({ data: { htmlLink: 'https://calendar.google.com/event/123' } }),
      list: jest.fn().mockResolvedValue({ data: { items: [] } }),
      delete: jest.fn().mockResolvedValue({ data: {} })
    }
  };
}

/**
 * Sets up test environment variables for Google authentication
 */
export function setupGoogleAuthEnvVars() {
  process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
  process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token';
  process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test-service@example.com';
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----';
}

/**
 * Cleans up test environment variables for Google authentication
 */
export function cleanupGoogleAuthEnvVars() {
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;
  delete process.env.GOOGLE_REFRESH_TOKEN;
  delete process.env.GOOGLE_CALENDAR_ID;
  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
}

/**
 * Simulates an invalid_grant OAuth error
 * @returns {Object} A mock response that rejects with an invalid_grant error
 */
export function simulateInvalidGrantError() {
  const error = new Error('invalid_grant');
  error.response = {
    data: {
      error: 'invalid_grant',
      error_description: 'Token has been expired or revoked'
    }
  };
  return {
    events: {
      insert: jest.fn().mockRejectedValue(error)
    }
  };
}

/**
 * Simulates a quota exceeded error
 * @returns {Object} A mock response that rejects with a quota exceeded error
 */
export function simulateQuotaExceededError() {
  const error = new Error('quotaExceeded');
  error.response = {
    data: {
      error: 'quotaExceeded',
      error_description: 'The request failed because quota was exceeded'
    }
  };
  return {
    events: {
      insert: jest.fn().mockRejectedValue(error)
    }
  };
}