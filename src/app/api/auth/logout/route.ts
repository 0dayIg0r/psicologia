import { logout, LoginError } from "@/services/auth/login.service";

export const runtime = "nodejs";

export async function POST() {
  try {
    return Response.json(await logout());
  } catch (error) {
    if (error instanceof LoginError) return Response.json(error.body, { status: error.status });
    return Response.json(
      { ok: false, code: "SERVICE_UNAVAILABLE", message: "Não foi possível encerrar a sessão agora." },
      { status: 503 },
    );
  }
}
