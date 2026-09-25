import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LoginShell } from "@/components/auth/login-shell";
import { areaForRole, getCurrentAppUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Entrar como psicólogo | PsicoEncontre" };

export default async function PsychologistLoginPage() {
  const user = await getCurrentAppUser();
  if (user) redirect(areaForRole(user.role));
  return <LoginShell eyebrow="Conta profissional" title="Continue seu trabalho de cuidado" description="Entre para acessar seu espaço profissional e acompanhar seus atendimentos."><LoginForm role="PSYCHOLOGIST" /></LoginShell>;
}
