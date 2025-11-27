# 🎓 Student Management System  
A complete platform that allows **students** and **administrators** to manage academic information efficiently.  
The system is composed of:

- 📱 **User Mobile App** (React Native – Expo)  
- 🖥️ **Admin Web App** (React.js)  
- 🗄️ **Backend API** (Node.js + MySQL)

Both applications share the same database and provide real-time synchronization for grades, courses, messages, and profile management.

---

## 📌 Table of Contents
- [🚀 Overview](#-overview)
- [📱 User App (Mobile)](#-user-app-mobile)
- [🖥️ Admin App (Web)](#-admin-app-web)
- [🗄️ Backend Setup](#-backend-setup)
- [🔌 API Endpoints](#-api-endpoints)
- [🛠️ Technologies](#-technologies)
- [📦 Installation](#-installation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview
The Student Management System simplifies academic management through:

✔ Viewing and managing **grades**, **courses**, and **profiles**  
✔ Integrated **notifications** for new updates  
✔ Secure authentication system  
✔ Document download (PDF courses)  
✔ Bi-directional messaging between students and admins  

The system ensures smooth communication between students and administrators.

---

# 📱 User App (Mobile)

## 🎯 Features
- View personal **grades**  
- View **courses** and download course materials (PDF, docs…)  
- Receive **push notifications** when a new grade or course is added  
- **Contact Admin** via integrated messaging  
- Update **profile information**  
- Change password  
- Upload and display **profile photo**

---

## 🛠️ Installation (User App)

### Requirements
- Node.js  
- Expo CLI  
- Mobile device with **Expo Go** or emulator

### Steps
bash
git clone https://github.com/mahmoudBH/student-management-system.git
cd student-management-system/user-app

npm install
expo start
Scan the QR code using the Expo Go app.

🖥️ Admin App (Web)
🎯 Features
Manage students, grades, and courses

Add / update / delete courses and grades

Upload and view profile photo (admin)

Manage user accounts (CRUD)

Read messages sent by students

Dashboard for viewing all academic data

🛠️ Installation (Admin App)
Requirements
Node.js

Modern browser (Chrome, Firefox…)

Steps
bash
Copier le code
git clone https://github.com/mahmoudBH/student-management-system.git
cd student-management-system/admin-app

npm install
npm start
The app will run at:
👉 http://localhost:3000

🗄️ Backend Setup
Requirements
Node.js

MySQL

Steps
bash
Copier le code
git clone https://github.com/mahmoudBH/student-management-system.git
cd student-management-system/backend

npm install
1️⃣ Create the database
Import the provided SQL schema into MySQL.

2️⃣ Configure environment variables
Create .env file:

ini
Copier le code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gestion_etudiant
JWT_SECRET=your_secret_key
3️⃣ Start the backend server
bash
Copier le code
npm start
Backend runs on:

User API → http://localhost:4000

Admin API → http://localhost:5000

🔌 API Endpoints
User App
Profile:

Get profile

Update profile

Change Password

Grades & Courses (view assigned content)

Notifications

Download Course

Contact Admin (send message)

Admin App
Add / Edit / Delete courses

Add / Edit / Delete grades

Manage user accounts (students & admins)

Upload profile photo

Read messages sent by students

🛠️ Technologies
Backend
Node.js

Express

MySQL

JWT

Multer

Mobile
React Native (Expo)

Axios

React Navigation

Web
React.js

Axios

Context API / Hooks

📦 Installation Summary
Part	Tech	Start Command
Backend	Node.js	npm start
User Mobile App	React Native (Expo)	expo start
Admin Web App	React.js	npm start

🤝 Contributing
Feel free to fork the repository and submit pull requests with improvements.
Please follow coding best practices and include proper documentation.

📄 License
This project is licensed under the MIT License.

© 2025 Mahmoud Bousbih
