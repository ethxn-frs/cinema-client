import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

function PublicHeaderComponent() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">CINEMA-JS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/login">Connexion</Nav.Link>
                        <Nav.Link href="/signup">Inscription</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default PublicHeaderComponent;
