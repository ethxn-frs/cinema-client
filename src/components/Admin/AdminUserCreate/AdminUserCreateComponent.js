// src/Components/AdminUserCreateComponent.js

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminUserCreateComponent() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [sold, setSold] = useState('');
    const [roles, setRoles] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const userPayload = {
            login,
            password,
            sold: sold ? parseFloat(sold) : undefined,
            roles: roles ? roles : undefined
        };

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userPayload)
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`Utilisateur créé avec succès : ${data.login}`);
                navigate('/admin/users');
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la création de l\'utilisateur.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer un Utilisateur</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Entrez le login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Entrez le mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Solde</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Entrez le solde (optionnel)"
                        value={sold}
                        onChange={(e) => setSold(e.target.value)}
                        min="0"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rôles</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Entrez les rôles séparés par des virgules (optionnel)"
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Créer</Button>
                <Button variant="light" className='ms-2' onClick={() => navigate('/admin/rooms')}>
                    Annuler
                </Button>
            </Form>
        </div>
    );
}
