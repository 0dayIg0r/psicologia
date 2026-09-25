import { readJsonBody } from "@/lib/http/read-json-body";
import { login, LoginError } from "@/services/auth/login.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  if (!payload.ok) {
    return Response.json(
      { ok: false, code: "VALIDATION_ERROR", message: payload.message },
      { status: payload.status },
    );
  }

  try {
    return Response.json(await login(payload.body), { status: 200 });
  } catch (error) {
    if (error instanceof LoginError) return Response.json(error.body, { status: error.status });
    return Response.json(
      { ok: false, code: "SERVICE_UNAVAILABLE", message: "Não foi possível entrar agora. Tente novamente." },
      { status: 503 },
    );
  }
}
