/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send, Trash2, Plus, FileText } from 'lucide-react';
import './LeadForm.css';
import { mockStore } from '../utils/mockStore';

const INITIAL_QUOTE_LINES = [
  { id: Date.now(), description: '', qty: 1, unit: '', unitPrice: '', discount: 0 }
];

const QuoteForm = () => {
  const navigate = useNavigate();
  const { id: oppId } = useParams(); // opportunity id

  const [opportunity, setOpportunity] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState('Nháp');
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [note, setNote] = useState('');
  const [lines, setLines] = useState([
    { id: Date.now(), description: '', qty: 1, unit: '', unitPrice: '', discount: 0 }
  ]);

  const statuses = ['Nháp', 'Đã gửi', 'Đã xác nhận', 'Hủy'];

  // Load opportunity info to display name link
  useEffect(() => {
    if (oppId) {
      const opp = mockStore.getOpp(oppId);
      if (opp) {
        setOpportunity(opp);
      }
    }
  }, [oppId]);

  // ---- LINE HANDLERS ----
  const addLine = () => {
    setLines(prev => [
      ...prev,
      { id: Date.now(), description: '', qty: 1, unit: '', unitPrice: '', discount: 0 }
    ]);
  };

  const removeLine = (lineId) => {
    setLines(prev => prev.filter(l => l.id !== lineId));
  };

  const updateLine = (lineId, field, value) => {
    setLines(prev => prev.map(l => l.id === lineId ? { ...l, [field]: value } : l));
  };

  // ---- CALC ----
  const parseCurrency = (str) => {
    if (!str) return 0;
    return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
  };

  const calcLineTotal = (line) => {
    const price = parseCurrency(line.unitPrice);
    const qty = parseFloat(line.qty) || 0;
    const disc = parseFloat(line.discount) || 0;
    return qty * price * (1 - disc / 100);
  };

  const calcGrandTotal = () => {
    return lines.reduce((sum, l) => sum + calcLineTotal(l), 0);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // ---- SAVE ----
  const handleSave = () => {
    alert('Đã lưu Báo giá thành công!');
  };

  const handleSend = () => {
    setQuoteStatus('Đã gửi');
    alert('Đã gửi Báo giá cho khách hàng!');
  };

  return (
    <div className="lead-form-container">
      {/* HEADER */}
      <div className="lead-form-header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/opportunity')}>Danh sách Opportunity</span>
          <span className="breadcrumb-separator">/</span>
          {/* Link về opportunity với tên opportunity */}
          <span
            className="breadcrumb-item"
            style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate(`/opportunity/edit/${oppId}`)}
            title="Xem chi tiết Opportunity"
          >
            {opportunity ? opportunity.content : oppId}
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Báo giá mới</span>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto' }}>
          <div className="actions-left" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => navigate(`/opportunity/edit/${oppId}`)}
            >
              <ArrowLeft size={15} /> Về Opportunity
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1' }}
              onClick={handleSend}
            >
              <Send size={15} style={{ display: 'inline', marginRight: '4px' }} /> Gửi báo giá
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleSave}
            >
              <Save size={15} /> Lưu
            </button>
          </div>
        </div>
      </div>

      <div className="form-chatter-wrapper">
        <div className="lead-form-sheet sheet-inner-wrapper">

          {/* OPPORTUNITY LINK SECTION */}
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={18} color="#0284c7" />
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Cơ hội liên kết:&nbsp;
              <span
                style={{
                  color: '#0284c7',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px'
                }}
                onClick={() => navigate(`/opportunity/edit/${oppId}`)}
                title="Nhấn để xem chi tiết Opportunity"
              >
                {opportunity ? opportunity.content : oppId}
              </span>
              {opportunity && opportunity.company && (
                <span style={{ color: '#94a3b8', marginLeft: '8px', fontStyle: 'italic' }}>
                  — {opportunity.company}
                </span>
              )}
            </div>
          </div>

          {/* STATUS BAR */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div className="statusbar" style={{ background: 'transparent', margin: 0 }}>
              {statuses.map(st => (
                <div
                  key={st}
                  className={`statusbar-item ${quoteStatus === st ? 'active' : ''}`}
                  onClick={() => setQuoteStatus(st)}
                >
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* FORM MAIN */}
          <div className="sheet-main-content" style={{ alignItems: 'flex-start' }}>
            {/* LEFT COLUMN */}
            <div className="form-column">
              <div className="column-title" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Thông tin báo giá</div>

              <div className="form-group">
                <label className="form-label">Khách hàng</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={opportunity ? `${opportunity.company || ''}` : '—'}
                  style={{ background: '#f8fafc' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ngày báo giá <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={quoteDate}
                  onChange={e => setQuoteDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hiệu lực đến</label>
                <input
                  type="date"
                  className="form-control"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Điều khoản thanh toán</label>
                <select className="form-control" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
                  <option value="">-- Chọn --</option>
                  <option value="immediate">Thanh toán ngay</option>
                  <option value="15days">15 ngày</option>
                  <option value="30days">30 ngày</option>
                  <option value="45days">45 ngày</option>
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="form-column">
              <div className="column-title" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Thông tin thêm</div>

              <div className="form-group">
                <label className="form-label">Dịch vụ dự kiến</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={opportunity ? (
                    opportunity.projectedService === 'outsourcing' ? 'Kiểm soát / Nhập liệu' :
                    opportunity.projectedService === 'telesales' ? 'Telesales' :
                    opportunity.projectedService === 'cskh' ? 'Chăm sóc khách hàng' :
                    opportunity.projectedService || '—'
                  ) : '—'}
                  style={{ background: '#f8fafc' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Người phụ trách</label>
                <input type="text" className="form-control" readOnly value="Trần B (Bạn)" style={{ background: '#f8fafc' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="textarea-control"
                  placeholder="Ghi chú cho báo giá..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>
            </div>
          </div>

          {/* ORDER LINES TABLE */}
          <div style={{ marginTop: '24px' }}>
            <div className="column-title" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Chi tiết dòng báo giá</div>
            <table className="service-details-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: '200px' }}>Mô tả dịch vụ / sản phẩm</th>
                  <th style={{ width: '70px' }}>SL</th>
                  <th style={{ width: '80px' }}>ĐVT</th>
                  <th style={{ width: '140px' }}>Đơn giá (VNĐ)</th>
                  <th style={{ width: '80px' }}>Chiết khấu (%)</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Thành tiền</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map(line => (
                  <tr key={line.id}>
                    <td>
                      <input
                        type="text"
                        style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '13px' }}
                        placeholder="Nhập mô tả..."
                        value={line.description}
                        onChange={e => updateLine(line.id, 'description', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        style={{ border: 'none', outline: 'none', width: '100%', textAlign: 'center', background: 'transparent' }}
                        value={line.qty}
                        min="1"
                        onChange={e => updateLine(line.id, 'qty', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '13px', textAlign: 'center' }}
                        placeholder="Seat..."
                        value={line.unit}
                        onChange={e => updateLine(line.id, 'unit', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        style={{ border: 'none', outline: 'none', width: '100%', textAlign: 'right', background: 'transparent' }}
                        placeholder="0"
                        value={line.unitPrice}
                        onChange={e => updateLine(line.id, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        style={{ border: 'none', outline: 'none', width: '100%', textAlign: 'center', background: 'transparent' }}
                        value={line.discount}
                        onChange={e => updateLine(line.id, 'discount', e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '13px', color: '#0f172a', paddingRight: '8px' }}>
                      {formatCurrency(calcLineTotal(line))}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="icon-btn" onClick={() => removeLine(line.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="add-line-btn" onClick={addLine} style={{ marginTop: '8px' }}>
              <Plus size={14} style={{ display: 'inline', verticalAlign: 'sub' }} /> Thêm dòng
            </div>
          </div>

          {/* TOTALS */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '320px', borderTop: '2px solid #e2e8f0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                <span>Tổng chưa thuế:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(calcGrandTotal())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                <span>Thuế VAT (10%):</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(calcGrandTotal() * 0.1)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                borderTop: '2px solid #e2e8f0', fontSize: '15px', fontWeight: 700, color: '#0f172a'
              }}>
                <span>Tổng cộng:</span>
                <span style={{ color: '#e32b4c' }}>{formatCurrency(calcGrandTotal() * 1.1)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
