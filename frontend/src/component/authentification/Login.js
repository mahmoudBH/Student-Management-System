import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Réutiliser le même CSS que pour la page d'inscription

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      }, {
        withCredentials: true, // Inclure les cookies de session dans la requête
      });

      // Vérifiez si la réponse contient des données utilisateur
      if (response.data.user) {
        // Stocker les données utilisateur dans le local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('Connexion réussie');
        window.location.href = '/home'; // Ou utilisez navigate('/home') si vous utilisez react-router
      } else {
        setMessage('Identifiants invalides.'); // Message d'erreur en cas de problème
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Erreur lors de la connexion.');
      } else {
        setMessage('Erreur lors de la connexion.');
      }
    }
  };

  return (
    <div className="container"> {/* Même conteneur pour centrer le formulaire */}
      <form className="login-form" onSubmit={handleSubmit}> {/* Changement de className ici */}
        <p className="title">Login</p>
        <p className="message">Welcome back! Please enter your credentials.</p>

        <label>
          <input 
            required 
            type="email" 
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input 
            required 
            type="password" 
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button type="submit" className="submit">Login</button>
        {message && <p className="message">{message}</p>}
        <p className="signin">Don't have an account? <a href="/signup">Signup</a></p>
      </form>
    </div>
  );
};

export default Login;
