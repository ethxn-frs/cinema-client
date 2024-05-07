// src/Components/AdminMovieListComponent.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminMovieListComponent() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/movies', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMovies(Array.isArray(data.movies) ? data.movies : []);
            } else {
                setError('Erreur lors du chargement des films.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    const handleDeleteClick = (movie) => {
        setMovieToDelete(movie);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!movieToDelete) return;

        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/movies/${movieToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setSuccess(`Film supprimé avec succès : ${movieToDelete.name}`);
                setMovies(movies.filter(movie => movie.id !== movieToDelete.id));
            } else {
                const result = await response.json();
                setError(result.error || 'Erreur lors de la suppression du film.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }

        setShowDeleteModal(false);
        setMovieToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setMovieToDelete(null);
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Films</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/movies/create')}>
                Créer un Film
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
                        <th>Durée (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.name}</td>
                                <td>{movie.description}</td>
                                <td>{movie.duration}</td>
                                <td>
                                    <Button variant="warning" className="me-2">Modifier</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(movie)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun film trouvé.</td>
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
                    Voulez-vous vraiment supprimer le film : {movieToDelete && `${movieToDelete.id} - ${movieToDelete.name}`} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>Annuler</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
