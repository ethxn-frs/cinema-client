import React, { useEffect, useState } from 'react';

function ShowCardComponent({ show, onReserve, updateRemainingPlaces }) {
    const [remainingPlaces, setRemainingPlaces] = useState(null);

    useEffect(() => {
        const fetchRemainingPlaces = async () => {
            try {
                const response = await fetch(`http://localhost:3000/shows/${show.id}/remaining-places`);
                const data = await response.json();
                setRemainingPlaces(data.remainingPlaces);
                updateRemainingPlaces(show.id, data.remainingPlaces);
            } catch (error) {
                console.error("Failed to fetch remaining places:", error);
            }
        };

        fetchRemainingPlaces();
    }, [show.id, updateRemainingPlaces]);

    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <img src={show.movie.image ? show.movie.image.path : 'https://example.com/images/default-movie.jpg'}
                alt={show.movie.name} className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{show.movie.name}</h5>
                <p className="card-text">{show.movie.description}</p>
                <p className="card-text"><small className="text-muted">Duration: {show.movie.duration} minutes</small></p>
                <div className="card-text">
                    <strong>Salle:</strong> {show.room.name} (N°{show.room.id})
                    <br />
                    <strong>Début:</strong> {formatDate(show.startAt)}
                    <br />
                    <strong>Fin:</strong> {formatDate(show.endAt)}
                    <br />
                    <strong>Remaining Places:</strong> {remainingPlaces !== null ? remainingPlaces : "Loading..."}
                </div>
                <button className="btn btn-primary mt-2" onClick={() => onReserve(show)} disabled={remainingPlaces !== null && remainingPlaces <= 0}>
                    Réserver
                </button>
            </div>
        </div>
    );
}

export default ShowCardComponent;

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    let formattedDate = date.toLocaleDateString('fr-FR', options).replace(/\/(\d{4})$/, ' $1');
    formattedDate = formattedDate.replace(/,/, '');
    formattedDate = formattedDate.replace(/:(\d{2})/, 'h$1');
    return formattedDate;
}
