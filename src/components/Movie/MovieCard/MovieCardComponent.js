import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MovieCardComponent({ movie }) {
    const navigate = useNavigate();

    const handleMoreInfo = () => {
        navigate(`/movies/${movie.id}`);
    };

    return (
        <Card className="mb-3" style={{ color: "#000" }}>
            <Card.Img variant="top" src={movie.image || 'default-movie.jpg'} alt={movie.name} />
            <Card.Body>
                <Card.Title>{movie.name}</Card.Title>
                <Card.Text>
                    {movie.description}
                </Card.Text>
                <Card.Text>
                    Durée: {movie.duration} minutes
                </Card.Text>
                <button onClick={handleMoreInfo} className="btn btn-primary">Plus d'infos</button>
            </Card.Body>
        </Card>
    );
}

export default MovieCardComponent;
