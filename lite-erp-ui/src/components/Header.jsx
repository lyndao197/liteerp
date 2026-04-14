import React from 'react';
import './Header.css';
import { Bell } from 'lucide-react';

function Header() {
  return (
    <header className="top-header">
      <div className="header-spacer"></div>
      <div className="header-actions">
        <div className="notification-icon">
          <Bell size={20} color="#64748b" />
          <span className="badge"></span>
        </div>
        <div className="user-profile">
          <img
            src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4"
            alt="User"
            className="avatar-img"
          />
          <span className="user-name">Phạm Quang M..</span>
          <span className="chevron">▼</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
