"use strict";

const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector("#searchBtn");
const themeIcon = document.querySelector(".themeIcon");
const searchResultElem = document.querySelector(".searchResult");
const exactResultElem = document.querySelector(".exactResult");
const similarNameElem = document.querySelector(".similarName");
const totalResultsElem = document.querySelector(".totalResults");
const favBtns = document.getElementsByClassName("favBtn");

searchBtn.addEventListener("click", searchMovie);
themeIcon.addEventListener("click", changeTheme);
searchInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    searchMovie();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  appTheme = localStorage.getItem("appTheme");

  if (appTheme === "dark") {
    document.body.dataset.theme = "dark";
  }

  if (appTheme === "light") {
    document.body.dataset.theme = "light";
  }
});

const favourites = [];
let appTheme = "light";

function changeTheme() {
  appTheme === "light" ? (appTheme = "dark") : (appTheme = "light");
  localStorage.setItem("appTheme", appTheme);

  if (appTheme === "dark") {
    document.body.dataset.theme = "dark";
  }

  if (appTheme === "light") {
    document.body.dataset.theme = "light";
  }
}

const API_KEY = "9e90c26b";

function validateInput() {
  if (searchInput.value.trim() === "") {
    searchInput.value = "Enter the name of the movie";
    searchInput.classList.add("_error");

    setTimeout(() => {
      searchInput.value = "";
      searchInput.classList.remove("_error");
    }, 1_500);
  }
}

async function searchMovie() {
  validateInput();
  const searchQuery = searchInput.value;
  const movieListURL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;
  const exactMovieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${searchQuery}`;

  try {
    const exactMovieReq = await fetch(exactMovieURL);
    const exactMovieData = await exactMovieReq.json();

    const movieListReq = await fetch(movieListURL);
    const movieListData = await movieListReq.json();

    displayExactMovie(exactMovieData);
    displayMovieList(movieListData);
  } catch (error) {
    console.warn("ERROR:", error);
  }
}

function displayExactMovie(exactMovie) {
  console.log("exactMovie: ", exactMovie);

  let exactMovieHTML = "";
  searchResultElem.classList.add("_active");

  if (exactMovie.Response === "False") {
    exactMovieHTML = exactMovie.Error;
  }

  if (exactMovie.Response === "True") {
    let moviePosterImg = `<img src="${exactMovie.Poster}" alt="${exactMovie.Title}" class="movie__poster" />`;
    let moviePosterDiv = `<div class="noPoster">The poster was not found :(</div>`;
    exactMovieHTML = `
    <div class="exactMovie">
      <div class="movie__controls">
        <button class="favBtn" data-movieid="${
          exactMovie.imdbID
        }">Add to favorites</button>
        ${exactMovie.Poster !== "N/A" ? moviePosterImg : moviePosterDiv}
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
          <span class="primary">Rating (Rotten Tomatoes):</span>
          <span class="secondary">${exactMovie.Ratings[1].Value}</span>
        </div>
      </div>
    </div>
    `;
  }

  exactResultElem.innerHTML = exactMovieHTML;
}

function displayMovieList(movieList) {
  console.log("movieList: ", movieList.Search);

  console.log("favBtns: ", favBtns);

  let movieListHTML = "";

  if (movieList.Response === "False") {
    movieListHTML = movieList.Error;
  }

  if (movieList.Response === "True") {
    totalResultsElem.innerHTML = movieList.totalResults;

    for (const m in movieList.Search) {
      if (Object.hasOwnProperty.call(movieList.Search, m)) {
        const eachMovie = movieList.Search[m];

        let eachMoviePosterImg = `<img src="${eachMovie.Poster}" alt="${eachMovie.Title}" class="movie__poster" />`;
        let eachMoviePosterDiv = `<div class="noPoster">The poster was not found :(</div>`;

        movieListHTML += `
        <div class="movie">
          ${
            eachMovie.Poster !== "N/A" ? eachMoviePosterImg : eachMoviePosterDiv
          }
        <div class="movie__description">
          <p class="movie__title">
            ${eachMovie.Title} |
            <span class="movie__year">${eachMovie.Year}</span>
          </p>
          <svg
            class="icon favIcon favBtn"
            data-movieid="${eachMovie.imdbID}"
            viewBox="0 0 21 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="mark"
              d="M2.5 24.8819C2.02381 25.0725 1.57143 25.031 1.14286 24.7574C0.714285 24.4838 0.5 24.0844 0.5 23.5591V2.85999C0.5 2.07349 0.78 1.39996 1.34 0.839407C1.9 0.278851 2.57238 -0.0009509 3.35714 2.42783e-06H17.6429C18.4286 2.42783e-06 19.1014 0.280281 19.6614 0.840837C20.2214 1.40139 20.5009 2.07444 20.5 2.85999V23.5591C20.5 24.0834 20.2857 24.4829 19.8571 24.7574C19.4286 25.032 18.9762 25.0735 18.5 24.8819L10.5 21.4499L2.5 24.8819Z"
            />
          </svg>
        </div>
      </div>
        `;
      }
    }
  }

  similarNameElem.innerHTML = movieListHTML;
}
