import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ element: Component, ...rest }) {
    const isAuthenticated = localStorage.getItem('token'); // Vérifie si un token est stocké
    const location = useLocation();

    return isAuthenticated ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}


export default PrivateRoute