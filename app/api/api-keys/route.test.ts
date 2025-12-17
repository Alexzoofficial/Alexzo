import { POST } from './route';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase/admin';

// Mock the dependencies
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

jest.mock('@/lib/firebase/admin', () => ({
  getAdminAuth: jest.fn(),
  getAdminFirestore: jest.fn(),
}));

const mockRequest = (headers: any, body: any) => {
  return {
    headers: new Map(Object.entries(headers)),
    json: async () => body,
  } as unknown as NextRequest;
};

describe('POST /api/api-keys', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow an authenticated user to create an API key', async () => {
    // Mock successful authentication
    const mockDecodedToken = { uid: 'test-user-id', name: 'Test User' };
    (getAdminAuth as jest.Mock).mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue(mockDecodedToken),
    });

    // Mock Firestore
    const mockAdd = jest.fn().mockResolvedValue({ id: 'new-key-id' });
    (getAdminFirestore as jest.Mock).mockReturnValue({
      collection: () => ({
        add: mockAdd,
      }),
    });

    // Mock headers
    (headers as jest.mock.Mock).mockResolvedValue(new Map([
      ['Authorization', 'Bearer valid-token'],
    ]));

    const req = mockRequest({}, { name: 'My Test Key' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.name).toBe('My Test Key');
    expect(body.key).toBeDefined();
    expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'test-user-id',
      userName: 'Test User',
      name: 'My Test Key',
    }));
  });

  it('should return 401 Unauthorized for an unauthenticated user', async () => {
    // Mock failed authentication
    (getAdminAuth as jest.Mock).mockReturnValue({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    });

    // Mock headers to simulate no user being logged in
    (headers as jest.mock.Mock).mockResolvedValue(new Map());

    const req = mockRequest({}, { name: 'Unauthorized Key' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('should return 503 if the database is not configured', async () => {
    // Mock successful authentication
    const mockDecodedToken = { uid: 'test-user-id', name: 'Test User' };
    (getAdminAuth as jest.Mock).mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue(mockDecodedToken),
    });

    // Mock a failed Firestore initialization
    (getAdminFirestore as jest.Mock).mockImplementation(() => {
      throw new Error('Firebase admin credentials not configured');
    });

    (headers as jest.mock.Mock).mockResolvedValue(new Map([
        ['Authorization', 'Bearer valid-token'],
    ]));

    const req = mockRequest({}, { name: 'Test Key' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error).toContain('Database service is not configured');
  });
});
