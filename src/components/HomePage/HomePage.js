import React, { useEffect, useState } from 'react';
import UpcomingMoviesComponent from '../Movie/UpcomingMoviesComponent';
import UpcomingShowsComponent from '../Show/UpcomingShowsComponent';
import RoomsListComponent from '../Room/RoomsListComponent';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url = new URL('http://localhost:3000/movies');
        url.searchParams.append('limit', '3');
        url.searchParams.append('orderBy', 'id');
        url.searchParams.append('ascending', 'false');

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.movies.map(movie => ({
          ...movie,
          image: movie.image ? movie.image.path : 'https://example.com/images/default-movie.jpg'
        })));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchShows = async () => {
      try {
        const url = new URL('http://localhost:3000/shows');
        url.searchParams.append('limit', '3');
        url.searchParams.append('orderBy', 'startAt');
        url.searchParams.append('ascending', 'false');
        url.searchParams.append('startAtMin', new Date().toISOString());


        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const showData = await response.json();
        setShowtimes(showData.shows);
      } catch (e) {
        setError(e.message);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const roomData = await response.json();
        setRooms(roomData.rooms);
      } catch (e) {
        setError(e.message);
      }
    };

    fetchMovies();
    fetchShows();
    fetchRooms();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <header className='text-center mt-5 '>
        <h1>🎬 Bienvenue au Cinéma-JS ! 🍿</h1>
        <p>Découvrez les films à venir, les séances programmées et nos salles de projection.</p>
      </header>
      <UpcomingMoviesComponent movies={movies} />
      <UpcomingShowsComponent showtimes={showtimes} />
      <RoomsListComponent rooms={rooms} />
    </div>
  );
}

export default HomePage;
