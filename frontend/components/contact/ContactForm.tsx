"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./ContactForm.module.scss";

interface FormState {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.honeypot) {
        return;
      }

      if (!validate()) return;

      setStatus("loading");

      const mailto = `mailto:gagnaire.flo@gmail.com?subject=Contact portfolio - ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
        `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      )}`;

      window.location.href = mailto;

      setTimeout(() => {
        setStatus("success");
        setFormData({ name: "", email: "", message: "", honeypot: "" });
        setErrors({});
      }, 500);
    },
    [formData, validate],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  if (status === "success") {
    return (
      <div className={styles.success}>
        <p>
          Votre message a été préparé. Votre client de messagerie va
          s&apos;ouvrir.
        </p>
        <p className={styles.successNote}>
          Si rien ne s&apos;est passé, contactez-moi directement à{" "}
          <a href="mailto:gagnaire.flo@gmail.com">gagnaire.flo@gmail.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        type="text"
        label="Nom"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        type="textarea"
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
      />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="honeypot">Ne pas remplir</label>
        <input
          id="honeypot"
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={status === "loading"}
        disabled={status === "loading"}
        ariaLabel="Envoyer le message"
      >
        Envoyer
      </Button>
    </form>
  );
}
