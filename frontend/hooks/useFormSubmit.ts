import { useState, useCallback } from "react";

interface UseFormSubmitOptions {
  validate?: () => string | null;
}

export function useFormSubmit(options: UseFormSubmitOptions = {}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (submitFn: () => Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (options.validate) {
          const validationError = options.validate();
          if (validationError) {
            setError(validationError);
            return;
          }
        }

        setError("");
        setLoading(true);
        try {
          await submitFn();
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors de l'enregistrement",
          );
        } finally {
          setLoading(false);
        }
      },
    [options],
  );

  return { error, setError, loading, handleSubmit };
}
