const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Import express-session

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://172.16.27.191:8082', // Adjust this to match your React Native development server
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
      // Store user details in session
      req.session.user = {
        id: results[0].id,
        firstname: results[0].firstname,
        lastname: results[0].lastname,
        email: results[0].email
      };
      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        user: req.session.user // Send user data back to frontend
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  });
});

// Route to check session
// Route to check session
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  }
  return res.status(401).json({ loggedIn: false, message: 'No user logged in.' });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
