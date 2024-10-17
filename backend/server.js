const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurer MySQL
const db = mysql.createConnection({
  host: 'localhost',      // Remplace par l'adresse de ton serveur MySQL
  user: 'root',           // Remplace par ton nom d'utilisateur MySQL
  password: 'mahmoud bh',   // Remplace par ton mot de passe MySQL
  database: 'gestion_etudiant'  // Remplace par le nom de ta base de données
});

// Connecte-toi à la base de données MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});
// Route pour l'inscription
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    // Requête pour insérer les données dans la base de données
    const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de l\'inscription.' });
      }
      return res.status(201).json({ success: true, message: 'Inscription réussie!' });
    });
  });
  
  app.post('/api/login', (req, res) => {
    console.log('Tentative de connexion');
    const { email, password } = req.body;
  
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
      }
      if (results.length > 0) {
        return res.status(200).json({ success: true, message: 'Connexion réussie!' });
      } else {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
      }
    });
  });  

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${port}`);
});
