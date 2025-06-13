import { validateCompleteName, validatePhone } from "../utils/validate.js";
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
      company: {
        valueMissing: "O campo de nome da empresa não pode estar vazio.",
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
      revenue: {
        valueMissing: "Selecione o faturamento mensal da sua empresa.",
      },
      "team-size": {
        valueMissing: "Selecione o tamanho do seu time comercial.",
      },
    };

    this.formElement = document.querySelector(formSelector);
    this.fields = this.formElement.querySelectorAll("input, select");
    this.disableDefaultError();
    this.enabledPhoneMask();
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

      const submitBtn = this.formElement.querySelector("[type='submit']");
      try {
        submitBtn.setAttribute("disabled", true);
        const metaApiResponse = await fetch("./php/pixel-submit.php", {
          method: "POST",
          body: formData,
        });

        const response = await fetch("./php/submit.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.erro) {
          toast.createToast(result.errorMessage, "error");
        } else {
          const url = "http://lp.flowch.com/obrigado";
          toast.createToast("Formulário enviado com sucesso!", "success");
          this.formElement.reset();
          window.open(url, "_blank");
        }
      } catch (error) {
        toast.createToast(
          "Erro no envio do formulário. Tente novamente.",
          "error"
        );
      } finally {
        submitBtn.removeAttribute("disabled");
      }
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
  
        if (formattedNumber.startsWith("55") && formattedNumber.length > 11) {
          formattedNumber = formattedNumber.slice(2);
        }
  
        if (formattedNumber.length > 11) {
          formattedNumber = formattedNumber.slice(0, 11);
        }
  
        if (formattedNumber.length >= 2) {
          const ddd = formattedNumber.slice(0, 2);
          const number = formattedNumber.slice(2);
  
          let formatted = number.replace(/^(\d{5})(\d{0,4})/, "$1-$2");
          if (number.length <= 8) {
            formatted = number.replace(/^(\d{4})(\d{0,4})/, "$1-$2");
          }
  
          formattedNumber = `(${ddd}) ${formatted}`.trim();
        }
  
        e.target.value = formattedNumber;
      });
    });
  }
  

  checkField(field) {
    let msg;
    field.setCustomValidity("");
    if (field.name == "name") {
      validateCompleteName(field, 2, 2);
    } else if (field.name == "phone") {
      validatePhone(field);
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
