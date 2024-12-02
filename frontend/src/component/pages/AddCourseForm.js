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
  
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');  // WebSocket server URL

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      setNotification(event.data);  // Update state when a message is received
    };

    socket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, []);

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
      setFormValues((prev) => ({ ...prev, pdfFile: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('matiere', formValues.matiere);
    formData.append('classe', formValues.classe);
    formData.append('pdfFile', formValues.pdfFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cours`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        alert('Cours ajouté avec succès!');
        navigate('/add-course');
      } else {
        alert("Erreur lors de l'ajout du cours.");
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <CourseContainer>
      <Header />
      {notification && <Notification>{notification}</Notification>}  {/* Display notification */}
      <Form onSubmit={handleSubmit}>
        <h2>Add a Course</h2>

        <div>
          <label>Subject</label>
          <select name="matiere" value={formValues.matiere} onChange={handleChange} required>
            <option value="">Select a subject</option>
            <option value="developpement web">Web Development</option>
            <option value="JAVA">JAVA</option>
            <option value="SOA">SOA</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React Native">React Native</option>
            <option value="English">English</option>
          </select>
        </div>

        <div>
          <label>Class</label>
          <select name="classe" value={formValues.classe} onChange={handleChange} required>
            <option value="">Select a class</option>
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
          <label>PDF File</label>
          <input type="file" name="pdfFile" accept=".pdf" onChange={handleFileChange} required />
        </div>

        <button type="submit" className='add-cours'>Add Course</button>
      </Form>
    </CourseContainer>
  );
};

const Notification = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
  border-radius: 6px;
`;

const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px 260px;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  max-width: 500px;
  width: 100%;
  margin-top: 60px;
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

  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

export default AddCourseForm;
