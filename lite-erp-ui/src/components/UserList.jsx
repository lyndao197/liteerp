import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ShieldCheck, Download, Upload, Filter } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const [users, setUsers] = useState(() => mockStore.getAllUsers());

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchTerm || 
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilters = Object.entries(filters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        const actual = String(u[key] || '').trim();
        return values.includes(actual);
      });
      return matchSearch && matchFilters;
    });
  }, [users, searchTerm, filters]);

  const handleToggleStatus = (e, id) => {
    e.stopPropagation();
    mockStore.toggleUserStatus(id);
    setUsers(mockStore.getAllUsers());
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      if (next.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: next };
    });
  };

  const getDistinctValues = (key) => {
    return [...new Set(users.map(u => u[key] || '').filter(Boolean))].sort();
  };

  const LABELS = {
    role: 'Vai trò',
    status: 'Trạng thái',
    department: 'Phòng ban',
    position: 'Chức danh'
  };

  const filterKeys = ['role', 'status', 'department', 'position'];

  const handleExport = () => {
    const cols = [
      'id','fullName','username','email','phone','department','position','managerId','isManager','leaveEndDate','leaveReason','role','status'
    ];
    const rows = users.map(u => cols.map(c => {
      const v = u[c];
      if (v === undefined || v === null) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    }).join(','));
    const csv = [cols.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setShowTemplateModal(true);
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [importError, setImportError] = useState('');

  const processFile = async (file) => {
    if (!file) throw new Error('Không có file');
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) throw new Error('File rỗng hoặc không có dữ liệu.');

    const splitRegex = /,(?=(?:[^\"]*\"[^\\\"]*\")*[^\\\"]*$)/;
    const rawHeaders = lines[0].split(splitRegex).map(h => h.replace(/^"|"$/g, '').trim());

    const headerMap = {
      'Người dùng': 'fullName', 'Username': 'username', 'Tên đăng nhập': 'username', 'Email': 'email',
      'Số điện thoại': 'phone', 'Chức danh': 'position', 'Phòng ban': 'department', 'Đơn vị/Phòng ban': 'department',
      'Quản lý trực tiếp': 'managerId', 'Vai trò': 'role', 'Lần đăng nhập cuối': 'lastLogin', 'Ngày hết hạn nghỉ': 'leaveEndDate',
      'Lý do nghỉ': 'leaveReason', 'Quản lý': 'isManager', 'Trạng thái': 'status'
    };

    const allowedKeys = ['id','fullName','username','email','phone','position','department','managerId','role','lastLogin','leaveEndDate','leaveReason','isManager','status'];

    const mappedHeaders = rawHeaders.map(h => {
      if (headerMap[h]) return headerMap[h];
      if (allowedKeys.includes(h)) return h;
      return null;
    });

    const unknowns = rawHeaders.filter((h, idx) => !mappedHeaders[idx]);
    if (unknowns.length) throw new Error('Header không hợp lệ: ' + unknowns.join(', '));

    const existing = mockStore.getAllUsers();
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(splitRegex).map(p => p.replace(/^"|"$/g, '').trim());
      if (parts.length === 0) continue;
      const row = {};
      mappedHeaders.forEach((key, idx) => {
        let v = parts[idx] || '';
        if (key === 'isManager') {
          v = String(v).toLowerCase();
          row[key] = (v === 'true' || v === '1' || v === 'yes');
        } else {
          row[key] = v;
        }
      });

      if (row.managerId) {
        const m = existing.find(u => u.username === row.managerId || u.fullName === row.managerId || u.id === row.managerId);
        row.managerId = m ? m.id : '';
      }

      const normalizedEmail = (row.email || row.username || '').trim();
      if (!normalizedEmail) {
        throw new Error(`Thiếu Email ở dòng ${i + 1}.`);
      }
      row.email = normalizedEmail;
      row.username = normalizedEmail;

      const id = row.id || mockStore.getNextUserId();
      mockStore.saveUser(id, Object.assign({ id }, row));
      imported++;
    }
    setUsers(mockStore.getAllUsers());
    return imported;
  };

  const handleFileSelect = (e) => {
    setImportError('');
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFile(f);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      setImportError('Vui lòng chọn file trước khi tải lên.');
      return;
    }
    try {
      const imported = await processFile(selectedFile);
      window.alert(`Đã nhập ${imported} người dùng.`);
      setShowTemplateModal(false);
      setSelectedFile(null);
      setImportError('');
    } catch (err) {
      setImportError(err.message || 'Lỗi khi đọc file.');
    }
  };

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  

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
      <div className="toolbar-row" style={{ marginTop: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 0', minWidth: 0, position: 'relative' }}>
            <div style={{ flex: '1 1 0', minWidth: 0, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tự do..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }}
              />
            </div>
            <button className="btn-search" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e03', color: 'white', height: '40px', padding: '0 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }} onClick={() => setShowAdvancedFilter(prev => !prev)}>
              <Filter size={16} /> Lọc nâng cao
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: 12, border: '1px solid #F43F5E', background: 'transparent', color: '#EF476F', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
              <Download size={16} /> Xuất Excel
            </button>
            <button onClick={handleImportClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: 12, border: 'none', background: '#EE0033', color: '#fff', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
              <Upload size={16} /> Nhập Excel
            </button>
          </div>
        </div>
        {showAdvancedFilter && (
          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100, width: '520px', textAlign: 'left', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>Lọc nâng cao</span>
              <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }} onClick={() => setShowAdvancedFilter(false)}>Đóng</button>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
              {filterKeys.map(key => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{LABELS[key]}</div>
                  <div style={{ maxHeight: '140px', overflowY: 'auto', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                    {getDistinctValues(key).length > 0 ? getDistinctValues(key).map(value => (
                      <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '6px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={filters[key]?.includes(value) || false} onChange={() => handleFilterChange(key, value)} />
                        <span>{value}</span>
                      </label>
                    )) : <div style={{ fontSize: '12px', color: '#94a3b8' }}>Không có dữ liệu</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 2000 }}>
          <div style={{ width: 640, maxWidth: '92%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 6px 24px rgba(16,24,40,0.2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: '2px dashed #F43F5E', borderRadius: 8, padding: 28, textAlign: 'center', color: '#EF476F' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Upload size={20} />
                  <div style={{ fontWeight: 600 }}>Upload file</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <input type="file" accept=".csv,.xlsx" onChange={handleFileSelect} />
                </div>
              </div>
              {importError && <div style={{ color: '#ef4444', fontWeight: 600 }}>Dữ liệu lỗi: {importError}</div>}
              
              <div style={{ textAlign: 'center', color: '#f97316' }}>Lưu ý: Hỗ trợ định dạng .csv, .xlsx (tối đa 10MB)</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 6 }}>
                <button onClick={() => { setShowTemplateModal(false); setSelectedFile(null); setImportError(''); }} style={{ padding: '8px 18px', borderRadius: 24, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Hủy</button>
                <button onClick={handleUploadClick} style={{ padding: '8px 18px', borderRadius: 24, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer' }}>Tải lên</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên nhân viên</th>
              <th>Tên đăng nhập</th>
              <th>Email liên hệ</th>
              <th>Số điện thoại</th>
              <th>Phòng ban</th>
              <th>Chức danh</th>
              <th>Quản lý trực tiếp</th>
              <th>Là quản lý</th>
              <th>Ngày hết hạn nghỉ</th>
              <th>Lý do nghỉ</th>
              <th>Vai trò hệ thống</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((u, idx) => (
              <tr key={u.id} onClick={() => navigate(`/user/edit/${u.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EE003310', color: '#EE0033', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {u.fullName.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.fullName}</div>
                  </div>
                </td>
                <td>{u.username || ''}</td>
                <td>{u.email}</td>
                <td>{u.phone || ''}</td>
                <td>{u.department || ''}</td>
                <td>{u.position || ''}</td>
                <td>{users.find(manager => manager.id === u.managerId)?.fullName || ''}</td>
                <td style={{ textAlign: 'center' }}>
                  {u.isManager ? <span style={{ background: '#f1f5f9', color: '#0f172a', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>Quản lý</span> : ''}
                </td>
                <td style={{ fontSize: '12px', color: '#0f172a' }}>{u.leaveEndDate || ''}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{u.leaveReason || ''}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                    <ShieldCheck size={14} color="#3b82f6" />
                    {u.role}
                  </div>
                </td>
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
                <td colSpan="13" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
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
