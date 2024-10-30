import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    setSidebarOpen(false); // Close sidebar
    window.location.href = '/profile';
  };

  return (
    <header className="header">
      <div className="header-left">
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
        <img src="/images/user.jpg" alt="User Profile" className="header-user-icon" />
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
          <li><a href="/add-student"><img src="/icons/add-document.svg" alt="Add Note" /><span>Add Note</span></a></li>
          <li><a href="/edit-note"><img src="/icons/edit.svg" alt="Edit Notes" /><span>Edit Notes</span></a></li>
          <li><a href="/add-course"><img src="/icons/add.svg" alt="Add Course" /><span>Add Course</span></a></li>
          <li><a href="/manage-student"><img src="/icons/manage.svg" alt="Manage Student" /><span>Gérer Etudiant</span></a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
