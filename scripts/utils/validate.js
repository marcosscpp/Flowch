export const validateCompleteName = (field, minNameQuantity, minLength) => {
  const value = field.value.trim();
  const nameParts = value.split(" ");
  if (nameParts.length < minNameQuantity) {
    field.setCustomValidity(`Insira nome e sobrenome.`);
    return;
  }

  for (const part of nameParts) {
    if (part.length < minLength) {
      field.setCustomValidity(`Insira um nome válido.`);
      return;
    }
  }
  const namePattern = /^[a-zA-Z\sÀ-ÿ]+$/;

  if (!namePattern.test(value)) {
    field.setCustomValidity("O nome deve conter apenas letras e espaços.");
    return;
  }
  field.setCustomValidity("");
};

export const validatePhone = (field) => {
  const value = field.value.trim().replace(/\D/g, "");
  const minLength = 12;
  if (value.length < minLength) {
    field.setCustomValidity(`O campo de celular não tem dígitos suficientes.`);
    return;
  }

  field.setCustomValidity("");
};

export const validateCNPJ = (field) => {
  const value = field.value.trim().replace(/\D/g, "");

  if (value.length !== 14) {
    field.setCustomValidity("O CNPJ deve conter 14 dígitos.");
    return;
  }

  if (/^0{14}$/.test(value)) {
    field.setCustomValidity("CNPJ inválido.");
    return;
  }

  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let n = 0;

  for (let i = 0; i < 12; n += value[i] * b[++i]);
  if (parseInt(value[12]) !== ((n % 11) < 2 ? 0 : 11 - (n % 11))) {
    field.setCustomValidity("CNPJ inválido.");
    return;
  }

  n = 0;
  for (let i = 0; i <= 12; n += value[i] * b[i++]);
  if (parseInt(value[13]) !== ((n % 11) < 2 ? 0 : 11 - (n % 11))) {
    field.setCustomValidity("CNPJ inválido.");
    return;
  }

  field.setCustomValidity("");
};