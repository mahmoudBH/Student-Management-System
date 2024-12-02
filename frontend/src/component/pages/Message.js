import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const Message = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/check-session`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status !== 200) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setErrorMessage("Error fetching messages");
      }
    } catch (error) {
      setErrorMessage("Error fetching messages");
    }
  };

  // Fetch messages on initial load
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="message-container">
      <Header />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h2>Support Messages</h2>
      {messages.length > 0 ? (
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg.id} className="message-item">
              <div className="message-header">
                <strong>From:</strong> {msg.email}
                <span>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <h3>{msg.subject}</h3>
              <p>{msg.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages available.</p>
      )}

      {/* Modern CSS styles */}
      <style jsx>{`
        /* Message Page Styles */
        .message-container {
          padding: 20px;
          min-height: 100vh; /* Full page height */
          margin-top: 94px; /* Space for the fixed header */
          margin-left: 260px; /* Sidebar space */
          transition: margin-left 0.4s ease;
          font-family: 'Roboto', sans-serif; /* Modern font */
          color: #333; /* Dark text for readability */
        }

        @media (max-width: 768px) {
          .message-container {
            margin-left: 0; /* No sidebar margin on mobile */
            padding: 15px; /* Smaller padding */
          }
        }

        h2 {
          font-size: 2rem; /* Taille de police */
          font-weight: 600; /* Légèrement plus gras */
          color: #2c3e50; /* Bleu-gris foncé */
          margin-bottom: 20px;
          text-align: center; /* Centrer le texte */
        }

        .error-message {
          color: #e74c3c; /* Red for errors */
          font-size: 1rem;
          margin: 10px 0;
        }

        .message-list {
          list-style: none;
          padding: 0;
        }

        .message-item {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
          transition: all 0.3s ease;
        }

        .message-item:hover {
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Darker shadow on hover */
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 1rem;
          color: #7f8c8d; /* Light grey for meta text */
        }

        .message-header strong {
          color: #34495e; /* Darker grey for labels */
        }

        .message-item h3 {
          font-size: 1.3rem;
          color: #2980b9; /* Blue for the subject */
          font-weight: 500;
          margin-bottom: 10px;
        }

        .message-item p {
          font-size: 1rem;
          color: #2c3e50; /* Main text color */
          line-height: 1.6;
        }

        .message-item p + p {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Message;
