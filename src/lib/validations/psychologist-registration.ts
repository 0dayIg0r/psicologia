import { z } from "zod";
import {
  accountSchema,
  addressSchema,
  cfpProfileUrlSchema,
  crpSchema,
  moneySchema,
} from "./registration-common";

export const psychologistRegistrationSchema = accountSchema
  .safeExtend({
    crp: crpSchema,
    cfpProfileUrl: cfpProfileUrlSchema,
    bio: z.string().trim().max(2000, "A apresentação deve ter no máximo 2.000 caracteres.").optional().default(""),
    offersOnline: z.boolean(),
    offersInPerson: z.boolean(),
    address: addressSchema.optional(),
    themeIds: z.array(z.string().uuid()).max(12, "Selecione no máximo 12 temas.").default([]),
    suggestedThemes: z
      .array(z.string().trim().min(2).max(100))
      .max(3, "Sugira no máximo 3 temas.")
      .default([]),
    standardPrice: moneySchema,
    offersSocial: z.boolean().default(false),
    socialPrice: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      moneySchema.optional(),
    ),
  })
  .superRefine((value, context) => {
    if (!value.offersOnline && !value.offersInPerson) {
      context.addIssue({
        code: "custom",
        path: ["offersOnline"],
        message: "Escolha pelo menos uma modalidade de atendimento.",
      });
    }
    if (value.offersInPerson && !value.address) {
      context.addIssue({
        code: "custom",
        path: ["address"],
        message: "Informe o endereço do atendimento presencial.",
      });
    }
    if (value.offersSocial && value.socialPrice === undefined) {
      context.addIssue({
        code: "custom",
        path: ["socialPrice"],
        message: "Informe o valor social.",
      });
    }
  });

export type PsychologistRegistrationInput = Parameters<typeof psychologistRegistrationSchema.parse>[0];
export type PsychologistRegistrationData = ReturnType<typeof psychologistRegistrationSchema.parse>;
