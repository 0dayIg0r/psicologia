import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/login";
import { areaForRole } from "@/lib/auth/current-user";
import type { LoginFailure } from "@/services/registration/contracts";

export class LoginError extends Error {
  constructor(public readonly status: 400 | 401 | 503, public readonly body: LoginFailure) {
    super(body.message);
  }
}

const invalidLogin = () =>
  new LoginError(401, {
    ok: false,
    code: "INVALID_CREDENTIALS",
    message: "E-mail, senha ou tipo de conta inválido.",
  });

export async function login(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    throw new LoginError(400, {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Revise os dados informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) throw invalidLogin();

  const user = await getPrisma().user.findUnique({
    where: { id: data.user.id },
    select: { name: true, role: true, isActive: true },
  });
  if (!user?.isActive || user.role !== parsed.data.role) {
    await supabase.auth.signOut({ scope: "local" });
    throw invalidLogin();
  }

  return { ok: true as const, name: user.name, role: user.role, redirectTo: areaForRole(user.role) };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) {
    throw new LoginError(503, {
      ok: false,
      code: "SERVICE_UNAVAILABLE",
      message: "Não foi possível encerrar a sessão agora.",
    });
  }
  return { ok: true as const };
}
