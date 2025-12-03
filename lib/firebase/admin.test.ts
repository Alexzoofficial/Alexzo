// Mock Firebase Admin SDK modules
const mockInitializeApp = jest.fn();
const mockCert = jest.fn();
const mockGetApps = jest.fn(() => []);
const mockGetFirestore = jest.fn();
const mockGetAuth = jest.fn();

jest.mock('firebase-admin/app', () => ({
  initializeApp: (...args) => mockInitializeApp(...args),
  cert: (...args) => mockCert(...args),
  getApps: (...args) => mockGetApps(...args),
}));

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: (...args) => mockGetFirestore(...args),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: (...args) => mockGetAuth(...args),
}));

describe('Firebase Admin SDK Initialization', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Reset modules to clear cached adminApp instance
    jest.resetModules();
    // Backup original environment variables
    originalEnv = { ...process.env };
    // Mock console.warn to keep test output clean and check if it's called
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    // Clear mock history
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
    // Restore mocks
    jest.restoreAllMocks();
  });

  it('should throw an error from getAdminFirestore when credentials are not configured', () => {
    // Ensure the emulator is not considered for this test
    delete process.env.FIRESTORE_EMULATOR_HOST;
    // Ensure environment variables that might configure Firebase are unset
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Dynamically import the module *after* resetting modules and setting the environment
    const { getAdminFirestore } = require('./admin');

    // Expect the function to throw an error because no credentials are provided
    expect(() => getAdminFirestore()).toThrow('Firebase Admin SDK not initialized. Firestore cannot be accessed.');

    // Verify that the appropriate warnings were logged
    expect(console.warn).toHaveBeenCalledWith('Firebase admin credentials not configured. Server-side operations will be disabled.');
    expect(console.warn).toHaveBeenCalledWith('- NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing.');
    expect(console.warn).toHaveBeenCalledWith('- FIREBASE_CLIENT_EMAIL is missing.');
    expect(console.warn).toHaveBeenCalledWith('- FIREBASE_PRIVATE_KEY is missing.');
    expect(console.warn).toHaveBeenCalledWith('See ENVIRONMENT_SETUP.md for instructions.');
  });

  it('should throw an error from getAdminAuth when credentials are not configured', () => {
    // Ensure the emulator is not considered for this test
    delete process.env.FIRESTORE_EMULATOR_HOST;
    // Ensure environment variables are unset for this test case
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const { getAdminAuth } = require('./admin');

    // Expect the function to throw an error because no credentials are provided
    expect(() => getAdminAuth()).toThrow('Firebase Admin SDK not initialized. Auth cannot be accessed.');

    // Verify that the appropriate warnings were logged
    expect(console.warn).toHaveBeenCalledWith('Firebase admin credentials not configured. Server-side operations will be disabled.');
    expect(console.warn).toHaveBeenCalledWith('- NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing.');
    expect(console.warn).toHaveBeenCalledWith('- FIREBASE_CLIENT_EMAIL is missing.');
    expect(console.warn).toHaveBeenCalledWith('- FIREBASE_PRIVATE_KEY is missing.');
    expect(console.warn).toHaveBeenCalledWith('See ENVIRONMENT_SETUP.md for instructions.');
  });

  it('should initialize and return Firestore and Auth instances when credentials are provided', () => {
    // Ensure the emulator is not considered for this test
    delete process.env.FIRESTORE_EMULATOR_HOST;
    // Set mock credentials in environment variables
    process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
    process.env.FIREBASE_CLIENT_EMAIL = 'test-client-email@example.com';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';

    // Configure mock return values
    const mockApp = { name: 'mock-app' };
    const mockFirestore = { collection: jest.fn() };
    const mockAuth = { verifyIdToken: jest.fn() };

    mockInitializeApp.mockReturnValue(mockApp);
    mockGetFirestore.mockReturnValue(mockFirestore);
    mockGetAuth.mockReturnValue(mockAuth);
    mockCert.mockReturnValue({}); // cert returns a credential object

    // Dynamically import the module to use the mocks
    const { getAdminFirestore, getAdminAuth } = require('./admin');

    // Call the functions
    const firestore = getAdminFirestore();
    const auth = getAdminAuth();

    // Assertions
    expect(firestore).toBe(mockFirestore);
    expect(auth).toBe(mockAuth);

    expect(mockGetApps).toHaveBeenCalled();

    expect(mockCert).toHaveBeenCalledWith({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    });

    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential: {},
      databaseURL: `https://test-project-id-default-rtdb.firebaseio.com`,
    });

    expect(mockGetFirestore).toHaveBeenCalledWith(mockApp);
    expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
  });
});
