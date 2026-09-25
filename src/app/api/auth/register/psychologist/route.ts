import { registerPsychologist } from "@/services/registration/psychologist-registration.service";
import { mapRegistrationError } from "@/services/registration/errors";
import { readJsonBody } from "@/lib/http/read-json-body";

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
    return Response.json(await registerPsychologist(payload.body), { status: 201 });
  } catch (error) {
    const mapped = mapRegistrationError(error);
    return Response.json(mapped.body, { status: mapped.status });
  }
}
