import { z } from "zod";
import { crpSchema, cfpProfileUrlSchema, fullNameSchema } from "@/lib/validations/registration-common";
import { readJsonBody } from "@/lib/http/read-json-body";
import { verifyCrpRegistration } from "@/services/crp/cfp-registry.service";
import { mapRegistrationError, RegistrationError } from "@/services/registration/errors";

export const runtime = "nodejs";

const requestSchema = z.object({
  name: fullNameSchema,
  crp: crpSchema,
  cfpProfileUrl: cfpProfileUrlSchema,
});

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  if (!payload.ok) {
    return Response.json(
      { ok: false, code: "VALIDATION_ERROR", message: payload.message },
      { status: payload.status },
    );
  }

  const parsed = requestSchema.safeParse(payload.body);
  if (!parsed.success) {
    const error = new RegistrationError(400, {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Revise os dados usados para consultar o CFP.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
    return Response.json(error.body, { status: error.status });
  }

  try {
    const result = await verifyCrpRegistration(parsed.data);
    return Response.json({ ok: true, professionalName: result.professionalName, crp: result.crp });
  } catch (error) {
    const mapped = mapRegistrationError(error);
    return Response.json(mapped.body, { status: mapped.status });
  }
}
