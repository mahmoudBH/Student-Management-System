import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import './Message.css';

const Message = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Vérifier la session utilisateur
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status !== 200) {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  // Fonction pour récupérer les messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setErrorMessage("Erreur lors de la récupération des messages");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des messages");
    }
  };

  // Récupérer les messages lors de l'initialisation
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="message-container">
      <Header />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h2>Messages de Support</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id} className="message-item">
              <strong>De:</strong> {msg.email}
              <strong>Sujet:</strong> {msg.subject}
              <strong>Message:</strong> {msg.message}
              <strong>Reçu le:</strong> {new Date(msg.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun message disponible.</p>
      )}
    </div>
  );
};

export default Message;
