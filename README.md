# Movie App

Search thousands of movies and see which searches are trending.

Built by [Aida Topalli](https://ida-eng.github.io/portfolio/).

## Features

- Search movies from the TMDB API, with debounced search as you type
- Popular movies shown by default
- Trending searches: every search is counted in an Appwrite database and the top 5 are shown
- Responsive layout with Tailwind CSS and Framer Motion animations

## Tech stack

React 19 · Vite · Tailwind CSS · Appwrite · TMDB API · Framer Motion

## Run locally

```bash
npm install
cp .env.example .env.local   # then add your own keys
npm run dev
```

## Environment variables

| Variable | Where to get it |
| --- | --- |
| `VITE_TMDB_API_KEY` | themoviedb.org → Settings → API → API Read Access Token |
| *Optional, for trending searches:* | |
| `VITE_APPWRITE_ENDPOINT` | Appwrite console → project Settings → API Endpoint |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite console → your project |
| `VITE_APPWRITE_DATABASE_ID` | Appwrite console → Databases |
| `VITE_APPWRITE_COLLECTION_ID` | Appwrite console → your collection (fields: `searchTerm`, `count`, `movie_id`, `title`, `poster_url`) |

## Deploy

Import the repo on Vercel, add `VITE_TMDB_API_KEY` (and the Appwrite variables if you want trending searches), and deploy.
