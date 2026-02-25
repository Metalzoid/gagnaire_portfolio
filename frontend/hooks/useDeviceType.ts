"use client";

import { useSyncExternalStore } from "react";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceTypeState {
  deviceType: DeviceType;
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  isDesktopDevice: boolean;
}

// --------------------------------------------------------------------------
// Détection (calculée une seule fois, valeur statique)
// --------------------------------------------------------------------------
function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;

  // Mobile UA patterns
  if (/iPhone|iPod|Android.*Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
    return "mobile";
  }

  // Tablet UA patterns
  if (/iPad|Android(?!.*Mobile)|tablet/i.test(ua)) {
    return "tablet";
  }

  // iPad iOS 13+ (UA reports "Macintosh" since iPadOS 13)
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
    return "tablet";
  }

  // Fallback: media queries
  if (window.matchMedia("(max-width: 768px)").matches) {
    return "mobile";
  }
  if (window.matchMedia("(max-width: 1024px)").matches) {
    return "tablet";
  }

  return "desktop";
}

// --------------------------------------------------------------------------
// Snapshot statique (le type d'appareil ne change pas)
// --------------------------------------------------------------------------
let clientSnapshot: DeviceTypeState | null = null;

function buildState(type: DeviceType): DeviceTypeState {
  return {
    deviceType: type,
    isMobileDevice: type === "mobile",
    isTabletDevice: type === "tablet",
    isDesktopDevice: type === "desktop",
  };
}

function getSnapshot(): DeviceTypeState {
  if (!clientSnapshot) {
    clientSnapshot = buildState(getDeviceType());
  }
  return clientSnapshot;
}

const SERVER_STATE: DeviceTypeState = buildState("desktop");

function getServerSnapshot(): DeviceTypeState {
  return SERVER_STATE;
}

// Pas de subscribe car la valeur est statique (le device type ne change pas)
function subscribe(): () => void {
  return () => {};
}

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------
export function useDeviceType(): DeviceTypeState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
