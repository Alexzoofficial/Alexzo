import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock NextRequest
const mockRequest = (headers: any, body: any) => {
  return {
    headers: new Map(Object.entries(headers)),
    json: async () => body,
  } as unknown as NextRequest
}

describe('POST /api/zyfoox', () => {
  it('should return 200 for a valid request', async () => {
    const req = mockRequest({}, { prompt: 'test' })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('should return 400 if prompt is missing', async () => {
    const req = mockRequest({}, {})
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('should return 400 for invalid width', async () => {
    const req = mockRequest({}, { prompt: 'test', width: 100 })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('should return 400 for invalid height', async () => {
    const req = mockRequest({}, { prompt: 'test', height: 2000 })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('should return 400 for a long prompt', async () => {
    const longPrompt = 'a'.repeat(1001)
    const req = mockRequest({}, { prompt: longPrompt })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
