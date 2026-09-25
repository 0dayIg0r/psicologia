import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Stethoscope } from "lucide-react";
import { getCurrentAppUser, areaForRole } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Entrar | PsicoEncontre" };

export default async function LoginChoicePage() {
  const user = await getCurrentAppUser();
  if (user) redirect(areaForRole(user.role));

  return (
    <main className="registration-choice login-choice">
      <div className="container">
        <p className="eyebrow">Bem-vindo de volta</p>
        <h1>Como você quer entrar?</h1>
        <p className="choice-intro">Escolha o tipo de conta para acessar seu espaço.</p>
        <div className="account-choice-grid">
          <Link href="/entrar/paciente">
            <span><Heart aria-hidden /></span>
            <h2>Sou paciente</h2>
            <p>Quero continuar minha jornada de cuidado.</p>
            <strong>Entrar como paciente →</strong>
          </Link>
          <Link href="/entrar/psicologo">
            <span><Stethoscope aria-hidden /></span>
            <h2>Sou psicólogo</h2>
            <p>Quero acessar meu espaço profissional.</p>
            <strong>Entrar como psicólogo →</strong>
          </Link>
        </div>
      </div>
    </main>
  );
}
