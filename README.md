# FlickSync

FlickSync is a browser-only movie discovery app powered by the OMDb API. It is built with plain HTML, CSS, and vanilla JavaScript, with no frontend framework and no backend server.

Users can log in locally, connect their OMDb API key, search live movie data, open movie details, save favorites, build a watchlist, track viewing status, follow friends, send recommendations, and review their activity from a responsive interface.

## Features

- Local login page before entering the app
- OMDb API key management using browser localStorage
- Live movie search from OMDb
- Quick category filters like Action, Drama, Anime, Animation, and Amharic
- Movie details modal with full poster view
- Favorites page
- Watchlist page
- Movie status tracking: `Plan to Watch`, `Watching`, `Watched`
- Recently viewed section
- Follow system with friend recommendations
- Recommendation inbox on the profile page
- Activity feed
- Responsive layout for desktop and mobile

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- OMDb API
- localStorage

## Project Structure

```bash
FlickSync/
├── favorite.html
├── index.html
├── login.html
├── MovieApp.js
├── Moviegdg.css
├── profile.html
├── watchlist.html
├── .gitignore
└── README.md
```

## Pages

- `login.html`: local sign-in or guest entry page
- `index.html`: main homepage with search, featured sections, social features, and movie modal
- `favorite.html`: saved favorites with movie details
- `watchlist.html`: saved watchlist items
- `profile.html`: user summary, API key tools, following list, recommendation inbox, activity feed

## How to Get an OMDb API Key

1. Visit `https://www.omdbapi.com/apikey.aspx`
2. Choose the free plan
3. Submit your email
4. Open the email from OMDb
5. Copy and activate your API key

## How to Run

No package install is required.

You can open the project directly in a browser:

1. Open `login.html`
2. Log in or continue as guest
3. Open the app
4. Add your OMDb API key when prompted or from the profile page
5. Start searching and saving movies

For smoother local testing, you can also use a small local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/login.html
```

## How the App Works

- Movie data is loaded live from OMDb
- The OMDb API key is stored in `localStorage`
- User login is local only and not connected to a real authentication service
- Favorites are stored in `localStorage`
- Watchlist items are stored in `localStorage`
- Movie statuses are stored in `localStorage`
- Social data like follows, recommendations, and activity feed are stored in `localStorage`

## Notes

- The OMDb free plan allows about `1,000` requests per day
- Search is title-based because it uses OMDb search endpoints
- Some posters may be missing or unavailable in OMDb
- App data stays in the same browser unless localStorage is cleared

## Author

Built by Mesoud
