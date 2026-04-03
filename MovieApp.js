const API_KEY = "50a91e23";

async function GetMovies(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        
        if (response.status === 401) {
            alert("Unauthorized! Please check your API key.");
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "False") {
            alert("API Error! " + data.Error);
            return null;
        }

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

    if (movies == undefined) {
        MovieContainer.innerHTML = "<p> Something went wrong. Please check your connection. </p>";
        return;
    }

    if (!movies || movies.length === 0) {
        MovieContainer.innerHTML = "<p> No movies found. :( </p>";
        return;
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
    const container = document.getElementById("movieContainer");
    container.scrollIntoView({behavior: "smooth"});
    const movies = await GetMovies(query);
    
    DisplayMovies(movies);

    
}

async function HandleSearch(event) {
    event.preventDefault();

    const SearchInput = document.querySelector("#searchInput");
    const query = SearchInput.value.trim();

    if (!query) {
        alert("Please enter a movie name.");
        return;
    }

    SearchMovies(query);
    SearchInput.value = "";
}

const MovieForm = document.querySelector("#movie-searcher");
MovieForm.addEventListener("submit", HandleSearch);

async function LoadTrendingMovies() {
    console.log("Trending function is running...");

    const queries = [ "avatar","stranger things", "harry potter", "drama", "comedy", "horror", "romance", "anime", "fantasy", "action"];
    const container = document.getElementById("popularMovies");

    if (!container) {
        console.error(" Container not found!");
        return;
    }

    container.innerHTML = "";

    for (let query of queries) {
        console.log("Fetching:", query);

        const movies = await GetMovies(query);

        console.log("Result:", movies);

        if (!movies) continue;

        movies.slice(0, 2).forEach(movie => {
            const div = document.createElement("div");
            div.classList.add("movie");
     
            div.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster';">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            `;

            container.appendChild(div);
        });
    }
}

window.addEventListener("DOMContentLoaded", LoadTrendingMovies);

function scrollMovies(containerId, direction) {
    const container = document.getElementById(containerId);

    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth"
    });
}
