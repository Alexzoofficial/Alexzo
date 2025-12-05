import { POST } from './route';
import { seedFirestore, clearFirestore } from '../../../lib/firebase/test-utils';
import { NextRequest } from 'next/server';

// Set up the emulator environment
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_PRIVATE_KEY = 'test';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test';


// Mock NextRequest
const mockRequest = (headers: { [key: string]: string }, body: any): any => {
  return {
    headers: {
      get: (header: string) => headers[header],
    },
    json: async () => body,
  };
};

describe('POST /api/zyfoox (Integration)', () => {
  beforeAll(async () => {
    // Seed the database with a valid API key
    await seedFirestore({
      api_keys: [{ id: 'test_key', key: 'alexzo_validkey' }],
    });
  });

  afterAll(async () => {
    // Clear the database after all tests
    await clearFirestore();
  });

  it('should return 200 for a valid API key', async () => {
    const req = mockRequest({ authorization: 'Bearer alexzo_validkey' }, { prompt: 'a test prompt' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data[0].url).toContain('https://image.pollinations.ai/prompt/a%20test%20prompt');
  });

  it('should return 401 for an invalid API key', async () => {
    const req = mockRequest({ authorization: 'Bearer alexzo_invalidkey' }, { prompt: 'a test prompt' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if prompt is missing', async () => {
    const req = mockRequest({ authorization: 'Bearer alexzo_validkey' }, {});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
