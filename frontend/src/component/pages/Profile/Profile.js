import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', mobile_number: '' });
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSessionAndFetchUserData = async () => {
      try {
        const sessionResponse = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include',
        });

        if (sessionResponse.status !== 200) {
          navigate('/');
        } else {
          const userResponse = await fetch('http://localhost:5000/api/user', {
            method: 'GET',
            credentials: 'include',
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
            setFormValues({ name: userData.name, email: userData.email, mobile_number: userData.mobile_number });
          } else {
            setMessage('Erreur lors de la récupération des données de l\'utilisateur');
          }
        }
      } catch (error) {
        setMessage('Erreur lors de la vérification de la session');
        navigate('/');
      }
    };

    checkSessionAndFetchUserData();
  }, [navigate]);

  const handleEditClick = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          mobile_number: formValues.mobile_number,
        }),
      });

      if (response.ok) {
        const updatedUserResponse = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (updatedUserResponse.ok) {
          const updatedUser = await updatedUserResponse.json();
          setUser(updatedUser);
          setIsEditing(false);
          setMessage('Profil mis à jour avec succès');
        } else {
          setMessage('Erreur lors de la récupération des données mises à jour de l\'utilisateur');
        }
      } else {
        setMessage('Erreur lors de la mise à jour des données de l\'utilisateur');
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour des données de l\'utilisateur');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSave = async () => {
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setMessage('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }),
      });

      if (response.ok) {
        setIsPasswordEditing(false);
        setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage('Mot de passe mis à jour avec succès');
      } else {
        setMessage('Erreur lors de la mise à jour du mot de passe');
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du mot de passe');
    }
  };

  return (
    <div className="Profile-container">
      <Header />
      {message && <p className="Profile-message">{message}</p>}
      {user ? (
        <div className="Profile-details">
          <h2 className="Profile-header">Profil Utilisateur</h2>
          <div>
            <strong className="Profile-label">Nom:</strong>
            {isEditing ? (
              <input
                type="text"
                name="name"
                className="Profile-input"
                value={formValues.name}
                onChange={handleChange}
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>
          <br></br>
          <div>
            <strong className="Profile-label">Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="Profile-input"
                value={formValues.email}
                onChange={handleChange}
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>
          <br></br>
          <div>
            <strong className="Profile-label">Numéro de téléphone:</strong>
            {isEditing ? (
              <input
                type="text"
                name="mobile_number"
                className="Profile-input"
                value={formValues.mobile_number}
                onChange={handleChange}
              />
            ) : (
              <span>{user.mobile_number}</span>
            )}
          </div>
          {isEditing ? (
            <div>
              <button onClick={handleSave} className="Profile-button">Enregistrer</button>
              <button onClick={() => setIsEditing(false)} className="Profile-secondary-button">Annuler</button>
            </div>
          ) : (
            <button onClick={handleEditClick} className="Profile-button">Modifier</button>
          )}

          <h3 className="Profile-section-header">Modifier le mot de passe</h3>
          {isPasswordEditing ? (
            <div className="Profile-password-section">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mot de passe actuel"
                className="Profile-password-input"
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                className="Profile-password-input"
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                className="Profile-password-input"
                value={passwordValues.confirmPassword}
                onChange={handlePasswordChange}
              />
              <button onClick={handlePasswordSave} className="Profile-button">Enregistrer le mot de passe</button>
              <button onClick={() => setIsPasswordEditing(false)} className="Profile-secondary-button">Annuler</button>
            </div>
          ) : (
            <button onClick={() => setIsPasswordEditing(true)} className="Profile-button">Modifier le mot de passe</button>
          )}
        </div>
      ) : (
        <p>Chargement des données de l'utilisateur...</p>
      )}
    </div>
  );
};

export default Profile;
