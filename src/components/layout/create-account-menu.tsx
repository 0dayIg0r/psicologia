"use client";

import Link from "next/link";
import { ChevronDown, Heart, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLink,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CreateAccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="button primary small create-account-trigger">
        Criar conta <ChevronDown aria-hidden data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Escolha o tipo de conta">
        <DropdownMenuLink render={<Link href="/cadastro/paciente" />}>
          <Heart aria-hidden />
          <span><strong>Sou paciente</strong><small>Quero encontrar cuidado psicológico</small></span>
        </DropdownMenuLink>
        <DropdownMenuLink render={<Link href="/cadastro/psicologo" />}>
          <Stethoscope aria-hidden />
          <span><strong>Sou psicólogo</strong><small>Quero oferecer meus atendimentos</small></span>
        </DropdownMenuLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
