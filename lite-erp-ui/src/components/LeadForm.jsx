/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X, MessageSquare, ArrowDownToLine, Smile, Paperclip, Maximize2, Activity, Edit2 } from 'lucide-react';
import './LeadForm.css';
import { mockStore } from '../utils/mockStore';

// --- MOCK DATA ---
const CLIENT_DB = [
  { id: 'VCB', name: 'Vietcombank', type: 'Doanh nghiệp', mst: '0100112437', phone: '02439343137', addr: '198 Trần Quang Khải, Hà Nội', domain: 'tc' },
  { id: 'VGR', name: 'Vingroup', type: 'Doanh nghiệp', mst: '0101245486', phone: '02439749999', addr: 'Lotte Center, Hà Nội', domain: 'bds' },
];

const EMPLOYEES = ['Trần B (Bạn)', 'Nguyễn Văn A', 'Lê Thị C'];

const PROVINCES = [{ id: 'HN', name: 'Hà Nội' }, { id: 'HCM', name: 'TP. Hồ Chí Minh' }];
const DISTRICTS = {
  'HN': [{ id: 'CG', name: 'Quận Cầu Giấy' }, { id: 'NTL', name: 'Quận Nam Từ Liêm' }],
  'HCM': [{ id: 'Q1', name: 'Quận 1' }, { id: 'TB', name: 'Quận Tân Bình' }]
};
const WARDS = {
  'CG': [{ id: 'DH', name: 'Phường Dịch Vọng Hậu' }, { id: 'MD', name: 'Phường Mai Dịch' }],
  'NTL': [{ id: 'MD1', name: 'Phường Mỹ Đình 1' }],
  'Q1': [{ id: 'BN', name: 'Phường Bến Nghé' }],
  'TB': [{ id: 'P2', name: 'Phường 2' }]
};

const SERVICE_OPTIONS_BY_PROJECT = {
  solution: ['KnowxHUB', 'OmniX', 'WorkForceX', 'AgentMate', 'CXBot'],
  service: ['Chăm sóc khách hàng', 'Tổng đài viên', 'Cho thuê nhân sự']
};

const createEmptyServiceLine = () => ({
  id: Date.now() + Math.random(),
  projectCategory: '',
  service: '',
  description: ''
});

const INITIAL_POSITIONS = [{id: 'TĐ', name: 'Trưởng Đài'}, {id: 'GD', name: 'Giám Đốc'}];
const INITIAL_PARTNERS = [
  { id: 'PN1', name: 'Azure Interior', phone: '+58 212 6...', email: 'vauxoo@yourcompany', city: 'Fremont', country: 'United States', level: 'Silver' },
  { id: 'PN2', name: 'Gemini Furniture', phone: '+1 312 34...', email: 'john.b@tech.info', city: 'Fairfield', country: 'United States', level: 'Silver' },
  { id: 'PN3', name: 'Lumber Inc', phone: '(828)-316...', email: 'lumber@example.com', city: 'Stockton', country: 'United States', level: 'Gold' },
  { id: 'PN4', name: 'Ready Mat', phone: '(803)-873...', email: 'info@deltapc.com', city: 'Tracy', country: 'United States', level: 'Bronze' },
  { id: 'PN5', name: 'The Jackson Group', phone: '(334)-502...', email: 'jackson@group.com', city: 'Tracy', country: 'United States', level: 'Gold' },
  { id: 'PN6', name: 'Wood Corner', phone: '(623)-853...', email: 'bhu@ic.example.com', city: 'Turlock', country: 'United States', level: 'Gold' },
];

const INITIAL_CONTACTS_DB = [
  { id: 'CT1', name: 'Nguyễn Văn Định', phone: '0901234567', email: 'dinh.nv@vcb.com.vn', positionId: 'TĐ', active: true },
  { id: 'CT2', name: 'Lê Minh Trí', phone: '0987654321', email: 'tri.lm@vingroup.net', positionId: 'GD', active: true },
  { id: 'CT3', name: 'Phạm Hồng Thái', phone: '0912345678', email: 'thai.ph@fsoft.com.vn', positionId: 'GD', active: false }
];

const INITIAL_FORM_STATE = {
  leadName: '', probability: 10,
  contactDate: new Date().toISOString().split('T')[0],
  issueMonth: '',
  addressDetail: '', province: '', district: '', ward: '',
  logicLeadLost: false,
};

// --- MAIN COMPONENT ---
const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // TABS
  const [activeNotebookTab, setActiveNotebookTab] = useState('internal_notes');
  const [activeChatterTab, setActiveChatterTab] = useState('log_note');

  // FORM DATA (Flatten basic fields for easy tracking)
  const [formData, setFormData] = useState({...INITIAL_FORM_STATE});
  const [snapshotData, setSnapshotData] = useState({...INITIAL_FORM_STATE});

  // COMPLEX DATA LISTS
  const [serviceDetails, setServiceDetails] = useState([createEmptyServiceLine()]);
  const [snapshotServices, setSnapshotServices] = useState([createEmptyServiceLine()]);
  
  const [contacts, setContacts] = useState([]);
  const [snapshotContacts, setSnapshotContacts] = useState([]);

  // RELATIONAL DATA (Positions & Partners)
  const [positionsData, setPositionsData] = useState([...INITIAL_POSITIONS]);
  const [partnersData, setPartnersData] = useState([...INITIAL_PARTNERS]);
  const [contactsDbData, setContactsDbData] = useState([...INITIAL_CONTACTS_DB]);

  // UI STATE
  const [clientAbbr, setClientAbbr] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientSuggest, setShowClientSuggest] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [mstValue, setMstValue] = useState('');
  const [domainValue, setDomainValue] = useState('');
  const [sourceValue, setSourceValue] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [campaignValue, setCampaignValue] = useState('');
  const [activityTypes, setActivityTypes] = useState(['Email', 'Gọi điện', 'Hội họp', 'Việc cần làm']);
  const [newActTypeName, setNewActTypeName] = useState('');

  // CHATTER LOGS & ACTIVITIES
  const [chatterMessages, setChatterMessages] = useState([
    { id: 1, type: 'log', author: 'Hệ', text: 'Gắn nhãn: Mới', time: '10 phút trước', bg: 'white'}
  ]);
  const [activities, setActivities] = useState([]);
  const [chatterInput, setChatterInput] = useState('');
  const [showMention, setShowMention] = useState(false);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);

  // MODALS STATE
  const [modalState, setModalState] = useState({ open: false, type: '', contactId: null, searchInput: '' });

  // VALIDATION & PIPELINE STATE
  const nameRef = useRef(null);
  const mstRef = useRef(null);
  const clientRef = useRef(null);
  const domainRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [lostReason, setLostReason] = useState('');
  const [lostDesc, setLostDesc] = useState('');
  
  const [leadStatus, setLeadStatus] = useState('Mới');
  const isEditable = leadStatus === 'Mới';

  // LOAD EXISTING LEAD
  useEffect(() => {
    if (id && id !== 'new') {
      const task = mockStore.getLead(id);
      if (task) {
        const mappedService = task.projectedService === 'Kiểm soát / Nhập liệu' ? 'service'
          : task.projectedService === 'Chăm sóc khách hàng' ? 'service'
          : task.projectedService === 'Telesales' ? 'service'
          : 'solution';
        setFormData(prev => ({
          ...prev,
          leadName: task.content || '',
          probability: parseInt(task.probability) || 0,
        }));
        setServiceDetails([{
          id: Date.now() + Math.random(),
          projectCategory: mappedService,
          service: task.projectedService || '',
          description: ''
        }]);
        setSnapshotServices([{
          id: Date.now() + Math.random(),
          projectCategory: mappedService,
          service: task.projectedService || '',
          description: ''
        }]);
        setSelectedClient({ id: 'dummy', name: task.company, type: task.tags?.find(t => t.text === 'Doanh nghiệp') ? 'Doanh nghiệp' : 'Nội bộ', mst: task.mst, phone: '', addr: '', domain: '' });
        setClientSearch(task.company || '');
        setClientAbbr(task.id ? task.id.split('-')[0] : '');
        setMstValue(task.mst || '');
      }
    }
  }, [id]);

  // -------------------------
  // HANDLE BASIC FORM DATA
  // -------------------------
  const hf = (field, val) => {
    setFormData(prev => ({...prev, [field]: val}));
    // Address cascade reset
    if (field === 'province') {
      setFormData(prev => ({...prev, district: '', ward: ''}));
    }
    if (field === 'district') {
      setFormData(prev => ({...prev, ward: ''}));
    }
  };

  // -------------------------
  // SAVE, TRACKING & REVERT
  // -------------------------
  const commitSave = () => {
    // Validate
    const newErrors = {};
    if (!formData.leadName.trim()) newErrors.leadName = true;
    if (!clientSearch.trim()) newErrors.clientSearch = true;
    if (!domainValue) newErrors.domainValue = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.leadName) nameRef.current?.focus();
      else if (newErrors.clientSearch) clientRef.current?.focus();
      else if (newErrors.domainValue) domainRef.current?.focus();
      return;
    }

    const changes = [];
    
    // Compare Form Data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== snapshotData[key]) {
        changes.push(`Đã đổi [${key}]: từ '${snapshotData[key]}' thành '${formData[key]}'`);
      }
    });

    if (changes.length > 0) {
      const logText = `Hệ thống ghi nhận thay đổi:\n` + changes.map(c => `- ${c}`).join('\n');
      addChatterMessage('log', 'Hệ', logText, 'just now', '#fef3c7');
    }

    // New Snapshot
    setSnapshotData({...formData});
    setSnapshotContacts([...contacts]);
    setSnapshotServices([...serviceDetails]);

    // Save to global Mock Store
    const isNew = !id || id === 'new';
    const finalStatus = isNew ? 'Mới' : leadStatus;
    const newId = (id && id !== 'new') ? id : mockStore.getNextLeadId(clientAbbr || 'LEAD');
    
    const primaryService = serviceDetails.find((line) => line.service)?.service || '';

    const leadData = {
      id: newId,
      content: formData.leadName,
      company: clientSearch,
      mst: mstValue,
      projectedService: primaryService,
      probability: `${formData.probability}%`,
      status: finalStatus,
      tags: selectedClient?.type === 'Doanh nghiệp' ? [{text: 'Doanh nghiệp', color: '#dcfce7', textCol: '#166534'}] : [{text: 'Nội bộ', color: '#e0e7ff', textCol: '#3730a3'}],
      revenue: '0 ₫',
      salesperson: 'Trần B',
      date: new Date().toLocaleDateString('vi-VN'),
      attachments: 0,
      comments: 0,
      avatars: [],
      activity: null,
      chatterMessages: chatterMessages
    };
    
    mockStore.saveLead(newId, leadData);

    alert(`Đã lưu dữ liệu Lead ${isNew ? 'mới ' : ''}thành công!`);
    if (isNew) {
      navigate(`/lead/edit/${newId}`, { replace: true });
    }
  };

  const revertChanges = () => {
    setFormData({...snapshotData});
    setContacts([...snapshotContacts]);
    setServiceDetails([...snapshotServices]);
    alert('Đã phục hồi dữ liệu ban đầu!');
  };

  // -------------------------
  // LOST / RESTORE LOGIC
  // -------------------------
  const handleLostConfirm = () => {
    setLeadStatus('Không thành công');
    if (id) mockStore.updateLeadStatus(id, 'Không thành công');
    addChatterMessage('log', 'Hệ', `Đánh dấu nhãn: KHÔNG THÀNH CÔNG\nLý do: ${lostReason}\nMô tả: ${lostDesc}`, 'just now', '#fee2e2');
    closeSearchModal();
  };

  const handleRestore = () => {
    setLeadStatus('Mới');
    if (id) mockStore.updateLeadStatus(id, 'Mới');
    addChatterMessage('log', 'Hệ', 'Đã khôi phục Lead về Mới', 'just now', '#dcfce7');
  };

  const handleConvert = () => {
    const oppErrors = {};
    if (!formData.leadName.trim()) oppErrors.leadName = true;
    if (!clientSearch.trim()) oppErrors.clientSearch = true;
    if (!mstValue.trim()) oppErrors.mstValue = true;
    if (!domainValue) oppErrors.domainValue = true;
    const hasValidServiceLine = serviceDetails.some(
      (line) => line.projectCategory && line.service
    );
    if (!hasValidServiceLine) oppErrors.serviceDetails = true;

    if (Object.keys(oppErrors).length > 0) {
      setErrors(oppErrors);
      alert("Vui lòng nhập đủ các trường: Tên lead, Dịch vụ, Tên khách hàng, MST, Lĩnh vực để chuyển thành Opportunity.");
      if (oppErrors.leadName) nameRef.current?.focus();
      else if (oppErrors.clientSearch) clientRef.current?.focus();
      else if (oppErrors.mstValue) mstRef.current?.focus();
      else if (oppErrors.domainValue) domainRef.current?.focus();
      return;
    }

    setLeadStatus('Đang tiếp xúc');
    if (id) mockStore.updateLeadStatus(id, 'Đang tiếp xúc');
    addChatterMessage('log', 'Hệ', 'Chuyển trạng thái sang Đang tiếp xúc (Opportunity)', 'just now', '#e0e7ff');
  };

  // -------------------------
  // LIST HANDLERS
  // -------------------------
  const toggleContactStatus = (id) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };
  const addContactLine = () => setContacts([...contacts, { id: Date.now(), name: '', phone: '', email: '', positionId: '', active: true }]);
  const removeContact = (id) => setContacts(contacts.filter(c => c.id !== id));
  const updateContact = (id, field, val) => setContacts(contacts.map(c => c.id === id ? { ...c, [field]: val } : c));

  const addServiceLine = () => {
    setServiceDetails([...serviceDetails, createEmptyServiceLine()]);
    setErrors((prev) => ({ ...prev, serviceDetails: false }));
  };
  const removeService = (id) => setServiceDetails(serviceDetails.filter(s => s.id !== id));
  const updateService = (id, field, val) => {
    if (field === 'projectCategory' || field === 'service') {
      setErrors((prev) => ({ ...prev, serviceDetails: false }));
    }
    setServiceDetails(
      serviceDetails.map(s => {
        if (s.id !== id) return s;
        if (field === 'projectCategory') {
          return { ...s, projectCategory: val, service: '' };
        }
        return { ...s, [field]: val };
      })
    );
  };

  // -------------------------
  // CUSTOM AUTOCOMPLETE / ODOO SELECT POPUP
  // -------------------------
  const openSearchModal = (type, contactId = null) => {
    setModalState({ open: true, type, contactId, searchInput: '' });
  };
  const closeSearchModal = () => setModalState({ open: false, type: '', contactId: null, searchInput: '' });

  const confirmModalCreate = () => {
    const { type, contactId, searchInput } = modalState;
    if (!searchInput.trim()) return;

    if (type === 'position') {
      const newPos = { id: `P_${Date.now()}`, name: searchInput };
      setPositionsData([...positionsData, newPos]);
      if (contactId) updateContact(contactId, 'positionId', newPos.id);
      closeSearchModal();
    } else if (type === 'partner') {
      const newPartner = { id: `PN_${Date.now()}`, name: searchInput };
      setPartnersData([...partnersData, newPartner]);
      hf('partnerId', newPartner.id); // Assuming partnerId is in form
      closeSearchModal();
    } else if (type === 'contact_search') {
      const newCt = { id: `CT_${Date.now()}`, name: searchInput, phone: '', email: '', positionId: '', active: true };
      setContactsDbData([...contactsDbData, newCt]);
      if (contactId) {
        updateContact(contactId, 'contactDbId', newCt.id);
        updateContact(contactId, 'name', newCt.name);
        updateContact(contactId, 'phone', newCt.phone);
        updateContact(contactId, 'email', newCt.email);
        updateContact(contactId, 'positionId', newCt.positionId);
        updateContact(contactId, 'active', newCt.active);
      }
      closeSearchModal();
    }
  };

  const handleSelectModalItem = (id) => {
    const { type, contactId } = modalState;
    if (type === 'position' && contactId) updateContact(contactId, 'positionId', id);
    if (type === 'partner') hf('partnerId', id);
    if (type === 'contact_search' && contactId) {
      const cDb = contactsDbData.find(c => c.id === id);
      if (cDb) {
        updateContact(contactId, 'contactDbId', cDb.id);
        updateContact(contactId, 'name', cDb.name);
        updateContact(contactId, 'phone', cDb.phone || '');
        updateContact(contactId, 'email', cDb.email || '');
        updateContact(contactId, 'positionId', cDb.positionId || '');
        updateContact(contactId, 'active', cDb.active !== undefined ? cDb.active : true);
      }
    }
    closeSearchModal();
  };

  // -------------------------
  // CLIENT SELECT PIPELINE
  // -------------------------
  const selectClient = (cli) => {
    setSelectedClient(cli);
    setClientAbbr(cli.id);
    setClientSearch(cli.name);
    setMstValue(cli.mst || '');
    setDomainValue(cli.domain || '');
    hf('addressDetail', cli.addr || '');
    if (contacts.length === 0 && cli.phone) {
      setContacts([{ id: Date.now(), name: cli.name, phone: cli.phone, email: '', positionId: '', active: true }]);
    }
    setShowClientSuggest(false);
  };
  const filteredClients = CLIENT_DB.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.mst.includes(clientSearch)
  );

  // -------------------------
  // CHATTER (Mention + Activities)
  // -------------------------
  const handleChatterChange = (e) => {
    const val = e.target.value;
    setChatterInput(val);
    const words = val.slice(0, e.target.selectionStart).split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      setShowMention(true);
      setMentionPos({ top: 40, left: 20 + (lastWord.length * 5) });
    } else { setShowMention(false); }
  };

  const insertMention = (emp) => {
    const textBefore = chatterInput.slice(0, textareaRef.current.selectionStart);
    const textAfter = chatterInput.slice(textareaRef.current.selectionStart);
    const words = textBefore.split(' ');
    words.pop();
    const newTextBefore = words.length > 0 ? words.join(' ') + ` @${emp} ` : `@${emp} `;
    setChatterInput(newTextBefore + textAfter);
    setShowMention(false);
    textareaRef.current.focus();
  };

  const addChatterMessage = (type, author, text, time, bg) => {
    setChatterMessages(prev => [{ id: Date.now(), type, author, text, time, bg }, ...prev]);
  };

  const postNote = () => {
    if(!chatterInput) return;
    addChatterMessage('log', 'Bạn', chatterInput, 'vừa xong', '#fef3c7');
    setChatterInput('');
  };

  const createActivity = () => {
    openSearchModal('activity');
  };

  const markActivityDone = (id) => {
    const act = activities.find(a=>a.id===id);
    setActivities(activities.filter(a => a.id !== id));
    addChatterMessage('log', 'Bạn', `Hoạt động hoàn tất (Done): ${act?.title}`, 'vừa xong', '#dcfce7');
  };

  // Helpers mappings
  const distOptions = formData.province ? (DISTRICTS[formData.province] || []) : [];
  const wardOptions = formData.district ? (WARDS[formData.district] || []) : [];
  const isDisabled = !isEditable;

  return (
    <div className="lead-form-container">
      {/* HEADER */}
      <div className="lead-form-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/opportunity')}>Danh sách Lead</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{id && id !== 'new' ? id : 'Mới'}</span>
        </div>
        <div className="header-actions" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
           {!isDisabled && leadStatus === 'Mới' && id && id !== 'new' && <button className="btn btn-secondary" style={{padding: '6px 12px', fontSize: '13px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1'}} onClick={handleConvert}>Chuyển thành Opportunity</button>}
           {!isDisabled && leadStatus !== 'Không thành công' && id && id !== 'new' && <button className="btn btn-danger" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={() => openSearchModal('lost_reason')}>Không thành công</button>}
           
           <div style={{width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px'}}></div>

           {leadStatus === 'Mới' && (
             <button className="btn btn-secondary" style={{padding: '6px 10px', backgroundColor: 'white', color: '#475569', display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1'}} onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
                  mockStore.deleteLead(id);
                  navigate('/opportunity');
                }
             }} title="Xóa">
               <Trash2 size={16} />
             </button>
           )}
           {leadStatus === 'Mới' && (
             <button className="btn btn-primary" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={commitSave}>Lưu</button>
           )}
        </div>
      </div>

      <div className="form-chatter-wrapper">
        
        {/* SHEET */}
        <div className="lead-form-sheet sheet-inner-wrapper">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <div className="statusbar" style={{ background: 'transparent', margin: 0, gap: '4px' }}>
              {['Mới', 'Đang tiếp xúc'].map((st) => {
                const isCurrent = leadStatus === st;
                return (
                  <div
                    key={st}
                    className="statusbar-item"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontWeight: 500,
                      fontSize: '13px',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: isCurrent ? '#E32B4C' : '#F8FAFC',
                      color: isCurrent ? 'white' : '#94A3B8',
                      cursor: 'default'
                    }}
                  >
                    {st}
                  </div>
                )
              })}
            </div>
          </div>
          {leadStatus === 'Không thành công' && (
            <div className="ribbon-wrapper">
              <div className="ribbon">KHÔNG THÀNH CÔNG</div>
            </div>
          )}
          <fieldset disabled={!isEditable} style={{border: 'none', margin: 0, padding: 0}}>
          <div className="sheet-title-section">
            <div className="oe_title">
              <label>Tên lead <span style={{color:'red'}}>*</span></label>
              <input type="text" ref={nameRef} className={`title-input ${errors.leadName ? 'has-error' : ''}`} placeholder="Nhập tên lead" value={formData.leadName} onChange={e=>{hf('leadName', e.target.value); setErrors(p=>({...p, leadName: false}))}} style={{borderColor: errors.leadName ? 'red' : undefined}}/>
              {errors.leadName && <small style={{color:'red', fontWeight: 500}}>Trường này là bắt buộc</small>}
            </div>
            <div className="probability-box">
              <label>Probability (%)</label>
              <input type="number" className="prob-input" value={formData.probability} onChange={e=>hf('probability', e.target.value)} />
            </div>
          </div>

          <div className="sheet-main-content">
            {/* L COLUMN */}
            <div className="form-column lead-section-card">
              <div className="column-title" style={{margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1}}>Thông tin chung</div>
              {id && (
                <div className="form-group">
                  <label className="form-label">ID</label>
                  <input type="text" className="form-control" readOnly value={id} />
                </div>
              )}
              {/* DỊCH VỤ CHI TIẾT */}
              <div className="form-group" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <label className="form-label" style={{width: '100%', marginBottom: '8px'}}>Dịch vụ chi tiết</label>
                <div className="service-row-header">
                  <span>Loại dự án</span>
                  <span>Dịch vụ</span>
                  <span>Mô tả sản phẩm</span>
                  <span></span>
                </div>
                <div className="service-rows">
                  {serviceDetails.map(srv => (
                    <div className="service-row" key={srv.id}>
                      <select
                        className="form-control"
                        value={srv.projectCategory}
                        onChange={e=>updateService(srv.id, 'projectCategory', e.target.value)}
                      >
                        <option value="">-- Chọn loại dự án --</option>
                        <option value="solution">Giải pháp</option>
                        <option value="service">Dịch vụ</option>
                      </select>
                      <select
                        className="form-control"
                        value={srv.service}
                        onChange={e=>updateService(srv.id, 'service', e.target.value)}
                        disabled={!srv.projectCategory}
                      >
                        <option value="">-- Chọn dịch vụ --</option>
                        {(SERVICE_OPTIONS_BY_PROJECT[srv.projectCategory] || []).map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        value={srv.description}
                        onChange={e=>updateService(srv.id, 'description', e.target.value)}
                        placeholder="Nhập mô tả sản phẩm"
                      />
                      <button type="button" className="icon-btn" onClick={() => removeService(srv.id)}>
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
                {errors.serviceDetails && <small style={{color: 'red', fontWeight: 500, marginTop: '6px'}}>Vui lòng thêm ít nhất 1 dòng dịch vụ hợp lệ</small>}
                <div className="add-line-btn" onClick={addServiceLine}>Thêm dịch vụ</div>
              </div>

              <div className="form-group">
                <label className="form-label">Doanh thu dự kiến</label>
                <input type="text" className="form-control" placeholder="0 ₫" />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-control" value={formData.priority || '1'} onChange={e=>hf('priority', e.target.value)}>
                  <option value="1">⭐ Thấp</option>
                  <option value="2">⭐⭐ Trung bình</option>
                  <option value="3">⭐⭐⭐ Cao</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select className="form-control" value={formData.tag || ''} onChange={e=>hf('tag', e.target.value)}>
                  <option value="">-- Để trống --</option>
                </select>
              </div>
            </div>

            {/* R COLUMN */}
            <div className="form-column lead-section-card">
              <div className="column-title" style={{margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1}}>Thông tin khách hàng</div>
              <div className="form-group" style={{alignItems: 'flex-start'}}>
                <label className="form-label" style={{marginTop: '6px'}}>Tên khách hàng <span style={{color:'red'}}>*</span></label>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <div style={{flex: '0 0 110px'}}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Viết tắt"
                        style={{borderColor: errors.clientAbbr ? 'red' : undefined, width: '100%'}}
                        value={clientAbbr}
                        onChange={e => { setClientAbbr(e.target.value); setErrors(p=>({...p, clientAbbr: false})); }}
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <div className="autocomplete-container">
                        <input
                          ref={clientRef}
                          type="text"
                          className="form-control"
                          placeholder="Tên đầy đủ *"
                          style={{borderColor: errors.clientSearch ? 'red' : undefined, width: '100%'}}
                          value={clientSearch}
                          onChange={e => { setClientSearch(e.target.value); setShowClientSuggest(true); setErrors(p=>({...p, clientSearch: false})); }}
                          onFocus={() => setShowClientSuggest(true)}
                          onBlur={() => setTimeout(() => setShowClientSuggest(false), 200)}
                        />
                        {showClientSuggest && clientSearch && (
                          <div className="dropdown-menu">
                            {filteredClients.length > 0 ? filteredClients.map(c => (
                              <div key={c.id} className="dropdown-item" onClick={() => selectClient(c)}>
                                <strong>[{c.id}] {c.name}</strong><br/>
                                <small style={{color: '#64748b'}}>MST: {c.mst}</small>
                              </div>
                            )) : (
                              <div className="dropdown-item" style={{color: '#94a3b8'}}>Không tìm thấy. Nhập thông tin thủ công.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.clientSearch && <small style={{color:'red', fontWeight: 500}}>Vui lòng nhập tên đầy đủ khách hàng</small>}
                </div>
              </div>

              <div className="form-group" style={{alignItems: 'flex-start'}}>
                <label className="form-label" style={{marginTop: '6px'}}>MST</label>
                <div style={{flex: 1}}>
                  <input type="text" ref={mstRef} className="form-control" style={{borderColor: errors.mstValue ? 'red' : undefined, width: '100%'}} placeholder="Mã số thuế" value={mstValue} onChange={(e) => {setMstValue(e.target.value); setErrors(p=>({...p, mstValue: false}))}} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phân loại</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="customer_type" checked={selectedClient ? selectedClient.type === 'Doanh nghiệp' : true} readOnly/> 
                    Doanh nghiệp
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="customer_type" checked={selectedClient ? selectedClient.type === 'Nội bộ' : false} readOnly/> 
                    Nội bộ
                  </label>
                </div>
              </div>

              <div className="form-group" style={{alignItems: 'flex-start'}}>
                <label className="form-label" style={{marginTop: '6px'}}>Lĩnh vực <span style={{color:'red'}}>*</span></label>
                <div style={{flex: 1}}>
                  <select ref={domainRef} className="form-control" style={{borderColor: errors.domainValue ? 'red' : undefined, width: '100%'}} value={domainValue} onChange={e=>{setDomainValue(e.target.value); setErrors(p=>({...p, domainValue: false}))}}>
                    <option value="">-- Chọn lĩnh vực --</option>
                    <option value="bds">Bất động sản</option>
                    <option value="tc">Tài chính</option>
                    <option value="cntt">CNTT / Viễn thông</option>
                  </select>
                  {errors.domainValue && <small style={{color:'red', display:'block', marginTop: '4px', fontWeight: 500}}>Trường này là bắt buộc</small>}
                </div>
              </div>

              {/* CUSTOM ADDRESS */}
              <div className="form-group" style={{alignItems: 'flex-start'}}>
                <label className="form-label" style={{paddingTop: '6px'}}>Địa chỉ</label>
                <div className="address-grid">
                  <input type="text" className="form-control" style={{width:'100%'}} placeholder="Địa chỉ chi tiết (nhà, ngõ...)" value={formData.addressDetail} onChange={e=>hf('addressDetail', e.target.value)} />
                  <div className="address-location-row">
                    <select className="form-control" value={formData.province} onChange={e=>hf('province', e.target.value)}>
                      <option value="">Tỉnh/TP</option>
                      {PROVINCES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select className="form-control" value={formData.district} onChange={e=>hf('district', e.target.value)} disabled={!formData.province}>
                      <option value="">Quận/Huyện</option>
                      {distOptions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select className="form-control" value={formData.ward} onChange={e=>hf('ward', e.target.value)} disabled={!formData.district}>
                      <option value="">Phường/Xã</option>
                      {wardOptions.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                <input type="text" className="form-control" placeholder="https://" />
              </div>

              <div className="form-group">
                <label className="form-label">Tag</label>
                <select className="form-control">
                  <option value="">-- Chọn tag --</option>
                  <option value="doanhnghiep">Doanh nghiệp</option>
                  <option value="noibo">Nội bộ</option>
                  <option value="vip">Khách hàng VIP</option>
                  <option value="tiemnang">Khách hàng Tiềm năng</option>
                </select>
              </div>

              {/* THÔNG TIN LIÊN HỆ */}
              <div className="contact-info-list" style={{marginTop: '16px'}}>
                <label className="form-label" style={{width: '100%', marginBottom: '8px', display: 'block'}}>Liên hệ khách hàng</label>
                <div className="contact-item" style={{fontWeight: 600, borderBottom: '2px solid #e2e8f0'}}>
                  <span>Tên</span><span>SĐT</span><span>Email</span><span>Vị trí</span><span style={{textAlign: 'center'}}>TT</span><span></span>
                </div>
                {contacts.map((contact) => (
                  <div className="contact-item" key={contact.id}>
                    <div style={{position: 'relative', width: '100%'}}>
                       <div style={{display: 'flex', alignItems: 'center', width: '100%', position: 'relative'}}>
                           <input 
                              type="text" 
                              className="form-control" 
                              style={{border:'none', outline:'none', width:'100%', background:'transparent', padding:'4px 20px 4px 4px', fontSize:'13px', cursor: 'pointer'}} 
                              placeholder="-- Tên liên hệ --"
                              value={contact.name || ''}
                              onChange={(e) => {
                                 updateContact(contact.id, 'name', e.target.value);
                                 updateContact(contact.id, 'showDropdown', true);
                              }}
                              onFocus={() => updateContact(contact.id, 'showDropdown', true)}
                              onBlur={() => setTimeout(() => updateContact(contact.id, 'showDropdown', false), 200)}
                           />
                           <span style={{position: 'absolute', right: '4px', pointerEvents: 'none', color: '#64748b', fontSize: '10px'}}>▼</span>
                       </div>
                       {contact.showDropdown && (
                         <div className="dropdown-menu" style={{top: '100%', left: 0, right: 0, width: '100%', minWidth: '150px', zIndex: 1000}}>
                            {contactsDbData.filter(c => c.name.toLowerCase().includes((contact.name||'').toLowerCase())).map(c => (
                               <div key={c.id} className="dropdown-item" onMouseDown={(e) => {
                                   e.preventDefault();
                                   updateContact(contact.id, 'name', c.name);
                                   updateContact(contact.id, 'phone', c.phone || '');
                                   updateContact(contact.id, 'email', c.email || '');
                                   updateContact(contact.id, 'contactDbId', c.id);
                                   updateContact(contact.id, 'positionId', c.positionId || '');
                                   updateContact(contact.id, 'active', c.active !== undefined ? c.active : true);
                                   updateContact(contact.id, 'showDropdown', false);
                               }}>
                                   {c.name}
                               </div>
                            ))}
                            {(contact.name||'').trim() !== '' && !contactsDbData.some(c => c.name.toLowerCase() === (contact.name||'').toLowerCase()) && (
                               <div className="dropdown-item" style={{color: '#2563eb', fontStyle: 'italic'}} onMouseDown={(e) => {
                                   e.preventDefault();
                                   const newCt = { id: `CT_${Date.now()}`, name: contact.name, phone: '', email: '', positionId: '', active: true };
                                   setContactsDbData([...contactsDbData, newCt]);
                                   updateContact(contact.id, 'contactDbId', newCt.id);
                                   updateContact(contact.id, 'showDropdown', false);
                               }}>
                                   + Tạo mới "{contact.name}"
                               </div>
                            )}
                            <div className="dropdown-item" style={{color: '#64748b', fontWeight: 500, borderTop: '1px solid #f1f5f9'}} onMouseDown={(e) => {
                                e.preventDefault();
                                updateContact(contact.id, 'showDropdown', false);
                                openSearchModal('contact_search', contact.id);
                            }}>
                                Tìm kiếm...
                            </div>
                         </div>
                       )}
                    </div>
                    <input type="text" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} value={contact.phone} onChange={e=>updateContact(contact.id, 'phone', e.target.value)} placeholder="SĐT..."/>
                    <input type="text" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} value={contact.email} onChange={e=>updateContact(contact.id, 'email', e.target.value)} placeholder="Email..."/>
                    
                    <div style={{position: 'relative'}}>
                       <select className="form-control" style={{width:'100%', padding:'2px', fontSize:'12px'}} value={contact.positionId} onChange={(e) => {
                         if(e.target.value === 'SEARCH_MORE') {
                           openSearchModal('position', contact.id);
                         } else updateContact(contact.id, 'positionId', e.target.value);
                       }}>
                         <option value="">-- Chọn --</option>
                         {positionsData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                         <option value="SEARCH_MORE" className="dropdown-action-item">Tìm kiếm...</option>
                       </select>
                    </div>

                    <span className={`status-badge ${contact.active ? 'status-active' : 'status-inactive'}`} onClick={() => toggleContactStatus(contact.id)}>
                      {contact.active ? 'Act' : 'Ina'}
                    </span>
                    <button className="icon-btn" onClick={() => removeContact(contact.id)}><Trash2 size={16}/></button>
                  </div>
                ))}
                <div className="add-line-btn" onClick={addContactLine} style={{marginTop: '8px', marginBottom: '8px'}}>Thêm liên hệ</div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginTop: '8px'}}></div>
              </div>
            </div>
          </div>

          <div className="notebook">
            <div className="notebook-tabs">
              <div className={`notebook-tab ${activeNotebookTab === 'internal_notes' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('internal_notes')}>Ghi chú nội bộ</div>
              <div className={`notebook-tab ${activeNotebookTab === 'extra_info' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('extra_info')}>Thông tin thêm</div>
            </div>

            <div className="notebook-content">
              {activeNotebookTab === 'internal_notes' && (
                <div style={{paddingTop: '16px'}}>
                  <textarea className="textarea-control" placeholder="Viết một ghi chú nội bộ..."></textarea>
                </div>
              )}
              {activeNotebookTab === 'extra_info' && (
                <div className="extra-info-grid">
                  <div className="form-column">
                    <div className="column-title" style={{fontSize: '14px', border: 'none', margin: '0 0 8px 0', padding: 0, color: '#64748b'}}>Mốc thời gian & Khác</div>
                    <div className="form-group">
                      <label className="form-label">Ngày bắt đầu tiếp xúc</label>
                      <input type="date" className="form-control" value={formData.contactDate} onChange={e=>hf('contactDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tháng phát hành</label>
                      <input type="month" className="form-control" value={formData.issueMonth} onChange={e=>hf('issueMonth', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tháng ký hợp đồng</label>
                      <input type="month" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Đầu mối nghiệp vụ VCX</label>
                      <select className="form-control">
                        <option value="">-- Chọn đầu mối --</option>
                        <option value="op1">Vận hành nhóm A</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="column-title" style={{fontSize: '14px', border: 'none', margin: '0 0 8px 0', padding: 0, color: '#64748b'}}>Sales & Marketing</div>
                    <div className="form-group">
                      <label className="form-label">Nguồn tiếp cận</label>
                      <select className="form-control" value={sourceValue} onChange={e=>setSourceValue(e.target.value)}>
                        <option value="">-- Chọn nguồn --</option>
                        <option value="marketing">Marketing</option>
                        <option value="referral">Giới thiệu</option>
                        <option value="landing">Landing page</option>
                        <option value="self">Tự tiếp cận</option>
                      </select>
                    </div>
                    {sourceValue === 'referral' && (
                      <div className="form-group">
                        <label className="form-label">Giới thiệu bởi</label>
                        <input type="text" className="form-control" placeholder="Tên người / đơn vị giới thiệu..." value={referredBy} onChange={e=>setReferredBy(e.target.value)} />
                      </div>
                    )}
                    {sourceValue === 'marketing' && (
                      <div className="form-group">
                        <label className="form-label">Chiến dịch (Campaign)</label>
                        <input type="text" className="form-control" placeholder="Tên chiến dịch marketing..." value={campaignValue} onChange={e=>setCampaignValue(e.target.value)} />
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Sale person</label>
                      <input type="text" className="form-control" readOnly value="Trần B (Bạn)" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Đơn vị xúc tiến</label>
                      <select className="form-control">
                        <option value="">-- Chọn đơn vị --</option>
                        <option value="b2b">Phòng bán hàng B2B</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assign partner</label>
                      <select className="form-control" value={formData.partnerId} onChange={(e) => {
                         if(e.target.value === 'SEARCH_MORE') openSearchModal('partner');
                         else hf('partnerId', e.target.value);
                       }}>
                         <option value="">-- Trống --</option>
                         {partnersData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                         <option value="SEARCH_MORE" className="dropdown-action-item">Tìm kiếm...</option>
                       </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </fieldset>
        </div>
      </div>

      {/* POPUP MODAL TÌM KIẾM TẠO NHANH */}
      {modalState.open && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalState.type === 'partner' ? 'modal-partner' : ''}`}>
            <div className="modal-header">
              <div className="modal-title">
                {modalState.type === 'position' ? 'Tìm kiếm & Phân quyền (Vị trí)' 
                  : modalState.type === 'activity' ? 'Hoạt động'
                  : 'Search: Assigned Partner'}
              </div>
              <button className="modal-close" onClick={closeSearchModal}><X size={20} /></button>
            </div>
            
            {modalState.type === 'lost_reason' ? (
              <div className="modal-body" style={{padding: '16px'}}>
                <div className="form-group" style={{flexDirection: 'column', alignItems: 'flex-start', border: 'none'}}>
                  <label className="form-label" style={{marginBottom: '8px'}}>Lý do Lost</label>
                  <select className="form-control" style={{width: '100%'}} value={lostReason} onChange={e=>setLostReason(e.target.value)}>
                    <option value="">-- Chọn lý do --</option>
                    <option value="Giá quá đắt">Giá quá đắt</option>
                    <option value="Không đủ tính năng">Không đủ tính năng</option>
                    <option value="Khách hàng đổi ý">Khách hàng đổi ý</option>
                  </select>
                </div>
                <div className="form-group" style={{flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px', border: 'none'}}>
                  <label className="form-label" style={{marginBottom: '8px'}}>Mô tả chi tiết</label>
                  <textarea className="form-control" style={{width: '100%', minHeight: '80px', padding: '8px'}} value={lostDesc} onChange={e=>setLostDesc(e.target.value)}></textarea>
                </div>
                <div className="modal-footer" style={{marginTop: '16px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px'}}>
                  <button className="btn btn-primary" onClick={handleLostConfirm} disabled={!lostReason}>Xác nhận Lost</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hủy</button>
                </div>
              </div>
            ) : modalState.type === 'activity' ? (
              <div className="modal-body" style={{padding: '16px'}}>
                <div className="form-group" style={{alignItems: 'flex-start', border: 'none'}}>
                  <label className="form-label" style={{width: '120px', minWidth: '120px'}}>Loại hoạt động</label>
                  <div style={{flex: 1, display: 'flex', gap: '8px'}}>
                    <select className="form-control" style={{flex: 1}} id="actType">
                      {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="btn btn-secondary" style={{padding: '4px 10px', fontSize: '12px', whiteSpace: 'nowrap'}} onClick={() => {
                      const name = newActTypeName.trim() || prompt('Nhập tên loại hoạt động mới:');
                      if (name && !activityTypes.includes(name)) {
                        setActivityTypes(prev => [...prev, name]);
                      }
                    }}>+ Tạo nhanh</button>
                  </div>
                </div>
                <div className="form-group" style={{alignItems: 'flex-start', marginTop: '12px', border: 'none'}}>
                  <label className="form-label" style={{width: '120px', minWidth: '120px'}}>Ngày hết hạn</label>
                  <input type="date" className="form-control" style={{flex: 1}} id="actDate" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group" style={{alignItems: 'flex-start', marginTop: '12px', border: 'none'}}>
                  <label className="form-label" style={{width: '120px', minWidth: '120px'}}>Tóm tắt</label>
                  <input type="text" className="form-control" style={{flex: 1}} id="actSummary" placeholder="e.g. Discuss proposal" />
                </div>
                <div className="modal-footer" style={{marginTop: '24px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px'}}>
                  <button className="btn btn-primary" onClick={() => {
                     const summary = document.getElementById('actSummary').value || document.getElementById('actType').value;
                     const date = document.getElementById('actDate').value;
                     setActivities(prev => [...prev, { id: Date.now(), title: summary, type: document.getElementById('actType').value, date, done: false }]);
                     addChatterMessage('log', 'Hệ', `Đã lên lịch hoạt động: ${summary} (Hạn: ${date})`, 'vừa xong', 'white');
                     closeSearchModal();
                  }}>Lên lịch & Đóng</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hủy</button>
                </div>
              </div>
            ) : modalState.type === 'partner' ? (
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div className="odoo-search-bar">
                  <div style={{display: 'flex', alignItems: 'center', border: '1px solid #71717a', borderRadius: '4px', padding: '4px 8px', width: '300px'}}>
                     <span style={{color: '#71717a', marginRight: '8px'}}>🔍</span>
                     <input type="text" style={{border: 'none', outline: 'none', flex: 1, fontSize: '13px'}} placeholder="Search..." value={modalState.searchInput} onChange={(e) => setModalState({...modalState, searchInput: e.target.value})} autoFocus />
                  </div>
                  <div style={{fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    1-6 / 6
                    <button style={{border: 'none', background: '#f1f5f9', padding: '4px 8px', cursor: 'pointer', color: '#64748b'}}>&lt;</button>
                    <button style={{border: 'none', background: '#f1f5f9', padding: '4px 8px', cursor: 'pointer', color: '#64748b'}}>&gt;</button>
                  </div>
                </div>
                <div className="partner-table-wrapper">
                  <table className="odoo-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Phone</th><th>Email</th><th>Salesperson</th><th>City</th><th>Country</th><th>Partner Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnersData.filter(d => d.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(item => (
                        <tr key={item.id} onClick={() => handleSelectModalItem(item.id)}>
                          <td>{item.name}</td><td>{item.phone}</td><td>{item.email}</td><td></td><td>{item.city}</td><td>{item.country}</td><td>{item.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer" style={{justifyContent: 'flex-start', padding: '12px 16px', background: 'white'}}>
                   <button className="btn" style={{backgroundColor: '#714B67', color: 'white', padding: '6px 16px', border: '1px solid #714B67'}}>New</button>
                   <button className="btn btn-secondary" onClick={closeSearchModal} style={{padding: '6px 16px'}}>Close</button>
                </div>
              </div>
            ) : modalState.type === 'contact_search' ? (
              <div className="modal-body" style={{padding: '16px'}}>
                <div style={{marginBottom: '16px', display: 'flex', gap: '8px'}}>
                   <input type="text" className="form-control" style={{flex: 1}} placeholder="Tìm theo tên..." value={modalState.searchInput} onChange={(e) => setModalState({...modalState, searchInput: e.target.value})} autoFocus />
                   <button className="btn btn-primary" style={{padding: '4px 12px'}} onClick={confirmModalCreate}>+ Tạo mới</button>
                </div>
                <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                   <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                     <thead style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                       <tr>
                         <th style={{padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0'}}>Tên liên hệ</th>
                         <th style={{padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0'}}>SĐT</th>
                         <th style={{padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0'}}>Email</th>
                         <th style={{padding: '8px', textAlign: 'left'}}>Vị trí</th>
                       </tr>
                     </thead>
                     <tbody>
                       {contactsDbData.filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(c => (
                         <tr key={c.id} style={{borderBottom: '1px solid #f1f5f9', cursor: 'pointer'}} className="dropdown-item" onClick={() => handleSelectModalItem(c.id)}>
                           <td style={{padding: '8px', borderRight: '1px solid #e2e8f0'}}>{c.name}</td>
                           <td style={{padding: '8px', borderRight: '1px solid #e2e8f0'}}>{c.phone}</td>
                           <td style={{padding: '8px', borderRight: '1px solid #e2e8f0'}}>{c.email}</td>
                           <td style={{padding: '8px'}}>{positionsData.find(p => p.id === c.positionId)?.name || c.positionId}</td>
                         </tr>
                       ))}
                       {contactsDbData.filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).length === 0 && (
                         <tr><td colSpan="4" style={{padding: '16px', textAlign: 'center', color: '#94a3b8'}}>Không tìm thấy liên hệ nào.</td></tr>
                       )}
                     </tbody>
                   </table>
                </div>
                <div className="modal-footer" style={{marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end'}}>
                   <button className="btn btn-secondary" onClick={closeSearchModal}>Đóng</button>
                </div>
              </div>
            ) : (
              <div className="modal-body">
                <input type="text" className="form-control" style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px'}} placeholder="Nhập tên để tìm kiếm hoặc tạo mới..." value={modalState.searchInput} onChange={(e) => setModalState({...modalState, searchInput: e.target.value})} autoFocus />
                
                <div style={{marginTop: '12px', maxHeight: '150px', overflowY: 'auto'}}>
                   {positionsData.filter(d => d.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(item => (
                     <div key={item.id} className="dropdown-item" onClick={() => handleSelectModalItem(item.id)}>{item.name}</div>
                   ))}
                   
                   {modalState.searchInput && (
                     <div className="dropdown-item" style={{color: '#2563eb', fontStyle: 'italic'}} onClick={confirmModalCreate}>
                       + Tạo mới "{modalState.searchInput}"
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHATTER SECTION */}
      <div id="chatter" className="notebook" style={{marginTop: '40px', borderTop: '1px solid #e2e8f0', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', margin: '24px auto', maxWidth: '1100px'}}>
        <div className="notebook-tabs" style={{display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0'}}>
          <div className={`notebook-tab ${activeChatterTab === 'log_note' ? 'active' : ''}`} onClick={() => setActiveChatterTab('log_note')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'log_note' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'log_note' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'log_note' ? 600 : 400}}>Ghi chú</div>
          <div className={`notebook-tab ${activeChatterTab === 'history' ? 'active' : ''}`} onClick={() => setActiveChatterTab('history')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'history' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'history' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'history' ? 600 : 400}}>Lịch sử hoạt động</div>
        </div>

        <div className="notebook-content" style={{padding: '20px 0'}}>
            <div className="chatter-in-tab">
              {activeChatterTab === 'log_note' ? (
                <>
                  <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                    <div className="message-avatar" style={{width: '36px', height: '36px', backgroundColor: '#64748b'}}>U</div>
                    <div style={{flex: 1}}>
                        <div className="chatter-input-box" style={{border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff'}}>
                            <textarea className="chatter-textarea" style={{width: '100%', border: 'none', padding: '10px', minHeight: '80px', resize: 'vertical', fontSize: '14px', outline: 'none'}} placeholder="Ghi chú nội bộ..." value={chatterInput} onChange={handleChatterChange} ref={textareaRef}></textarea>
                            <div className="chatter-input-toolbar" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9'}}>
                                <div className="chatter-toolbar-left" style={{display: 'flex', gap: '14px', color: '#64748b'}}>
                                    <Smile size={18} style={{cursor: 'pointer'}} />
                                    <Paperclip size={18} style={{cursor: 'pointer'}} />
                                </div>
                                <div className="chatter-toolbar-right"><Maximize2 size={16} style={{color: '#64748b', cursor: 'pointer'}} /></div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{marginTop: '10px', backgroundColor: '#e32b4c', color: '#fff', padding: '6px 16px', borderRadius: '4px', fontWeight: 600}} onClick={() => {
                           if(!chatterInput) return;
                           addChatterMessage('log', 'Bạn', chatterInput, 'vừa xong', '#fef3c7');
                           setChatterInput('');
                        }}>Gửi</button>
                    </div>
                  </div>
                  
                  <div className="chatter-messages" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {chatterMessages.filter(msg => msg.type === 'log' && msg.bg === '#fef3c7').map(msg => (
                      <div key={msg.id} className="message-item" style={{display: 'flex', gap: '12px'}}>
                        <div className="message-avatar" style={{width: '32px', height: '32px', backgroundColor: '#94a3b8'}}>{msg.author[0]}</div>
                        <div className="message-content-wrapper">
                          <div className="message-meta">
                              <strong>{msg.author}</strong> - {msg.time}
                          </div>
                          <div className="message-body log-note-body">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatterMessages.filter(msg => msg.type === 'log' && msg.bg === '#fef3c7').length === 0 && (
                      <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic'}}>Chưa có ghi chú nào</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="history-table-wrapper" style={{background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                    <thead>
                      <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Người thao tác</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Thời gian</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Hoạt động / Thay đổi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chatterMessages.filter(msg => msg.type === 'log' && msg.bg !== '#fef3c7').map(msg => (
                        <tr key={msg.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                          <td style={{padding: '12px', fontWeight: 500, color: '#1e293b'}}>{msg.author}</td>
                          <td style={{padding: '12px', color: '#94a3b8'}}>{msg.time}</td>
                          <td style={{padding: '12px', color: '#475569'}}>{msg.text}</td>
                        </tr>
                      ))}
                      {chatterMessages.filter(msg => msg.type === 'log' && msg.bg !== '#fef3c7').length === 0 && (
                        <tr><td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Chưa có bản ghi lịch sử</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
