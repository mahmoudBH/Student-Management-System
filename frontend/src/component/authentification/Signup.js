import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // Nouveau champ pour le numéro de mobile
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admin/signup', {
        name: `${firstName} ${lastName}`,
        email,
        password,
        mobileNumber, // Inclure le numéro de mobile dans la requête
      });

      localStorage.setItem('user', JSON.stringify({ name: `${firstName} ${lastName}`, email, mobileNumber }));
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Erreur lors de la création de l\'admin.');
      }
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        <div className="flex">
          <label>
            <input 
              required 
              type="text" 
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>Firstname</span>
          </label>

          <label>
            <input 
              required 
              type="text" 
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span>Lastname</span>
          </label>
        </div>

        <label>
          <input 
            required 
            type="email" 
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input 
            required 
            type="text" 
            className="input"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <span>Mobile Number</span>
        </label>

        <label>
          <input 
            required 
            type="password" 
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <label>
          <input 
            required 
            type="password" 
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span>Confirm password</span>
        </label>

        <button type="submit" className="submit">Submit</button>
        {message && <p className="message">{message}</p>}
        <p className="signin">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>

      <style jsx>{`
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 350px;
          background-color: #fff;
          padding: 20px;
          border-radius: 20px;
          position: relative;
        }

        .container {
          display: flex;
          justify-content: center;  /* Centre horizontalement */
          align-items: center;      /* Centre verticalement */
          height: 100vh;            /* Hauteur de la fenêtre */
          background-color: #f0f2f5; /* Optionnel : couleur de fond */
        }

        .title {
          font-size: 28px;
          color: royalblue;
          font-weight: 600;
          letter-spacing: -1px;
          position: relative;
          display: flex;
          align-items: center;
          padding-left: 30px;
        }

        .title::before, .title::after {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          border-radius: 50%;
          left: 0px;
          background-color: royalblue;
        }

        .title::before {
          width: 18px;
          height: 18px;
        }

        .title::after {
          width: 18px;
          height: 18px;
          animation: pulse 1s linear infinite;
        }

        .message, .signin {
          color: rgba(88, 87, 87, 0.822);
          font-size: 14px;
        }

        .signin {
          text-align: center;
        }

        .signin a {
          color: royalblue;
        }

        .signin a:hover {
          text-decoration: underline royalblue;
        }

        .flex {
          display: flex;
          width: 100%;
          gap: 6px;
        }

        .login-form label {
          position: relative;
        }

        .login-form label .input {
          width: 90%;
          padding: 10px 10px 20px 10px;
          outline: 0;
          border: 1px solid rgba(105, 105, 105, 0.397);
          border-radius: 10px;
        }

        .login-form label .input + span {
          position: absolute;
          left: 10px;
          top: 15px;
          color: grey;
          font-size: 0.9em;
          cursor: text;
          transition: 0.3s ease;
        }

        .login-form label .input:placeholder-shown + span {
          top: 15px;
          font-size: 0.9em;
        }

        .login-form label .input:focus + span, .login-form label .input:valid + span {
          top: 30px;
          font-size: 0.7em;
          font-weight: 600;
        }

        .login-form label .input:valid + span {
          color: green;
        }

        .submit {
          border: none;
          outline: none;
          background-color: royalblue;
          padding: 10px;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          transform: .3s ease;
        }

        .submit:hover {
          background-color: rgb(56, 90, 194);
        }

        @keyframes pulse {
          from {
            transform: scale(0.9);
            opacity: 1;
          }
          to {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
