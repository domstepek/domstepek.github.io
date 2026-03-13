import { type NextRequest, NextResponse } from 'next/server';

/**
 * proxy.ts — Next.js 16 Node.js runtime proxy (replaces middleware.ts).
 *
 * Observability-only: adds `x-gate-status: locked|authenticated` header to all
 * /domains/* requests. Does NOT redirect or enforce auth — enforcement lives in
 * app/domains/[slug]/page.tsx via `await cookies()`.
 *
 * D040: proxy.ts / Node.js runtime is the Next.js 16 convention.
 * D043: proxy-level observability only, no enforcement here.
 */
export function proxy(request: NextRequest) {
  const cookie = request.cookies.get('portfolio-gate');
  const response = NextResponse.next();
  response.headers.set('x-gate-status', cookie ? 'authenticated' : 'locked');
  return response;
}

export const config = {
  matcher: ['/domains/:path*'],
};
