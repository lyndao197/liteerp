import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Building, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Trash2,
  Check,
  AlertCircle,
  Calculator,
  Send
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const AcceptancePhaseForm = () => {
  const { parentId, phaseId } = useParams();
  const navigate = useNavigate();

  // Core states
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('Đợt nghiệm thu số 1 - Giai đoạn 1');
  const [value, setValue] = useState('0');
  const [penalty, setPenalty] = useState('0');
  const [status, setStatus] = useState('Bản nháp');
  const [notes, setNotes] = useState('');
  
  // Date and contract options
  const [selectedContractId, setSelectedContractId] = useState(parentId || '');
  const [productType, setProductType] = useState('Phát triển Phần mềm & Cổng Thông tin Web');
  const [period, setPeriod] = useState('Tháng 05/2026');
  const [fromDate, setFromDate] = useState('2026-05-01');
  const [toDate, setToDate] = useState('2026-05-31');

  // File Simulation State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [docStatus, setDocStatus] = useState('Tạm tính');
  const [slaDocStatus, setSlaDocStatus] = useState('Tạm tính');

  // SLA Penalty State
  const [slaList, setSlaList] = useState([]);
  const [selectedSla, setSelectedSla] = useState('SLA-01: Độ sẵn sàng của Hệ thống (Uptime SLA) (Gốc: 2%)');
  const [penaltyRateInput, setPenaltyRateInput] = useState('1.5');

  // Load contract and initial phase if editing
  useEffect(() => {
    const store = mockStore.getStore();
    const rawContract = store.contracts[parentId];
    if (rawContract) {
      setContract(rawContract);
    }

    if (phaseId) {
      const phase = store.acceptancePhases?.[phaseId];
      if (phase) {
        setName(phase.name || '');
        setValue(phase.value || '0');
        setPenalty(phase.penalty || '0');
        setStatus(phase.status || 'Bản nháp');
        setNotes(phase.notes || '');
        if (phase.fromDate) setFromDate(phase.fromDate);
        if (phase.toDate) setToDate(phase.toDate);
        if (phase.slaList) setSlaList(phase.slaList);
        if (phase.lineItems) {
          setLineItems(phase.lineItems);
          setUploadedFile(phase.uploadedFileName || 'File đã tải lên');
        }
      }
    }
  }, [parentId, phaseId]);

  // Recalculate values based on items and SLA
  const totals = useMemo(() => {
    const rawVal = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    
    // Sum SLA rates
    const totalSlaRate = slaList.reduce((acc, curr) => acc + (parseFloat(curr.rate) || 0), 0);
    const calculatedPenalty = Math.round(rawVal * (totalSlaRate / 100));
    const netTotal = rawVal - calculatedPenalty;

    return {
      value: new Intl.NumberFormat('en-US').format(rawVal),
      penalty: new Intl.NumberFormat('en-US').format(calculatedPenalty),
      netTotal: new Intl.NumberFormat('en-US').format(netTotal),
      rate: totalSlaRate
    };
  }, [value, slaList]);

  // Simulation handlers
  const handleLoadMockData = (type) => {
    if (type === 'dot1') {
      setUploadedFile('File_Khoi_Luong_Dot1.xlsx');
      setValue('1,200,000,000');
      setLineItems([
        { id: 1, desc: 'Setup hạ tầng, cài đặt Cluster & Cấu hình bảo mật OS', qty: 1, unit: 'Gói', price: '200,000,000', total: '200,000,000' },
        { id: 2, desc: 'Triển khai cấu phần core CoreERP & Module Quản trị tài chính', qty: 1, unit: 'Gói', price: '1,000,000,000', total: '1,000,000,000' }
      ]);
    } else if (type === 'dot2') {
      setUploadedFile('File_Khoi_Luong_Dot2_CongDon.xlsx');
      setValue('2,500,000,000');
      setLineItems([
        { id: 1, desc: 'Setup hạ tầng, cài đặt Cluster & Cấu hình bảo mật OS', qty: 1, unit: 'Gói', price: '200,000,000', total: '200,000,000' },
        { id: 2, desc: 'Triển khai cấu phần core CoreERP & Module Quản trị tài chính', qty: 1, unit: 'Gói', price: '1,000,000,000', total: '1,000,000,000' },
        { id: 3, desc: 'Phát triển Cổng thông tin Web Portal & Tích hợp SSO', qty: 1, unit: 'Gói', price: '1,300,000,000', total: '1,300,000,000' }
      ]);
    } else if (type === 'phatsinh') {
      setUploadedFile('Phieu_Phat_Sinh_SSO_BoSung.xlsx');
      setValue('300,000,000');
      setLineItems([
        { id: 1, desc: 'Cấu hình tích hợp bổ sung hệ thống định danh ngoài SSO', qty: 1, unit: 'Hạng mục', price: '300,000,000', total: '300,000,000' }
      ]);
    }
  };

  const handleAddSla = () => {
    const rate = parseFloat(penaltyRateInput);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Vui lòng nhập tỷ lệ phạt SLA hợp lệ từ 0% đến 100%');
      return;
    }

    const newSla = {
      id: `SLA-${Date.now()}`,
      name: selectedSla,
      rate: rate
    };

    setSlaList(prev => [...prev, newSla]);
    setPenaltyRateInput('0');
  };

  const handleDeleteSla = (id) => {
    setSlaList(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveAndSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Tên đợt nghiệm thu không được để trống');
      return;
    }

    const payload = {
      name,
      value: totals.value,
      penalty: totals.penalty,
      status: 'Trình ký', // Move to step 2/3
      notes,
      fromDate,
      toDate,
      slaList,
      lineItems,
      uploadedFileName: uploadedFile
    };

    if (phaseId) {
      mockStore.updateAcceptancePhase(phaseId, payload);
    } else {
      mockStore.createAcceptancePhase(parentId, payload);
    }

    navigate(`/acceptances/${parentId}`);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '120vh' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '14px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <button 
          onClick={() => navigate(`/acceptances/${parentId}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '8px', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
        >
          <ChevronLeft size={14} />
          <span>Về danh sách đợt (Hồ sơ cha)</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ color: '#94a3b8' }}>Mã đợt kế thừa:</span>
          <span style={{ fontWeight: 'bold', color: '#1e293b', fontFamily: 'monospace' }}>
            {phaseId ? phaseId.split('-').pop().substring(0, 8) : `NT-${new Date().getFullYear().toString().substring(2)}-${parentId.split('-').pop()}`}
          </span>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ border: 'none', borderBottom: '1px dashed #cbd5e1', fontSize: '13px', fontWeight: 'bold', color: '#1e293b', outline: 'none', width: '220px' }}
          />
        </div>
      </div>

      {/* Stepper Steps (3 Steps Progress Bar) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Step 1 */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderRight: '1px solid #e2e8f0', backgroundColor: '#fff1f2' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ed0029', color: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            1
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#9f1239' }}>Bước 1: Trích xuất & Lũy kế</h4>
            <p style={{ fontSize: '11px', color: '#f43f5e', marginTop: '2px' }}>Kế thừa hợp đồng, nạp nhiều tệp khối lượng & SLA</p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderRight: '1px solid #e2e8f0', opacity: 0.5 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', color: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            2
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Bước 2: Trình biên ký số</h4>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Nạp bản chính biên bản, phân quyền ký duyệt 3 cấp</p>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', opacity: 0.5 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', color: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            3
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Bước 3: Hóa đơn & Hiệu lực</h4>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Đính kèm hóa đơn VAT, đồng bộ lưu sổ cái kế toán</p>
          </div>
        </div>
      </div>

      {/* Main Gird Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Section 1: Thông tin Hợp đồng */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} style={{ color: '#ed0029' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Thông tin Hợp đồng & Đối tượng nghiệm thu</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>1.1 Chọn Hợp đồng áp dụng</label>
                <select 
                  value={selectedContractId} 
                  disabled 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: '#f1f5f9', outline: 'none' }}
                >
                  <option value={contract?.id || ''}>{contract ? `${contract.contractNo} - ${contract.customerName}` : ''}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>1.2 Loại hình sản phẩm</label>
                <select 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
                >
                  <option value="Phát triển Phần mềm & Cổng Thông tin Web">Phát triển Phần mềm & Cổng Thông tin Web</option>
                  <option value="Dịch vụ hạ tầng Cloud & Server">Dịch vụ hạ tầng Cloud & Server</option>
                  <option value="Cung cấp nhân sự thuê ngoài BPO">Cung cấp nhân sự thuê ngoài BPO</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>1.3 Kỳ / Tháng nghiệm thu</label>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
                >
                  <option value="Tháng 05/2026">Tháng 05/2026</option>
                  <option value="Tháng 06/2026">Tháng 06/2026</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>1.4 Từ ngày</label>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>1.5 Đến ngày</label>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} style={{ color: '#ed0029' }} />
              <span>Đối tác: <strong>{contract?.customerName}</strong>. Hợp đồng áp dụng đơn giá cố định. File tải lên phía dưới sẽ được so khớp trực tiếp để tính lũy tiến.</span>
            </div>
          </div>

          {/* Section 2: Upload File & Simulation */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={16} style={{ color: '#ed0029' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Tải lên File Tổng hợp Khối lượng Công việc</h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  if (lineItems.length === 0) {
                    alert('Vui lòng nạp file khối lượng trước khi tính tổng!');
                  } else {
                    alert(`Đã tính tổng khối lượng công việc thành công: ${totals.value} đ`);
                  }
                }}
                title="Tính tổng khối lượng"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '6px', 
                  border: '1px solid #cbd5e1', 
                  backgroundColor: '#f8fafc', 
                  color: '#475569', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#94a3b8';
                  e.currentTarget.style.color = '#ed0029';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <Calculator size={16} />
              </button>
            </div>

            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px', backgroundColor: '#fafafa' }}>
              <FileText size={40} style={{ color: '#cbd5e1' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', display: 'block' }}>Kéo thả file bảng tính khối lượng vào đây</span>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>hoặc nạp nhanh bằng các mẫu giả lập cước dưới đây</span>
              </div>

              {uploadedFile && (
                <div style={{ marginTop: '8px', padding: '4px 12px', backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={12} />
                  <span>{uploadedFile}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  type="button"
                  onClick={() => handleLoadMockData('dot1')}
                  style={{ padding: '8px 16px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Upload size={14} style={{ color: '#ed0029' }} />
                  <span>Nạp file khối lượng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Bảng xem trước */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} style={{ color: '#ed0029' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Bảng tính khối lượng</h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Đã gửi bảng tính khối lượng đến khách hàng thành công!")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ed0029',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(237,0,41,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d40025'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ed0029'}
                >
                  <Send size={12} />
                  <span>Gửi khách hàng</span>
                </button>
              </div>
              
              {/* Stepper: Tạm tính - Chờ KH confirm - Khóa */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Step 1: Tạm tính */}
                <div 
                  onClick={() => setDocStatus('Tạm tính')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: docStatus === 'Tạm tính' ? '#ed0029' : '#cbd5e1', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    1
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: docStatus === 'Tạm tính' ? 'bold' : '500', 
                    color: docStatus === 'Tạm tính' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Tạm tính
                  </span>
                </div>

                {/* Line 1 */}
                <div style={{ width: '20px', height: '2px', backgroundColor: (docStatus === 'Chờ KH confirm' || docStatus === 'Khóa') ? '#ed0029' : '#e2e8f0' }} />

                {/* Step 2: Chờ KH confirm */}
                <div 
                  onClick={() => setDocStatus('Chờ KH confirm')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: docStatus === 'Chờ KH confirm' ? '#ed0029' : (docStatus === 'Khóa' ? '#ed0029' : '#cbd5e1'), 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    2
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: docStatus === 'Chờ KH confirm' ? 'bold' : '500', 
                    color: docStatus === 'Chờ KH confirm' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Chờ KH confirm
                  </span>
                </div>

                {/* Line 2 */}
                <div style={{ width: '20px', height: '2px', backgroundColor: docStatus === 'Khóa' ? '#ed0029' : '#e2e8f0' }} />

                {/* Step 3: Khóa */}
                <div 
                  onClick={() => setDocStatus('Khóa')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: docStatus === 'Khóa' ? '#ed0029' : '#cbd5e1', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    3
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: docStatus === 'Khóa' ? 'bold' : '500', 
                    color: docStatus === 'Khóa' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Khóa
                  </span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '600px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <iframe 
                src="https://docspace-vit05h.onlyoffice.com/s/hsY76d9xKPX9cqF"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="OnlyOffice Spreadsheet"
                allow="autoplay; camera; microphone; display-capture"
              />
            </div>
          </div>

          {/* Section 4: SLA Penalty */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} style={{ color: '#ed0029' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Tổng hợp SLA/KPI hằng tháng</h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Đã gửi tổng hợp SLA/KPI đến khách hàng thành công!")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ed0029',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(237,0,41,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d40025'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ed0029'}
                >
                  <Send size={12} />
                  <span>Gửi khách hàng</span>
                </button>
              </div>

              {/* Stepper: Tạm tính - Chờ KH confirm - Khóa */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Step 1: Tạm tính */}
                <div 
                  onClick={() => setSlaDocStatus('Tạm tính')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: slaDocStatus === 'Tạm tính' ? '#ed0029' : '#cbd5e1', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    1
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: slaDocStatus === 'Tạm tính' ? 'bold' : '500', 
                    color: slaDocStatus === 'Tạm tính' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Tạm tính
                  </span>
                </div>

                {/* Line 1 */}
                <div style={{ width: '20px', height: '2px', backgroundColor: (slaDocStatus === 'Chờ KH confirm' || slaDocStatus === 'Khóa') ? '#ed0029' : '#e2e8f0' }} />

                {/* Step 2: Chờ KH confirm */}
                <div 
                  onClick={() => setSlaDocStatus('Chờ KH confirm')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: slaDocStatus === 'Chờ KH confirm' ? '#ed0029' : (slaDocStatus === 'Khóa' ? '#ed0029' : '#cbd5e1'), 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    2
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: slaDocStatus === 'Chờ KH confirm' ? 'bold' : '500', 
                    color: slaDocStatus === 'Chờ KH confirm' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Chờ KH confirm
                  </span>
                </div>

                {/* Line 2 */}
                <div style={{ width: '20px', height: '2px', backgroundColor: slaDocStatus === 'Khóa' ? '#ed0029' : '#e2e8f0' }} />

                {/* Step 3: Khóa */}
                <div 
                  onClick={() => setSlaDocStatus('Khóa')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: slaDocStatus === 'Khóa' ? '#ed0029' : '#cbd5e1', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}>
                    3
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: slaDocStatus === 'Khóa' ? 'bold' : '500', 
                    color: slaDocStatus === 'Khóa' ? '#ed0029' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                    Khóa
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>Chọn Chỉ số SLA/KPI</label>
                <select 
                  value={selectedSla}
                  onChange={(e) => setSelectedSla(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
                >
                  <option value="SLA-01: Độ sẵn sàng của Hệ thống (Uptime SLA) (Gốc: 2%)">SLA-01: Độ sẵn sàng của Hệ thống (Uptime SLA) (Gốc: 2%)</option>
                  <option value="SLA-02: Tỷ lệ khắc phục sự cố đúng hạn (Gốc: 1.5%)">SLA-02: Tỷ lệ khắc phục sự cố đúng hạn (Gốc: 1.5%)</option>
                  <option value="SLA-03: Chỉ số đo lường hài lòng KH (CSAT) (Gốc: 0.5%)">SLA-03: Chỉ số đo lường hài lòng KH (CSAT) (Gốc: 0.5%)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>Nhập tỷ lệ Phạt (?%)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={penaltyRateInput}
                    onChange={(e) => setPenaltyRateInput(e.target.value)}
                    style={{ width: '100%', padding: '10px 30px 10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>%</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleAddSla}
                style={{ padding: '10px 16px', backgroundColor: '#ed0029', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', height: '39px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Thêm phạt</span>
              </button>
            </div>

            {slaList.length === 0 ? (
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                Không ghi nhận lỗi vi phạm SLA/KPI trong tháng này. Tỷ lệ giảm trừ phạt bằng 0%.
              </div>
            ) : (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#475569' }}>
                  <thead style={{ backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>
                    <tr>
                      <th style={{ padding: '8px 16px' }}>Chỉ số SLA vi phạm</th>
                      <th style={{ padding: '8px 16px' }}>Tỷ lệ phạt</th>
                      <th style={{ padding: '8px 16px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slaList.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 16px', fontWeight: '600', color: '#334155' }}>{item.name}</td>
                        <td style={{ padding: '8px 16px', fontWeight: 'bold', color: '#e11d48' }}>{item.rate}%</td>
                        <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteSla(item.id)}
                            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Tổng hợp thực nhận */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
          
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', margin: 0, color: '#f8fafc' }}>
            Bảng tính tiền dự kiến thực nhận
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Tổng khối lượng công việc:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{totals.value} đ</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Tỷ suất phạt SLA khấu lũy ({totals.rate}%):</span>
              <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>-{totals.penalty} đ</span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>CÔNG THỨC ÁP DỤNG:</span>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Thực nhận = (Sản lượng x Đơn giá) - (Sản lượng x Đơn giá x %phạt)
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>TỔNG TIỀN DỰ KIẾN THỰC NHẬN</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{totals.netTotal} VND</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleSaveAndSubmit}
            style={{ width: '100%', padding: '12px', backgroundColor: '#ed0029', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 4px 6px rgba(237,0,41,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d40025'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ed0029'}
          >
            <span>Nộp khối lượng sang Bước 2 (Trình ký) →</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default AcceptancePhaseForm;
