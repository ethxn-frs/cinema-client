import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

export default function AdminUpdateMovieComponent() {
    const { id } = useParams(); // Récupère l'ID du film à modifier à partir de l'URL
    const navigate = useNavigate();
    const [movie, setMovie] = useState({ name: '', description: '', duration: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchMovie = async () => {
            setError('');
            try {
                const response = await fetch(`http://localhost:3000/movies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMovie(data);
                } else {
                    setError('Erreur lors du chargement du film.');
                }
            } catch (err) {
                setError('Une erreur est survenue : ' + err.message);
            }
        };

        fetchMovie();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovie({ ...movie, [name]: value });
    };

    const handleUpdateMovie = async (e) => {
        const updateData = {
            id: movie.id,
            name: movie.name,
            description: movie.description,
            duration: movie.duration
        }
            
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                setSuccess('Film mis à jour avec succès.');
                navigate('/admin/movies'); // Retourner à la liste des films après la mise à jour
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la mise à jour du film.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Modifier le Film</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleUpdateMovie}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={movie.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={movie.description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Durée (minutes)</Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        value={movie.duration}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Enregistrer les modifications
                </Button>
                <Button variant="secondary" className="ms-2" onClick={() => navigate('/admin/movies')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
