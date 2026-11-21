import React from 'react';

const MovieCard = ({ onSelect, movie: {
    id,
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
        <div
            className="movie-card cursor-pointer hover:scale-[1.03] transition-transform"
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(id)}
        >
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto rounded"
            />
            <div className="p-2">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-gray-500">{release_date ? release_date.split('-')[0] : 'N/A'} | {original_language ? original_language.toUpperCase() : 'N/A'}</p>
                <p className="text-yellow-500">⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>
        </div>
    );
};

export default MovieCard;
