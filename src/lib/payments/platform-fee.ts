export const PLATFORM_FEE_PERCENT = BigInt(5);
export const PLATFORM_FEE_RATE = "0.05000";

export type PaymentSplit = {
  grossCents: bigint;
  platformFeeCents: bigint;
  psychologistCents: bigint;
  providerFeeCents: bigint;
  platformFeeRate: typeof PLATFORM_FEE_RATE;
};

export function calculatePaymentSplit(
  grossCents: bigint,
  providerFeeCents = BigInt(0),
): PaymentSplit {
  if (grossCents < BigInt(0)) throw new RangeError("O valor bruto não pode ser negativo.");
  if (providerFeeCents < BigInt(0) || providerFeeCents > grossCents) {
    throw new RangeError("A taxa do provedor deve estar entre zero e o valor bruto.");
  }

  // Positive values use half-up rounding to the nearest cent.
  const platformFeeCents = (grossCents * PLATFORM_FEE_PERCENT + BigInt(50)) / BigInt(100);

  return {
    grossCents,
    platformFeeCents,
    psychologistCents: grossCents - platformFeeCents,
    providerFeeCents,
    platformFeeRate: PLATFORM_FEE_RATE,
  };
}
