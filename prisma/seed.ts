import "dotenv/config";
import { getPrisma } from "../src/lib/prisma";

const themes = [
  ["Relacionamentos", "relacionamentos"],
  ["Ansiedade", "ansiedade"],
  ["Depressão", "depressao"],
  ["Autoestima", "autoestima"],
  ["Vida pessoal e mudanças", "vida-pessoal-e-mudancas"],
  ["Luto e perdas", "luto-e-perdas"],
  ["Estresse e burnout", "estresse-e-burnout"],
] as const;

const prisma = getPrisma();

async function main() {
  await prisma.$transaction(
    async (transaction) => {
      for (const [name, slug] of themes) {
        await transaction.theme.upsert({
        where: { slug },
        create: { name, slug, status: "APPROVED", active: true },
        update: { name, status: "APPROVED", active: true },
        });
      }
    },
    { maxWait: 15_000, timeout: 30_000 },
  );
}

main()
  .catch((error) => {
    console.error("Falha ao executar o seed de temas.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
