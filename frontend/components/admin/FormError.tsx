"use client";

interface FormErrorProps {
  error: string;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <p className="admin-form-error" role="alert">
      {error}
    </p>
  );
}
