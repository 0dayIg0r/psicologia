export type JsonBodyResult =
  | { ok: true; body: unknown }
  | { ok: false; status: 400 | 413 | 415; message: string };

const MAX_JSON_BODY_SIZE = 50_000;

export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return { ok: false, status: 415, message: "Envie os dados como JSON." };
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_JSON_BODY_SIZE) {
    return { ok: false, status: 413, message: "O cadastro enviado é muito grande." };
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_JSON_BODY_SIZE) {
    return { ok: false, status: 413, message: "O cadastro enviado é muito grande." };
  }

  try {
    return { ok: true, body: JSON.parse(rawBody) as unknown };
  } catch {
    return { ok: false, status: 400, message: "O JSON enviado não é válido." };
  }
}
