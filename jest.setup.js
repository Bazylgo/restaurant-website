// Global Jest setup file

// Mock fetch globally
global.fetch = jest.fn();

// This ensures environment variables are available in tests
process.env = {
  ...process.env,
  // Default test environment variables
  POSTGRES_URL: 'postgres://testuser:testpass@localhost/testdb',
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
};

// Setup console spies for error tracking in tests
global.consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
global.consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

// Clean up after all tests
afterAll(() => {
  global.consoleErrorSpy.mockRestore();
  global.consoleWarnSpy.mockRestore();
});