import React, { useState } from 'react';
import { Search, Plus, Mail, MessageSquare, Megaphone, Calendar, BarChart3, Play, Pause } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function MarketingCampaignList() {
  const [campaigns, setCampaigns] = useState(() => mockStore.getAllCampaigns());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Marketing Automation</h1>
          <p className="contract-subtitle">Quản lý và tự động hóa các chiến dịch tiếp thị đa kênh.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary">
            <Plus size={18} /> Tạo chiến dịch mới
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Chiến dịch đang chạy</p>
          <div className="crm-card-body"><p className="crm-card-value text-green-600">{campaigns.filter(c => c.status === 'Running').length}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng email đã gửi</p>
          <div className="crm-card-body"><p className="crm-card-value">1,200</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tỷ lệ mở trung bình</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{ color: '#3b82f6' }}>15%</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm tên chiến dịch..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Chiến dịch</th>
              <th>Loại</th>
              <th>Đối tượng khách hàng</th>
              <th>Thời gian</th>
              <th>Hiệu quả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {c.type === 'Email Marketing' ? <Mail size={14} color="#3b82f6" /> : <Megaphone size={14} color="#f59e0b" />}
                    {c.type}
                  </div>
                </td>
                <td>{c.target}</td>
                <td style={{ fontSize: '12px' }}>
                  {c.startDate} <span style={{ color: '#94a3b8' }}>→</span> {c.endDate}
                </td>
                <td>
                  <div style={{ fontSize: '11px' }}>Gửi: <strong>{c.sentCount}</strong></div>
                  <div style={{ fontSize: '11px' }}>Mở: <strong>{c.openRate}</strong></div>
                </td>
                <td>
                  <span className={`status-badge-modern ${c.status === 'Running' ? 'status-badge-green' : 'status-badge-gray'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {c.status === 'Running' ? <Pause size={16} color="#64748b" style={{ cursor: 'pointer' }} /> : <Play size={16} color="#16a34a" style={{ cursor: 'pointer' }} />}
                    <BarChart3 size={16} color="#3b82f6" style={{ cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
