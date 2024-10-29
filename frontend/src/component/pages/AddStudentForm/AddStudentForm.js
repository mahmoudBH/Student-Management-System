// ./components/AddStudentForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header'; // Assurez-vous que le chemin d'importation est correct
import './AddStudentForm.css'; // Assurez-vous que le fichier de style est importé

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    note: '',
    class: 'TI11',
    matiere: 'developpement web', // Valeur par défaut
  });
  const [message, setMessage] = useState(''); // État pour afficher le message de succès ou d'erreur
  const [isError, setIsError] = useState(false); // État pour indiquer si c'est une erreur
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      

      const data = await response.json();

      if (response.ok) {
        setMessage('Étudiant ajouté avec succès!');
        setIsError(false);
        setFormData({
          firstname: '',
          lastname: '',
          note: '',
          class: '',
          matiere: '', // Réinitialisation de la matière
        });
      } else {
        setMessage(data.error || "Erreur lors de l'ajout de l'étudiant");
        setIsError(true);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      setIsError(true);
    }
  };

  return (
    <div className="student-form-container">
      <Header /> {/* Ajout du composant Header */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Note:</label>
          <input
            type="number"
            name="note"
            value={formData.note}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Class:</label>
          <select name="class" value={formData.class} onChange={handleChange} required>
            <option value="TI11">TI11</option>
            <option value="TI12">TI12</option>
            <option value="TI13">TI13</option>
            <option value="TI14">TI14</option>
            <option value="DSI21">DSI21</option>
            <option value="DSI22">DSI22</option>
            <option value="DSI31">DSI31</option>
            <option value="DSI32">DSI32</option>
          </select>
        </div>
        <div>
          <label>Matière:</label>
          <select name="matiere" value={formData.matiere} onChange={handleChange} required>
            <option value="developpement web">Développement Web</option>
            <option value="JAVA">JAVA</option>
            <option value="SOA">SOA</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React Native">React Native</option>
            <option value="English">English</option>
          </select>
        </div>
        <button type="submit" className='add-student'>Add</button>
      </form>

      {/* Affichage du message */}
      {message && (
        <p style={{ color: isError ? 'red' : 'green', marginTop: '10px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddStudentForm;
