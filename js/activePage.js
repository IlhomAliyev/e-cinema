"use strict";

import { launchApp, renderFavMovies } from "./main.js";

export function activePage() {
  const activeMode = document.querySelectorAll('input[name="mode"]');
  const indicator = document.querySelector(".indicator");
  const mainLabel = document.querySelector("#mainLabel");
  const favLabel = document.querySelector("#favLabel");
  const targetMain = document.querySelector(".targetMain");
  const targetFav = document.querySelector(".targetFav");

  activeMode.forEach((item) =>
    item.addEventListener("change", () => toggleMode(item))
  );

  function toggleMode(item) {
    if (item.value === "main") {
      indicator.className = "indicator _main";

      favLabel.classList.remove("_active");
      mainLabel.classList.add("_active");

      targetFav.classList.remove("_active");
      targetMain.classList.add("_active");

      launchApp();
    }

    if (item.value === "fav") {
      indicator.className = "indicator _fav";

      mainLabel.classList.remove("_active");
      favLabel.classList.add("_active");

      targetMain.classList.remove("_active");
      targetFav.classList.add("_active");

      launchApp();
    }
  }
}
