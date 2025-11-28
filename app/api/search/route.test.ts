import { POST } from './route';
import { NextRequest } from 'next/server';

describe('POST /api/search', () => {
  it('should return 400 if query is not a string', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ query: 123 }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
