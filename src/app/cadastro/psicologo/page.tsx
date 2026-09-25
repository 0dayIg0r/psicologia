import type { Metadata } from "next";
import { PsychologistRegistrationForm } from "@/components/auth/psychologist-registration-form";
import { RegistrationShell } from "@/components/auth/registration-shell";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Cadastro de psicólogo | PsicoEncontre" };
export const dynamic = "force-dynamic";

export default async function PsychologistRegistrationPage() {
  const themes = await getPrisma().theme.findMany({ where: { status: "APPROVED", active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <RegistrationShell eyebrow="Para profissionais" title="Leve seu cuidado a mais pessoas" description="Apresente seu trabalho com clareza e configure como deseja atender."><PsychologistRegistrationForm themes={themes} termsUrl={process.env.TERMS_URL ?? "/termos-de-uso"} privacyUrl={process.env.PRIVACY_URL ?? "/politica-de-privacidade"} /></RegistrationShell>;
}
