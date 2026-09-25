"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({ className = "button secondary" }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("logout_failed");
      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível sair agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="logout-control">
      <button type="button" className={className} onClick={logout} disabled={pending}>
        {pending ? "Saindo..." : "Sair"}
      </button>
      {error ? <span className="logout-error" role="alert" aria-live="polite">{error}</span> : null}
    </span>
  );
}
