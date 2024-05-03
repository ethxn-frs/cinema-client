import React, { useEffect, useState } from 'react';
import RoomCardComponent from './RoomCardComponent';

function RoomsListComponent() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/rooms?ascending=false');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRooms(data.rooms);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="rooms-list text-center mt-5">
            <h2>Toutes Les Salles</h2>
            <div className="room-grid">
                {rooms.map(room => (
                    <RoomCardComponent room={room} />
                ))}
            </div>
        </div>
    );
}

export default RoomsListComponent;
