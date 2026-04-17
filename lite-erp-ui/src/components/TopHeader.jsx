// src/components/TopHeader.jsx
import React from 'react';
import { Search, Bell, Globe } from 'lucide-react';
import './TopHeader.css';

const TopHeader = () => {
  return (
    <div className="top-header">
      <div className="search-container">
        <Search size={18} color="#94a3b8" className="search-icon" />
        <input type="text" placeholder="Tìm kiếm ..." className="search-input" />
      </div>

      <div className="header-actions">
        <button className="action-btn">
          <Bell size={20} color="#475569" strokeWidth={1.5} />
        </button>
        <button className="action-btn">
          <Globe size={20} color="#475569" strokeWidth={1.5} />
        </button>
        <div className="header-divider"></div>
        <span className="support-text">Hỗ trợ</span>
        <div className="avatar">
          {/* Default user avatar */}
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
