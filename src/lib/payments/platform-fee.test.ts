import { describe, expect, it } from "vitest";
import { calculatePaymentSplit, PLATFORM_FEE_RATE } from "./platform-fee";

describe("calculatePaymentSplit", () => {
  it.each([
    ["20000", "1000", "19000"],
    ["9000", "450", "8550"],
    ["9999", "500", "9499"],
  ])("aplica 5%% sobre %s centavos", (gross, platform, psychologist) => {
    const split = calculatePaymentSplit(BigInt(gross));
    expect(split).toMatchObject({
      grossCents: BigInt(gross),
      platformFeeCents: BigInt(platform),
      psychologistCents: BigInt(psychologist),
      platformFeeRate: PLATFORM_FEE_RATE,
    });
  });

  it("mantém a taxa do provedor separada do split", () => {
    const split = calculatePaymentSplit(BigInt(20000), BigInt(778));
    expect(split.providerFeeCents).toBe(BigInt(778));
    expect(split.platformFeeCents + split.psychologistCents).toBe(split.grossCents);
  });

  it("rejeita valores financeiros inválidos", () => {
    expect(() => calculatePaymentSplit(BigInt(-1))).toThrow(RangeError);
    expect(() => calculatePaymentSplit(BigInt(100), BigInt(101))).toThrow(RangeError);
  });
});
