import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const EditNoteForm = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    note: '',
    class: '',
    matiere: ''
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include', // Include credentials for the session
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

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/note', {
          method: 'GET',
          credentials: 'include', // Include credentials for the session
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des notes');
        }
        const data = await response.json();
        console.log('Données récupérées:', data);
        setNotes(data);
      } catch (error) {
        console.error('Erreur:', error.message);
      }
    };

    fetchNotes();
  }, []);

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setFormValues({
      firstname: note.firstname,
      lastname: note.lastname,
      note: note.note,
      class: note.class,
      matiere: note.matiere
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const response = await fetch(`http://localhost:5000/api/note/${editingNoteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: 'credentials' should not be included in headers
      },
      credentials: 'include', // Include credentials for the session
      body: JSON.stringify(formValues),
    });

    if (response.ok) {
      const updatedNote = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === editingNoteId ? updatedNote : note))
      );
      setEditingNoteId(null);
    } else {
      console.error('Erreur lors de la mise à jour de la note:', await response.json());
    }
  };

  return (
    <div>
      <Header />
      <h2>Notes List</h2>
      <table className="notes-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Note</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan="6">No notes to display.</td>
            </tr>
          ) : (
            notes.map(note => (
              <tr key={note.id}>
                {editingNoteId === note.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="firstname"
                        value={formValues.firstname}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="lastname"
                        value={formValues.lastname}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="note"
                        value={formValues.note}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <select
                        name="class"
                        value={formValues.class}
                        onChange={handleChange}
                      >
                        <option value="TI11">TI11</option>
                        <option value="TI12">TI12</option>
                        <option value="TI13">TI13</option>
                        <option value="TI14">TI14</option>
                        <option value="DSI21">DSI21</option>
                        <option value="DSI22">DSI22</option>
                        <option value="DSI31">DSI31</option>
                        <option value="DSI32">DSI32</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="matiere"
                        value={formValues.matiere}
                        onChange={handleChange}
                      >
                        <option value="developpement web">Développement Web</option>
                        <option value="JAVA">JAVA</option>
                        <option value="SOA">SOA</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="React Native">React Native</option>
                        <option value="English">English</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{note.firstname}</td>
                    <td>{note.lastname}</td>
                    <td>{note.note}</td>
                    <td>{note.class}</td>
                    <td>{note.matiere}</td>
                    <td>
                      <button onClick={() => handleEdit(note)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>
        {`
          /* Table styles */
          .notes-table {
            width: 90%;  /* Default width */
            max-width: 1200px; /* Max width for larger screens */
            margin: 100px 280px; /* Adjusted margin to accommodate the fixed header */
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            transition: width 0.3s ease; /* Smooth transition for width changes */
          }

          .notes-table thead {
            background-color: #4a90e2;
            color: #ffffff;
          }

          .notes-table thead th {
            padding: 12px;
            text-align: left;
            font-size: 1rem;
          }

          .notes-table tbody tr {
            transition: background-color 0.3s ease;
          }

          .notes-table tbody tr:nth-child(even) {
            background-color: #f1f1f1;
          }

          .notes-table tbody tr:hover {
            background-color: #e6f2ff;
          }

          .notes-table td {
            padding: 10px;
            font-size: 0.9rem;
            color: #333333;
          }

          .notes-table td button {
            padding: 6px 12px;
            font-size: 0.9rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .notes-table td button:hover {
            background-color: #4a90e2;
            color: #ffffff;
          }

          .notes-table td input[type="text"],
          .notes-table td input[type="number"],
          .notes-table td select {
            padding: 8px;
            width: 100%;
            font-size: 0.9rem;
            border: 1px solid #cccccc;
            border-radius: 4px;
            transition: border-color 0.3s ease;
          }

          .notes-table td input:focus,
          .notes-table td select:focus {
            outline: none;
            border-color: #4a90e2;
          }

          h2 {
            color: #4a90e2;
            text-align: center;
            font-size: 1.5rem;
          }

          /* Sidebar open/close adjustment */
          .sidebar.open ~ .notes-table {
            width: calc(100% - 260px); /* Subtract sidebar width when it's open */
          }

          .sidebar.closed ~ .notes-table {
            width: calc(100% - 80px); /* Adjust table width when sidebar is closed */
          }

          /* Responsive adjustments for table */
          @media screen and (max-width: 768px) {
            .notes-table {
              width: 95%;
              margin-top: 120px; /* Adjusted margin for small screens */
            }

            .notes-table th, .notes-table td {
              padding: 8px;
              font-size: 0.8rem;
            }
          }

          @media screen and (max-width: 480px) {
            .notes-table th, .notes-table td {
              padding: 6px;
              font-size: 0.75rem;
            }

            .notes-table {
              width: 100%;
              margin-top: 130px; /* Adjusted margin for smaller screens */
            }
          }

        `}
      </style>

    </div>
  );
};

export default EditNoteForm;
