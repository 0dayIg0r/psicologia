"use client";

import { FormEvent, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/auth/form-field";
import { PasswordField } from "@/components/auth/password-field";
import { RegistrationSuccess } from "@/components/auth/registration-success";
import { patientRegistrationSchema } from "@/lib/validations/patient-registration";
import type { RegistrationFailure } from "@/services/registration/contracts";

type Errors = Record<string, string[]>;

export function PatientRegistrationForm({
  termsUrl,
  privacyUrl,
}: {
  termsUrl: string;
  privacyUrl: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      cpf: formData.get("cpf"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      acceptedTerms: formData.get("acceptedTerms") === "on",
      acceptedPrivacy: formData.get("acceptedPrivacy") === "on",
    };

    const parsed = patientRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Errors;
      setErrors(fieldErrors);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }

    setErrors({});
    setFormError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as RegistrationFailure | { ok: true };
      if (!response.ok || !result.ok) {
        const failure = result as RegistrationFailure;
        setErrors(failure.fieldErrors ?? {});
        setFormError(failure.message);
        requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
        return;
      }
      setSuccess(true);
    } catch {
      setFormError("Não foi possível enviar o cadastro. Verifique sua conexão e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  if (success) return <RegistrationSuccess accountType="paciente" />;

  return (
    <form ref={formRef} className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form-heading">
        <h2>Seus dados</h2>
        <p>Preencha os campos abaixo para começar.</p>
      </div>
      <div className="auth-grid">
        <FormField id="name" name="name" label="Nome completo" autoComplete="name" error={errors.name?.[0]} />
        <FormField id="cpf" name="cpf" label="CPF" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" error={errors.cpf?.[0]} />
        <FormField id="email" name="email" type="email" label="E-mail" autoComplete="email" error={errors.email?.[0]} />
        <FormField id="phone" name="phone" type="tel" label="Telefone" autoComplete="tel" placeholder="(11) 99999-9999" error={errors.phone?.[0]} />
        <PasswordField id="password" name="password" label="Senha" autoComplete="new-password" error={errors.password?.[0]} />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirmar senha" autoComplete="new-password" error={errors.confirmPassword?.[0]} />
      </div>
      <div className="consent-list">
        <label><Checkbox name="acceptedTerms" aria-invalid={Boolean(errors.acceptedTerms)} /> <span>Li e aceito os <a href={termsUrl} target="_blank" rel="noreferrer">Termos de Uso</a>.</span></label>
        {errors.acceptedTerms ? <p className="field-error" role="alert">{errors.acceptedTerms[0]}</p> : null}
        <label><Checkbox name="acceptedPrivacy" aria-invalid={Boolean(errors.acceptedPrivacy)} /> <span>Li e aceito a <a href={privacyUrl} target="_blank" rel="noreferrer">Política de Privacidade</a>.</span></label>
        {errors.acceptedPrivacy ? <p className="field-error" role="alert">{errors.acceptedPrivacy[0]}</p> : null}
      </div>
      {formError ? <div className="form-error-summary" role="alert" tabIndex={-1}>{formError}</div> : null}
      <button className="button primary auth-submit" type="submit" disabled={pending}>
        {pending ? "Criando sua conta..." : "Criar conta de paciente"}
      </button>
    </form>
  );
}
