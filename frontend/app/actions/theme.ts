"use server";

import { cookies } from "next/headers";

const THEME_COOKIE_NAME = "theme-color-mode@";

export type Theme = "dark" | "light";

export async function setThemeCookie(theme: Theme): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 2, // 2 jours
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getThemeCookie(): Promise<Theme | undefined> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE_NAME)?.value;
  if (value === "dark" || value === "light") return value;
  return undefined;
}
