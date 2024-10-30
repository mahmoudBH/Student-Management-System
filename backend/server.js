const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
<<<<<<< HEAD
const session = require('express-session'); // Import express-session
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'http://192.168.1.135:8081', // Adjust this to match your React Native development server
    credentials: true, // Enable credentials for session handling
}));
app.use(bodyParser.json());

// Initialize session
app.use(session({
    secret: 'aPz7$9sd@lQ2Xr8k!fVzT7&cPmK3y9zU', // You can choose a secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Configurer MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mahmoud bh',
    database: 'gestion_etudiant'
});

// Connect to MySQL
=======
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');

const port = 3000;

// Middleware configuration
app.use(cors({
    origin: 'http://172.16.26.72:8082',
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
    password: '2d4b88bg',
    database: 'gestion_etudiant'
});

>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});
<<<<<<< HEAD
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Si pas de token, renvoie 401

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Si le token n'est pas valide, renvoie 403
        req.user = user; // Sauvegarde les données de l'utilisateur dans la requête
=======

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
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
        next();
    });
};

<<<<<<< HEAD
// Token secret
const JWT_SECRET = 'votre_secret'; // Remplace par une clé secrète sécurisée

// Route for signup
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error during signup.' });
        }
=======
// Signup route
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, password, class: userClass } = req.body;
    const sql = 'INSERT INTO users (firstname, lastname, email, password, class) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, email, password, userClass], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error during signup.' });
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
        return res.status(201).json({ success: true, message: 'Signup successful!' });
    });
});

<<<<<<< HEAD
// Route for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error occurred.' });
        }
        if (results.length > 0) {
            // Create a token
            const token = jwt.sign({ id: results[0].id, firstname: results[0].firstname, lastname: results[0].lastname }, JWT_SECRET, {
                expiresIn: '1h', // Le token expire dans 1 heure
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                token, // Send token back to frontend
                user: {
                    id: results[0].id,
                    firstname: results[0].firstname,
                    lastname: results[0].lastname,
                    email: results[0].email
                } // Send user data back to frontend
            });
=======
// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error occurred.' });
        if (results.length > 0) {
            const token = jwt.sign({ id: results[0].id, firstname: results[0].firstname, lastname: results[0].lastname }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ success: true, message: 'Login successful!', token, user: { id: results[0].id, firstname: results[0].firstname, lastname: results[0].lastname, email: results[0].email } });
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

<<<<<<< HEAD
// Route de déconnexion
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out.' });
        }
=======
// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: 'Could not log out.' });
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
        res.json({ success: true, message: 'Logged out successfully.' });
    });
});

// Route to check session
app.get('/api/session', (req, res) => {
<<<<<<< HEAD
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ loggedIn: false, message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ loggedIn: false, message: 'Invalid or expired token.' });
    }

    // Return the user information if token is valid
    res.json({ loggedIn: true, user });
  });
});


// Exemple de route protégée
app.get('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'You are authorized to view this content.' });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


=======
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ loggedIn: false, message: 'No token provided.' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ loggedIn: false, message: 'Invalid or expired token.' });
        res.json({ loggedIn: true, user });
    });
});

>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
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

<<<<<<< HEAD
app.post('/api/notes', authenticateToken, (req, res) => {
    const { firstname, lastname, note, class: className, matiere } = req.body;
    const userId = req.user.id; // Obtenez l'ID de l'utilisateur à partir du token

    const sql = 'INSERT INTO note (firstname, lastname, note, class, matiere, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, note, className, matiere, userId], (err, result) => {
        if (err) {
            console.error('Error adding note:', err);
            return res.status(500).json({ success: false, message: 'Error adding note.' });
        }
        return res.status(201).json({ success: true, message: 'Note added successfully!' });
=======
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

// Profile route
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT id, firstname, lastname, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json(results[0]);
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
    });
});



<<<<<<< HEAD

// Route to update profile
app.put('/api/profile', authenticateToken, (req, res) => {
    const { firstname, lastname, email } = req.body;
    const userId = req.user.id; // Extracted from the JWT

    const sql = 'UPDATE users SET firstname = ?, lastname = ? WHERE id = ?';
    db.query(sql, [firstname, lastname, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error updating profile.' });
        }
        return res.status(200).json({ success: true, message: 'Profile updated successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server running on exp:${port}`);
});
=======
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
        const sql = 'SELECT *, CONCAT("http://192.168.90.123:3000/uploads/", pdf_path) AS fileUrl FROM cours WHERE classe = ?';
        db.query(sql, [userClass], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des cours.' });
            res.json(results);
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
