import type { Metadata } from "next";
import { PatientRegistrationForm } from "@/components/auth/patient-registration-form";
import { RegistrationShell } from "@/components/auth/registration-shell";

export const metadata: Metadata = { title: "Cadastro de paciente | PsicoEncontre" };

export default function PatientRegistrationPage() {
  return <RegistrationShell eyebrow="Conta de paciente" title="Um primeiro passo para cuidar de você" description="Crie sua conta para encontrar profissionais alinhados ao que você precisa."><PatientRegistrationForm termsUrl={process.env.TERMS_URL ?? "/termos-de-uso"} privacyUrl={process.env.PRIVACY_URL ?? "/politica-de-privacidade"} /></RegistrationShell>;
}
