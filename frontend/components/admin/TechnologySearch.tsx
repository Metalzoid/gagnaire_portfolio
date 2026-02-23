"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { TechnologySearchCreateForm } from "./TechnologySearchCreateForm";
import type { Technology } from "shared";
import styles from "./TechnologySearch.module.scss";

const DEBOUNCE_MS = 300;

interface TechnologySearchProps {
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function TechnologySearch({
  value,
  onChange,
  label = "Technologies",
  placeholder = "Rechercher ou ajouter une technologie",
}: TechnologySearchProps) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value.length === 0) {
      setSelectedTechs([]);
      return;
    }
    adminApi.technologies.search("").then((all) => {
      const selected = value
        .map((id) => all.find((t) => t.id === id))
        .filter((t): t is Technology => Boolean(t));
      setSelectedTechs(selected);
    });
  }, [value]);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      const all = await adminApi.technologies.search("");
      setResults(all);
      return;
    }
    setLoading(true);
    try {
      const techs = await adminApi.technologies.search(query);
      setResults(techs);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (input.trim() === "") {
      search("");
      return;
    }
    debounceRef.current = setTimeout(() => search(input), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, search]);

  const handleSelect = useCallback((tech: Technology) => {
    if (!value.includes(tech.id)) {
      onChange([...value, tech.id]);
      setSelectedTechs((prev) =>
        prev.some((t) => t.id === tech.id) ? prev : [...prev, tech],
      );
    }
    setInput("");
    setShowDropdown(false);
  }, [value, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(value.filter((x) => x !== id));
    setSelectedTechs((prev) => prev.filter((t) => t.id !== id));
  }, [value, onChange]);

  const openCreateForm = () => {
    setShowCreateForm(true);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = useMemo(
    () => results.filter((r) => !value.includes(r.id)),
    [results, value],
  );
  const hasExactMatch = filteredResults.some(
    (r) => r.name.toLowerCase() === input.trim().toLowerCase(),
  );
  const canCreate = input.trim() && !hasExactMatch;

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() =>
            (input.trim() || results.length > 0) && setShowDropdown(true)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (canCreate) openCreateForm();
              else if (filteredResults[0]) handleSelect(filteredResults[0]);
            }
          }}
          placeholder={placeholder}
          className={styles.input}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="tech-results"
          aria-label={placeholder}
        />
      </div>

      {showDropdown && (filteredResults.length > 0 || canCreate) && (
        <div id="tech-results" className={styles.dropdown} role="listbox">
          {loading ? (
            <div className={styles.dropdownItem}>Recherche...</div>
          ) : (
            <>
              {filteredResults.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(tech)}
                  role="option"
                  aria-selected={false}
                >
                  <span className={styles.techName}>{tech.name}</span>
                  {tech.category && (
                    <span className={styles.techCategory}>{tech.category}</span>
                  )}
                </button>
              ))}
              {canCreate && (
                <button
                  type="button"
                  className={styles.createButton}
                  onClick={openCreateForm}
                  aria-label={`Créer la technologie ${input.trim()}`}
                >
                  Créer « {input.trim()} »
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showCreateForm && (
        <TechnologySearchCreateForm
          initialName={input.trim()}
          onCreated={(tech) => {
            handleSelect(tech);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {selectedTechs.length > 0 && (
        <div className={styles.tags}>
          {selectedTechs.map((tech) => (
            <span key={tech.id} className={styles.tag}>
              {tech.name}
              <button
                type="button"
                onClick={() => handleRemove(tech.id)}
                aria-label={`Retirer ${tech.name}`}
                className={styles.tagRemove}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
