"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import type { AiPrompt } from "shared";

const TARGET_LABELS: Record<string, string> = {
  profile: "Profil",
  experience: "Expériences",
  projects: "Projets",
};

export default function AdminAiPage() {
  const toast = useToast();
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<AiPrompt | null>(null);

  // Form state
  const [formPrompt, setFormPrompt] = useState("");
  const [formTemperature, setFormTemperature] = useState(0.7);
  const [formModel, setFormModel] = useState("gpt-4o");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.ai
      .listPrompts()
      .then(setPrompts)
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminApi.ai
      .getStatus()
      .then((s) => {
        setAiEnabled(s.enabled);
        if (s.enabled) load();
        else setLoading(false);
      })
      .catch(() => {
        setAiEnabled(false);
        setLoading(false);
      });
  }, []);

  const openEdit = (prompt: AiPrompt) => {
    setEditing(prompt);
    setFormPrompt(prompt.prompt);
    setFormTemperature(prompt.temperature);
    setFormModel(prompt.model);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminApi.ai.updatePrompt(editing.target, {
        prompt: formPrompt,
        temperature: formTemperature,
        model: formModel,
      });
      toast.success("Prompt mis à jour");
      setEditing(null);
      load();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (aiEnabled === false)
    return (
      <div>
        <h1>Configuration IA</h1>
        <p>
          L&apos;IA n&apos;est pas activée. Configurez la variable d&apos;environnement{" "}
          <code>OPENAI_API_KEY</code> dans le backend pour activer cette fonctionnalité.
        </p>
      </div>
    );

  return (
    <div>
      <h1>Configuration IA</h1>
      <div
        style={{
          display: "grid",
          gap: "var(--spacing-lg)",
          marginTop: "var(--spacing-lg)",
        }}
      >
        {prompts.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid var(--color-border, #e2e8f0)",
              borderRadius: "var(--radius-md, 8px)",
              padding: "var(--spacing-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {TARGET_LABELS[p.target] ?? p.target}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEdit(p)}
                ariaLabel={`Modifier le prompt ${p.target}`}
              >
                Modifier
              </Button>
            </div>
            <p
              style={{
                color: "var(--color-text-muted, #64748b)",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
                maxHeight: "4.5em",
                overflow: "hidden",
              }}
            >
              {p.prompt}
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-lg)",
                marginTop: "var(--spacing-sm)",
                fontSize: "0.875rem",
                color: "var(--color-text-muted, #64748b)",
              }}
            >
              <span>Température : {p.temperature}</span>
              <span>Modèle : {p.model}</span>
            </div>
          </div>
        ))}
        {prompts.length === 0 && (
          <p>Aucun prompt configuré. Exécutez le seed backend.</p>
        )}
      </div>

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={`Modifier le prompt — ${editing ? (TARGET_LABELS[editing.target] ?? editing.target) : ""}`}
        size="lg"
      >
        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div>
              <label htmlFor="ai-prompt" style={{ display: "block", marginBottom: "var(--spacing-xs)", fontWeight: 500 }}>
                Prompt
              </label>
              <textarea
                id="ai-prompt"
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                rows={8}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm)",
                  borderRadius: "var(--border-radius)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "inherit",
                  fontSize: "var(--font-size-md)",
                  resize: "vertical",
                  color: "var(--color-text-primary)",
                  backgroundColor: "var(--color-bg-primary)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="ai-temperature" style={{ display: "block", marginBottom: "var(--spacing-xs)", fontWeight: 500 }}>
                  Température ({formTemperature})
                </label>
                <input
                  id="ai-temperature"
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={formTemperature}
                  onChange={(e) => setFormTemperature(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="ai-model" style={{ display: "block", marginBottom: "var(--spacing-xs)", fontWeight: 500 }}>
                  Modèle
                </label>
                <select
                  id="ai-model"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--border-radius)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-md)",
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-bg-primary)",
                  }}
                >
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
              <Button variant="outline" onClick={() => setEditing(null)} ariaLabel="Annuler">
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={saving || formPrompt.length < 10}
                ariaLabel="Enregistrer"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
