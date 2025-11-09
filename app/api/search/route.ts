import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
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
