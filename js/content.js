// Selenized Docs — content script.
//
// El CSS se aplica por defecto (html:not([data-sd="off"])) y este script solo
// marca las excepciones. Es al revés de lo intuitivo, pero es lo que evita el
// destello blanco: leer chrome.storage es asíncrono, así que si el tema
// dependiera de que el JS lo active, la página se vería clara unos ms.

const DEFAULTS = { enabled: true, theme: "selenized", paper: "tinted" };

function apply({ enabled, theme, paper }) {
  const html = document.documentElement;
  if (enabled) html.removeAttribute("data-sd");
  else html.setAttribute("data-sd", "off");
  html.setAttribute("data-sd-theme", theme);
  html.setAttribute("data-sd-paper", paper);
}

chrome.storage.local.get(DEFAULTS, apply);

// Reaccionar en caliente cuando se cambia algo desde el popup.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  chrome.storage.local.get(DEFAULTS, apply);
});
