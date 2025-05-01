# Google Calendar Authentication Testing Guide

This guide explains how to implement and run the authentication tests for your reservation system's Google Calendar integration.

## Overview

The test suite includes:

1. **Unit tests** for Google authentication service
2. **Isolated tests** for the reservation API route
3. **Integration tests** to verify the entire flow
4. **Mock helpers** to simulate different auth scenarios

## Installation Steps

### 1. Install Required Dependencies

```bash
npm install --save-dev jest babel-jest @babel/preset-env node-mocks-http
```

### 2. Set Up Project Structure

Create the following folders (if they don't already exist):

```
src/
├── app/
│   └── api/
│       └── reservations/
│           └── route.js  # Your existing route file
├── services/
│   └── google-auth.service.js  # New service file
└── tests/
    └── auth-mock-helper.js  # Testing helpers
```

### 3. Copy Test Files

Place the provided test files in your project:

- `jest.config.js` → Root directory
- `jest.setup.js` → Root directory
- `reservations-auth.test.js` → `src/app/api/reservations/`
- `google-auth.service.test.js` → `src/services/`
- `integration-test.js` → `src/tests/`
- `auth-mock-helper.js` → `src/tests/`

### 4. Update Your Route

Replace your current `route.js` with the updated version that uses the authentication service.

### 5. Configure Babel

Create or update `.babelrc` in your root directory:

```json
{
  "presets": ["@babel/preset-env"]
}
```

### 6. Update package.json

Add the following to your `package.json` scripts section:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Running Tests

To run all tests:

```bash
npm test
```

To run specific tests:

```bash
npm test -- google-auth.service
```

To watch for changes and run tests automatically:

```bash
npm run test:watch
```

## Test Environment Variables

For local testing, create a `.env.test` file in your root directory with the following variables:

```
POSTGRES_URL=postgres://testuser:testpass@localhost/testdb
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
GOOGLE_REFRESH_TOKEN=test-refresh-token
GOOGLE_CALENDAR_ID=test-calendar-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=test-service@example.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----"
```

## Debugging Authentication Issues

If you're still seeing the `invalid_grant` error in production:

1. Generate a new refresh token from Google Cloud Console
2. Update your environment variables with the new token
3. Consider switching to service account authentication by setting `useServiceAccount` to `true` in `createCalendarClient()`

## CI/CD Integration

If you're using GitHub Actions or another CI system, add the following to your workflow:

```yaml
- name: Run tests
  run: npm test
  env:
    GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
    GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
    GOOGLE_REFRESH_TOKEN: ${{ secrets.GOOGLE_REFRESH_TOKEN }}
    GOOGLE_CALENDAR_ID: ${{ secrets.GOOGLE_CALENDAR_ID }}
```