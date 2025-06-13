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
  const minLength = 10;
  if (value.length < minLength) {
    field.setCustomValidity(`O campo de celular não tem dígitos suficientes.`);
    return;
  }

  field.setCustomValidity("");
};