import { Prisma } from "@/generated/prisma/client";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getPrisma } from "@/lib/prisma";
import { centsToDecimal } from "@/lib/registration/money";
import { slugify } from "@/lib/registration/normalizers";
import { psychologistRegistrationSchema } from "@/lib/validations/psychologist-registration";
import { verifyCrpRegistration } from "@/services/crp/cfp-registry.service";
import { removeAuthIdentity } from "@/services/registration/auth-compensation";
import type { RegistrationSuccess } from "@/services/registration/contracts";
import { mapRegistrationError, RegistrationError } from "@/services/registration/errors";

function legalVersions() {
  const terms = process.env.TERMS_VERSION;
  const privacy = process.env.PRIVACY_VERSION;
  if (!terms || !privacy) throw new Error("Versões dos documentos legais não configuradas.");
  return { terms, privacy };
}

export async function registerPsychologist(input: unknown): Promise<RegistrationSuccess> {
  const parsed = psychologistRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    throw new RegistrationError(400, {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Revise os campos indicados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;
  const verifiedCrp = await verifyCrpRegistration({
    name: data.name,
    crp: data.crp,
    cfpProfileUrl: data.cfpProfileUrl,
  });
  const prisma = getPrisma();
  const versions = legalVersions();
  const { data: authData, error: authError } = await createSupabaseAuthServerClient().auth.signUp({
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
      const officialThemes = data.themeIds.length
        ? await tx.theme.findMany({
            where: { id: { in: data.themeIds }, status: "APPROVED", active: true },
            select: { id: true },
          })
        : [];
      if (officialThemes.length !== new Set(data.themeIds).size) {
        throw new RegistrationError(400, {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Revise os temas selecionados.",
          fieldErrors: { themeIds: ["Um ou mais temas não estão disponíveis."] },
        });
      }

      const psychologist = await tx.psychologist.create({
        data: {
          crp: data.crp,
          crpStatus: "VERIFIED",
          crpVerifiedAt: verifiedCrp.verifiedAt,
          crpRegistryCode: verifiedCrp.registryCode,
          bio: data.bio || null,
          offersOnline: data.offersOnline,
          offersInPerson: data.offersInPerson,
          offersSocial: data.offersSocial,
          user: {
            create: {
              id: authUserId,
              name: data.name,
              cpf: data.cpf,
              email: data.email,
              phone: data.phone,
              role: "PSYCHOLOGIST",
              consents: {
                create: [
                  { type: "TERMS", documentVersion: versions.terms },
                  { type: "PRIVACY", documentVersion: versions.privacy },
                ],
              },
            },
          },
          prices: {
            create: [
              { priceType: "STANDARD", amount: new Prisma.Decimal(centsToDecimal(data.standardPrice)) },
              ...(data.offersSocial && data.socialPrice !== undefined
                ? [{ priceType: "SOCIAL" as const, amount: new Prisma.Decimal(centsToDecimal(data.socialPrice)) }]
                : []),
            ],
          },
          addresses: data.offersInPerson && data.address
            ? {
                create: {
                  cep: data.address.cep,
                  street: data.address.street,
                  number: data.address.number,
                  complement: data.address.complement || null,
                  neighborhood: data.address.neighborhood,
                  city: data.address.city,
                  state: data.address.state,
                },
              }
            : undefined,
          themes: officialThemes.length
            ? { create: officialThemes.map((theme) => ({ themeId: theme.id })) }
            : undefined,
        },
        select: { id: true },
      });

      for (const suggestedName of [...new Set(data.suggestedThemes)]) {
        const slug = slugify(suggestedName);
        if (!slug) continue;
        const theme = await tx.theme.upsert({
          where: { slug },
          create: {
            name: suggestedName,
            slug,
            status: "PENDING",
            createdByPsychologistId: psychologist.id,
          },
          update: {},
          select: { id: true },
        });
        await tx.psychologistTheme.upsert({
          where: { psychologistId_themeId: { psychologistId: psychologist.id, themeId: theme.id } },
          create: { psychologistId: psychologist.id, themeId: theme.id },
          update: {},
        });
      }
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
