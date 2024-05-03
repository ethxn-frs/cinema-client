import React from 'react';

function RoomCardComponent({ room }) {
    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{room.name} </h5>
                <h6 className="card-title">N°{room.id}</h6>
                <p className="card-text">{room.description}</p>
                <ul className="list-unstyled">
                    <li>Type: {room.type}</li>
                    <li>Capacity: {room.capacity}</li>
                    <li>Handicap Accessible: {room.handicapAvailable ? 'Yes' : 'No'}</li>
                    <li>Status: {room.state ? 'Open' : 'Closed'}</li>
                </ul>
            </div>
        </div>
    );
}

export default RoomCardComponent;
