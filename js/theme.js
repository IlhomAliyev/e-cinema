"use strict";

const darkTheme = "darkTheme";
const lightTheme = "lightTheme";
let themeState = localStorage.getItem("themeState") || lightTheme;

export function appTheme() {
  const themeIcon = document.querySelector(".themeIcon");
  themeIcon.addEventListener("click", changeTheme);

  themeState === darkTheme
    ? (document.body.dataset.theme = darkTheme)
    : (document.body.dataset.theme = lightTheme);
}

function changeTheme() {
  themeState === lightTheme
    ? (themeState = darkTheme)
    : (themeState = lightTheme);

  localStorage.setItem("themeState", themeState);

  if (themeState === darkTheme) {
    document.body.dataset.theme = darkTheme;
  }

  if (themeState === lightTheme) {
    document.body.dataset.theme = lightTheme;
  }
}
