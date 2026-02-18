import fs from "fs/promises";
import path from "path";
import { loadEnv } from "../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/** Chemin vers le template (backend/templates/ depuis la cwd du process). */
const TEMPLATE_PATH = path.join(process.cwd(), "templates", "contact-notification.html");

let templateCache: string | null = null;

export interface ContactNotificationParams {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadTemplate(): Promise<string> {
  if (templateCache) return templateCache;
  templateCache = await fs.readFile(TEMPLATE_PATH, "utf-8");
  return templateCache;
}

function buildContactNotificationHtml(
  template: string,
  params: ContactNotificationParams,
  adminContactsUrl: string,
): string {
  const name = escapeHtml(params.name);
  const email = escapeHtml(params.email);
  const message = escapeHtml(params.message).replace(/\n/g, "<br>");
  const mailtoLink = `mailto:${params.email}?subject=Re: Contact portfolio`;
  const adminLink =
    adminContactsUrl &&
    `<a href="${escapeHtml(adminContactsUrl)}" style="display: inline-block; padding: 12px 20px; margin-left: 8px; background-color: #3f3f46; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px;">Voir les demandes de contact</a>`;
  return template
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{email\}\}/g, email)
    .replace(/\{\{message\}\}/g, message)
    .replace(/\{\{mailtoLink\}\}/g, escapeHtml(mailtoLink))
    .replace(/\{\{adminContactsLink\}\}/g, adminLink ?? "");
}

/**
 * Envoie une notification email via Brevo (HTML généré côté backend).
 * En cas d'échec, log l'erreur et ne propage pas (l'utilisateur a déjà été répondu succès).
 */
export async function sendContactNotification(
  params: ContactNotificationParams,
): Promise<void> {
  const env = loadEnv();
  const apiKey = env.BREVO_API_KEY;
  const senderEmail = env.BREVO_SENDER_EMAIL;
  const senderName = env.BREVO_SENDER_NAME;
  const toEmail = env.CONTACT_NOTIFY_EMAIL ?? env.ADMIN_EMAIL;

  if (!apiKey || !senderEmail || !senderName || !toEmail) {
    console.warn(
      "[Brevo] Configuration incomplète (BREVO_*, CONTACT_NOTIFY_EMAIL). Notification contact non envoyée.",
    );
    return;
  }

  const subject = `Portfolio – Nouvelle demande de contact de ${params.name}`;
  const siteUrl = env.SITE_URL?.replace(/\/$/, "") ?? "";
  const adminContactsUrl = siteUrl ? `${siteUrl}/admin/contacts` : "";
  const template = await loadTemplate();
  const htmlContent = buildContactNotificationHtml(
    template,
    params,
    adminContactsUrl,
  );

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(
        "[Brevo] Erreur envoi email contact:",
        res.status,
        res.statusText,
        body,
      );
      return;
    }
  } catch (err) {
    console.error("[Brevo] Erreur réseau envoi email contact:", err);
  }
}
