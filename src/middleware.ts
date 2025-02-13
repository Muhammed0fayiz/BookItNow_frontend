import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axiosInstance from "./shared/axiousintance";

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("userToken");
  const token = tokenCookie ? tokenCookie.value : null;
  const userProtectedPaths = [
    "/profile",
    "/home",
    "/events",
    "/upcoming-events",
    "/chat",
    "/event-history",
    "/favorite-events",
    "/user-wallet",
    "/about",
    "/events/paymenterror",
    "/events/paymentsuccess"
  ];
  const performerProtectedPaths = [
    "/performer-dashboard",
    "/performer-profile",
    "/event-management",
    "/event-management/eventupdate",
    "/chatsession",
    "/performer-slotmanagement",
    "/performer-upcomingevent",
    "/wallet-management",
    "/performer-eventhistory",
    "/chatsession",
 
  ];
  const authPath = "/";

  // Function to check if the current path matches any protected user path
  const isUserProtectedPath = (pathname: string) => {
    return userProtectedPaths.some(path => {
      // Check for exact match
      if (pathname === path) return true;
      // Check for dynamic events route match
      if (path === "/events" && 
          pathname.startsWith("/events/") &&
          pathname.split("/").length === 4 && 
          // Exclude payment routes
          pathname !== "/events/paymenterror" &&
          pathname !== "/events/success") return true;
      return false;
    });
  };

  // Function to check if the current path matches any protected performer path
  const isPerformerProtectedPath = (pathname: string) => {
    return performerProtectedPaths.some(path => {
      // Check for exact match
      if (pathname === path) return true;
      // Check for dynamic route match
      if (path === "/event-management/eventupdate" && 
          pathname.startsWith("/event-management/eventupdate/")) return true;
      return false;
    });
  };

  // Function to decode the token
  const decodeToken = (token: string) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  };

  // If the user has a token
  if (token) {
    try {
      const user = decodeToken(token);
      
      const response = await axiosInstance.get(`/getUser/${user.id}`, {
        withCredentials: true,
      });
      const userData = response.data.response;

      if (user.role === "user") {
        if (userData.isblocked) {
          const redirectResponse = NextResponse.redirect(
            new URL(authPath, req.url)
          );
          req.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.delete(cookie.name);
          });
          return redirectResponse;
        }

        if (!isUserProtectedPath(req.nextUrl.pathname)) {
          return NextResponse.redirect(new URL("/home", req.url));
        }
      } else if (user.role === "performer") {
        if (userData.isPerformerBlocked) {
          const redirectResponse = NextResponse.redirect(
            new URL(authPath, req.url)
          );
          req.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.delete(cookie.name);
          });
          return redirectResponse;
        }

        if (!isPerformerProtectedPath(req.nextUrl.pathname)) {
          return NextResponse.redirect(
            new URL("/performer-dashboard", req.url)
          );
        }
      } else {
        return NextResponse.redirect(new URL(authPath, req.url));
      }
    } catch (error) {
      console.error("Error verifying token or fetching user:", error);
      return NextResponse.redirect(new URL(authPath, req.url));
    }
  } else {
    if (
      isUserProtectedPath(req.nextUrl.pathname) ||
      isPerformerProtectedPath(req.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL(authPath, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/home",
    "/",
    "/about",
    "/chat",
    "/event-history",
    "/favorite-events",
    "/user-wallet",
    "/events",
    "/events/:performerid/:eventid*",
    "/events/paymenterror",
    "/events/paymentsuccess",
    "/upcoming-events",


    "/performer-dashboard",
    "/performer-profile",
    "/performer-eventhistory",
    "/chatsession",
    "/event-management",
    "/event-management/eventupdate",
    "/event-management/eventupdate/:id*",

    "/performer-slotmanagement",
    "/performer-upcomingevent",
    "/wallet-management",
   
  ],
};