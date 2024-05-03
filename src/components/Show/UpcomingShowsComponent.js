import React from 'react';
import ShowCardComponent from './ShowCardComponent'; // Make sure the path is correct

function UpcomingShowsComponent({ showtimes }) {
    return (
        <div className="showtimes text-center">
            <h2>Prochaines séances</h2>
            <div className="d-flex flex-wrap justify-content-center">
                {showtimes && showtimes.map(show => (
                    <ShowCardComponent key={show.id} show={show} />
                ))}
            </div>
        </div>
    );
}

export default UpcomingShowsComponent;
