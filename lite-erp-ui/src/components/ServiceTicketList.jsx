import React, { useState } from 'react';
import { Search, Plus, MessageCircle, Clock, AlertTriangle, CheckCircle2, User, Filter } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function ServiceTicketList() {
  const [tickets, setTickets] = useState(() => mockStore.getAllTickets());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getPriorityStyle = (p) => {
    if (p === 'High') return { color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' };
    if (p === 'Medium') return { color: '#d97706', background: '#fffbeb', border: '1px solid #fef3c7' };
    return { color: '#059669', background: '#ecfdf5', border: '1px solid #d1fae5' };
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Hỗ trợ khách hàng (Ticketing)</h1>
          <p className="contract-subtitle">Tiếp nhận và xử lý các yêu cầu hỗ trợ kỹ thuật và nghiệp vụ.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary">
            <Plus size={18} /> Tạo ticket mới
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p className="crm-card-title">Ticket mới</p>
          <div className="crm-card-body"><p className="crm-card-value">{tickets.filter(t => t.status === 'Open').length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className="crm-card-title">Đang xử lý</p>
          <div className="crm-card-body"><p className="crm-card-value">{tickets.filter(t => t.status === 'In progress').length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <p className="crm-card-title">SLA đạt chuẩn</p>
          <div className="crm-card-body"><p className="crm-card-value">98.5%</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm tiêu đề, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="select-modern">
            <option>Tất cả độ ưu tiên</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Mã Ticket</th>
              <th>Tiêu đề yêu cầu</th>
              <th>Khách hàng</th>
              <th>Độ ưu tiên</th>
              <th>Ngày tạo</th>
              <th>Người xử lý</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: '#3b82f6' }}>#{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.title}</td>
                <td>{t.customerName}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    ...getPriorityStyle(t.priority)
                  }}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{t.createdDate}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={12} />
                    </div>
                    {t.assignedTo}
                  </div>
                </td>
                <td>
                  <span className={`status-badge-modern ${t.status === 'Open' ? 'status-badge-blue' : 'status-badge-yellow'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
