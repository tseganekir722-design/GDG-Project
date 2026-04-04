<<<<<<< HEAD
const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY_STORAGE = "omdb_api_key";
const USER_KEY = "flicksyncUser";
const FAVORITES_KEY = "favorites";
const WATCHLIST_KEY = "watchlist";
const STATUS_KEY = "flicksyncStatuses";
const RECENTLY_VIEWED_KEY = "flicksyncRecentlyViewed";
const SOCIAL_KEY = "flicksyncSocial";
const SOCIAL_VERSION = 4;

const DEFAULT_QUERY = "Marvel";
const FALLBACK_POSTER = "https://placehold.co/600x900/101712/56d364?text=No+Poster";
const FILTER_QUERIES = {
  "": { seed: "Marvel", label: "Popular movies for tonight" },
  "Sci-Fi": { seed: "Star", label: "Sci-Fi Picks" },
  "Action": { seed: "Mission", label: "Action Picks" },
  "Drama": { seed: "Love", label: "Drama Picks" },
  "Anime": { seed: "Anime", label: "Anime Spotlight" },
  "Animation": { seed: "Pixar", label: "Animation Picks" },
  "Amharic": { seed: "Ethiopia", label: "Amharic Picks" }
};

const FRIEND_SEED = [
  { id: "mesoud", name: "Mesoud", streak: 5, recommendation: "Dune", followed: true },
  { id: "tsega", name: "Tsega", streak: 7, recommendation: "Interstellar", followed: true },
  { id: "milka", name: "Milka", streak: 3, recommendation: "Coco", followed: false },
  { id: "melat", name: "Melat", streak: 4, recommendation: "Barbie", followed: false },
  { id: "fraol", name: "Fraol", streak: 6, recommendation: "Spirited Away", followed: false }
];

const detailCache = new Map();
let currentMovie = null;
let activeQuery = "";
let activeFilter = "";
let activeDisplayLabel = FILTER_QUERIES[""].label;

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("searchInput");
const resultsTitle = document.getElementById("resultsTitle");
const resultsCopy = document.getElementById("resultsCopy");
const movieCount = document.getElementById("movieCount");
const browseTags = document.getElementById("browseTags");
const featuredAction = document.getElementById("featuredAction");
const featuredDrama = document.getElementById("featuredDrama");
const featuredAnimation = document.getElementById("featuredAnimation");
const featuredAnime = document.getElementById("featuredAnime");
const friendRecommendations = document.getElementById("friendRecommendations");
const friendList = document.getElementById("friendList");
const activityFeed = document.getElementById("activityFeed");
const followingCount = document.getElementById("followingCount");
const streakCount = document.getElementById("streakCount");
const recentlyViewed = document.getElementById("recentlyViewed");
const watchlistPreview = document.getElementById("watchlistPreview");
const recommendationInbox = document.getElementById("recommendationInbox");

const favoritesContainer = document.getElementById("favoritesContainer");
const favoritesCount = document.getElementById("favoritesCount");
const favoriteTopGenre = document.getElementById("favoriteTopGenre");
const favoriteLatest = document.getElementById("favoriteLatest");
const watchlistContainer = document.getElementById("watchlistContainer");
const watchlistTotal = document.getElementById("watchlistTotal");
const watchlistStatus = document.getElementById("watchlistStatus");
const watchlistLatest = document.getElementById("watchlistLatest");

const profileName = document.getElementById("profileName");
const profileApiStatus = document.getElementById("profileApiStatus");
const profileApiHint = document.getElementById("profileApiHint");
const profileStreak = document.getElementById("profileStreak");
const profileFollowingCount = document.getElementById("profileFollowingCount");
const profileFollowingList = document.getElementById("profileFollowingList");
const favCount = document.getElementById("favCount");
const watchlistCount = document.getElementById("watchlistCount");

const loginBtn = document.getElementById("loginBtn");
const guestBtn = document.getElementById("guestBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error");
const logoutButtons = document.querySelectorAll("#logoutBtn");
const apiKeyButtons = document.querySelectorAll("#apiKeyBtn");
const clearApiKeyButtons = document.querySelectorAll("#clearApiKeyBtn");

const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPoster = document.getElementById("modalPoster");
const modalRating = document.getElementById("modalRating");
const modalDate = document.getElementById("modalDate");
const favBtn = document.getElementById("favBtn");
const watchlistBtn = document.getElementById("watchlistBtn");
const recommendBtn = document.getElementById("recommendBtn");
const statusSelect = document.getElementById("statusSelect");
const recommendFriendSelect = document.getElementById("recommendFriendSelect");
const posterLightbox = document.getElementById("posterLightbox");
const lightboxPoster = document.getElementById("lightboxPoster");
const closePosterLightbox = document.getElementById("closePosterLightbox");

function ensureToastContainer() {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-stack";
    document.body.appendChild(container);
  }

  return container;
}

function showToast(message) {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function getCurrentFile() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function buildDefaultSocialData() {
  return {
    version: SOCIAL_VERSION,
    friends: FRIEND_SEED.map((friend) => ({ ...friend })),
    activity: [
      { id: "a1", text: "Welcome to FlickSync. Your activity feed starts here.", createdAt: new Date().toISOString() }
    ]
  };
}

function isLoginPage() {
  return getCurrentFile() === "login.html";
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (error) {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveWatchlist(items) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

function getStatuses() {
  try {
    return JSON.parse(localStorage.getItem(STATUS_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveStatuses(statuses) {
  localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
}

function getMovieStatus(imdbID) {
  return getStatuses()[imdbID] || "";
}

function setMovieStatus(imdbID, status) {
  const statuses = getStatuses();

  if (status) {
    statuses[imdbID] = status;
  } else {
    delete statuses[imdbID];
  }

  saveStatuses(statuses);
}

function getRecentlyViewedMovies() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveRecentlyViewedMovies(items) {
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
}

function getSocialData() {
  try {
    const stored = JSON.parse(localStorage.getItem(SOCIAL_KEY));

    if (stored?.version === SOCIAL_VERSION && stored?.friends && stored?.activity) {
      return stored;
    }
  } catch (error) {
    // fall through to defaults
  }

  const initial = buildDefaultSocialData();

  localStorage.setItem(SOCIAL_KEY, JSON.stringify(initial));
  return initial;
}

function saveSocialData(data) {
  localStorage.setItem(SOCIAL_KEY, JSON.stringify(data));
}

function addActivity(text) {
  const social = getSocialData();
  social.activity.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    text,
    createdAt: new Date().toISOString()
  });
  social.activity = social.activity.slice(0, 12);
  saveSocialData(social);
}

function getApiKey() {
  return localStorage.getItem(OMDB_API_KEY_STORAGE) || "";
}

function saveApiKey(value) {
  const cleanValue = (value || "").trim();

  if (!cleanValue) {
    localStorage.removeItem(OMDB_API_KEY_STORAGE);
    return;
  }

  localStorage.setItem(OMDB_API_KEY_STORAGE, cleanValue);
}

function maskApiKey(key) {
  if (!key) return "Not added";
  if (key.length <= 4) return key;
  return `${key.slice(0, 2)}${"*".repeat(Math.max(0, key.length - 4))}${key.slice(-2)}`;
}

function promptForApiKey() {
  const currentKey = getApiKey();
  const input = window.prompt("Enter your OMDb API Key", currentKey);

  if (input === null) {
    return currentKey;
  }

  saveApiKey(input);
  addActivity(input.trim() ? "Updated OMDb API key." : "Removed OMDb API key.");
  updateProfileSummary();

  return getApiKey();
}

function ensureApiKey(promptIfMissing = false) {
  const apiKey = getApiKey();

  if (apiKey) {
    return apiKey;
  }

  if (!promptIfMissing) {
    return "";
  }

  return promptForApiKey();
}

function formatSavedDate(savedAt) {
  if (!savedAt) return "Just now";

  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function updateUserStreak(user) {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (user.lastLoginDate === today) {
    return user;
  }

  if (user.lastLoginDate === yesterday) {
    user.streakDays = (user.streakDays || 1) + 1;
  } else {
    user.streakDays = 1;
  }

  user.lastLoginDate = today;
  return user;
}

function requireAuth() {
  const user = getCurrentUser();

  if (!user && !isLoginPage()) {
    window.location.href = "login.html";
    return false;
  }

  if (user && isLoginPage()) {
    window.location.href = "index.html";
    return false;
  }

  return true;
}

function login(name, isGuest = false) {
  const cleanName = (name || "").trim();
  const existingUser = getCurrentUser() || {};

  const nextUser = updateUserStreak({
    ...existingUser,
    name: cleanName || "Guest User",
    isGuest
  });

  saveCurrentUser(nextUser);
  addActivity(`${nextUser.name} logged in and continued a ${nextUser.streakDays}-day streak.`);
  window.location.href = "index.html";
}

function logout() {
  const user = getCurrentUser();

  if (user?.name) {
    addActivity(`${user.name} logged out.`);
  }

  localStorage.removeItem(USER_KEY);
  window.location.href = "login.html";
}

function getFollowedFriends() {
  return getSocialData().friends.filter((friend) => friend.followed);
}

function updateProfileSummary() {
  const user = getCurrentUser();
  const apiKey = getApiKey();
  const favorites = getFavorites();
  const watchlist = getWatchlist();
  const followedFriends = getFollowedFriends();

  if (profileName) {
    profileName.textContent = user?.name || "Guest User";
  }

  if (favCount) {
    favCount.textContent = favorites.length;
  }

  if (watchlistCount) {
    watchlistCount.textContent = watchlist.length;
  }

  if (profileApiStatus) {
    profileApiStatus.textContent = maskApiKey(apiKey);
  }

  if (profileApiHint) {
    profileApiHint.textContent = apiKey ? "OMDb key saved in localStorage." : "Add your OMDb key to search live movie data.";
  }

  if (streakCount) {
    streakCount.textContent = user?.streakDays || 1;
  }

  if (followingCount) {
    followingCount.textContent = followedFriends.length;
  }

  if (profileStreak) {
    profileStreak.textContent = `${user?.streakDays || 1} day${(user?.streakDays || 1) === 1 ? "" : "s"}`;
  }

  if (profileFollowingCount) {
    profileFollowingCount.textContent = followedFriends.length;
  }
}

function rememberViewedMovie(movie) {
  const detailedMovie = movie.isDetailed ? movie : normalizeSearchMovie({
    imdbID: movie.imdbID,
    Title: movie.title,
    Type: movie.type,
    Poster: movie.poster,
    Year: movie.releaseDate
  });
  const existing = getRecentlyViewedMovies().filter((item) => item.imdbID !== movie.imdbID);
  existing.unshift({
    ...detailedMovie,
    ...movie,
    viewedAt: new Date().toISOString()
  });
  saveRecentlyViewedMovies(existing.slice(0, 8));
}

function normalizeSearchMovie(movie) {
  return {
    imdbID: movie.imdbID,
    title: movie.Title,
    description: `${movie.Type === "series" ? "Series" : "Movie"} result from OMDb. Open for more details.`,
    poster: movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/600x900/101712/56d364?text=No+Poster",
    rating: "N/A",
    releaseDate: movie.Year || "Unknown",
    genre: [],
    actors: [],
    runtime: "",
    language: "",
    country: "",
    type: movie.Type || "movie",
    isDetailed: false
  };
}

function normalizeMovie(movie) {
  const genres = movie.Genre ? movie.Genre.split(",").map((item) => item.trim()) : [];
  const actors = movie.Actors ? movie.Actors.split(",").map((item) => item.trim()) : [];

  return {
    imdbID: movie.imdbID,
    title: movie.Title,
    description: movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No description available.",
    poster: movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/600x900/101712/56d364?text=No+Poster",
    rating: movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "N/A",
    releaseDate: movie.Year || "Unknown",
    genre: genres,
    actors,
    runtime: movie.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : "",
    language: movie.Language && movie.Language !== "N/A" ? movie.Language : "",
    country: movie.Country && movie.Country !== "N/A" ? movie.Country : "",
    type: movie.Type || "movie",
    isDetailed: true
  };
}

async function fetchOmdb(params) {
  const apiKey = ensureApiKey(false);

  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const url = new URL(OMDB_API_URL);
  url.searchParams.set("apikey", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "OMDb request failed");
  }

  return data;
}

async function fetchMovieDetails(imdbID) {
  if (detailCache.has(imdbID)) {
    return detailCache.get(imdbID);
  }

  const data = await fetchOmdb({ i: imdbID, plot: "full" });
  const movie = normalizeMovie(data);
  detailCache.set(imdbID, movie);
  return movie;
}

async function searchMovies(query, limit = 12) {
  const keyword = (query || DEFAULT_QUERY).trim();
  const data = await fetchOmdb({ s: keyword, type: "movie", page: "1" });
  const searchResults = Array.isArray(data.Search) ? data.Search.slice(0, limit) : [];
  return searchResults.map(normalizeSearchMovie);
}

function createMovieCardMarkup(movie, compact = false) {
  const cardClass = compact ? "movie-card compact-card" : "movie-card";
  const metaRating = movie.rating && movie.rating !== "N/A" ? `⭐ ${movie.rating}` : movie.type || "movie";
  const status = getMovieStatus(movie.imdbID);

  return `
    <article class="${cardClass}" data-movie-id="${movie.imdbID}">
      <img src="${movie.poster}" alt="${movie.title}" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
      <div class="movie-info">
        <div class="movie-meta">
          <span>${movie.releaseDate}</span>
          <span>${metaRating}</span>
        </div>
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <div class="genre-row">
          ${status ? `<span class="genre-pill status-pill">${status}</span>` : ""}
          ${(movie.genre || []).slice(0, 3).map((item) => `<span class="genre-pill">${item}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function attachMovieCardEvents(container, movies) {
  if (!container) return;

  container.querySelectorAll("[data-movie-id]").forEach((card) => {
    card.addEventListener("click", async () => {
      const selectedMovie = movies.find((movie) => movie.imdbID === card.dataset.movieId);

      if (selectedMovie) {
        await openModal(selectedMovie);
      }
    });
  });
}

function renderActivityFeed() {
  if (!activityFeed) return;

  const items = getSocialData().activity;
  activityFeed.innerHTML = items.map((item) => `
    <article class="activity-item">
      <p>${item.text}</p>
      <span>${formatSavedDate(item.createdAt)}</span>
    </article>
  `).join("");
}

function renderFriendList() {
  if (!friendList) return;

  const social = getSocialData();
  friendList.innerHTML = social.friends.map((friend) => `
    <article class="friend-item">
      <div>
        <h3>${friend.name}</h3>
        <p>${friend.streak}-day streak</p>
        <p class="card-text">Recommends: ${friend.recommendation}</p>
      </div>
      <button class="${friend.followed ? "nav-link" : "profile-btn"}" type="button" data-friend-id="${friend.id}">
        ${friend.followed ? "Following" : "Follow"}
      </button>
    </article>
  `).join("");

  friendList.querySelectorAll("[data-friend-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const socialData = getSocialData();
      const friend = socialData.friends.find((item) => item.id === button.dataset.friendId);

      if (!friend) return;

      friend.followed = !friend.followed;
      saveSocialData(socialData);
      addActivity(`${friend.followed ? "Started following" : "Unfollowed"} ${friend.name}.`);
      updateProfileSummary();
      renderFriendList();
      renderFriendRecommendations();
      renderRecommendationInbox();
      refreshRecommendationChoices();
      renderProfileFollowingList();
      renderActivityFeed();
      showToast(friend.followed ? `Now following ${friend.name}.` : `Unfollowed ${friend.name}.`);
    });
  });
}

function renderProfileFollowingList() {
  if (!profileFollowingList) return;

  const followedFriends = getFollowedFriends();

  if (followedFriends.length === 0) {
    profileFollowingList.innerHTML = `
      <article class="empty-state">
        <h3>No followed friends yet</h3>
        <p>Follow people from the home page to build your network and send movie recommendations.</p>
      </article>
    `;
    return;
  }

  profileFollowingList.innerHTML = followedFriends.map((friend) => `
    <article class="friend-item">
      <div>
        <h3>${friend.name}</h3>
        <p>${friend.streak}-day streak</p>
        <p class="card-text">Latest recommendation: ${friend.recommendation}</p>
      </div>
      <span class="genre-pill">Following</span>
    </article>
  `).join("");
}

function renderRecommendationInbox() {
  if (!recommendationInbox) return;

  const followedFriends = getFollowedFriends();

  if (followedFriends.length === 0) {
    recommendationInbox.innerHTML = '<article class="empty-state"><p>Follow friends to see their current recommendations here.</p></article>';
    return;
  }

  recommendationInbox.innerHTML = followedFriends.map((friend) => `
    <article class="friend-card inbox-card">
      <p class="eyebrow">From ${friend.name}</p>
      <h3>${friend.recommendation}</h3>
      <p class="card-text">${friend.streak}-day streak and still recommending strong picks.</p>
    </article>
  `).join("");
}

function renderRecentlyViewedSection() {
  if (!recentlyViewed) return;

  const items = getRecentlyViewedMovies();

  if (items.length === 0) {
    recentlyViewed.innerHTML = '<article class="empty-state"><p>Open a movie and it will show up here.</p></article>';
    return;
  }

  recentlyViewed.innerHTML = items.slice(0, 4).map((movie) => createMovieCardMarkup(movie, true)).join("");
  attachMovieCardEvents(recentlyViewed, items);
}

function renderWatchlistPreview() {
  if (!watchlistPreview) return;

  const items = getWatchlist();

  if (items.length === 0) {
    watchlistPreview.innerHTML = '<article class="empty-state"><p>Your watchlist is empty. Save a movie for later from the details modal.</p></article>';
    return;
  }

  watchlistPreview.innerHTML = items.slice(0, 4).map((movie) => createMovieCardMarkup(movie, true)).join("");
  attachMovieCardEvents(watchlistPreview, items);
}

async function renderFeaturedSection(container, query) {
  if (!container) return;

  container.innerHTML = '<article class="empty-state"><p>Loading...</p></article>';

  try {
    const movies = await searchMovies(query, 4);

    if (movies.length === 0) {
      container.innerHTML = '<article class="empty-state"><p>No featured movies found.</p></article>';
      return;
    }

    container.innerHTML = movies.map((movie) => createMovieCardMarkup(movie, true)).join("");
    attachMovieCardEvents(container, movies);
  } catch (error) {
    container.innerHTML = `<article class="empty-state"><p>OMDb error: ${error.message}</p></article>`;
  }
}

async function renderFeaturedSections() {
  if (!featuredAction && !featuredDrama && !featuredAnimation && !featuredAnime) {
    return;
  }

  const apiKey = ensureApiKey(false);

  if (!apiKey) {
    [featuredAction, featuredDrama, featuredAnimation, featuredAnime].forEach((container) => {
      if (container) {
        container.innerHTML = '<article class="empty-state"><p>Add your OMDb API key to load featured sections.</p></article>';
      }
    });
    return;
  }

  await Promise.all([
    renderFeaturedSection(featuredAction, "Mission"),
    renderFeaturedSection(featuredDrama, "Love"),
    renderFeaturedSection(featuredAnimation, "Pixar"),
    renderFeaturedSection(featuredAnime, "Anime")
  ]);
}

async function renderFriendRecommendations() {
  if (!friendRecommendations) return;

  const followedFriends = getFollowedFriends();

  if (followedFriends.length === 0) {
    friendRecommendations.innerHTML = '<article class="empty-state"><p>Follow friends to unlock recommendations.</p></article>';
    return;
  }

  friendRecommendations.innerHTML = '<article class="empty-state"><p>Loading recommendations...</p></article>';

  try {
    const recommendationMovies = [];

    for (const friend of followedFriends.slice(0, 3)) {
      const movies = await searchMovies(friend.recommendation, 1);

      if (movies[0]) {
        recommendationMovies.push({
          ...movies[0],
          description: `${friend.name} recommends this pick.`,
          genre: friend.followed ? ["Friend Pick"] : []
        });
      }
    }

    if (recommendationMovies.length === 0) {
      friendRecommendations.innerHTML = '<article class="empty-state"><p>No recommendations available yet.</p></article>';
      return;
    }

    friendRecommendations.innerHTML = recommendationMovies.map((movie) => createMovieCardMarkup(movie, true)).join("");
    attachMovieCardEvents(friendRecommendations, recommendationMovies);
  } catch (error) {
    friendRecommendations.innerHTML = `<article class="empty-state"><p>OMDb error: ${error.message}</p></article>`;
  }
}

function refreshRecommendationChoices() {
  if (!recommendFriendSelect) return;

  const followedFriends = getFollowedFriends();
  recommendFriendSelect.innerHTML = `
    <option value="">Choose friend</option>
    ${followedFriends.map((friend) => `<option value="${friend.id}">${friend.name}</option>`).join("")}
  `;
}

function recommendCurrentMovie() {
  if (!currentMovie) {
    showToast("Open a movie first, then recommend it.");
    return;
  }

  const followedFriends = getFollowedFriends();

  if (followedFriends.length === 0) {
    showToast("Follow at least one friend before sending a recommendation.");
    return;
  }

  const selectedFriendId = recommendFriendSelect?.value || "";

  if (!selectedFriendId) {
    showToast("Choose a followed friend first.");
    return;
  }

  const socialData = getSocialData();
  const targetFriend = socialData.friends.find((friend) => friend.id === selectedFriendId && friend.followed);

  if (!targetFriend) {
    showToast("That friend is no longer available.");
    return;
  }

  targetFriend.recommendation = currentMovie.title;
  saveSocialData(socialData);
  addActivity(`Recommended ${currentMovie.title} to ${targetFriend.name}.`);
  renderFriendRecommendations();
  renderProfileFollowingList();
  renderRecommendationInbox();
  renderActivityFeed();
  showToast(`Recommended to ${targetFriend.name}.`);
}

function initializeAuthUI() {
  logoutButtons.forEach((button) => {
    button.addEventListener("click", logout);
  });

  apiKeyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const previousKey = getApiKey();
      const nextKey = promptForApiKey();

      if (!nextKey && resultsCopy) {
        resultsCopy.textContent = "Add your OMDb API key with the Profile button to start browsing movies.";
      }

      if (movieContainer && nextKey && nextKey !== previousKey) {
        await loadMovies(activeQuery || FILTER_QUERIES[activeFilter || ""].seed || DEFAULT_QUERY);
        await renderFeaturedSections();
        await renderFriendRecommendations();
      }

      renderActivityFeed();
    });
  });

  clearApiKeyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      saveApiKey("");
      addActivity("Cleared OMDb API key.");
      updateProfileSummary();
      renderActivityFeed();
      showToast("OMDb API key removed.");
    });
  });

  updateProfileSummary();

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const username = usernameInput?.value.trim() || "";
      const password = passwordInput?.value.trim() || "";

      if (!username || !password) {
        if (errorMessage) {
          errorMessage.textContent = "Enter both username and password to continue.";
        }
        return;
      }

      if (errorMessage) {
        errorMessage.textContent = "";
      }

      login(username, false);
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", () => login("Guest User", true));
  }

  if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        loginBtn?.click();
      }
    });
  }
}

async function loadMovies(query = "") {
  if (!movieContainer) return;

  const apiKey = ensureApiKey(true);

  if (!apiKey) {
    updateResultsHeader("", 0, "Add your OMDb API key with the Profile button to start browsing movies.");
    displayMovies([]);
    return;
  }

  try {
    const movies = await searchMovies(query || DEFAULT_QUERY, 12);
    updateResultsHeader(activeDisplayLabel, movies.length);
    displayMovies(movies);
  } catch (error) {
    console.error("Error loading movies:", error);
    const message = error.message === "missing_api_key"
      ? "Add your OMDb API key with the Profile button to start browsing movies."
      : error.message === "Movie not found!"
        ? "No movies found. Try a different movie title."
        : `OMDb error: ${error.message}`;

    updateResultsHeader(activeDisplayLabel, 0, message);
    displayMovies([]);
  }
}

function displayMovies(movies) {
  if (!movieContainer) return;

  movieContainer.innerHTML = "";

  if (movieCount) {
    movieCount.textContent = movies.length;
  }

  if (movies.length === 0) {
    movieContainer.innerHTML = `
      <article class="empty-state">
        <h3>No movies found</h3>
        <p>Try another title search or use one of the quick-pick categories.</p>
      </article>
    `;
    return;
  }

  movieContainer.innerHTML = movies.map((movie) => createMovieCardMarkup(movie)).join("");
  attachMovieCardEvents(movieContainer, movies);
}

function updateResultsHeader(label, count, overrideText = "") {
  if (!resultsTitle || !resultsCopy) return;

  resultsTitle.textContent = label || FILTER_QUERIES[""].label;

  if (overrideText) {
    resultsCopy.textContent = overrideText;
    return;
  }

  resultsCopy.textContent = `${count} title${count === 1 ? "" : "s"} loaded from OMDb. Search is title-based, and details load when you open a movie.`;
}

function setActiveTag(query) {
  if (!browseTags) return;

  browseTags.querySelectorAll(".tag-pill").forEach((button) => {
    button.classList.toggle("active", button.dataset.query === query);
  });
}

async function openModal(movie) {
  if (!modal || !modalTitle || !modalDesc || !modalPoster || !modalRating || !modalDate) {
    return;
  }

  const detailedMovie = movie.isDetailed ? movie : await fetchMovieDetails(movie.imdbID);
  currentMovie = detailedMovie;

  modalTitle.textContent = detailedMovie.title;
  modalDesc.textContent = detailedMovie.description;
  modalPoster.src = detailedMovie.poster;
  modalPoster.alt = detailedMovie.title;
  modalPoster.onerror = () => {
    modalPoster.onerror = null;
    modalPoster.src = FALLBACK_POSTER;
  };

  const metaParts = [
    detailedMovie.rating !== "N/A" ? `IMDb ${detailedMovie.rating}` : null,
    detailedMovie.runtime || null,
    detailedMovie.language || null
  ].filter(Boolean);

  modalRating.textContent = metaParts.join(" • ");
  modalDate.textContent = [
    detailedMovie.releaseDate,
    ...(detailedMovie.genre || []).slice(0, 2)
  ].filter(Boolean).join(" • ");
  if (statusSelect) {
    statusSelect.value = getMovieStatus(detailedMovie.imdbID);
  }
  refreshRecommendationChoices();
  rememberViewedMovie(detailedMovie);
  renderRecentlyViewedSection();
  modal.style.display = "block";
}

function openPosterLightbox() {
  if (!posterLightbox || !lightboxPoster || !modalPoster?.src) {
    return;
  }

  lightboxPoster.src = modalPoster.src;
  lightboxPoster.alt = modalPoster.alt || "Full movie poster";
  posterLightbox.style.display = "flex";
}

function closePosterViewer() {
  if (!posterLightbox) return;
  posterLightbox.style.display = "none";
}

function renderFavoritesPage() {
  if (!favoritesContainer) return;

  const favorites = getFavorites();

  if (favoritesCount) {
    favoritesCount.textContent = favorites.length;
  }

  if (favoriteTopGenre) {
    const genreCounts = favorites
      .flatMap((movie) => movie.genre || [])
      .reduce((counts, genre) => {
        counts[genre] = (counts[genre] || 0) + 1;
        return counts;
      }, {});

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    favoriteTopGenre.textContent = topGenre || "None yet";
  }

  if (favoriteLatest) {
    favoriteLatest.textContent = favorites[0]?.title || "-";
  }

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <article class="empty-state">
        <h3>No favorites yet</h3>
        <p>Open a movie from the home page and tap "Add to Favorites" to build your collection.</p>
      </article>
    `;
    return;
  }

  favoritesContainer.innerHTML = favorites.map((movie) => `
    <article class="favorite-card">
      <img src="${movie.poster}" alt="${movie.title}" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
      <div class="favorite-content">
        <div class="favorite-topline">
          <span class="genre-pill">${movie.releaseDate}</span>
          <span class="genre-pill">⭐ ${movie.rating}</span>
          <span class="genre-pill">Saved ${formatSavedDate(movie.savedAt)}</span>
          ${getMovieStatus(movie.imdbID) ? `<span class="genre-pill status-pill">${getMovieStatus(movie.imdbID)}</span>` : ""}
        </div>
        <h3>${movie.title}</h3>
        <p class="favorite-description">${movie.description || "No description available."}</p>
        <p class="favorite-cast"><strong>Cast:</strong> ${(movie.actors || []).slice(0, 4).join(", ") || "Unknown cast"}</p>
        <div class="genre-row">
          ${(movie.genre || []).map((item) => `<span class="genre-pill">${item}</span>`).join("")}
        </div>
        <div class="favorite-actions">
          <button type="button" class="nav-link" data-remove-id="${movie.imdbID}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");

  favoritesContainer.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.removeId;
      const updatedFavorites = getFavorites().filter((movie) => movie.imdbID !== id);
      const removedMovie = favorites.find((movie) => movie.imdbID === id);

      saveFavorites(updatedFavorites);

      if (removedMovie) {
        addActivity(`Removed ${removedMovie.title} from favorites.`);
        showToast(`${removedMovie.title} removed from favorites.`);
      }

      renderFavoritesPage();
      updateProfileSummary();
      renderActivityFeed();
    });
  });
}

function renderWatchlistPage() {
  if (!watchlistContainer) return;

  const items = getWatchlist();

  if (watchlistTotal) {
    watchlistTotal.textContent = items.length;
  }

  if (watchlistLatest) {
    watchlistLatest.textContent = items[0]?.title || "-";
  }

  if (watchlistStatus) {
    watchlistStatus.textContent = "Plan to Watch";
  }

  if (items.length === 0) {
    watchlistContainer.innerHTML = `
      <article class="empty-state">
        <h3>No watchlist titles yet</h3>
        <p>Open a movie and add it to your watchlist so it appears here.</p>
      </article>
    `;
    return;
  }

  watchlistContainer.innerHTML = items.map((movie) => `
    <article class="favorite-card">
      <img src="${movie.poster}" alt="${movie.title}" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
      <div class="favorite-content">
        <div class="favorite-topline">
          <span class="genre-pill">${movie.releaseDate}</span>
          <span class="genre-pill">${movie.type || "movie"}</span>
          <span class="genre-pill">Saved ${formatSavedDate(movie.savedAt)}</span>
          ${getMovieStatus(movie.imdbID) ? `<span class="genre-pill status-pill">${getMovieStatus(movie.imdbID)}</span>` : ""}
        </div>
        <h3>${movie.title}</h3>
        <p class="favorite-description">${movie.description || "No description available."}</p>
        <div class="genre-row">
          ${(movie.genre || []).map((item) => `<span class="genre-pill">${item}</span>`).join("")}
        </div>
        <div class="favorite-actions">
          <button type="button" class="nav-link" data-watchlist-open="${movie.imdbID}">Open</button>
          <button type="button" class="nav-link" data-watchlist-remove="${movie.imdbID}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");

  watchlistContainer.querySelectorAll("[data-watchlist-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.watchlistRemove;
      const updatedItems = getWatchlist().filter((movie) => movie.imdbID !== id);
      const removedMovie = items.find((movie) => movie.imdbID === id);
      saveWatchlist(updatedItems);

      if (removedMovie) {
        addActivity(`Removed ${removedMovie.title} from watchlist.`);
        showToast(`${removedMovie.title} removed from watchlist.`);
      }

      renderWatchlistPage();
      renderWatchlistPreview();
      updateProfileSummary();
      renderActivityFeed();
    });
  });

  watchlistContainer.querySelectorAll("[data-watchlist-open]").forEach((button) => {
    button.addEventListener("click", async () => {
      const movie = items.find((entry) => entry.imdbID === button.dataset.watchlistOpen);

      if (movie) {
        await openModal(movie);
      }
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", async (event) => {
    activeQuery = event.target.value.trim();
    activeFilter = "";
    activeDisplayLabel = activeQuery ? `Results for "${activeQuery}"` : FILTER_QUERIES[""].label;
    setActiveTag("");
    await loadMovies(activeQuery || DEFAULT_QUERY);
  });
}

if (browseTags) {
  browseTags.addEventListener("click", async (event) => {
    const button = event.target.closest(".tag-pill");

    if (!button) return;

    activeFilter = button.dataset.query || "";
    activeQuery = FILTER_QUERIES[activeFilter].seed;
    activeDisplayLabel = FILTER_QUERIES[activeFilter].label;

    if (searchInput) {
      searchInput.value = "";
    }

    setActiveTag(activeFilter);
    await loadMovies(activeQuery || DEFAULT_QUERY);
  });
}

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

if (modalPoster && posterLightbox && lightboxPoster) {
  modalPoster.addEventListener("click", openPosterLightbox);
}

if (recommendBtn) {
  recommendBtn.addEventListener("click", recommendCurrentMovie);
}

if (closePosterLightbox && posterLightbox) {
  closePosterLightbox.addEventListener("click", closePosterViewer);

  posterLightbox.addEventListener("click", (event) => {
    if (event.target === posterLightbox) {
      closePosterViewer();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && posterLightbox.style.display === "flex") {
      closePosterViewer();
    }
  });
}

if (favBtn) {
  favBtn.addEventListener("click", () => {
    if (!currentMovie) return;

    const favorites = getFavorites();

    if (!favorites.find((movie) => movie.imdbID === currentMovie.imdbID)) {
      favorites.unshift({
        ...currentMovie,
        savedAt: new Date().toISOString()
      });
      saveFavorites(favorites);
      saveWatchlist(getWatchlist().filter((movie) => movie.imdbID !== currentMovie.imdbID));
      addActivity(`Added ${currentMovie.title} to favorites.`);
      updateProfileSummary();
      renderFavoritesPage();
      renderWatchlistPage();
      renderWatchlistPreview();
      renderActivityFeed();
      showToast("Added to favorites.");
    } else {
      showToast("Already in favorites.");
    }
  });
}

if (watchlistBtn) {
  watchlistBtn.addEventListener("click", () => {
    if (!currentMovie) return;

    const items = getWatchlist();

    if (!items.find((movie) => movie.imdbID === currentMovie.imdbID)) {
      items.unshift({
        ...currentMovie,
        savedAt: new Date().toISOString()
      });
      saveWatchlist(items);

      if (!getMovieStatus(currentMovie.imdbID)) {
        setMovieStatus(currentMovie.imdbID, "Plan to Watch");
        if (statusSelect) {
          statusSelect.value = "Plan to Watch";
        }
      }

      addActivity(`Added ${currentMovie.title} to watchlist.`);
      updateProfileSummary();
      renderWatchlistPage();
      renderWatchlistPreview();
      renderActivityFeed();
      showToast("Added to watchlist.");
    } else {
      showToast("Already in watchlist.");
    }
  });
}

if (statusSelect) {
  statusSelect.addEventListener("change", async () => {
    if (!currentMovie) return;

    setMovieStatus(currentMovie.imdbID, statusSelect.value);
    addActivity(statusSelect.value ? `Set ${currentMovie.title} to ${statusSelect.value}.` : `Cleared status for ${currentMovie.title}.`);
    renderFavoritesPage();
    renderWatchlistPage();
    renderRecentlyViewedSection();
    renderWatchlistPreview();
    if (movieContainer) {
      await loadMovies(activeQuery || DEFAULT_QUERY);
    }
    showToast(statusSelect.value ? `Status set to ${statusSelect.value}.` : "Movie status cleared.");
  });
}

if (requireAuth()) {
  initializeAuthUI();
  renderActivityFeed();
  renderFriendList();
  renderProfileFollowingList();
  renderRecommendationInbox();
  renderRecentlyViewedSection();
  renderWatchlistPreview();
  refreshRecommendationChoices();

  if (movieContainer) {
    setActiveTag(activeFilter);
    loadMovies(DEFAULT_QUERY);
    renderFeaturedSections();
    renderFriendRecommendations();
  }

  if (favoritesContainer) {
    renderFavoritesPage();
  }

  if (watchlistContainer) {
    renderWatchlistPage();
  }
}
=======
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
>>>>>>> collab/main
