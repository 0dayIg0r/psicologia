import { z } from "zod";
import { normalizeCrp } from "../../lib/registration/normalizers";
import { extractCfpRegistryCode } from "../../lib/validations/registration-common";
import { RegistrationError } from "../registration/errors";

const CFP_REGISTRY_ENDPOINT = "https://cn-api.cfp.org.br/psi/buscarComCodigo";
const REQUEST_TIMEOUT_MS = 8_000;

const registryRecordSchema = z.object({
  Nome: z.string(),
  nomeregional: z.string(),
  registro: z.coerce.string(),
  situacao: z.string(),
  dataInscricao: z.string().optional(),
});

const registryResponseSchema = z.array(registryRecordSchema).max(30);

function comparableText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase("pt-BR")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function comparableRegistration(value: string) {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

function regionFromLabel(value: string) {
  const match = value.match(/^(\d{1,2})ª\s+Região/i);
  return match ? Number(match[1]) : null;
}

function invalidCrp(fieldErrors: Record<string, string[]>) {
  return new RegistrationError(400, {
    ok: false,
    code: "VALIDATION_ERROR",
    message: "Não foi possível confirmar este registro no Cadastro Nacional do CFP.",
    fieldErrors,
  });
}

export type VerifiedCrpRegistration = {
  registryCode: string;
  professionalName: string;
  crp: string;
  verifiedAt: Date;
};

export async function verifyCrpRegistration(input: {
  name: string;
  crp: string;
  cfpProfileUrl: string;
}): Promise<VerifiedCrpRegistration> {
  const registryCode = extractCfpRegistryCode(input.cfpProfileUrl);
  if (!registryCode) {
    throw invalidCrp({ cfpProfileUrl: ["Cole um link válido do Cadastro Nacional do CFP."] });
  }

  const crp = normalizeCrp(input.crp);
  const [regionText, registrationText] = crp.split("/");
  const expectedRegion = Number(regionText);
  const expectedRegistration = comparableRegistration(registrationText ?? "");
  const url = new URL(CFP_REGISTRY_ENDPOINT);
  url.searchParams.set("profissional", registryCode);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new RegistrationError(503, {
      ok: false,
      code: "SERVICE_UNAVAILABLE",
      message: "A consulta ao CFP está temporariamente indisponível. Tente novamente em alguns minutos.",
    });
  }

  if (!response.ok) {
    if (response.status >= 400 && response.status < 500) {
      throw invalidCrp({ cfpProfileUrl: ["O perfil informado não foi encontrado no CFP."] });
    }
    throw new RegistrationError(503, {
      ok: false,
      code: "SERVICE_UNAVAILABLE",
      message: "A consulta ao CFP está temporariamente indisponível. Tente novamente em alguns minutos.",
    });
  }

  let records: z.infer<typeof registryResponseSchema>;
  try {
    records = registryResponseSchema.parse(await response.json());
  } catch {
    throw new RegistrationError(503, {
      ok: false,
      code: "SERVICE_UNAVAILABLE",
      message: "O CFP retornou uma resposta que não pôde ser validada. Tente novamente mais tarde.",
    });
  }

  const matchingRegistration = records.find(
    (record) =>
      regionFromLabel(record.nomeregional) === expectedRegion &&
      comparableRegistration(record.registro) === expectedRegistration,
  );

  if (!matchingRegistration) {
    throw invalidCrp({ crp: ["O CRP não corresponde ao perfil informado no CFP."] });
  }
  if (comparableText(matchingRegistration.situacao) !== "ATIVO") {
    throw invalidCrp({ crp: ["Este registro não consta como ativo no Cadastro Nacional do CFP."] });
  }
  if (comparableText(matchingRegistration.Nome) !== comparableText(input.name)) {
    throw invalidCrp({
      name: ["O nome informado não corresponde ao cadastro do CFP."],
      cfpProfileUrl: ["Confirme se você colou o link do seu próprio perfil."],
    });
  }

  return {
    registryCode,
    professionalName: matchingRegistration.Nome,
    crp,
    verifiedAt: new Date(),
  };
}
