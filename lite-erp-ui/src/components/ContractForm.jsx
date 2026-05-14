import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Activity,
  ChevronLeft,
  Save,
  Briefcase,
  CheckCircle2,
  XCircle,
  Send,
  History,
  Lock,
  Smile,
  Paperclip,
  Maximize2
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './ContractForm.css';

const INITIAL_FORM_STATE = {
  contractNo: '',
  name: '',
  customerId: '',
  customerName: '',
  shortName: '',
  amName: '',
  promotionUnit: '',
  projectType: 'Mới_xúc tiến',
  serviceType: 'Dịch vụ CC outsourcing',
  classification: 'Ngoài',
  contractStatus: 'Đang hiệu lực',
  implementationStatus: 'Chưa triển khai',
  revenueStatus: 'Chưa lên doanh thu',
  revenueMonth: '',
  contractValue: '',
  unitPrice: '',
  totalContracts: '1',
  effectiveDate: '',
  expiryDate: '',
  signedDate: new Date().toISOString().split('T')[0],
  serviceContent: '',
  notes: '',
  approvalStatus: 'Nháp',
  isLegalApprovedDraft: false,
  isManagerApprovedDraft: false,
  isLegalApprovedSigned: false,
  isManagerApprovedSigned: false
};

function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get('leadId');
  const [formData, setFormData] = useState({...INITIAL_FORM_STATE, leadId: leadId || ''});
  const [customers, setCustomers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Validation & Modal State
  const [formErrors, setFormErrors] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectData, setRejectData] = useState({ reason: '', description: '' });

  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState('');
  const [activeNotebookTab, setActiveNotebookTab] = useState('notes');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const allCustomers = mockStore.getAllCustomers();
    setCustomers(allCustomers);

    if (id) {
      const existing = mockStore.getContract(id);
      if (existing) {
        setFormData(existing);
        setChatterMessages(existing.chatterMessages || []);
        setIsEdit(true);
      }
    } else {
      // Auto-generate Contract No for NEW only
      const nextNo = mockStore.getNextContractNo();
      let newFormData = { ...INITIAL_FORM_STATE, contractNo: nextNo, leadId: leadId || '' };
      
      // If navigating from Lead
      if (leadId) {
         const leadData = (typeof mockStore.getLead === 'function' ? mockStore.getLead(leadId) : null) || (typeof mockStore.getOpp === 'function' ? mockStore.getOpp(leadId) : null) || mockStore.getStore().oppTasks?.[leadId] || mockStore.getStore().tasks?.[leadId];
         if (leadData) {
            newFormData.name = leadData.content || '';
            newFormData.amName = leadData.salesperson || '';
            const matchedCustomer = allCustomers.find(c => c.name === leadData.company || (c.mst && c.mst === leadData.mst));
            if (matchedCustomer) {
               newFormData.customerId = matchedCustomer.id;
               newFormData.customerName = matchedCustomer.name;
               newFormData.shortName = matchedCustomer.shortName || '';
               newFormData.classification = matchedCustomer.type === 'Doanh nghiệp' ? 'Ngoài' : 'Nội bộ';
            } else {
               // Tạo khách hàng Dự thảo nếu chưa có
               const isEnterprise = leadData.tags?.find(t => t.text === 'Doanh nghiệp');
               const draftCustomer = {
                 name: leadData.company || leadData.content || 'Khách hàng mới',
                 mst: leadData.mst || '',
                 status: 'Dự thảo',
                 type: isEnterprise ? 'Doanh nghiệp' : 'Nội bộ',
                 domain: leadData.projectedService || '',
                 projectType: leadData.projectType || 'outsourcing',
                 source: 'Lead/Opportunity',
               };
               const newCustomerId = mockStore.addCustomer(draftCustomer);
               newFormData.customerId = newCustomerId;
               newFormData.customerName = draftCustomer.name;
               newFormData.classification = isEnterprise ? 'Ngoài' : 'Nội bộ';
               
               // Update local customers list to include the newly created draft
               setCustomers(mockStore.getAllCustomers());
            }
         }
      }
      setFormData(newFormData);
    }
  }, [id, leadId]);

  const handleCustomerChange = (customerId) => {
    if (!customerId) {
      setFormData(prev => ({ ...prev, customerId: '', customerName: '', shortName: '', classification: 'Ngoài' }));
      return;
    }
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        shortName: customer.shortName || '',
        classification: customer.type === 'Doanh nghiệp' ? 'Ngoài' : 'Nội bộ'
      }));
    }
  };

  const handleEffectiveDateChange = (date) => {
    if (!date) {
      setFormData(prev => ({ ...prev, effectiveDate: '', revenueMonth: '' }));
      return;
    }
    const d = new Date(date);
    if (isNaN(d.getTime()) || d.getFullYear() < 1900 || d.getFullYear() > 2100) {
      setFormData(prev => ({ ...prev, effectiveDate: date, revenueMonth: 'Ngày không lệ' }));
      return;
    }
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    setFormData(prev => ({
      ...prev,
      effectiveDate: date,
      revenueMonth: `Tháng ${month}/${year}`
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'customerId', label: 'Khách hàng' },
      { key: 'amName', label: 'AM phụ trách' },
      { key: 'contractNo', label: 'Số Hợp đồng' },
      { key: 'name', label: 'Tên Hợp đồng' },
      { key: 'effectiveDate', label: 'Ngày hiệu lực' },
      { key: 'contractValue', label: 'Giá trị HĐ (chưa VAT)' },
    ];
    let errors = {};
    let firstErrorKey = null;

    requiredFields.forEach(field => {
      if (!formData[field.key]) {
        errors[field.key] = `Vui lòng nhập ${field.label}`;
        if (!firstErrorKey) firstErrorKey = field.key;
      }
    });

    setFormErrors(errors);

    if (firstErrorKey) {
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const handleSendApproval = () => {
    if (validateForm()) {
      updateStatus('Chờ duyệt');
    }
  };

  const confirmReject = () => {
    if (!rejectData.reason) {
      alert("Vui lòng chọn lý do từ chối");
      return;
    }

    const contractId = isEdit ? id : mockStore.getNextContractId();
    const updatedData = { ...formData, id: contractId, approvalStatus: 'Nháp', isLegalApprovedDraft: false, isManagerApprovedDraft: false, isLegalApprovedSigned: false, isManagerApprovedSigned: false, rejectReason: rejectData.reason, rejectDescription: rejectData.description, chatterMessages };
    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);
    setShowRejectModal(false);
    alert(`Đã từ chối! Hợp đồng được trả về trạng thái Nháp.`);
  };

  const updateStatus = (newStatus) => {
    const contractId = isEdit ? id : mockStore.getNextContractId();
    const updatedData = { ...formData, id: contractId, approvalStatus: newStatus, chatterMessages };

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);

    if (newStatus === 'Hiệu lực') {
      mockStore.createProjectFromContract(contractId, updatedData);
      
      if (formData.leadId) {
          if (typeof mockStore.updateLeadStatus === 'function') mockStore.updateLeadStatus(formData.leadId, 'Kí hợp đồng');
          if (typeof mockStore.updateOppStatus === 'function') mockStore.updateOppStatus(formData.leadId, 'Kí hợp đồng');
      }

      alert(`Đã cập nhật trạng thái: ${newStatus}`);
      navigate('/contracts');
    } else if (!isEdit) {
      setIsEdit(true);
      navigate(`/contract/edit/${contractId}`, { replace: true });
    }
  };

  const handleApproveDraft = (type) => {
    let updatedFlags = {};
    if (type === 'Legal') updatedFlags.isLegalApprovedDraft = true;
    if (type === 'Manager') updatedFlags.isManagerApprovedDraft = true;

    const isLegal = updatedFlags.isLegalApprovedDraft || formData.isLegalApprovedDraft;
    const isManager = updatedFlags.isManagerApprovedDraft || formData.isManagerApprovedDraft;

    const contractId = isEdit ? id : mockStore.getNextContractId();
    let updatedData = { ...formData, ...updatedFlags, id: contractId, chatterMessages };

    if (isLegal && isManager) {
       updatedData.approvalStatus = 'Chờ Upload';
    }

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);
    
    if (isLegal && isManager) {
       alert('Bản thảo đã được duyệt bởi cả Pháp chế và Trưởng phòng. Bạn có thể Upload file trình ký.');
    }
  };

  const handleApproveSigned = (type) => {
    let updatedFlags = {};
    if (type === 'Legal') updatedFlags.isLegalApprovedSigned = true;
    if (type === 'Manager') updatedFlags.isManagerApprovedSigned = true;

    const isLegal = updatedFlags.isLegalApprovedSigned || formData.isLegalApprovedSigned;
    const isManager = updatedFlags.isManagerApprovedSigned || formData.isManagerApprovedSigned;

    const contractId = isEdit ? id : mockStore.getNextContractId();
    let updatedData = { ...formData, ...updatedFlags, id: contractId, chatterMessages };

    if (isLegal && isManager) {
       updatedData.approvalStatus = 'Hiệu lực';
    }

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);

    if (isLegal && isManager) {
       if (updatedData.leadId) {
           if (typeof mockStore.updateLeadStatus === 'function') mockStore.updateLeadStatus(updatedData.leadId, 'Kí hợp đồng');
           if (typeof mockStore.updateOppStatus === 'function') mockStore.updateOppStatus(updatedData.leadId, 'Kí hợp đồng');
       }
       alert('Bản ký đã được duyệt bởi cả Pháp chế và Trưởng phòng. Hợp đồng có hiệu lực!');
       navigate('/contracts');
    }
  };

  const postNote = () => {
    if (!chatterInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      type: 'note',
      author: 'Phạm Quang Mạnh',
      text: chatterInput,
      time: 'vừa xong',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
    };
    const newMessages = [newMsg, ...chatterMessages];
    setChatterMessages(newMessages);
    setChatterInput('');

    if (isEdit) {
      const existing = mockStore.getContract(id);
      if (existing) {
        existing.chatterMessages = newMessages;
        mockStore.saveContract(id, existing);
      }
    }
  };

  const isReadOnly = formData.approvalStatus !== 'Nháp' && !!formData.approvalStatus;

  return (
    <div className="contract-form-container lead-form-container" style={{ backgroundColor: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER MATCHING IMAGE 1 & 2 */}
      <div className="lead-form-header" style={{ display: 'flex', padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="breadcrumb" style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
          <span className="breadcrumb-item" style={{ color: '#64748b', cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/contracts')}>Danh sách Hợp đồng</span>
          <span className="breadcrumb-separator" style={{ color: '#cbd5e1' }}>/</span>
          <span className="breadcrumb-current" style={{ color: '#0f172a', fontWeight: 500 }}>{isEdit ? (formData.contractNo || 'Hợp đồng') : 'Mới'}</span>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn" style={{ height: '36px', padding: '0 16px', fontSize: '14px', fontWeight: 500, backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/contracts')}>Hủy</button>
          
          {(!formData.approvalStatus || formData.approvalStatus === 'Nháp') && (
            <>
              <button className="btn" style={{ height: '36px', padding: '0 16px', fontSize: '14px', fontWeight: 500, backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => updateStatus('Nháp')}>
                <Save size={16} /> Lưu nháp
              </button>
              <button className="btn" style={{ height: '36px', padding: '0 20px', fontSize: '14px', fontWeight: 600, backgroundColor: '#e32b4c', border: '1px solid #e32b4c', color: 'white', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(227, 43, 76, 0.2)' }} onClick={() => { if(validateForm()) updateStatus('Chờ duyệt bản thảo'); }}>
                Gửi duyệt bản thảo
              </button>
            </>
          )}

          {formData.approvalStatus === 'Chờ duyệt bản thảo' && (
            <>
              <button className="btn" style={{ height: '36px', minWidth: '80px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#64748B', border: '1px solid #64748B', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(100, 116, 139, 0.2)' }} onClick={() => setShowRejectModal(true)}>Từ chối</button>
              
              {!formData.isLegalApprovedDraft && (
                  <button className="btn" style={{ height: '36px', minWidth: '110px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#3b82f6', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleApproveDraft('Legal')}>PC duyệt bản thảo</button>
              )}
              {formData.isLegalApprovedDraft && (
                 <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#22c55e', fontSize:'13px', fontWeight:600}}><CheckCircle2 size={16}/> PC Đã duyệt</div>
              )}

              {!formData.isManagerApprovedDraft && (
                  <button className="btn" style={{ height: '36px', minWidth: '110px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#f59e0b', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleApproveDraft('Manager')}>TP duyệt bản thảo</button>
              )}
              {formData.isManagerApprovedDraft && (
                 <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#22c55e', fontSize:'13px', fontWeight:600}}><CheckCircle2 size={16}/> TP Đã duyệt</div>
              )}
            </>
          )}

          {formData.approvalStatus === 'Chờ Upload' && (
            <button className="btn" 
              style={{ height: '36px', padding: '0 20px', fontSize: '14px', fontWeight: 600, backgroundColor: uploadedFile ? '#e32b4c' : '#cbd5e1', border: 'none', color: 'white', borderRadius: '6px', cursor: uploadedFile ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              onClick={() => { if(uploadedFile) updateStatus('Chờ duyệt bản ký'); }}
              disabled={!uploadedFile}
            >
              Gửi duyệt bản ký
            </button>
          )}

          {formData.approvalStatus === 'Chờ duyệt bản ký' && (
            <>
              <button className="btn" style={{ height: '36px', minWidth: '80px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#64748B', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowRejectModal(true)}>Từ chối</button>
              
              {!formData.isLegalApprovedSigned && (
                  <button className="btn" style={{ height: '36px', minWidth: '110px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#3b82f6', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleApproveSigned('Legal')}>PC duyệt bản ký</button>
              )}
              {formData.isLegalApprovedSigned && (
                 <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#22c55e', fontSize:'13px', fontWeight:600}}><CheckCircle2 size={16}/> PC Đã duyệt</div>
              )}

              {!formData.isManagerApprovedSigned && (
                  <button className="btn" style={{ height: '36px', minWidth: '110px', padding: '0 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#f59e0b', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleApproveSigned('Manager')}>TP duyệt bản ký</button>
              )}
              {formData.isManagerApprovedSigned && (
                 <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#22c55e', fontSize:'13px', fontWeight:600}}><CheckCircle2 size={16}/> TP Đã duyệt</div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="form-chatter-wrapper" style={{ padding: '24px 40px', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div className="lead-form-sheet sheet-inner-wrapper" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '32px', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '32px' }}>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
            <div className="statusbar" style={{ display: 'flex', alignItems: 'center', background: 'transparent', margin: 0, gap: '4px' }}>
              {['Nháp', 'Chờ duyệt bản thảo', 'Chờ Upload', 'Chờ duyệt bản ký', 'Hiệu lực'].map((st, idx) => {
                const ALL_STATES = ['Nháp', 'Chờ duyệt bản thảo', 'Chờ Upload', 'Chờ duyệt bản ký', 'Hiệu lực'];
                const currentStatus = formData.approvalStatus || 'Nháp';
                const currentIndex = ALL_STATES.indexOf(currentStatus);
                const isCurrent = currentStatus === st;
                const isPast = idx < currentIndex;
                const isNext = idx === currentIndex + 1;

                return (
                  <div
                    key={st}
                    className="statusbar-item"
                    style={{
                      padding: '8px 12px 8px 24px',
                      borderRadius: '4px',
                      fontWeight: 500,
                      fontSize: '13px',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: isCurrent ? '#E32B4C' : (isPast ? '#fca5a5' : (isNext ? '#F1F5F9' : '#F8FAFC')),
                      color: isCurrent || isPast ? 'white' : (isNext ? '#475569' : '#94A3B8'),
                      border: isNext ? '1px solid #E32B4C' : '1px solid transparent',
                      cursor: 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <span>{st}</span>
                    {(st === 'Chờ duyệt bản thảo' || st === 'Chờ duyệt bản ký') && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '10px'}}>
                        <span style={{color: st === 'Chờ duyệt bản thảo' ? (formData.isLegalApprovedDraft ? '#fff' : (isCurrent?'#fecaca':'#94a3b8')) : (formData.isLegalApprovedSigned ? '#fff' : (isCurrent?'#fecaca':'#94a3b8'))}}>
                          {st === 'Chờ duyệt bản thảo' ? (formData.isLegalApprovedDraft ? '✓ PC duyệt' : '○ Chờ PC') : (formData.isLegalApprovedSigned ? '✓ PC duyệt' : '○ Chờ PC')}
                        </span>
                        <span style={{color: st === 'Chờ duyệt bản thảo' ? (formData.isManagerApprovedDraft ? '#fff' : (isCurrent?'#fecaca':'#94a3b8')) : (formData.isManagerApprovedSigned ? '#fff' : (isCurrent?'#fecaca':'#94a3b8'))}}>
                          {st === 'Chờ duyệt bản thảo' ? (formData.isManagerApprovedDraft ? '✓ TP duyệt' : '○ Chờ TP') : (formData.isManagerApprovedSigned ? '✓ TP duyệt' : '○ Chờ TP')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <fieldset disabled={isReadOnly} style={{ border: 'none', margin: 0, padding: 0 }}>
            {/* Section 1: Thông tin chung */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon"><User size={20} /></div>
                <h3>Thông tin chung chuyên trách</h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>Khách hàng <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <select
                      id="customerId"
                      className={formErrors.customerId ? 'has-error' : ''}
                      value={formData.customerId}
                      onChange={(e) => {
                        handleCustomerChange(e.target.value);
                        if (e.target.value) setFormErrors({ ...formErrors, customerId: null });
                      }}
                      disabled={isReadOnly || !!formData.leadId}
                      style={{ width: '100%', borderColor: formErrors.customerId ? 'red' : undefined }}
                    >
                      <option value="">-- Chọn khách hàng --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {formErrors.customerId && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.customerId}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Tên viết tắt</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    disabled
                    placeholder="Tự động theo khách hàng"
                  />
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>AM phụ trách <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <select
                      id="amName"
                      className={formErrors.amName ? 'has-error' : ''}
                      value={formData.amName}
                      onChange={(e) => {
                        setFormData({ ...formData, amName: e.target.value });
                        if (e.target.value) setFormErrors({ ...formErrors, amName: null });
                      }}
                      disabled={isReadOnly}
                      style={{ width: '100%', borderColor: formErrors.amName ? 'red' : undefined }}
                    >
                      <option value="">-- Chọn AM phụ trách --</option>
                      <option value="Phạm Quang Mạnh">Phạm Quang Mạnh</option>
                      <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                      <option value="Trần Thị B">Trần Thị B</option>
                      <option value="Lê Văn C">Lê Văn C</option>
                    </select>
                    {formErrors.amName && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.amName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Đơn vị xúc tiến</label>
                  <input
                    type="text"
                    value={formData.promotionUnit}
                    onChange={(e) => setFormData({ ...formData, promotionUnit: e.target.value })}
                    disabled={isReadOnly}
                    placeholder="VD: Phòng Bán hàng"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Chi tiết Hợp đồng */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon"><Briefcase size={20} /></div>
                <h3>Chi tiết Hợp đồng nghiệp vụ</h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>Số Hợp đồng <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <input
                      id="contractNo"
                      className={formErrors.contractNo ? 'has-error' : ''}
                      type="text"
                      value={formData.contractNo}
                      onChange={(e) => {
                        setFormData({ ...formData, contractNo: e.target.value });
                        if (e.target.value) setFormErrors({ ...formErrors, contractNo: null });
                      }}
                      disabled={isReadOnly}
                      style={{ width: '100%', borderColor: formErrors.contractNo ? 'red' : undefined }}
                    />
                    {formErrors.contractNo && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.contractNo}</span>}
                  </div>
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>Tên Hợp đồng <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <input
                      id="name"
                      className={formErrors.name ? 'has-error' : ''}
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (e.target.value) setFormErrors({ ...formErrors, name: null });
                      }}
                      disabled={isReadOnly}
                      placeholder="VD: Hợp đồng triển khai phần mềm..."
                      style={{ width: '100%', borderColor: formErrors.name ? 'red' : undefined }}
                    />
                    {formErrors.name && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.name}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Loại dịch vụ</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Dịch vụ CC outsourcing">Dịch vụ CC outsourcing</option>
                    <option value="Dịch vụ BPO">Dịch vụ BPO</option>
                    <option value="Giải pháp, platform">Giải pháp, platform</option>
                    <option value="Upsell">Upsell (Telesale, digital sale)</option>
                    <option value="Loyalty">Loyalty, quà tặng</option>
                    <option value="Khác">Dịch vụ khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Loại dự án</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Duy trì">Duy trì</option>
                    <option value="Mới_xúc tiến">Mới_xúc tiến</option>
                    <option value="Mới_khác">Mới_khác</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phân loại khách hàng</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Nội bộ">Nội bộ</option>
                    <option value="Ngoài">Ngoài</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Thời gian & Giá trị */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon"><DollarSign size={20} /></div>
                <h3>Thời gian & Giá trị (Chưa VAT)</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ngày ký HĐ</label>
                  <input
                    type="date"
                    value={formData.signedDate}
                    onChange={(e) => setFormData({ ...formData, signedDate: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>Ngày hiệu lực <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <input
                      id="effectiveDate"
                      className={formErrors.effectiveDate ? 'has-error' : ''}
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => {
                        handleEffectiveDateChange(e.target.value);
                        if (e.target.value) setFormErrors({ ...formErrors, effectiveDate: null });
                      }}
                      disabled={isReadOnly}
                      style={{ width: '100%', borderColor: formErrors.effectiveDate ? 'red' : undefined }}
                    />
                    {formErrors.effectiveDate && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.effectiveDate}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label>Giá trị HĐ (chưa VAT) <span className="required">*</span></label>
                  <div style={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                    <div className="price-input-wrapper" style={{ width: '100%' }}>
                      <input
                        id="contractValue"
                        className={formErrors.contractValue ? 'has-error' : ''}
                        type="text"
                        value={formData.contractValue}
                        onChange={(e) => {
                          setFormData({ ...formData, contractValue: e.target.value });
                          if (e.target.value) setFormErrors({ ...formErrors, contractValue: null });
                        }}
                        disabled={isReadOnly}
                        placeholder="0"
                        style={{ width: '100%', borderColor: formErrors.contractValue ? 'red' : undefined }}
                      />
                      <span className="currency-label">VNĐ</span>
                    </div>
                    {formErrors.contractValue && <span style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{formErrors.contractValue}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Đơn giá</label>
                  <div className="price-input-wrapper">
                    <input
                      type="text"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="0"
                    />
                    <span className="currency-label">VNĐ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Trạng thái & Vận hành */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon"><Activity size={20} /></div>
                <h3>Trạng thái & Vận hành thực tế</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tình trạng Hợp đồng</label>
                  <select
                    value={formData.contractStatus}
                    onChange={(e) => setFormData({ ...formData, contractStatus: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Đang hiệu lực">Đang hiệu lực</option>
                    <option value="Hết hiệu lực">Hết hiệu lực</option>
                    <option value="Dừng hợp đồng">Dừng hợp đồng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tình trạng triển khai</label>
                  <select
                    value={formData.implementationStatus}
                    onChange={(e) => setFormData({ ...formData, implementationStatus: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Chưa triển khai">Chưa triển khai</option>
                    <option value="Đang triển khai">Đang triển khai</option>
                    <option value="Đã triển khai">Đã triển khai</option>
                    <option value="Ngừng triển khai">Ngừng triển khai</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tình trạng doanh thu</label>
                  <select
                    value={formData.revenueStatus}
                    onChange={(e) => setFormData({ ...formData, revenueStatus: e.target.value })}
                    disabled={isReadOnly}
                  >
                    <option value="Chưa lên doanh thu">Chưa lên doanh thu</option>
                    <option value="Đã lên doanh thu">Đã lên doanh thu</option>
                    <option value="Ngừng lên doanh thu">Ngừng lên doanh thu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tháng ghi nhận HĐ</label>
                  <input
                    type="text"
                    value={formData.revenueMonth}
                    disabled
                    placeholder="Tự động từ Ngày hiệu lực"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Nội dung dịch vụ cung cấp</label>
                  <textarea
                    rows="3"
                    value={formData.serviceContent}
                    onChange={(e) => setFormData({ ...formData, serviceContent: e.target.value })}
                    disabled={isReadOnly}
                    placeholder="Mô tả chi tiết các dịch vụ cung cấp..."
                  />
                </div>
                <div className="form-group full-width">
                  <label>Ghi chú</label>
                  <textarea
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={isReadOnly}
                    placeholder="Ghi chú thêm nếu có..."
                  />
                </div>
              </div>
            </div>
          </fieldset>
            {/* Bổ sung Upload File khu vực dành riêng cho Đã duyệt */}
            {(formData.approvalStatus === 'Chờ Upload' || formData.approvalStatus === 'Chờ duyệt bản ký' || formData.approvalStatus === 'Hiệu lực') && (
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon"><Paperclip size={20} /></div>
                  <h3>File Trình Ký (Bản Cứng)</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Tệp đính kèm chữ ký <span className="required">*</span></label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                      {formData.approvalStatus === 'Chờ Upload' && (
                        <div>
                          <input 
                            type="file" 
                            id="contractUploadInput" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const file = e.target.files[0];
                                setUploadedFile({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + 'MB' });
                              }
                            }} 
                          />
                          <button 
                            className="btn" 
                            style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => document.getElementById('contractUploadInput').click()}
                          >
                            <Paperclip size={14} style={{ display: 'inline', marginRight: '6px' }}/> Chọn File Tải Lên
                          </button>
                        </div>
                      )}
                      {(uploadedFile || formData.approvalStatus === 'Chờ duyệt bản ký' || formData.approvalStatus === 'Hiệu lực') && (
                        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#0f172a' }}>
                          <CheckCircle2 size={16} color="#16a34a" style={{ marginRight: '8px' }}/> {uploadedFile ? uploadedFile.name : 'Ban_Trinh_Ky_01.pdf'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Section 5: Đơn hàng đang triển khai */}
            {formData.customerId && (
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon"><Briefcase size={20} /></div>
                  <h3>Đơn hàng đang triển khai</h3>
                </div>
                <div style={{ padding: '0 0 16px 0' }}>
                  <table className="order-progress-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 600, color: '#475569' }}>ID đơn hàng</th>
                        <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Trạng thái</th>
                        <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'DH-2026-001', status: 'Đang triển khai', revenue: '450,000,000 VNĐ' },
                        { id: 'DH-2026-004', status: 'Đang triển khai', revenue: '125,000,000 VNĐ' }
                      ].map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 600 }}>{order.id}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{order.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Tổng doanh thu đang triển khai: </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#e32b4c' }}>575,000,000 VNĐ</span>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* CHATTER SECTION */}
        <div className="chatter-container" style={{ width: '100%' }}>
          <div className="notebook" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="notebook-tabs" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: 'white', padding: '0 16px' }}>
              <div className={`notebook-tab ${activeNotebookTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('notes')} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: activeNotebookTab === 'notes' ? '2px solid #ed0029' : '2px solid transparent', color: activeNotebookTab === 'notes' ? '#ed0029' : '#4c4c4c', fontWeight: activeNotebookTab === 'notes' ? 600 : 500, fontSize: '14px', transition: 'all 0.2s' }}>Ghi chú</div>
              <div className={`notebook-tab ${activeNotebookTab === 'history' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('history')} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: activeNotebookTab === 'history' ? '2px solid #ed0029' : '2px solid transparent', color: activeNotebookTab === 'history' ? '#ed0029' : '#4c4c4c', fontWeight: activeNotebookTab === 'history' ? 600 : 500, fontSize: '14px', transition: 'all 0.2s' }}>Lịch sử hoạt động</div>
            </div>

            <div className="notebook-content" style={{ padding: '24px' }}>
                <div className="chatter-in-tab">
                  {activeNotebookTab === 'notes' ? (
                    <>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <div className="chatter-avatar-small" style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0, overflow: 'hidden' }}><img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                        <div style={{ flex: 1 }}>
                            <div className="chatter-input-box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', transition: 'border-color 0.2s' }}>
                                <textarea className="chatter-textarea" style={{ width: '100%', border: 'none', padding: '12px 16px', minHeight: '80px', resize: 'vertical', fontSize: '14px', outline: 'none', borderRadius: '8px', boxSizing: 'border-box' }} placeholder="Log an internal note..." value={chatterInput} onChange={(e) => setChatterInput(e.target.value)}></textarea>
                                <div className="chatter-input-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                                    <div className="chatter-toolbar-left" style={{ display: 'flex', gap: '14px', color: '#64748b' }}>
                                        <Smile size={18} style={{ cursor: 'pointer' }} />
                                        <Paperclip size={18} style={{ cursor: 'pointer' }} />
                                    </div>
                                    <div className="chatter-toolbar-right"><Maximize2 size={16} style={{ color: '#64748b', cursor: 'pointer' }} /></div>
                                </div>
                            </div>
                            <button className="btn-log-odoo" style={{ background: '#ed0029', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '12px' }} onClick={postNote}>Ghi</button>
                        </div>
                      </div>
                      
                      <div className="chatter-messages" style={{ display: 'flex', flexDirection: 'column' }}>
                        {chatterMessages.filter(msg => msg.type === 'note').map(msg => (
                          <div key={msg.id} className="message-item-odoo" style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div className="chatter-avatar-small" style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0, overflow: 'hidden' }}>
                                <img src={msg.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${msg.author}&backgroundColor=b6e3f4`} alt="Author" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </div>
                            <div className="message-content-wrapper" style={{ flex: 1 }}>
                              <div className="message-author-info" style={{ marginBottom: '4px' }}>
                                  <span className="message-author-name" style={{ fontWeight: 600, color: '#0f172a', marginRight: '8px' }}>{msg.author}</span>
                                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>- {msg.time}</span>
                              </div>
                              <div className="message-body-odoo" style={{ whiteSpace: 'pre-wrap', color: '#334155', fontSize: '14px', lineHeight: 1.5 }}>
                                  {msg.text}
                              </div>
                            </div>
                          </div>
                        ))}
                        {chatterMessages.filter(msg => msg.type === 'note').length === 0 && (
                          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0' }}>Chưa có ghi chú nào</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="chatter-messages" style={{ display: 'flex', flexDirection: 'column' }}>
                        {chatterMessages.filter(msg => msg.type === 'log').map(msg => (
                          <div key={msg.id} className="message-item-odoo" style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div className="chatter-avatar-small" style={{ width: '40px', height: '40px', borderRadius: msg.author === 'Hệ thống' ? '50%' : '8px', flexShrink: 0, overflow: 'hidden' }}>
                                <img src={msg.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${msg.author}&backgroundColor=cbd5e1`} alt="Author" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </div>
                            <div className="message-content-wrapper" style={{ flex: 1 }}>
                              <div className="message-author-info" style={{ marginBottom: '4px' }}>
                                  <span className="message-author-name" style={{ fontWeight: 600, color: '#0f172a', marginRight: '8px' }}>{msg.author}</span>
                                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>- {msg.time}</span>
                              </div>
                              <div className="message-body-odoo" style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                                  {msg.text}
                              </div>
                            </div>
                          </div>
                        ))}
                        {chatterMessages.filter(msg => msg.type === 'log').length === 0 && (
                          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0' }}>Chưa có bản ghi lịch sử</div>
                        )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

      </div> {/* <-- Closes form-chatter-wrapper */}
      {/* REJECT MODAL */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '500px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Từ chối phê duyệt</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >×</button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Lý do từ chối <span style={{ color: 'red' }}>*</span></label>
                <select
                  value={rejectData.reason}
                  onChange={e => setRejectData({ ...rejectData, reason: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="">Chọn lý do...</option>
                  <option value="Thông tin khách hàng sai">Thông tin khách hàng sai</option>
                  <option value="Giá trị HĐ không hợp lệ">Giá trị HĐ không hợp lệ</option>
                  <option value="Chưa đủ điều kiện phê duyệt">Chưa đủ điều kiện phê duyệt</option>
                  <option value="Lý do khác">Lý do khác</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Mô tả thêm</label>
                <textarea
                  rows="3"
                  value={rejectData.description}
                  onChange={e => setRejectData({ ...rejectData, description: e.target.value })}
                  placeholder="Nhập chi tiết về lỗi hoặc yêu cầu bổ sung..."
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
              <button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }} onClick={() => setShowRejectModal(false)}>Hủy bỏ</button>
              <button style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }} onClick={confirmReject}>Xác nhận từ chối</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ContractForm;

