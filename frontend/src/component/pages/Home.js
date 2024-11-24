import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faClipboardList, faUserCog, faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar'; // Si vous utilisez react-calendar pour afficher le calendrier
import 'react-calendar/dist/Calendar.css'; // Assurez-vous d'importer le style de react-calendar

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'New Event', message: 'Your meeting is scheduled for tomorrow.', date: '24th November, 2024' },
    { id: 2, title: 'Important Update', message: 'New course materials are available.', date: '23rd November, 2024' },
    { id: 3, title: 'Assignment Deadline', message: 'Your assignment is due next week.', date: '30th November, 2024' },
  ]);

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include', // Send cookies to verify the session
        });

        if (response.status !== 200) {
          // Redirect to login page if session is invalid
          navigate('/');
        } else {
          // Get user data from localStorage
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            setUsername(user.name); // Use 'name' instead of 'firstname'
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="home-container">
      <Header />
      <div className="content">
        <p className="personalized-message">Welcome, <strong>{username}</strong>!</p>

        {/* Action buttons with navigation */}
        <div className="action-buttons">
          <div className="action-card" onClick={() => navigate('/add-note')}>
            <FontAwesomeIcon icon={faPlus} size="4x" />
            <p>Add Note</p>
          </div>
          <div className="action-card" onClick={() => navigate('/edit-note')}>
            <FontAwesomeIcon icon={faEdit} size="4x" />
            <p>Edit Note</p>
          </div>
          <div className="action-card" onClick={() => navigate('/add-course')}>
            <FontAwesomeIcon icon={faClipboardList} size="4x" />
            <p>Add Course</p>
          </div>
          <div className="action-card" onClick={() => navigate('/manage-student')}>
            <FontAwesomeIcon icon={faUserCog} size="4x" />
            <p>Manage Student</p>
          </div>
          <div className="action-card" onClick={() => navigate('/messages')}>
            <FontAwesomeIcon icon={faEnvelope} size="4x" />
            <p>Messages</p>
          </div>
        </div>

        {/* Calendar and Notifications Section */}
        <div className="bottom-section">
          <div className="calendar-container">
            <h3>Calendar</h3>
            <div className="calendar-wrapper">
              <Calendar />
            </div>
          </div>

          <div className="notifications-container">
            <h3>Notifications</h3>
            {notifications.map((notification) => (
              <div className="notification-item" key={notification.id}>
                <div className="icon">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <div>
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <div className="date">{notification.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          margin-left: 240px; /* Adjust margin to avoid sidebar */
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 1350px; /* Wider content area */
          width: 100%; /* Full width */
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          margin-top: 60px;
          margin-left: 22px;
          background-color: #fff; /* White background */
        }

        .personalized-message {
          font-size: 32px;
          color: #333;
          font-weight: 700;
          margin: 0;
          padding: 20px 0;
        }

        .personalized-message strong {
          color: royalblue;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          margin-top: 40px;
          gap: 25px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 165px;
          height: 165px;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          cursor: pointer;
          text-align: center;
          padding: 20px;
        }

        .action-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .action-card p {
          font-size: 18px;
          color: #333;
          margin-top: 15px;
        }

        .action-card svg {
          color: royalblue;
        }

        .bottom-section {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          width: 100%;
          gap: 20px;
        }

        .calendar-container {
          width: 48%;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .calendar-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .notifications-container {
          width: 48%;
          display: flex;
          flex-direction: column;
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h3{
        margin-bottom: 10px;
        }

        .notification-item {
          background-color: #4169e1; /* Royal Blue */
          color: white;
          padding: 10px 15px; /* Réduction de l'espace pour un élément plus compact */
          border-radius: 20px; /* Bordure plus arrondie */
          margin-bottom: 8px; /* Moins d'espace en bas */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre légère pour un look moderne */
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
        }

        .notification-item:hover {
          background-color: #365f9f; /* Royal Blue plus foncé lors du survol */
          transform: translateY(-3px); /* Légère élévation sur le survol */
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Ombre plus forte au survol */
        }

        .notification-item h4 {
          font-size: 14px; /* Taille de police réduite */
          font-weight: bold;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .notification-item p {
          font-size: 12px; /* Police plus petite pour une taille réduite */
          margin: 6px 0;
          line-height: 1.4;
        }

        .notification-item .date {
          font-size: 11px; /* Police plus petite pour la date */
          color: rgba(255, 255, 255, 0.75);
          margin-top: 8px;
          font-style: italic;
        }

        .notification-item .icon {
          font-size: 20px; /* Taille réduite de l'icône */
          margin-bottom: 8px;
        }




        @media (max-width: 768px) {
          .home-container {
            margin-left: 0; /* Remove margin for smaller screens */
          }

          .content {
            padding: 25px;
          }

          .personalized-message {
            font-size: 28px;
          }

          .action-buttons {
            gap: 20px;
          }

          .action-card {
            width: 160px;
            height: 160px;
          }

          .bottom-section {
            flex-direction: column;
          }

          .calendar-container,
          .notifications-container {
            width: 100%;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
