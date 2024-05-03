import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function LoginComponent() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        login: '',
        password: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: loginData.login,
                    password: loginData.password
                })
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const result = await response.json();
            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.userId);
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert("Erreur lors de la connexion.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <h2>Connexion</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">Login</label>
                            <input type="text" className="form-control" id="loginEmail" name="login"
                                value={loginData.login} onChange={handleInputChange} placeholder="Entrez votre login" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">Mot de passe</label>
                            <input type="password" className="form-control" id="loginPassword" name="password"
                                value={loginData.password} onChange={handleInputChange} placeholder="Mot de passe" />
                        </div>
                        <p>Pas encore membre ? <Link to="/signup">Inscrivez vous ici</Link></p>
                        <button type="submit" className="btn btn-primary">Connexion</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
