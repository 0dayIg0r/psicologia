"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

type MobileUser = { name: string; role: "PATIENT" | "PSYCHOLOGIST" | "ADMIN" };
function areaForRole(role: MobileUser["role"]) { return role === "PATIENT" ? "/area/paciente" : role === "PSYCHOLOGIST" ? "/area/psicologo" : "/"; }

export function MobileNavigation({ user }: { user: MobileUser | null }) {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      firstLinkRef.current?.focus();
      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", closeOnEscape);
      return () => document.removeEventListener("keydown", closeOnEscape);
    }
    if (wasOpen.current) buttonRef.current?.focus();
  }, [open]);

  return (
    <div className="mobile-navigation">
      <button
        ref={buttonRef}
        className="menu-button"
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>
      {open ? (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Navegação mobile">
            <Link ref={firstLinkRef} href="/#sobre" onClick={() => setOpen(false)}>Sobre nós</Link>
            <Link href="/#como-funciona" onClick={() => setOpen(false)}>Como funciona</Link>
            <Link href="/#blog" onClick={() => setOpen(false)}>Blog</Link>
            {user ? <Link href={areaForRole(user.role)} onClick={() => setOpen(false)}>Olá, {user.name.split(" ")[0]}</Link> : <>
              <Link href="/entrar/paciente" onClick={() => setOpen(false)}>Entrar como paciente</Link>
              <Link href="/entrar/psicologo" onClick={() => setOpen(false)}>Entrar como psicólogo</Link>
            </>}
          </nav>
          {user ? <LogoutButton className="button secondary mobile-logout" /> : <><p>Quero criar uma conta como:</p><Link className="button secondary" href="/cadastro/paciente" onClick={() => setOpen(false)}>Paciente</Link><Link className="button primary" href="/cadastro/psicologo" onClick={() => setOpen(false)}>Psicólogo</Link></>}
        </div>
      ) : null}
    </div>
  );
}
