import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const MAIN_PAGE = "/";
const LOGIN_PAGE = "/login";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isLoggedIn = Boolean(token);

    if (isLoggedIn && pathname === LOGIN_PAGE) {
        return NextResponse.redirect(new URL(MAIN_PAGE, request.url));
    }

    if (!isLoggedIn && pathname !== LOGIN_PAGE) {
        return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
    ],
};