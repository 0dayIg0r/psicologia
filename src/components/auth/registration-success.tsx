import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function RegistrationSuccess({ accountType }: { accountType: "paciente" | "psicólogo" }) {
  return (
    <div className="registration-success" role="status" aria-live="polite">
      <CheckCircle2 aria-hidden />
      <h2>Conta criada com sucesso</h2>
      <p>
        Enviamos uma confirmação para o seu e-mail. Confirme o endereço antes de acessar sua conta de {accountType}.
      </p>
      <Link className="button primary" href="/">Voltar para o início</Link>
    </div>
  );
}
