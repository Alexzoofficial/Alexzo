import { NextResponse } from 'next/server';
import { getUserIP } from '@/lib/ip-utils';

// In-memory store for rate limiting
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

export async function POST(req: Request) {
  try {
    const userIp = getUserIP(req);

    // Enforce rate limiting
    const now = Date.now();
    const record = ipRequestCounts.get(userIp) || { count: 0, timestamp: now };

    if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      record.count = 1;
      record.timestamp = now;
    } else {
      record.count++;
    }

    ipRequestCounts.set(userIp, record);

    if (record.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    const { query } = await req.json();

    if (!query) {
      return new NextResponse('Query is required', { status: 400 });
    }

    const searchUrl = `https://whoogle-bbso.onrender.com/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SEARCH_PROXY_ERROR] Upstream error: ${response.status} ${errorText}`);
      return new NextResponse(`Error from search provider: ${response.status}`, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('[SEARCH_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
