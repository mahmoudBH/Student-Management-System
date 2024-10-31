const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');

const port = 3000;

// Middleware configuration
app.use(cors({
    origin: 'http://192.168.9.123:8082',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());

// Initialize session
app.use(session({
    secret: 'aPz7$9sd@lQ2Xr8k!fVzT7&cPmK3y9zU',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configure MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gestion_etudiant'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

const JWT_SECRET = 'votre_secret';

const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});


const upload = multer({ storage: storage });

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;
        next();
    });
};

// Signup route
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, password, class: userClass } = req.body;
    const sql = 'INSERT INTO users (firstname, lastname, email, password, class) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, email, password, userClass], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error during signup.' });
        return res.status(201).json({ success: true, message: 'Signup successful!' });
    });
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error occurred.' });
        if (results.length > 0) {
            const token = jwt.sign({ id: results[0].id, firstname: results[0].firstname, lastname: results[0].lastname }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ success: true, message: 'Login successful!', token, user: { id: results[0].id, firstname: results[0].firstname, lastname: results[0].lastname, email: results[0].email } });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: 'Could not log out.' });
        res.json({ success: true, message: 'Logged out successfully.' });
    });
});

// Route to check session
app.get('/api/session', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ loggedIn: false, message: 'No token provided.' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ loggedIn: false, message: 'Invalid or expired token.' });
        res.json({ loggedIn: true, user });
    });
});

// Définir l'API pour récupérer les notes
app.get('/api/notes', authenticateToken, (req, res) => {
    const userId = req.user.id; // Obtenez l'ID de l'utilisateur à partir du token
    const sql = 'SELECT * FROM note WHERE userId = ?'; // Utiliser user_id pour filtrer

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving notes:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving notes.' });
        }

        res.json(results); // Retournez les notes en JSON
    });
});

// Route to get all notes for the logged-in user
app.get('/api/mesnotes', authenticateToken, (req, res) => {
    const userId = req.user.id; // Get user ID from token

    const sql = 'SELECT * FROM note WHERE userId = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving notes:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving notes.' });
        }
        res.json(results); // Send notes as JSON response
    });
});

// Profile route - GET
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id; // Get the user ID from the token payload

    const sql = 'SELECT id, firstname, lastname, email, password FROM users WHERE id = ?';
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({ success: true, data: results[0] });
    });
});

// Profile route - PUT
app.put('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { firstname, lastname, email, password } = req.body;

    // Prepare SQL query
    const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?';

    // Execute the query
    db.query(sql, [firstname, lastname, email, password, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Error updating profile.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found or no changes made.' });
        }

        return res.status(200).json({ success: true, message: 'Profile updated successfully!' });
    });
});


// Update password route
app.put('/api/change-password', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body; // Get the current and new password from the request body

    // Check if the current password is correct (this is important for security)
    const sql = 'SELECT password FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error verifying current password.' });
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const storedPassword = results[0].password;

        // Here you would normally compare the currentPassword with the stored password
        // Since you mentioned no hashing, this is just a simple check
        if (currentPassword !== storedPassword) {
            return res.status(403).json({ success: false, message: 'Current password is incorrect.' });
        }

        // Update the password (without hashing as per your requirement)
        const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateSql, [newPassword, userId], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Error updating password.' });

            return res.json({ success: true, message: 'Password updated successfully.' });
        });
    });
});


// Route for uploading profile photo
app.put('/api/upload-photo', authenticateToken, upload.single('profile_photo'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const userId = req.user.id;
    const photoPath = req.file.path;

    const sql = 'UPDATE users SET profile_photo = ? WHERE id = ?';
    db.query(sql, [photoPath, userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error updating profile photo.' });
        return res.status(200).json({ success: true, message: 'Profile photo updated successfully!', photoPath });
    });
});

// Route to add a course with a PDF file
app.post('/api/cours', authenticateToken, upload.single('pdfFile'), (req, res) => {
    const { matiere, classe } = req.body;
    const pdfPath = req.file ? req.file.filename : null;

    if (!pdfPath) return res.status(400).json({ message: 'Erreur: fichier PDF requis' });

    const query = 'INSERT INTO cours (matiere, classe, pdf_path) VALUES (?, ?, ?)';
    db.query(query, [matiere, classe, pdfPath], (err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de l\'ajout du cours' });
        res.status(200).json({ message: 'Cours ajouté avec succès' });
    });
});

// Route to retrieve courses by user class
app.get('/api/mescours', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const userClassSql = 'SELECT class FROM users WHERE id = ?';

    db.query(userClassSql, [userId], (err, userResult) => {
        if (err) return res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la classe.' });
        if (userResult.length === 0) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });

        const userClass = userResult[0].class;
        const sql = 'SELECT *, CONCAT("http://192.168.43.100:3000/uploads/", pdf_path) AS fileUrl FROM cours WHERE classe = ?';
        db.query(sql, [userClass], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des cours.' });
            res.json(results);
        });
    });
});

// Route to get contact details
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT name, email, mobile_number FROM admin';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
      } else {
        res.json(results);
      }
    });
  });

// Endpoint to handle support message
app.post('/support', (req, res) => {
    const { email, subject, message } = req.body;
  
    // Check if email is in the admin table
    const checkAdminQuery = 'SELECT * FROM admin WHERE email = ?';
    db.query(checkAdminQuery, [email], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ error: 'Email not found in admin table' });
      }
  
      // Insert support message into the support table
      const insertSupportQuery = 'INSERT INTO support (email, subject, message) VALUES (?, ?, ?)';
      db.query(insertSupportQuery, [email, subject, message], (error) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to send message' });
        }
        res.status(200).json({ success: true, message: 'Message sent successfully' });
      });
    });
  });


  // Route to check for new notes
app.get('/api/check-new-notes', authenticateToken, (req, res) => {
    const userId = req.user.id; // Get user ID from token

    const sql = 'SELECT * FROM note WHERE userId = ? AND viewed = 0'; // Check for unviewed notes
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error checking for new notes:', err);
            return res.status(500).json({ success: false, message: 'Error checking for new notes.' });
        }

        // If there are unviewed notes, return success with the notes
        if (results.length > 0) {
            return res.json({ success: true, newNotes: results });
        } else {
            return res.json({ success: false, newNotes: [] }); // No new notes
        }
    });
});

// Endpoint to mark a note as viewed
app.put('/api/mark-note-viewed/:id', authenticateToken, (req, res) => {
    const noteId = req.params.id; // Get note ID from request parameters
    const sql = 'UPDATE note SET viewed = 1 WHERE id = ? AND viewed = 0'; // Update viewed status

    db.query(sql, [noteId], (err, results) => {
        if (err) {
            console.error('Error marking note as viewed:', err);
            return res.status(500).json({ success: false, message: 'Error marking note as viewed.' });
        }

        // Check if the note was updated
        if (results.affectedRows > 0) {
            return res.json({ success: true, message: 'Note marked as viewed.' });
        } else {
            return res.status(404).json({ success: false, message: 'Note not found or already viewed.' });
        }
    });
});



// Start server
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
