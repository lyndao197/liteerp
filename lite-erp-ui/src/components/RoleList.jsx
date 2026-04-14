import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Shield, Users, Info, Settings2 } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function RoleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [roles, setRoles] = useState(() => mockStore.getAllRoles());

  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchSearch = !searchTerm || 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [roles, searchTerm]);

  const handleToggleStatus = (e, id) => {
    e.stopPropagation();
    mockStore.toggleRoleStatus(id);
    setRoles(mockStore.getAllRoles());
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý vai trò (Roles)</h1>
          <p className="contract-subtitle">Định nghĩa các nhóm quyền và gán quyền hạn cho người dùng hệ thống.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => navigate('/role/new')}>
            <Plus size={18} /> Thêm vai trò mới
          </button>
        </div>
      </div>

      {/* Grid Layout for Roles */}
      <div className="toolbar-row" style={{ marginTop: '24px', marginBottom: '16px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Tìm theo tên vai trò, mô tả..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredRoles.map(role => (
          <div 
            key={role.id} 
            className="crm-metric-card" 
            style={{ 
              height: 'auto', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              padding: '24px',
              transition: 'transform 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => navigate(`/role/edit/${role.id}`)}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: role.status === 'Active' ? '#EE0033' : '#94a3b8' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
              <div style={{ pading: '10px', borderRadius: '8px', background: '#EE003310', color: '#EE0033' }}>
                <Shield size={24} />
              </div>
              <div 
                onClick={(e) => handleToggleStatus(e, role.id)}
                className={`status-badge-modern ${role.status === 'Active' ? 'status-badge-green' : 'status-badge-gray'}`}
              >
                {role.status}
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>{role.name}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5', flex: 1 }}>{role.description}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid #f1f5f9', width: '100%', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#44494D' }}>
                <Users size={16} color="#94a3b8" />
                <strong>{role.userCount}</strong> người dùng
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#44494D', marginLeft: 'auto' }}>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>Chi tiết →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>
          <Shield size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p>Không tìm thấy vai trò nào phù hợp.</p>
        </div>
      )}
    </div>
  );
}
