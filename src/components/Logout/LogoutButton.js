import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Effacer le token JWT et autres informations de l'utilisateur
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Assurez-vous de nettoyer tout ce qui est lié à la session de l'utilisateur

        // Rediriger vers la page de connexion ou la page d'accueil
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
    );
}

export default LogoutButton;
