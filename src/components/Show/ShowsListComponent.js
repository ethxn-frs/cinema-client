import React, { useEffect, useState } from 'react';
import ShowCardComponent from './ShowCardComponent';
import { Modal, Button, Form } from 'react-bootstrap';

function ShowsListComponent() {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startMin, setStartMin] = useState('');
    const [startMax, setStartMax] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [tickets, setTickets] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMovies();
        fetchShows();
        fetchTickets();
    }, [startMin, startMax, selectedMovie]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://localhost:3000/movies');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMovies(data.movies);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchShows = async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:3000/shows');
            url.searchParams.append('orderBy', 'startAt');
            url.searchParams.append('ascending', 'false');
            if (startMin) url.searchParams.append('startAtMin', startMin);
            if (startMax) url.searchParams.append('startAtMax', startMax);
            if (selectedMovie) url.searchParams.append('movieId', selectedMovie);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setShows(data.shows);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

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
        }
    };

    const handleReserve = (show) => {
        setSelectedShow(show);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedShow(null);
    };

    if (isLoading) return <div className="text-center mt-3">Loading...</div>;
    if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

    return (
        <div className="shows-list text-center mt-5 container mx-auto">
            <h2>Toutes Les Séances</h2>
            <div className="row">
                <div className="col-12 col-md-4 mb-3">
                    <Form.Group controlId="movieFilter">
                        <Form.Label>Film</Form.Label>
                        <Form.Select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                        >
                            <option value="">Tous</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>{movie.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="col-12 col-md-4 mb-3">
                    <Form.Group controlId="startMin">
                        <Form.Label>À partir de :</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startMin}
                            onChange={(e) => setStartMin(e.target.value)}
                        />
                    </Form.Group>
                </div>
                <div className="col-12 col-md-4 mb-3">
                    <Form.Group controlId="startMax">
                        <Form.Label>Jusqu'à :</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startMax}
                            onChange={(e) => setStartMax(e.target.value)}
                        />
                    </Form.Group>
                </div>
                <div className="col-12 text-center">
                    <Button variant="primary" onClick={fetchShows}>Filter Shows</Button>
                </div>
            </div>
            <div className="show-grid mt-3">
                {shows.map(show => (
                    <ShowCardComponent
                        key={show.id}
                        show={show}
                        tickets={tickets}
                        onReserve={handleReserve}
                    />
                ))}
            </div>

            {selectedShow && (
                <ReservationModal
                    show={selectedShow}
                    tickets={tickets}
                    showModal={showModal}
                    onClose={handleModalClose}
                    fetchShows={fetchShows}
                />
            )}
        </div>
    );
}

function ReservationModal({ show, tickets, showModal, onClose, fetchShows }) {
    const normalTickets = tickets.filter(ticket => ticket.type === 'NORMAL' && !ticket.used);
    const superTickets = tickets.filter(ticket => ticket.type === 'SUPER' && !ticket.used);

    const reserveShow = async (ticketId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/shows/${show.id}/book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: ticketId }),
            });

            if (!response.ok) {
                throw new Error('Failed to reserve show');
            }

            alert('Reservation successful');
            fetchShows(); // Trigger fetching of shows
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to reserve show');
        }
    };

    return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Réserver une séance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>{show.movie.name}</strong> | {formatDate(show.startAt)} - {formatDate(show.endAt)} </p>
                <p>Normal Tickets: {normalTickets.length}</p>
                <p>Super Tickets: {superTickets.length}</p>
                {normalTickets.length > 0 && (
                    <Button className="btn btn-primary col-6" onClick={() => reserveShow(normalTickets[0].id)}>
                        Réserver avec un Ticket Normal
                    </Button>
                )}
                {superTickets.length > 0 && (
                    <Button className="btn btn-secondary col-6" onClick={() => reserveShow(superTickets[0].id)}>
                        Réserver avec un Super Ticket
                    </Button>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ShowsListComponent;

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    let formattedDate = date.toLocaleDateString('fr-FR', options).replace(/\/(\d{4})$/, ' $1');
    formattedDate = formattedDate.replace(/,/, '');
    formattedDate = formattedDate.replace(/:(\d{2})/, 'h$1');
    return formattedDate;
}
