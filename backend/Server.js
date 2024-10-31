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

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with frontend origin
  credentials: true,
}));
app.use(bodyParser.json());

// Configure session
app.use(session({
  secret: 'your_secret', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // Session duration: 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to gestion_etudiant database');
  }
});

// Configure multer for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`); // Unique filename
  },
});

const upload = multer({ storage });

// Servir statiquement le dossier des images
app.use('/images', express.static(path.join(__dirname, 'images')));


// Configuration de multer pour stocker les fichiers PDF avec la bonne extension
const storagepdf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de stockage
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${fileExt}`);
  },
});

// Filtre pour accepter uniquement les fichiers PDF
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés !'), false);
  }
};

// Utilisation de la configuration et du filtre avec multer
const uploadpdf = multer({ storage: storage, fileFilter: pdfFilter });



// Session check middleware
function sessionCheck(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized access. Please log in.' });
  }
}

// Route to check session status
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ message: 'Session valid' });
  } else {
    res.status(401).json({ message: 'Session invalid' });
  }
});


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


app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Requête pour vérifier si l'email existe
  db.query('SELECT id, name, email, password FROM admin WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données' });
    }

    // Vérifie si l'email correspond à un utilisateur
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    // Vérifie si le mot de passe correspond
    if (user.password !== password) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Enregistre les informations de l'utilisateur dans la session
    req.session.user = { id: user.id, name: user.name, email: user.email };

    return res.status(200).json({ user: req.session.user, message: 'Connexion réussie' });
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
app.post('/api/cours', sessionCheck, uploadpdf.single('pdfFile'), (req, res) => {
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



// Route pour récupérer les données de l'utilisateur avec photo
app.get('/api/user', (req, res) => {
  // Vérifie que la session utilisateur existe
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: 'Utilisateur non connecté' });
  }

  const userId = req.session.user.id;

  // Sélectionne les informations utilisateur y compris le nom de fichier de la photo
  db.query('SELECT id, name, email, mobile_number, photo FROM admin WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données' });
    }
    if (results.length > 0) {
      // Si l'utilisateur existe, retourne les données avec le chemin vers la photo
      const user = results[0];
      // Construit l'URL de la photo si elle existe
      user.photo = user.photo ? `http://localhost:5000/images/${user.photo}` : null; // Assurez-vous que le chemin correspond à votre configuration
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  });
});



// Route to upload user photo
app.put('/api/user/:id/photo', upload.single('photo'), (req, res) => {
  const userId = parseInt(req.params.id);

  // Vérifie que le fichier a bien été uploadé
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune photo fournie' });
  }

  // Fetch user from the database
  db.query('SELECT * FROM admin WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const photoFilename = req.file.filename;

    // Update the user with the new photo filename
    db.query('UPDATE admin SET photo = ? WHERE id = ?', [photoFilename, userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating photo' });
      }

      res.json({ photo: photoFilename }); // Return the filename
    });
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
