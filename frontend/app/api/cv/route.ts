import { NextResponse } from "next/server";
import { API_BASE_SERVER } from "@/services/api-config";

/**
 * Proxy du CV avec nom de fichier personnalisé.
 * GET /api/cv → télécharge le CV avec le nom "CV-Prenom-Nom.pdf"
 */
export async function GET() {
  try {
    const profileRes = await fetch(`${API_BASE_SERVER}/api/v1/profile`);
    if (!profileRes.ok) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 },
      );
    }

    const json = (await profileRes.json()) as {
      success: boolean;
      data: { cv: string; firstName: string; lastName: string };
    };
    const profile = json.data;

    if (!profile.cv || !profile.cv.startsWith("/uploads/cv/")) {
      return NextResponse.json({ error: "Aucun CV disponible" }, { status: 404 });
    }

    const cvRes = await fetch(`${API_BASE_SERVER}${profile.cv}`);
    if (!cvRes.ok) {
      return NextResponse.json(
        { error: "Fichier CV introuvable" },
        { status: 404 },
      );
    }

    const blob = await cvRes.blob();
    const lastName = (profile.lastName || "CV").trim();
    const firstName = (profile.firstName || "").trim();
    const baseName =
      firstName && lastName
        ? `CV-${firstName}-${lastName}`
        : lastName
          ? `CV-${lastName}`
          : "CV";
    const filename = `${baseName.replace(/\s+/g, "-")}.pdf`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[API /api/cv]", err);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 },
    );
  }
}
