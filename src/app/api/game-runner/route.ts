import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  // SSRF Protection: Validate URL scheme and origin against allowed storage domains
  try {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const isAllowedHost =
      parsedUrl.hostname.endsWith('.supabase.co') ||
      parsedUrl.hostname === 'fuzion-academy.vercel.app' ||
      parsedUrl.hostname === 'localhost';

    if (!isHttps && parsedUrl.hostname !== 'localhost') {
      return new NextResponse('Only secure HTTPS URLs are allowed', { status: 403 });
    }

    if (!isAllowedHost) {
      return new NextResponse('Forbidden: Target domain is not an authorized cloud storage origin', {
        status: 403,
      });
    }
  } catch (err) {
    return new NextResponse('Invalid URL format', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch game file (HTTP ${response.status})`, {
        status: response.status,
      });
    }

    const htmlContent = await response.text();

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('Game Runner fetch error:', error);
    return new NextResponse(`Error loading HTML game: ${error.message}`, { status: 500 });
  }
}
