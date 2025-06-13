import Hotjar from "@hotjar/browser";

export default function initHotjar() {
  const siteId = 5353024;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);
}
