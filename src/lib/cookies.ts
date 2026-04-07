import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const USER_COOKIE = 'user_data';

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  userData: object
): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });
  
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });
  
  response.cookies.set(USER_COOKIE, JSON.stringify(userData), {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });
  
  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  response.cookies.delete(USER_COOKIE);
  return response;
}

export function getAccessToken(request: NextRequest): string | null {
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || null;
}

export function getRefreshToken(request: NextRequest): string | null {
  return request.cookies.get(REFRESH_TOKEN_COOKIE)?.value || null;
}

export function getUserFromCookies(request: NextRequest) {
  const userCookie = request.cookies.get(USER_COOKIE)?.value;
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };
