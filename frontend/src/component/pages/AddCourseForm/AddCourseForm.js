// ./components/AddCourseForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import './AddCourseForm.css';

const AddCourseForm = () => {
  const [formValues, setFormValues] = useState({
    matiere: '',
    classe: '',
    pdfFile: null,
  });

  const navigate = useNavigate();

  // Vérifier la session utilisateur
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include', // Sends cookies for session check
        });
        if (response.status !== 200) {
          navigate('/'); // Redirect if session invalid
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
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormValues((prev) => ({ ...prev, pdfFile: file }));
    } else {
      alert("Veuillez télécharger un fichier PDF uniquement.");
      setFormValues((prev) => ({ ...prev, pdfFile: null })); // Clear invalid file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('matiere', formValues.matiere);
    formData.append('classe', formValues.classe);
    formData.append('pdfFile', formValues.pdfFile);

    try {
      const response = await fetch('http://localhost:5000/api/cours', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Sends cookies for session validation
      });
      if (response.ok) {
        alert('Cours ajouté avec succès!');
        navigate('/add-course'); // Redirect to courses list or other page
      } else {
        alert("Erreur lors de l'ajout du cours.");
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="course-container">
      <Header /> {/* Include Header component */}
      <form className='form-cour' onSubmit={handleSubmit}>
        <h2>Ajouter un Cours</h2>

        <div>
          <label>Matiere</label>
          <select name="matiere" value={formValues.matiere} onChange={handleChange} required>
            <option value="">Sélectionnez une matière</option>
            <option value="developpement web">Développement Web</option>
            <option value="JAVA">JAVA</option>
            <option value="SOA">SOA</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React Native">React Native</option>
            <option value="English">English</option>
          </select>
        </div>

        <div>
          <label>Classe</label>
          <select name="classe" value={formValues.classe} onChange={handleChange} required>
            <option value="">Sélectionnez une classe</option>
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
          <label>Fichier PDF</label>
          <input type="file" name="pdfFile" accept=".pdf" onChange={handleFileChange} required />
        </div>

        <button type="submit" className='add-cours'>Ajouter le Cours</button>
      </form>
    </div>
  );
};

export default AddCourseForm;
