import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LogoutButton } from "@/components/auth/logout-button";
import { areaForRole, getCurrentAppUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Meu espaço | PsicoEncontre" };

export default async function PatientAreaPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/entrar/paciente");
  if (user.role !== "PATIENT") redirect(areaForRole(user.role));
  return <><AnnouncementBar /><Header /><main className="account-area"><div className="container account-area-card"><p className="eyebrow">Área do paciente</p><h1>Olá, {user.name.split(" ")[0]}.</h1><p>Seu espaço para continuar encontrando cuidado psicológico com calma e segurança.</p><LogoutButton /></div></main><Footer /></>;
}
