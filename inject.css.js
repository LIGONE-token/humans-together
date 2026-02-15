(function () {

  // Prüfen ob CSS schon geladen wurde
  if (document.querySelector('link[data-global-style]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/style.css";   // Pfad ggf. anpassen!
  link.setAttribute("data-global-style", "true");

  document.head.appendChild(link);

})();
