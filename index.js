// Consts
const apikey = "a5d5f3b1e65414a946041605c2d757df";
const endpoint = "https://api.themoviedb.org/3";
const apipaths = {
  fetchAllCategories: `${endpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesByCategory: (id) =>
    `${endpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${endpoint}/trending/all/week?api_key=${apikey}&language=en-US`,
};

const imgpath = "https://image.tmdb.org/t/p/original";

// Boots up the app
function init() {
  fetchAndBuildAllSections();

  fetchTrendingMovies();
}
function fetchTrendingMovies() {
  fetchAndBuildMovieSection(apipaths.fetchTrending, "Trending Now")
    .then((list) => {
        const randomindex=parseInt(Math.random()*list.length);
        
      buildBannerSection(list[randomindex]);
    }).catch((err) => {console.error(err)});
}
function buildBannerSection(movie) {
  const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url(${imgpath}${movie.backdrop_path})`;
    const div = document.createElement("div");
    div.innerHTML=`

    <h2 class="banner__title">${movie.title}</h2>
    <p class="banner__info">Trending in Movies | ReleaseDate -${movie.release_date}</p>
    <p class="banner__overview">${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
    <div class="action-buttons-cont">
      <button class="action-buttons"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    Play
  </button>
      <button class="action-buttons"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.478 2 12s4.477 10 10 10 10-4.478 10-10S17.523 2 12 2zm.75 15h-1.5v-6h1.5v6zm0-8h-1.5V7h1.5v2z"/></svg>More Info</button>

  </div>   
    `
div.className="banner-content";
    
    bannerCont.append(div);
}
function fetchAndBuildAllSections() {
  fetch(apipaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSection(
            apipaths.fetchMoviesByCategory(category.id),
            category.name
          );
        });
      }
    })
    .catch((err) => console.error(err));
}

function fetchAndBuildMovieSection(fetchurl, category) {
    console.log(fetchurl, category);
  return fetch(fetchurl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, category);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMovieSection(list, categoryName) {
  const movieCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
        <img class="movie-item" src="${imgpath}${item.backdrop_path}" alt="${item.title}">
      `;
    })
    .join("");

  const moviessectionHTML = `
    <h2 class="movies-section-heading">
      ${categoryName}<span class="explore-nudge">Explore All</span>
    </h2>
    <div class="movies-row">  
      ${moviesListHTML}
    </div>
  `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviessectionHTML;

  movieCont.append(div);
}

window.addEventListener("load", init);
window.addEventListener("scroll",function(){
    //header ui update
    const header=document.getElementById('header');
    if(window.scrollY>5){
        header.classList.add('black-bg');
    }else{
        header.classList.remove('black-bg');
    }
});
