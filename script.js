// ==UserScript==
// @name        Auto Translate FULL
// @match       *://*/*
// @run-at      document-end
// ==/UserScript==

(function () {
  const targetLang = "ru"; // <- сюда поставь язык перевода

  // Проверка: страница уже на целевом языке
  const htmlLang =
    (document.documentElement.lang || "").slice(0, 2).toLowerCase();
  if (htmlLang === targetLang) return;

  function inject() {
    if (window._autoTranslateLoaded) return;
    window._autoTranslateLoaded = true;

    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-gadget,
      .goog-logo-link,
      .goog-te-balloon-frame { display:none !important; }
      body { top:0 !important; }
    `;
    document.head.appendChild(style);

    const div = document.createElement("div");
    div.id = "google_translate_element";
    div.style.display = "none";
    document.body.appendChild(div);

    const s = document.createElement("script");
    s.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        {
          pageLanguage: "",
          includedLanguages: targetLang,
          autoDisplay: false,
        },
        "google_translate_element"
      );

      function trigger() {
        const select = document.querySelector("select.goog-te-combo");
        if (!select) return;

        if (select.value !== targetLang) {
          select.value = targetLang;
          select.dispatchEvent(new Event("change"));
        }
      }

      trigger();
      setInterval(trigger, 2500); // держим перевод включенным
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
