import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useUser } from '../../Contexts/UserContext';

function TicketsListComponent() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [ticketType, setTicketType] = useState('NORMAL');
    const { fetchUserData } = useUser();

    const fetchTickets = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/tickets?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data.tickets);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

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
                    errorMessage = await response.text(); // Sinon, lisez simplement le texte de la réponse
                }

                throw new Error(errorMessage);
            }

            const newTicket = await response.json();
            setTickets(currentTickets => [...currentTickets, newTicket]);
            alert('Ticket purchased successfully!');
            await fetchTickets();
            await fetchUserData();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message); // Afficher le message d'erreur extrait ou généré
        }
    };



    if (isLoading) return <div>Loading...</div>;
    if (!tickets.length) return <div>No tickets found.</div>;

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

    return (
        <div className="container mt-5 text-center">
            <h2>Liste des Tickets</h2>
            <Button className='mt-5' variant="primary" onClick={handleBuyClick}>Acheter</Button>
            <table className="table mt-5">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Type</th>
                        <th scope="col">Used</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket, index) => (
                        <tr key={ticket.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{ticket.type}</td>
                            <td>{ticket.used ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal className='modal' show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Acheter un ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Veuillez choisir le type de ticket :</p>
                    <select
                        className="form-select"
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                    >
                        <option value="NORMAL">Normal ( 10€ | 1 séance)</option>
                        <option value="SUPER">SuperTicket ( 90€ | 10 séances)</option>
                    </select>
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
        </div>
    );
}

export default TicketsListComponent;
