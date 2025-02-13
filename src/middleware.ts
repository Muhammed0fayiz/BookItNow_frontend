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
    "/about"
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
    "/chatsession"
  ];
  const authPath = "/";


  const isUserProtectedPath = (pathname: string) => {
    return userProtectedPaths.some(path => {

      if (pathname === path) return true;

      if (path === "/events" && 
          pathname.startsWith("/events/") &&
          pathname.split("/").length === 4) return true;
      return false;
    });
  };


  const isPerformerProtectedPath = (pathname: string) => {
    return performerProtectedPaths.some(path => {

      if (pathname === path) return true;

      if (path === "/event-management/eventupdate" && 
          pathname.startsWith("/event-management/eventupdate/")) return true;
      return false;
    });
  };


  const decodeToken = (token: string) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  };


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
    "/performer-dashboard",
    "/performer-profile",
    "/performer-eventhistory",
    "/chatsession",
    "/event-management",
    "/event-management/eventupdate",
    "/event-management/eventupdate/:id*",
    "/events",
    "/events/:performerid/:eventid*", 
    "/upcoming-events",
    "/chatsession",
    "/performer-slotmanagement",
    "/performer-upcomingevent",
    "/wallet-management",
    "/chat",
    "/event-history",
    "/favorite-events",
    "/user-wallet",
  ],
};