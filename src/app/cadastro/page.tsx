import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Stethoscope } from "lucide-react";

export const metadata: Metadata = { title: "Criar conta | PsicoEncontre" };

export default function RegistrationChoicePage() {
  return <main className="registration-choice"><div className="container"><p className="eyebrow">Comece por aqui</p><h1>Como você quer usar a PsicoEncontre?</h1><p className="choice-intro">Escolha o tipo de conta para seguir para o cadastro certo.</p><div className="account-choice-grid"><Link href="/cadastro/paciente"><span><Heart aria-hidden /></span><h2>Sou paciente</h2><p>Quero encontrar apoio psicológico online ou presencial.</p><strong>Continuar como paciente →</strong></Link><Link href="/cadastro/psicologo"><span><Stethoscope aria-hidden /></span><h2>Sou psicólogo</h2><p>Quero apresentar meu trabalho e oferecer atendimentos.</p><strong>Continuar como psicólogo →</strong></Link></div></div></main>;
}
