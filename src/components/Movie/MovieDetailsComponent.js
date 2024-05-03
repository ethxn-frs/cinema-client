import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetailsComponent() {
    const { id } = useParams(); // Utilisation de useParams pour obtenir l'identifiant du film à partir de l'URL
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/movies/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur HTTP! ' + response.status);
                }
                const data = await response.json();
                setMovieDetails(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (!movieDetails) return <div>Aucun film trouvé</div>;

    return (
        <div className="movie-details-container d-flex">
            <div className="movie-info" style={{ flex: 1 }}>
                <img src={movieDetails.image && movieDetails.image.path ? movieDetails.image.path : 'https://example.com/images/default-movie.jpg'} alt={movieDetails.name} />
                <h1>{movieDetails.name}</h1>
                <p>{movieDetails.description}</p>
                <p>Durée : {movieDetails.duration} minutes</p>
            </div>
            <div className="showtimes-info" style={{ flex: 1 }}>
                <h2>Horaires de projection</h2>
                {movieDetails.shows && movieDetails.shows.map(show => (
                    <div key={show.id}>
                        <h3>{show.room.name}</h3>
                        <p>Début : {new Date(show.startAt).toLocaleTimeString()}</p>
                        <p>Fin : {new Date(show.endAt).toLocaleTimeString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieDetailsComponent;
