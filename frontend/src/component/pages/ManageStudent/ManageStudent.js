// ./components/pages/ManageStudent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';  // Import Header component
import './ManageStudent.css';

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    class: '',
  });
  const navigate = useNavigate();

  // Fetch students on load
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:5000/api/students');
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormValues({
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
      password: student.password, // Leave password blank for security
      class: student.class,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/students/${selectedStudent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    });
    if (response.ok) {
      alert('Student details updated successfully!');
      window.location.reload();
    } else {
      alert('Error updating student details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Student deleted successfully!');
        setStudents(students.filter(student => student.id !== id));
      } else {
        alert('Error deleting student');
      }
    }
  };

  return (
    <div className="manage-student-container">
      <Header /> {/* Include Header component */}
      <h2>Manage Students</h2>
      <div className="student-list">
        <h3>Student List</h3>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.firstname} {student.lastname} - {student.email}
              <div>
              <button onClick={() => handleDelete(student.id)}>Delete</button>
              <button onClick={() => handleEdit(student)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedStudent && (
        <form onSubmit={handleSubmit} className="edit-form">
          <h3>Edit Student</h3>
          <label>
            First Name:
            <input
              type="text"
              name="firstname"
              value={formValues.firstname}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={formValues.lastname}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="class">Class</label>
          <select
            id="class"
            name="class"
            value={formValues.class}
            onChange={(e) => setFormValues({ ...formValues, class: e.target.value })}
            required
          >
            <option value="">Select Class</option>
            <option value="TI11">TI11</option>
            <option value="TI12">TI12</option>
            <option value="TI13">TI13</option>
            <option value="TI14">TI14</option>
            <option value="DSI21">DSI21</option>
            <option value="DSI22">DSI22</option>
            <option value="DSI31">DSI31</option>
            <option value="DSI32">DSI32</option>
          </select>

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default ManageStudent;
