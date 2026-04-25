import { useEffect, useState } from "react";
import type { AlertType } from "../components/Alert";
import type { ApiError, FieldErrors } from "../api/client";

type MessageState = {
  type: AlertType;
  text: string;
};

export function useMessage() {
  const [message, setMessage] = useState<MessageState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!message || message.type === "error") return;

    const delay = message.type === "success" ? 3000 : 4000;
    const timer = window.setTimeout(() => setMessage(null), delay);

    return () => window.clearTimeout(timer);
  }, [message]);

  const clearAllMessages = () => {
    setMessage(null);
    setFieldErrors({});
  };

  const clearFieldError = (field: string) => {
    setMessage((current) => (current?.type === "error" ? null : current));
    setFieldErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const showFieldError = (field: string, text: string) => {
    setFieldErrors({ [field]: text });
    setMessage({ type: "error", text });
  };

  const showSuccess = (text: string) => {
    setFieldErrors({});
    setMessage({ type: "success", text });
  };

  const showInfo = (text: string) => {
    setMessage({ type: "info", text });
  };

  const showWarning = (text: string) => {
    setMessage({ type: "warning", text });
  };

  const showApiError = (error: unknown, fallback: string) => {
    const apiError = error as Partial<ApiError>;
    const text =
      typeof apiError.message === "string" && apiError.message
        ? apiError.message
        : fallback;

    setFieldErrors(apiError.errors ?? {});
    setMessage({ type: "error", text });
  };

  return {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showFieldError,
    showSuccess,
    showInfo,
    showWarning,
    showApiError,
  };
}
