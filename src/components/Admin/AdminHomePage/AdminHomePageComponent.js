import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminHomePageComponent() {
    const navigate = useNavigate();

    // Structure de chaque card avec des liens pour les composants de liste et de création
    const entityCards = [
        {
            title: "Gestion des Salles",
            listPath: "/admin/rooms",
            createPath: "/admin/rooms/create",
        },
        {
            title: "Gestion des Séances",
            listPath: "/admin/shows",
            createPath: "/admin/shows/create",
        },
        {
            title: "Gestion des Films",
            listPath: "/admin/movies",
            createPath: "/admin/movies/create",
        },
        {
            title: "Gestion des Utilisateurs",
            listPath: "/admin/users",
            createPath: "/admin/users/create",
        },
    ];

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Tableau de bord administrateur</h2>
            <Row>
                {entityCards.map((card, index) => (
                    <Col md={6} lg={4} key={index} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(card.listPath)}
                                    className="me-2"
                                >
                                    Liste
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => navigate(card.createPath)}
                                >
                                    Créer
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default AdminHomePageComponent;
