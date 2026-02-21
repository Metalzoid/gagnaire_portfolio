"use client";

import { useSyncExternalStore } from "react";

// Breakpoint constants (must match _variables.scss)
export const BREAKPOINTS = {
  "small-mobile": 375,
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export type Breakpoint =
  | "small-mobile"
  | "mobile"
  | "tablet"
  | "desktop"
  | "wide";

export interface BreakpointState {
  breakpoint: Breakpoint;
  isMobile: boolean; // <= 480px
  isTablet: boolean; // 481-768px
  isDesktop: boolean; // > 768px
  isLandscape: boolean; // orientation: landscape
}

const queries = {
  smallMobile: `(max-width: ${BREAKPOINTS["small-mobile"]}px)`,
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(max-width: ${BREAKPOINTS.desktop}px)`,
  landscape: `(orientation: landscape)`,
} as const;

function getBreakpointState(): BreakpointState {
  const isMobileMatch = window.matchMedia(queries.mobile).matches;
  const isTabletMatch = window.matchMedia(queries.tablet).matches;
  const isDesktopMatch = window.matchMedia(queries.desktop).matches;
  const isLandscape = window.matchMedia(queries.landscape).matches;
  const isSmallMobile = window.matchMedia(queries.smallMobile).matches;

  let breakpoint: Breakpoint;
  if (isSmallMobile) {
    breakpoint = "small-mobile";
  } else if (isMobileMatch) {
    breakpoint = "mobile";
  } else if (isTabletMatch) {
    breakpoint = "tablet";
  } else if (isDesktopMatch) {
    breakpoint = "desktop";
  } else {
    breakpoint = "wide";
  }

  return {
    breakpoint,
    isMobile: isMobileMatch, // <= 480px
    isTablet: isTabletMatch && !isMobileMatch, // 481-768px
    isDesktop: !isTabletMatch, // > 768px
    isLandscape,
  };
}

const SERVER_STATE: BreakpointState = {
  breakpoint: "desktop",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isLandscape: false,
};

// Cache to avoid creating new objects on every call if nothing changed
let cachedState: BreakpointState | null = null;

function getSnapshot(): BreakpointState {
  const next = getBreakpointState();
  if (
    cachedState &&
    cachedState.breakpoint === next.breakpoint &&
    cachedState.isMobile === next.isMobile &&
    cachedState.isTablet === next.isTablet &&
    cachedState.isDesktop === next.isDesktop &&
    cachedState.isLandscape === next.isLandscape
  ) {
    return cachedState;
  }
  cachedState = next;
  return next;
}

function subscribe(callback: () => void): () => void {
  const mediaQueryLists = Object.values(queries).map((q) =>
    window.matchMedia(q)
  );
  for (const mql of mediaQueryLists) {
    mql.addEventListener("change", callback);
  }
  return () => {
    for (const mql of mediaQueryLists) {
      mql.removeEventListener("change", callback);
    }
  };
}

function getServerSnapshot(): BreakpointState {
  return SERVER_STATE;
}

export function useBreakpoint(): BreakpointState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
