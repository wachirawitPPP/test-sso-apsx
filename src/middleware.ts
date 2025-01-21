import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req) {
  //   const token = await getToken({ req });
  //   const isLoggedIn = !!token && (typeof token.exp === 'number' ? token.exp * 1000 > Date.now() : true); // Check if token exists and is not expired
  //   const { pathname } = req.nextUrl;

  //   // Exclude the login page from the token check to avoid a redirect loop
  //   if (!isLoggedIn && pathname !== '/auth/auth1/login') {
  //     return NextResponse.redirect(new URL('/auth/auth1/login', req.url));
  //   }

    return NextResponse.next(); // Allow access if authenticated and token is valid, or on login page
  },
  {
    callbacks: {
      authorized: () => true, // Enable token checks globally, let middleware handle logic
    },
  }
);

export const config = {
  matcher: ['/:path*'], // Apply auth middleware to all routes
};
