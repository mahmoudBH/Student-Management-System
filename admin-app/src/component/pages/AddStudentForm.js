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
    matiere: 'Web Development',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Verify user session
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
        console.error('Error verifying session:', error);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Student added successfully!');
        setIsError(false);
        setFormData({
          firstname: '',
          lastname: '',
          note: '',
          class: '',
          matiere: '',
        });
      } else {
        setMessage(data.error || 'Error adding the student');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Server connection error');
      setIsError(true);
    }
  };

  return (
    <Container>
      <Header />

      <Content>
        <Form onSubmit={handleSubmit}>
          <h2>Add Student Grade</h2>
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
            <label>Grade:</label>
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
            <label>Subject:</label>
            <select name="subject" value={formData.matiere} onChange={handleChange} required>
              <option value="Web Development">Web Development</option>
              <option value="JAVA">JAVA</option>
              <option value="SOA">SOA</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React Native">React Native</option>
              <option value="English">English</option>
            </select>
          </div>
          <button type="submit">Add</button>
          {message && <Message isError={isError}>{message}</Message>}
        </Form>
      </Content>
    </Container>
  );
};

export default AddStudentForm;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  margin-left: 250px; /* Espace pour la sidebar */
  margin-top: 70px; /* Espace pour le header */
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 50px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
`;

const Form = styled.form`
  max-width: 500px;
  width: 100%;
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 20px;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
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
  }

  input,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    background: #f5f5f5;
    font-size: 1rem;
  }

  input:focus,
  select:focus {
    border-color: #4a90e2;
    outline: none;
  }

  button {
    width: 100%;
    padding: 14px;
    background-color: #4a90e2;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    background-color: #357abd;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
  color: ${({ isError }) => (isError ? '#e74c3c' : '#27ae60')};
`;
