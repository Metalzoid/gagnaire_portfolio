"use client";

import {
  useId,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import styles from "./DatePicker.module.scss";

// --------------------------------------------------------------------------
// Constantes - Mois en français
// --------------------------------------------------------------------------
const MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const DAY_NAMES = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

const OFFSET = 8;
const PADDING = 8;

// --------------------------------------------------------------------------
// Helpers de parsing / formatage
// --------------------------------------------------------------------------
function parseMonth(value: string): { year: number; month: number } | null {
  if (!value || typeof value !== "string") return null;
  const m = value.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  if (month < 0 || month > 11 || Number.isNaN(year)) return null;
  return { year, month };
}

function parseDate(value: string): { year: number; month: number; day: number } | null {
  if (!value || typeof value !== "string") return null;
  const m = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  if (month < 0 || month > 11 || day < 1 || day > 31 || Number.isNaN(year)) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return { year, month, day };
}

function formatMonthDisplay(year: number, month: number): string {
  const name = MONTH_NAMES[month];
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${year}`;
}

function formatDateDisplay(year: number, month: number, day: number): string {
  return `${day} ${MONTH_NAMES[month]} ${year}`;
}

function toMonthString(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// --------------------------------------------------------------------------
// Positionnement du popover
// --------------------------------------------------------------------------
function computePopoverPosition(
  anchor: DOMRect,
  popoverWidth: number,
  popoverHeight: number
): { left: number; top: number } {
  const spaceBelow = window.innerHeight - anchor.bottom;
  const spaceAbove = anchor.top;

  if (spaceBelow >= popoverHeight + OFFSET) {
    return {
      left: anchor.left + anchor.width / 2 - popoverWidth / 2,
      top: anchor.bottom + OFFSET,
    };
  }
  if (spaceAbove >= popoverHeight + OFFSET) {
    return {
      left: anchor.left + anchor.width / 2 - popoverWidth / 2,
      top: anchor.top - popoverHeight - OFFSET,
    };
  }
  return {
    left: anchor.left + anchor.width / 2 - popoverWidth / 2,
    top: anchor.top,
  };
}

function clampToViewport(
  left: number,
  top: number,
  width: number,
  height: number
): { left: number; top: number } {
  let l = left;
  let t = top;
  if (l < PADDING) l = PADDING;
  if (l + width > window.innerWidth - PADDING) l = window.innerWidth - width - PADDING;
  if (t < PADDING) t = PADDING;
  if (t + height > window.innerHeight - PADDING) t = window.innerHeight - height - PADDING;
  return { left: l, top: t };
}

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
export interface DatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  mode: "month" | "date";
  required?: boolean;
  error?: string;
  placeholder?: string;
  ariaLabel?: string;
  allowEmpty?: boolean;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function DatePicker({
  label,
  name,
  value,
  onChange,
  mode,
  required = false,
  error = "",
  placeholder = "Sélectionner...",
  ariaLabel,
  allowEmpty = false,
}: DatePickerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const parsed = mode === "month" ? parseMonth(value) : parseDate(value);
    return parsed?.year ?? new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const parsed = mode === "month" ? parseMonth(value) : parseDate(value);
    return parsed?.month ?? new Date().getMonth();
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hasError = Boolean(error);

  // Synchroniser viewYear/viewMonth avec la valeur quand le popover s'ouvre
  useEffect(() => {
    if (open) {
      const parsed = mode === "month" ? parseMonth(value) : parseDate(value);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
  }, [open, value, mode]);

  const displayText = useCallback((): string => {
    if (!value) return placeholder;
    if (mode === "month") {
      const p = parseMonth(value);
      return p ? formatMonthDisplay(p.year, p.month) : value;
    }
    const p = parseDate(value);
    return p ? formatDateDisplay(p.year, p.month, p.day) : value;
  }, [value, mode, placeholder]);

  const handleTriggerClick = () => setOpen((o) => !o);

  const handleSelectMonth = (monthIndex: number) => {
    onChange(toMonthString(viewYear, monthIndex));
    setOpen(false);
  };

  const handleSelectDate = (day: number) => {
    onChange(toDateString(viewYear, viewMonth, day));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setOpen(false);
  };

  // Fermeture Escape en phase capture : ferme le DatePicker avant la modal parente
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleEscape, { capture: true });
    return () => document.removeEventListener("keydown", handleEscape, { capture: true });
  }, [open]);

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Position du popover
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popoverRef.current) return;
    const anchor = triggerRef.current.getBoundingClientRect();
    const popover = popoverRef.current.getBoundingClientRect();
    const pos = computePopoverPosition(anchor, popover.width, popover.height);
    const clamped = clampToViewport(pos.left, pos.top, popover.width, popover.height);
    popoverRef.current.style.left = `${clamped.left}px`;
    popoverRef.current.style.top = `${clamped.top}px`;
  }, [open, viewYear, viewMonth, mode]);

  // Générer la grille du calendrier pour le mode date
  const calendarDays = (() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = (first.getDay() + 6) % 7; // Lundi = 0
    const totalDays = last.getDate();
    const prevMonth = new Date(viewYear, viewMonth, 0);
    const prevMonthDays = prevMonth.getDate();

    const days: { day: number; isCurrentMonth: boolean; isOtherMonth: boolean }[] = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: prevMonthDays - startOffset + i + 1, isCurrentMonth: false, isOtherMonth: true });
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push({ day: d, isCurrentMonth: true, isOtherMonth: false });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false, isOtherMonth: true });
    }
    return days;
  })();

  const popoverContent = open && (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? `Sélectionner une date`}
      className={styles.popover}
      style={{ position: "fixed", left: 0, top: 0 }}
    >
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => {
            if (mode === "month") setViewYear((y) => y - 1);
            else if (viewMonth <= 0) {
              setViewMonth(11);
              setViewYear((y) => y - 1);
            } else setViewMonth((m) => m - 1);
          }}
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <span className={styles.navLabel}>
          {mode === "month" ? viewYear : `${MONTH_NAMES_SHORT[viewMonth]} ${viewYear}`}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => {
            if (mode === "month") setViewYear((y) => y + 1);
            else if (viewMonth >= 11) {
              setViewMonth(0);
              setViewYear((y) => y + 1);
            } else setViewMonth((m) => m + 1);
          }}
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      {mode === "month" ? (
        <div className={styles.monthGrid}>
          {MONTH_NAMES_SHORT.map((name, i) => {
            const selected = parseMonth(value)?.year === viewYear && parseMonth(value)?.month === i;
            return (
              <button
                key={name}
                type="button"
                className={`${styles.monthCell} ${selected ? styles.selected : ""}`}
                onClick={() => handleSelectMonth(i)}
              >
                {name}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className={styles.dayNames}>
            {DAY_NAMES.map((d) => (
              <span key={d} className={styles.dayName}>
                {d}
              </span>
            ))}
          </div>
          <div className={styles.dateGrid}>
            {calendarDays.map(({ day, isCurrentMonth }, idx) => {
              const selected =
                parseDate(value)?.year === viewYear &&
                parseDate(value)?.month === viewMonth &&
                parseDate(value)?.day === day &&
                isCurrentMonth;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.dateCell} ${selected ? styles.selected : ""} ${!isCurrentMonth ? styles.otherMonth : ""}`}
                  onClick={() => isCurrentMonth && handleSelectDate(day)}
                  disabled={!isCurrentMonth}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <div className={styles.triggerWrapper}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className={`${styles.trigger} ${hasError ? styles.error : ""}`}
          onClick={handleTriggerClick}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={ariaLabel ?? label}
        >
          {displayText()}
        </button>
        {allowEmpty && value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Effacer la date"
          >
            ×
          </button>
        )}
      </div>
      <input type="hidden" name={name} value={value} required={required && !allowEmpty} />
      {typeof document !== "undefined" && createPortal(popoverContent, document.body)}
      {error && (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
