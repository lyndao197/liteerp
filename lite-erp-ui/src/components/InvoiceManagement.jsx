import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, ChevronUp, ChevronDown, FileText, ArrowDownToLine, ArrowUpFromLine, Filter } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const INVOICE_STATUS_CONFIG = {
  'Draft': { class: 'status-badge-gray', label: 'Nháp' },
  'Pending': { class: 'status-badge-blue', label: 'Chờ duyệt' },
  'Approved': { class: 'status-badge-green', label: 'Đã duyệt' },
  'Issued': { class: 'status-badge-green', label: 'Đã xuất' },
  'Rejected': { class: 'status-badge-red', label: 'Từ chối' }
};

export default function InvoiceManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceType, setInvoiceType] = useState('All'); // All, Inbound, Outbound
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Fake invoice data
  const [invoices] = useState([
    { id: 'INV-2026-001', type: 'Outbound', customer: 'Viettel Telecom', contract: 'HD/2026/001', amount: 450000000, date: '2026-04-10', status: 'Issued', creator: 'Nguyễn Văn A' },
    { id: 'INV-2026-002', type: 'Inbound', customer: 'FPT IS', contract: 'HD/2026/002', amount: 120000000, date: '2026-04-12', status: 'Pending', creator: 'Lê Thị B' },
    { id: 'INV-2026-003', type: 'Outbound', customer: 'Viettel Post', contract: 'HD/2026/003', amount: 850000000, date: '2026-04-14', status: 'Draft', creator: 'Nguyễn Văn A' },
    { id: 'INV-2026-004', type: 'Inbound', customer: 'CMC Telecom', contract: 'HD/2026/004', amount: 55000000, date: '2026-04-15', status: 'Approved', creator: 'Trần Văn C' },
  ]);

  const filtered = useMemo(() => {
    let r = [...invoices];
    if (searchTerm) {
      const l = searchTerm.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(l) || 
        x.customer.toLowerCase().includes(l) || 
        x.contract.toLowerCase().includes(l)
      );
    }
    if (invoiceType !== 'All') r = r.filter(x => x.type === invoiceType);
    if (filterStatus) r = r.filter(x => x.status === filterStatus);
    
    if (sortConfig.key && sortConfig.direction) {
      r.sort((a, b) => {
        const av = a[sortConfig.key] ?? '';
        const bv = b[sortConfig.key] ?? '';
        if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return r;
  }, [invoices, searchTerm, invoiceType, filterStatus, sortConfig]);

  const fmt = v => v.toLocaleString('vi-VN') + ' ₫';

  const handleSort = key => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  
  const SortIco = ({ col }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '4px', verticalAlign: 'middle' }}>
      <ChevronUp size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'asc' ? 1 : 0.3, marginBottom: '-3px' }} />
      <ChevronDown size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'desc' ? 1 : 0.3 }} />
    </span>
  );

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý hóa đơn</h1>
          <p className="contract-subtitle">Xem danh sách hóa đơn, tạo yêu cầu xuất hóa đơn đầu vào và đầu ra.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng hóa đơn</p>
          <div className="crm-card-body"><p className="crm-card-value">{invoices.length}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">HĐ Chờ duyệt</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{color: '#3b82f6'}}>{invoices.filter(i => i.status === 'Pending').length}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">HĐ Đã xuất (tháng)</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{color: '#16a34a'}}>{invoices.filter(i => i.status === 'Issued').length}</p></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng giá trị</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{fontSize: '16px'}}>{fmt(invoices.reduce((s, i) => s + i.amount, 0))}</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        <div className="toolbar-left" style={{ gap: '12px' }}>
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm số HĐ, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="select-modern" value={invoiceType} onChange={e => setInvoiceType(e.target.value)}>
            <option value="All">Tất cả loại HĐ</option>
            <option value="Inbound">HĐ Đầu vào</option>
            <option value="Outbound">HĐ Đầu ra</option>
          </select>
          <select className="select-modern" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.keys(INVOICE_STATUS_CONFIG).map(s => <option key={s} value={s}>{INVOICE_STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
        <div className="toolbar-right" style={{ gap: '12px' }}>
          <button className="btn-primary" onClick={() => navigate('/invoices/inbound/new')} style={{ background: '#1e293b' }}>
            <Plus size={18} /> Tạo yêu cầu HĐ đầu vào
          </button>
          <button className="btn-primary" onClick={() => navigate('/invoices/outbound/new')} style={{ background: '#e32b4c' }}>
             <Plus size={18} /> Tạo yêu cầu HĐ đầu ra
          </button>
          <button className="btn-outline-brand"><Download size={16} /> Xuất Excel</button>
        </div>
      </div>

      {/* List */}
      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>Số hóa đơn <SortIco col="id" /></th>
              <th>Loại HĐ</th>
              <th onClick={() => handleSort('customer')} style={{ cursor: 'pointer' }}>Đối tác/Khách hàng <SortIco col="customer" /></th>
              <th>Hợp đồng</th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('amount')}>Giá trị <SortIco col="amount" /></th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Ngày tạo <SortIco col="date" /></th>
              <th>Người tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>{inv.id}</td>
                <td>
                   <span style={{ 
                     padding: '2px 8px', 
                     borderRadius: '4px', 
                     fontSize: '11px', 
                     fontWeight: 600,
                     backgroundColor: inv.type === 'Inbound' ? '#fef3c7' : '#dcfce7',
                     color: inv.type === 'Inbound' ? '#92400e' : '#166534'
                   }}>
                     {inv.type === 'Inbound' ? 'Đầu vào' : 'Đầu ra'}
                   </span>
                </td>
                <td style={{ fontWeight: 500 }}>{inv.customer}</td>
                <td style={{ color: '#64748b' }}>{inv.contract}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(inv.amount)}</td>
                <td>{inv.date}</td>
                <td>{inv.creator}</td>
                <td>
                  <span className={`status-badge-modern ${INVOICE_STATUS_CONFIG[inv.status]?.class}`}>
                    {INVOICE_STATUS_CONFIG[inv.status]?.label}
                  </span>
                </td>
                <td>
                   <button className="btn-outline-brand" style={{ padding: '4px 8px', fontSize: '11px' }}>Chi tiết</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Không tìm thấy hóa đơn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
