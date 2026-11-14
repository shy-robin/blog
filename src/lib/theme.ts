export const themeStorageKey = "shyrobin-theme";

// Runs before the page paints; keep it self-contained and independent of React.
export const themeInitScript = `(function(){
  var theme;
  try { theme = localStorage.getItem("shyrobin-theme"); } catch (_) {}
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();`;
