import { describe, expect, it } from "vitest";
import { psychologistRegistrationSchema } from "./psychologist-registration";

const validPsychologist = {
  name: "Ana de Souza",
  cpf: "52998224725",
  email: "ana@example.com",
  phone: "11999991234",
  password: "uma-senha-segura",
  confirmPassword: "uma-senha-segura",
  acceptedTerms: true,
  acceptedPrivacy: true,
  crp: "06/123456",
  cfpProfileUrl:
    "https://cadastro.cfp.org.br/visualizar.html?profissional=wEu0WdwObKp5HHaGT8WYkKciYEJ60ecN11W8X81imPw%3D",
  bio: "Atendimento acolhedor.",
  offersOnline: true,
  offersInPerson: false,
  themeIds: ["7dfbf11b-bc40-455e-b885-123be8eef6c5"],
  suggestedThemes: ["Mudanças de carreira"],
  standardPrice: "R$ 200,00",
  offersSocial: true,
  socialPrice: "90,00",
};

describe("psychologistRegistrationSchema", () => {
  it("normaliza CRP e converte preços para centavos", () => {
    const data = psychologistRegistrationSchema.parse(validPsychologist);
    expect(data.crp).toBe("06/123456");
    expect(data.standardPrice).toBe(BigInt(20000));
    expect(data.socialPrice).toBe(BigInt(9000));
  });

  it("exige ao menos uma modalidade", () => {
    const result = psychologistRegistrationSchema.safeParse({
      ...validPsychologist,
      offersOnline: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.offersOnline).toBeDefined();
  });

  it("exige endereço completo para atendimento presencial", () => {
    const result = psychologistRegistrationSchema.safeParse({
      ...validPsychologist,
      offersInPerson: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.address).toBeDefined();
  });

  it("exige valor quando a modalidade social está ativa", () => {
    const result = psychologistRegistrationSchema.safeParse({
      ...validPsychologist,
      socialPrice: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.socialPrice).toBeDefined();
  });

  it("aceita somente links de perfil do domínio oficial do CFP", () => {
    const result = psychologistRegistrationSchema.safeParse({
      ...validPsychologist,
      cfpProfileUrl: "https://exemplo.com/visualizar.html?profissional=codigo-falso",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.cfpProfileUrl).toBeDefined();
  });
});
