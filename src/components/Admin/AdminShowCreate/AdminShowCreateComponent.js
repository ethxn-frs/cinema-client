// src/Components/AdminShowCreateComponent.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminShowCreateComponent() {
    const [rooms, setRooms] = useState([]);
    const [movies, setMovies] = useState([]);
    const [startAt, setStartAt] = useState('');
    const [roomId, setRoomId] = useState('');
    const [movieId, setMovieId] = useState('');
    const [state, setState] = useState('ACTIF');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoomsAndMovies();
    }, []);

    const fetchRoomsAndMovies = async () => {
        setError('');
        setSuccess('');
        try {
            const [roomsResponse, moviesResponse] = await Promise.all([
                fetch('http://localhost:3000/rooms', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                fetch('http://localhost:3000/movies', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            if (roomsResponse.ok && moviesResponse.ok) {
                const roomsData = await roomsResponse.json();
                const moviesData = await moviesResponse.json();
                setRooms(Array.isArray(roomsData.rooms) ? roomsData.rooms : []);
                setMovies(Array.isArray(moviesData.movies) ? moviesData.movies : []);
            } else {
                setError('Erreur lors du chargement des salles ou des films.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/shows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ roomId, movieId, startAt, state })
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(`Séance créée avec succès : ID ${result.id}`);
                navigate('/admin/shows');
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la création de la séance.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer une Séance</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRoom">
                    <Form.Label>Salle</Form.Label>
                    <Form.Control as="select" value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
                        <option value="">Choisir une salle</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formMovie">
                    <Form.Label>Film</Form.Label>
                    <Form.Control as="select" value={movieId} onChange={(e) => setMovieId(e.target.value)} required>
                        <option value="">Choisir un film</option>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formStartAt">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formState">
                    <Form.Label>État</Form.Label>
                    <Form.Control as="select" value={state} onChange={(e) => setState(e.target.value)} required>
                        <option value="ACTIF">Actif</option>
                        <option value="ANNULÉE">Annulée</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Créer
                </Button>
                <Button variant="light" className='ms-2' onClick={() => navigate('/admin/rooms')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
