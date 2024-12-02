import React, { useState, useEffect } from 'react';
import Header from '../Header';  // Import Header component

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

  // Fetch students on load
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`);
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${selectedStudent.id}`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, {
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
      <style jsx>{`
        /* General container styling */
        .manage-student-container {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 1200px;
          margin: 80px auto 20px 260px; /* Offset for header and sidebar */
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: margin-left 0.4s ease; /* Smooth transition with sidebar */
        }

        /* Adjust margin when sidebar is collapsed */
        .sidebar.closed + .manage-student-container {
          margin-left: 100px;
        }

        /* Heading styling */
        h2 {
          font-size: 2rem;
          color: #343a40;
          margin-bottom: 20px;
          text-align: center;
        }

        /* Student list styling */
        .student-list {
          background-color: #ffffff;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          max-height: 700px;
          overflow-y: auto;
        }

        .student-list h3 {
          font-size: 1.5rem;
          color: #007bff;
        }

        .student-list ul {
          list-style: none;
          padding: 0;
        }

        .student-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .student-list li:last-child {
          border-bottom: none;
        }

        .student-list li button {
          background-color: #007bff;
          color: #ffffff;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-left: 5px;

          transition: background-color 0.2s ease;
        }

        .student-list li button:hover {
          background-color: #0056b3;
        }

        /* Edit form styling */
        .edit-form {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .edit-form h3 {
          font-size: 1.8rem;
          color: #007bff;
          margin-bottom: 20px;
          text-align: center;
        }

        .edit-form label {
          display: block;
          font-weight: bold;
          color: #495057;
          margin-top: 15px;
          margin-bottom: 5px;
        }

        .edit-form input[type="text"],
        .edit-form input[type="email"],
        .edit-form input[type="password"] {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ced4da;
          font-size: 1rem;
          color: #495057;
        }

        .edit-form input:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
        }

        .edit-form select {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ced4da;
          font-size: 1rem;
          color: #495057;
          margin-top: 5px;
        }

        .edit-form button {
          display: block;
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background-color: #007bff;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .edit-form button:hover {
          background-color: #0056b3;
        }

        /* Responsive styling */
        @media (max-width: 768px) {
          .manage-student-container {
            margin: 100px 10px 10px 100px; /* Adjust for smaller screen sidebar */
          }

          .student-list,
          .edit-form {
            padding: 10px;
          }

          h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageStudent;
