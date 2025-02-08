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
    "/eventupdate",
    "/chatsession",
    "/performer-slotmanagement",
    "/performer-upcomingevent",
    "/wallet-management",
    "/performer-eventhistory",
    "/chatsession"
  ];
  const authPath = "/";

  // Function to decode the token
  const decodeToken = (token: string) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  };

  // If the user has a token
  if (token) {
    try {
      // Decode token to get user details (role, id)
      const user = decodeToken(token);
      console.log(user, "user is");

      // Fetch user data to verify block status
      const response = await axiosInstance.get(`/getUser/${user.id}`, {
        withCredentials: true,
      });
      const userData = response.data.response;

      if (user.role === "user") {
        // For users, check isblocked
        if (userData.isblocked) {
          const redirectResponse = NextResponse.redirect(
            new URL(authPath, req.url)
          );
          req.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.delete(cookie.name);
          });
          return redirectResponse;
        }

        if (!userProtectedPaths.includes(req.nextUrl.pathname)) {

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

        if (!performerProtectedPaths.includes(req.nextUrl.pathname)) {
       
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
      userProtectedPaths.includes(req.nextUrl.pathname) ||
      performerProtectedPaths.includes(req.nextUrl.pathname)
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
    "/eventupdate",
    "/events",
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
