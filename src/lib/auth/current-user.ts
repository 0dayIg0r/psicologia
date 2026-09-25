import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppSessionUser = {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "PSYCHOLOGIST" | "ADMIN";
};

export async function getCurrentAppUser(): Promise<AppSessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;

  const user = await getPrisma().user.findUnique({
    where: { id: data.user.id },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user?.isActive) return null;

  return user;
}

export function areaForRole(role: AppSessionUser["role"]) {
  return role === "PATIENT" ? "/area/paciente" : role === "PSYCHOLOGIST" ? "/area/psicologo" : "/";
}
