"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminApiError } from "@/services/admin-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./login.module.scss";

const REDIRECT_STORAGE_KEY = "adminRedirectAfterLogin";

/** Vérifie que l’URL de redirection est une route admin valide (évite open redirect). */
function getSafeRedirect(redirect: string | null): string {
  if (!redirect || typeof redirect !== "string") return "/admin";
  const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
  if (!path.startsWith("/admin") || path === "/admin/login") return "/admin";
  return path;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const redirect =
        typeof window !== "undefined"
          ? sessionStorage.getItem(REDIRECT_STORAGE_KEY)
          : null;
      const target = getSafeRedirect(redirect);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      }
      router.replace(target);
    } catch (err) {
      setError(
        err instanceof AdminApiError
          ? err.message
          : "Identifiants invalides. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Connexion Admin</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            label="Email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Mot de passe"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <Button type="submit" loading={loading} ariaLabel="Se connecter">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
