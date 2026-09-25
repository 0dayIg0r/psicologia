const MONEY_PATTERN = /^\d{1,8}(?:[.,]\d{1,2})?$/;

export function parseMoneyToCents(input: string): bigint | null {
  const cleaned = input.trim().replace(/R\$/gi, "").replace(/\s/g, "");
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;

  if (!MONEY_PATTERN.test(normalized)) return null;
  const [reais, decimals = ""] = normalized.split(".");
  return BigInt(reais) * BigInt(100) + BigInt(decimals.padEnd(2, "0"));
}

export function centsToDecimal(cents: bigint) {
  const absolute = cents < BigInt(0) ? -cents : cents;
  const sign = cents < BigInt(0) ? "-" : "";
  return `${sign}${absolute / BigInt(100)}.${String(absolute % BigInt(100)).padStart(2, "0")}`;
}

export function formatBrlFromCents(cents: bigint) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(cents) / 100);
}
