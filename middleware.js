import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host') || '';

  // Only handle admin subdomain
  if (!hostname.startsWith('admin.')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Pass through Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.[a-z0-9]+$/i.test(pathname)   // e.g. .json, .png, .js, .css
  ) {
    return NextResponse.next();
  }

  // Already at an /admin path — pass through
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Public routes — redirect to the www domain so they always render correctly
  if (
    pathname.startsWith('/blog') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/taxi') ||
    pathname.startsWith('/contact') ||
    pathname === '/'
  ) {
    const wwwUrl = request.nextUrl.clone();
    wwwUrl.hostname = 'www.privateluxurytransportationantigua.com';
    return NextResponse.redirect(wwwUrl, { status: 302 });
  }

  // Rewrite the root and any sub-paths to their /admin equivalent
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/admin' : `/admin${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
