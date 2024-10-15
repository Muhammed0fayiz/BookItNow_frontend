// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string; // Ensure to set your secret in .env

export async function middleware(req: NextRequest) {
  // Check for the token in cookies or headers
  const cookie = req.cookies.get('userToken');
  const token = cookie ? cookie.value : req.headers.get('authorization')?.split(' ')[1];

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if no token
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secretKey);

    // Attach user data to the request object
    // Using a custom property on the request object (this might require a type definition)
    (req as any).user = decoded; // Type assertion to avoid TypeScript error

    // Proceed to the next middleware or request handler
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);

    // Redirect to the login page if the token is invalid
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configure the middleware to match specific routes
export const config = {
  matcher: ['/protected/*'], // Specify the routes to protect
};
