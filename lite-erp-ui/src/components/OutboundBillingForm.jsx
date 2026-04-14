import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Send, CheckCircle2, XCircle, RefreshCw,
  Upload, Paperclip, Plus, Trash2, FileText, ChevronRight, X,
  Smile, Maximize2, MessageSquare, History, User, Download
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const STATUS_FLOW = ['Nháp', 'Chờ xác nhận', 'Đã xác nhận'];
const STATUS_COLORS = {
  'Nháp': { bg: '#f1f5f9', text: '#64748b', active: '#475569', border: '#cbd5e1' },
  'Chờ xác nhận': { bg: '#eff6ff', text: '#3b82f6', active: '#1d4ed8', border: '#3b82f6' },
  'Đã xác nhận': { bg: '#f0fdf4', text: '#16a34a', active: '#166534', border: '#16a34a' },
  'Điều chỉnh': { bg: '#fefce8', text: '#ca8a04', active: '#a16207', border: '#ca8a04' }
};

const INITIAL_REC = {
  reconcNo: '', partnerId: '', partnerName: '', partnerFullName: '',
  contractRef: '', contractNo: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(),
  status: 'Nháp', seatTableFileName: '',
  seatItems: [], penaltyItems: [], seatPrices: [],
  totalSeatsPayment: 0, totalPenalty: 0, totalAfterPenalty: 0,
  vatRate: 8, vatAmount: 0, grandTotal: 0,
  notes: '', createdDate: new Date().toISOString().split('T')[0], confirmedDate: ''
};

export default function OutboundBillingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [rec, setRec] = useState(INITIAL_REC);
  const [activeTab, setActiveTab] = useState('seat');
  const [partners, setPartners] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMode, setSendMode] = useState('draft');
  // Chatter state
  const [chatterTab, setChatterTab] = useState('notes');
  const [noteText, setNoteText] = useState('');
  const [chatterMessages, setChatterMessages] = useState([]);
  const [adjustCount, setAdjustCount] = useState(0);

  useEffect(() => {
    setPartners(mockStore.getAllPartners());
    if (id) {
      const existing = mockStore.getOutboundReconciliation(id);
      if (existing) {
        setRec(existing);
        setChatterMessages(existing.chatterMessages || []);
        setAdjustCount(existing.adjustCount || 0);
      }
    } else {
      const nextId = mockStore.getNextOutboundReconciliationId();
      const nextNo = mockStore.getNextOutboundReconciliationNo();
      const now = new Date();
      const initLog = {
        id: Date.now(), type: 'activity', author: 'Nguyễn Văn A',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
        time: now.toLocaleString('vi-VN'),
        actionLabel: 'Tạo mới', oldStatus: '', newStatus: 'Nháp',
        text: 'Tạo mới phiên đối soát'
      };
      setChatterMessages([initLog]);
      setRec(prev => ({ ...prev, id: nextId, reconcNo: nextNo }));
    }
  }, [id]);

  // Recalculate totals when seatPrices or penaltyItems change
  const computed = useMemo(() => {
    const totalSeats = rec.seatPrices.reduce((s, r) => s + (r.totalPayment || 0), 0);
    const totalPenalty = rec.penaltyItems.reduce((s, p) => s + (p.penaltyAmount || 0), 0);
    const afterPenalty = totalSeats - totalPenalty;
    const vat = Math.round(afterPenalty * (rec.vatRate || 8) / 100);
    const grand = afterPenalty + vat;
    return { totalSeats, totalPenalty, afterPenalty, vat, grand };
  }, [rec.seatPrices, rec.penaltyItems, rec.vatRate]);

  const fmt = v => v ? Math.round(v).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  const fmtNum = v => v ? parseFloat(v).toLocaleString('vi-VN') : '0';

  const addActivityLog = (action, oldStatus, newStatus, extraText = '') => {
    const now = new Date();
    const log = {
      id: Date.now(), type: 'activity',
      author: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
      time: now.toLocaleString('vi-VN'),
      actionLabel: action, oldStatus, newStatus,
      text: extraText || `${action}: ${oldStatus ? oldStatus + ' → ' : ''}${newStatus}`
    };
    setChatterMessages(prev => [log, ...prev]);
    return log;
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const msg = {
      id: Date.now(), type: 'note',
      author: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
      time: now.toLocaleString('vi-VN'),
      text: noteText.trim()
    };
    setChatterMessages(prev => [msg, ...prev]);
    setNoteText('');
  };

  const handleSave = (newStatus) => {
    const oldStatus = rec.status;
    const saveId = isEdit ? id : rec.id || mockStore.getNextOutboundReconciliationId();
    let newAdjustCount = adjustCount;

    // Auto-generate activity log
    let newMessages = [...chatterMessages];
    if (newStatus && newStatus !== oldStatus) {
      let action = newStatus;
      if (newStatus === 'Chờ xác nhận') action = oldStatus === 'Điều chỉnh' ? `Gửi lại lần ${newAdjustCount}` : 'Gửi xác nhận';
      if (newStatus === 'Đã xác nhận') action = 'Đối tác xác nhận';
      if (newStatus === 'Điều chỉnh') { newAdjustCount += 1; action = `Điều chỉnh lần ${newAdjustCount}`; }
      if (newStatus === 'Nháp') action = 'Lưu nháp';
      const now = new Date();
      const log = {
        id: Date.now(), type: 'activity',
        author: newStatus === 'Đã xác nhận' ? rec.partnerName || 'Đối tác' : 'Nguyễn Văn A',
        avatar: newStatus === 'Đã xác nhận'
          ? `https://api.dicebear.com/7.x/personas/svg?seed=${rec.partnerName}&backgroundColor=ffd5dc`
          : 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
        time: now.toLocaleString('vi-VN'),
        actionLabel: action, oldStatus, newStatus,
        text: `${action}: ${oldStatus} → ${newStatus}`
      };
      newMessages = [log, ...newMessages];
    }

    const payload = {
      ...rec,
      id: saveId,
      status: newStatus || rec.status,
      totalSeatsPayment: computed.totalSeats,
      totalPenalty: computed.totalPenalty,
      totalAfterPenalty: computed.afterPenalty,
      vatAmount: computed.vat,
      grandTotal: computed.grand,
      confirmedDate: newStatus === 'Đã xác nhận' ? new Date().toISOString().split('T')[0] : rec.confirmedDate,
      chatterMessages: newMessages,
      adjustCount: newAdjustCount
    };
    mockStore.saveOutboundReconciliation(saveId, payload);
    navigate('/billing/out');
  };

  const updateSeatItem = (idx, field, val) => {
    const items = [...rec.seatItems];
    items[idx] = { ...items[idx], [field]: isNaN(Number(val)) ? val : Number(val) };
    setRec(p => ({ ...p, seatItems: items }));
  };

  const addSeatItem = () => setRec(p => ({
    ...p, seatItems: [...p.seatItems, { id: Date.now(), zone: '', type: '', totalWork: 0, standardSeats: 25, seatsPayable: 0 }]
  }));

  const removeSeatItem = idx => setRec(p => ({ ...p, seatItems: p.seatItems.filter((_, i) => i !== idx) }));

  const updatePenalty = (idx, field, val) => {
    const items = [...rec.penaltyItems];
    items[idx] = { ...items[idx], [field]: isNaN(Number(val)) || field === 'content' || field === 'zone' || field === 'note' ? val : Number(val) };
    if (field === 'penaltyRate' || field === 'baseCost') {
      const rate = field === 'penaltyRate' ? Number(val) : items[idx].penaltyRate;
      const base = field === 'baseCost' ? Number(val) : items[idx].baseCost;
      items[idx].penaltyAmount = Math.round((base || 0) * (rate || 0) / 100);
    }
    setRec(p => ({ ...p, penaltyItems: items }));
  };

  const addPenalty = () => setRec(p => ({
    ...p, penaltyItems: [...p.penaltyItems, { id: Date.now(), content: '', zone: '', penaltyRate: 0, baseCost: 0, penaltyAmount: 0, note: '' }]
  }));

  const removePenalty = idx => setRec(p => ({ ...p, penaltyItems: p.penaltyItems.filter((_, i) => i !== idx) }));

  const updateSeatPrice = (idx, field, val) => {
    const items = [...rec.seatPrices];
    items[idx] = { ...items[idx], [field]: isNaN(Number(val)) || field === 'type' || field === 'zone' ? val : Number(val) };
    if (field === 'seatsPayable' || field === 'unitPrice') {
      const seats = field === 'seatsPayable' ? Number(val) : items[idx].seatsPayable;
      const price = field === 'unitPrice' ? Number(val) : items[idx].unitPrice;
      items[idx].totalPayment = Math.round((seats || 0) * (price || 0));
    }
    setRec(p => ({ ...p, seatPrices: items }));
  };

  const addSeatPrice = () => setRec(p => ({
    ...p, seatPrices: [...p.seatPrices, { id: Date.now(), type: '', zone: '', seatsPayable: 0, unitPrice: 0, totalPayment: 0 }]
  }));

  const removeSeatPrice = idx => setRec(p => ({ ...p, seatPrices: p.seatPrices.filter((_, i) => i !== idx) }));

  const handlePartnerChange = pid => {
    const p = partners.find(x => x.id === pid);
    setRec(prev => ({ ...prev, partnerId: pid, partnerName: p?.shortName || '', partnerFullName: p?.name || '' }));
  };

  const canSend = rec.status === 'Nháp' || rec.status === 'Điều chỉnh';
  const canConfirm = rec.status === 'Chờ xác nhận';
  const canAdjust = rec.status === 'Chờ xác nhận';
  const isLocked = rec.status === 'Đã xác nhận';

  const statusBarItems = rec.status === 'Điều chỉnh'
    ? ['Chờ xác nhận', 'Điều chỉnh']
    : STATUS_FLOW;

  const tdStyle = { padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#475569' };
  const thStyle = { padding: '10px', background: '#f8fafc', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' };
  const inputStyle = { border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', width: '100%', outline: 'none', background: isLocked ? '#f8fafc' : 'white' };

  return (
    <div className="customer-form-modern">
      {/* Header */}
      <div className="customer-form-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/billing/out')}>Tính cước đối tác</span>
          <span className="breadcrumb-item"> / </span>
          <span className="breadcrumb-current">{isEdit ? rec.reconcNo : 'Tạo mới đối soát'}</span>
        </div>
        <div className="header-actions">
          {canSend && (
            <>
              <button className="btn btn-secondary" onClick={() => handleSave('Nháp')} style={{ color: '#475569' }}>
                <Save size={15} /> Lưu nháp
              </button>
              <button className="btn btn-primary" onClick={() => { setSendMode('send'); setShowSendModal(true); }} style={{ background: '#3b82f6' }}>
                <Send size={15} /> Gửi xác nhận
              </button>
            </>
          )}
          {canConfirm && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(true)} style={{ color: '#ca8a04', borderColor: '#ca8a04' }}>
                <XCircle size={15} /> Điều chỉnh
              </button>
              <button className="btn btn-primary" onClick={() => handleSave('Đã xác nhận')} style={{ background: '#16a34a' }}>
                <CheckCircle2 size={15} /> Đối tác xác nhận
              </button>
            </>
          )}
          {isLocked && (
            <button
              className="btn btn-primary"
              onClick={() => {
                // Mock download — show alert simulating file generation
                const fileName = `Bien_ban_nghiem_thu_${rec.reconcNo}_T${rec.month}_${rec.year}.pdf`;
                alert(`Đang tải biên bản nghiệm thu: ${fileName}`);
              }}
              style={{ background: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={15} /> Tải biên bản nghiệm thu
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/billing/out')}>
            <ArrowLeft size={15} /> Quay lại
          </button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div style={{ margin: '0 32px 24px', background: 'white', padding: '16px 20px', borderRadius: '8px', display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
        {statusBarItems.map((st, idx) => {
          const currentIdx = statusBarItems.indexOf(rec.status);
          const isCurrent = st === rec.status;
          const isPast = idx < currentIdx;
          const cfg = STATUS_COLORS[st] || STATUS_COLORS['Nháp'];
          return (
            <React.Fragment key={st}>
              <div style={{
                flex: 1, padding: '10px 16px', borderRadius: '6px', textAlign: 'center',
                fontWeight: isCurrent ? 700 : 500, fontSize: '13px',
                background: isCurrent ? cfg.active : (isPast ? cfg.bg : '#f8fafc'),
                color: isCurrent ? 'white' : (isPast ? cfg.text : '#94a3b8'),
                border: `1px solid ${isCurrent ? cfg.border : '#e2e8f0'}`,
                transition: 'all 0.2s'
              }}>
                {st}
              </div>
              {idx < statusBarItems.length - 1 && <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Body */}
      <div className="customer-form-body">
        {/* Meta info */}
        <div className="form-section" style={{ marginBottom: '24px' }}>
          <h3 className="section-title">Thông tin đối soát</h3>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="form-group">
              <label>Mã đối soát</label>
              <input className="form-input" value={rec.reconcNo} readOnly style={{ background: '#f8fafc' }} />
            </div>
            <div className="form-group">
              <label>Đối tác <span style={{ color: 'red' }}>*</span></label>
              <select className="form-input" value={rec.partnerId} disabled={isLocked}
                onChange={e => handlePartnerChange(e.target.value)}>
                <option value="">— Chọn đối tác —</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.shortName} — {p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Số hợp đồng</label>
              <input className="form-input" value={rec.contractNo} readOnly={isLocked}
                onChange={e => setRec(p => ({ ...p, contractNo: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Tháng đối soát <span style={{ color: 'red' }}>*</span></label>
              <select className="form-input" value={rec.month} disabled={isLocked}
                onChange={e => setRec(p => ({ ...p, month: +e.target.value }))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Năm</label>
              <select className="form-input" value={rec.year} disabled={isLocked}
                onChange={e => setRec(p => ({ ...p, year: +e.target.value }))}>
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>VAT (%)</label>
              <input className="form-input" type="number" value={rec.vatRate} readOnly={isLocked}
                onChange={e => setRec(p => ({ ...p, vatRate: +e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Notebook Tabs */}
        <div className="notebook-container" style={{ marginBottom: '24px' }}>
          <div className="notebook-tabs">
            {[
              { key: 'seat', label: '📊 Bảng công Seat' },
              { key: 'penalty', label: '⚠️ Phí phạt dịch vụ' },
              { key: 'cost', label: '💰 Tổng chi phí thanh toán' }
            ].map(tab => (
              <button key={tab.key} className={`notebook-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="notebook-content">
            {/* TAB 1 - Bảng công Seat */}
            {activeTab === 'seat' && (
              <div>
                {/* File upload */}
                <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ fontWeight: 600, color: '#475569', marginBottom: '10px', fontSize: '14px' }}>
                    📎 Upload Bảng đối chiếu số liệu Công, Seats thanh toán
                  </div>
                  {rec.seatTableFileName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <FileText size={18} color="#3b82f6" />
                      <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 500 }}>{rec.seatTableFileName}</span>
                      {!isLocked && (
                        <button onClick={() => setRec(p => ({ ...p, seatTableFileName: '' }))} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', cursor: isLocked ? 'default' : 'pointer', gap: '8px' }}>
                      <Upload size={28} color="#94a3b8" />
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Kéo thả hoặc click để chọn file (.xlsx, .xls, .pdf)</span>
                      {!isLocked && <input type="file" accept=".xlsx,.xls,.pdf" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && setRec(p => ({ ...p, seatTableFileName: e.target.files[0].name }))} />}
                    </label>
                  )}
                </div>

                {/* Seat items table */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Chi tiết công Seat theo khu vực</h4>
                  {!isLocked && <button onClick={addSeatItem} style={{ background: '#e32b4c', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Thêm dòng</button>}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        {['STT', 'Khu vực', 'Loại Seat', 'Tổng công thanh toán', 'Quy định Seats/tháng', 'Quy đổi Seats TT', ''].map(h => (
                          <th key={h} style={{ ...thStyle, textAlign: h.includes('Tổng') || h.includes('Quy') ? 'right' : 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rec.seatItems.length > 0 ? rec.seatItems.map((si, idx) => (
                        <tr key={si.id || idx}>
                          <td style={{ ...tdStyle, textAlign: 'center', width: 40 }}>{idx + 1}</td>
                          <td style={tdStyle}><input style={inputStyle} value={si.zone} readOnly={isLocked} onChange={e => updateSeatItem(idx, 'zone', e.target.value)} /></td>
                          <td style={tdStyle}><input style={inputStyle} value={si.type} readOnly={isLocked} onChange={e => updateSeatItem(idx, 'type', e.target.value)} /></td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={si.totalWork} readOnly={isLocked} onChange={e => updateSeatItem(idx, 'totalWork', e.target.value)} /></td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={si.standardSeats} readOnly={isLocked} onChange={e => updateSeatItem(idx, 'standardSeats', e.target.value)} /></td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#0f172a' }}><input style={{ ...inputStyle, textAlign: 'right', fontWeight: 600 }} type="number" value={si.seatsPayable} readOnly={isLocked} onChange={e => updateSeatItem(idx, 'seatsPayable', e.target.value)} /></td>
                          <td style={tdStyle}>
                            {!isLocked && <button onClick={() => removeSeatItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e32b4c' }}><Trash2 size={14} /></button>}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Chưa có dữ liệu. Nhấn "+ Thêm dòng" để bắt đầu.</td></tr>
                      )}
                    </tbody>
                    {rec.seatItems.length > 0 && (
                      <tfoot>
                        <tr style={{ background: '#fef9c3' }}>
                          <td colSpan="5" style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>TỔNG</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                            {fmtNum(rec.seatItems.reduce((s, r) => s + (r.seatsPayable || 0), 0))}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2 - Phí phạt */}
            {activeTab === 'penalty' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Tổng hợp phí phạt dịch vụ</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>Phí phạt dựa trên biên bản xác nhận vi phạm KPI</p>
                  </div>
                  {!isLocked && <button onClick={addPenalty} style={{ background: '#e32b4c', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Thêm phạt</button>}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      {['STT', 'Nội dung vi phạm', 'Khu vực', 'Tỷ lệ % phạt', 'Chi phí TT (chưa VAT)', 'Tổng trừ thành tiền', 'Ghi chú', ''].map(h => (
                        <th key={h} style={{ ...thStyle, textAlign: ['Chi phí', 'Tổng'].some(k => h.includes(k)) ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rec.penaltyItems.length > 0 ? rec.penaltyItems.map((pi, idx) => (
                      <tr key={pi.id || idx}>
                        <td style={{ ...tdStyle, textAlign: 'center', width: 40 }}>{idx + 1}</td>
                        <td style={tdStyle}><input style={{ ...inputStyle, minWidth: 200 }} value={pi.content} readOnly={isLocked} onChange={e => updatePenalty(idx, 'content', e.target.value)} /></td>
                        <td style={tdStyle}><input style={inputStyle} value={pi.zone} readOnly={isLocked} onChange={e => updatePenalty(idx, 'zone', e.target.value)} /></td>
                        <td style={tdStyle}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" step="0.01" value={pi.penaltyRate} readOnly={isLocked} onChange={e => updatePenalty(idx, 'penaltyRate', e.target.value)} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={pi.baseCost} readOnly={isLocked} onChange={e => updatePenalty(idx, 'baseCost', e.target.value)} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#e32b4c' }}>{fmt(pi.penaltyAmount)}</td>
                        <td style={tdStyle}><input style={inputStyle} value={pi.note} readOnly={isLocked} onChange={e => updatePenalty(idx, 'note', e.target.value)} /></td>
                        <td style={tdStyle}>{!isLocked && <button onClick={() => removePenalty(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e32b4c' }}><Trash2 size={14} /></button>}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Không có phí phạt trong kỳ này.</td></tr>
                    )}
                  </tbody>
                  {rec.penaltyItems.length > 0 && (
                    <tfoot>
                      <tr style={{ background: '#fef2f2' }}>
                        <td colSpan="5" style={{ ...tdStyle, fontWeight: 700, color: '#e32b4c' }}>TỔNG PHÍ PHẠT</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#e32b4c' }}>{fmt(computed.totalPenalty)}</td>
                        <td colSpan="2" />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* TAB 3 - Tổng chi phí */}
            {activeTab === 'cost' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Bảng tính tổng chi phí thanh toán</h4>
                  {!isLocked && <button onClick={addSeatPrice} style={{ background: '#e32b4c', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Thêm loại seat</button>}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      {['STT', 'Khu vực', 'Loại Seat', 'Seats TT phí DV', 'Đơn giá Seats (đ)', 'Thành tiền Seats TT', ''].map(h => (
                        <th key={h} style={{ ...thStyle, textAlign: ['Seats', 'Đơn', 'Thành'].some(k => h.startsWith(k)) ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rec.seatPrices.length > 0 ? rec.seatPrices.map((sp, idx) => (
                      <tr key={sp.id || idx}>
                        <td style={{ ...tdStyle, textAlign: 'center', width: 40 }}>{idx + 1}</td>
                        <td style={tdStyle}><input style={inputStyle} value={sp.zone} readOnly={isLocked} onChange={e => updateSeatPrice(idx, 'zone', e.target.value)} /></td>
                        <td style={tdStyle}><input style={inputStyle} value={sp.type} readOnly={isLocked} onChange={e => updateSeatPrice(idx, 'type', e.target.value)} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={sp.seatsPayable} readOnly={isLocked} onChange={e => updateSeatPrice(idx, 'seatsPayable', e.target.value)} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={sp.unitPrice} readOnly={isLocked} onChange={e => updateSeatPrice(idx, 'unitPrice', e.target.value)} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{fmt(sp.totalPayment)}</td>
                        <td style={tdStyle}>{!isLocked && <button onClick={() => removeSeatPrice(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e32b4c' }}><Trash2 size={14} /></button>}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Chưa có dữ liệu. Thêm loại seat để tính.</td></tr>
                    )}
                  </tbody>
                </table>

                {/* Cost Summary */}
                <div style={{ maxWidth: '480px', marginLeft: 'auto' }}>
                  {[
                    { label: '1. Tổng thành tiền Seats thanh toán', value: computed.totalSeats, bold: false, color: '#0f172a' },
                    { label: '2. Tổng phí phạt dịch vụ', value: -computed.totalPenalty, bold: false, color: '#e32b4c' },
                    { label: '3. Tổng sau khi trừ phạt', value: computed.afterPenalty, bold: true, color: '#0f172a', borderTop: true },
                    { label: `4. VAT (${rec.vatRate}%)`, value: computed.vat, bold: false, color: '#475569' },
                    { label: '5. TỔNG CHI PHÍ THANH TOÁN', value: computed.grand, bold: true, large: true, color: '#e32b4c', borderTop: true }
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 16px',
                      borderTop: row.borderTop ? '2px solid #e2e8f0' : '1px solid #f1f5f9',
                      background: row.large ? '#fef2f2' : 'white',
                      borderRadius: row.large ? '6px' : 0
                    }}>
                      <span style={{ fontSize: row.large ? '14px' : '13px', fontWeight: row.bold ? 700 : 400, color: '#475569' }}>{row.label}</span>
                      <span style={{ fontSize: row.large ? '16px' : '14px', fontWeight: row.bold ? 700 : 600, color: row.color }}>
                        {row.value < 0 ? '- ' + fmt(-row.value) : fmt(row.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHATTER - Ghi chú & Lịch sử hoạt động */}
        <div className="notebook" style={{ marginTop: '8px' }}>
          <div className="notebook-tabs">
            <div
              className={`notebook-tab ${chatterTab === 'notes' ? 'active' : ''}`}
              onClick={() => setChatterTab('notes')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageSquare size={14} /> Ghi chú nội bộ
            </div>
            <div
              className={`notebook-tab ${chatterTab === 'activities' ? 'active' : ''}`}
              onClick={() => setChatterTab('activities')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <History size={14} /> Lịch sử hoạt động
            </div>
          </div>
          <div className="notebook-content">
            <div className="chatter-in-tab">
              {/* Note input box */}
              {chatterTab === 'notes' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <div className="chatter-avatar-small">
                    <img src="https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4" alt="Avatar" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="chatter-input-box">
                      <textarea
                        className="chatter-textarea"
                        placeholder="Nhập nội dung ghi chú nội bộ..."
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        onKeyDown={e => e.ctrlKey && e.key === 'Enter' && handleAddNote()}
                      />
                      <div className="chatter-input-toolbar">
                        <div className="chatter-toolbar-left">
                          <Smile size={18} className="chatter-toolbar-btn" />
                          <Paperclip size={18} className="chatter-toolbar-btn" />
                        </div>
                        <div className="chatter-toolbar-right">
                          <Maximize2 size={16} className="chatter-toolbar-btn" />
                        </div>
                      </div>
                    </div>
                    <button className="btn-log-odoo" onClick={handleAddNote}>Ghi nhận</button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="chatter-messages" style={{ display: 'flex', flexDirection: 'column' }}>
                {chatterMessages
                  .filter(m => chatterTab === 'notes' ? m.type === 'note' : m.type === 'activity')
                  .map(msg => (
                    <div key={msg.id} className="message-item-odoo">
                      <div
                        className="chatter-avatar-small"
                        style={{ borderRadius: msg.type === 'activity' ? '50%' : '8px', flexShrink: 0 }}
                      >
                        <img
                          src={msg.avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4'}
                          alt={msg.author}
                        />
                      </div>
                      <div className="message-content-wrapper" style={{ flex: 1 }}>
                        <div className="message-author-info">
                          <span className="message-author-name">{msg.author}</span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>&nbsp;–&nbsp;{msg.time}</span>
                          {msg.type === 'activity' && msg.actionLabel && (
                            <span style={{
                              marginLeft: '8px', fontSize: '11px', fontWeight: 600,
                              padding: '2px 8px', borderRadius: '10px',
                              background: msg.newStatus === 'Đã xác nhận' ? '#dcfce7'
                                : msg.newStatus === 'Điều chỉnh' ? '#fef9c3'
                                : msg.newStatus === 'Chờ xác nhận' ? '#eff6ff'
                                : '#f1f5f9',
                              color: msg.newStatus === 'Đã xác nhận' ? '#16a34a'
                                : msg.newStatus === 'Điều chỉnh' ? '#ca8a04'
                                : msg.newStatus === 'Chờ xác nhận' ? '#3b82f6'
                                : '#64748b'
                            }}>
                              {msg.actionLabel}
                            </span>
                          )}
                        </div>
                        <div className="message-body-odoo">
                          {msg.type === 'activity' && msg.oldStatus ? (
                            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', color: '#475569' }}>{msg.oldStatus}</span>
                              <span style={{ color: '#94a3b8' }}>→</span>
                              <span style={{ padding: '2px 8px', background: '#f0fdf4', borderRadius: '4px', color: '#16a34a', fontWeight: 600 }}>{msg.newStatus}</span>
                            </div>
                          ) : (
                            <div style={{ whiteSpace: 'pre-wrap', color: msg.type === 'activity' ? '#64748b' : '#334155', fontSize: '13px' }}>
                              {msg.text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
                {chatterMessages.filter(m => chatterTab === 'notes' ? m.type === 'note' : m.type === 'activity').length === 0 && (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '28px 0', fontSize: '13px' }}>
                    {chatterTab === 'notes' ? 'Chưa có ghi chú nào.' : 'Chưa có lịch sử hoạt động.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      {showSendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '440px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#0f172a' }}><Send size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: '#3b82f6' }} />Gửi đối soát đến đối tác</h3>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Đối tác:</span><span style={{ fontWeight: 600 }}>{rec.partnerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Kỳ:</span><span style={{ fontWeight: 600 }}>Tháng {rec.month}/{rec.year}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '8px' }}>
                <span style={{ fontWeight: 600 }}>Tổng chi phí:</span>
                <span style={{ fontWeight: 700, color: '#e32b4c' }}>{fmt(computed.grand)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSendModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Hủy</button>
              <button onClick={() => { setShowSendModal(false); handleSave('Chờ xác nhận'); }} style={{ padding: '10px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={15} /> Gửi xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject/Adjust Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '440px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ca8a04' }}><RefreshCw size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />Yêu cầu điều chỉnh</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '12px' }}>Đối tác không xác nhận. Vui lòng nhập lý do để gửi lại:</p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Nhập lý do điều chỉnh..."
              rows={3}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRejectModal(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Hủy</button>
              <button onClick={() => { setShowRejectModal(false); setRec(p => ({ ...p, notes: (p.notes ? p.notes + '\n' : '') + '[Điều chỉnh] ' + rejectNote })); handleSave('Điều chỉnh'); }}
                style={{ padding: '10px 24px', background: '#ca8a04', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={15} /> Chuyển Điều chỉnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
