import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      }, {
        withCredentials: true, // Include session cookies in the request
      });

      // Check if the response contains user data
      if (response.data.user) {
        // Store the entire user object in local storage (or just the name)
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        localStorage.setItem('userName', response.data.user.name); // Storing name separately
        setMessage('Login successful');
        window.location.href = '/home'; // Or use navigate('/home') if using react-router
      } else {
        setMessage('Invalid credentials.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Error logging in.');
      } else {
        setMessage('Error logging in.');
      }
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="title">Login</p>
        <p className="message">Welcome back! Please enter your credentials.</p>

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
            type="password" 
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button type="submit" className="submit">Login</button>
        {message && <p className="message">{message}</p>}
        <p className="signin">Don't have an account? <a href="/signup">Signup</a></p>
      </form>

      <style jsx>{`
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 450px; /* Increased max-width */
          background-color: #fff;
          padding: 30px; /* Increased padding */
          border-radius: 20px;
          position: relative;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f2f5;
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

        .login-form label {
          position: relative;
        }

        .login-form label .input {
          width: 95%;
          padding: 12px 10px 22px 10px; /* Increased padding */
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
          padding: 12px; /* Padding for the button */
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          transform: .3s ease;
          width: 95%;
          margin: 10px 2px;
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

export default Login;
