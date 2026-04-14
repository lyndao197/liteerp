import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Download, CalendarDays, ChevronUp, ChevronDown, FileCheck2, Building2
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const BillingList = ({ billingType }) => {
  const navigate = useNavigate();
  const isInbound = billingType === 'in';

  // Time filter state
  const [viewMode, setViewMode] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'billingDate', direction: 'desc' });
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // --- INBOUND: Tất cả đơn hàng (doanh nghiệp ký với KH: VTT, VTP...) ---
  const inboundData = useMemo(() => {
    const orders = mockStore.getAllOrders();
    return orders
      .filter(o => o.orderStatus === 'Đang triển khai' || o.orderStatus === 'Hoàn thành')
      .map(o => {
        const contract = o.contractId ? mockStore.getContract(o.contractId) : null;
        return {
          id: o.id,
          billingNo: o.orderNo,
          counterpartyShort: contract?.shortName || '',
          counterpartyFull: contract?.customerName || '',
          contractNo: contract?.contractNo || '',
          serviceDesc: contract?.name || '',
          billingDate: o.orderDate,
          amount: o.totalAmount || 0,
          status: o.orderStatus,
          month: o.orderDate ? parseInt(o.orderDate.split('-')[1]) : 0,
          year: o.orderDate ? parseInt(o.orderDate.split('-')[0]) : 0,
          day: o.orderDate ? parseInt(o.orderDate.split('-')[2]) : 0,
          _orderId: o.id
        };
      });
  }, []);

  // --- OUTBOUND: Cước trả cho đối tác (GEM, Hoa Sao, Hoa Kim...) ---
  const outboundData = useMemo(() => {
    return mockStore.getAllPartnerBillings().map(pb => {
      const contract = pb.contractRef ? mockStore.getContract(pb.contractRef) : null;
      const d = pb.billingDate ? new Date(pb.billingDate) : null;
      return {
        ...pb,
        counterpartyShort: pb.partnerName,
        counterpartyFull: mockStore.getAllPartners().find(p => p.id === pb.partnerId)?.name || pb.partnerName,
        contractNo: contract?.contractNo || pb.contractRef || '',
        month: pb.month || (d ? d.getMonth() + 1 : 0),
        year: pb.year || (d ? d.getFullYear() : 0),
        day: d ? d.getDate() : 0
      };
    });
  }, []);

  const rawData = isInbound ? inboundData : outboundData;

  // Apply time filter + search + sort
  const filteredData = useMemo(() => {
    let result = [...rawData];

    if (searchTerm) {
      const low = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.billingNo?.toLowerCase().includes(low) ||
        r.counterpartyShort?.toLowerCase().includes(low) ||
        r.counterpartyFull?.toLowerCase().includes(low) ||
        r.contractNo?.toLowerCase().includes(low) ||
        r.serviceDesc?.toLowerCase().includes(low)
      );
    }

    result = result.filter(r => {
      if (viewMode === 'year') return r.year === selectedYear;
      if (viewMode === 'month') return r.year === selectedYear && r.month === selectedMonth;
      if (viewMode === 'day') return r.year === selectedYear && r.month === selectedMonth && r.day === selectedDay;
      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? '';
        const bVal = b[sortConfig.key] ?? '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [rawData, searchTerm, viewMode, selectedYear, selectedMonth, selectedDay, sortConfig]);

  const totalAmount = filteredData.reduce((s, r) => s + (r.amount || 0), 0);
  const selectedTotal = filteredData.filter(r => selectedIds.has(r.id)).reduce((s, r) => s + (r.amount || 0), 0);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length && filteredData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(r => r.id)));
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '0 ₫';
    return parseInt(val).toLocaleString('vi-VN') + ' ₫';
  };

  const SortIcon = ({ col }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '4px', verticalAlign: 'middle' }}>
      <ChevronUp size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'asc' ? 1 : 0.3, marginBottom: '-3px' }} />
      <ChevronDown size={11} style={{ opacity: sortConfig.key === col && sortConfig.direction === 'desc' ? 1 : 0.3 }} />
    </span>
  );

  const years = [2024, 2025, 2026, 2027];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();

  const periodLabel = viewMode === 'day'
    ? `Ngày ${selectedDay}/${selectedMonth}/${selectedYear}`
    : viewMode === 'month' ? `Tháng ${selectedMonth}/${selectedYear}` : `Năm ${selectedYear}`;

  return (
    <div className="contract-page-container">
      {/* Header */}
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>{isInbound ? 'Tính cước đầu vào' : 'Tính cước đối tác'}</h1>
          <p className="contract-subtitle">
            {isInbound
              ? 'Cước phí thu từ khách hàng (VTT, VTP...) — Tất cả đơn hàng đang triển khai & hoàn thành.'
              : 'Cước phí trả cho đối tác cung cấp dịch vụ (GEM, Hoa Sao, Hoa Kim...).'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="metric-cards-container">
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng bản ghi kỳ này</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{filteredData.length}</p>
            <span className="crm-card-indicator indicator-neutral">{periodLabel}</span>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Tổng cước phí</p>
          <div className="crm-card-body">
            <p className="crm-card-value" style={{ fontSize: '17px', color: isInbound ? '#16a34a' : '#e32b4c' }}>
              {formatCurrency(totalAmount)}
            </p>
            <span className={`crm-card-indicator ${isInbound ? 'indicator-up' : 'indicator-neutral'}`}>
              {isInbound ? 'Doanh thu' : 'Chi phí'}
            </span>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Đang triển khai</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{filteredData.filter(r => r.status === 'Đang triển khai').length}</p>
            <span className="crm-card-indicator indicator-neutral">bản ghi</span>
          </div>
        </div>
        <div className="crm-metric-card">
          <p className="crm-card-title">Hoàn thành</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{filteredData.filter(r => r.status === 'Hoàn thành').length}</p>
            <span className="crm-card-indicator indicator-up">bản ghi</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        <div className="toolbar-left" style={{ gap: '8px', flexWrap: 'wrap' }}>
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder={isInbound ? 'Tìm KH, mã ĐH...' : 'Tìm đối tác, mã cước...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Time mode toggle */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            {['day', 'month', 'year'].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: '6px 14px', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                background: viewMode === mode ? (isInbound ? '#16a34a' : '#e32b4c') : 'transparent',
                color: viewMode === mode ? 'white' : '#64748b'
              }}>
                {mode === 'day' ? 'Ngày' : mode === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>

          <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)} className="select-modern" style={{ minWidth: '90px' }}>
            {years.map(y => <option key={y} value={y}>Năm {y}</option>)}
          </select>

          {(viewMode === 'month' || viewMode === 'day') && (
            <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)} className="select-modern" style={{ minWidth: '100px' }}>
              {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
          )}

          {viewMode === 'day' && (
            <select value={selectedDay} onChange={e => setSelectedDay(+e.target.value)} className="select-modern" style={{ minWidth: '80px' }}>
              {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map(d =>
                <option key={d} value={d}>Ngày {d}</option>
              )}
            </select>
          )}
        </div>

        <div className="toolbar-right">
          <button className="btn-primary" onClick={() => setShowReconcileModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={18} /> Tạo đối soát
            {selectedIds.size > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '10px', padding: '1px 8px', fontSize: '12px' }}>{selectedIds.size}</span>}
          </button>
          <button className="btn-outline-brand">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input type="checkbox"
                  checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('billingNo')} style={{ cursor: 'pointer' }}>
                {isInbound ? 'Mã đơn hàng' : 'Mã cước'} <SortIcon col="billingNo" />
              </th>
              <th onClick={() => handleSort('counterpartyShort')} style={{ cursor: 'pointer' }}>
                {isInbound ? 'Khách hàng' : 'Đối tác'} <SortIcon col="counterpartyShort" />
              </th>
              <th onClick={() => handleSort('contractNo')} style={{ cursor: 'pointer' }}>
                Số hợp đồng <SortIcon col="contractNo" />
              </th>
              <th>Mô tả dịch vụ</th>
              <th onClick={() => handleSort('billingDate')} style={{ cursor: 'pointer' }}>
                Ngày cước <SortIcon col="billingDate" />
              </th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                Cước phí <SortIcon col="amount" />
              </th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map(r => (
              <tr
                key={r.id}
                onClick={() => isInbound && r._orderId && navigate(`/order/edit/${r._orderId}`)}
                className={selectedIds.has(r.id) ? 'row-selected' : ''}
                style={{ cursor: isInbound ? 'pointer' : 'default' }}
              >
                <td style={{ textAlign: 'center' }} onClick={e => { e.stopPropagation(); toggleSelect(r.id); }}>
                  <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} />
                </td>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>{r.billingNo}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: isInbound ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={14} color={isInbound ? '#16a34a' : '#e32b4c'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>{r.counterpartyShort}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.counterpartyFull}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#475569', fontSize: '13px' }}>{r.contractNo}</td>
                <td style={{ color: '#64748b', fontSize: '13px', maxWidth: '200px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.serviceDesc}</div>
                </td>
                <td style={{ color: '#475569' }}>{r.billingDate}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: isInbound ? '#16a34a' : '#e32b4c', fontSize: '14px' }}>
                  {isInbound ? '+' : '-'} {formatCurrency(r.amount)}
                </td>
                <td>
                  <span className={`status-badge-modern ${r.status === 'Hoàn thành' ? 'status-badge-green' : 'status-badge-yellow'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  <CalendarDays size={40} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.3 }} />
                  Không có dữ liệu cước phí trong kỳ đã chọn
                </td>
              </tr>
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td colSpan="6" style={{ padding: '12px 16px', color: '#475569' }}>
                  Tổng cộng ({filteredData.length} bản ghi{selectedIds.size > 0 ? ` — đã chọn ${selectedIds.size}` : ''})
                </td>
                <td style={{ textAlign: 'right', color: isInbound ? '#16a34a' : '#e32b4c', fontSize: '15px', padding: '12px 16px' }}>
                  {selectedIds.size > 0
                    ? `(${formatCurrency(selectedTotal)}) / ${formatCurrency(totalAmount)}`
                    : formatCurrency(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Reconciliation Modal */}
      {showReconcileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '500px', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                <FileCheck2 size={20} style={{ marginRight: '8px', color: isInbound ? '#16a34a' : '#e32b4c', verticalAlign: 'middle' }} />
                Tạo phiên đối soát — {isInbound ? 'Cước đầu vào' : 'Cước đầu ra'}
              </h3>
              <button onClick={() => setShowReconcileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Kỳ đối soát:</span>
                <span style={{ fontWeight: 600 }}>{periodLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Số bản ghi:</span>
                <span style={{ fontWeight: 600 }}>{selectedIds.size > 0 ? selectedIds.size : filteredData.length} bản ghi</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '8px' }}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Tổng cước phí:</span>
                <span style={{ fontWeight: 700, color: isInbound ? '#16a34a' : '#e32b4c' }}>
                  {formatCurrency(selectedIds.size > 0 ? selectedTotal : totalAmount)}
                </span>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Ghi chú đối soát</label>
              <textarea placeholder="Nhập ghi chú cho phiên đối soát này..." rows={3}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowReconcileModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#475569', fontWeight: 500 }}>
                Hủy
              </button>
              <button
                onClick={() => { alert('Đã tạo phiên đối soát thành công!'); setShowReconcileModal(false); }}
                style={{ padding: '10px 24px', background: isInbound ? '#16a34a' : '#e32b4c', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FileCheck2 size={16} /> Xác nhận đối soát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingList;
