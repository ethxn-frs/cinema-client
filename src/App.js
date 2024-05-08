import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import AdminRoomCreateComponent from './components/Admin/AdminRoom/AdminRoomCreateComponent';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import AdminRoomListComponent from './components/Admin/AdminRoom/AdminRoomListComponent';
import AdminShowListComponent from './components/Admin/AdminShow/AdminShowListComponent';
import AdminShowCreateComponent from './components/Admin/AdminShow/AdminShowCreateComponent';
import AdminMovieListComponent from './components/Admin/AdminMovie/AdminMovieList';
import AdminMovieCreateComponent from './components/Admin/AdminMovie/AdminMovieCreateComponent';
import AdminUserListComponent from './components/Admin/AdminUser/AdminUserListComponent';
import AdminUserCreateComponent from './components/Admin/AdminUser/AdminUserCreateComponent';
import AdminHomePageComponent from './components/Admin/AdminHomePage/AdminHomePageComponent';
import AdminUpdateMovieComponent from './components/Admin/AdminMovie/AdminMovieUpdateComponent';
import AdminShowUpdateComponent from './components/Admin/AdminShow/AdminShowUpdateComponent';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <HeaderWrapper />
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

            {/* route pour l'admin */}
            <Route path="/admin" element={<ProtectedRoute> <AdminHomePageComponent /> </ProtectedRoute>} />

            <Route path="/admin/rooms" element={<ProtectedRoute> <AdminRoomListComponent /> </ProtectedRoute>} />
            <Route path="/admin/rooms/create" element={<ProtectedRoute> <AdminRoomCreateComponent /> </ProtectedRoute>} />

            <Route path="/admin/shows" element={<ProtectedRoute> <AdminShowListComponent /> </ProtectedRoute>} />
            <Route path="/admin/shows/create" element={<ProtectedRoute> <AdminShowCreateComponent /> </ProtectedRoute>} />
            <Route path="/admin/shows/edit/:id" element={<AdminShowUpdateComponent />} />

            <Route path="/admin/movies" element={<ProtectedRoute> <AdminMovieListComponent /> </ProtectedRoute>} />
            <Route path="/admin/movies/create" element={<ProtectedRoute> <AdminMovieCreateComponent /> </ProtectedRoute>} />
            <Route path="/admin/movies/edit/:id" element={<AdminUpdateMovieComponent />} />


            <Route path="/admin/users" element={<ProtectedRoute> <AdminUserListComponent /> </ProtectedRoute>} />
            <Route path="/admin/users/create" element={<ProtectedRoute> <AdminUserCreateComponent /> </ProtectedRoute>} />

          </Routes>
          <FooterComponent />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
