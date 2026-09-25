import { Prisma } from "../../generated/prisma/client";
import type { RegistrationFailure } from "./contracts";

export class RegistrationError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: RegistrationFailure,
  ) {
    super(body.message);
  }
}

function targetIncludes(error: Prisma.PrismaClientKnownRequestError, field: string) {
  const target = error.meta?.target;
  return Array.isArray(target) && target.some((item) => String(item).includes(field));
}

export function mapRegistrationError(error: unknown): RegistrationError {
  if (error instanceof RegistrationError) return error;

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const field = targetIncludes(error, "cpf")
      ? "cpf"
      : targetIncludes(error, "crp")
        ? "crp"
        : targetIncludes(error, "email")
          ? "email"
          : undefined;
    return new RegistrationError(409, {
      ok: false,
      code: "REGISTRATION_CONFLICT",
      message: field ? "Revise o campo indicado e tente novamente." : "Não foi possível concluir o cadastro.",
      fieldErrors: field ? { [field]: [`Este ${field.toUpperCase()} já está cadastrado.`] } : undefined,
    });
  }

  return new RegistrationError(503, {
    ok: false,
    code: "SERVICE_UNAVAILABLE",
    message: "Não foi possível criar sua conta agora. Tente novamente em alguns minutos.",
  });
}
