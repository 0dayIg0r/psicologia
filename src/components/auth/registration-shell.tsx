import Link from "next/link";

export function RegistrationShell({
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
    <main className="registration-page" id="main-content">
      <div className="container registration-layout">
        <section className="registration-intro" aria-labelledby="registration-title">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="registration-title">{title}</h1>
          <p>{description}</p>
          <div className="registration-assurance">
            <strong>Seus dados são tratados com cuidado.</strong>
            <span>Usamos conexão segura e confirmação de e-mail para proteger sua conta.</span>
          </div>
          <Link className="registration-back" href="/cadastro">← Escolher outro tipo de conta</Link>
        </section>
        <section className="registration-card">{children}</section>
      </div>
    </main>
  );
}
