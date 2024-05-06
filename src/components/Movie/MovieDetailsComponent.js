import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetailsComponent() {
    const { id } = useParams();
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
                <img
                    src={movieDetails.image && movieDetails.image.path
                        ? movieDetails.image.path
                        : 'https://example.com/images/default-movie.jpg'
                    }
                    alt={movieDetails.name || "Image non disponible"}
                />
                <h1>{movieDetails.name}</h1>
                <p>{movieDetails.description}</p>
                <p>Durée : {movieDetails.duration} minutes</p>
            </div>
            <div className="showtimes-info" style={{ flex: 1 }}>
                <h2>Horaires de projection</h2>
                {movieDetails.shows && movieDetails.shows.length > 0 ? (
                    movieDetails.shows.map(show => (
                        show && show.room ? (
                            <div key={show.id} className="card m-2" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Séance {show.id}</h5>
                                    <div className="card-text">
                                        <strong>Salle:</strong> {show.room.name} (N°{show.room.id})
                                        <br />
                                        <strong>Début:</strong> {formatDate(show.startAt)}
                                        <br />
                                        <strong>Fin:</strong> {formatDate(show.endAt)}
                                    </div>
                                    <button className="btn btn-primary mt-2" onClick={() => alert(`Réserver le show ID: ${show.id}`)}>
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p>Aucune projection disponible</p>
                )}
            </div>
        </div>
    );
}

export default MovieDetailsComponent;

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    let formattedDate = date.toLocaleDateString('fr-FR', options).replace(/\/(\d{4})$/, ' $1');
    formattedDate = formattedDate.replace(/,/, '');
    formattedDate = formattedDate.replace(/:(\d{2})/, 'h$1');
    return formattedDate;
}