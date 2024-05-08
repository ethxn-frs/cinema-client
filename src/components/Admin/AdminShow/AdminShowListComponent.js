// src/Components/AdminShowListComponent.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminShowListComponent() {
    const [shows, setShows] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToDelete, setShowToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/shows', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Assume the API returns an array directly
                setShows(Array.isArray(data.shows) ? data.shows : []);
            } else {
                setError('Erreur lors du chargement des shows.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    const handleDeleteClick = (show) => {
        setShowToDelete(show);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!showToDelete) return;

        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/shows/${showToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setSuccess(`Séance supprimée avec succès : ${showToDelete.id}`);
                setShows(shows.filter(show => show.id !== showToDelete.id));
            } else {
                try {
                    const result = await response.json();
                    setError(result.error || 'Erreur lors de la suppression de la séance.');
                } catch {
                    const result = await response.text();
                    setError(result || 'Erreur lors de la suppression de la séance.');
                }
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }

        setShowDeleteModal(false);
        setShowToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setShowToDelete(null);
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Séances</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/shows/create')}>
                Créer une Séance
            </Button>
            <Button className="mb-3 ms-2 ligth" onClick={() => navigate('/admin')}>
                Retour
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>État</th>
                        <th>Salle</th>
                        <th>Film</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shows.length > 0 ? (
                        shows.map((show) => (
                            <tr key={show.id}>
                                <td>{show.id}</td>
                                <td>{new Date(show.startAt).toLocaleString()}</td>
                                <td>{new Date(show.endAt).toLocaleString()}</td>
                                <td>{show.state ? 'Actif' : 'Annulé'}</td>
                                <td>{show.room.id}</td>
                                <td>{show.movie ? show.movie.name : 'Inconnu'}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => navigate(`/admin/shows/edit/${show.id}`)}>
                                        Modifier
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(show)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Aucune séance trouvée.</td>
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
                    Voulez-vous vraiment supprimer la séance : {showToDelete && `${showToDelete.id}`} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>Annuler</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
