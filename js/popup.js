const DEFAULTS = { enabled: true, theme: "selenized", paper: "tinted" };
const $ = (id) => document.getElementById(id);

chrome.storage.local.get(DEFAULTS, (s) => {
  $("enabled").checked = s.enabled;
  $("theme").value = s.theme;
  $("paper").value = s.paper;
});

$("enabled").addEventListener("change", (e) =>
  chrome.storage.local.set({ enabled: e.target.checked }));
$("theme").addEventListener("change", (e) =>
  chrome.storage.local.set({ theme: e.target.value }));
$("paper").addEventListener("change", (e) =>
  chrome.storage.local.set({ paper: e.target.value }));
