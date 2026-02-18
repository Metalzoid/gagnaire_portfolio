"use client";

import { BlobProvider } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";
import type { CVData } from "./types";

interface CVPreviewProps {
  data: CVData;
  photoUrl: string;
  onGenerateAndSave?: (blob: Blob) => void;
  isSaving?: boolean;
  onManualUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  currentCvUrl?: string;
  /** Formulaire d'édition des textes (affiché au-dessus des actions) */
  editForm?: React.ReactNode;
  /** Objet de classes CSS (ex: import CSS module) */
  styles: Record<string, string>;
}

export function CVPreview({
  data,
  photoUrl,
  onGenerateAndSave,
  isSaving = false,
  onManualUpload,
  isUploading = false,
  currentCvUrl,
  editForm,
  styles: s,
}: CVPreviewProps) {
  return (
    <BlobProvider document={<CVDocument data={data} photoUrl={photoUrl} />}>
      {({ blob, url, loading, error }) => (
        <div className={s.wrapper}>
          <div className={s.previewColumn}>
            <div className={s.previewWrapper}>
              {loading && <p className={s.previewLoading}>Génération du CV…</p>}
              {error && (
                <p className={s.previewError} role="alert">
                  Erreur lors du rendu : {String(error)}
                </p>
              )}
              {url && !error && (
                <iframe
                  src={url}
                  title="Aperçu du CV"
                  className={s.previewIframe}
                />
              )}
            </div>
          </div>
          <div className={s.actionsColumn}>
            {editForm && (
              <div className={s.actionsSection}>
                {editForm}
              </div>
            )}
            <div className={s.actionsSection}>
              <h3 className={s.actionsTitle}>Actions</h3>
              <button
                type="button"
                className={s.generateBtn}
                onClick={() => blob && onGenerateAndSave?.(blob)}
                disabled={isSaving || !blob}
                aria-label="Générer et sauvegarder le CV"
              >
                {isSaving ? "Enregistrement…" : "Générer et sauvegarder le CV"}
              </button>
            </div>

            {onManualUpload && (
              <div className={s.actionsSection}>
                <h3 className={s.actionsTitle}>Upload manuel</h3>
                <label className={s.uploadZone}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onManualUpload}
                    disabled={isUploading}
                    aria-label="Choisir un fichier PDF"
                  />
                  <span>{isUploading ? "Envoi…" : "Choisir un PDF"}</span>
                </label>
              </div>
            )}

            {currentCvUrl && (
              <div className={s.actionsSection}>
                <h3 className={s.actionsTitle}>CV actuel</h3>
                <a
                  href={currentCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.cvLink}
                >
                  Télécharger le CV actuel
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </BlobProvider>
  );
}
