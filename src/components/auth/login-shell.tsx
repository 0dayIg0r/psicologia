import Link from "next/link";

export function LoginShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="registration-page login-page" id="main-content">
      <div className="container registration-layout">
        <section className="registration-intro" aria-labelledby="login-title">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="login-title">{title}</h1>
          <p>{description}</p>
          <div className="registration-assurance">
            <strong>Um espaço seguro para continuar.</strong>
            <span>Usamos conexão segura para proteger sua sessão.</span>
          </div>
          <Link className="registration-back" href="/entrar">← Escolher outro tipo de acesso</Link>
        </section>
        <section className="registration-card">{children}</section>
      </div>
    </main>
  );
}
