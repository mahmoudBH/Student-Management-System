

# Student Management System

## Overview

The **Student Management System** consists of two main applications:
1. **User App** (Mobile app built with React Native) - Allows students to view their grades, courses, and profiles.
2. **Admin App** (Web app built with React.js) - Allows administrators to manage student grades, courses, and other administrative tasks.

Both applications are powered by a common backend built with Node.js and MySQL.

---

## 1. User App

### Features
- View personal grades and courses.
- Update personal profile information.
- Change password functionality.
- Upload and view profile photo.

### Installation

#### Requirements
- Node.js (for React Native development)
- Expo CLI (for running the app)
- A mobile device or emulator for testing

#### Steps
1. Clone the repository:
   ```
   git clone https://github.com/mahmoudBH/student-management-system.git
   cd student-management-system/user-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the app using Expo:
   ```
   expo start
   ```

4. Scan the QR code with the Expo Go app on your mobile device to run the app.

### API Endpoints
- **Profile**: Get and update user profile details.
- **Change Password**: Change user’s password.
- **Grades & Courses**: Retrieve the student’s grades and courses data from the backend.

---

## 2. Admin App

### Features
- Manage student grades and courses.
- Add, update, and delete courses and student grades.
- Manage user accounts (add/remove users).

### Installation

#### Requirements
- Node.js (for React.js development)
- A modern web browser (Chrome, Firefox, etc.)

#### Steps
1. Clone the repository:
   ```
   git clone https://github.com/mahmoudBH/student-management-system.git
   cd student-management-system/admin-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the app:
   ```
   npm start
   ```

4. Open the web app in your browser at `http://localhost:3000`.

### API Endpoints
- **Add/Edit/Delete Courses**: Manage courses in the system.
- **Manage Students**: Add or remove students and assign grades.
- **Manage Users**: Create, update, or delete user accounts (admin functionalities).

---

## Backend Setup

### Requirements
- Node.js
- MySQL

### Steps
1. Clone the repository:
   ```
   git clone https://github.com/mahmoudBH/student-management-system.git
   cd student-management-system/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Import the provided SQL schema into MySQL.

4. Configure the backend environment:
   - Create a `.env` file and provide your MySQL credentials and JWT secret.

5. Start the backend server:
   ```
   npm start
   ```

The backend will run on `http://localhost:5000` for the Admin API and `http://localhost:4000` for the User API.

---

## Contributing

Feel free to fork this repository and submit pull requests with improvements or bug fixes. Ensure to follow best practices and include tests where applicable.

---

## License

This project is licensed under the MIT License.

---
