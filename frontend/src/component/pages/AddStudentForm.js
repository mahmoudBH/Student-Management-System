import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import styled from 'styled-components';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    note: '',
    class: 'TI11',
    matiere: 'developpement web',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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
          matiere: '',
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
    <Container>
      <Header /> 

      <Form onSubmit={handleSubmit}>
        <h2>Ajouter la note de l'étudiant</h2>
        <div>
          <label>Prénom :</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Note :</label>
          <input
            type="number"
            name="note"
            value={formData.note}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Classe :</label>
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
          <label>Matière :</label>
          <select name="matiere" value={formData.matiere} onChange={handleChange} required>
            <option value="developpement web">Développement Web</option>
            <option value="JAVA">JAVA</option>
            <option value="SOA">SOA</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React Native">React Native</option>
            <option value="English">English</option>
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </Form>

      {message && (
        <Message isError={isError}>{message}</Message>
      )}
    </Container>
  );
};

export default AddStudentForm;

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 40px 280px;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #ffffff);
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  max-width: 500px;
  width: 100%;
  margin: 100px auto;
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }

  div {
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-weight: 600;
    color: #4a90e2;
    margin-bottom: 8px;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 1rem;
    background: #f5f5f5;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  input:focus,
  select:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
    outline: none;
  }

  button[type="submit"] {
    width: 100%;
    padding: 14px;
    background-color: #4a90e2;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  button[type="submit"]:hover {
    background-color: #357abd;
    box-shadow: 0 4px 10px rgba(53, 122, 189, 0.3);
  }

  button[type="submit"]:active {
    transform: translateY(2px);
  }
`;

const Message = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
  color: ${({ isError }) => (isError ? '#e74c3c' : '#27ae60')};
`;

