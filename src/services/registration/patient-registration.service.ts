import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getPrisma } from "@/lib/prisma";
import { patientRegistrationSchema } from "@/lib/validations/patient-registration";
import type { RegistrationSuccess } from "@/services/registration/contracts";
import { removeAuthIdentity } from "@/services/registration/auth-compensation";
import { mapRegistrationError, RegistrationError } from "@/services/registration/errors";

function legalVersions() {
  const terms = process.env.TERMS_VERSION;
  const privacy = process.env.PRIVACY_VERSION;
  if (!terms || !privacy) throw new Error("Versões dos documentos legais não configuradas.");
  return { terms, privacy };
}

export async function registerPatient(input: unknown): Promise<RegistrationSuccess> {
  const parsed = patientRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    throw new RegistrationError(400, {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Revise os campos indicados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;
  const prisma = getPrisma();
  const versions = legalVersions();
  const supabase = createSupabaseAuthServerClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  const authConflict = authError?.status === 422 || authData.user?.identities?.length === 0;
  if (authError || !authData.user?.id || authConflict) {
    throw new RegistrationError(authConflict ? 409 : 503, {
      ok: false,
      code: authConflict ? "REGISTRATION_CONFLICT" : "SERVICE_UNAVAILABLE",
      message: authConflict
        ? "Não foi possível usar este e-mail para o cadastro."
        : "O serviço de cadastro está indisponível. Tente novamente.",
      fieldErrors: authConflict ? { email: ["Não foi possível usar este e-mail."] } : undefined,
    });
  }
  const authUserId = authData.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: authUserId,
          name: data.name,
          cpf: data.cpf,
          email: data.email,
          phone: data.phone,
          role: "PATIENT",
          patientProfile: { create: {} },
          consents: {
            create: [
              { type: "TERMS", documentVersion: versions.terms },
              { type: "PRIVACY", documentVersion: versions.privacy },
            ],
          },
        },
      });
    });
  } catch (error) {
    const correlationId = crypto.randomUUID();
    try {
      await removeAuthIdentity(authUserId);
    } catch {
      console.error("registration_compensation_failed", { correlationId, authUserId });
      throw new RegistrationError(503, {
        ok: false,
        code: "SERVICE_UNAVAILABLE",
        message: "Não foi possível concluir o cadastro agora.",
        correlationId,
      });
    }
    throw mapRegistrationError(error);
  }

  return { ok: true, requiresEmailVerification: true };
}
