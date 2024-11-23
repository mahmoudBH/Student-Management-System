// ./components/AddCourseForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import styled from 'styled-components';

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
    <CourseContainer>
      <Header /> {/* Include Header component */}
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </CourseContainer>
  );
};

const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px 260px; /* Reduced top padding to bring it higher */
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  max-width: 500px;
  width: 100%;
  margin-top: 60px; /* Centered vertically on the page, higher for better visibility */
  padding: 30px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #2c3e50;
    font-weight: bold;
  }

  div {
    margin-bottom: 18px;
  }

  label {
    display: block;
    font-weight: 600;
    color: #4a90e2;
    margin-bottom: 8px;
    font-size: 1rem;
    text-transform: uppercase;
  }

  select,
  input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background: #f5f5f5;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  select:focus,
  input[type="file"]:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
    outline: none;
  }

  .add-cours {
    width: 100%;
    padding: 14px;
    background-color: #4a90e2;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .add-cours:hover {
    background-color: #357abd;
    box-shadow: 0 4px 10px rgba(69, 160, 73, 0.2);
  }

  .add-cours:active {
    transform: translateY(2px);
  }

  @media screen and (max-width: 600px) {
    padding: 20px 10px;
    margin-top: 80px;
    
    h2 {
      font-size: 1.5rem;
    }

    .add-cours {
      font-size: 0.9rem;
    }
  }
`;

export default AddCourseForm;
