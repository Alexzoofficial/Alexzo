import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map()), // Return an empty Map for headers
}))

jest.mock('@/lib/db', () => ({
  getDb: jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{
      id: 'test-id',
      name: 'Test Key',
      key: 'test-key',
      created: new Date(),
      lastUsed: null,
      userId: null,
    }]),
  })),
}));

// Mock NextRequest and other dependencies
jest.mock('@/lib/firebase/admin', () => ({
  getAdminFirestore: () => ({
    collection: () => ({
      add: jest.fn().mockResolvedValue({ id: 'test-id' }),
    }),
  }),
  getAdminAuth: () => ({
    verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
  }),
}))

const mockRequest = (headers: any, body: any) => {
  return {
    headers: new Map(Object.entries(headers)),
    json: async () => body,
  } as unknown as NextRequest
}

describe('POST /api/api-keys', () => {
  it('should allow an unauthenticated user to create an API key', async () => {
    // No Authorization header
    const req = mockRequest({}, { name: 'Test Key' })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.userId).toBeNull()
    expect(body.name).toBe('Test Key')
  })
})
