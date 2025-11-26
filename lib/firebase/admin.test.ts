describe('Firebase Admin SDK Initialization', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Reset modules to clear cached adminApp instance
    jest.resetModules();
    // Backup original environment variables
    originalEnv = { ...process.env };
    // Mock console.warn to keep test output clean and check if it's called
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
    // Restore mocks
    jest.restoreAllMocks();
  });

  it('should return null from getAdminFirestore when credentials are not configured', () => {
    // Ensure environment variables that might configure Firebase are unset
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Dynamically import the module *after* resetting modules and setting the environment
    const { getAdminFirestore } = require('./admin');

    // Call the function and expect it to return null because no credentials are provided
    const firestore = getAdminFirestore();
    expect(firestore).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('Firebase admin credentials not configured, server-side operations may be limited');
  });

  it('should return null from getAdminAuth when credentials are not configured', () => {
    // Ensure environment variables are unset for this test case
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const { getAdminAuth } = require('./admin');
    const auth = getAdminAuth();
    expect(auth).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('Firebase admin credentials not configured, server-side operations may be limited');
  });
});
