import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './component/authentification/Signup';
import Login from './component/authentification/Login';
import Home from './component/pages/Home';
import EditNoteForm from './component/pages/EditNoteForm';
import AddStudentForm from './component/pages/AddStudentForm';
import AddCourseForm from './component/pages/AddCourseForm';
import Profile from './component/pages/Profile/Profile';
import ManageStudent from './component/pages/ManageStudent';
import Message from './component/pages/Message';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />               {/* Route par défaut vers Login */}
          <Route path="/signup" element={<Signup />} />        {/* Page d'inscription */}
          <Route path="/home" element={<Home />} />            {/* Page d'accueil */}
          <Route path="/add-student" element={<AddStudentForm />} /> {/* Page pour ajouter un étudiant */}
          <Route path="/edit-note" element={<EditNoteForm />} /> {/* Page pour modifier la note */}
          <Route path="/add-course" element={<AddCourseForm />} /> {/* Page pour ajouter un cours en PDF */}
          <Route path="/profile" element={<Profile />} />       {/* Page de profil */}
          <Route path="/manage-student" element={<ManageStudent />} /> {/* Page pour gérer les étudiants */}
          <Route path="/messages" element={<Message />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
