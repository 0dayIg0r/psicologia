import Link from "next/link";
import { CreateAccountMenu } from "@/components/layout/create-account-menu";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { LoginMenu } from "@/components/layout/login-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import { areaForRole, getCurrentAppUser } from "@/lib/auth/current-user";

export async function Header() {
  const user = await getCurrentAppUser();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">Psico<span>Encontre</span></Link>
        <nav aria-label="Navegação principal">
          <Link href="/#sobre">Sobre nós</Link>
          <Link href="/#como-funciona">Como funciona</Link>
          <Link href="/#blog">Blog</Link>
        </nav>
        <div className="header-actions">
          {user ? <><Link href={areaForRole(user.role)} className="header-user-link">Olá, {user.name.split(" ")[0]}</Link><LogoutButton className="header-logout" /></> : <LoginMenu />}
          {!user ? <CreateAccountMenu /> : null}
        </div>
        <MobileNavigation user={user ? { name: user.name, role: user.role } : null} />
      </div>
    </header>
  );
}
