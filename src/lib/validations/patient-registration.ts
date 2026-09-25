import { accountSchema } from "./registration-common";

export const patientRegistrationSchema = accountSchema;
export type PatientRegistrationInput = Parameters<typeof patientRegistrationSchema.parse>[0];
export type PatientRegistrationData = ReturnType<typeof patientRegistrationSchema.parse>;
