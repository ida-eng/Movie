export const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    },
};

export const IMG = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

// Detajet e filmit + trailer-at + ku shihet, ne nje kerkese te vetme
export const fetchMovieDetails = async (id) => {
    const res = await fetch(
        `${API_BASE_URL}/movie/${id}?append_to_response=videos,watch/providers`,
        API_OPTIONS
    );
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return res.json();
};
