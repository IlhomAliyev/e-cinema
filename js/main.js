"use strict";

import { activateToggle, activePage } from "./activePage.js";
import { appModal, openModalWindow } from "./modal.js";
import { appTheme } from "./theme.js";

const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector("#searchBtn");
const targetElemsWrapper = document.querySelector(".targetWrapper");
const exactResultElem = document.querySelector(".exactResult");
const similarNameElem = document.querySelector(".similarName");
const totalResultsElem = document.querySelector(".totalResults");
const favouriteMoviesElem = document.querySelector(".favouriteMovies");
const favCount = document.querySelector(".favCount");
const loader = document.querySelector(".loader");
const modalContent = document.querySelector(".modalContent");

const API_KEY = "9e90c26b";
export let favouriteMovies =
  JSON.parse(localStorage.getItem("favMovies")) || [];

searchBtn.addEventListener("click", searchHandler);
searchInput.addEventListener("keyup", enterHandler);

document.addEventListener("DOMContentLoaded", handleAppStart);

function handleAppStart() {
  appTheme();
  activateToggle();
  activePage();
  appModal();
}

async function searchHandler() {
  if (validateInput()) {
    toggleLoader(true);

    const searchQuery = searchInput.value;
    await searchExactMovie(searchQuery);
    await searchMovieList(searchQuery);
    launchApp();
  }
}

function enterHandler(e) {
  if (e.code === "Enter") {
    searchHandler();
  }
}

function validateInput() {
  if (searchInput.value.trim() === "") {
    searchInput.classList.add("errorInput");
    searchInput.placeholder = "Enter the name of the movie!";

    setTimeout(() => {
      searchInput.placeholder = "Name of movie";
      searchInput.classList.remove("errorInput");
    }, 1500);

    return false;
  } else {
    return true;
  }
}

async function searchExactMovie(searchQuery) {
  const exactMovieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${searchQuery}`;

  try {
    const exactMovieReq = await fetch(exactMovieURL);
    const exactMovieData = await exactMovieReq.json();
    localStorage.setItem("exactMovieData", JSON.stringify(exactMovieData));
  } catch (error) {
    console.warn("Search exactMovie ERROR:", error);
    toggleLoader(false);
  }
}

async function searchMovieById(movieId) {
  const exactMovieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`;

  try {
    const movieByIdReq = await fetch(exactMovieURL);
    const movieByIdData = await movieByIdReq.json();
    localStorage.setItem("movieById", JSON.stringify(movieByIdData));
  } catch (error) {
    console.warn("Search exactMovie ERROR:", error);
    toggleLoader(false);
  }
}

async function searchMovieList(searchQuery) {
  const movieListURL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;

  try {
    const movieListReq = await fetch(movieListURL);
    const movieListData = await movieListReq.json();
    localStorage.setItem("movieListData", JSON.stringify(movieListData));
  } catch (error) {
    console.warn("Search movieList ERROR:", error);
    toggleLoader(false);
  }
}

export function launchApp() {
  targetElemsWrapper.classList.add("_active");
  toggleLoader(false);

  const exactMovieData = JSON.parse(localStorage.getItem("exactMovieData"));
  const movieListData = JSON.parse(localStorage.getItem("movieListData"));

  renderExactMovie(exactMovieData, exactResultElem);
  renderMovieList(movieListData, similarNameElem);
  renderFavMovies();
}

function toggleLoader(isLoading) {
  isLoading
    ? (loader.className = "loader _active")
    : (loader.className = "loader");
}

export function renderExactMovie(exactMovie, targetElem) {
  let exactMovieHTML = "";

  if (exactMovie.Response === "False") {
    exactMovieHTML = `<p class="app-message">${exactMovie.Error}</p>`;
  }

  if (exactMovie.Response === "True") {
    const favState = isMovieFavourite(exactMovie);

    const exactMoviePoster =
      exactMovie.Poster !== "N/A"
        ? `<img class="poster" src="${exactMovie.Poster}" alt="${exactMovie.Title}" />`
        : `<div class="noPoster">The poster was not found :(</div>`;

    exactMovieHTML = `
    <h4 class="movieTitle">${exactMovie.Title}</h4>
    <div class="exactMovie">
      <div class="movie__controls">
        <div class="favBtn-wrapper ${
          favState ? "_active" : ""
        }" data-moviedata='${JSON.stringify(exactMovie)}'>
          <svg
            class="favBtn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 511.81 489.79"
          >
            <path
              d="M18.58,168.19c7.75-2.15,16.03-2.61,24.11-3.36,41.88-3.86,83.77-7.6,125.67-11.29,3.37-.3,5.13-1.6,6.5-4.81,18.35-43.26,36.92-86.42,55.28-129.68,3.73-8.78,9.35-15.28,18.68-17.95,13.67-3.9,26.92,2.7,32.86,16.48,12.55,29.13,24.94,58.32,37.4,87.48,6.3,14.75,12.7,29.47,18.84,44.29,.96,2.31,3.11,3.9,5.6,4.11,30.8,2.68,61.6,5.45,92.39,8.24,16.89,1.53,33.77,3.09,50.65,4.72,11.76,1.14,19.97,7.36,23.67,18.47,3.85,11.57,.54,21.67-8.57,29.69-35.35,31.07-70.72,62.11-106.2,93.04-3.2,2.79-4.44,5.15-3.4,9.61,10.63,45.78,20.98,91.62,31.4,137.45,2.72,11.97-.07,22.32-10.16,29.66-10.06,7.31-20.75,6.97-31.32,.65-40.35-24.14-80.73-48.24-121.01-72.51-3.44-2.07-5.88-2.12-9.34-.04-40.14,24.17-80.37,48.19-120.6,72.21-13.64,8.14-28.32,6.03-37.16-5.29-5.59-7.16-7.01-15.28-5.02-24.03,10.41-45.83,20.78-91.67,31.4-137.45,1.08-4.67,.22-7.35-3.43-10.52-20.2-17.55-40.33-35.19-60.46-52.83-8.04-7.05-16.01-14.19-24.08-21.2-9.39-8.16-20.15-15.7-27.37-26.01-2.64-3.77-4.6-8.13-4.88-12.72-.29-4.72,1.23-9.41,3.55-13.53,3.25-5.77,8.47-11.08,15-12.89Z"
            />
          </svg>
        </div>
        <div class="movie__poster">
          ${exactMoviePoster}
        </div>
      </div>
      <div class="movie__params">
        <div class="movie__parameter movie__title">
          <span class="primary">Title:</span>
          <span class="secondary">${exactMovie.Title}</span>
        </div>
        <div class="movie__parameter movie__type">
          <span class="primary">Type:</span>
          <span class="secondary">${exactMovie.Type}</span>
        </div>
        <div class="movie__parameter movie__year">
          <span class="primary">Year:</span>
          <span class="secondary">${exactMovie.Year}</span>
        </div>
        <div class="movie__parameter movie__runtime">
          <span class="primary">Runtime:</span>
          <span class="secondary">${exactMovie.Runtime}</span>
        </div>
        <div class="movie__parameter movie__genre">
          <span class="primary">Genre:</span>
          <span class="secondary">${exactMovie.Genre}</span>
        </div>
        <div class="movie__parameter movie__director">
          <span class="primary">Director:</span>
          <span class="secondary">${exactMovie.Director}</span>
        </div>
        <div class="movie__parameter movie__actors">
          <span class="primary">Actors:</span>
          <span class="secondary">${exactMovie.Actors}</span>
        </div>
        <div class="movie__parameter movie__languages">
          <span class="primary">Languages:</span>
          <span class="secondary">${exactMovie.Language}</span>
        </div>
        <div class="movie__parameter movie__country">
          <span class="primary">Country:</span>
          <span class="secondary">${exactMovie.Country}</span>
        </div>
        <div class="movie__parameter movie__awars">
          <span class="primary">Awards:</span>
          <span class="secondary">${exactMovie.Awards}</span>
        </div>
        <div class="movie__parameter movie__rating">
          <span class="primary">Rating (${
            exactMovie.Ratings[1]
              ? exactMovie?.Ratings[1]?.Source
              : exactMovie?.Ratings[0]?.Source
          }):</span>
          <span class="secondary">${
            exactMovie.Ratings[1]?.Value
              ? exactMovie?.Ratings[1]?.Value
              : exactMovie?.Ratings[0]?.Value
          }</span>
        </div>
      </div>
    </div>
    `;
  }

  targetElem.innerHTML = exactMovieHTML;
  addFavBtnToScript();
}

export function renderMovieList(movieList, targetElem) {
  let movieListHTML = "";

  if (movieList.Response === "False") {
    totalResultsElem.innerHTML = `<span class="app-message">0</span>`;
    similarNameElem.classList.remove("_active");
  }

  if (movieList.Response === "True") {
    similarNameElem.classList.add("_active");
    totalResultsElem.innerHTML = movieList.totalResults - 1;

    const allMovies = movieList.Search.slice(1); //? первый фильм попадает в exactMovie

    for (const m in allMovies) {
      if (Object.hasOwnProperty.call(allMovies, m)) {
        const eachMovie = allMovies[m];
        console.log(eachMovie);
        const favState = isMovieFavourite(eachMovie);

        const eachMoviePoster =
          eachMovie.Poster !== "N/A"
            ? `<img class="poster" src="${eachMovie.Poster}" alt="${eachMovie.Title}" />`
            : `<div class="noPoster">The poster was not found :(</div>`;
        // todo решить проблему с кавычками до и после JSON
        // ? решение: иконка содержит только imdbId и при клике на иконку делается запрос по этому ID, а результат запроса пушится в favouriteMovies
        movieListHTML += `
        <div class="movie">
          <div class="favBtn-wrapper ${
            favState ? "_active" : ""
          }" data-moviedata='${JSON.stringify(eachMovie)}'>
            <svg
              class="favBtn"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 511.81 489.79"
            >
              <path
                d="M18.58,168.19c7.75-2.15,16.03-2.61,24.11-3.36,41.88-3.86,83.77-7.6,125.67-11.29,3.37-.3,5.13-1.6,6.5-4.81,18.35-43.26,36.92-86.42,55.28-129.68,3.73-8.78,9.35-15.28,18.68-17.95,13.67-3.9,26.92,2.7,32.86,16.48,12.55,29.13,24.94,58.32,37.4,87.48,6.3,14.75,12.7,29.47,18.84,44.29,.96,2.31,3.11,3.9,5.6,4.11,30.8,2.68,61.6,5.45,92.39,8.24,16.89,1.53,33.77,3.09,50.65,4.72,11.76,1.14,19.97,7.36,23.67,18.47,3.85,11.57,.54,21.67-8.57,29.69-35.35,31.07-70.72,62.11-106.2,93.04-3.2,2.79-4.44,5.15-3.4,9.61,10.63,45.78,20.98,91.62,31.4,137.45,2.72,11.97-.07,22.32-10.16,29.66-10.06,7.31-20.75,6.97-31.32,.65-40.35-24.14-80.73-48.24-121.01-72.51-3.44-2.07-5.88-2.12-9.34-.04-40.14,24.17-80.37,48.19-120.6,72.21-13.64,8.14-28.32,6.03-37.16-5.29-5.59-7.16-7.01-15.28-5.02-24.03,10.41-45.83,20.78-91.67,31.4-137.45,1.08-4.67,.22-7.35-3.43-10.52-20.2-17.55-40.33-35.19-60.46-52.83-8.04-7.05-16.01-14.19-24.08-21.2-9.39-8.16-20.15-15.7-27.37-26.01-2.64-3.77-4.6-8.13-4.88-12.72-.29-4.72,1.23-9.41,3.55-13.53,3.25-5.77,8.47-11.08,15-12.89Z"
              />
            </svg>
          </div>
          <div class="movie__poster">
            ${eachMoviePoster}
          </div>
          <div class="movie__description">
            <p class="movie__title">
              ${eachMovie.Title} |
              <span class="movie__year">${eachMovie.Year}</span>
            </p>
          </div>
        </div>
        `;
      }
    }
  }

  targetElem.innerHTML = movieListHTML;
  addFavBtnToScript();
  addMovieElemstoScript();
}

function addFavBtnToScript() {
  const favBtns = document.getElementsByClassName("favBtn-wrapper");

  for (const eachBtn of favBtns) {
    eachBtn.addEventListener("click", toggleFavMovie);
  }
}

function addMovieElemstoScript() {
  const movieElems = document.querySelectorAll(".movie");

  for (const eachElem of movieElems) {
    eachElem.addEventListener("click", onMovieClickHandler);
  }
}

function isMovieFavourite(currentMovie) {
  // возращает false если фильм НЕ добавлен в массив
  return Boolean(
    favouriteMovies.find((favMovie) => favMovie.imdbID === currentMovie.imdbID)
  );
}

function toggleFavMovie(e) {
  e.stopPropagation();
  const targetBtn = e.target.closest(".favBtn-wrapper");
  targetBtn.classList.toggle("_active");

  const movieData = JSON.parse(targetBtn.dataset.moviedata);

  if (isMovieFavourite(movieData)) {
    favouriteMovies = favouriteMovies.filter(
      (favMovie) => favMovie.imdbID !== movieData.imdbID
    );
  } else {
    favouriteMovies.push(movieData);
  }

  localStorage.setItem("favMovies", JSON.stringify(favouriteMovies));
  activateToggle();
  renderFavMovies();
  console.log("Favourite Movies: ", favouriteMovies);
}

export function renderFavMovies() {
  let favMoviesHTML = "";

  if (favouriteMovies.length === 0) {
    favCount.innerHTML = `<span class="app-message">0</span>`;
    favMoviesHTML = `<span class="app-message">There are no favourite movies here yet...</span>`;
  } else {
    favCount.innerHTML = `<span class="app-message">${favouriteMovies.length}</span>`;

    for (const m in favouriteMovies) {
      if (Object.hasOwnProperty.call(favouriteMovies, m)) {
        const favMovie = favouriteMovies[m];
        const favState = isMovieFavourite(favMovie);

        const favMoviePoster =
          favMovie.Poster !== "N/A"
            ? `<img class="poster" src="${favMovie.Poster}" alt="${favMovie.Title}" />`
            : `<div class="noPoster">The poster was not found :(</div>`;

        favMoviesHTML += `
          <div class="movie">
            <div class="favBtn-wrapper ${
              favState ? "_active" : ""
            }" data-moviedata='${JSON.stringify(favMovie)}'>
              <svg
                class="favBtn"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 511.81 489.79"
              >
                <path
                  d="M18.58,168.19c7.75-2.15,16.03-2.61,24.11-3.36,41.88-3.86,83.77-7.6,125.67-11.29,3.37-.3,5.13-1.6,6.5-4.81,18.35-43.26,36.92-86.42,55.28-129.68,3.73-8.78,9.35-15.28,18.68-17.95,13.67-3.9,26.92,2.7,32.86,16.48,12.55,29.13,24.94,58.32,37.4,87.48,6.3,14.75,12.7,29.47,18.84,44.29,.96,2.31,3.11,3.9,5.6,4.11,30.8,2.68,61.6,5.45,92.39,8.24,16.89,1.53,33.77,3.09,50.65,4.72,11.76,1.14,19.97,7.36,23.67,18.47,3.85,11.57,.54,21.67-8.57,29.69-35.35,31.07-70.72,62.11-106.2,93.04-3.2,2.79-4.44,5.15-3.4,9.61,10.63,45.78,20.98,91.62,31.4,137.45,2.72,11.97-.07,22.32-10.16,29.66-10.06,7.31-20.75,6.97-31.32,.65-40.35-24.14-80.73-48.24-121.01-72.51-3.44-2.07-5.88-2.12-9.34-.04-40.14,24.17-80.37,48.19-120.6,72.21-13.64,8.14-28.32,6.03-37.16-5.29-5.59-7.16-7.01-15.28-5.02-24.03,10.41-45.83,20.78-91.67,31.4-137.45,1.08-4.67,.22-7.35-3.43-10.52-20.2-17.55-40.33-35.19-60.46-52.83-8.04-7.05-16.01-14.19-24.08-21.2-9.39-8.16-20.15-15.7-27.37-26.01-2.64-3.77-4.6-8.13-4.88-12.72-.29-4.72,1.23-9.41,3.55-13.53,3.25-5.77,8.47-11.08,15-12.89Z"
                />
              </svg>
            </div>
            <div class="movie__poster">
              ${favMoviePoster}
            </div>
          <div class="movie__description">
            <p class="movie__title">
              ${favMovie.Title} |
              <span class="movie__year">${favMovie.Year}</span>
            </p>
          </div>
        </div>
          `;
      }
    }
  }

  favouriteMoviesElem.innerHTML = favMoviesHTML;
  addFavBtnToScript();
  addMovieElemstoScript();
}

async function onMovieClickHandler(event) {
  const exactMovieData = JSON.parse(
    event.target.closest(".movie").firstElementChild.dataset.moviedata
  );
  const exactMovieId = exactMovieData.imdbID;
  await searchMovieById(exactMovieId);
  const movieById = JSON.parse(localStorage.getItem("movieById"));

  openModalWindow();
  renderExactMovie(movieById, modalContent);
}
