import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, User, Mail, Shield, Building2, Lock, AlertCircle } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    fullName: '',
    email: '',
    role: '',
    department: '',
    status: 'Active',
    password: ''
  });

  const roles = mockStore.getAllRoles();

  useEffect(() => {
    if (isEdit) {
      const user = mockStore.getUser(id);
      if (user) setFormData({ ...user, password: '••••••••' });
    } else {
      setFormData(prev => ({ ...prev, id: mockStore.getNextUserId() }));
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mockStore.saveUser(formData.id, formData);
    navigate('/users');
  };

  return (
    <div className="contract-form-container">
      <div className="contract-form-header">
        <button className="btn-back" onClick={() => navigate('/users')}>
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>
        <div style={{ marginTop: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h1>
          <p style={{ color: '#64748b' }}>{isEdit ? `Cập nhật thông tin cho tài khoản ${formData.username}` : 'Khởi tạo tài khoản mới cho nhân viên'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contract-form-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          
          <div className="form-main-section" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#EE0033" /> Thông tin cơ bản
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Họ và tên <span style={{ color: '#EE0033' }}>*</span></label>
                <input 
                  type="text" 
                  className="input-modern" 
                  value={formData.fullName} 
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tên đăng nhập (Username) <span style={{ color: '#EE0033' }}>*</span></label>
                <input 
                  type="text" 
                  className="input-modern" 
                  value={formData.username} 
                  onChange={e => setFormData({ ...formData, username: e.target.value })} 
                  required 
                  disabled={isEdit}
                />
              </div>
              <div className="form-group">
                <label>Email liên hệ <span style={{ color: '#EE0033' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    className="input-modern" 
                    style={{ paddingLeft: '36px' }}
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Đơn vị / Phòng ban</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    className="input-modern" 
                    style={{ paddingLeft: '36px' }}
                    value={formData.department} 
                    onChange={e => setFormData({ ...formData, department: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#EE0033" /> Bảo mật & Phân quyền
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Mật khẩu <span style={{ color: '#EE0033' }}>*</span></label>
                  <input 
                    type="password" 
                    className="input-modern" 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    required={!isEdit}
                  />
                </div>
                <div className="form-group">
                  <label>Vai trò hệ thống <span style={{ color: '#EE0033' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <select 
                      className="select-modern" 
                      style={{ paddingLeft: '36px', width: '100%' }}
                      value={formData.role} 
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-side-section">
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', display: 'block' }}>Trạng thái tài khoản</label>
              <select 
                className="select-modern" 
                style={{ width: '100%', marginBottom: '20px' }}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Hoạt động (Active)</option>
                <option value="Inactive">Tạm khóa (Inactive)</option>
              </select>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={14} color="#3b82f6" />
                  <strong>Lưu ý:</strong>
                </div>
                Tài khoản ở trạng thái <strong>Tạm khóa</strong> sẽ không thể đăng nhập và truy cập vào các tài nguyên của hệ thống ERP.
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', height: '44px', justifyContent: 'center' }}>
                <Save size={18} /> Lưu thay đổi
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
