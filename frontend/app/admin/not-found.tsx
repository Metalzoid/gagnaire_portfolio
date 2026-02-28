"use client";

import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xl)",
        gap: "var(--spacing-md)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "var(--font-size-2xl)" }}>404 – Page introuvable</h1>
      <p>Cette page n&apos;existe pas dans l&apos;administration.</p>
      <Link href="/admin">Retour au tableau de bord</Link>
    </div>
  );
}
