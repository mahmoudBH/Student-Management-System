import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

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

      {/* Styles CSS inclus dans le composant */}
      <style jsx>{`
        /* Message Page Styles */
.message-container {
  padding: 20px;
  background-color: #f9f9f9; /* Light background color */
  min-height: 100vh; /* Ensure the container covers the full height */
  margin-top: 94px; /* Space for the fixed header */
  margin-left: 260px; /* Space for the sidebar when open */
  transition: margin-left 0.4s ease; /* Smooth transition when sidebar opens/closes */
}

@media (max-width: 768px) {
  .message-container {
    margin-left: 0; /* Remove left margin on smaller screens */
    padding: 10px; /* Adjust padding on smaller screens */
  }
}

/* Ensure the message list looks good in the layout */
h2 {
  color: #333; /* Darker color for the heading */
  margin-bottom: 20px; /* Space below the heading */
}

.error-message {
  color: #ff4d4d; /* Red color for error messages */
  margin: 10px 0; /* Space around the error message */
}

ul {
  list-style-type: none; /* Remove default bullet points */
  padding: 0; /* Remove padding */
}

.message-item {
  background-color: #fff; /* White background for each message */
  border: 1px solid #ddd; /* Light border */
  border-radius: 5px; /* Rounded corners */
  padding: 15px; /* Padding inside the message */
  margin-bottom: 15px; /* Space between messages */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
}

.message-item strong {
  display: block; /* Make labels display as block */
  color: #555; /* Darker color for labels */
  margin-bottom: 5px; /* Space below each label */
}

.message-item p {
  margin: 5px 0; /* Space around paragraphs */
  color: #444; /* Text color for message content */
}

      `}</style>
    </div>
  );
};

export default Message;
