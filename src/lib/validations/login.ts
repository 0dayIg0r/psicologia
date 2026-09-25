import { z } from "zod";
import { emailSchema } from "./registration-common";

export const loginRoleSchema = z.enum(["PATIENT", "PSYCHOLOGIST"]);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
  role: loginRoleSchema,
});

export type LoginData = z.infer<typeof loginSchema>;
