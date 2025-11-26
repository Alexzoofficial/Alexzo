import { POST } from './route.ts';
import { getAdminFirestore } from '../../../lib/firebase/admin.ts';

jest.mock('../../../lib/firebase/admin.ts');

const mockedGetAdminFirestore = getAdminFirestore as jest.Mock;

// Mock NextRequest
const mockRequest = (headers: { [key: string]: string }, body: any): any => {
  return {
    headers: {
      get: (header: string) => headers[header],
    },
    json: async () => body,
  };
};

// Test suite
describe('POST /api/zyfoox', () => {
  beforeEach(() => {
    mockedGetAdminFirestore.mockClear();
  });

  it('should return 401 if authorization header is missing', async () => {
    const req = mockRequest({}, { prompt: 'test' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 200 if authorization header is "bearer alexzo_" (lowercase)', async () => {
    mockedGetAdminFirestore.mockReturnValue({
      collection: () => ({
        where: () => ({
          limit: () => ({
            get: () => Promise.resolve({ empty: false }),
          }),
        }),
      }),
    });
    const req = mockRequest({ authorization: 'bearer alexzo_123' }, { prompt: 'test' });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('should return 200 if authorization header is "Bearer alexzo_" (mixed case)', async () => {
    mockedGetAdminFirestore.mockReturnValue({
      collection: () => ({
        where: () => ({
          limit: () => ({
            get: () => Promise.resolve({ empty: false }),
          }),
        }),
      }),
    });
    const req = mockRequest({ authorization: 'Bearer alexzo_123' }, { prompt: 'test' });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('should return 401 for a validly prefixed but invalid API key', async () => {
    mockedGetAdminFirestore.mockReturnValue({
      collection: () => ({
        where: () => ({
          limit: () => ({
            get: () => Promise.resolve({ empty: true }),
          }),
        }),
      }),
    });
    const req = mockRequest({ authorization: 'Bearer alexzo_invalid' }, { prompt: 'test' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
