export default class Toast {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.width = "80%";
    container.style.maxWidth = "600px";
    document.body.appendChild(container);
    return container;
  }

  createToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "relative";
    toast.style.padding = "20px 40px";
    toast.style.textAlign = "center";
    toast.style.borderRadius = "5px 5px 0 0";
    toast.style.color = "#fff";
    toast.style.fontFamily = "Inter, sans-serif";
    toast.style.fontWeight = "bold";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    toast.style.transition = "opacity 0.5s, transform 0.5s";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.overflow = "hidden";

    switch (type) {
      case "success":
        toast.style.backgroundColor = "#4caf50";
        break;
      case "error":
        toast.style.backgroundColor = "#f44336";
        break;
      case "warning":
        toast.style.backgroundColor = "#ff9800";
        break;
      default:
        toast.style.backgroundColor = "#2196f3";
    }

    const progressBar = document.createElement("div");
    progressBar.style.position = "absolute";
    progressBar.style.bottom = "0";
    progressBar.style.left = "0";
    progressBar.style.height = "5px";
    progressBar.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = "100%";

    toast.appendChild(progressBar);

    this.container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
      progressBar.style.width = "0";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 500);
    }, duration);
  }
}