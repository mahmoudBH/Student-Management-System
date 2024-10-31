import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', mobile_number: '' });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Check user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status !== 200) {
          navigate('/'); // Redirect to login if session is invalid
        } else {
          fetchUserData(); // Fetch user data if session is valid
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/'); // Redirect on error
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch user data function
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormValues({ name: data.name, email: data.email, mobile_number: data.mobile_number });
      } else {
        setMessage("Erreur lors de la récupération des données de l'utilisateur");
      }
    } catch (error) {
      setMessage("Erreur lors de la récupération des données de l'utilisateur");
    }
  };

  // Handle photo change
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Save photo on server
  const handleSavePhoto = async () => {
    if (!photo) {
      setMessage('Veuillez sélectionner une photo');
      return;
    }

    if (!user?.id) {
      setMessage("L'ID de l'utilisateur est manquant");
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.id}/photo`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUser((prevUser) => ({ ...prevUser, photo: data.photo }));
        setMessage('Photo de profil mise à jour avec succès');
        await fetchUserData();
      } else {
        setMessage("Erreur lors de la mise à jour de la photo de profil");
      }
    } catch (error) {
      setMessage("Erreur lors de la mise à jour de la photo de profil");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile information
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
        await fetchUserData();
        setIsEditing(false);
        setMessage('Profil mis à jour avec succès');
      } else {
        setMessage('Erreur lors de la mise à jour des données de l\'utilisateur');
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour des données de l\'utilisateur');
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Veuillez remplir tous les champs de mot de passe');
      return;
    }

    if (newPassword !== confirmPassword) {
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
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage('Mot de passe mis à jour avec succès');
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Erreur lors de la mise à jour du mot de passe');
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
        <div className="Profile-content">
          {/* Profile photo */}
          <div className="Profile-photo-container">
            {user.photo && (
              <img 
                src={user.photo} 
                alt=""  // Updated alt attribute
                className="Profile-photo" 
              />
            )}
            <input type="file" onChange={handlePhotoChange} />
            <button onClick={handleSavePhoto} className="Profile-button">Enregistrer la photo</button>
          </div>
  
          {/* User details and password change */}
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
            <br />
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
            <br />
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
              <button onClick={() => setIsEditing(true)} className="Profile-button">Modifier</button>
            )}
  
            <div className="Profile-change-password">
              <h3>Modifier le mot de passe</h3>
              {isChangingPassword ? (
                <>
                  <input
                    type="password"
                    placeholder="Mot de passe actuel"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="Profile-input"
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="Profile-input"
                  />
                  <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="Profile-input"
                  />
                  <button onClick={handleChangePassword} className="Profile-button">Mettre à jour le mot de passe</button>
                  <button onClick={() => setIsChangingPassword(false)} className="Profile-secondary-button">Annuler</button>
                </>
              ) : (
                <button onClick={() => setIsChangingPassword(true)} className="Profile-button">Changer le mot de passe</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Chargement des données de l'utilisateur...</p>
      )}
    </div>
  );
};

export default Profile;
