import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Bell, BriefcaseBusiness, Building2, Mail, Phone, Shield, Smartphone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';

function Header() {
  const navigate = useNavigate();
  const currentUserId = 'USR-001';
  const DEPARTMENT_OPTIONS = [
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
    'Trưởng nhóm',
    'Quản lý',
    'Kế toán trưởng',
    'Giám đốc'
  ];
  const TIMEZONE_OPTIONS = [
    'GMT',
    'GMT+0',
    'GMT-0',
    'Greenwich',
    'Hongkong',
    'Iceland',
    'Án Độ Dương/Antananarivo',
    'Án Độ Dương/Chagos',
    'Án Độ Dương/Christmas',
    'Châu Á/Hồ_Chí_Minh'
  ];
  const PRIVACY_OPTIONS = [
    'Public by default',
    'Private by default',
    'Internal users only'
  ];
  const WORK_DAY_OPTIONS = [
    'Không xác định',
    'Office',
    'Home',
    'Other'
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
  const [preferences, setPreferences] = useState({
    language: 'Vietnamese / Tiếng Việt',
    notifyChannel: 'email',
    signature: 'Administrator',
    attendancePin: ''
  });
  const [calendarPrefs, setCalendarPrefs] = useState({
    timezone: 'Châu Á/Hồ_Chí_Minh',
    privacy: 'Public by default',
    outOfOffice: 'None planned',
    outOfOfficeMessage: '',
    monday: 'Không xác định',
    tuesday: 'Không xác định',
    wednesday: 'Không xác định',
    thursday: 'Không xác định',
    friday: 'Không xác định',
    saturday: 'Không xác định',
    sunday: 'Không xác định'
  });

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

  const displayName = currentUser?.fullName || 'Administrator';
  const displayEmail = currentUser?.email || 'Chưa cập nhật email';
  const displayPhone = currentUser?.phone || 'Chưa cập nhật';
  const displayDepartment = currentUser?.department || 'Chưa cập nhật';
  const displayRole = currentUser?.role || 'Chưa cập nhật';
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

  const updatePreference = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateCalendarPrefs = (field, value) => {
    setCalendarPrefs(prev => ({ ...prev, [field]: value }));
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
                <button type="button" className="dropdown-item" onClick={openUserProfile}>
                  Hồ sơ
                </button>
                <button type="button" className="dropdown-item dropdown-shortcut" onClick={() => setIsMenuOpen(false)}>
                  <span>Phím tắt</span>
                  <span className="dropdown-shortcut-key">CTRL+K</span>
                </button>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item dropdown-with-arrow" onClick={() => setIsMenuOpen(false)}>
                  <span className="status-dot" />
                  <span>Online</span>
                  <span className="right-arrow">▸</span>
                </button>
                <button type="button" className="dropdown-item" onClick={goToPreferences}>
                  Tùy chọn cá nhân
                </button>
                <button type="button" className="dropdown-item" onClick={openOdooAccount}>
                  Tài khoản Odoo.com
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
          <div className="prefs-modal" role="dialog" aria-label="Tùy chọn cá nhân" onClick={(event) => event.stopPropagation()}>
            <div className="prefs-header">
              <h2>Thay đổi tùy chọn của tôi</h2>
              <button type="button" className="prefs-close" onClick={closePreferences} aria-label="Đóng">
                <X size={24} />
              </button>
            </div>

            <div className="prefs-alert">Thông báo đẩy Odoo đã bị chặn. Đi tới cài đặt trình duyệt để cho phép.</div>

            <div className="prefs-profile">
              <div className="prefs-avatar">{avatarLetter}</div>
              <div className="prefs-user-info">
                <h3>{displayName}</h3>
                <p><Mail size={16} /> {displayEmail}</p>
                <p><Phone size={16} /> {displayPhone}</p>
                <p><Building2 size={16} /> {displayDepartment}</p>
                <p><Shield size={16} /> {displayRole}</p>
                {displayPosition ? <p><BriefcaseBusiness size={16} /> {displayPosition}</p> : null}
                <p><Smartphone size={16} /> {currentUser?.status === 'Active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}</p>
              </div>
            </div>

            <div className="prefs-tabs">
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'personal' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('personal')}>Thông tin cơ bản</button>
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'calendar' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('calendar')}>Lịch</button>
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'options' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('options')}>Tùy chọn</button>
              <button type="button" className={`prefs-tab ${activePreferencesTab === 'security' ? 'active' : ''}`} onClick={() => setActivePreferencesTab('security')}>Bảo mật</button>
            </div>

            <div className="prefs-content">
              {activePreferencesTab === 'personal' ? (
                <div>
                  <h4 className="prefs-section-title">1. Thông tin cơ bản</h4>
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
                      <label>Tên đăng nhập <span className="prefs-required">*</span></label>
                      <input type="text" value={personalInfo.username} readOnly disabled className="prefs-readonly" />
                    </div>

                    <div className="prefs-form-field">
                      <label>Chọn quản lý</label>
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

                    <div className="prefs-form-field prefs-form-field-wide">
                      <label>Lý do nghỉ</label>
                      <textarea
                        rows={2}
                        value={personalInfo.leaveReason}
                        onChange={(e) => updatePersonalInfo('leaveReason', e.target.value)}
                        disabled
                        placeholder={!personalInfo.leaveEndDate ? 'Vui lòng nhập ngày hết hạn nghỉ trước' : ''}
                        className="prefs-readonly"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {activePreferencesTab === 'options' ? (
                <div className="prefs-grid">
                  <div className="prefs-col">
                    <label>Ngôn ngữ</label>
                    <input type="text" value={preferences.language} onChange={(e) => updatePreference('language', e.target.value)} />

                    <label>Chữ ký Email</label>
                    <textarea rows={5} value={preferences.signature} onChange={(e) => updatePreference('signature', e.target.value)} />
                  </div>

                  <div className="prefs-col">
                    <label>Thông báo</label>
                    <div className="prefs-radio-row">
                      <label>
                        <input type="radio" name="notifyChannel" checked={preferences.notifyChannel === 'email'} onChange={() => updatePreference('notifyChannel', 'email')} />
                        By Emails
                      </label>
                      <label>
                        <input type="radio" name="notifyChannel" checked={preferences.notifyChannel === 'odoo'} onChange={() => updatePreference('notifyChannel', 'odoo')} />
                        Trong Odoo
                      </label>
                    </div>

                    <label>Attendance PIN</label>
                    <input type="text" value={preferences.attendancePin} onChange={(e) => updatePreference('attendancePin', e.target.value)} />
                  </div>
                </div>
              ) : null}

              {activePreferencesTab === 'calendar' ? (
                <div className="prefs-calendar-grid">
                  <div className="prefs-calendar-col">
                    <div className="prefs-calendar-row">
                      <label>
                        Múi giờ <span className="prefs-info-icon">?</span>
                      </label>
                      <select value={calendarPrefs.timezone} onChange={(e) => updateCalendarPrefs('timezone', e.target.value)}>
                        {TIMEZONE_OPTIONS.map(timezone => (
                          <option key={timezone} value={timezone}>{timezone}</option>
                        ))}
                      </select>
                    </div>

                    <div className="prefs-calendar-row">
                      <label>Tính riêng tư</label>
                      <select value={calendarPrefs.privacy} onChange={(e) => updateCalendarPrefs('privacy', e.target.value)}>
                        {PRIVACY_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="prefs-calendar-row">
                      <label>Out-of-office</label>
                      <input type="text" value={calendarPrefs.outOfOffice} onChange={(e) => updateCalendarPrefs('outOfOffice', e.target.value)} />
                    </div>

                    <div className="prefs-calendar-message">
                      <textarea
                        rows={5}
                        placeholder="Your out-of-office message..."
                        value={calendarPrefs.outOfOfficeMessage}
                        onChange={(e) => updateCalendarPrefs('outOfOfficeMessage', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="prefs-calendar-col">
                    <div className="prefs-week-grid">
                      <div className="prefs-week-item">
                        <label>Thứ 2</label>
                        <select value={calendarPrefs.monday} onChange={(e) => updateCalendarPrefs('monday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Thứ 3</label>
                        <select value={calendarPrefs.tuesday} onChange={(e) => updateCalendarPrefs('tuesday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Thứ 4</label>
                        <select value={calendarPrefs.wednesday} onChange={(e) => updateCalendarPrefs('wednesday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Thứ 5</label>
                        <select value={calendarPrefs.thursday} onChange={(e) => updateCalendarPrefs('thursday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Thứ 6</label>
                        <select value={calendarPrefs.friday} onChange={(e) => updateCalendarPrefs('friday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Thứ 7</label>
                        <select value={calendarPrefs.saturday} onChange={(e) => updateCalendarPrefs('saturday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="prefs-week-item">
                        <label>Chủ nhật</label>
                        <select value={calendarPrefs.sunday} onChange={(e) => updateCalendarPrefs('sunday', e.target.value)}>
                          {WORK_DAY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activePreferencesTab === 'security' ? (
                <div className="prefs-placeholder">
                  <h4>Cài đặt bảo mật</h4>
                  <p>Quản lý mật khẩu, phiên đăng nhập và cấu hình xác thực hai lớp cho tài khoản.</p>
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
