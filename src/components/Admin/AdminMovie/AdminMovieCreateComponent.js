import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminMovieCreateComponent() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !description || !duration) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name,
                    description,
                    duration: parseInt(duration, 10)
                })
            });

            if (response.ok) {
                setSuccess('Film créé avec succès.');
                setName('');
                setDescription('');
                setDuration('');
                // Naviguer vers la liste après la création (optionnel)
                setTimeout(() => navigate('/admin/movies'), 1000);
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la création du film.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer un Nouveau Film</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom du film"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Description du film"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Durée (minutes)</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Durée du film en minutes"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Créer le Film</Button>
                <Button variant="secondary" className="ms-3" onClick={() => navigate('/admin/movies')}>
                    Retour à la Liste
                </Button>
                <Button variant="light" className='ms-2' onClick={() => navigate('/admin/rooms')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
