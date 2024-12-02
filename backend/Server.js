const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws'); // Importer WebSocket pour envoyer des notifications
const jwt = require('jsonwebtoken');

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Permettre l'accès depuis le frontend
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurer la session
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

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gestion_etudiant',
});

db.connect((err) => {
  if (err) console.error('Database connection failed:', err);
  else console.log('Connected to gestion_etudiant database');
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

// Configuration de Multer pour les téléchargements PDF
const storagepdf = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
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
const uploadpdf = multer({ storage: storagepdf, fileFilter: pdfFilter });

// Middleware pour vérifier la session
function sessionCheck(req, res, next) {
  if (req.session.user) next();
  else res.status(401).json({ message: 'Unauthorized access. Please log in.' });
}

// Connexion WebSocket pour notifier les clients mobiles et web
const webSocketServer = new WebSocket.Server({ port: 6000 });

webSocketServer.on('connection', (socket) => {
  console.log('New client connected to WebSocket server');
  socket.on('close', () => console.log('Client disconnected'));
});

// Fonction pour envoyer une notification via WebSocket
function sendNotificationToMobile(notification) {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
}

// API pour vérifier la session
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

// API pour l'authentification des admins
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT id, name, email, password FROM admin WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };

    return res.status(200).json({ user: req.session.user, message: 'Login successful' });
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

// API pour ajouter un cours
app.post('/api/cours', sessionCheck, uploadpdf.single('pdfFile'), (req, res) => {
  const { matiere, classe } = req.body;
  const pdfPath = req.file.path;

  const query = 'INSERT INTO cours (matiere, classe, pdf_path) VALUES (?, ?, ?)';
  db.query(query, [matiere, classe, pdfPath], (err) => {
    if (err) {
      console.error("Error adding course:", err);
      return res.status(500).json({ message: "Error adding course" });
    }

    // Envoyer une notification via WebSocket
    sendNotificationToMobile({
      type: 'NEW_COURSE',
      data: { matiere, classe },
    });

    res.status(200).json({ message: "Course added successfully" });
  });
});

// Endpoint to download the PDF of a course
app.get('/api/cours/:id/pdf', (req, res) => {
  const courseId = req.params.id;

  const query = 'SELECT pdf_path FROM cours WHERE id = ?';
  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching PDF:', err);
      return res.status(500).json({ message: 'Error fetching PDF' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'PDF not found for the specified course' });
    }

    const pdfPath = results[0].pdf_path;

    // Serve the PDF file for download
    res.sendFile(path.resolve(pdfPath), (err) => {
      if (err) {
        console.error('Error sending PDF file:', err);
        res.status(500).json({ message: 'Error sending PDF file' });
      }
    });
  });
});

// API pour ajouter une note et envoyer une notification
app.post('/api/note', sessionCheck, (req, res) => {
  const { firstname, lastname, note, class: studentClass, matiere } = req.body;

  // Vérifier si l'utilisateur existe
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

    // Ajouter la note à la base de données
    const queryInsertNote = `
      INSERT INTO note (userId, firstname, lastname, note, class, matiere)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(queryInsertNote, [userId, firstname, lastname, note, studentClass, matiere], (err, result) => {
      if (err) {
        console.error('Error adding note:', err);
        return res.status(500).json({ error: 'Server error while adding the note.' });
      }

      // Envoyer une notification via WebSocket
      sendNotificationToMobile({
        type: 'NEW_NOTE',
        data: {
          firstname,
          lastname,
          note,
          class: studentClass,
          matiere
        },
      });

      res.status(201).json({ message: 'Note successfully added and notification sent!' });
    });
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

// Endpoint to get messages
app.get('/api/messages', (req, res) => {
  const query = 'SELECT id, email, subject, message, created_at FROM support ORDER BY created_at DESC';
  
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
    res.json(results);
  });
});

// Démarrer le serveur Express
app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});
