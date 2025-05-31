import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('user_token');
  const userRole = request.cookies.get('user_role')?.value;
  const departmentId = request.cookies.get('department_id')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/visitor'];
  const currentPath = request.nextUrl.pathname;

  // Allow access to public paths and API routes
  if (publicPaths.includes(currentPath) || currentPath.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle dashboard access
  if (currentPath === '/dashboard') {
    const type = request.nextUrl.searchParams.get('type');
    
    // Security can only access security dashboard
    if (userRole === 'security' && type !== 'security') {
      return NextResponse.redirect(new URL('/dashboard?type=security', request.url));
    }

    // Department users can only access their own dashboard
    if (userRole === 'department') {
      if (type !== 'employee' || !departmentId) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      const urlDepartmentId = request.nextUrl.searchParams.get('departmentId');
      if (urlDepartmentId !== departmentId) {
        return NextResponse.redirect(new URL(`/dashboard?type=employee&departmentId=${departmentId}`, request.url));
      }
    }
  }

  // Prevent access to old routes
  if (currentPath.startsWith('/department') || currentPath.startsWith('/security')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure paths that should be checked by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 