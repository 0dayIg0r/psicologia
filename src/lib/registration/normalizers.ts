export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeEmail(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeCpf(value: string) {
  return onlyDigits(value);
}

export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const digit = (length: number) => {
    const total = cpf
      .slice(0, length)
      .split("")
      .reduce((sum, number, index) => sum + Number(number) * (length + 1 - index), 0);
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function normalizePhone(value: string) {
  let digits = onlyDigits(value);
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  return `+55${digits}`;
}

export function isValidPhone(value: string) {
  const digits = onlyDigits(value).replace(/^55(?=\d{10,11}$)/, "");
  return /^\d{10,11}$/.test(digits) && !/^(\d)\1+$/.test(digits);
}

export function normalizeCrp(value: string) {
  const digits = onlyDigits(value);
  return digits.length >= 6 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function isValidCrp(value: string) {
  return /^\d{2}\/\d{4,6}$/.test(normalizeCrp(value));
}

export function normalizeCep(value: string) {
  return onlyDigits(value);
}

export function normalizeState(value: string) {
  return value.trim().toUpperCase();
}

export function slugify(value: string) {
  return normalizeName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
