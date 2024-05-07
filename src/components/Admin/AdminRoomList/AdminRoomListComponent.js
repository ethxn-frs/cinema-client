// src/Components/AdminRoomListComponent.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminRoomListComponent() {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/rooms', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRooms(Array.isArray(data.rooms) ? data.rooms : []);
            } else {
                setError('Erreur lors du chargement des rooms.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    const handleDeleteClick = (room) => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!roomToDelete) return;

        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/rooms/${roomToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setSuccess(`Room supprimée avec succès : ${roomToDelete.name}`);
                setRooms(rooms.filter(room => room.id !== roomToDelete.id));
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la suppression de la room.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }

        setShowDeleteModal(false);
        setRoomToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setRoomToDelete(null);
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Rooms</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" className="mb-3 me-2" onClick={() => navigate('/admin/rooms/create')}>
                Créer une Room
            </Button>
            <Button className="mb-3 ms-2 ligth" onClick={() => navigate('/admin')}>
                Retour
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <tr key={room.id}>
                                <td>{room.id}</td>
                                <td>{room.name}</td>
                                <td>{room.description}</td>
                                <td>
                                    <Button variant="warning" className="me-2">Modifier</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(room)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Aucune room trouvée.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal de confirmation de suppression */}
            <Modal show={showDeleteModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer la room : {roomToDelete && `${roomToDelete.id} - ${roomToDelete.name}`} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>Annuler</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
