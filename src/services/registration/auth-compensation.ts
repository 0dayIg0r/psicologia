import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server";

export async function removeAuthIdentity(userId: string) {
  const { error } = await createSupabaseAdminServerClient().auth.admin.deleteUser(userId);
  if (error) throw error;
}
