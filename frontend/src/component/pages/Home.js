import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';


const Home = () => {
  const navigate = useNavigate();

  // Vérifier la session utilisateur
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include', // Permet d'envoyer les cookies pour vérifier la session
        });
        if (response.status !== 200) {
          // Redirige vers la page de connexion si la session est invalide
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="home-container">
      <Header />
      <p>Bienvenue sur la page d'accueil !</p>
    </div>
  );
};

export default Home;
