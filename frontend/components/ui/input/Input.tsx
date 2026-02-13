"use client";

import { useId } from "react";
import styles from "./Input.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface InputProps {
  type?: "text" | "email" | "textarea";
  label: string;
  error?: string;
  required?: boolean;
  name: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Input = ({
  type = "text",
  label,
  error,
  required = false,
  name,
  value,
  onChange,
}: InputProps) => {
  const inputId = useId();
  const errorId = useId();
  const hasError = Boolean(error);

  const inputClasses = [styles.input, hasError ? styles["input--error"] : ""]
    .filter(Boolean)
    .join(" ");

  const commonProps = {
    id: inputId,
    name,
    value,
    onChange,
    required,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? errorId : undefined,
  };

  if (type === "textarea") {
    const textareaClasses = [inputClasses, styles["input--textarea"]].join(" ");
    return (
      <div className={styles.wrapper}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        <textarea {...commonProps} className={textareaClasses} rows={4} />
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <input {...commonProps} type={type} className={inputClasses} />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
