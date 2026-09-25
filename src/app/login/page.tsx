"use client";

import { ArrowRight, HeartHandshake, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    router.push("/area/psicologo");
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="PsicoEncontre">
        <a className="login-brand" href="/">Psico<span>Encontre</span></a>
        <div className="login-visual-copy"><span className="login-mark"><HeartHandshake size={23} /></span><p>Um espaço para cuidar de quem cuida.</p><span>Gerencie sua agenda, seus atendimentos e o seu impacto social em um só lugar.</span></div>
        <span className="login-visual-footer">PsicoEncontre para profissionais</span>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <p className="section-label">Área do profissional</p>
          <h1>Bem-vinda de volta, Marina</h1>
          <p className="login-intro">Entre para acessar sua agenda e acompanhar seus atendimentos.</p>
          <form onSubmit={handleSubmit}>
            <label className="login-field"><span>E-mail profissional</span><div><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" required /></div></label>
            <label className="login-field"><span>Senha</span><div><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" required /></div></label>
            <div className="login-options"><label><input type="checkbox" /> <span>Lembrar de mim</span></label><a href="#recuperar">Esqueci minha senha</a></div>
            <button className="login-submit" type="submit">Entrar na minha área <ArrowRight size={17} /></button>
          </form>
          <p className="login-signup">Ainda não é profissional parceiro? <a href="#criar-conta">Quero me cadastrar</a></p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
