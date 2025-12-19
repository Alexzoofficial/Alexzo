// Mock Firebase Admin SDK at the very top
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
  add: jest.fn(() => Promise.resolve({ id: 'new-key-id' }))
};

jest.mock('@/lib/firebase/admin', () => ({
  getAdminAuth: jest.fn(() => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-user-id', name: 'Test User' })),
  })),
  getAdminFirestore: jest.fn(() => mockFirestore),
}));

import { POST as createKeyHandler } from '@/app/api/api-keys/route'
import { POST as useKeyHandler } from '@/app/api/zyfoox/route'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));


const mockDecodedToken = { uid: 'test-user-id', name: 'Test User' }

describe('API Key Lifecycle Integration Test', () => {

  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();

    // Mock getAdminAuth to return a mock auth instance for each test
    const { getAdminAuth } = require('@/lib/firebase/admin');
    (getAdminAuth as jest.Mock).mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue(mockDecodedToken),
    });
  });

  it('should create an API key, then use it successfully, and fail with an invalid key', async () => {
    // 1. Setup: Mock the headers for an authenticated user
    const mockIdToken = 'mock-id-token'
    ;(headers as jest.Mock).mockReturnValue(new Headers({
      Authorization: `Bearer ${mockIdToken}`,
    }))

    // 2. Create the API Key
    const createRequest = new NextRequest('http://localhost/api/api-keys', {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${mockIdToken}` }),
      body: JSON.stringify({ name: 'Test Key for Lifecycle' }),
    })

    const createResponse = await createKeyHandler(createRequest)
    const createBody = await createResponse.json()

    // Assert key creation was successful
    expect(createResponse.status).toBe(201)
    expect(createBody).toHaveProperty('key')
    expect(createBody.key).toContain('alexzo_')
    const newApiKey = createBody.key

    // 3. Verify the key was stored in Firestore (mocked interaction)
    expect(mockFirestore.collection).toHaveBeenCalledWith('api_keys');
    expect(mockFirestore.add).toHaveBeenCalledWith(expect.objectContaining({
        key: newApiKey,
        userId: mockDecodedToken.uid,
    }));

    // 4. Use the newly created key successfully
    // Mock the Firestore `get` call to simulate the key existing
    const mockKeySnapshot = {
        empty: false,
        docs: [{ data: () => ({ userId: mockDecodedToken.uid }) }]
    };
    (mockFirestore.get as jest.Mock).mockResolvedValue(mockKeySnapshot);

    const useRequest = new NextRequest('http://localhost/api/zyfoox', {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${newApiKey}` }),
      body: JSON.stringify({ prompt: 'a test prompt' }),
    })

    const useResponse = await useKeyHandler(useRequest)
    const useBody = await useResponse.json()

    // Assert the API call was successful
    expect(mockFirestore.where).toHaveBeenCalledWith('key', '==', newApiKey);
    expect(useResponse.status).toBe(200)
    if (!useBody.data[0] || !useBody.data[0].url) {
      throw new Error('The response body did not contain the expected URL.');
    }

    // 5. Attempt to use an invalid key and expect failure
    // Mock the Firestore `get` call to simulate the key NOT existing
    (mockFirestore.get as jest.Mock).mockResolvedValue({ empty: true, docs: [] });

    const invalidUseRequest = new NextRequest('http://localhost/api/zyfoox', {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer alexzo_invalidkey12345` }),
        body: JSON.stringify({ prompt: 'a test prompt' }),
    })

    const invalidUseResponse = await useKeyHandler(invalidUseRequest)
    const invalidUseBody = await invalidUseResponse.json()

    // Assert the API call failed as expected
    expect(invalidUseResponse.status).toBe(401)
    expect(invalidUseBody.error).toBe('Invalid API key. Key not found.')
  })
})
