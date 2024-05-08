import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminUserListComponent() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [userDeleteModal, setUserDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3000/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(Array.isArray(data.user) ? data.user : []);
            } else {
                setError('Erreur lors du chargement des utilisateurs.');
            }
        } catch (err) {
            setError('Une erreur est survenue : ' + err.message);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setUserDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:3000/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setSuccess(`Séance supprimée avec succès : ${userToDelete.id}`);
                setUsers(users.filter(user => user.id !== userToDelete.id));
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

        setUserDeleteModal(false);
        setUserToDelete(null);
    };

    const handleCancelDelete = () => {
        setUserDeleteModal(false);
        setUserToDelete(null);
    };

    return (
        <div className="container mt-5">
            <h2>Liste des Utilisateurs</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/users/create')}>
                Créer un Utilisateur
            </Button>
            <Button className="mb-3 ms-2 ligth" onClick={() => navigate('/admin')}>
                Retour
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Créé le</th>
                        <th>Solde</th>
                        <th>Rôles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.login}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>{user.sold}</td>
                                <td>{user.roles}</td>
                                <td>
                                    <Button variant="warning" className="me-2">Modifier</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(user)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun utilisateur trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal de confirmation de suppression */}
            <Modal user={userDeleteModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment supprimer la séance : {userToDelete && `${userToDelete.id}`} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>Annuler</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
