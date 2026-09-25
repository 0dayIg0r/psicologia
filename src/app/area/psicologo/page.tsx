import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LogoutButton } from "@/components/auth/logout-button";
import { areaForRole, getCurrentAppUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Espaço profissional | PsicoEncontre" };

export default async function PsychologistAreaPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/entrar/psicologo");
  if (user.role !== "PSYCHOLOGIST") redirect(areaForRole(user.role));
  return <><AnnouncementBar /><Header /><main className="account-area"><div className="container account-area-card"><p className="eyebrow">Espaço profissional</p><h1>Olá, {user.name.split(" ")[0]}.</h1><p>Seu perfil e seus próximos recursos profissionais estarão reunidos aqui.</p><LogoutButton /></div></main><Footer /></>;
}
