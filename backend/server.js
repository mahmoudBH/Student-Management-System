const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Import express-session
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: 'http://192.168.53.100:8082', // Adjust this to match your React Native development server
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
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

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
        return res.status(201).json({ success: true, message: 'Signup successful!' });
    });
});

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
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

// Route de déconnexion
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out.' });
        }
        res.json({ success: true, message: 'Logged out successfully.' });
    });
});

// Route to check session
app.get('/api/session', (req, res) => {
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

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Si pas de token, renvoie 401

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Si le token n'est pas valide, renvoie 403
        req.user = user; // Sauvegarde les données de l'utilisateur dans la requête
        next();
    });
};

// Exemple de route protégée
app.get('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'You are authorized to view this content.' });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
