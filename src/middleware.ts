import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Paths that require auth
  const isAdminPath = path.startsWith('/admin-portal-x9k2') && path !== '/admin-portal-x9k2/login';
  const isApiMutation = path.startsWith('/api/products') && ['POST', 'PUT', 'DELETE'].includes(req.method);

  if (!isAdminPath && !isApiMutation) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get('petrolia_admin_session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  if (!session?.authenticated) {
    if (isApiMutation) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Redirect to login page
    return NextResponse.redirect(new URL('/admin-portal-x9k2/login', req.url));
  }

  return NextResponse.next();
}

// Ensure middleware runs only on relevant paths
export const config = {
  matcher: [
    '/admin-portal-x9k2/:path*',
    '/api/products/:path*',
  ],
};
