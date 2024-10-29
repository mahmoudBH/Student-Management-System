import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import './EditNoteForm.css';

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
      <h2>Liste des Notes</h2>
      <table className="notes-table">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Note</th>
            <th>Class</th>
            <th>Matiere</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan="6">Aucune note à afficher.</td>
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
                      <button onClick={handleSave}>Enregistrer</button>
                      <button onClick={() => setEditingNoteId(null)}>Annuler</button>
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
                      <button onClick={() => handleEdit(note)}>Modifier</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditNoteForm;
