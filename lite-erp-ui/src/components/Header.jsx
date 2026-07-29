import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Bell, BriefcaseBusiness, Building2, Mail, Phone, Shield, Smartphone, X, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';

function Header() {
  const navigate = useNavigate();
  const currentUserId = 'USR-001';
  const DEPARTMENT_OPTIONS = [
    'TT Công nghệ Thông tin',
    'Phòng Bán hàng',
    'Phòng Tài chính',
    'Phòng Công nghệ',
    'Phòng Nhân sự',
    'Phòng Marketing',
    'Phòng Hành chính'
  ];
  const POSITION_OPTIONS = [
    'Nhân viên',
    'Chuyên viên',
    'Chuyên viên AM',
    'Trưởng nhóm',
    'Quản lý',
    'Kế toán trưởng',
    'Giám đốc',
    'Giám đốc công nghệ',
    'Giám đốc Bán hàng'
  ];

  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activePreferencesTab, setActivePreferencesTab] = useState('personal');
  const [currentUser, setCurrentUser] = useState(() => mockStore.getUser(currentUserId) || null);
  const [allUsers, setAllUsers] = useState(() => mockStore.getAllUsers());
  const [personalInfo, setPersonalInfo] = useState(() => ({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    role: '',
    username: '',
    managerId: '',
    leaveEndDate: '',
    leaveReason: ''
  }));



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setIsMenuOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      setIsPreferencesOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !isPreferencesOpen) return;
    const latestUser = mockStore.getUser(currentUserId) || null;
    setAllUsers(mockStore.getAllUsers());
    setCurrentUser(latestUser);
    setPersonalInfo({
      fullName: latestUser?.fullName || '',
      email: latestUser?.email || '',
      phone: latestUser?.phone || '',
      department: latestUser?.department || '',
      position: latestUser?.position || '',
      role: latestUser?.role || '',
      username: latestUser?.username || latestUser?.email || '',
      managerId: latestUser?.managerId || '',
      leaveEndDate: latestUser?.leaveEndDate || '',
      leaveReason: latestUser?.leaveReason || ''
    });
  }, [isMenuOpen, isPreferencesOpen]);

  const displayName = currentUser?.fullName || '';
  const displayEmail = currentUser?.email || '';
  const displayPhone = currentUser?.phone || '';
  const displayDepartment = currentUser?.department || '';
  const displayRole = currentUser?.role || '';
  const displayPosition = currentUser?.position || '';
  const avatarLetter = (displayName.trim().charAt(0) || 'A').toUpperCase();

  const openUserProfile = () => {
    setIsMenuOpen(false);
    navigate('/user/edit/USR-001');
  };

  const goToPreferences = () => {
    setIsMenuOpen(false);
    setActivePreferencesTab('personal');
    setIsPreferencesOpen(true);
  };

  const openOdooAccount = () => {
    setIsMenuOpen(false);
    window.open('https://www.odoo.com/my/home', '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate('/activate');
  };

  const closePreferences = () => {
    setIsPreferencesOpen(false);
  };



  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };



  const savePersonalInfo = () => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      fullName: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      username: personalInfo.email || currentUser.username || ''
    };
    mockStore.saveUser(currentUserId, updatedUser);
    setCurrentUser(updatedUser);
    setAllUsers(mockStore.getAllUsers());
  };

  const handleUpdateClick = () => {
    if (activePreferencesTab === 'personal') {
      savePersonalInfo();
    }
    closePreferences();
  };

  return (
    <>
      <header className="top-header">
        <div className="header-spacer"></div>
        <div className="header-actions">
          <div className="notification-icon">
            <Bell size={20} color="#64748b" />
            <span className="badge"></span>
          </div>
          <div className="user-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="user-profile"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <img
                src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4"
                alt="User"
                className="avatar-img"
              />
              <span className="user-name">{displayName}</span>
              <span className="chevron">▼</span>
            </button>

            {isMenuOpen ? (
              <div className="user-dropdown" role="menu" aria-label="User menu">
                <button type="button" className="dropdown-item" onClick={goToPreferences}>
                  Tùy chọn của tôi
                </button>
                <button type="button" className="dropdown-item" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isPreferencesOpen ? (
        <div className="prefs-overlay" onClick={closePreferences}>
          <div className="prefs-modal" role="dialog" aria-label="Tùy chọn của tôi" onClick={(event) => event.stopPropagation()}>
            <div className="prefs-header">
              <h2>Thay đổi tùy chọn của tôi</h2>
              <button type="button" className="prefs-close" onClick={closePreferences} aria-label="Đóng">
                <X size={24} />
              </button>
            </div>

            <div className="prefs-profile">
              <div className="prefs-avatar">{avatarLetter}</div>
              <div className="prefs-user-info">
                {displayName && <h3>{displayName}</h3>}
                {displayEmail && <p><Mail size={16} /> {displayEmail}</p>}
                {displayPhone && <p><Phone size={16} /> {displayPhone}</p>}
                {displayDepartment && <p><Building2 size={16} /> {displayDepartment}</p>}
                {displayRole && <p><Shield size={16} /> {displayRole}</p>}
                {displayPosition && <p><BriefcaseBusiness size={16} /> {displayPosition}</p>}
                {currentUser?.status && <p><Smartphone size={16} /> {currentUser.status === 'Active' ? 'Hoạt động' : 'Ngưng hoạt động'}</p>}
              </div>
            </div>

            <div className="prefs-tabs">
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'personal' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('personal')}>Thông tin cơ bản</button>
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'security' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('security')}>Bảo mật</button>
            </div>

            <div className="prefs-content">
              {activePreferencesTab === 'personal' ? (
                <div>
                  <div className="prefs-personal-grid">
                    <div className="prefs-form-field">
                      <label>Tên nhân viên <span className="prefs-required">*</span></label>
                      <input type="text" value={personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} placeholder="Nhập tên nhân viên" />
                    </div>

                    <div className="prefs-form-field">
                      <label>Email liên hệ <span className="prefs-required">*</span></label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => {
                          const nextEmail = e.target.value;
                          setPersonalInfo(prev => ({
                            ...prev,
                            email: nextEmail,
                            username: nextEmail
                          }));
                        }}
                        placeholder="Nhập email liên hệ"
                      />
                    </div>

                    <div className="prefs-form-field">
                      <label>Số điện thoại</label>
                      <input type="text" value={personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="Nhập số điện thoại" />
                    </div>

                    <div className="prefs-form-field">
                      <label>Phòng ban</label>
                      <select value={personalInfo.department} onChange={(e) => updatePersonalInfo('department', e.target.value)} disabled className="prefs-readonly">
                        <option value="">-- Chọn giá trị --</option>
                        {DEPARTMENT_OPTIONS.map(department => (
                          <option key={department} value={department}>{department}</option>
                        ))}
                      </select>
                    </div>

                    <div className="prefs-form-field">
                      <label>Chức danh</label>
                      <select value={personalInfo.position} onChange={(e) => updatePersonalInfo('position', e.target.value)} disabled className="prefs-readonly">
                        <option value="">-- Chọn giá trị --</option>
                        {POSITION_OPTIONS.map(position => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                    </div>

                    <div className="prefs-form-field">
                      <label>Tên đăng nhập</label>
                      <input type="text" value={personalInfo.username} readOnly disabled className="prefs-readonly" />
                    </div>

                    <div className="prefs-form-field">
                      <label>Quản lý</label>
                      <select value={personalInfo.managerId} onChange={(e) => updatePersonalInfo('managerId', e.target.value)} disabled className="prefs-readonly">
                        <option value="">-- Chọn giá trị --</option>
                        {allUsers.filter(user => user.id !== currentUserId).map(user => (
                          <option key={user.id} value={user.id}>{user.fullName || user.email || user.username}</option>
                        ))}
                      </select>
                    </div>

                    <div className="prefs-form-field">
                      <label>Ngày hết hạn nghỉ</label>
                      <input type="date" value={personalInfo.leaveEndDate} onChange={(e) => updatePersonalInfo('leaveEndDate', e.target.value)} disabled className="prefs-readonly" />
                    </div>

                    <div className="prefs-form-field">
                      <label>Lý do nghỉ</label>
                      <input
                        type="text"
                        value={personalInfo.leaveReason}
                        disabled
                        className="prefs-readonly"
                        title={personalInfo.leaveReason}
                      />
                    </div>

                    <div className="prefs-form-field">
                      <label>Vai trò hệ thống</label>
                      <input type="text" value={personalInfo.role} readOnly disabled className="prefs-readonly" title={personalInfo.role} />
                    </div>
                  </div>
                </div>
              ) : null}





              {activePreferencesTab === 'security' ? (
                <div className="prefs-security-container">
                  <div className="prefs-security-row">
                    <div className="prefs-security-left">
                      <h4>Thay đổi mật khẩu</h4>
                      <p>Cập nhật nếu bị xâm phạm.</p>
                    </div>
                    <div className="prefs-security-right">
                      <button type="button" className="btn-security-action">Thay đổi mật khẩu</button>
                    </div>
                  </div>


                  <div className="prefs-security-row">
                    <div className="prefs-security-left">
                      <h4>Thiết bị</h4>
                      <p>Kiểm tra xem chúng có phải của bạn không.</p>
                    </div>
                    <div className="prefs-security-right">
                      <div className="device-card">
                        <div className="device-icon-wrap">
                          <Laptop size={32} />
                        </div>
                        <div className="device-info">
                          <div className="device-header">
                            <span className="device-name">Macos Chrome</span>
                            <span className="status-dot-active"></span>
                            <span className="device-time">1 phút trước</span>
                          </div>
                          <p className="device-details">116.96.47.125</p>
                          <p className="device-details">Vietnam</p>
                          <p className="device-details">Hanoi</p>
                        </div>
                        <button type="button" className="btn-device-logout">Đăng xuất</button>
                      </div>
                      <button type="button" className="btn-logout-all">Đăng xuất khỏi tất cả thiết bị</button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="prefs-footer">
              <button type="button" className="prefs-update-btn" onClick={handleUpdateClick}>Cập nhật</button>
              <button type="button" className="prefs-cancel-btn" onClick={closePreferences}>Hủy bỏ</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Header;
