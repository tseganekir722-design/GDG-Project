const API_KEY = "50a91e23";
async function getMovies(query) {
    const x = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await x.json();
    return data.Search;
}

function displayMovies(movies) {
    const container = document.getElementById('movieContainer');
    container.innerHTML = "";
    if (!movies) {
        container.innerHTML = "<p> No movies found. </p>";
         return;
    } 
   
   movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie");
    div.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
    `;
    container.appendChild(div);
}); 
}


async function searchMovies(query) {
    const movies = await getMovies(query);
    displayMovies(movies);
}
function handleSearch(event) {
    event.preventDefault();
    const query = document.querySelector(".search").value;
    searchMovies(query);
}
const submitButton = document.querySelector("button[type='submit']");
submitButton.addEventListener("submit", handleSearch);