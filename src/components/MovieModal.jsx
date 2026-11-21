import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovieDetails, IMG } from '../tmdb.js';
import Spinner from './Spinner.jsx';

// Vendet ku kerkojme platformat, sipas radhes
const REGIONS = ['AL', 'IT', 'GB', 'US'];
const REGION_NAMES = { AL: 'Albania', IT: 'Italy', GB: 'United Kingdom', US: 'United States' };

const pickTrailer = (videos = []) => {
    const yt = videos.filter((v) => v.site === 'YouTube');
    return (
        yt.find((v) => v.type === 'Trailer' && v.official) ||
        yt.find((v) => v.type === 'Trailer') ||
        yt.find((v) => v.type === 'Teaser') ||
        yt[0] ||
        null
    );
};

const pickProviders = (all = {}) => {
    for (const r of REGIONS) {
        const p = all[r];
        if (p && (p.flatrate || p.rent || p.buy || p.free || p.ads)) return { region: r, ...p };
    }
    return null;
};

const ProviderRow = ({ label, list, link }) =>
    list?.length ? (
        <div className="mt-3">
            <p className="text-sm text-light-200 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {list.map((p) => (
                    <a
                        key={p.provider_id}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.provider_name}
                        className="flex items-center gap-2 bg-dark-100 hover:bg-light-100/10 rounded-lg pr-3 transition"
                    >
                        <img src={IMG(p.logo_path, 'w92')} alt="" className="w-10 h-10 rounded-lg" />
                        <span className="text-sm text-white">{p.provider_name}</span>
                    </a>
                ))}
            </div>
        </div>
    ) : null;

const MovieModal = ({ movieId, onClose }) => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!movieId) return;
        let alive = true;
        setMovie(null);
        setError('');
        fetchMovieDetails(movieId)
            .then((data) => alive && setMovie(data))
            .catch(() => alive && setError('Could not load this movie. Please try again.'));
        return () => {
            alive = false;
        };
    }, [movieId]);

    useEffect(() => {
        if (!movieId) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [movieId, onClose]);

    const trailer = movie ? pickTrailer(movie.videos?.results) : null;
    const providers = movie ? pickProviders(movie['watch/providers']?.results) : null;
    const year = movie?.release_date ? movie.release_date.split('-')[0] : '';
    const runtime = movie?.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

    return (
        <AnimatePresence>
            {movieId && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={movie?.title || 'Movie details'}
                        className="relative w-full max-w-4xl bg-primary border border-light-100/10 rounded-2xl overflow-hidden shadow-2xl my-auto"
                        initial={{ y: 30, scale: 0.98 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 30, scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 text-white text-xl hover:bg-black/80"
                        >
                            ×
                        </button>

                        {error && <p className="p-8 text-red-500">{error}</p>}
                        {!movie && !error && (
                            <div className="p-16 flex justify-center">
                                <Spinner />
                            </div>
                        )}

                        {movie && (
                            <>
                                {trailer ? (
                                    <div className="aspect-video bg-black">
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                                            title={`${movie.title} trailer`}
                                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : movie.backdrop_path ? (
                                    <img src={IMG(movie.backdrop_path, 'w1280')} alt="" className="w-full aspect-video object-cover" />
                                ) : null}

                                <div className="p-5 sm:p-8 grid sm:grid-cols-[160px_1fr] gap-6">
                                    <img
                                        src={IMG(movie.poster_path) || '/no-movie.png'}
                                        alt={movie.title}
                                        className="hidden sm:block w-40 rounded-xl"
                                    />
                                    <div className="min-w-0">
                                        <h2 className="!text-left">{movie.title}</h2>
                                        <p className="text-light-200 mt-1 text-sm">
                                            {[year, runtime, movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : '']
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                        {movie.genres?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {movie.genres.map((g) => (
                                                    <span key={g.id} className="text-xs text-light-100 bg-dark-100 px-3 py-1 rounded-full">
                                                        {g.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {movie.tagline && <p className="text-light-100 italic mt-4">{movie.tagline}</p>}
                                        <p className="text-gray-100 mt-3 leading-relaxed">{movie.overview || 'No overview available.'}</p>

                                        <div className="mt-6 border-t border-light-100/10 pt-5">
                                            <h3 className="text-white font-bold text-lg">Where to watch</h3>
                                            {providers ? (
                                                <>
                                                    <p className="text-xs text-gray-100 mt-1">
                                                        Availability in {REGION_NAMES[providers.region]}
                                                    </p>
                                                    <ProviderRow label="Stream" list={providers.flatrate} link={providers.link} />
                                                    <ProviderRow label="Free" list={[...(providers.free || []), ...(providers.ads || [])]} link={providers.link} />
                                                    <ProviderRow label="Rent" list={providers.rent} link={providers.link} />
                                                    <ProviderRow label="Buy" list={providers.buy} link={providers.link} />
                                                    <p className="text-xs text-gray-100 mt-4">Streaming data by JustWatch</p>
                                                </>
                                            ) : (
                                                <p className="text-gray-100 mt-2 text-sm">
                                                    Not available on streaming yet. It may still be in cinemas.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieModal;
