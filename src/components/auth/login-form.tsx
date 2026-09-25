"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { FormField } from "@/components/auth/form-field";
import { PasswordField } from "@/components/auth/password-field";
import { loginSchema } from "@/lib/validations/login";
import type { LoginFailure } from "@/services/registration/contracts";

type LoginRole = "PATIENT" | "PSYCHOLOGIST";
type Errors = Record<string, string[]>;

export function LoginForm({ role }: { role: LoginRole }) {
  const roleLabel = role === "PATIENT" ? "paciente" : "psicólogo";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function focusFirstError() {
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const parsed = loginSchema.safeParse({ email, password, role });
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      setFormError("Revise os dados indicados antes de entrar.");
      focusFirstError();
      return;
    }

    setPending(true);
    setErrors({});
    setFormError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as LoginFailure | { ok: true; redirectTo: string };
      if (!response.ok || !result.ok) {
        const failure = result as LoginFailure;
        setErrors(failure.fieldErrors ?? {});
        setFormError(failure.message);
        focusFirstError();
        return;
      }
      window.location.assign(result.redirectTo);
    } catch {
      setFormError("Não foi possível entrar. Verifique sua conexão e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} className="auth-form login-form" onSubmit={submit} noValidate>
      <div className="step-heading">
        <div><span>Acesso</span><h2>Entrar como {roleLabel}</h2></div>
      </div>
      <div className="auth-stack">
        <FormField
          id="login-email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          error={errors.email?.[0]}
        />
        <PasswordField
          id="login-password"
          label="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          error={errors.password?.[0]}
          hint="Digite a senha usada no cadastro."
        />
      </div>
      {formError ? <div className="form-error-summary" role="alert" tabIndex={-1}>{formError}</div> : null}
      <button className="button primary login-submit" type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
      <p className="login-switch">Ainda não tem uma conta? <Link href={role === "PATIENT" ? "/cadastro/paciente" : "/cadastro/psicologo"}>Criar conta</Link></p>
    </form>
  );
}
