import { API_BASE_CLIENT, API_PREFIX } from "./api-config";

export interface SubmitContactData {
  name: string;
  email: string;
  message: string;
}

/**
 * Envoie une demande de contact (route publique, sans auth).
 */
export async function submitContact(
  data: SubmitContactData,
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE_CLIENT}${API_PREFIX}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de l'envoi du message");
  }

  const json = (await res.json()) as { success: boolean; data: { id: string } };
  if (!json.success || !json.data) {
    throw new Error("Réponse invalide");
  }
  return json.data;
}
