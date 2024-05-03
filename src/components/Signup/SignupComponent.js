import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignupComponent() {
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSignupData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    // Valider que les mots de passe correspondent
    if (signupData.password !== signupData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: signupData.email,
          password: signupData.password
        })
      });

      if (!response.ok) {
        throw new Error('Échec de l\'inscription');
      }

      const result = await response.json();
      console.log(result);
      alert("Inscription réussie !");
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Existing Login Form */}

        {/* Signup Form */}
        <div className="col-md-6 mt-5 mb-5 mx-auto">
          <h2>Inscription</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label">Email</label>
              <input type="email" className="form-control" id="signupEmail" name="email"
                value={signupData.email} onChange={handleInputChange} placeholder="Entrez votre email" />
            </div>
            <div className="mb-3">
              <label htmlFor="signupPassword" className="form-label">Mot de passe</label>
              <input type="password" className="form-control" id="signupPassword" name="password"
                value={signupData.password} onChange={handleInputChange} placeholder="Créez un mot de passe" />
            </div>
            <div className="mb-3">
              <label htmlFor="signupConfirmPassword" className="form-label">Confirmez le mot de passe</label>
              <input type="password" className="form-control" id="signupConfirmPassword" name="confirmPassword"
                value={signupData.confirmPassword} onChange={handleInputChange} placeholder="Confirmez votre mot de passe" />
            </div>
            <p>Déjà membre chez nous ? <Link to="/login">Connectez vous ici</Link></p>
            <button type="submit" className="btn btn-success">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;
