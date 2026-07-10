import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, User, Mail, Shield, Building2, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
    position: '',
    managerId: '',
    phone: '',
    leaveEndDate: '',
    leaveReason: '',
    isManager: false,
    status: 'Active',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const roles = mockStore.getAllRoles();
  const allUsers = mockStore.getAllUsers();
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

  useEffect(() => {
    if (isEdit) {
      const user = mockStore.getUser(id);
      if (user) setFormData({ ...user, username: user.email || '', password: '••••••••' });
    } else {
      setFormData(prev => ({ ...prev, id: mockStore.getNextUserId() }));
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, username: formData.email };
    mockStore.saveUser(formData.id, dataToSave);
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
                <label>Tên nhân viên</label>
                <input 
                  type="text" 
                  className="input-modern" 
                  value={formData.fullName} 
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
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
                    onChange={e => {
                      const nextEmail = e.target.value;
                      setFormData({ ...formData, email: nextEmail, username: nextEmail });
                    }} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phòng ban</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <select
                    className="select-modern"
                    style={{ width: '100%', paddingLeft: '46px', paddingRight: '30px', boxSizing: 'border-box' }}
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {DEPARTMENT_OPTIONS.map(department => <option key={department} value={department}>{department}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Chức danh</label>
                <select
                  className="select-modern"
                  value={formData.position}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="">-- Chọn chức danh --</option>
                  {POSITION_OPTIONS.map(position => <option key={position} value={position}>{position}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tên đăng nhập <span style={{ color: '#EE0033' }}>*</span></label>
                <input 
                  type="text" 
                  className="input-modern" 
                  value={formData.username} 
                  readOnly
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Chọn quản lý</label>
                <select
                  className="select-modern"
                  value={formData.managerId || ''}
                  onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                >
                  <option value="">-- Không có quản lý --</option>
                  {allUsers.filter(u => u.id !== formData.id).map(u => (
                    <option key={u.id} value={u.id}>{u.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ngày hết hạn nghỉ</label>
                <input
                  type="date"
                  className="input-modern"
                  value={formData.leaveEndDate}
                  onChange={e => setFormData({ ...formData, leaveEndDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ color: !formData.leaveEndDate ? '#94a3b8' : undefined }}>Lý do nghỉ</label>
                <textarea
                  className="input-modern"
                  rows={3}
                  value={formData.leaveReason}
                  onChange={e => setFormData({ ...formData, leaveReason: e.target.value })}
                  disabled={!formData.leaveEndDate}
                  placeholder={!formData.leaveEndDate ? 'Vui lòng nhập ngày hết hạn nghỉ trước' : ''}
                  style={{ background: !formData.leaveEndDate ? '#f1f5f9' : undefined, cursor: !formData.leaveEndDate ? 'not-allowed' : undefined }}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#EE0033" /> Bảo mật & Phân quyền
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Mật khẩu <span style={{ color: '#EE0033' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="input-modern" 
                      style={{ paddingRight: '108px' }}
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                      required={!isEdit}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        color: '#475569',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
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
                style={{ width: '100%', marginBottom: '12px' }}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Tạm khóa</option>
              </select>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={14} color="#3b82f6" />
                  <strong>Lưu ý:</strong>
                </div>
                Tài khoản ở trạng thái <strong>Tạm khóa</strong> sẽ không thể đăng nhập và truy cập vào các tài nguyên của hệ thống ERP.
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', height: '44px', justifyContent: 'center' }}>
                <Save size={18} /> {isEdit ? 'Lưu thay đổi' : 'Thêm người dùng'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
