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

const port = 4000;

// Middleware configuration
app.use(cors({
    origin: 'http://192.168.232.123:4000:8082',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ success: false, message: 'Accès non autorisé - Token manquant.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).json({ success: false, message: 'Token invalide - Vérifiez le token.' });
        }
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

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error occurred.' });
        
        if (results.length > 0) {
            const user = results[0];
            
            // Add class and profile_photo to the token payload
            const token = jwt.sign(
                { 
                    id: user.id, 
                    firstname: user.firstname, 
                    lastname: user.lastname, 
                    class: user.class,
                    profile_photo: user.profile_photo || null // Include profile photo in token payload
                }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );
            
            return res.status(200).json({ 
                success: true, 
                message: 'Login successful!', 
                token, 
                user: { 
                    id: user.id, 
                    firstname: user.firstname, 
                    lastname: user.lastname, 
                    email: user.email, 
                    class: user.class,
                    profile_photo: user.profile_photo || null // Include profile photo in response data
                } 
            });
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
    const userId = req.user.id;

    const sql = 'SELECT id, firstname, lastname, email, profile_photo FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = results[0];
        // Create the complete URL for the profile photo
        user.profile_photo = user.profile_photo ? `http://192.168.232.123:4000/uploads/${user.profile_photo}` : null;

        return res.status(200).json({ success: true, data: user });
    });
});


// Profile route - PUT
app.put('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { firstname, lastname, email } = req.body; // Removed password from profile update

    // Prepare SQL query
    const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?';

    // Execute the query
    db.query(sql, [firstname, lastname, email, userId], (err, results) => {
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

    // Check if the current password is correct
    const sql = 'SELECT password FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error verifying current password.' });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const storedPassword = results[0].password;

        // Simple check for current password
        if (currentPassword !== storedPassword) {
            return res.status(403).json({ success: false, message: 'Current password is incorrect.' });
        }

        // Update the password without hashing
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
    const photoName = req.file.filename; // Use only the file name

    const sql = 'UPDATE users SET profile_photo = ? WHERE id = ?';
    db.query(sql, [photoName, userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error updating profile photo.' });
        
        return res.status(200).json({ success: true, message: 'Profile photo updated successfully!', photoName });
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
        const sql = 'SELECT *, CONCAT("http://192.168.232.123:4000/uploads/", pdf_path) AS fileUrl FROM cours WHERE classe = ?';
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

// Route to check for new courses
app.get('/api/check-new-courses', authenticateToken, (req, res) => {
    const classId = req.user.class; // Get class ID from the authenticated user token

    // Query to fetch new courses that belong to the user's class and have not been viewed
    const sql = 'SELECT * FROM cours WHERE classe = ? AND viewed = 0';
    db.query(sql, [classId], (err, results) => {
        if (err) {
            console.error('Error checking for new courses:', err);
            return res.status(500).json({ success: false, message: 'Error checking for new courses.' });
        }

        // If there are unviewed courses, return success with the courses
        if (results.length > 0) {
            return res.json({ success: true, newCourses: results });
        } else {
            return res.json({ success: false, newCourses: [] }); // No new courses
        }
    });
});

// Endpoint to mark a course as viewed
app.put('/api/mark-course-viewed/:id', authenticateToken, (req, res) => {
    const courseId = req.params.id; // Get course ID from request parameters
    const sql = 'UPDATE cours SET viewed = 1 WHERE id = ? AND viewed = 0'; // Update viewed status

    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error marking course as viewed:', err);
            return res.status(500).json({ success: false, message: 'Error marking course as viewed.' });
        }

        // Check if the course was updated
        if (results.affectedRows > 0) {
            return res.json({ success: true, message: 'Course marked as viewed.' });
        } else {
            return res.status(404).json({ success: false, message: 'Course not found or already viewed.' });
        }
    });
});

// API endpoint to get unread notifications count
app.get('/api/unread-notifications', (req, res) => {
    const userId = req.query.userId; // Assuming you pass userId to filter notifications
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    // Query to count unread notes and courses
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM note WHERE userId = ? AND viewed = 0) AS unreadNotes,
        (SELECT COUNT(*) FROM cours WHERE class = ? AND viewed = 0) AS unreadCourses
    `;
  
    db.query(query, [userId, userId], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      const unreadCount = {
        notes: results[0].unreadNotes,
        courses: results[0].unreadCourses,
      };
  
      res.json(unreadCount);
    });
  });

// Start server
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});