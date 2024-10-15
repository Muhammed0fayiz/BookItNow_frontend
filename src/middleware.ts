
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axiosInstance from './shared/axiousintance';

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('userToken');
    const token = tokenCookie ? tokenCookie.value : null;
    const userProtectedPaths = ['/profile', '/home'];
    const performerProtectedPaths = ['/performer-dashboard', '/performer-events'];
    const authPath = '/auth';

    // Function to decode the token
    const decodeToken = (token: string) => {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    };

    // If the user has a token
    if (token) {
        try {
            // Decode token to get user details (role, id)
            const user = decodeToken(token);

            // Fetch user data to verify block status
            const response = await axiosInstance.get(`/getUser/${user.id}`);
            const userData = response.data.response;

            if (user.role === 'user') {
                // For users, check isblocked
                if (userData.isblocked) {
                    const redirectResponse = NextResponse.redirect(new URL(authPath, req.url));
                    req.cookies.getAll().forEach((cookie) => {
                        redirectResponse.cookies.delete(cookie.name);
                    });
                    return redirectResponse;
                }

                if (!userProtectedPaths.includes(req.nextUrl.pathname)) {
                    // If user is not on a user-protected path, redirect to home
                    return NextResponse.redirect(new URL('/home', req.url));
                }
            } else if (user.role === 'performer') {
                // For performers, check isPerformerBlocked
                if (userData.isPerformerBlocked) {
                    const redirectResponse = NextResponse.redirect(new URL(authPath, req.url));
                    req.cookies.getAll().forEach((cookie) => {
                        redirectResponse.cookies.delete(cookie.name);
                    });
                    return redirectResponse;
                }

                if (!performerProtectedPaths.includes(req.nextUrl.pathname)) {
                    // If performer is not on a performer-protected path, redirect to dashboard
                    return NextResponse.redirect(new URL('/performer-dashboard', req.url));
                }
            } else {
                // Unknown role, redirect to auth
                return NextResponse.redirect(new URL(authPath, req.url));
            }
        } catch (error) {
            console.error('Error verifying token or fetching user:', error);
            // On error, redirect to /auth
            return NextResponse.redirect(new URL(authPath, req.url));
        }
    } else {
        // No token, check if trying to access protected paths
        if (userProtectedPaths.includes(req.nextUrl.pathname) || performerProtectedPaths.includes(req.nextUrl.pathname)) {
            // Redirect to /auth
            return NextResponse.redirect(new URL(authPath, req.url));
        }
    }

    // Proceed to the next middleware or route
    return NextResponse.next();
}

export const config = {
    matcher: ['/profile', '/home', '/auth', '/performer-dashboard', '/performer-events'],
};