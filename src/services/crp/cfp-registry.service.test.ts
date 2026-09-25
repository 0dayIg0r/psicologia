import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyCrpRegistration } from "./cfp-registry.service";

const profileUrl =
  "https://cadastro.cfp.org.br/visualizar.html?profissional=wEu0WdwObKp5HHaGT8WYkKciYEJ60ecN11W8X81imPw%3D";

function mockRegistry(records: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(records), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

describe("verifyCrpRegistration", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("confirma nome, região, número e situação ativa", async () => {
    mockRegistry([
      {
        Nome: "MARIA RITA DE SOUSA CASTILHO COSTA",
        nomeregional: "06ª Região - SP",
        registro: "168661",
        situacao: "ATIVO",
        dataInscricao: "2021-03-11",
      },
    ]);

    const result = await verifyCrpRegistration({
      name: "Maria Rita de Sousa Castilho Costa",
      crp: "06/168661",
      cfpProfileUrl: profileUrl,
    });

    expect(result.crp).toBe("06/168661");
    expect(result.professionalName).toBe("MARIA RITA DE SOUSA CASTILHO COSTA");
  });

  it("rejeita registro inativo", async () => {
    mockRegistry([
      {
        Nome: "MARIA RITA DE SOUSA CASTILHO COSTA",
        nomeregional: "06ª Região - SP",
        registro: "168661",
        situacao: "INATIVO",
      },
    ]);

    await expect(
      verifyCrpRegistration({
        name: "Maria Rita de Sousa Castilho Costa",
        crp: "06/168661",
        cfpProfileUrl: profileUrl,
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejeita perfil de outra pessoa", async () => {
    mockRegistry([
      {
        Nome: "OUTRA PESSOA",
        nomeregional: "06ª Região - SP",
        registro: "168661",
        situacao: "ATIVO",
      },
    ]);

    await expect(
      verifyCrpRegistration({
        name: "Maria Rita de Sousa Castilho Costa",
        crp: "06/168661",
        cfpProfileUrl: profileUrl,
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("diferencia indisponibilidade do CFP de registro inválido", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));

    await expect(
      verifyCrpRegistration({
        name: "Maria Rita de Sousa Castilho Costa",
        crp: "06/168661",
        cfpProfileUrl: profileUrl,
      }),
    ).rejects.toMatchObject({ status: 503 });
  });
});
