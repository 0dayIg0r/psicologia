import { describe, expect, it } from "vitest";
import { loginSchema } from "./login";

describe("loginSchema", () => {
  it("normalizes email and accepts both account roles", () => {
    const result = loginSchema.parse({
      email: "  PSICOLOGO.DEV@EXAMPLE.COM ",
      password: "senha-segura",
      role: "PSYCHOLOGIST",
    });

    expect(result.email).toBe("psicologo.dev@example.com");
    expect(result.role).toBe("PSYCHOLOGIST");
  });

  it("rejects a role that cannot be selected in the public login", () => {
    const result = loginSchema.safeParse({
      email: "patient@example.com",
      password: "senha-segura",
      role: "ADMIN",
    });

    expect(result.success).toBe(false);
  });
});
