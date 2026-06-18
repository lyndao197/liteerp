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
import KpiSlaBlock, { calcSLAPenaltyRate } from './blocks/KpiSlaBlock';

// SPDV options đồng bộ với ConfigFileForm
const SPDV_OPTIONS = [
  'Dịch vụ viễn thông', 'Dịch vụ CNTT', 'Giải pháp doanh nghiệp',
  'Phần mềm ERP', 'Dịch vụ bảo trì', 'Hạ tầng mạng',
  'Cloud Services', 'Thiết bị đầu cuối',
];

// Menu này tương ứng với màn hình Quản lý nghiệm thu
const ACCEPTANCE_MENU = 'Quản lý nghiệm thu';

// 2 loại chứng từ mặc định luôn hiển thị
const DEFAULT_DOC_TYPES = ['Biên bản nghiệm thu', 'Bảng XN số Seat'];

/* ─────────────────────────────────────────────────────────
   Modal: Cấu hình biên bản
───────────────────────────────────────────────────────── */
function ConfigBienBanModal({ configModal, configFieldValues, setConfigFieldValues, onSave, onClose }) {
  if (!configModal) return null;
  const { row, config } = configModal;
  const activeFields = (config?.cauHinhTruong || []).filter(f => f.trangThai);
  const sorted = [...activeFields].sort((a, b) => Number(a.stt) - Number(b.stt));
  const v = configFieldValues;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#fff1f2', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ed0029', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>✏</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#9f1239' }}>Cấu hình biên bản</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#f87171' }}>{row.loaiChungTu}{config ? ` — ${config.tenMau}` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '22px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {/* Body: 2 cột */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '380px 1fr' }}>

          {/* ── Cột trái: Form nhập liệu ── */}
          <div style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '4px', height: '18px', background: '#ed0029', borderRadius: '2px' }} />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Bổ sung thêm thông tin</h4>
            </div>

            {sorted.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                <FileText size={28} style={{ margin: '0 auto 8px', color: '#e2e8f0', display: 'block' }} />
                Chưa có trường nào được cấu hình.<br />
                <span style={{ fontSize: '12px' }}>Vào <strong>Cấu hình File</strong> để thêm trường.</span>
              </div>
            ) : sorted.map(f => (
              <div key={f._fid} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>{f.tenHienThi}</label>
                <input
                  value={v[f.tenTruong] || ''}
                  onChange={e => setConfigFieldValues(prev => ({ ...prev, [f.tenTruong]: e.target.value }))}
                  placeholder={`Nhập ${f.tenHienThi.toLowerCase()}...`}
                  style={{ padding: '8px 11px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                  onFocus={e => e.target.style.borderColor = '#ed0029'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            ))}
          </div>

          {/* ── Cột phải: Preview biên bản ── */}
          <div style={{ overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '18px', background: '#2563eb', borderRadius: '2px' }} />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Xem trước biên bản</h4>
              <span style={{ fontSize: '11px', color: '#94a3b8', background: '#e2e8f0', padding: '2px 7px', borderRadius: '10px' }}>Cập nhật theo thời gian thực</span>
            </div>

            {/* Document */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '32px 36px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontFamily: 'Times New Roman, serif', fontSize: '13px', lineHeight: '1.8', color: '#1e293b' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', fontStyle: 'italic' }}>Độc lập - Tự do - Hạnh phúc</p>
                <p style={{ margin: '4px auto 0', width: '200px', borderBottom: '1px solid #1e293b' }} />
              </div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{row.loaiChungTu}</p>
                {config && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>{config.tenMau}</p>}
              </div>
              {sorted.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>Chưa có trường thông tin nào được cấu hình.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <tbody>
                    {sorted.map((f, idx) => (
                      <tr key={f._fid} style={{ borderBottom: idx < sorted.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                        <td style={{ padding: '6px 8px 6px 0', fontWeight: '600', fontSize: '13px', color: '#374151', width: '45%', verticalAlign: 'top' }}>{f.tenHienThi}:</td>
                        <td style={{ padding: '6px 0', fontSize: '13px', color: v[f.tenTruong] ? '#1e293b' : '#cbd5e1', fontStyle: v[f.tenTruong] ? 'normal' : 'italic' }}>
                          {v[f.tenTruong] || `[${f.tenHienThi}]`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '32px', textAlign: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>ĐẠI DIỆN BÊN A</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
                  <div style={{ height: '50px' }} />
                  <p style={{ margin: 0, borderTop: '1px solid #cbd5e1', paddingTop: '4px', fontSize: '12px', color: v['dai_dien_ben_a'] ? '#1e293b' : '#cbd5e1' }}>
                    {v['dai_dien_ben_a'] || '...........................'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>ĐẠI DIỆN BÊN B</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
                  <div style={{ height: '50px' }} />
                  <p style={{ margin: 0, borderTop: '1px solid #cbd5e1', paddingTop: '4px', fontSize: '12px', color: v['dai_dien_ben_b'] ? '#1e293b' : '#cbd5e1' }}>
                    {v['dai_dien_ben_b'] || '...........................'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
            Hủy
          </button>
          <button onClick={onSave} style={{ padding: '9px 20px', background: '#ed0029', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} /> Lưu
          </button>
        </div>

      </div>
    </div>
  );
}

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
  const [productType, setProductType] = useState('Phần mềm ERP');
  const [period, setPeriod] = useState('Tháng 05/2026');
  const [fromDate, setFromDate] = useState('2026-05-01');
  const [toDate, setToDate] = useState('2026-05-31');

  // File Simulation State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [docStatus, setDocStatus] = useState('Tạm tính');

  // SLA Penalty State (giữ lại cho sidebar tính tiền thực nhận)
  const [slaList, setSlaList] = useState([]);

  // Điểm SLA tổng (lấy từ KpiSlaBlock qua callback)
  const [slaScore, setSlaScore] = useState('86'); // default = giá trị ban đầu trong mock data

  // Sản phẩm nghiệm thu (cấp 3) — mỗi đợt gắn 1 sản phẩm; quyết định quy trình 2 bước / 1 bước
  const [acceptanceProductId, setAcceptanceProductId] = useState('');

  // Bước đang active (1, 2, 3)
  const [activeStep, setActiveStep] = useState(1);

  // Bước 2: upload biên bản
  const [bbFile, setBbFile] = useState(null);
  const [bbConfirmed, setBbConfirmed] = useState(false);

  // Bảng biên bản nghiệm thu — 2 dòng mặc định, tự động link configFile theo loaiChungTu + spdv
  const [bbDocRows, setBbDocRows] = useState([]);

  useEffect(() => {
    const allConfigs = mockStore.getAllConfigFiles ? mockStore.getAllConfigFiles() : [];
    setBbDocRows(prev =>
      DEFAULT_DOC_TYPES.map((loaiChungTu, idx) => {
        // Tìm configFile phù hợp: đúng menu, đúng loại chứng từ, đúng SPDV (hoặc SPDV rỗng = áp dụng tất cả)
        const cfg = allConfigs.find(c => {
          const active = c.trangThai === 'Hiệu lực' || c.status === 'Hiệu lực';
          if (!active || c.menu !== ACCEPTANCE_MENU) return false;
          if (c.loaiChungTu !== loaiChungTu) return false;
          if (c.spdv && c.spdv.length > 0 && !c.spdv.includes(productType)) return false;
          return true;
        });
        const existing = prev.find(r => r.loaiChungTu === loaiChungTu);
        return {
          id: `bb-row-${idx}`,
          loaiChungTu,
          cauHinhId: cfg?.id || null,
          cauHinh: cfg?.tenMau || cfg?.name || '',
          file: existing?.file || null,
          noiDung: existing?.noiDung || '',
          thoiDiemTai: existing?.thoiDiemTai || null,
        };
      })
    );
  }, [productType]);

  const handleBbDocFileUpload = (rowId, file) => {
    if (!file) return;
    const now = new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setBbDocRows(prev => prev.map(r => r.id === rowId ? { ...r, file, thoiDiemTai: now } : r));
  };

  const handleBbDocNoiDung = (rowId, val) => {
    setBbDocRows(prev => prev.map(r => r.id === rowId ? { ...r, noiDung: val } : r));
  };

  // Modal cấu hình biên bản
  const [configModal, setConfigModal] = useState(null); // { row, config } | null
  const [configFieldValues, setConfigFieldValues] = useState({});

  const handleOpenConfigModal = (row) => {
    const cfg = row.cauHinhId ? mockStore.getConfigFile(row.cauHinhId) : null;
    const initialValues = {};
    const fields = cfg?.cauHinhTruong?.filter(f => f.trangThai) || [];
    fields.forEach(f => {
      initialValues[f.tenTruong] = row.fieldValues?.[f.tenTruong] || '';
    });
    setConfigFieldValues(initialValues);
    setConfigModal({ row, config: cfg });
  };

  const handleSaveConfig = () => {
    if (!configModal) return;
    setBbDocRows(prev => prev.map(r =>
      r.id === configModal.row.id ? { ...r, fieldValues: { ...configFieldValues } } : r
    ));
    setConfigModal(null);
  };

  // Bước 3: hóa đơn
  const [invoicePdf, setInvoicePdf] = useState(null);   // File object PDF
  const [invoiceXml, setInvoiceXml] = useState(null);   // File object XML
  const [invoicePdfUrl, setInvoicePdfUrl] = useState(null); // Object URL for preview
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);

  // Trạng thái sidebar "Bảng tính tiền dự kiến thực nhận"
  const [billStatus, setBillStatus] = useState('Tạm tính'); // 'Tạm tính' | 'Chờ KH confirm' | 'KH đã confirm'

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Xác nhận bảng tính tiền nghiệm thu');
  const [emailBody, setEmailBody] = useState('Kính gửi Quý khách hàng,\n\nChúng tôi gửi đến Quý khách bảng tính tiền dự kiến thực nhận kỳ nghiệm thu này để xác nhận.\n\nTrân trọng.');

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
        if (phase.acceptanceProductId) setAcceptanceProductId(phase.acceptanceProductId);
        if (phase.slaList) setSlaList(phase.slaList);
        if (phase.lineItems) {
          setLineItems(phase.lineItems);
          setUploadedFile(phase.uploadedFileName || 'File đã tải lên');
        }
      }
    }
  }, [parentId, phaseId]);

  // Danh sách sản phẩm (cấp 3) của hợp đồng — nguồn để chọn sản phẩm nghiệm thu
  const contractProducts = useMemo(() => {
    if (!contract?.products) return [];
    const store = mockStore.getStore();
    return contract.products.map(p => store.products?.[p.productId]).filter(Boolean);
  }, [contract]);

  const selectedProduct = contractProducts.find(p => p.id === acceptanceProductId) || null;
  const stepMode = selectedProduct?.acceptanceStepMode || 'two_step';
  const isOneStep = stepMode === 'one_step';

  // Mặc định chọn sản phẩm đầu tiên của hợp đồng
  useEffect(() => {
    if (!acceptanceProductId && contractProducts.length > 0) {
      setAcceptanceProductId(contractProducts[0].id);
    }
  }, [contractProducts, acceptanceProductId]);

  // Sản phẩm 1 bước → bỏ qua Bước 1, vào thẳng Bước 2
  useEffect(() => {
    if (isOneStep) setActiveStep(2);
  }, [isOneStep]);

  // Recalculate values based on items and SLA score
  const totals = useMemo(() => {
    const rawVal = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;

    // % phạt tính từ điểm SLA tổng (theo thang điểm trong hợp đồng)
    const penaltyRate = calcSLAPenaltyRate(slaScore);          // vd: 2.7
    const calculatedPenalty = Math.round(rawVal * (penaltyRate / 100));
    const netTotal = rawVal - calculatedPenalty;

    return {
      value: new Intl.NumberFormat('en-US').format(rawVal),
      penalty: new Intl.NumberFormat('en-US').format(calculatedPenalty),
      netTotal: new Intl.NumberFormat('en-US').format(netTotal),
      rate: Math.round(penaltyRate * 100) / 100,  // làm tròn 2 chữ số
      slaScore: parseFloat(slaScore) || 0
    };
  }, [value, slaScore]);

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
      status: 'Chờ xác nhận',
      notes,
      fromDate,
      toDate,
      slaList,
      lineItems,
      uploadedFileName: uploadedFile,
      acceptanceProductId
    };

    if (phaseId) {
      mockStore.updateAcceptancePhase(phaseId, payload);
    } else {
      mockStore.createAcceptancePhase(parentId, payload);
    }

    setActiveStep(2);
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

      {/* Sản phẩm nghiệm thu — mỗi đợt gắn 1 sản phẩm (cấp 3 của hợp đồng) */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '320px', flex: 1 }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Sản phẩm nghiệm thu</label>
          <select
            value={acceptanceProductId}
            onChange={(e) => setAcceptanceProductId(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', backgroundColor: 'white', outline: 'none' }}
          >
            <option value="">-- Chọn sản phẩm --</option>
            {contractProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: isOneStep ? '#ecfeff' : '#f1f5f9', color: isOneStep ? '#0e7490' : '#475569', alignSelf: 'flex-end' }}>
          Quy trình: {isOneStep ? '1 bước (Chỉ Ký & Hóa đơn)' : '2 bước (Khối lượng + Ký & Hóa đơn)'}
        </div>
      </div>

      {/* Stepper Steps (động theo quy trình sản phẩm) */}
      {(() => {
        const STEPPER = isOneStep
          ? [{ step: 2, title: 'Bước 2: Trình biên ký số & Hóa đơn', desc: 'Xác nhận biên bản, gửi KH, đính kèm hóa đơn VAT' }]
          : [
              { step: 1, title: 'Bước 1: Trích xuất & Lũy kế', desc: 'Kế thừa hợp đồng, nạp nhiều tệp khối lượng & SLA' },
              { step: 2, title: 'Bước 2: Trình biên ký số & Hóa đơn', desc: 'Xác nhận biên bản, gửi KH, đính kèm hóa đơn VAT' },
            ];
        return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPPER.length}, 1fr)`, backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {STEPPER.map(({ step, title, desc }, idx) => {
          const isActive = activeStep === step;
          const isCompleted = activeStep > step;
          const isDisabled = !isOneStep && step === 2 && billStatus !== 'KH đã confirm';
          return (
            <div
              key={step}
              onClick={() => { if (!isDisabled) setActiveStep(step); }}
              title={isDisabled ? 'Cần xác nhận KH trước khi vào Bước 2' : undefined}
              style={{
                display: 'flex', gap: '16px', padding: '16px 24px',
                borderRight: idx < STEPPER.length - 1 ? '1px solid #e2e8f0' : 'none',
                backgroundColor: isActive ? '#fff1f2' : 'white',
                opacity: isDisabled ? 0.4 : (isActive || isCompleted ? 1 : 0.7),
                cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, backgroundColor: isActive ? '#ed0029' : isCompleted ? '#10b981' : '#64748b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                {isCompleted ? '✓' : step}
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: isActive ? '#9f1239' : '#1e293b', margin: 0 }}>{title}</h4>
                <p style={{ fontSize: '11px', color: isActive ? '#f43f5e' : '#64748b', marginTop: '2px', margin: '2px 0 0' }}>{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
        );
      })()}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: activeStep === 1 ? '1fr 360px' : '1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ===== Bảng tính tiền dự kiến thực nhận (Step 2 — full width) ===== */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Bảng tính tiền dự kiến thực nhận</h3>
                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {['Tạm tính', 'Chờ KH confirm', 'KH đã confirm'].map((step, idx) => {
                    const STEPS = ['Tạm tính', 'Chờ KH confirm', 'KH đã confirm'];
                    const currentIdx = STEPS.indexOf(billStatus);
                    const isActive = step === billStatus;
                    const isCompleted = idx < currentIdx;
                    return (
                      <React.Fragment key={step}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, backgroundColor: (isActive || isCompleted) ? '#10b981' : 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span style={{ fontSize: '11px', color: (isActive || isCompleted) ? '#10b981' : '#64748b', fontWeight: isActive ? '700' : '400' }}>{step}</span>
                        </div>
                        {idx < 2 && <div style={{ width: '20px', height: '2px', backgroundColor: isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Body: fields + actions */}
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'end' }}>
                {/* Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {[
                    { label: 'Tổng khối lượng', value: `${totals.value} đ`, color: 'white' },
                    { label: 'Điểm SLA tổng hợp', value: `${totals.slaScore} / 100`, color: totals.slaScore >= 95 ? '#10b981' : totals.slaScore >= 80 ? '#f59e0b' : '#f43f5e' },
                    { label: '% phạt khấu trừ', value: `${totals.rate}%`, color: totals.rate === 0 ? '#10b981' : '#f43f5e' },
                    { label: 'Số tiền phạt SLA', value: `-${totals.penalty} đ`, color: '#f43f5e' },
                    { label: 'Tổng tiền dự kiến thực nhận', value: `${totals.netTotal} VND`, color: '#10b981', bold: true },
                  ].map(({ label, value, color, bold }, i) => (
                    <div key={i} style={{ padding: '14px 16px', backgroundColor: i === 4 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em', marginBottom: '6px' }}>{label}</div>
                      <div style={{ fontSize: bold ? '16px' : '14px', fontWeight: bold ? '900' : '700', color }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                  {billStatus === 'Tạm tính' && (
                    <button type="button" onClick={() => setShowEmailModal(true)}
                      style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <Send size={13} /> Gửi KH Confirm
                    </button>
                  )}
                  {billStatus === 'Chờ KH confirm' && (
                    <button type="button" onClick={() => setBillStatus('KH đã confirm')}
                      style={{ padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <CheckCircle2 size={13} /> KH đã Confirm
                    </button>
                  )}
                  {billStatus === 'KH đã confirm' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', whiteSpace: 'nowrap' }}>
                      <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>KH đã xác nhận</span>
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.5 }}>
                    {totals.slaScore >= 95 && '✅ Không phạt phí'}
                    {totals.slaScore >= 90 && totals.slaScore < 95 && `⚠️ Trừ lũy tiến GT1: 0.05% × ${95 - totals.slaScore} điểm`}
                    {totals.slaScore >= 80 && totals.slaScore < 90 && `⚠️ Trừ lũy tiến GT2: 0.25% + 0.08% × ${90 - totals.slaScore} điểm`}
                    {totals.slaScore >= 70 && totals.slaScore < 80 && `⚠️ Trừ lũy tiến GT3: 1.05% + 0.1% × ${80 - totals.slaScore} điểm`}
                    {totals.slaScore >= 65 && totals.slaScore < 70 && `⚠️ Trừ lũy tiến GT4: 2.05% + 0.15% × ${70 - totals.slaScore} điểm`}
                    {totals.slaScore < 65 && '🔴 Trừ flat GT5: 8%'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section A: Biên bản nghiệm thu */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#fff1f2', padding: '14px 24px', borderBottom: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ed0029', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9f1239', margin: 0 }}>Biên bản nghiệm thu</h3>
                  {/* filter badges */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#ffe4e6', border: '1px solid #fecdd3', borderRadius: '4px', fontSize: '11px', color: '#9f1239', fontWeight: '600' }}>
                    Menu: {ACCEPTANCE_MENU}
                  </span>
                  {productType && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11px', color: '#1d4ed8', fontWeight: '600' }}>
                      SPDV: {productType}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#f87171' }}>
                    {bbDocRows.length > 0 ? `${bbDocRows.length} mẫu khớp` : 'Không có mẫu nào khớp'}
                  </span>
                </div>
                {/* Action buttons row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => alert('Xuất Biên bản nghiệm thu thành công!')}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', backgroundColor: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    <Upload size={13} /> Xuất BB nghiệm thu
                  </button>
                  <button type="button" onClick={() => alert('Xuất Bảng xác nhận thanh toán số Seat (Excel)...')}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    <Calculator size={13} /> Xuất BXNTT số Seat
                  </button>
                </div>
              </div>

              <div style={{ padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '11px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '12px', width: '48px' }}>STT</th>
                        <th style={{ padding: '11px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '12px', minWidth: '160px' }}>Loại chứng từ</th>
                        <th style={{ padding: '11px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '12px', minWidth: '200px' }}>Cấu hình</th>
                        <th style={{ padding: '11px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '12px', width: '100px' }}>Xuất file</th>
                        <th style={{ padding: '11px 16px', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '12px', width: '80px' }}>File</th>
                        <th style={{ padding: '11px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '12px', minWidth: '160px' }}>Nội dung</th>
                        <th style={{ padding: '11px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '12px', minWidth: '130px' }}>Thời điểm tải</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bbDocRows.map((row, idx) => (
                        <tr key={row.id}
                          style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                        >
                          {/* STT */}
                          <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>{idx + 1}</td>

                          {/* Loại chứng từ */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px', background: '#fff1f2', color: '#9f1239', fontSize: '12px', fontWeight: '500', border: '1px solid #fecdd3', whiteSpace: 'nowrap' }}>
                              {row.loaiChungTu}
                            </span>
                          </td>

                          {/* Cấu hình + nút Sửa */}
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '13px', color: row.cauHinh ? '#374151' : '#cbd5e1', fontWeight: row.cauHinh ? '500' : '400', fontStyle: row.cauHinh ? 'normal' : 'italic' }}>
                                {row.cauHinh || 'Chưa cấu hình'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenConfigModal(row)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', color: '#2563eb', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                              >
                                ✏️ Sửa
                              </button>
                            </div>
                          </td>

                          {/* Xuất file */}
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => alert(`Xuất file mẫu: ${row.loaiChungTu}${row.cauHinh ? ' — ' + row.cauHinh : ''}`)}
                              title="Xuất file mẫu"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#16a34a', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              <Upload size={12} style={{ transform: 'rotate(180deg)' }} /> Xuất
                            </button>
                          </td>

                          {/* File (upload) */}
                          <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                            {row.file ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                                  <span style={{ fontSize: '11px', color: '#065f46', fontWeight: '600', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.file.name}>{row.file.name}</span>
                                </div>
                                <button type="button"
                                  onClick={() => setBbDocRows(prev => prev.map(r => r.id === row.id ? { ...r, file: null, thoiDiemTai: null } : r))}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '10px', padding: 0 }}>✕ Xóa</button>
                              </div>
                            ) : (
                              <label title="Tải file lên" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', color: '#94a3b8', transition: 'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor='#ed0029'; e.currentTarget.style.color='#ed0029'; e.currentTarget.style.background='#fff1f2'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='#cbd5e1'; e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='#f8fafc'; }}
                              >
                                <Upload size={15} />
                                <input type="file" accept=".pdf,.docx,.xlsx,.png,.jpg"
                                  style={{ display: 'none' }}
                                  onChange={e => handleBbDocFileUpload(row.id, e.target.files[0] || null)} />
                              </label>
                            )}
                          </td>

                          {/* Nội dung */}
                          <td style={{ padding: '10px 16px' }}>
                            <input
                              value={row.noiDung}
                              onChange={e => handleBbDocNoiDung(row.id, e.target.value)}
                              placeholder="Nhập nội dung..."
                              style={{ width: '100%', padding: '6px 9px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', color: '#374151', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                            />
                          </td>

                          {/* Thời điểm tải */}
                          <td style={{ padding: '12px 16px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {row.thoiDiemTai
                              ? <span style={{ color: '#10b981', fontWeight: '600' }}>{row.thoiDiemTai}</span>
                              : <span style={{ color: '#cbd5e1' }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section B: Hóa đơn */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#ed0029' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Hóa đơn VAT</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Hỗ trợ PDF, XML — Tối đa 20MB</span>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Single upload zone — chấp nhận cả PDF và XML */}
                {!invoicePdf && !invoiceXml ? (
                  <div onClick={() => document.getElementById('inv-combined').click()}
                    style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '36px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ed0029'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <Upload size={28} style={{ color: '#94a3b8', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '13px', color: '#475569', fontWeight: '600', margin: '0 0 4px' }}>Kéo thả hoặc click để tải lên hóa đơn</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Định dạng: PDF, XML — Tối đa 20MB</p>
                    <input id="inv-combined" type="file" accept=".pdf,.xml" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files[0];
                        if (!f) return;
                        if (f.size > 20 * 1024 * 1024) { alert('File vượt quá 20MB'); return; }
                        const ext = f.name.split('.').pop().toLowerCase();
                        if (ext === 'pdf') { setInvoicePdf(f); setInvoicePdfUrl(URL.createObjectURL(f)); }
                        else if (ext === 'xml') { setInvoiceXml(f); }
                      }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* File đã tải lên */}
                    {invoicePdf && (
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#fff1f2', borderBottom: invoicePdfUrl ? '1px solid #fecdd3' : 'none' }}>
                          <FileText size={16} style={{ color: '#ed0029', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9f1239', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{invoicePdf.name}</p>
                            <p style={{ fontSize: '11px', color: '#f87171', margin: '2px 0 0' }}>{(invoicePdf.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                          </div>
                          <button type="button" onClick={() => setShowInvoiceViewer(v => !v)}
                            style={{ padding: '4px 10px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '5px', fontSize: '11px', fontWeight: '600', color: '#ed0029', cursor: 'pointer' }}>
                            {showInvoiceViewer ? 'Ẩn' : 'Xem'}
                          </button>
                          <button type="button" onClick={() => { setInvoicePdf(null); setInvoicePdfUrl(null); setShowInvoiceViewer(false); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', padding: '0 4px' }}>✕</button>
                        </div>
                        {showInvoiceViewer && invoicePdfUrl && (
                          <iframe src={invoicePdfUrl} style={{ width: '100%', height: '600px', border: 'none', display: 'block' }} title="Xem hóa đơn VAT" />
                        )}
                      </div>
                    )}
                    {invoiceXml && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#eff6ff' }}>
                        <FileText size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#1d4ed8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{invoiceXml.name}</p>
                          <p style={{ fontSize: '11px', color: '#93c5fd', margin: '2px 0 0' }}>{(invoiceXml.size / 1024 / 1024).toFixed(2)} MB · XML</p>
                        </div>
                        <button type="button" onClick={() => setInvoiceXml(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>✕</button>
                      </div>
                    )}
                    {/* Cho phép tải thêm file loại còn lại */}
                    {!(invoicePdf && invoiceXml) && (
                      <button type="button" onClick={() => document.getElementById('inv-combined2').click()}
                        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: 'white', border: '1px dashed #cbd5e1', borderRadius: '6px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                        <Upload size={12} /> Tải thêm {invoicePdf ? 'XML' : 'PDF'}
                        <input id="inv-combined2" type="file" accept={invoicePdf ? '.xml' : '.pdf'} style={{ display: 'none' }}
                          onChange={e => {
                            const f = e.target.files[0];
                            if (!f) return;
                            if (f.size > 20 * 1024 * 1024) { alert('File vượt quá 20MB'); return; }
                            const ext = f.name.split('.').pop().toLowerCase();
                            if (ext === 'pdf') { setInvoicePdf(f); setInvoicePdfUrl(URL.createObjectURL(f)); }
                            else if (ext === 'xml') setInvoiceXml(f);
                          }} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Back button — ẩn với sản phẩm 1 bước (không có Bước 1) */}
            {!isOneStep && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button type="button" onClick={() => setActiveStep(1)}
                style={{ padding: '10px 20px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>
                ← Quay lại Bước 1
              </button>
            </div>
            )}

          </div>
        )}
        {activeStep === 1 && <>
          
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
                  <option value="">-- Chọn SPDV --</option>
                  {SPDV_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: '#ed0029' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Bảng tính khối lượng</h3>
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

          {/* Section 4: Tổng hợp SLA/KPI hằng tháng */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            {/* Section header */}
            <div style={{ backgroundColor: 'white', padding: '14px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} style={{ color: '#ed0029' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Tổng hợp SLA / KPI hằng tháng</h3>
            </div>
            {/* KpiSlaBlock nhúng trực tiếp — tự quản lý status bar + tab KPI/SLA */}
            <KpiSlaBlock onScoreChange={setSlaScore} hideStatusBar={true} />
          </div>
        </>}

        </div>

        {/* Right Column: Bảng tính tiền dự kiến thực nhận — chỉ Bước 1 */}
        {activeStep === 1 && <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>

          <h3 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', margin: 0, color: '#f8fafc' }}>
            Bảng tính tiền dự kiến thực nhận
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Tổng khối lượng công việc:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{totals.value} đ</span>
            </div>
            {/* SLA score & penalty rate */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>Điểm SLA tổng hợp:</span>
                <span style={{ fontWeight: 'bold', color: totals.slaScore >= 95 ? '#10b981' : totals.slaScore >= 80 ? '#f59e0b' : '#f43f5e' }}>
                  {totals.slaScore} / 100
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>% phạt khấu trừ:</span>
                <span style={{ fontWeight: 'bold', color: totals.rate === 0 ? '#10b981' : '#f43f5e' }}>
                  {totals.rate}%
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', lineHeight: 1.5 }}>
                {totals.slaScore >= 95 && '✅ Đạt ngưỡng — Không phạt phí'}
                {totals.slaScore >= 90 && totals.slaScore < 95 && `⚠️ Trừ lũy tiến GT1: 0.05% × ${95 - totals.slaScore} điểm dưới 95`}
                {totals.slaScore >= 80 && totals.slaScore < 90 && `⚠️ Trừ lũy tiến GT2: 0.25% + 0.08% × ${90 - totals.slaScore} điểm dưới 90`}
                {totals.slaScore >= 70 && totals.slaScore < 80 && `⚠️ Trừ lũy tiến GT3: 1.05% + 0.1% × ${80 - totals.slaScore} điểm dưới 80`}
                {totals.slaScore >= 65 && totals.slaScore < 70 && `⚠️ Trừ lũy tiến GT4: 2.05% + 0.15% × ${70 - totals.slaScore} điểm dưới 70`}
                {totals.slaScore < 65 && '🔴 Dưới 65 điểm — Trừ flat GT5: 8% chi phí'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Số tiền phạt SLA ({totals.rate}%):</span>
              <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>-{totals.penalty} đ</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>CÔNG THỨC ÁP DỤNG:</span>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Thực nhận = Σ(Sản lượng × Đơn giá) − Σ(Sản lượng × Đơn giá × %phạt)
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>TỔNG TIỀN DỰ KIẾN THỰC NHẬN</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{totals.netTotal} VND</span>
            </div>
          </div>

          {/* Nút Xác nhận khối lượng — chỉ Bước 1 */}
          <button type="button" onClick={handleSaveAndSubmit}
            style={{ width: '100%', padding: '12px', backgroundColor: '#ed0029', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Xác nhận khối lượng gửi khách hàng →</span>
          </button>
        </div>}

        {/* Email Modal */}
        {showEmailModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', width: '520px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Soạn email gửi khách hàng</h3>
                <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Đến (To)</label>
                  <input
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    placeholder="email@khachhang.com"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Tiêu đề</label>
                  <input
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Nội dung</label>
                  <textarea
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    rows={5}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>Đính kèm:</strong> Bảng tính tiền dự kiến thực nhận — {totals.netTotal} VND
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowEmailModal(false)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}>Hủy</button>
                <button
                  onClick={() => { setBillStatus('Chờ KH confirm'); setShowEmailModal(false); }}
                  style={{ padding: '8px 18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Gửi email
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    <ConfigBienBanModal
      configModal={configModal}
      configFieldValues={configFieldValues}
      setConfigFieldValues={setConfigFieldValues}
      onSave={handleSaveConfig}
      onClose={() => setConfigModal(null)}
    />


    </div>
  );
};

export default AcceptancePhaseForm;
