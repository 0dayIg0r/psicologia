"use client";

import { FormEvent, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FormField } from "@/components/auth/form-field";
import { PasswordField } from "@/components/auth/password-field";
import { RegistrationSuccess } from "@/components/auth/registration-success";
import { addressSchema, cfpProfileUrlSchema, crpSchema } from "@/lib/validations/registration-common";
import { patientRegistrationSchema } from "@/lib/validations/patient-registration";
import { psychologistRegistrationSchema } from "@/lib/validations/psychologist-registration";
import type { RegistrationFailure } from "@/services/registration/contracts";

type ThemeOption = { id: string; name: string };
type Errors = Record<string, string[]>;
type FormState = {
  name: string; cpf: string; email: string; phone: string; password: string; confirmPassword: string;
  crp: string; cfpProfileUrl: string; bio: string; offersOnline: boolean; offersInPerson: boolean;
  address: { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string };
  themeIds: string[]; suggestedThemes: string[]; standardPrice: string; offersSocial: boolean; socialPrice: string;
  acceptedTerms: boolean; acceptedPrivacy: boolean;
};

const initialState: FormState = {
  name: "", cpf: "", email: "", phone: "", password: "", confirmPassword: "",
  crp: "", cfpProfileUrl: "", bio: "", offersOnline: true, offersInPerson: false,
  address: { cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" },
  themeIds: [], suggestedThemes: [], standardPrice: "", offersSocial: false, socialPrice: "",
  acceptedTerms: false, acceptedPrivacy: false,
};

function issuesToErrors(issues: Array<{ path: PropertyKey[]; message: string }>): Errors {
  return issues.reduce<Errors>((result, issue) => {
    const key = issue.path.map(String).join(".") || "form";
    result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

export function PsychologistRegistrationForm({ themes, termsUrl, privacyUrl }: { themes: ThemeOption[]; termsUrl: string; privacyUrl: string }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [verifyingCrp, setVerifyingCrp] = useState(false);
  const [verifiedCrp, setVerifiedCrp] = useState<{ fingerprint: string; professionalName: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setData((current) => ({ ...current, [key]: value }));
  const setCrpIdentity = (key: "name" | "crp" | "cfpProfileUrl", value: string) => {
    setVerifiedCrp(null);
    set(key, value);
  };
  const setAddress = (key: keyof FormState["address"], value: string) => setData((current) => ({ ...current, address: { ...current.address, [key]: value } }));
  const focusFirstError = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());

  function validateStep() {
    let result;
    if (step === 0) {
      result = patientRegistrationSchema.safeParse({ ...data, acceptedTerms: true, acceptedPrivacy: true });
    } else if (step === 1) {
      const crpResult = crpSchema.safeParse(data.crp);
      const profileResult = cfpProfileUrlSchema.safeParse(data.cfpProfileUrl);
      const professionalErrors: Errors = {};
      if (!crpResult.success) professionalErrors.crp = crpResult.error.issues.map((issue) => issue.message);
      if (!profileResult.success) professionalErrors.cfpProfileUrl = profileResult.error.issues.map((issue) => issue.message);
      if (data.bio.length > 2000) professionalErrors.bio = ["A apresentação deve ter no máximo 2.000 caracteres."];
      if (Object.keys(professionalErrors).length) {
        setErrors(professionalErrors);
        focusFirstError();
        return false;
      }
      result = { success: true as const };
    } else if (step === 2) {
      if (!data.offersOnline && !data.offersInPerson) {
        setErrors({ offersOnline: ["Escolha pelo menos uma modalidade."] });
        return false;
      }
      result = data.offersInPerson ? addressSchema.safeParse(data.address) : { success: true as const };
      if (!result.success) {
        setErrors(issuesToErrors(result.error.issues.map((issue) => ({ ...issue, path: ["address", ...issue.path] }))));
        focusFirstError();
        return false;
      }
    } else {
      return true;
    }

    if (!result.success) {
      setErrors(issuesToErrors(result.error.issues));
      focusFirstError();
      return false;
    }
    setErrors({});
    return true;
  }

  async function verifyCrp() {
    const fingerprint = `${data.name}|${data.crp}|${data.cfpProfileUrl}`;
    if (verifiedCrp?.fingerprint === fingerprint) return true;

    setVerifyingCrp(true);
    setErrors({});
    setFormError("");
    try {
      const response = await fetch("/api/crp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, crp: data.crp, cfpProfileUrl: data.cfpProfileUrl }),
      });
      const result = (await response.json()) as RegistrationFailure | { ok: true; professionalName: string };
      if (!response.ok || !result.ok) {
        const failure = result as RegistrationFailure;
        setErrors(failure.fieldErrors ?? {});
        setFormError(failure.message);
        focusFirstError();
        return false;
      }
      setVerifiedCrp({ fingerprint, professionalName: result.professionalName });
      return true;
    } catch {
      setFormError("Não foi possível consultar o CFP. Verifique sua conexão e tente novamente.");
      return false;
    } finally {
      setVerifyingCrp(false);
    }
  }

  async function nextStep() {
    if (!validateStep()) return;
    if (step === 1 && !(await verifyCrp())) return;
    setStep((current) => Math.min(4, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addSuggestion() {
    const value = suggestion.trim();
    if (!value || data.suggestedThemes.includes(value) || data.suggestedThemes.length >= 3) return;
    set("suggestedThemes", [...data.suggestedThemes, value]);
    setSuggestion("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) return nextStep();
    if (pending) return;
    const payload = { ...data, address: data.offersInPerson ? data.address : undefined };
    const parsed = psychologistRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(issuesToErrors(parsed.error.issues));
      setFormError("Revise os campos indicados antes de criar sua conta.");
      focusFirstError();
      return;
    }

    setPending(true);
    setErrors({});
    setFormError("");
    try {
      const response = await fetch("/api/auth/register/psychologist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as RegistrationFailure | { ok: true };
      if (!response.ok || !result.ok) {
        const failure = result as RegistrationFailure;
        setErrors(failure.fieldErrors ?? {});
        setFormError(failure.message);
        focusFirstError();
        return;
      }
      setSuccess(true);
    } catch {
      setFormError("Não foi possível enviar o cadastro. Verifique sua conexão e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  if (success) return <RegistrationSuccess accountType="psicólogo" />;

  const headings = ["Dados da conta", "Dados profissionais", "Como você atende", "Temas de atendimento", "Valores e consentimentos"];

  return (
    <form ref={formRef} className="auth-form psychologist-form" onSubmit={submit} noValidate>
      <div className="step-heading">
        <div><span>Etapa {step + 1} de 5</span><h2>{headings[step]}</h2></div>
        <span>{Math.round(((step + 1) / 5) * 100)}%</span>
      </div>
      <Progress value={step + 1} max={5} label={`Etapa ${step + 1} de 5`} />

      {step === 0 ? <div className="auth-grid">
        <FormField id="name" label="Nome completo" value={data.name} onChange={(e) => setCrpIdentity("name", e.target.value)} autoComplete="name" error={errors.name?.[0]} />
        <FormField id="cpf" label="CPF" value={data.cpf} onChange={(e) => set("cpf", e.target.value)} inputMode="numeric" placeholder="000.000.000-00" error={errors.cpf?.[0]} />
        <FormField id="email" label="E-mail" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" error={errors.email?.[0]} />
        <FormField id="phone" label="Telefone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="(11) 99999-9999" error={errors.phone?.[0]} />
        <PasswordField id="password" label="Senha" value={data.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" error={errors.password?.[0]} />
        <PasswordField id="confirmPassword" label="Confirmar senha" value={data.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} autoComplete="new-password" error={errors.confirmPassword?.[0]} />
      </div> : null}

      {step === 1 ? <div className="auth-stack">
        <div className="cfp-verification-intro">
          <p>Confirme seu registro ativo usando o perfil público do Cadastro Nacional do CFP.</p>
          <a href="https://cadastro.cfp.org.br/" target="_blank" rel="noopener noreferrer">Consultar meu registro no CFP <ExternalLink aria-hidden /></a>
        </div>
        <FormField id="crp" label="CRP" value={data.crp} onChange={(e) => setCrpIdentity("crp", e.target.value)} placeholder="06/123456" error={errors.crp?.[0] ?? errors.form?.[0]} hint="Use a região e o número que aparecem no perfil do CFP." />
        <FormField id="cfpProfileUrl" label="Link do seu perfil no CFP" type="url" value={data.cfpProfileUrl} onChange={(e) => setCrpIdentity("cfpProfileUrl", e.target.value)} placeholder="https://cadastro.cfp.org.br/visualizar.html?profissional=..." error={errors.cfpProfileUrl?.[0]} hint="Na consulta do CFP, abra seu resultado e copie o endereço completo da página." />
        {verifiedCrp ? <p className="verification-success" role="status"><CheckCircle2 aria-hidden /> Registro ativo confirmado para {verifiedCrp.professionalName}.</p> : null}
        <div className="auth-field" data-invalid={Boolean(errors.bio)}><label htmlFor="bio">Biografia ou apresentação <span>(opcional)</span></label><Textarea id="bio" rows={6} value={data.bio} onChange={(e) => set("bio", e.target.value)} aria-invalid={Boolean(errors.bio)} placeholder="Conte brevemente sobre sua abordagem e experiência." />{errors.bio ? <p className="field-error">{errors.bio[0]}</p> : <p className="field-hint">Até 2.000 caracteres.</p>}</div>
      </div> : null}

      {step === 2 ? <div className="auth-stack">
        <fieldset className="option-fieldset"><legend>Modalidades de atendimento</legend>
          <label className="choice-card"><Checkbox checked={data.offersOnline} onChange={(e) => set("offersOnline", e.target.checked)} aria-invalid={Boolean(errors.offersOnline)} /><span><strong>Atendimento online</strong><small>Consultas por videochamada.</small></span></label>
          <label className="choice-card"><Checkbox checked={data.offersInPerson} onChange={(e) => set("offersInPerson", e.target.checked)} /><span><strong>Atendimento presencial</strong><small>Consultas em endereço físico.</small></span></label>
          {errors.offersOnline ? <p className="field-error" role="alert">{errors.offersOnline[0]}</p> : null}
        </fieldset>
        {data.offersInPerson ? <fieldset className="address-fields"><legend>Endereço de atendimento</legend><div className="auth-grid">
          <FormField id="address.cep" label="CEP" value={data.address.cep} onChange={(e) => setAddress("cep", e.target.value)} inputMode="numeric" error={errors["address.cep"]?.[0]} />
          <FormField id="address.street" label="Logradouro" value={data.address.street} onChange={(e) => setAddress("street", e.target.value)} error={errors["address.street"]?.[0]} />
          <FormField id="address.number" label="Número" value={data.address.number} onChange={(e) => setAddress("number", e.target.value)} error={errors["address.number"]?.[0]} />
          <FormField id="address.complement" label="Complemento (opcional)" value={data.address.complement} onChange={(e) => setAddress("complement", e.target.value)} />
          <FormField id="address.neighborhood" label="Bairro" value={data.address.neighborhood} onChange={(e) => setAddress("neighborhood", e.target.value)} error={errors["address.neighborhood"]?.[0]} />
          <FormField id="address.city" label="Cidade" value={data.address.city} onChange={(e) => setAddress("city", e.target.value)} error={errors["address.city"]?.[0]} />
          <FormField id="address.state" label="Estado" value={data.address.state} onChange={(e) => setAddress("state", e.target.value)} maxLength={2} placeholder="SP" error={errors["address.state"]?.[0]} />
        </div></fieldset> : null}
      </div> : null}

      {step === 3 ? <div className="auth-stack">
        <fieldset className="option-fieldset"><legend>Selecione os temas que você atende</legend><div className="theme-grid">
          {themes.map((theme) => <label className="theme-option" key={theme.id}><Checkbox checked={data.themeIds.includes(theme.id)} onChange={(e) => set("themeIds", e.target.checked ? [...data.themeIds, theme.id] : data.themeIds.filter((id) => id !== theme.id))} /><span>{theme.name}</span></label>)}
        </div></fieldset>
        <div className="suggest-theme"><label htmlFor="suggestion">Sugerir novo tema <span>(até 3)</span></label><div><input id="suggestion" value={suggestion} onChange={(e) => setSuggestion(e.target.value)} maxLength={100} /><button type="button" onClick={addSuggestion} disabled={!suggestion.trim() || data.suggestedThemes.length >= 3}><Plus aria-hidden />Adicionar</button></div><p>Novos temas passam por análise antes de entrarem no catálogo.</p></div>
        {data.suggestedThemes.length ? <ul className="suggestion-list">{data.suggestedThemes.map((item) => <li key={item}>{item}<button type="button" aria-label={`Remover ${item}`} onClick={() => set("suggestedThemes", data.suggestedThemes.filter((value) => value !== item))}><X aria-hidden /></button></li>)}</ul> : null}
      </div> : null}

      {step === 4 ? <div className="auth-stack">
        <FormField id="standardPrice" label="Valor padrão da consulta" value={data.standardPrice} onChange={(e) => set("standardPrice", e.target.value)} inputMode="decimal" placeholder="R$ 200,00" error={errors.standardPrice?.[0]} />
        <label className="choice-card"><Checkbox checked={data.offersSocial} onChange={(e) => set("offersSocial", e.target.checked)} /><span><strong>Oferecer atendimento com valor social</strong><small>Uma opção de preço reduzido para alguns atendimentos.</small></span></label>
        {data.offersSocial ? <FormField id="socialPrice" label="Valor social" value={data.socialPrice} onChange={(e) => set("socialPrice", e.target.value)} inputMode="decimal" placeholder="R$ 90,00" error={errors.socialPrice?.[0]} /> : null}
        <div className="consent-list">
          <label><Checkbox checked={data.acceptedTerms} onChange={(e) => set("acceptedTerms", e.target.checked)} aria-invalid={Boolean(errors.acceptedTerms)} /> <span>Li e aceito os <a href={termsUrl} target="_blank" rel="noreferrer">Termos de Uso</a>.</span></label>{errors.acceptedTerms ? <p className="field-error">{errors.acceptedTerms[0]}</p> : null}
          <label><Checkbox checked={data.acceptedPrivacy} onChange={(e) => set("acceptedPrivacy", e.target.checked)} aria-invalid={Boolean(errors.acceptedPrivacy)} /> <span>Li e aceito a <a href={privacyUrl} target="_blank" rel="noreferrer">Política de Privacidade</a>.</span></label>{errors.acceptedPrivacy ? <p className="field-error">{errors.acceptedPrivacy[0]}</p> : null}
        </div>
      </div> : null}

      {formError ? <div className="form-error-summary" role="alert" tabIndex={-1}>{formError}</div> : null}
      <div className="step-actions">
        {step > 0 ? <button type="button" className="button secondary" onClick={() => { setErrors({}); setStep((current) => current - 1); }}>Voltar</button> : <span />}
        <button className="button primary" type="submit" disabled={pending || verifyingCrp}>{pending ? "Criando sua conta..." : verifyingCrp ? "Verificando CRP..." : step === 4 ? "Criar conta de psicólogo" : step === 1 ? "Verificar e continuar" : "Continuar"}</button>
      </div>
    </form>
  );
}
