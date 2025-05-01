import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

/**
 * Creates a Google OAuth2 client using refresh token authentication
 * @returns {OAuth2Client} Authenticated Google OAuth2 client
 */
export function createOAuth2Client() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Missing Google OAuth credentials. Please check your environment variables.');
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return auth;
}

/**
 * Creates a Google client using service account authentication (alternative approach)
 * @returns {JWT} Authenticated Google JWT client
 */
export function createServiceAccountAuth() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('Missing Google service account credentials. Please check your environment variables.');
  }

  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

/**
 * Creates an authenticated Google Calendar client
 * @param {boolean} useServiceAccount Whether to use service account authentication instead of OAuth
 * @returns {calendar_v3.Calendar} Google Calendar client
 */
export function createCalendarClient(useServiceAccount = false) {
  let auth;

  try {
    auth = useServiceAccount
      ? createServiceAccountAuth()
      : createOAuth2Client();
  } catch (error) {
    throw new Error(`Failed to create Google authentication client: ${error.message}`);
  }

  return google.calendar({ version: 'v3', auth });
}