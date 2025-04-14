import React from 'react';

const MovieCard = ({ movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language
} }) => {
    const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '/no-movie.png';

    return (
        <div className="movie-card">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto rounded"
            />
            <div className="p-2">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-gray-500">{release_date} | {original_language.toUpperCase()}</p>
                <p className="text-yellow-500">⭐ {vote_average}</p>
            </div>
        </div>
    );
};

export default MovieCard;
