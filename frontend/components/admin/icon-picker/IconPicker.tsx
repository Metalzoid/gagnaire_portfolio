"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import type { IconEntry, IconSet } from "./iconRegistry";
import { searchIcons, loadAllIcons, getIconByName } from "./iconRegistry";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./IconPicker.module.scss";

const SET_LABELS: Record<IconSet, string> = {
  si: "Simple Icons",
  fa: "Font Awesome",
  md: "Material",
  fi: "Feather",
};

const DEBOUNCE_MS = 300;

interface IconPickerProps {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export function IconPicker({
  label = "Icône",
  value,
  onChange,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [setFilter, setSetFilter] = useState<IconSet | undefined>(undefined);
  const [icons, setIcons] = useState<IconEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const [preloaded, setPreloaded] = useState(false);
  const selectedEntry = useMemo(() => {
    if (!value) return null;
    const fromGrid = icons.find((e) => e.name === value);
    if (fromGrid) return fromGrid;
    return getIconByName(value);
    // preloaded : nécessaire pour rafraîchir quand le registre d'icônes est chargé
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, icons, preloaded]);

  useEffect(() => {
    if (value && !preloaded) {
      loadAllIcons().then(() => setPreloaded(true));
    }
  }, [value, preloaded]);

  const loadIcons = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchIcons(debouncedQuery, setFilter);
      setIcons(results);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, setFilter]);

  useEffect(() => {
    if (open) {
      loadIcons();
    }
  }, [open, loadIcons]);

  const handleSelect = useCallback(
    (entry: IconEntry) => {
      onChange(entry.name);
      setOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor="icon-picker-trigger">
          {label}
        </label>
      )}
      <div className={styles.triggerWrapper}>
        <button
          id="icon-picker-trigger"
          type="button"
          className={styles.trigger}
          onClick={() => setOpen(true)}
          aria-label={
            value ? `Icône sélectionnée : ${value}` : "Choisir une icône"
          }
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {value ? (
            <>
              <span className={styles.selectedPreview}>
                {selectedEntry ? (
                  <selectedEntry.component size={20} aria-hidden />
                ) : (
                  <span aria-hidden>{value}</span>
                )}
              </span>
              <span className={styles.selectedName}>{value}</span>
            </>
          ) : (
            <span className={styles.selectedName}>Choisir une icône…</span>
          )}
        </button>
        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Effacer la sélection"
          >
            ×
          </button>
        )}
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Sélecteur d'icônes"
            onClick={handleBackdropClick}
          >
            <div
              className={styles.dialog}
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              <div className={styles.dialogHeader}>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Rechercher (ex: react, docker…)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  autoComplete="off"
                />
              </div>
              <div className={styles.setTabs}>
                <button
                  type="button"
                  className={`${styles.setTab} ${!setFilter ? styles.active : ""}`}
                  onClick={() => setSetFilter(undefined)}
                >
                  Tous
                </button>
                {(["si", "fa", "md", "fi"] as const).map((set) => (
                  <button
                    key={set}
                    type="button"
                    className={`${styles.setTab} ${setFilter === set ? styles.active : ""}`}
                    onClick={() => setSetFilter(set)}
                  >
                    {SET_LABELS[set]}
                  </button>
                ))}
              </div>
              <div className={styles.gridWrap}>
                {loading ? (
                  <p className={styles.loading}>Chargement…</p>
                ) : icons.length === 0 ? (
                  <p className={styles.empty}>
                    {debouncedQuery
                      ? `Aucune icône trouvée pour "${debouncedQuery}"`
                      : "Aucune icône disponible"}
                  </p>
                ) : (
                  <div className={styles.grid} role="list">
                    {icons.map((entry) => {
                      const IconComp = entry.component;
                      return (
                        <button
                          key={`${entry.set}-${entry.name}`}
                          type="button"
                          className={styles.iconCell}
                          onClick={() => handleSelect(entry)}
                          title={entry.name}
                          aria-label={`Sélectionner ${entry.name}`}
                          role="listitem"
                        >
                          <IconComp size={24} aria-hidden />
                          <span className={styles.iconName}>{entry.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
