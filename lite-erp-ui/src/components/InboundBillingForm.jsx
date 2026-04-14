import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Send, CheckCircle2, XCircle, RefreshCw,
  Upload, Paperclip, Plus, Trash2, FileText, ChevronRight, X,
  Smile, Maximize2, MessageSquare, History, Building2, Download, AlertTriangle
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
  reconcNo: '', customerId: '', customerName: '', shortName: '',
  contractNo: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(),
  status: 'Nháp',
  kpiItems: [
    { id: 1, category: '1. Tỷ lệ kết nối thành công', subCategory: 'Tổng đài 18008000_N2', definition: 'Tỷ lệ kết nối thành công tổng đài', calculation: '(Nghe/Tổng)*100', unit: '%', condition: '≥', target: '95%', result: '', evaluation: '' },
    { id: 2, category: '1. Tỷ lệ kết nối thành công', subCategory: 'First Call Nhánh 4 - Y tế', definition: 'Tỷ lệ xử lý thành công tại bàn ĐTV', calculation: '(Thành công/Tổng)*100', unit: '%', condition: '≥', target: '90%', result: '', evaluation: '' },
    { id: 3, category: '2. Mức độ hài lòng Khách hàng', subCategory: 'Mức độ hài lòng kênh FO', definition: 'Tỷ lệ khách hàng hài lòng', calculation: '(Hài lòng/Tổng đánh giá)*100', unit: '%', condition: '≥', target: '85', result: '', evaluation: '' }
  ],
  slaScore: 100,
  penaltyRate: 0, 
  seatItems: [
    { id: 1, description: 'Dịch vụ tổng đài 18008000', seats: 0, unitPrice: 0, total: 0 },
    { id: 2, description: 'Kiểm duyệt hồ sơ', seats: 0, unitPrice: 0, total: 0 }
  ],
  totalBeforePenalty: 0,
  penaltyAmount: 0,
  totalAfterPenalty: 0,
  vatRate: 8,
  vatAmount: 0,
  grandTotal: 0,
  notes: '', createdDate: new Date().toISOString().split('T')[0], confirmedDate: '',
  chatterMessages: []
};

// SLA Calculation Logic based on Screenshot
const calculateSlaPenalty = (score) => {
  if (score >= 95) return 0;
  const pointsBelow = 95 - score;
  if (score >= 90) return (pointsBelow * 0.02) / 100; // 0.02% per point
  if (score >= 80) return (pointsBelow * 0.05) / 100; // 0.05% per point
  if (score >= 70) return (pointsBelow * 0.1) / 100;  // 0.1% per point
  if (score >= 65) return (pointsBelow * 1.0) / 100;  // 1% per point
  return 8 / 100; // Over 8% penalty
};

export default function InboundBillingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [rec, setRec] = useState(INITIAL_REC);
  const [activeTab, setActiveTab] = useState('kpi');
  const [customers, setCustomers] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  
  // Chatter state
  const [chatterTab, setChatterTab] = useState('notes');
  const [noteText, setNoteText] = useState('');
  const [chatterMessages, setChatterMessages] = useState([]);

  useEffect(() => {
    setCustomers(mockStore.getAllCustomers().filter(c => c.shortName?.includes('Viettel') || ['VTS', 'VTT', 'VTP'].includes(c.shortName)));
    if (id) {
      const existing = mockStore.getInboundReconciliation(id);
      if (existing) {
        setRec(existing);
        setChatterMessages(existing.chatterMessages || []);
      }
    } else {
      const nextId = mockStore.getNextInboundReconciliationId();
      const nextNo = mockStore.getNextInboundReconciliationNo();
      const initLog = {
        id: Date.now(), type: 'activity', author: 'Nguyễn Văn A',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
        time: new Date().toLocaleString('vi-VN'),
        actionLabel: 'Tạo mới', oldStatus: '', newStatus: 'Nháp',
        text: 'Tạo mới phiên đối soát khách hàng'
      };
      setChatterMessages([initLog]);
      setRec(prev => ({ ...prev, id: nextId, reconcNo: nextNo, chatterMessages: [initLog] }));
    }
  }, [id]);

  // Recalculate totals
  const computed = useMemo(() => {
    const totalBefore = rec.seatItems.reduce((s, item) => s + (item.total || 0), 0);
    const penaltyRate = calculateSlaPenalty(rec.slaScore || 100);
    const penaltyAmount = Math.round(totalBefore * penaltyRate);
    const afterPenalty = totalBefore - penaltyAmount;
    const vat = Math.round(afterPenalty * (rec.vatRate || 8) / 100);
    const grand = afterPenalty + vat;
    return { totalBefore, penaltyRate, penaltyAmount, afterPenalty, vat, grand };
  }, [rec.seatItems, rec.slaScore, rec.vatRate]);

  const fmt = v => v ? Math.round(v).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  const fmtPct = v => (v * 100).toFixed(3) + '%';

  const handleSave = (newStatus) => {
    const oldStatus = rec.status;
    const saveId = isEdit ? id : rec.id;
    
    let newMessages = [...chatterMessages];
    if (newStatus && newStatus !== oldStatus) {
      const log = {
        id: Date.now(), type: 'activity',
        author: 'Nguyễn Văn A',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Admin&backgroundColor=b6e3f4',
        time: new Date().toLocaleString('vi-VN'),
        actionLabel: newStatus, oldStatus, newStatus,
        text: `Chuyển trạng thái: ${oldStatus} → ${newStatus}`
      };
      newMessages = [log, ...newMessages];
    }

    const payload = {
      ...rec,
      id: saveId,
      status: newStatus || rec.status,
      ...computed,
      chatterMessages: newMessages,
      confirmedDate: newStatus === 'Đã xác nhận' ? new Date().toISOString().split('T')[0] : rec.confirmedDate
    };
    mockStore.saveInboundReconciliation(saveId, payload);
    navigate('/billing/in');
  };

  const updateKpi = (idx, field, val) => {
    const items = [...rec.kpiItems];
    items[idx] = { ...items[idx], [field]: val };
    setRec(p => ({ ...p, kpiItems: items }));
  };

  const updateSeat = (idx, field, val) => {
    const items = [...rec.seatItems];
    const nVal = parseFloat(val) || 0;
    items[idx] = { ...items[idx], [field]: isNaN(nVal) || field === 'description' ? val : nVal };
    if (field === 'seats' || field === 'unitPrice') {
        const s = field === 'seats' ? nVal : items[idx].seats;
        const p = field === 'unitPrice' ? nVal : items[idx].unitPrice;
        items[idx].total = Math.round(s * p);
    }
    setRec(p => ({ ...p, seatItems: items }));
  };

  const addSeat = () => setRec(p => ({ ...p, seatItems: [...p.seatItems, { id: Date.now(), description: '', seats: 0, unitPrice: 0, total: 0 }]}));
  const removeSeat = idx => setRec(p => ({ ...p, seatItems: p.seatItems.filter((_, i) => i !== idx) }));

  const handleCustomerChange = cid => {
    const c = customers.find(x => x.id === cid);
    setRec(prev => ({ ...prev, customerId: cid, customerName: c?.name || '', shortName: c?.shortName || '' }));
  };

  const isLocked = rec.status === 'Đã xác nhận';
  const canSend = rec.status === 'Nháp' || rec.status === 'Điều chỉnh';
  const canConfirm = rec.status === 'Chờ xác nhận';

  const tdStyle = { padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#475569' };
  const thStyle = { padding: '10px', background: '#f8fafc', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' };
  const inputStyle = { border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', width: '100%', outline: 'none', background: isLocked ? '#f8fafc' : 'white' };

  return (
    <div className="customer-form-modern">
      <div className="customer-form-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/billing/in')}>Tính cước đầu vào</span>
          <span className="breadcrumb-item"> / </span>
          <span className="breadcrumb-current">{isEdit ? rec.reconcNo : 'Tạo mới đối soát KH'}</span>
        </div>
        <div className="header-actions">
           {canSend && (
            <>
              <button className="btn btn-secondary" onClick={() => handleSave('Nháp')}><Save size={15} /> Lưu nháp</button>
              <button className="btn btn-primary" onClick={() => setShowSendModal(true)} style={{ background: '#3b82f6' }}><Send size={15} /> Gửi xác nhận</button>
            </>
          )}
          {canConfirm && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(true)} style={{ color: '#ca8a04', borderColor: '#ca8a04' }}><XCircle size={15} /> Điều chỉnh</button>
              <button className="btn btn-primary" onClick={() => handleSave('Đã xác nhận')} style={{ background: '#16a34a' }}><CheckCircle2 size={15} /> Xác nhận đối soát</button>
            </>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/billing/in')}><ArrowLeft size={15} /> Quay lại</button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div style={{ margin: '0 32px 24px', background: 'white', padding: '16px 20px', borderRadius: '8px', display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
        {STATUS_FLOW.map((st, idx) => {
          const isCurrent = st === rec.status;
          const cfg = STATUS_COLORS[st] || STATUS_COLORS['Nháp'];
          return (
            <React.Fragment key={st}>
              <div style={{
                flex: 1, padding: '10px 16px', borderRadius: '6px', textAlign: 'center', fontWeight: isCurrent ? 700 : 500, fontSize: '13px',
                background: isCurrent ? cfg.active : '#f8fafc', color: isCurrent ? 'white' : '#94a3b8', border: `1px solid ${isCurrent ? cfg.border : '#e2e8f0'}`
              }}>{st}</div>
              {idx < STATUS_FLOW.length - 1 && <ChevronRight size={16} color="#cbd5e1" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="customer-form-body">
        <div className="form-section" style={{ marginBottom: '24px' }}>
          <h3 className="section-title">Thông tin chung</h3>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="form-group">
              <label>Mã đối soát</label>
              <input className="form-input" value={rec.reconcNo} readOnly style={{ background: '#f8fafc' }} />
            </div>
            <div className="form-group">
              <label>Khách hàng <span style={{ color: 'red' }}>*</span></label>
              <select className="form-input" value={rec.customerId} disabled={isLocked} onChange={e => handleCustomerChange(e.target.value)}>
                <option value="">— Chọn đối tác —</option>
                {customers.map(p => <option key={p.id} value={p.id}>{p.shortName} — {p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Kỳ đối soát</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-input" value={rec.month} disabled={isLocked} onChange={e => setRec(p => ({ ...p, month: +e.target.value }))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                </select>
                <select className="form-input" value={rec.year} disabled={isLocked} onChange={e => setRec(p => ({ ...p, year: +e.target.value }))}>
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="notebook-container" style={{ marginBottom: '24px' }}>
          <div className="notebook-tabs">
            <button className={`notebook-tab ${activeTab === 'kpi' ? 'active' : ''}`} onClick={() => setActiveTab('kpi')}>📋 Đánh giá KPI</button>
            <button className={`notebook-tab ${activeTab === 'sla' ? 'active' : ''}`} onClick={() => setActiveTab('sla')}>⚖️ Chấm điểm SLA</button>
            <button className={`notebook-tab ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>💰 Bảng Tính Cước</button>
          </div>

          <div className="notebook-content">
            {activeTab === 'kpi' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>STT</th>
                      <th style={thStyle}>Chỉ tiêu</th>
                      <th style={thStyle}>Cách tính</th>
                      <th style={thStyle}>KPI Mục tiêu</th>
                      <th style={thStyle}>Kết quả</th>
                      <th style={thStyle}>Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.kpiItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>{item.subCategory}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.category}</div>
                        </td>
                        <td style={tdStyle}>{item.calculation}</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{item.condition} {item.target}</td>
                        <td style={tdStyle}><input style={inputStyle} value={item.result} readOnly={isLocked} onChange={e => updateKpi(idx, 'result', e.target.value)} placeholder="Nhập kết quả..." /></td>
                        <td style={tdStyle}>
                          <select style={inputStyle} value={item.evaluation} disabled={isLocked} onChange={e => updateKpi(idx, 'evaluation', e.target.value)}>
                            <option value="">— Đánh giá —</option>
                            <option value="Đạt">✅ Đạt</option>
                            <option value="Không đạt">❌ Không đạt</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'sla' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '16px' }}>Xác nhận điểm SLA tháng</h4>
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>TỔNG ĐIỂM SLA ĐẠT ĐƯỢC</div>
                    <input 
                       type="number" 
                       value={rec.slaScore} 
                       onChange={e => setRec(p => ({ ...p, slaScore: parseFloat(e.target.value) || 0 }))} 
                       readOnly={isLocked}
                       style={{ fontSize: '48px', fontWeight: 800, color: rec.slaScore >= 95 ? '#16a34a' : '#e32b4c', background: 'transparent', border: 'none', borderBottom: '2px solid #cbd5e1', textAlign: 'center', width: '120px', outline: 'none' }}
                    />
                    <div style={{ marginTop: '12px' }}>
                      <span className={`status-badge-modern ${rec.slaScore >= 95 ? 'status-badge-green' : 'status-badge-yellow'}`}>
                        Xếp loại: {rec.slaScore >= 95 ? 'Tốt' : rec.slaScore >= 85 ? 'Khá' : rec.slaScore >= 75 ? 'Trung bình' : 'Yếu'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '24px', padding: '16px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7', display: 'flex', gap: '12px' }}>
                    <AlertTriangle size={20} color="#ca8a04" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#92400e', fontSize: '13px' }}>Phạt vi phạm KPI ({fmtPct(computed.penaltyRate)})</div>
                      <div style={{ fontSize: '12px', color: '#b45309' }}>Dựa trên quy định trừ cước thanh toán của hợp đồng khi chỉ tiêu SLA không đạt ngưỡng 95 điểm.</div>
                    </div>
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '32px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Chế tài phạt (Tham chiếu)</h4>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                    <tbody>
                        {[
                            { range: '95 - 100', text: 'Không trừ phí' },
                            { range: '90 - <95', text: 'Trừ 0.02% phí / 1 điểm trừ' },
                            { range: '80 - <90', text: 'Trừ 0.05% phí / 1 điểm trừ' },
                            { range: '70 - <80', text: 'Trừ 0.1% phí / 1 điểm trừ' },
                            { range: '65 - <70', text: 'Trừ 1% phí / 1 điểm trừ' },
                            { range: '< 65', text: 'Trừ 8% tổng giá trị hợp đồng' }
                        ].map((row, i) => (
                            <tr key={i}>
                                <td style={{ padding: '6px 0', color: '#64748b' }}>{row.range} điểm:</td>
                                <td style={{ padding: '6px 0', fontWeight: 600, textAlign: 'right' }}>{row.text}</td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>Chi tiết dịch vụ thanh toán</h4>
                    {!isLocked && <button className="btn btn-secondary" onClick={addSeat} style={{ padding: '4px 12px' }}><Plus size={14} /> Thêm dòng</button>}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                   <thead>
                     <tr>
                       <th style={thStyle}>Nội dung dịch vụ</th>
                       <th style={{ ...thStyle, textAlign: 'right' }}>Số lượng/Seats</th>
                       <th style={{ ...thStyle, textAlign: 'right' }}>Đơn giá (đ)</th>
                       <th style={{ ...thStyle, textAlign: 'right' }}>Thành tiền</th>
                       {!isLocked && <th style={thStyle}></th>}
                     </tr>
                   </thead>
                   <tbody>
                     {rec.seatItems.map((item, idx) => (
                       <tr key={item.id}>
                         <td style={tdStyle}><input style={inputStyle} value={item.description} readOnly={isLocked} onChange={e => updateSeat(idx, 'description', e.target.value)} /></td>
                         <td style={{ ...tdStyle, width: '120px' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={item.seats} readOnly={isLocked} onChange={e => updateSeat(idx, 'seats', e.target.value)} /></td>
                         <td style={{ ...tdStyle, width: '150px' }}><input style={{ ...inputStyle, textAlign: 'right' }} type="number" value={item.unitPrice} readOnly={isLocked} onChange={e => updateSeat(idx, 'unitPrice', e.target.value)} /></td>
                         <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, width: '150px' }}>{fmt(item.total)}</td>
                         {!isLocked && (
                           <td style={{ ...tdStyle, width: '40px', textAlign: 'center' }}>
                             <button onClick={() => removeSeat(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                           </td>
                         )}
                       </tr>
                     ))}
                   </tbody>
                </table>

                <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#64748b', fontSize: '13px' }}>
                        <span>Tổng chi phí dịch vụ:</span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{fmt(computed.totalBefore)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#e32b4c', fontSize: '13px' }}>
                        <span>Phạt rớt SLA ({rec.slaScore} điểm):</span>
                        <span style={{ fontWeight: 600 }}>- {fmt(computed.penaltyAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #e2e8f0', marginTop: '4px' }}>
                        <span style={{ fontWeight: 700 }}>Tổng trước thuế:</span>
                        <span style={{ fontWeight: 800, color: '#111827' }}>{fmt(computed.afterPenalty)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#64748b', fontSize: '13px' }}>
                        <span>VAT ({rec.vatRate}%):</span>
                        <span style={{ fontWeight: 600 }}>{fmt(computed.vat)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f0fdf4', borderRadius: '8px', marginTop: '8px', border: '1px solid #dcfce7' }}>
                        <span style={{ fontWeight: 700, color: '#166534' }}>TỔNG THANH TOÁN:</span>
                        <span style={{ fontWeight: 900, fontSize: '18px', color: '#166534' }}>{fmt(computed.grand)}</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHATTER SECTION (Copied from Partner logic) */}
        <div className="notebook" style={{ marginTop: '8px' }}>
          <div className="notebook-tabs">
            <div className={`notebook-tab ${chatterTab === 'notes' ? 'active' : ''}`} onClick={() => setChatterTab('notes')}><MessageSquare size={14} /> Ghi chú</div>
            <div className={`notebook-tab ${chatterTab === 'activities' ? 'active' : ''}`} onClick={() => setChatterTab('activities')}><History size={14} /> Lịch sử</div>
          </div>
          <div className="notebook-content">
             {/* Simplified Chatter implementation to save space here */}
             <div className="chatter-messages" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {chatterMessages.filter(m => chatterTab === 'notes' ? m.type === 'note' : m.type === 'activity').map(msg => (
                    <div key={msg.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', padding: '8px', borderRadius: '6px', background: '#f8fafc' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>U</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ fontWeight: 700, fontSize: '12px' }}>{msg.author}</span>
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{msg.time}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#475569' }}>{msg.text}</div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showSendModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px' }}>
            <h3>Gửi đối soát cho Khách hàng</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Xác nhận gửi hồ sơ tính cước tháng {rec.month}/{rec.year} của {rec.shortName} để khách hàng phê duyệt?</p>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={() => { setShowSendModal(false); handleSave('Chờ xác nhận'); }}>Xác nhận gửi</button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay">
           <div className="modal-content" style={{ width: '400px' }}>
            <h3 style={{ color: '#ca8a04' }}>Yêu cầu điều chỉnh</h3>
            <textarea 
               value={rejectNote} 
               onChange={e => setRejectNote(e.target.value)} 
               placeholder="Nhập lý do khách hàng phản hồi..." 
               style={{ width: '100%', height: '80px', marginTop: '12px', padding: '8px' }}
            />
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Hủy</button>
              <button className="btn btn-primary" style={{ background: '#ca8a04' }} onClick={() => { setShowRejectModal(false); handleSave('Điều chỉnh'); }}>Gửi yêu cầu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
