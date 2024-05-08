// src/Components/AdminShowUpdateComponent.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

export default function AdminShowUpdateComponent() {
    const { id } = useParams(); // Récupère l'ID du show à modifier à partir de l'URL
    const navigate = useNavigate();
    const [show, setShow] = useState({ startAt: '', state: 'ACTIF', roomId: '' });
    const [rooms, setRooms] = useState([]); // Stocke les salles disponibles
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Charge les données du show actuel et la liste des salles
    useEffect(() => {
        const fetchShowAndRooms = async () => {
            setError('');
            try {
                const showResponse = await fetch(`http://localhost:3000/shows/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (showResponse.ok) {
                    const showData = await showResponse.json();
                    showData.startAt = new Date(showData.startAt).toISOString().slice(0, 16);
                    setShow(showData);
                } else {
                    setError('Erreur lors du chargement du spectacle.');
                }

                const roomsResponse = await fetch('http://localhost:3000/rooms', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (roomsResponse.ok) {
                    const roomsData = await roomsResponse.json();
                    setRooms(roomsData.rooms);
                } else {
                    setError('Erreur lors du chargement des salles.');
                }

            } catch (err) {
                setError('Une erreur est survenue : ' + err.message);
            }
        };

        fetchShowAndRooms();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value });
    };

    const handleUpdateShow = async (e) => {
        const updateShow = {
            id: show.id,
            startAt: show.startAt,
            state: show.state,
            roomId: show.room.id
        };

        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/shows/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateShow)
            });

            if (response.ok) {
                setSuccess('Spectacle mis à jour avec succès.');
                navigate('/admin/shows'); // Retourner à la liste des spectacles après la mise à jour
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la mise à jour du spectacle.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Modifier le Spectacle</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleUpdateShow}>
                <Form.Group className="mb-3">
                    <Form.Label>Début du spectacle</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="startAt"
                        value={show.startAt}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Salle</Form.Label>
                    <Form.Control
                        as="select"
                        name="roomId"
                        value={show.roomId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="updatedRoom" disabled>Choisir une salle</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room}>
                                {room.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>État du spectacle</Form.Label>
                    <Form.Control
                        as="select"
                        name="state"
                        value={show.state}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="ACTIF">Actif</option>
                        <option value="ANNULÉE">Annulé</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Enregistrer les modifications
                </Button>
                <Button variant="secondary" className="ms-2" onClick={() => navigate('/admin/shows')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
