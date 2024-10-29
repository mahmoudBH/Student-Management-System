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

// Profile route
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT id, firstname, lastname, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error retrieving profile.' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json(results[0]);
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
