import { POST } from './route';
import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';

jest.mock('@/lib/firebase/admin', () => ({
  getAdminFirestore: jest.fn(),
}));

describe('POST /api/custom-apis', () => {
  it('should return 400 if userEmail is missing', async () => {
    const dbMock = {
      collection: jest.fn().mockReturnThis(),
      add: jest.fn().mockResolvedValue({ id: 'test-id' }),
    };
    (getAdminFirestore as jest.Mock).mockReturnValue(dbMock);

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test API', userName: 'Test User' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
