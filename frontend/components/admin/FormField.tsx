"use client";

import { useId } from "react";
import styles from "./FormField.module.scss";

type FormFieldType = "text" | "email" | "password" | "number" | "textarea" | "url";

interface FormFieldProps {
  type?: FormFieldType;
  label: string;
  name: string;
  value?: string | number | string[];
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  checked?: boolean;
}

export function FormField({
  type = "text",
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  min,
  max,
  options,
  checked,
}: FormFieldProps) {
  const id = useId();
  const hasError = Boolean(error);

  if (type === "textarea") {
    return (
      <div className={styles.wrapper}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
        <textarea
          id={id}
          name={name}
          value={Array.isArray(value) ? value.join(", ") : value}
          onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
          required={required}
          placeholder={placeholder}
          className={`${styles.input} ${hasError ? styles.error : ""}`}
          aria-invalid={hasError}
        />
        {error && <p className={styles.errorText} role="alert">{error}</p>}
      </div>
    );
  }

  if (options) {
    return (
      <div className={styles.wrapper}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
        <select
          id={id}
          name={name}
          value={Array.isArray(value) ? value[0] : value}
          onChange={onChange}
          required={required}
          className={`${styles.input} ${hasError ? styles.error : ""}`}
        >
          <option value="">Sélectionner...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.errorText} role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={Array.isArray(value) ? "" : value}
        checked={checked}
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`${styles.input} ${hasError ? styles.error : ""}`}
        aria-invalid={hasError}
      />
      {error && <p className={styles.errorText} role="alert">{error}</p>}
    </div>
  );
}
