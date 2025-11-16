// Global test setup
beforeAll(() => {
  // Set timeout for all tests
  jest.setTimeout(10000);
});

// Global test teardown
afterAll(async () => {
  // Wait for any pending operations
  await new Promise(resolve => setTimeout(resolve, 500));
});