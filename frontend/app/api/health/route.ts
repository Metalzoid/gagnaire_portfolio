import { NextResponse } from "next/server";

/**
 * Route de healthcheck pour le frontend
 * Utilisée par Docker et Coolify pour vérifier que le serveur Next.js est prêt
 */
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
