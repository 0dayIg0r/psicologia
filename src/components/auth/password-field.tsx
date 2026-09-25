"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PasswordField({
  id,
  label,
  error,
  hint,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const descriptionId = `${id}-description`;
  return (
    <div className="auth-field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      <div className="password-control">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </button>
      </div>
      {error ? <p id={descriptionId} className="field-error" role="alert">{error}</p> : <p id={descriptionId} className="field-hint">{hint ?? "Use pelo menos 12 caracteres."}</p>}
    </div>
  );
}
