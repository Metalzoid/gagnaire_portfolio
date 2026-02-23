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
      <div className="admin-ai-grid">
        {prompts.map((p) => (
          <div key={p.id} className="admin-ai-card">
            <div className="admin-ai-card__header">
              <h3 className="admin-ai-card__title">
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
            <p className="admin-ai-card__preview">
              {p.prompt}
            </p>
            <div className="admin-ai-card__meta">
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
          <div className="admin-ai-form">
            <div>
              <label htmlFor="ai-prompt" className="admin-ai-form__label">
                Prompt
              </label>
              <textarea
                id="ai-prompt"
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                rows={8}
                className="admin-ai-form__textarea"
              />
            </div>
            <div className="admin-ai-form__row">
              <div className="admin-ai-form__field">
                <label htmlFor="ai-temperature" className="admin-ai-form__label">
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
                  className="admin-ai-form__slider"
                />
              </div>
              <div className="admin-ai-form__field">
                <label htmlFor="ai-model" className="admin-ai-form__label">
                  Modèle
                </label>
                <select
                  id="ai-model"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  className="admin-ai-form__select"
                >
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                </select>
              </div>
            </div>
            <div className="admin-ai-form__actions">
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
