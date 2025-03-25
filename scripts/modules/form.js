import {
  validateCompleteName,
  validatePhone,
  validateCNPJ,
} from "../utils/validate.js";
import debounce from "../utils/debounce.js";
import Toast from "../utils/toast.js";

const toast = new Toast();

export default class BasicForm {
  constructor(formSelector) {
    this.errorTypes = [
      "valueMissing",
      "typeMismatch",
      "customError",
      "patternMismatch",
      "tooShort",
    ];

    this.errorMessages = {
      name: {
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido.",
        tooShort: "Por favor, preencha um nome válido.",
      },
      email: {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um email válido.",
      },
      phone: {
        valueMissing: "O campo de telefone não pode estar vazio.",
        patternMismatch: "Digite um número de telefone válido.",
        tooShort: "O campo de celular não tem dígitos suficientes.",
      },
      company: {
        valueMissing: "O campo de empresa não pode estar vazio.",
      },
      socialMedia: {
        valueMissing: "O campo de rede social ou site não pode estar vazio.",
      },
      revenue: {
        valueMissing: "Selecione uma opção de faturamento.",
      },
      cnpj: {
        valueMissing: "O campo de CNPJ não pode estar vazio.",
      },
    };

    this.formElement = document.querySelector(formSelector);
    this.fields = this.formElement.querySelectorAll("input, select");
    this.disableDefaultError();
    this.enabledPhoneMask();
    this.enableCNPJMask();
    this.initFields();
    this.initSubmit();
  }

  initSubmit() {
    const form = this.formElement;
    const toast = new Toast();

    form.querySelector("[type='submit']").addEventListener("click", () => {
      this.fields.forEach((field) => {
        if (field.hasAttribute("required") || field.value.trim().length > 0) {
          this.checkField(field);
        }
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      // Google UTM Params
      const param = new URLSearchParams(window.location.search);
      param.forEach((value, key) => {
        formData.set(key, value);
      });

      try {
        const metaApiResponse = await fetch("./php/pixel-submit.php", {
          method: "POST",
          body: formData,
        });

        const rdResponse = await fetch("./php/rd-submit.php", {
          method: "POST",
          body: formData,
        });

        const result = await rdResponse.json();

        if (result.erro) {
          toast.createToast(result.errorMessage, "error");
        } else {
          const url = "https://atardigital.com.br/proximos-passos";
          toast.createToast("Formulário enviado com sucesso!", "success");
          this.formElement.reset();
          window.open(url, "_blank");
        }
      } catch (error) {
        toast.createToast(
          "Erro no envio do formulário. Tente novamente.",
          "error"
        );
      }
    });
  }

  toggleCNPJVisibility() {
    const CNPJInput = this.formElement.cnpj;
    const CNPJContainer = CNPJInput.parentElement;
    const revenueValue = this.formElement.revenue;
    if (CNPJContainer && revenueValue.selectedIndex === 1) {
      CNPJContainer.classList.remove("field--hidden");
      CNPJInput.setAttribute("required", true);
    } else {
      CNPJContainer.classList.add("field--hidden");
      CNPJInput.removeAttribute("required");
    }
  }

  enableCNPJMask() {
    this.formElement.querySelectorAll("[name='cnpj']").forEach((cnpjInput) => {
      cnpjInput.addEventListener("input", (e) => {
        let formattedCNPJ = e.target.value.replace(/\D/g, "");

        if (formattedCNPJ.length > 14) {
          formattedCNPJ = formattedCNPJ.slice(0, 14);
        }

        formattedCNPJ = formattedCNPJ
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");

        e.target.value = formattedCNPJ;
      });
    });
  }

  disableDefaultError() {
    this.fields.forEach((field) =>
      field.addEventListener("invalid", (e) => e.preventDefault())
    );
  }

  initFields() {
    this.fields.forEach((field) => {
      const errorMessage = field.nextElementSibling;
      const checkFunc = debounce(() => {
        this.checkField(field);
      }, 500);

      if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
        field.addEventListener("keyup", (e) => {
          e.preventDefault();
          checkFunc();
        });
      } else if (field.tagName === "SELECT") {
        field.addEventListener("change", (e) => {
          e.preventDefault();
          checkFunc();
        });
      }
    });
  }

  enabledPhoneMask() {
    this.formElement.querySelectorAll("[type='tel']").forEach((tel) => {
      tel.addEventListener("input", (e) => {
        let formattedNumber = e.target.value.replace(/\D/g, "");

        if (formattedNumber.length > 13) {
          formattedNumber = formattedNumber.slice(0, 13);
        }

        if (formattedNumber.length > 2) {
          const ddi = formattedNumber.slice(0, 2);
          const restOfNumber = formattedNumber.slice(2);

          let formatted = restOfNumber.replace(/^(\d{2})(\d)/g, "($1) $2");
          formatted = formatted.replace(/(\d)(\d{4})$/, "$1-$2");

          formattedNumber = `+${ddi} ${formatted}`;
        }

        e.target.value = formattedNumber;
      });
    });
  }

  checkField(field) {
    let msg;
    field.setCustomValidity("");
    if (field.name == "name") {
      validateCompleteName(field, 1, 2);
    } else if (field.name == "phone") {
      validatePhone(field);
    } else if (field.name == "revenue") {
      this.toggleCNPJVisibility();
    } else if (field.name == "cnpj") {
      validateCNPJ(field);
    }

    this.errorTypes.forEach((erro) => {
      if (field.validity[erro]) {
        msg = this.errorMessages[field.name][erro];
        if (erro === "customError") msg = field.validationMessage;
      }
    });

    const inputValidator = field.checkValidity();
    const messageBox = field.nextElementSibling;

    if (!inputValidator && !field.disabled) {
      messageBox.innerText = msg;
      messageBox.classList.add("active");
      field.classList.add("error");
    } else {
      messageBox.innerText = "";
      messageBox.classList.remove("active");
      field.classList.remove("error");
    }
  }
}
