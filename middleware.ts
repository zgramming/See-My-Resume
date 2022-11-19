import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Users } from "./interface/main_interface";

import { keyCookieAuth } from "./utils/constant";

const excludePathCheckingToken = (path: string) => {
  return (
    path.startsWith("/login") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon")
  );
};

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const url = request.nextUrl.pathname;
  const accessToken = request.cookies.get(keyCookieAuth);

  /// Check apakah url sekarang termaksud kedalam url yang tidak diikut sertakan pengecekan token
  if (excludePathCheckingToken(url)) {
    return NextResponse.next();
  }

  if (!excludePathCheckingToken(url)) {
    if (accessToken == undefined) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      try {
        const user = JSON.parse(accessToken.value) as Users;
        if (!user.id) {
          throw new Error("Unauthorized");
        }
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(
          new URL("/login?error=unauthorized", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}
