import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Modal, Button, Form } from 'react-bootstrap';
import LogoutButton from '../Logout/LogoutButton';
import { useUser } from '../../Contexts/UserContext';

function HeaderComponent() {
    const { userDetails, fetchUserData } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [isCredit, setIsCredit] = useState(true); // True pour créditer, false pour retirer

    const handleOpenModal = (credit) => {
        setIsCredit(credit);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setAmount('');
    };

    const handleConfirm = async () => {
        if (!amount) {
            alert('Veuillez entrer un montant valide');
            return;
        }
        const updateAmount = isCredit ? Math.abs(amount) : -Math.abs(amount);

        try {
            const response = await fetch(`http://localhost:3000/users/${userDetails.id}/sold`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ sold: updateAmount })
            });

            if (!response.ok) {
                const contentType = response.headers.get('Content-Type');
                let errorMessage = 'Échec de la mise à jour du solde';

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = await response.text();
                }

                throw new Error(errorMessage);
            }

            alert(isCredit ? 'Compte crédité avec succès!' : 'Montant retiré avec succès!');
            fetchUserData();
            handleModalClose();
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    };

    // Vérifie si l'utilisateur est un administrateur (utilise une liste de rôles ou une simple chaîne)
    const isAdmin = userDetails.roles && userDetails.roles.includes('admin');

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">CINEMA-JS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/movies">Films</Nav.Link>
                        <Nav.Link href="/shows">Séances</Nav.Link>
                        <Nav.Link href="/rooms">Salles</Nav.Link>
                        <Nav.Link href="/tickets">Tickets</Nav.Link>
                        <Nav.Link href="/transactions">Transactions</Nav.Link>
                        <NavDropdown title="Plus" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleOpenModal(true)}>Créditer son compte</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleOpenModal(false)}>Retirer du solde</NavDropdown.Item>
                            <NavDropdown.Item href="/transactions">Mes séances</NavDropdown.Item>
                            {isAdmin && (
                                <>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
                                </>
                            )}
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#contact">Contact</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div className="navbar-text me-3">
                        Solde: {userDetails.sold} €
                    </div>
                </Navbar.Collapse>
                <LogoutButton />
            </Container>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isCredit ? 'Créditer son compte' : 'Retirer du solde'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Montant ({isCredit ? 'Créditer' : 'Retirer'}):</Form.Label>
                            <Form.Control
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                placeholder="Entrez un montant"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Navbar>
    );
}

export default HeaderComponent;
