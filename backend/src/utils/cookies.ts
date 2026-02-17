/**
 * Helpers pour les cookies httpOnly (refresh token)
 */
export const REFRESH_COOKIE = "refresh_token";
const MAX_AGE_DAYS = 7;

function getCookieOptions(): { httpOnly: boolean; secure: boolean; sameSite: "strict" | "lax"; path: string; maxAge: number } {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/v1/auth",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
  };
}

export function setRefreshCookie(res: { cookie: (name: string, value: string, opts: object) => void }, token: string): void {
  res.cookie(REFRESH_COOKIE, token, getCookieOptions());
}

export function clearRefreshCookie(res: { clearCookie: (name: string, opts: object) => void }): void {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
}
