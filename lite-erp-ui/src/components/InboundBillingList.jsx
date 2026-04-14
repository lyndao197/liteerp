import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, ChevronUp, ChevronDown, Building2, UserCheck } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const STATUS_CONFIG = {
  'Nháp':         { class: 'status-badge-gray',   label: 'Nháp' },
  'Chờ xác nhận': { class: 'status-badge-blue',   label: 'Chờ xác nhận' },
  'Đã xác nhận':  { class: 'status-badge-green',  label: 'Đã xác nhận' },
  'Điều chỉnh':   { class: 'status-badge-yellow', label: 'Điều chỉnh' }
};

export default function InboundBillingList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState(2026);
  const [filterMonth, setFilterMonth] = useState(0); // 0 = all
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState(new Set());

  const allRecs = useMemo(() => mockStore.getAllInboundReconciliations(), []);
  const customers = useMemo(() => mockStore.getAllCustomers().filter(c => ['VTS', 'VTT', 'VTP'].includes(c.shortName) || c.shortName?.includes('Viettel')), []);

  const filtered = useMemo(() => {
    let r = [...allRecs];
    if (searchTerm) {
      const l = searchTerm.toLowerCase();
      r = r.filter(x => 
        x.reconcNo?.toLowerCase().includes(l) || 
        x.customerName?.toLowerCase().includes(l) || 
        x.contractNo?.toLowerCase().includes(l) ||
        x.shortName?.toLowerCase().includes(l)
      );
    }
    if (filterYear) r = r.filter(x => x.year === filterYear);
    if (filterMonth) r = r.filter(x => x.month === filterMonth);
    if (filterCustomer) r = r.filter(x => x.customerId === filterCustomer);
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
  }, [allRecs, searchTerm, filterYear, filterMonth, filterCustomer, filterStatus, sortConfig]);

  const totalGrand = filtered.reduce((s, r) => s + (r.grandTotal || 0), 0);
  const fmt = v => v ? parseInt(v).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  const handleSort = key => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const SortIco = ({ col }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '4px', verticalAlign: 'middle' }}>
      <ChevronUp size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'asc' ? 1 : 0.3, marginBottom: '-3px' }} />
      <ChevronDown size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'desc' ? 1 : 0.3 }} />
    </span>
  );

  const toggleSelect = id => {
    setSelectedIds(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Tính cước khách hàng — Đối soát khách hàng</h1>
          <p className="contract-subtitle">Quản lý và tổng hợp doanh thu đối soát cước phí với các khách hàng (VTS, VTT, VTP...).</p>
        </div>
      </div>

      {/* Summary */}
      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng phiên đối soát</p>
          <div className="crm-card-body"><p className="crm-card-value">{filtered.length}</p><span className="crm-card-indicator indicator-neutral">phiên</span></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Đã xác nhận</p>
          <div className="crm-card-body"><p className="crm-card-value">{filtered.filter(r => r.status === 'Đã xác nhận').length}</p><span className="crm-card-indicator indicator-up">phiên</span></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Chờ / Điều chỉnh</p>
          <div className="crm-card-body"><p className="crm-card-value">{filtered.filter(r => r.status === 'Chờ xác nhận' || r.status === 'Điều chỉnh').length}</p><span className="crm-card-indicator indicator-neutral">phiên</span></div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng doanh thu</p>
          <div className="crm-card-body"><p className="crm-card-value" style={{ fontSize: '16px', color: '#16a34a' }}>{fmt(totalGrand)}</p><span className="crm-card-indicator indicator-up">đã lọc</span></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        <div className="toolbar-left" style={{ gap: '8px', flexWrap: 'wrap' }}>
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm khách hàng, mã đối soát..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="select-modern" value={filterYear} onChange={e => setFilterYear(+e.target.value)} style={{ minWidth: '90px' }}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>Năm {y}</option>)}
          </select>
          <select className="select-modern" value={filterMonth} onChange={e => setFilterMonth(+e.target.value)} style={{ minWidth: '120px' }}>
            <option value={0}>Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
          <select className="select-modern" value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} style={{ minWidth: '130px' }}>
            <option value="">Tất cả khách hàng</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
          </select>
          <select className="select-modern" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <option value="">Tất cả trạng thái</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="toolbar-right">
          <button className="btn-primary" onClick={() => navigate('/billing/in/new')}>
            <Plus size={18} /> Tạo đối soát mới
          </button>
          <button className="btn-outline-brand"><Download size={16} /> Xuất Excel</button>
        </div>
      </div>

      {/* Table */}
      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}>
                <input type="checkbox" checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={() => selectedIds.size === filtered.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(filtered.map(r => r.id)))} />
              </th>
              <th onClick={() => handleSort('reconcNo')} style={{ cursor: 'pointer' }}>Mã đối soát <SortIco col="reconcNo" /></th>
              <th onClick={() => handleSort('customerName')} style={{ cursor: 'pointer' }}>Khách hàng <SortIco col="customerName" /></th>
              <th onClick={() => handleSort('month')} style={{ cursor: 'pointer' }}>Kỳ đối soát <SortIco col="month" /></th>
              <th>Hợp đồng</th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('slaScore')} >Điểm SLA <SortIco col="slaScore" /></th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('penaltyAmount')}>Tiền phạt KPI <SortIco col="penaltyAmount" /></th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('grandTotal')}>Tổng doanh thu <SortIco col="grandTotal" /></th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(r => (
              <tr key={r.id} onClick={() => navigate(`/billing/in/edit/${r.id}`)} style={{ cursor: 'pointer' }} className={selectedIds.has(r.id) ? 'row-selected' : ''}>
                <td style={{ textAlign: 'center' }} onClick={e => { e.stopPropagation(); toggleSelect(r.id); }}>
                  <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} />
                </td>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>{r.reconcNo}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={14} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>{r.shortName || r.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.customerName}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Tháng {r.month}/{r.year}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tạo: {r.createdDate}</div>
                </td>
                <td style={{ fontSize: '13px', color: '#475569' }}>{r.contractNo}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: r.slaScore >= 95 ? '#16a34a' : '#ca8a04' }}>{r.slaScore}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Điểm KPI</div>
                </td>
                <td style={{ textAlign: 'right', color: r.penaltyAmount > 0 ? '#e32b4c' : '#94a3b8', fontWeight: r.penaltyAmount > 0 ? 600 : 400 }}>
                  {r.penaltyAmount > 0 ? '- ' + fmt(r.penaltyAmount) : '—'}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>{fmt(r.grandTotal)}</td>
                <td>
                  <span className={`status-badge-modern ${STATUS_CONFIG[r.status]?.class || 'status-badge-gray'}`}>{r.status}</span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Không có dữ liệu đối soát khách hàng</td></tr>
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td colSpan="7" style={{ padding: '12px 16px', color: '#475569' }}>Tổng cộng ({filtered.length} phiên đối soát)</td>
                <td style={{ textAlign: 'right', color: '#16a34a', padding: '12px 16px', fontSize: '15px' }}>{fmt(totalGrand)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
