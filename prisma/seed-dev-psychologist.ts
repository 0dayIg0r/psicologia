import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "../src/generated/prisma/client";
import { getPrisma } from "../src/lib/prisma";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} não configurada.`);
  return value;
}

function assertDevelopmentSeedEnabled() {
  if (process.env.NODE_ENV === "production" || process.env.DEV_SEED_ENABLED !== "true") {
    throw new Error(
      "Seed de desenvolvimento bloqueado. Use DEV_SEED_ENABLED=true somente em um ambiente de desenvolvimento.",
    );
  }
}

async function main() {
  assertDevelopmentSeedEnabled();

  const email = required("DEV_PSYCHOLOGIST_EMAIL").toLocaleLowerCase("pt-BR");
  const password = required("DEV_PSYCHOLOGIST_PASSWORD");
  if (password.length < 12) throw new Error("DEV_PSYCHOLOGIST_PASSWORD deve ter ao menos 12 caracteres.");

  const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const prisma = getPrisma();
  let authUserId: string | undefined;
  let createdAuthIdentity = false;

  try {
    const existingAppUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingAppUser) {
      const { data, error } = await supabase.auth.admin.getUserById(existingAppUser.id);
      if (error || !data.user) throw new Error("A conta dev existe no banco, mas não no Supabase Auth.");
      authUserId = data.user.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
        password,
        email_confirm: true,
        user_metadata: { fixture: "dev-psychologist" },
      });
      if (updateError) throw updateError;
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { fixture: "dev-psychologist" },
      });
      if (error || !data.user) throw error ?? new Error("Supabase não retornou a identidade criada.");
      authUserId = data.user.id;
      createdAuthIdentity = true;
    }

    const termsVersion = required("TERMS_VERSION");
    const privacyVersion = required("PRIVACY_VERSION");
    const themeIds = await prisma.theme.findMany({
      where: { status: "APPROVED", active: true },
      select: { id: true },
      orderBy: { name: "asc" },
    });
    if (!themeIds.length) throw new Error("Execute npm run db:seed antes de criar a conta dev.");

    await prisma.$transaction(
      async (tx) => {
        await tx.user.upsert({
          where: { email },
          create: {
            id: authUserId!,
            name: "Marina Oliveira (Conta Dev)",
            cpf: "52998224725",
            email,
            phone: "+5511999991234",
            role: "PSYCHOLOGIST",
            consents: {
              create: [
                { type: "TERMS", documentVersion: termsVersion },
                { type: "PRIVACY", documentVersion: privacyVersion },
              ],
            },
          },
          update: {
            name: "Marina Oliveira (Conta Dev)",
            phone: "+5511999991234",
            role: "PSYCHOLOGIST",
            isActive: true,
          },
        });

        const psychologist = await tx.psychologist.upsert({
          where: { userId: authUserId! },
          create: {
            userId: authUserId!,
            crp: "99/000001",
            crpStatus: "VERIFIED",
            crpVerifiedAt: new Date(),
            bio: "Conta fictícia exclusiva para desenvolvimento e testes locais.",
            offersOnline: true,
            offersInPerson: false,
            offersSocial: true,
            isProfilePublic: false,
          },
          update: {
            crpStatus: "VERIFIED",
            bio: "Conta fictícia exclusiva para desenvolvimento e testes locais.",
            offersOnline: true,
            offersInPerson: false,
            offersSocial: true,
            isProfilePublic: false,
          },
          select: { id: true },
        });

        await tx.psychologistPrice.upsert({
          where: { psychologistId_priceType: { psychologistId: psychologist.id, priceType: "STANDARD" } },
          create: { psychologistId: psychologist.id, priceType: "STANDARD", amount: new Prisma.Decimal("200.00") },
          update: { amount: new Prisma.Decimal("200.00"), active: true },
        });
        await tx.psychologistPrice.upsert({
          where: { psychologistId_priceType: { psychologistId: psychologist.id, priceType: "SOCIAL" } },
          create: { psychologistId: psychologist.id, priceType: "SOCIAL", amount: new Prisma.Decimal("90.00") },
          update: { amount: new Prisma.Decimal("90.00"), active: true },
        });

        await tx.psychologistTheme.deleteMany({ where: { psychologistId: psychologist.id } });
        await tx.psychologistTheme.createMany({
          data: themeIds.map(({ id }) => ({ psychologistId: psychologist.id, themeId: id })),
          skipDuplicates: true,
        });
      },
      { maxWait: 15_000, timeout: 30_000 },
    );

    console.log(`Conta dev de psicólogo pronta: ${email}`);
  } catch (error) {
    if (createdAuthIdentity && authUserId) {
      await supabase.auth.admin.deleteUser(authUserId).catch(() => undefined);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Falha ao criar a conta dev de psicólogo.", error);
  process.exitCode = 1;
});
