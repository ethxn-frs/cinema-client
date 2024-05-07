import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Pagination, Form } from 'react-bootstrap';
import { useUser } from '../../Contexts/UserContext';

function TicketsListComponent() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [ticketType, setTicketType] = useState('NORMAL');
    const [filterType, setFilterType] = useState('');
    const [filterUsed, setFilterUsed] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { fetchUserData } = useUser();
    const ticketsPerPage = 10; // Number of tickets per page

    const fetchTickets = async (page = 1) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
        try {
            setLoading(true);
            const url = new URL('http://localhost:3000/tickets');
            url.searchParams.append('userId', userId);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', ticketsPerPage);
            if (filterType) url.searchParams.append('ticketType', filterType);
            if (filterUsed) url.searchParams.append('used', filterUsed);
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data.tickets);
            setTotalPages(Math.ceil(data.totalCount / ticketsPerPage));
            setCurrentPage(page);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filterType, filterUsed]);

    const buyTicket = async (type) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/tickets`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ticketType: type })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to buy ticket';
                const contentType = response.headers.get('Content-Type');

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = await response.text();
                }

                throw new Error(errorMessage);
            }

            const newTicket = await response.json();
            setTickets(currentTickets => [...currentTickets, newTicket]);
            alert('Ticket purchased successfully!');
            await fetchTickets(currentPage);
            await fetchUserData();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handlePageChange = (page) => {
        fetchTickets(page);
    };

    const handleBuyClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleConfirmPurchase = () => {
        buyTicket(ticketType);
        setShowModal(false);
    };

    const extractMovieName = (shows) => {
        return shows.length > 0 && shows[0] ? formatDate(shows[0].startAt) + " - " + shows[0].movie.name : ' - ';
    }

    return (
        <div className="container mt-5 text-center">
            <h2 className="text-center">Liste des Tickets</h2>

            <div className="d-flex justify-content-center">
                <Form.Group controlId="filterType" className="mx-2">
                    <Form.Label>Type de Ticket</Form.Label>
                    <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">Tous</option>
                        <option value="NORMAL">Normal</option>
                        <option value="SUPER">SuperTicket</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="filterUsed" className="mx-2">
                    <Form.Label>Utilisé</Form.Label>
                    <Form.Select value={filterUsed} onChange={(e) => setFilterUsed(e.target.value)}>
                        <option value="">Tous</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </Form.Select>
                </Form.Group>

                <Button className="align-self-end" variant="primary" onClick={() => fetchTickets()}>
                    Filtrer
                </Button>
            </div>

            <Button className='mt-3 mb-3' variant="primary" onClick={handleBuyClick}>Acheter</Button>

            <Table striped bordered hover responsive className="mt-3">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Used</th>
                        <th>Film</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length > 0 ? (
                        tickets.map((ticket, index) => (
                            <tr key={ticket.id}>
                                <td>{(currentPage - 1) * ticketsPerPage + index + 1}</td>
                                <td>{ticket.type}</td>
                                <td>{ticket.used ? 'Yes' : 'No'}</td>
                                <td>  {extractMovieName(ticket.shows)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No tickets found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                {[...Array(totalPages).keys()].map(pageNumber => (
                    <Pagination.Item
                        key={pageNumber + 1}
                        active={pageNumber + 1 === currentPage}
                        onClick={() => handlePageChange(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal className='modal' show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Acheter un ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Veuillez choisir le type de ticket :</p>
                    <Form.Select
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                    >
                        <option value="NORMAL">Normal ( 10€ | 1 séance)</option>
                        <option value="SUPER">SuperTicket ( 90€ | 10 séances)</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleConfirmPurchase}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>

            {!tickets.length && <div className="text-center mt-3">No tickets found.</div>}
        </div>
    );
}

export default TicketsListComponent;


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    let formattedDate = date.toLocaleDateString('fr-FR', options).replace(/\/(\d{4})$/, ' $1');
    formattedDate = formattedDate.replace(/,/, '');
    formattedDate = formattedDate.replace(/:(\d{2})/, 'h$1');
    return formattedDate;
}