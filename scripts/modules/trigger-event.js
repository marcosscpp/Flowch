export default function triggerEvent(eventName) {
  fetch("./php/fbevent.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventName }),
  });
}
