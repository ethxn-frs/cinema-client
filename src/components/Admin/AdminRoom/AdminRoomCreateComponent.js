// src/Components/AdminRoomCreateComponent.js

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminRoomCreateComponent() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        state: false,
        handicapAvailable: false,
        capacity: 0,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(`Room créée avec succès : ${result.name}`);
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la création de la room');
                // Ajout pour gérer des erreurs spécifiques des champs
                if (result.errors) {
                    const errors = Object.keys(result.errors).map(field => `${field}: ${result.errors[field].join(', ')}`);
                    setError(errors.join(' | '));
                }
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer une nouvelle Room</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Capacité</Form.Label>
                    <Form.Control
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                        min="1"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="state"
                        checked={formData.state}
                        onChange={handleInputChange}
                        label="Active"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="handicapAvailable"
                        checked={formData.handicapAvailable}
                        onChange={handleInputChange}
                        label="Disponible pour personnes handicapées"
                    />
                </Form.Group>
                <Button type="submit" className='me-2' variant="primary">Créer</Button>
                <Button variant="light" className='ms-2' onClick={() => navigate('/admin/rooms')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
