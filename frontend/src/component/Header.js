import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default
  const [user, setUser] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    setSidebarOpen(false);
    window.location.href = '/profile';
  };

  // Fonction pour récupérer les données utilisateur
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'utilisateur", error);
    }
  };

  // Récupérer les données utilisateur au chargement du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <img src="./images/education-people.png" alt="Logo" className="logo-image" />
        <h1 className="logo">Admin Panel</h1>
        <button className="menu-icon" onClick={toggleSidebar}>
          <img src="/icons/apps.svg" alt="Menu Icon" />
        </button>
      </div>

      <div className="searchbar">
        <div className="search-icon">
          <img src="/icons/search.svg" alt="Search Icon" />
        </div>
        <input type="text" placeholder="Search..." />
      </div>

      <div className="user-profile">
        {user?.photo ? (
          <img src={user.photo} alt="User Profile" className="header-user-icon" />
        ) : (
          <img src="/icons/default-profile.png" alt="Default Profile" className="header-user-icon" />
        )}
        <div className="dropdown-menu">
          <ul>
            <li>
              <div
                onClick={handleProfileClick}
                role="button"
                tabIndex="0"
                onKeyPress={(e) => e.key === 'Enter' && handleProfileClick()}
              >
                <img src="/icons/user.svg" alt="Profile" />
                <span>Profile</span>
              </div>
            </li>
            <li><img src="/icons/settings-sliders.svg" alt="Settings" />Settings</li>
            <li onClick={handleLogout}><img src="/icons/sign-out-alt.svg" alt="Logout" />Logout</li>
          </ul>
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <ul className="sidebar-menu">
          <li><a href="/home"><img src="/icons/home.svg" alt="Home" /><span>Home</span></a></li>
          <li><a href="/add-note"><img src="/icons/add-document.svg" alt="Add Note" /><span>Add Note</span></a></li>
          <li><a href="/edit-note"><img src="/icons/edit.svg" alt="Edit Notes" /><span>Edit Notes</span></a></li>
          <li><a href="/add-course"><img src="/icons/add.svg" alt="Add Course" /><span>Add Course</span></a></li>
          <li><a href="/manage-student"><img src="/icons/member-list.svg" alt="Manage Student" /><span>Manage Student</span></a></li>
          <li><a href="/messages"><img src="/icons/envelope.svg" alt="Messages" /><span>Messages</span></a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
