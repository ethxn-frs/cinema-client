import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HeaderComponent from './components/Header/HeaderComponent';
import HomePage from './components/HomePage/HomePage';
import FooterComponent from './components/Footer/FooterComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieDetailsComponent from './components/Movie/MovieDetailsComponent';
import MoviesListComponent from './components/Movie/MoviesListComponent';
import ShowsListComponent from './components/Show/ShowsListComponent';
import RoomsListComponent from './components/Room/RoomsListComponent';
import SignupComponent from './components/Signup/SignupComponent';
import LoginComponent from './components/Login/LoginComponent';
import TransactionsListComponent from './components/Transactions/TransactionsListComponent';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import TicketsListComponent from './components/Ticket/TicketsListComponent';
import { UserProvider } from './Contexts/UserContext';
import HeaderWrapper from './Contexts/HeaderWrapper';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <HeaderWrapper/>
          <Routes>
            <Route path="/" element={<PrivateRoute element={HomePage} />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/movies" element={<PrivateRoute element={MoviesListComponent} />} />
            <Route path="/movies/:id" element={<PrivateRoute element={MovieDetailsComponent} />} />
            <Route path="/shows" element={<PrivateRoute element={ShowsListComponent} />} />
            <Route path="/rooms" element={<PrivateRoute element={RoomsListComponent} />} />
            <Route path="/transactions" element={<PrivateRoute element={TransactionsListComponent} />} />
            <Route path="/tickets" element={<PrivateRoute element={TicketsListComponent} />} />
          </Routes>
          <FooterComponent />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
