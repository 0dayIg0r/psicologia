import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LoginShell } from "@/components/auth/login-shell";
import { areaForRole, getCurrentAppUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Entrar como paciente | PsicoEncontre" };

export default async function PatientLoginPage() {
  const user = await getCurrentAppUser();
  if (user) redirect(areaForRole(user.role));
  return <LoginShell eyebrow="Conta de paciente" title="Que bom ter você aqui" description="Entre para continuar encontrando cuidado psicológico alinhado ao que você precisa."><LoginForm role="PATIENT" /></LoginShell>;
}
