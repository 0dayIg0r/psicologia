import { z } from "zod";
import {
  isValidCpf,
  isValidCrp,
  isValidPhone,
  normalizeCep,
  normalizeCpf,
  normalizeCrp,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeState,
} from "../registration/normalizers";
import { parseMoneyToCents } from "../registration/money";

export const fullNameSchema = z
  .string()
  .transform(normalizeName)
  .pipe(z.string().min(5, "Informe seu nome completo.").max(160, "O nome está muito longo."));

export const cpfSchema = z
  .string()
  .refine(isValidCpf, "Informe um CPF válido.")
  .transform(normalizeCpf);

export const emailSchema = z
  .string()
  .transform(normalizeEmail)
  .pipe(z.string().email("Informe um e-mail válido.").max(320));

export const phoneSchema = z
  .string()
  .refine(isValidPhone, "Informe um telefone com DDD.")
  .transform(normalizePhone);

export const passwordSchema = z
  .string()
  .min(12, "Use pelo menos 12 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.");

export const consentSchema = z.literal(true, {
  error: "É necessário aceitar para continuar.",
});

export const crpSchema = z
  .string()
  .refine(isValidCrp, "Informe um CRP válido, como 06/123456.")
  .transform(normalizeCrp);

const CFP_PROFILE_HOST = "cadastro.cfp.org.br";
const CFP_PROFILE_PATH = "/visualizar.html";

export function extractCfpRegistryCode(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== CFP_PROFILE_HOST || url.pathname !== CFP_PROFILE_PATH) {
      return null;
    }

    const code = url.searchParams.get("profissional")?.trim();
    if (!code || code.length > 128 || !/^[A-Za-z0-9+/]{40,126}={0,2}$/.test(code)) return null;
    return code;
  } catch {
    return null;
  }
}

export const cfpProfileUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => extractCfpRegistryCode(value) !== null,
    "Cole o link do seu perfil no Cadastro Nacional do CFP.",
  );

export const moneySchema = z.string().transform((value, context) => {
  const cents = parseMoneyToCents(value);
  if (cents === null || cents <= BigInt(0)) {
    context.addIssue({ code: "custom", message: "Informe um valor maior que zero." });
    return z.NEVER;
  }
  return cents;
});

export const addressSchema = z.object({
  cep: z.string().transform(normalizeCep).pipe(z.string().regex(/^\d{8}$/, "Informe um CEP válido.")),
  street: z.string().transform(normalizeName).pipe(z.string().min(2, "Informe o logradouro.").max(180)),
  number: z.string().trim().min(1, "Informe o número.").max(30),
  complement: z.string().trim().max(120).optional().default(""),
  neighborhood: z.string().transform(normalizeName).pipe(z.string().min(2, "Informe o bairro.").max(120)),
  city: z.string().transform(normalizeName).pipe(z.string().min(2, "Informe a cidade.").max(120)),
  state: z.string().transform(normalizeState).pipe(z.string().regex(/^[A-Z]{2}$/, "Use a sigla do estado.")),
});

export const accountSchema = z
  .object({
    name: fullNameSchema,
    cpf: cpfSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptedTerms: consentSchema,
    acceptedPrivacy: consentSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });
