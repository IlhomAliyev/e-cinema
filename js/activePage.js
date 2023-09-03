"use strict";

import { favouriteMovies, launchApp } from "./main.js";

const activeMode = document.querySelectorAll('input[name="mode"]');
const indicator = document.querySelector(".indicator");
const mainLabel = document.querySelector("#mainLabel");
const favLabel = document.querySelector("#favLabel");
const targetMain = document.querySelector(".targetMain");
const targetFav = document.querySelector(".targetFav");
const toggleWrapper = document.querySelector(".toggleWrapper");

export let currentPage = "main";

export function activePage() {
  activeMode.forEach((item) =>
    item.addEventListener("change", () => {
      currentPage = item.value;
      toggleMode();
    })
  );
}

export function activateToggle() {
  if (favouriteMovies.length !== 0) {
    toggleWrapper.classList.add("_active");
  }

  if (favouriteMovies.length === 0 && currentPage !== "fav") {
    toggleWrapper.classList.remove("_active");
  }
}

function toggleMode() {
  if (currentPage === "main") {
    indicator.className = "indicator _main";

    favLabel.classList.remove("_active");
    mainLabel.classList.add("_active");

    targetFav.classList.remove("_active");
    targetMain.classList.add("_active");

    launchApp();
  }

  if (currentPage === "fav") {
    indicator.className = "indicator _fav";

    mainLabel.classList.remove("_active");
    favLabel.classList.add("_active");

    targetMain.classList.remove("_active");
    targetFav.classList.add("_active");

    launchApp();
  }
}
