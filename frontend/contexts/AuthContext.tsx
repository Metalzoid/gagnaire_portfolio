"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { adminApi, configureAdminApi } from "@/services/admin-api";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Erreur de restauration (ex: réseau) — permet de réessayer sans se reconnecter */
  refreshError: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retryRefresh: () => void;
}

// --------------------------------------------------------------------------
// Context
// --------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Convertit une durée JWT ("15m", "7d", "3600s") en millisecondes */
function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 14 * 60 * 1000; // fallback 14 min
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case "s":
      return num * 1_000;
    case "m":
      return num * 60_000;
    case "h":
      return num * 3_600_000;
    case "d":
      return num * 86_400_000;
    default:
      return 14 * 60_000;
  }
}

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshError, setRefreshError] = useState(false);

  const isAuthenticated = !!accessToken;

  // Refs pour le rafraîchissement proactif
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tryRefreshRef = useRef<(() => Promise<void>) | null>(null);

  /** Programme un rafraîchissement proactif 1 min avant expiration du token */
  const scheduleRefresh = useCallback((expiresIn: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const ms = parseExpiresIn(expiresIn);
    // Rafraîchir 1 minute avant expiration (ou à mi-vie si durée < 2 min)
    const delay = ms > 120_000 ? ms - 60_000 : ms / 2;
    refreshTimerRef.current = setTimeout(() => {
      tryRefreshRef.current?.();
    }, delay);
  }, []);

  const handleTokensRefreshed = useCallback(
    (access: string, expiresIn: string) => {
      setAccessToken(access);
      scheduleRefresh(expiresIn);
    },
    [scheduleRefresh],
  );

  const clearTokens = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setAccessToken(null);
  }, []);

  useEffect(() => {
    configureAdminApi({
      getToken: () => accessToken,
      onTokensRefreshed: handleTokensRefreshed,
      onLogout: clearTokens,
    });
  }, [accessToken, handleTokensRefreshed, clearTokens]);

  const tryRefresh = useCallback(async () => {
    setRefreshError(false);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiBase}/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        data?: { accessToken: string; expiresIn: string };
      } | null;

      if (!res.ok) {
        if (res.status === 401) {
          setRefreshError(false);
        } else {
          setRefreshError(true);
        }
        setIsLoading(false);
        return;
      }

      if (json?.success && json?.data) {
        setAccessToken(json.data.accessToken);
        scheduleRefresh(json.data.expiresIn);
      }
    } catch {
      setRefreshError(true);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleRefresh]);

  // Garder la ref à jour pour éviter les dépendances circulaires
  useEffect(() => {
    tryRefreshRef.current = tryRefresh;
  }, [tryRefresh]);

  const retryRefresh = useCallback(() => {
    setRefreshError(false);
    setIsLoading(true);
    tryRefresh();
  }, [tryRefresh]);

  useEffect(() => {
    tryRefresh();
  }, [tryRefresh]);

  // Nettoyage du timer au démontage
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await adminApi.auth.login(email, password);
      setAccessToken(data.accessToken);
      scheduleRefresh(data.expiresIn);
    },
    [scheduleRefresh],
  );

  const logout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    await adminApi.auth.logout();
    setAccessToken(null);
  }, []);

  const value: AuthContextValue = {
    accessToken,
    isAuthenticated,
    isLoading,
    refreshError,
    login,
    logout,
    retryRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
