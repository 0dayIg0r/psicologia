"use client";

import Link from "next/link";
import { Heart, LogIn, Stethoscope } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLink, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LoginMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-login-trigger" aria-label="Escolher tipo de acesso">
        <LogIn aria-hidden /> Entrar
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Escolha como entrar">
        <DropdownMenuLink render={<Link href="/entrar/paciente" />}>
          <Heart aria-hidden />
          <span><strong>Sou paciente</strong><small>Entrar para encontrar cuidado</small></span>
        </DropdownMenuLink>
        <DropdownMenuLink render={<Link href="/entrar/psicologo" />}>
          <Stethoscope aria-hidden />
          <span><strong>Sou psicólogo</strong><small>Entrar para cuidar de pessoas</small></span>
        </DropdownMenuLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
