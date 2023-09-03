"use strict";

import { launchApp } from "./main.js";
const modalWindow = document.querySelector(".modal");

export function appModal() {
  modalWindow.addEventListener("click", (e) => {
    if (
      !e.target.closest(".modalContent") &&
      modalWindow.classList.contains("_active")
    ) {
      closeModalWindow();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.code === "Escape" && modalWindow.classList.contains("_active")) {
      closeModalWindow();
    }
  });
}

function closeModalWindow() {
  modalWindow.classList.remove("_active");
  document.body.style.overflow = "auto";
  launchApp();
}

export function openModalWindow() {
  modalWindow.classList.add("_active");
  document.body.style.overflow = "hidden";
}
