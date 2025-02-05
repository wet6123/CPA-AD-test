// src/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  // const hostname = req.headers.get("host");

  // Admin 인증 체크
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // /admin/register와 /admin/login은 인증 체크에서 제외
    if (
      !req.nextUrl.pathname.startsWith("/admin/login") &&
      !req.nextUrl.pathname.startsWith("/admin/register")
    ) {
      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    return res;
  }

  // 도메인별 라우팅 처리
  const url = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // 개발 환경에서의 라우팅
    if (
      url.pathname.startsWith("/site-a") ||
      url.pathname.startsWith("/site-b")
    ) {
      return NextResponse.next();
    }
    // 기본값은 site-a로 리다이렉트
    return NextResponse.rewrite(new URL(`/site-a${url.pathname}`, req.url));
  }

  // 프로덕션 환경에서의 도메인별 라우팅
  // if (hostname === "site-a.com" || hostname === "www.site-a.com") {
  //   return NextResponse.rewrite(new URL(`/site-a${url.pathname}`, req.url));
  // }

  // if (hostname === "site-b.com" || hostname === "www.site-b.com") {
  //   return NextResponse.rewrite(new URL(`/site-b${url.pathname}`, req.url));
  // }
  if (
    url.pathname.startsWith("/site-a") ||
    url.pathname.startsWith("/site-b")
  ) {
    return NextResponse.next();
  }

  // 기본값은 site-a로 리다이렉트
  return NextResponse.rewrite(new URL(`/site-a${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    // admin 경로
    "/admin/:path*",
    // 정적 파일과 api 경로 제외한 모든 경로
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
