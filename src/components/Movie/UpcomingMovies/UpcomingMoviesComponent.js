import React from 'react';
import MovieCardComponent from '../MovieCard/MovieCardComponent';

function UpcomingMoviesComponent({ movies }) {
    return (
        <div className="upcoming-movies text-center mt-5">
            <h2>Films récents</h2>
            <div className="movie-grid">
                {movies.map(movie => (
                    <MovieCardComponent key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default UpcomingMoviesComponent;
