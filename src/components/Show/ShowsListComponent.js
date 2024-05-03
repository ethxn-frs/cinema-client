import React, { useEffect, useState } from 'react';
import ShowCardComponent from './ShowCardComponent';

function ShowsListComponent() {
    const [shows, setShows] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startMin, setStartMin] = useState('');
    const [startMax, setStartMax] = useState('');

    useEffect(() => {
        fetchShows();
    }, [startMin, startMax]); // Added dependencies to automatically update the list when dates change

    const fetchShows = async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:3000/shows');
            url.searchParams.append('orderBy', 'startAt');
            url.searchParams.append('ascending', 'false');
            if (startMin) url.searchParams.append('startAtMin', startMin);
            if (startMax) url.searchParams.append('startAtMax', startMax);

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

    if (isLoading) return <div className="text-center mt-3">Loading...</div>;
    if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

    return (
        <div className="shows-list text-center mt-5 container mx-auto">
            <h2>Toutes Les Séances</h2>
            <div className=''>
                <div className="mb-3 col-2 mx-auto mt-4">
                    <label htmlFor="startMin" className="form-label">À partir de :</label>
                    <input type="datetime-local" className="form-control" id="startMin" value={startMin} onChange={e => setStartMin(e.target.value)} />
                </div>
                <div className="mb-3 col-2 mx-auto mt-2">
                    <label htmlFor="startMax" className="form-label">Jusqu'à :</label>
                    <input type="datetime-local" className="form-control" id="startMax" value={startMax} onChange={e => setStartMax(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={fetchShows}>Filter Shows</button>
            </div>
            <div className="show-grid mt-3">
                {shows.map(show => (
                    <ShowCardComponent key={show.id} show={show} />
                ))}
            </div>
        </div>
    );
}

export default ShowsListComponent;
