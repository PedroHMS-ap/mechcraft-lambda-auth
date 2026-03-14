function normalizeCpf(value) {
  return String(value || '').replace(/\D/g, '');
}

function allDigitsEqual(cpf) {
  return /^(\d)\1{10}$/.test(cpf);
}

function calcDigit(cpf, factorStart) {
  let sum = 0;
  for (let i = 0; i < factorStart - 1; i += 1) {
    sum += Number(cpf[i]) * (factorStart - i);
  }
  const mod = (sum * 10) % 11;
  return mod === 10 ? 0 : mod;
}

function isValidCpf(input) {
  const cpf = normalizeCpf(input);
  if (cpf.length !== 11) return false;
  if (allDigitsEqual(cpf)) return false;

  const d1 = calcDigit(cpf, 10);
  const d2 = calcDigit(cpf, 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

module.exports = {
  normalizeCpf,
  isValidCpf,
};

