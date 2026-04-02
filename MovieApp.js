const API_KEY = "50a91e23";
async function GetMovies(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        return data.Search;
    } catch (error) {
        console.error("Error fetching movies:", error);
        alert("An error occurred while fetching movies. Please check your connection or API key and try again later.");
        return null;
    }
}

function DisplayMovies(movies) {
    const MovieContainer = document.getElementById('movieContainer');
    MovieContainer.innerHTML = "";
    if (movies == undefined ) {
        MovieContainer.innerHTML = "<p> Something went wrong. Please check your connection. </p>"
    }
   movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie");
    div.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300?text=No+Image"}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
    `;
    MovieContainer.appendChild(div);
}); 
}


async function SearchMovies(query) {
    const container = document.getElementById('movieContainer');
    const movies = await GetMovies(query);
}
async function HandleSearch(event) {
    event.preventDefault();
    const SearchInput = document.querySelector("#searchInput");
    const query = SearchInput.value.trim();
    SearchMovies(query);
    SearchInput.value = "";
}
const MovieForm = document.querySelector("#movie-searcher");
MovieForm.addEventListener("submit", HandleSearch);
