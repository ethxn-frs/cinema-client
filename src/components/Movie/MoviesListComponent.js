import React, { useEffect, useState } from 'react';
import MovieCardComponent from './MovieCardComponent';

function MoviesListComponent() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State to manage the search term

    useEffect(() => {
        fetchMovies(); // This will run only once when the component mounts
    }, []);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:3000/movies');
            url.searchParams.append('ascending', 'false');
            if (searchTerm) {
                url.searchParams.append('name', searchTerm);
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMovies(data.movies.map(movie => ({
                ...movie,
                image: movie.image ? movie.image.path : 'https://example.com/images/default-movie.jpg'
            })));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

    return (
        <div className="movies-list text-center mt-5 container">
            <h2>Tous Les Films</h2>
            <div className="input-group mb-3 col-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un film"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={fetchMovies}>
                    Rechercher
                </button>
            </div>
            <div className="movie-grid">
                {movies.map(movie => (
                    <MovieCardComponent key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default MoviesListComponent;
