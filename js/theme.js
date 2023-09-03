"use strict";

export function appTheme() {
  const themeIcon = document.querySelector(".themeIcon");
  themeIcon.addEventListener("click", changeTheme);

  let themeState = localStorage.getItem("themeState") || "light";

  document.addEventListener("DOMContentLoaded", () => {
    themeState === "dark"
      ? (document.body.dataset.theme = "dark")
      : (document.body.dataset.theme = "light");
  });

  function changeTheme() {
    themeState === "light" ? (themeState = "dark") : (themeState = "light");
    localStorage.setItem("themeState", themeState);

    if (themeState === "dark") {
      document.body.dataset.theme = "dark";
    }

    if (themeState === "light") {
      document.body.dataset.theme = "light";
    }
  }
}
