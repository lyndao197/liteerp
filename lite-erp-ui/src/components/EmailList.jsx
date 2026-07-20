import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const STATUS_STYLE = {
  active: { bg: '#f0fdf4', text: '#15803d', dot: '#16a34a', label: 'Đang sử dụng' },
  inactive: { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8', label: 'Tạm ngưng' }
};

const CATEGORY_LABEL = {
  system: 'Hệ thống',
  notification: 'Thông báo',
  marketing: 'Tiếp thị'
};

export default function EmailList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(() => mockStore.getAllEmailTemplates());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return templates.filter(item => {
      const matchSearch = !q ||
        (item.code || '').toLowerCase().includes(q) ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.subject || '').toLowerCase().includes(q);
      const matchCategory = categoryFilter === 'all' || (item.category || '') === categoryFilter;
      const matchStatus = statusFilter === 'all' || (item.status || '') === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [templates, searchTerm, categoryFilter, statusFilter]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa mẫu email này?')) return;
    mockStore.deleteEmailTemplate(id);
    setTemplates(mockStore.getAllEmailTemplates());
  };

  const activeCount = templates.filter(item => item.status === 'active').length;
  const inactiveCount = templates.length - activeCount;

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý danh sách mẫu email</h1>
          <p className="contract-subtitle">Danh sách mẫu email hệ thống để gửi tự động cho người dùng.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => navigate('/email-config')}>
            <Plus size={18} /> Tạo mẫu email mới
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng mẫu email</p>
          <div className="crm-card-body"><p className="crm-card-value">{templates.length}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Đang sử dụng</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{ color: '#16a34a' }}>{activeCount}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tạm ngưng</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{ color: '#64748b' }}>{inactiveCount}</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px', gap: '12px' }}>
        <div className="toolbar-left" style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <div className="search-box-modern" style={{ flex: 1 }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên mẫu email, tiêu đề..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="select-modern" style={{ width: '180px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="system">Hệ thống</option>
            <option value="notification">Thông báo</option>
            <option value="marketing">Marketing</option>
          </select>

          <select className="select-modern" style={{ width: '170px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang sử dụng</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>
        <div className="toolbar-right">
          <span style={{ fontSize: '13px', color: '#64748b' }}>{filtered.length} kết quả</span>
        </div>
      </div>

      <div style={{ marginTop: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', width: '60px', textAlign: 'center', color: '#475569' }}>STT</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>Mã mẫu email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>Tên mẫu email</th>
              <th style={{ padding: '12px 16px', width: '120px', textAlign: 'center', color: '#475569' }}>Loại</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>Tiêu đề</th>
              <th style={{ padding: '12px 16px', width: '140px', textAlign: 'center', color: '#475569' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px', width: '160px', textAlign: 'center', color: '#475569' }}>Cập nhật</th>
              <th style={{ padding: '12px 16px', width: '140px', textAlign: 'center', color: '#475569' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu mẫu email</td>
              </tr>
            ) : filtered.map((item, idx) => {
              const st = STATUS_STYLE[item.status] || STATUS_STYLE.inactive;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '13px 16px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 600 }}>{item.code}</td>
                  <td style={{ padding: '13px 16px' }}>{item.name}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>{CATEGORY_LABEL[item.category] || item.category}</td>
                  <td style={{ padding: '13px 16px', color: '#334155' }}>{item.subject}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', background: st.bg, color: st.text, fontWeight: 500 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot }} />
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center', color: '#64748b' }}>{item.updatedAt || 'Không có'}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        onClick={() => navigate(`/email-config?id=${item.id}`)}
                        style={{ padding: '5px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', color: '#2563eb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Pencil size={13} /> Sửa
                      </button>
                      <button
                        onClick={e => handleDelete(e, item.id)}
                        style={{ padding: '5px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}