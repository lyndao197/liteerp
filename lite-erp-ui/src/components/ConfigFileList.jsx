import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const STATUS_STYLE = {
  'Hiệu lực':       { bg: '#f0fdf4', text: '#15803d', dot: '#16a34a' },
  'Không hiệu lực': { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
};

export default function ConfigFileList() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState(() => mockStore.getAllConfigFiles());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return configs;
    const q = searchTerm.toLowerCase();
    return configs.filter(c =>
      (c.menu || '').toLowerCase().includes(q) ||
      (c.tenMau || c.name || '').toLowerCase().includes(q)
    );
  }, [configs, searchTerm]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xoá cấu hình này?')) return;
    mockStore.deleteConfigFile(id);
    setConfigs(mockStore.getAllConfigFiles());
  };

  const activeCount   = configs.filter(c => c.trangThai === 'Hiệu lực' || c.status === 'Hiệu lực').length;
  const inactiveCount = configs.length - activeCount;

  return (
    <div className="contract-page-container">
      {/* Header */}
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Cấu hình File</h1>
          <p className="contract-subtitle">Quản lý cấu hình file mẫu theo menu và loại chứng từ.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => navigate('/config-file/new')}>
            <Plus size={18} /> Tạo mới
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng cấu hình</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{configs.length}</p>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Đang hiệu lực</p>
          <div className="crm-card-body">
            <p className="crm-card-value" style={{ color: '#16a34a' }}>{activeCount}</p>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Không hiệu lực</p>
          <div className="crm-card-body">
            <p className="crm-card-value" style={{ color: '#94a3b8' }}>{inactiveCount}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm theo menu, tên mẫu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="toolbar-right">
          <span style={{ fontSize: '13px', color: '#64748b' }}>{filtered.length} kết quả</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', width: '60px' }}>STT</th>
              <th style={{ padding: '12px 16px', textAlign: 'left',   fontWeight: '600', color: '#475569' }}>Menu</th>
              <th style={{ padding: '12px 16px', textAlign: 'left',   fontWeight: '600', color: '#475569' }}>Tên mẫu</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', width: '140px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', width: '120px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  Không có dữ liệu cấu hình
                </td>
              </tr>
            ) : filtered.map((cfg, idx) => {
              const st = cfg.trangThai || cfg.status || 'Không hiệu lực';
              const stStyle = STATUS_STYLE[st] || STATUS_STYLE['Không hiệu lực'];
              return (
                <tr
                  key={cfg.id}
                  style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
                  onClick={() => navigate(`/config-file/edit/${cfg.id}`)}
                >
                  <td style={{ padding: '13px 16px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '13px 16px', color: '#1e293b', fontWeight: '500' }}>
                    {cfg.menu || <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                  <td style={{ padding: '13px 16px', color: '#374151' }}>
                    {cfg.tenMau || cfg.name || <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: stStyle.bg, color: stStyle.text }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stStyle.dot, flexShrink: 0 }} />
                      {st}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/config-file/edit/${cfg.id}`)}
                        title="Sửa"
                        style={{ padding: '5px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#2563eb', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Pencil size={13} /> Sửa
                      </button>
                      <button
                        onClick={e => handleDelete(e, cfg.id)}
                        title="Xoá"
                        style={{ padding: '5px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
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
