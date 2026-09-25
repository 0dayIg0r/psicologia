import { describe, expect, it } from "vitest";
import { patientRegistrationSchema } from "./patient-registration";

const validPatient = {
  name: "  Maria   da Silva ",
  cpf: "529.982.247-25",
  email: " MARIA@EXEMPLO.COM ",
  phone: "(11) 99999-1234",
  password: "uma-senha-segura",
  confirmPassword: "uma-senha-segura",
  acceptedTerms: true,
  acceptedPrivacy: true,
};

describe("patientRegistrationSchema", () => {
  it("normaliza dados válidos", () => {
    const data = patientRegistrationSchema.parse(validPatient);
    expect(data).toMatchObject({
      name: "Maria da Silva",
      cpf: "52998224725",
      email: "maria@exemplo.com",
      phone: "+5511999991234",
    });
  });

  it("rejeita CPF e consentimentos inválidos", () => {
    const result = patientRegistrationSchema.safeParse({
      ...validPatient,
      cpf: "111.111.111-11",
      acceptedPrivacy: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.cpf).toBeDefined();
      expect(fields.acceptedPrivacy).toBeDefined();
    }
  });

  it("rejeita senhas diferentes", () => {
    const result = patientRegistrationSchema.safeParse({
      ...validPatient,
      confirmPassword: "senha-diferente",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
  });
});
