import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCog, Mail, Briefcase, Building2, ShieldCheck, Filter } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [users, setUsers] = useState(() => mockStore.getAllUsers());
  const roles = useMemo(() => mockStore.getAllRoles(), []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchTerm || 
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = !filterRole || u.role === filterRole;
      const matchStatus = !filterStatus || u.status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleToggleStatus = (e, id) => {
    e.stopPropagation();
    mockStore.toggleUserStatus(id);
    setUsers(mockStore.getAllUsers());
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý người dùng</h1>
          <p className="contract-subtitle">Phân quyền và quản lý tài khoản nhân viên trong hệ thống ERP.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => navigate('/user/new')}>
            <Plus size={18} /> Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng người dùng</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{users.length}</p>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Đang hoạt động</p>
          <div className="crm-card-body">
            <p className="crm-card-value" style={{ color: '#16a34a' }}>{users.filter(u => u.status === 'Active').length}</p>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tạm khóa</p>
          <div className="crm-card-body">
            <p className="crm-card-value" style={{ color: '#dc2626' }}>{users.filter(u => u.status !== 'Active').length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Tìm theo tên, username, email..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <select className="select-modern" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <select className="select-modern" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Tạm khóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Username</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Đơn vị/Phòng ban</th>
              <th>Lần đăng nhập cuối</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map(u => (
              <tr key={u.id} onClick={() => navigate(`/user/edit/${u.id}`)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EE003310', color: '#EE0033', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {u.fullName.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.fullName}</div>
                  </div>
                </td>
                <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{u.username}</code></td>
                <td>{u.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                    <ShieldCheck size={14} color="#3b82f6" />
                    {u.role}
                  </div>
                </td>
                <td>{u.department}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{u.lastLogin}</td>
                <td>
                  <button 
                    onClick={(e) => handleToggleStatus(e, u.id)}
                    className={`status-badge-modern ${u.status === 'Active' ? 'status-badge-green' : 'status-badge-red'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {u.status === 'Active' ? 'Hoạt động' : 'Tạm khóa'}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
