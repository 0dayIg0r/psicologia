import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getPrisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.DEV_PSYCHOLOGIST_EMAIL;
  const password = process.env.DEV_PSYCHOLOGIST_PASSWORD;
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!email || !password || !supabaseUrl || !publishableKey) {
    throw new Error("Configuração da conta dev incompleta.");
  }

  const prisma = getPrisma();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        role: true,
        isActive: true,
        psychologist: {
          select: {
            crp: true,
            crpStatus: true,
            offersSocial: true,
            isProfilePublic: true,
            prices: { select: { priceType: true } },
            themes: { select: { themeId: true } },
          },
        },
      },
    });

    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    const result = {
      appUserExists: Boolean(user),
      role: user?.role,
      isActive: user?.isActive,
      crp: user?.psychologist?.crp,
      crpStatus: user?.psychologist?.crpStatus,
      offersSocial: user?.psychologist?.offersSocial,
      isProfilePublic: user?.psychologist?.isProfilePublic,
      priceTypes: user?.psychologist?.prices.map(({ priceType }) => priceType).sort(),
      themeCount: user?.psychologist?.themes.length,
      authLoginWorks: Boolean(data.user && !error),
      emailConfirmed: Boolean(data.user?.email_confirmed_at),
    };
    console.log(JSON.stringify(result, null, 2));
    await supabase.auth.signOut();

    if (
      !result.appUserExists ||
      !result.authLoginWorks ||
      result.role !== "PSYCHOLOGIST" ||
      result.isProfilePublic !== false
    ) {
      throw new Error("A fixture dev não passou na verificação.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Falha ao verificar a conta dev de psicólogo.", error);
  process.exitCode = 1;
});
