"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import "@/styles/admin/admin-globals.scss";
import styles from "@/styles/admin/admin-layout.module.scss";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, refreshError, retryRefresh } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoading) return;
    if (isLoginPage) return;
    if (refreshError) return; // Ne pas rediriger si on peut réessayer
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminRedirectAfterLogin", pathname);
      }
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, refreshError, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    );
  }

  // Token en localStorage mais refresh échoué (réseau, 5xx) → proposer de réessayer
  if (refreshError) {
    return (
      <div className={styles.loading}>
        <p>Impossible de restaurer la session.</p>
        <button
          type="button"
          onClick={retryRefresh}
          style={{
            marginTop: "var(--spacing-md)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminGuard>{children}</AdminGuard>
      </ToastProvider>
    </AuthProvider>
  );
}
