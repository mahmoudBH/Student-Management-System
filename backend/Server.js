const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'origine de votre frontend
  credentials: true, // Autoriser l'envoi de cookies
}));
app.use(bodyParser.json());

// Configuration de la session
app.use(session({
  secret: 'votre_secret', // Remplacez par un secret fort
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // Durée de la session (1 heure par exemple)
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Utiliser HTTPS en production
  }
}));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gestion_etudiant',
});

db.connect((err) => {
  if (err) {
    console.log('Échec de la connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données gestion_etudiant');
  }
});

// Configure multer for PDF file storage with the correct extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${fileExt}`);
  },
});

// PDF file filter for multer
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Use the storage and filter configurations with multer
const upload = multer({ storage: storage, fileFilter: pdfFilter });

// Middleware for session check
function sessionCheck(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized access. Please log in.' });
  }
}

// Route de vérification de session
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ message: 'Session valide' });
  } else {
    res.status(401).json({ message: 'Session invalide' });
  }
});

// Admin sign-up route
// Admin sign-up route
app.post('/api/admin/signup', (req, res) => {
  const { name, email, password, mobileNumber } = req.body;

  const queryCheck = 'SELECT * FROM admin WHERE email = ?';
  db.query(queryCheck, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur du serveur' });
    if (results.length > 0) return res.status(400).json({ error: 'L\'email existe déjà' });

    const queryInsert = 'INSERT INTO admin (name, email, password, mobile_number) VALUES (?, ?, ?, ?)';
    db.query(queryInsert, [name, email, password, mobileNumber], (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur du serveur' });
      return res.status(201).json({ message: 'Admin créé avec succès' });
    });
  });
});


// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Requête pour vérifier les identifiants
  db.query('SELECT id, name, email, password FROM admin WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données' });
    }
    if (results.length > 0) {
      req.session.user = { id: results[0].id, name: results[0].name, email: results[0].email }; // Établir la session
      return res.status(200).json({ user: req.session.user, message: 'Connexion réussie' });
    } else {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
  });
});


// Admin logout route
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    res.status(200).json({ message: 'Déconnexion réussie' });
  });
});

// Add note route (protected by sessionCheck)
app.post('/api/note', sessionCheck, (req, res) => {
  const { firstname, lastname, note, class: studentClass, matiere } = req.body;

  const queryCheckUser = 'SELECT id FROM users WHERE firstname = ? AND lastname = ?';
  db.query(queryCheckUser, [firstname, lastname], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Server error, please try again.' });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: 'User with this first and last name does not exist.' });
    }

    const userId = result[0].id;

    const queryInsertNote = `
      INSERT INTO note (userId, firstname, lastname, note, class, matiere)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(queryInsertNote, [userId, firstname, lastname, note, studentClass, matiere], (err, result) => {
      if (err) {
        console.error('Error adding note:', err);
        return res.status(500).json({ error: 'Server error while adding the note.' });
      }

      res.status(201).json({ message: 'Note successfully added!' });
    });
  });
});

// Retrieve all notes (protected by sessionCheck)
app.get('/api/note', sessionCheck, (req, res) => {
  const query = 'SELECT * FROM note';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des notes:', err);
      return res.status(500).json({ error: 'Erreur du serveur lors de la récupération des notes.' });
    }
    res.status(200).json(results);
  });
});

// Update note route (protected by sessionCheck)
app.put('/api/note/:id', sessionCheck, (req, res) => {
  const noteId = req.params.id;
  const { firstname, lastname, note, class: studentClass, matiere } = req.body;

  const queryUpdateNote = `
    UPDATE note
    SET firstname = ?, lastname = ?, note = ?, class = ?, matiere = ?
    WHERE id = ?
  `;
  db.query(queryUpdateNote, [firstname, lastname, note, studentClass, matiere, noteId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la note:', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la note.' });
    }
    res.status(200).json({ id: noteId, firstname, lastname, note, class: studentClass, matiere });
  });
});


// Endpoint to add a new course with PDF upload (protected by sessionCheck)
app.post('/api/cours', sessionCheck, upload.single('pdfFile'), (req, res) => {
  const { matiere, classe } = req.body;
  const pdfPath = req.file.path;

  // Read the PDF file as binary data
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier PDF:', err);
      res.status(500).json({ message: 'Erreur lors de la lecture du fichier PDF' });
      return;
    }

    const query = 'INSERT INTO cours (matiere, classe, pdf_content) VALUES (?, ?, ?)';
    
    db.query(query, [matiere, classe, data], (err, result) => {
      if (err) {
        console.error("Erreur lors de l'ajout du cours:", err);
        res.status(500).json({ message: "Erreur lors de l'ajout du cours" });
      } else {
        res.status(200).json({ message: "Cours ajouté avec succès" });
      }

      // Optionally delete the PDF file from the server after uploading to DB
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) console.error('Erreur lors de la suppression du fichier PDF:', unlinkErr);
      });
    });
  });
});

app.get('/api/cours/:id/pdf', (req, res) => {
  const courseId = req.params.id;

  const query = 'SELECT pdf_path FROM cours WHERE id = ?';
  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du PDF:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération du PDF' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'PDF introuvable pour le cours spécifié' });
    }

    const pdfBuffer = results[0].pdf_path;

    // Set the headers to download the file as a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cours.pdf"');
    res.send(pdfBuffer);
  });
});



// Route pour récupérer les données de l'utilisateur
app.get('/api/user', (req, res) => {
  const userId = req.session.user.id; // Assuming the user ID is stored in the session

  db.query('SELECT id, name, email , mobile_number FROM admin WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(200).json(results[0]); // Return user data
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});


// Route pour mettre à jour les données de l'utilisateur
app.put('/api/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, mobile_number } = req.body;

  // Database query to update the user's name, email, and mobile number
  db.query(
    'UPDATE admin SET name = ?, email = ?, mobile_number = ? WHERE id = ?',
    [name, email, mobile_number, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur de mise à jour des données' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Données mises à jour avec succès' });
    }
  );
});


// Update user password
app.put('/api/user/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Fetch the current password from the database for comparison
  db.query('SELECT password FROM admin WHERE id = ?', [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des informations de l\'utilisateur.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const storedPassword = results[0].password;

    // Check if the current password matches the stored password
    if (storedPassword !== currentPassword) {
      return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
    }

    // Update to the new password
    const queryUpdatePassword = 'UPDATE admin SET password = ? WHERE id = ?';
    db.query(queryUpdatePassword, [newPassword, id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe.' });
      }

      res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    });
  });
});
// Get all students
app.get('/api/students', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update a student's details
app.put('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { firstname, lastname, email, password, class: studentClass } = req.body;

  const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, class = ? WHERE id = ?';
  db.query(sql, [firstname, lastname, email, password, studentClass, studentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student updated successfully' });
  });
});


// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [studentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
