import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X, MessageSquare, ArrowDownToLine, Save, ArrowLeft, Plus, FileText, Calendar, User, Smile, Paperclip, MoreHorizontal, ChevronRight, ChevronDown, Maximize2, Edit2, Check, CheckCircle2 } from 'lucide-react';
import './CustomerForm.css';
import { mockStore } from '../utils/mockStore';

// --- MOCK DATA FOR SELECTS ---
const EMPLOYEES = ['Trần B (Bạn)', 'Nguyễn Văn A', 'Lê Thị C'];
const PROVINCES = [{ id: 'HN', name: 'Hà Nội' }, { id: 'HCM', name: 'TP. Hồ Chí Minh' }];
const WARDS = {
  'HN': [{ id: 'CG_DH', name: 'Phường Dịch Vọng Hậu' }, { id: 'CG_MD', name: 'Phường Mai Dịch' }, { id: 'NTL_MD1', name: 'Phường Mỹ Đình 1' }],
  'HCM': [{ id: 'Q1_BN', name: 'Phường Bến Nghé' }, { id: 'TB_P2', name: 'Phường 2' }]
};

const INITIAL_POSITIONS = [{id: 'TĐ', name: 'Trưởng Đài'}, {id: 'GD', name: 'Giám Đốc'}];

const RANKS = ['Nhân viên', 'Chuyên viên', 'Trưởng phòng', 'BGD'];
const CONTACT_POSITIONS = ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Kế toán', 'Hành chính', 'IT', 'Nhân sự', 'Thu mua'];

const INITIAL_FORM_STATE = {
  name: '',
  shortName: '',
  probability: 10,
  projectType: 'outsourcing',
  projectedService: 'outsourcing',
  mst: '',
  classification: 'Doanh nghiệp',
  industry: '',
  addressDetail: '',
  province: '',
  ward: '',
  website: '',
  companyPhone: '',
  priority: '1',
  tag: '',
  source: 'Manual',
  contractNo: '',
  signedDate: '',
  interactionHistory: '',
  revenue: '0 ₫',
  representative: '',
  assignees: [],
  debtLimit: '',
  overdueDaysAllowed: ''
};

const FIELD_LABELS = {
  name: 'Tên khách hàng',
  shortName: 'Tên viết tắt',
  mst: 'Mã số thuế',
  classification: 'Phân loại',
  industry: 'Lĩnh vực',
  addressDetail: 'Địa chỉ chi tiết',
  province: 'Tỉnh/Thành phố',
  ward: 'Phường/Xã',
  website: 'Website',
  companyPhone: 'SĐT Công ty',
  tag: 'Tag'
};

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // TABS
  const [activeNotebookTab, setActiveNotebookTab] = useState('internal_notes');

  // FORM DATA
  const [formData, setFormData] = useState({...INITIAL_FORM_STATE});
  const [snapshotData, setSnapshotData] = useState({...INITIAL_FORM_STATE});
  const [contacts, setContacts] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [positionsData, setPositionsData] = useState([...INITIAL_POSITIONS]);
  
  // NEW STATES: Deals, Activities, Documents
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [contractsList, setContractsList] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [isAddingBillingAddr, setIsAddingBillingAddr] = useState(false);
  const [newBillingAddr, setNewBillingAddr] = useState({ description: '', province: '', ward: '' });
  const [showAssigneesDropdown, setShowAssigneesDropdown] = useState(false);
  
  // INLINE CONTACT ADDING & EDITING
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactRow, setNewContactRow] = useState({ name: '', phone: '', email: '', rank: '', position: '', dob: '', gender: '' });
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingRowData, setEditingRowData] = useState({ name: '', phone: '', email: '', rank: '', position: '', dob: '', gender: '' });
  
  // UI & ERRORS
  const [activityModal, setActivityModal] = useState({ open: false, title: '', assignee: '', dueDate: '', mentionSearch: '' });
  const [isDocsCollapsed, setIsDocsCollapsed] = useState(false);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const mstRef = useRef(null);
  const domainRef = useRef(null);

  // CHATTER
  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState('');

  // LOAD DATA
  useEffect(() => {
    setAllCustomers(mockStore.getAllCustomers());

    if (id) {
      const customer = mockStore.getCustomer(id);
      if (customer) {
        const fullData = { ...INITIAL_FORM_STATE, ...customer };
        setFormData(fullData);
        setSnapshotData(fullData);
        // Fetch only ACTIVE contacts associated with this company
        setContacts(mockStore.getContactsByCompany(id, 'Active'));
        setDeals(customer.deals || []);
        setActivities(customer.activities || []);
        setDocuments(customer.documents || []);
        setChatterMessages(customer.chatterMessages || []);
        setBillingAddresses(customer.billingAddresses || []);

        // Load contracts for this customer
        const store = mockStore.getStore();
        const customerContracts = (store.contractIds || [])
          .map(cid => store.contracts && store.contracts[cid])
          .filter(c => c && c.customerId === id);
        setContractsList(customerContracts);
      }
    }
  }, [id]);

  const hf = (field, val) => {
    setFormData(prev => ({...prev, [field]: val}));
    if (field === 'province') setFormData(prev => ({...prev, ward: ''}));
  };

  const getCustomerStatus = () => {
    if (!contractsList || contractsList.length === 0) return 'Mới tạo';
    const hasOfficial = contractsList.some(c => 
      ['Hiệu lực', 'Tạm dừng', 'Sửa đổi gia hạn', 'Chấm dứt hợp đồng', 'Hoàn thành'].includes(c.approvalStatus)
    );
    if (hasOfficial) return 'Chính thức';
    return 'Dự thảo';
  };
  const currentStatus = getCustomerStatus();
  const isIdMstDisabled = currentStatus === 'Dự thảo' || currentStatus === 'Chính thức';

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Chính thức': return { bg: '#dcfce7', text: '#16a34a' }; // Xanh
      case 'Dự thảo': return { bg: '#ffedd5', text: '#ea580c' }; // Vàng cam
      case 'Mới tạo': 
      default: return { bg: '#f1f5f9', text: '#64748b' }; // Xám
    }
  };
  const statusStyle = getStatusBadgeStyle(currentStatus);

  const getContractStatusStyle = (status) => {
    switch(status) {
      case 'Nháp': return { bg: '#f1f5f9', text: '#64748b' };
      case 'Chờ duyệt bản thảo': return { bg: '#e0f2fe', text: '#0284c7' };
      case 'Chờ upload': return { bg: '#e0e7ff', text: '#4f46e5' };
      case 'Chờ duyệt bản ký': return { bg: '#ffedd5', text: '#ea580c' };
      case 'Hiệu lực': return { bg: '#dbeafe', text: '#2563eb' };
      case 'Tạm dừng': return { bg: '#fef9c3', text: '#ca8a04' };
      case 'Sửa đổi gia hạn': return { bg: '#f3e8ff', text: '#9333ea' };
      case 'Chấm dứt hợp đồng': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Hoàn thành': return { bg: '#dcfce7', text: '#16a34a' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const getOrderStatusStyle = (status) => {
    switch(status) {
      case 'Mới':
      case 'Chờ xác nhận': return { bg: '#ffedd5', text: '#ea580c' };
      case 'Đang xử lý':
      case 'Đang giao': return { bg: '#e0f2fe', text: '#0284c7' };
      case 'Hoàn thành':
      case 'Đã thanh toán': return { bg: '#dcfce7', text: '#16a34a' };
      case 'Đã hủy':
      case 'Trả hàng': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = true;
    if (!formData.mst) e.mst = true;
    if (!formData.industry) e.industry = true;
    return e;
  };

  const handleChatterChange = (e) => setChatterInput(e.target.value);

  const logToChatter = (text) => {
    const newMsg = {
      id: Date.now() + Math.random(),
      type: 'log',
      author: 'Phạm Quang Mạnh',
      text: text,
      time: 'vừa xong',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
    };
    setChatterMessages(prev => [newMsg, ...prev]);
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      alert('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    // Track changes
    const changes = [];
    Object.keys(FIELD_LABELS).forEach(key => {
      if (formData[key] !== snapshotData[key]) {
        const oldVal = snapshotData[key] || '(trống)';
        const newVal = formData[key] || '(trống)';
        changes.push({
            label: FIELD_LABELS[key],
            from: oldVal,
            to: newVal
        });
      }
    });

    let currentMessages = chatterMessages;
    if (changes.length > 0) {
      const newLog = {
        id: Date.now() + Math.random(),
        type: 'log',
        author: 'Phạm Quang Mạnh',
        changes: changes,
        time: 'vừa xong',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
      };
      currentMessages = [newLog, ...chatterMessages];
      setChatterMessages(currentMessages);
      setSnapshotData({...formData});
    }

    const dataToSave = {
      ...formData,
      // contacts are now fetched dynamically, no need to save them within customer object
      deals,
      activities,
      documents,
      chatterMessages: currentMessages,
      billingAddresses
    };

    if (id) {
      mockStore.saveCustomer(id, dataToSave);
      if (changes.length === 0) alert('Đã lưu thay đổi!');
    } else {
      const newId = mockStore.getNextCustomerId();
      dataToSave.id = newId;
      mockStore.saveCustomer(newId, dataToSave);
    }
    navigate('/customers');
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
    setChatterMessages([newMsg, ...chatterMessages]);
    setChatterInput('');
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
        mockStore.updateContactStatus(contactId, 'Inactive');
        setContacts(prev => prev.filter(c => c.id !== contactId));
        logToChatter(`🗑️ Đã xóa liên hệ: ${contacts.find(c => c.id === contactId)?.name}`);
    }
  };

  const handleSaveInlineContact = () => {
    if (!newContactRow.name || !newContactRow.gender || !newContactRow.rank || !newContactRow.position || !newContactRow.email || !newContactRow.dob) {
        alert('Vui lòng nhập đầy đủ các trường bắt buộc (có dấu *)');
        return;
    }
    const newId = `CON-${Date.now()}`;
    const contactData = {
        ...newContactRow,
        id: newId,
        companyId: id,
        companyName: formData.name,
        status: 'Active',
        avatars: []
    };
    mockStore.saveContact(newId, contactData);
    setContacts(prev => [...prev, contactData]);
    setIsAddingContact(false);
    setNewContactRow({ name: '', phone: '', email: '', rank: '', position: '', dob: '' });
    logToChatter(`👤 Đã tạo liên hệ mới: ${contactData.name}`);
  };

  const handleStartEdit = (contact) => {
    setEditingContactId(contact.id);
    setEditingRowData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        rank: contact.rank || '',
        position: contact.position || '',
        dob: contact.dob || '',
        gender: contact.gender || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingRowData.name || !editingRowData.gender || !editingRowData.rank || !editingRowData.position || !editingRowData.email || !editingRowData.dob) {
        alert('Vui lòng nhập đầy đủ các trường bắt buộc (có dấu *)');
        return;
    }
    const updatedContact = {
        ...mockStore.getContact(editingContactId),
        ...editingRowData
    };
    mockStore.saveContact(editingContactId, updatedContact);
    setContacts(prev => prev.map(c => c.id === editingContactId ? updatedContact : c));
    setEditingContactId(null);
    logToChatter(`✏️ Đã cập nhật thông tin liên hệ: ${updatedContact.name}`);
  };

  const handleCancelEdit = () => {
    setEditingContactId(null);
  };

  const handleCreateActivity = (isDone) => {
    if (!activityModal.title) return;
    const newAct = {
      id: Date.now(),
      title: activityModal.title,
      assignee: activityModal.assignee,
      dueDate: activityModal.dueDate,
      status: isDone ? 'Done' : 'Planned'
    };
    setActivities([newAct, ...activities]);
    
    // Add system log to chatter
    const logMsg = {
      id: Date.now() + 1,
      type: 'log',
      author: 'Phạm Quang Mạnh',
      text: isDone ? `🏁 Hoàn thành hoạt động: ${newAct.title}` : `📅 Lên lịch hoạt động: ${newAct.title}`,
      time: 'vừa xong',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
    };
    setChatterMessages([logMsg, ...chatterMessages]);
    setActivityModal({ open: false, title: '', assignee: '', dueDate: '', mentionSearch: '' });
  };

  // DOCUMENTS LOGIC
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => {
      const doc = {
        id: Date.now() + Math.random(),
        name: file.name,
        category: 'Tài liệu về giá sản phẩm',
        description: 'Tài liệu về giá sản phẩm',
        author: 'Trần B',
        date: new Date().toLocaleDateString('vi-VN')
      };
      logToChatter(`📎 Đã tải lên tài liệu: ${doc.name}`);
      return doc;
    });
    setDocuments([...newDocs, ...documents]);
  };

  const downloadAllFiles = () => alert('Đang chuẩn bị tải về tất cả tài liệu... (Mockup)');

  // DOCUMENTS LOGIC

  const wardOptions = formData.province ? (WARDS[formData.province] || []) : [];

  return (
    <div className="customer-form-modern">
      <div className="customer-form-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/customers')}>Quản lý khách hàng</span>
          <span className="breadcrumb-item">/</span>
          <span className="breadcrumb-current">{id ? formData.name || id : 'Thêm Mới KH'}</span>
        </div>
        <div className="header-actions">
           <button className="btn btn-secondary" onClick={() => navigate('/customers')}><ArrowLeft size={16} /> Quay lại</button>
           <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Lưu hồ sơ</button>
        </div>
      </div>

      <div className="form-body-wrapper">
        <div className="section-header">
          <h2 className="section-title">Thông tin khách hàng</h2>
          <div style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, backgroundColor: statusStyle.bg, color: statusStyle.text }}>
            {currentStatus}
          </div>
        </div>

        <div className="form-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
          {/* Column 1 */}
          <div className="form-column">
              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Tên khách hàng</span> <span className="asterisk">*</span>
                </div>
                <div className="form-value-modern" style={{position: 'relative'}}>
                  <input type="text" className={`input-modern ${errors.name ? 'is-invalid' : ''}`} style={{maxWidth: '120px'}} placeholder="Viết tắt" value={formData.shortName} onChange={e=>hf('shortName', e.target.value)} />
                  <div style={{flex: 1, position: 'relative'}}>
                      <input type="text" ref={nameRef} className={`input-modern ${errors.name ? 'is-invalid' : ''}`} placeholder="Tên đầy đủ..." value={formData.name} 
                          onChange={e => {
                              hf('name', e.target.value);
                              setShowNameSuggestions(true);
                          }}
                          onFocus={() => setShowNameSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                      />
                      {showNameSuggestions && formData.name && allCustomers.filter(c => c.name.toLowerCase().includes(formData.name.toLowerCase()) && c.id !== id).length > 0 && (
                          <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto', marginTop: '4px'}}>
                              {allCustomers.filter(c => c.name.toLowerCase().includes(formData.name.toLowerCase()) && c.id !== id).map(c => (
                                  <div key={c.id} style={{padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e)=>e.currentTarget.style.background='white'} onMouseDown={(e) => {
                                      e.preventDefault();
                                      setShowNameSuggestions(false);
                                      navigate(`/customers/${c.id}`);
                                  }}>
                                      <div style={{fontWeight: 600, color: '#1e293b'}}>{c.name}</div>
                                      <div style={{fontSize: '12px', color: '#64748b'}}>MST: {c.mst || 'N/A'} - Lĩnh vực: {c.industry || 'N/A'}</div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>MST</span> <span className="asterisk">*</span>
                </div>
                <div className="form-value-modern">
                  <input type="text" ref={mstRef} className={`input-modern ${errors.mst ? 'is-invalid' : ''}`} placeholder="Nhập mã số thuế..." value={formData.mst} onChange={e=>hf('mst', e.target.value)} disabled={isIdMstDisabled} style={{backgroundColor: isIdMstDisabled ? '#f1f5f9' : 'white'}} />
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Lĩnh vực</span> <span className="asterisk">*</span>
                </div>
                <div className="form-value-modern">
                  <select ref={domainRef} className={`select-modern ${errors.industry ? 'is-invalid' : ''}`} style={{maxWidth: '430px'}} value={formData.industry} onChange={e=>hf('industry', e.target.value)}>
                      <option value="">-- Chọn lĩnh vực --</option>
                      <option value="Tài chính">Tài chính</option>
                      <option value="Viễn thông">Viễn thông</option>
                      <option value="Bất động sản">Bất động sản</option>
                      <option value="F&B">F&B</option>
                  </select>
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Tên người đại diện</span>
                </div>
                <div className="form-value-modern">
                  <input type="text" className="input-modern" placeholder="Tên người đại diện..." value={formData.representative} onChange={e=>hf('representative', e.target.value)} />
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Nhân viên phụ trách</span>
                </div>
                <div className="form-value-modern" style={{position: 'relative'}}>
                  <div 
                     className="input-modern" 
                     style={{display: 'flex', flexWrap: 'wrap', gap: '4px', cursor: 'pointer', minHeight: '36px', alignItems: 'center'}}
                     onClick={() => setShowAssigneesDropdown(!showAssigneesDropdown)}
                  >
                      {formData.assignees.length > 0 ? formData.assignees.map(a => (
                          <span key={a} style={{background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                              {a}
                              <X size={12} style={{cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); hf('assignees', formData.assignees.filter(as => as !== a)); }} />
                          </span>
                      )) : (
                          <span style={{color: '#94a3b8'}}>-- Chọn nhân viên --</span>
                      )}
                  </div>
                  {showAssigneesDropdown && (
                      <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto', marginTop: '4px'}}>
                          {EMPLOYEES.map(emp => (
                              <label key={emp} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9'}}
                                  onMouseEnter={(e)=>e.currentTarget.style.background='#f8fafc'} 
                                  onMouseLeave={(e)=>e.currentTarget.style.background='white'}>
                                  <input 
                                      type="checkbox" 
                                      checked={formData.assignees.includes(emp)} 
                                      onChange={(e) => {
                                          if (e.target.checked) hf('assignees', [...formData.assignees, emp]);
                                          else hf('assignees', formData.assignees.filter(a => a !== emp));
                                      }} 
                                  />
                                  {emp}
                              </label>
                          ))}
                      </div>
                  )}
                </div>
              </div>
          </div>

          {/* Column 2 */}
          <div className="form-column">
              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Phân loại</span>
                </div>
                <div className="form-value-modern">
                  <div className="radio-group-modern">
                      <label className="radio-label-modern">
                          <input type="radio" name="classification" checked={formData.classification === 'Doanh nghiệp'} onChange={()=>hf('classification', 'Doanh nghiệp')} /> Doanh nghiệp
                      </label>
                      <label className="radio-label-modern">
                          <input type="radio" name="classification" checked={formData.classification === 'Nội bộ'} onChange={()=>hf('classification', 'Nội bộ')} /> Nội bộ
                      </label>
                  </div>
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>SĐT Công ty</span>
                </div>
                <div className="form-value-modern">
                  <input type="text" className="input-modern" placeholder="Số điện thoại..." value={formData.companyPhone} onChange={e=>hf('companyPhone', e.target.value)} />
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Website</span>
                </div>
                <div className="form-value-modern">
                  <input type="text" className="input-modern" placeholder="https://" value={formData.website} onChange={e=>hf('website', e.target.value)} />
                </div>
              </div>

              <div className="form-row-modern align-start">
                <div className="form-label-modern" style={{paddingTop: '8px'}}>
                  <span>Địa Chỉ</span>
                </div>
                <div className="form-value-modern address-grid-modern">
                  <input type="text" className="input-modern" style={{marginBottom: '-8px'}} placeholder="Địa chỉ chi tiết (nhà, ngõ ...)" value={formData.addressDetail} onChange={e=>hf('addressDetail', e.target.value)} />
                  <div className="address-selectors">
                      <select className="select-modern" value={formData.province} onChange={e=>hf('province', e.target.value)}><option value="">Tỉnh/TP</option>{PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                      <select className="select-modern" value={formData.ward} onChange={e=>hf('ward', e.target.value)} disabled={!formData.province}><option value="">Phường/Xã</option>{wardOptions.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select>
                  </div>
                </div>
              </div>

              <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Tag & Nguồn</span>
                </div>
                <div className="form-value-modern" style={{display: 'flex', gap: '16px'}}>
                  <select className="select-modern" style={{flex: 1}} value={formData.tag} onChange={e=>hf('tag', e.target.value)}>
                      <option value="">-- Chọn tag --</option>
                      <option value="VIP">VIP</option>
                      <option value="Tiềm năng">Tiềm năng</option>
                  </select>
                  <select className={`select-modern select-badge ${formData.source === 'Lead Conversion' ? 'badge-lead' : 'badge-manual'}`} style={{flex: 1}} value={formData.source} onChange={e=>hf('source', e.target.value)} disabled={formData.source === 'Lead Conversion'}>
                      <option value="Manual">Manual</option>
                      <option value="Lead Conversion">Lead Conversion</option>
                  </select>
                </div>
              </div>
          </div>
        </div>

        {/* THÔNG TIN CÔNG NỢ */}
        <div className="section-header" style={{margin: '32px 0 16px'}}>
           <h2 className="section-title" style={{fontSize: '18px'}}>Thông tin công nợ</h2>
        </div>
        <div className="form-card">
            <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Hạn mức công nợ</span>
                </div>
                <div className="form-value-modern">
                  <input type="number" className="input-modern" placeholder="0 &#8363;" value={formData.debtLimit} onChange={e=>hf('debtLimit', e.target.value)} />
                </div>
            </div>
            <div className="form-row-modern">
                <div className="form-label-modern">
                  <span>Số ngày cho phép nợ (quá hạn)</span>
                </div>
                <div className="form-value-modern">
                  <input type="number" className="input-modern" placeholder="Số ngày..." value={formData.overdueDaysAllowed} onChange={e=>hf('overdueDaysAllowed', e.target.value)} />
                </div>
            </div>
        </div>

        {/* ĐỊA CHỈ XUẤT HÓA ĐƠN */}
        <div className="section-header" style={{margin: '32px 0 16px'}}>
           <h2 className="section-title" style={{fontSize: '18px'}}>Địa chỉ xuất hóa đơn</h2>
        </div>
        <div className="table-card" style={{overflowX: 'auto'}}>
            <div style={{minWidth: '600px'}}>
               <div className="table-header" style={{display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 80px', gap: '16px', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#475569', fontSize: '13px'}}>
                   <span>STT</span><span>Tên/Mô tả địa chỉ</span><span>Tỉnh/Thành phố</span><span>Phường/Xã</span><span style={{textAlign: 'center'}}>Thao tác</span>
               </div>
               
               {billingAddresses.length > 0 ? billingAddresses.map((addr, idx) => {
                   const pName = PROVINCES.find(p => p.id === addr.province)?.name || addr.province;
                   const wardList = WARDS[addr.province] || [];
                   const wName = wardList.find(w => w.id === addr.ward)?.name || addr.ward;
                   return (
                       <div className="table-row" key={idx} style={{display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 80px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center'}}>
                           <span>{(idx + 1).toString().padStart(2, '0')}</span>
                           <span style={{fontWeight: 500}}>{addr.description}</span>
                           <span>{pName}</span>
                           <span>{wName}</span>
                           <div style={{textAlign: 'center'}}>
                               <Trash2 size={15} style={{cursor: 'pointer', color: '#94a3b8'}} onClick={() => {
                                   if (window.confirm('Xóa địa chỉ xuất hóa đơn này?')) {
                                       setBillingAddresses(prev => prev.filter((_, i) => i !== idx));
                                   }
                               }} />
                           </div>
                       </div>
                   );
               }) : (
                   <div style={{padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Chưa có địa chỉ xuất hóa đơn.</div>
               )}
               
               {isAddingBillingAddr && (
                   <div className="table-row" style={{display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 80px', gap: '16px', padding: '12px 20px', background: '#fffef0', alignItems: 'center'}}>
                       <span>+</span>
                       <input type="text" className="input-modern" style={{padding: '6px', fontSize: '13px'}} placeholder="Mô tả..." value={newBillingAddr.description} onChange={e => setNewBillingAddr({...newBillingAddr, description: e.target.value})} />
                       <select className="select-modern" style={{padding: '6px', fontSize: '13px'}} value={newBillingAddr.province} onChange={e => setNewBillingAddr({...newBillingAddr, province: e.target.value, ward: ''})}>
                           <option value="">Tỉnh/TP</option>{PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                       </select>
                       <select className="select-modern" style={{padding: '6px', fontSize: '13px'}} value={newBillingAddr.ward} disabled={!newBillingAddr.province} onChange={e => setNewBillingAddr({...newBillingAddr, ward: e.target.value})}>
                           <option value="">Phường/Xã</option>{(newBillingAddr.province ? (WARDS[newBillingAddr.province] || []) : []).map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
                       </select>
                       <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                           <Check size={18} style={{cursor: 'pointer', color: '#10b981'}} onClick={() => {
                               if (!newBillingAddr.description || !newBillingAddr.province) {
                                   alert('Vui lòng nhập mô tả và chọn tỉnh/thành'); return;
                               }
                               setBillingAddresses(prev => [...prev, {...newBillingAddr}]);
                               setIsAddingBillingAddr(false);
                               setNewBillingAddr({description: '', province: '', ward: ''});
                           }} />
                           <X size={18} style={{cursor: 'pointer', color: '#94a3b8'}} onClick={() => setIsAddingBillingAddr(false)} />
                       </div>
                   </div>
               )}
               
               {!isAddingBillingAddr && (
                   <div style={{padding: '12px 16px', borderTop: '1px solid #f1f5f9'}}>
                       <span className="text-action" style={{cursor: 'pointer', color: '#2563eb', fontWeight: 500, fontSize: '13px'}} onClick={() => setIsAddingBillingAddr(true)}>+ Thêm địa chỉ</span>
                   </div>
               )}
            </div>
        </div>

        {/* ONGOING CONTRACTS */}
        <div className="section-header" style={{margin: '32px 0 16px'}}>
           <h2 className="section-title" style={{fontSize: '18px'}}>Hợp đồng đang triển khai</h2>
        </div>
        <div className="table-card" style={{ overflowX: 'auto' }}>
           <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '40px 120px minmax(180px, 2.5fr) minmax(120px, 1.5fr) minmax(120px, 1.5fr) 90px 90px 110px 100px', gap: '16px', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#475569', fontSize: '13px', minWidth: '1050px' }}>
               <span>STT</span><span>ID Hợp đồng</span><span>Tên hợp đồng</span><span>Ng.theo dõi</span><span>Đơn vị</span><span>Ngày ký</span><span>Ngày K.T</span><span>Giá trị</span><span>Trạng thái</span>
           </div>
           {id ? (
               contractsList.length > 0 ? contractsList.map((ctr, idx) => {
                 const truncateStyle = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
                 return (
                   <div className="table-row" key={ctr.id} style={{ display: 'grid', gridTemplateColumns: '40px 120px minmax(180px, 2.5fr) minmax(120px, 1.5fr) minmax(120px, 1.5fr) 90px 90px 110px 100px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center', minWidth: '1050px' }}>
                       <span>{(idx + 1).toString().padStart(2, '0')}</span>
                       <span className="text-link" onClick={() => navigate('/contracts')} style={{ color: '#2563eb', fontWeight: 600, ...truncateStyle }} title={ctr.id}>{ctr.id}</span>
                       <span style={{ fontWeight: 500, color: '#0f172a', ...truncateStyle }} title={ctr.name}>{ctr.name}</span>
                       <span style={truncateStyle} title={ctr.amName || 'N/A'}>{ctr.amName || 'N/A'}</span>
                       <span style={truncateStyle} title={ctr.promotionUnit || 'N/A'}>{ctr.promotionUnit || 'N/A'}</span>
                       <span style={truncateStyle} title={ctr.signedDate || 'N/A'}>{ctr.signedDate || 'N/A'}</span>
                       <span style={truncateStyle} title={ctr.expiryDate || 'N/A'}>{ctr.expiryDate || 'N/A'}</span>
                       <span style={{ fontWeight: 600, ...truncateStyle }} title={ctr.contractValue || '0'}>{ctr.contractValue || '0'}</span>
                       <span style={truncateStyle} title={ctr.approvalStatus || 'N/A'}>
                          <span style={{ backgroundColor: getContractStatusStyle(ctr.approvalStatus).bg, color: getContractStatusStyle(ctr.approvalStatus).text, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-block', ...truncateStyle, maxWidth: '100%' }}>{ctr.approvalStatus || 'N/A'}</span>
                       </span>
                   </div>
                 );
               }) : (
                   <div style={{padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Chưa có hợp đồng nào đang triển khai.</div>
               )
           ) : (
               <div style={{padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Vui lòng lưu khách hàng để xem danh sách hợp đồng.</div>
           )}
        </div>

        {/* ONGOING ORDERS */}
        <div className="section-header" style={{margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
           <h2 className="section-title" style={{fontSize: '18px', margin: 0}}>Đơn hàng đang triển khai</h2>
           <div style={{ padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Mock Data</div>
        </div>
        <div className="table-card" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px' }}>
           <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 150px', gap: '16px', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#475569', fontSize: '13px' }}>
               <span>STT</span><span>ID Đơn hàng</span><span>Trạng thái</span><span style={{ textAlign: 'right' }}>Doanh thu</span>
           </div>
           {id ? (
             <>
               {[
                 { id: 'DH-2026-001', status: 'Đang giao', revenue: '450,000,000 VNĐ' },
                 { id: 'DH-2026-004', status: 'Hoàn thành', revenue: '125,000,000 VNĐ' },
                 { id: 'DH-2026-005', status: 'Trả hàng', revenue: '50,000,000 VNĐ' }
               ].map((ord, idx) => (
                   <div className="table-row" key={ord.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 150px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center' }}>
                       <span style={{ color: '#94a3b8' }}>{(idx + 1).toString().padStart(2, '0')}</span>
                       <span style={{ color: '#2563eb', fontWeight: 600 }}>{ord.id}</span>
                       <span>
                          <span style={{ backgroundColor: getOrderStatusStyle(ord.status).bg, color: getOrderStatusStyle(ord.status).text, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }} title={ord.status}>{ord.status}</span>
                       </span>
                       <span style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{ord.revenue}</span>
                   </div>
               ))}
               <div style={{ padding: '16px 20px', textAlign: 'right', background: '#fff' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>Tổng doanh thu dự kiến: </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#e32b4c' }}>575,000,000 VNĐ</span>
               </div>
             </>
           ) : (
               <div style={{padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Vui lòng lưu khách hàng để xem danh sách đơn hàng.</div>
           )}
        </div>

        {/* TICKETS BLOCK */}
        <div className="section-header" style={{margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
           <h2 className="section-title" style={{fontSize: '18px', margin: 0}}>Tickets (Hỗ trợ)</h2>
           <div style={{ padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Mock Data</div>
        </div>
        <div className="table-card" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px' }}>
           <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', gap: '16px', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#475569', fontSize: '13px' }}>
               <span>ID</span><span>Tiêu đề/Chủ đề</span><span>Trạng thái</span><span>Ngày tạo</span>
           </div>
           {id ? (
             <>
               {[
                 { id: 'T-001', subject: 'Lỗi không đăng nhập được phần mềm', status: 'Đang xử lý', date: '10/04/2026' },
                 { id: 'T-002', subject: 'Yêu cầu hỗ trợ hướng dẫn sử dụng', status: 'Hoàn thành', date: '05/04/2026' }
               ].map((t) => (
                   <div className="table-row" key={t.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center' }}>
                       <span style={{ color: '#2563eb', fontWeight: 600 }}>{t.id}</span>
                       <span style={{ fontWeight: 500, color: '#1e293b' }}>{t.subject}</span>
                       <span>
                          <span style={{ backgroundColor: t.status === 'Đang xử lý' ? '#e0f2fe' : '#dcfce7', color: t.status === 'Đang xử lý' ? '#0284c7' : '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-block' }}>{t.status}</span>
                       </span>
                       <span style={{ color: '#64748b' }}>{t.date}</span>
                   </div>
               ))}
             </>
           ) : (
               <div style={{padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Vui lòng lưu khách hàng để xem danh sách ticket.</div>
           )}
        </div>

        {/* LOYALTY BLOCK */}
        <div className="section-header" style={{margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
           <h2 className="section-title" style={{fontSize: '18px', margin: 0}}>Chương trình khách hàng thân thiết (Loyalty)</h2>
           <div style={{ padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Mock Data</div>
        </div>
        <div className="form-card" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Hạng thành viên hiện tại</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '20px', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4)' }}>V</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>Vàng (Gold)</div>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Ngày hết hạn hạng: 31/12/2026</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Điểm tích lũy</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>12,450 <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>điểm</span></div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Có thể sử dụng để quy đổi giảm giá cho đơn hàng tiếp theo.</div>
            </div>
        </div>

        {/* CONTACT INFO */}
        <div className="section-header" style={{marginBottom: '16px'}}>
           <h2 className="section-title" style={{fontSize: '18px'}}>Thông tin liên hệ</h2>
        </div>
        <div className="table-card" style={{overflowX: 'auto'}}>
            <div style={{minWidth: '1100px'}}>
               <div className="table-header contacts-grid">
                   <span>STT</span><span>Tên</span><span>GT</span><span>SĐT</span><span>Email</span><span>Cấp bậc</span><span>Vị trí</span><span>Ngày sinh</span><span style={{textAlign: 'center'}}>Hành động</span>
               </div>
               
               <>
                   {contacts.length > 0 ? contacts.map((contact, idx) => (
                       contact.id === editingContactId ? (
                           <div className="table-row contacts-grid" key={contact.id} style={{background: '#f0f7ff'}}>
                               <span>{(idx + 1).toString().padStart(2, '0')}</span>
                                   <input type="text" className="table-row-input" placeholder="Tên..." value={editingRowData.name} onChange={e => setEditingRowData({...editingRowData, name: e.target.value})} />
                                   <select className="table-row-input" value={editingRowData.gender} onChange={e => setEditingRowData({...editingRowData, gender: e.target.value})}>
                                       <option value="">GT</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                                   </select>
                                   <input type="text" className="table-row-input" placeholder="SĐT..." value={editingRowData.phone} onChange={e => setEditingRowData({...editingRowData, phone: e.target.value})} />
                                   <input type="text" className="table-row-input" placeholder="Email..." value={editingRowData.email} onChange={e => setEditingRowData({...editingRowData, email: e.target.value})} />
                                   <select className="table-row-input" value={editingRowData.rank} onChange={e => setEditingRowData({...editingRowData, rank: e.target.value})}>
                                       <option value="">Cấp bậc</option>{RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                   </select>
                                   <select className="table-row-input" value={editingRowData.position} onChange={e => setEditingRowData({...editingRowData, position: e.target.value})}>
                                       <option value="">Vị trí</option>{CONTACT_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                   </select>
                                   <input type="text" className="table-row-input" placeholder="Ngày sinh" value={editingRowData.dob} onChange={e => setEditingRowData({...editingRowData, dob: e.target.value})} />
                                   <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                       <Check size={18} style={{cursor: 'pointer', color: '#10b981'}} onClick={handleSaveEdit} title="Lưu" />
                                       <X size={18} style={{cursor: 'pointer', color: '#64748b'}} onClick={handleCancelEdit} title="Hủy" />
                                   </div>
                               </div>
                           ) : (
                               <div className="table-row contacts-grid" key={contact.id}>
                                   <span>{(idx + 1).toString().padStart(2, '0')}</span>
                                   <span style={{fontWeight: 600, color: '#ed0029'}}>{contact.name || ''}</span>
                                   <span style={{fontSize: '11px', color: '#64748b'}}>{contact.gender || ''}</span>
                                   <span>{contact.phone || ''}</span>
                                   <span className="text-link" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={contact.email}>{contact.email || ''}</span>
                                   <span><span style={{background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#64748b'}}>{contact.rank || ''}</span></span>
                                   <span>{contact.position || ''}</span>
                                   <span>{contact.dob || ''}</span>
                                   <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                                       <Edit2 size={15} style={{cursor: 'pointer', color: '#64748b'}} onClick={() => handleStartEdit(contact)} />
                                       <Trash2 size={15} style={{cursor: 'pointer', color: '#94a3b8'}} onClick={() => handleDeleteContact(contact.id)} />
                                   </div>
                               </div>
                           )
                       )) : (
                           <div style={{padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px'}}>Không có liên hệ "Active" nào cho khách hàng này.</div>
                       )}
                       
                       {isAddingContact && (
                           <div className="table-row contacts-grid" style={{background: '#fffef0'}}>
                               <span>{(contacts.length + 1).toString().padStart(2, '0')}</span>
                               <input type="text" className="table-row-input" placeholder="Tên..." value={newContactRow.name} onChange={e => setNewContactRow({...newContactRow, name: e.target.value})} />
                               <select className="table-row-input" value={newContactRow.gender} onChange={e => setNewContactRow({...newContactRow, gender: e.target.value})}>
                                   <option value="">GT</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                               </select>
                               <input type="text" className="table-row-input" placeholder="SĐT..." value={newContactRow.phone} onChange={e => setNewContactRow({...newContactRow, phone: e.target.value})} />
                               <input type="text" className="table-row-input" placeholder="Email..." value={newContactRow.email} onChange={e => setNewContactRow({...newContactRow, email: e.target.value})} />
                               <select className="table-row-input" value={newContactRow.rank} onChange={e => setNewContactRow({...newContactRow, rank: e.target.value})}>
                                   <option value="">Cấp bậc</option>{RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                               </select>
                               <select className="table-row-input" value={newContactRow.position} onChange={e => setNewContactRow({...newContactRow, position: e.target.value})}>
                                   <option value="">Vị trí</option>{CONTACT_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                               </select>
                               <input type="text" className="table-row-input" placeholder="Ngày sinh" value={newContactRow.dob} onChange={e => setNewContactRow({...newContactRow, dob: e.target.value})} />
                               <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                   <Check size={18} style={{cursor: 'pointer', color: '#10b981'}} onClick={handleSaveInlineContact} />
                                   <X size={18} style={{cursor: 'pointer', color: '#94a3b8'}} onClick={() => setIsAddingContact(false)} />
                               </div>
                           </div>
                       )}

                       {!isAddingContact && (
                           <div style={{padding: '12px 16px', borderTop: '1px solid #f1f5f9'}}>
                               <span className="text-action" onClick={() => setIsAddingContact(true)}>+ Thêm Liên hệ</span>
                           </div>
                       )}
                   </>
            </div>
        </div>

        {/* NOTEBOOK */}
        <div className="notebook">
            <div className="notebook-tabs">
              <div className={`notebook-tab ${activeNotebookTab === 'internal_notes' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('internal_notes')}>Ghi chú</div>
              <div className={`notebook-tab ${activeNotebookTab === 'history' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('history')}>Lịch sử hoạt động</div>
              <div className={`notebook-tab ${activeNotebookTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('deals')}>Deals ({deals.length})</div>
              <div className={`notebook-tab ${activeNotebookTab === 'hoat_dong' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('hoat_dong')}>Hoạt động</div>
              <div className={`notebook-tab ${activeNotebookTab === 'tai_lieu' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('tai_lieu')}>Tài liệu</div>
            </div>

            <div className="notebook-content">
              {(activeNotebookTab === 'internal_notes' || activeNotebookTab === 'history') && (
                <div className="chatter-in-tab">
                  {activeNotebookTab === 'internal_notes' && (
                    <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                      <div className="chatter-avatar-small"><img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" /></div>
                      <div style={{flex: 1}}>
                          <div className="chatter-input-box">
                              <textarea className="chatter-textarea" placeholder="Log an internal note..." value={chatterInput} onChange={handleChatterChange}></textarea>
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
                          <button className="btn-log-odoo" onClick={postNote}>Ghi</button>
                      </div>
                    </div>
                  )}
                  
                  <div className="chatter-messages" style={{display: 'flex', flexDirection: 'column'}}>
                    {chatterMessages.filter(msg => msg.type !== 'separator' && (activeNotebookTab === 'internal_notes' ? msg.type === 'note' : msg.type === 'log')).map(msg => (
                      <div key={msg.id} className="message-item-odoo">
                        <div className="chatter-avatar-small" style={{borderRadius: msg.author === 'OdooBot' ? '50%' : '8px'}}><img src={msg.avatar} alt="Author" /></div>
                        <div className="message-content-wrapper" style={{flex: 1}}>
                          <div className="message-author-info">
                              <span className="message-author-name">{msg.author}</span>
                              <span style={{fontSize: '12px', color: '#94a3b8'}}>- {msg.time}</span>
                          </div>
                          <div className="message-body-odoo">
                              {msg.type === 'log' ? (
                                  <div className="system-log-wrapper">
                                      {msg.changes ? (
                                          <ul style={{margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#64748b'}}>
                                              {msg.changes.map((change, i) => (
                                                  <li key={i} style={{marginBottom: '2px'}}>Đã đổi <span style={{fontWeight: 600, color: '#334155'}}>{change.label}</span> từ <span style={{fontStyle: 'italic', color: '#94a3b8'}}>'{change.from}'</span> thành <span style={{fontWeight: 700, color: '#ed0029'}}>'{change.to}'</span></li>
                                              ))}
                                          </ul>
                                      ) : (
                                          <div style={{color: '#64748b'}}>{msg.text}</div>
                                      )}
                                  </div>
                              ) : (
                                  <div style={{whiteSpace: 'pre-wrap'}}>{msg.text}</div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatterMessages.filter(msg => msg.type !== 'separator' && (activeNotebookTab === 'internal_notes' ? msg.type === 'note' : msg.type === 'log')).length === 0 && (
                      <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0'}}>Chưa có dữ liệu</div>
                    )}
                  </div>
                </div>
              )}
              {activeNotebookTab === 'deals' && (
                <div className="deals-tab" style={{padding: '16px 0'}}>
                   <div className="contact-table-container" style={{overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                     <table className="contact-table" style={{width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap'}}>
                        <thead>
                            <tr>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, width: '60px', textAlign: 'center'}}>STT</th>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600}}>Tên cơ hội / Dịch vụ</th>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600}}>Giá trị dự kiến</th>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600}}>Người phụ trách</th>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600}}>Ngày kỳ vọng</th>
                                <th style={{padding: '12px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600}}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deals.length > 0 ? deals.map((d, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #f1f5f9', cursor: 'pointer'}} onClick={() => alert(`Chi tiết deal: ${d.name}`)}>
                                    <td style={{padding: '12px 16px', textAlign: 'center'}}>{index + 1}</td>
                                    <td style={{padding: '12px 16px', fontWeight: 600, color: '#1e293b'}}>{d.name}</td>
                                    <td style={{padding: '12px 16px', color: '#0f172a', fontWeight: 500}}>{d.revenue || '0 ₫'}</td>
                                    <td style={{padding: '12px 16px'}}>{d.salesperson || '-'}</td>
                                    <td style={{padding: '12px 16px'}}>{d.date || '-'}</td>
                                    <td style={{padding: '12px 16px'}} onClick={e => e.stopPropagation()}>
                                        <select 
                                            value={d.status || 'New'}
                                            onChange={(e) => {
                                                const newDeals = [...deals];
                                                newDeals[index].status = e.target.value;
                                                setDeals(newDeals);
                                            }}
                                            style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                                                backgroundColor: d.status === 'New' ? '#fee2e2' : d.status === 'Converted' ? '#dcfce7' : '#f1f5f9',
                                                color: d.status === 'New' ? '#dc2626' : d.status === 'Converted' ? '#16a34a' : '#64748b',
                                                border: 'none', outline: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            <option value="New">Đang tiếp xúc</option>
                                            <option value="Qualify">Đánh giá nhu cầu</option>
                                            <option value="Proposition">Đang báo giá</option>
                                            <option value="Contract">Ký hợp đồng</option>
                                            <option value="Converted">Thành công</option>
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Chưa có cơ hội/deal nào trực thuộc khách hàng này</td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                   </div>
                </div>
              )}
              {activeNotebookTab === 'hoat_dong' && (
                <div className="activity-tab" style={{padding: '16px 0'}}>
                   <div className="list-view-container" style={{backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden'}}>
                     <table className="list-view-table" style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap'}}>
                       <thead>
                         <tr>
                           <th style={{padding: '16px 12px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 700, borderBottom: '1px solid #E5E7EB'}}>Tên nhiệm vụ</th>
                           <th style={{padding: '16px 12px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 700, borderBottom: '1px solid #E5E7EB'}}>Người được giao</th>
                           <th style={{padding: '16px 12px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 700, borderBottom: '1px solid #E5E7EB'}}>Hạn chót</th>
                           <th style={{padding: '16px 12px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 700, borderBottom: '1px solid #E5E7EB'}}>Trạng thái</th>
                           <th style={{padding: '16px 12px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: 700, borderBottom: '1px solid #E5E7EB', width: '60px'}}></th>
                         </tr>
                       </thead>
                       <tbody>
                         {activities.length > 0 ? activities.map(act => (
                           <tr key={act.id} style={{cursor: 'pointer'}} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                             <td style={{padding: '16px 12px', borderBottom: '1px solid #E5E7EB', fontWeight: 500, color: '#1e293b'}}>
                               {act.title}
                               {act.status === 'Done' ? <span className="badge" style={{marginLeft: 8, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontSize: '11px'}}>Hoàn thành</span> : null}
                             </td>
                             <td style={{padding: '16px 12px', borderBottom: '1px solid #E5E7EB'}}>{act.assignee || 'Bạn'}</td>
                             <td style={{padding: '16px 12px', borderBottom: '1px solid #E5E7EB'}}>
                               {act.dueDate ? (
                                 <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                   <Calendar size={14} color="#64748b" /> 
                                   <span style={{color: act.dueDate < new Date().toISOString().split('T')[0] && act.status !== 'Done' ? '#ef4444' : '#475569'}}>{act.dueDate}</span>
                                 </div>
                               ) : '-'}
                             </td>
                             <td style={{padding: '16px 12px', borderBottom: '1px solid #E5E7EB'}}>
                               {act.status === 'Done' ? (
                                  <span style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Hoàn thành</span>
                               ) : (
                                  <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Chưa xong</span>
                               )}
                             </td>
                             <td style={{padding: '16px 12px', borderBottom: '1px solid #E5E7EB', textAlign: 'center'}} onClick={e => e.stopPropagation()}>
                               {act.status !== 'Done' && (
                                  <button style={{background: 'transparent', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Đánh dấu hoàn tất" onClick={() => {
                                      const newActs = [...activities];
                                      const current = newActs.find(a => a.id === act.id);
                                      if(current) current.status = 'Done';
                                      setActivities(newActs);
                                  }}>
                                      <CheckCircle2 size={18} />
                                  </button>
                               )}
                             </td>
                           </tr>
                         )) : (
                           <tr>
                             <td colSpan="5" style={{padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', borderBottom: '1px solid #E5E7EB'}}>Chưa có hoạt động nào được ghi nhận</td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}
              {activeNotebookTab === 'tai_lieu' && (
                <div className="documents-section-modern">
                    <div className="section-header-modern" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                        <div className="section-title-box" onClick={() => setIsDocsCollapsed(!isDocsCollapsed)} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#1e293b'}}>
                            {isDocsCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                            <span>Hóa đơn chi phí</span>
                        </div>
                        <button className="btn-download-all" onClick={downloadAllFiles} style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer'}}><ArrowDownToLine size={16} /> Download All</button>
                    </div>
                    {!isDocsCollapsed && (
                      <div className="docs-wrapper">
                        <div className="upload-header-odoo" onClick={()=>document.getElementById('file-upload').click()} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s'}}>
                            <input type="file" id="file-upload" multiple style={{display: 'none'}} onChange={handleFileUpload} />
                            <ArrowDownToLine size={40} color="#003366" />
                            <div style={{marginTop: '12px', color: '#1e293b', fontWeight: 600, fontSize: '15px'}}>Drag and drop or Browse your file</div>
                            <div style={{marginTop: '4px', color: '#64748b', fontSize: '13px'}}>Tối đa 20MB mỗi file</div>
                        </div>
                        <div className="doc-table-container" style={{maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                          <table className="document-table-modern" style={{width: '100%', borderCollapse: 'collapse'}}>
                              <thead>
                                  <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                                      <th style={{width: '50px', textAlign: 'center', padding: '12px'}}>No</th>
                                      <th style={{textAlign: 'left', padding: '12px'}}>Tài liệu</th>
                                      <th style={{textAlign: 'left', padding: '12px'}}>Loại chứng từ</th>
                                      <th style={{textAlign: 'left', padding: '12px'}}>Nội dung tài liệu</th>
                                      <th style={{textAlign: 'left', padding: '12px'}}>Thời điểm tải lên</th>
                                      <th style={{width: '60px', textAlign: 'center', padding: '12px'}}>Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {documents.length > 0 ? documents.map((doc, i) => (
                                      <tr key={doc.id || i} style={{borderBottom: '1px solid #f1f5f9'}}>
                                          <td style={{textAlign: 'center', padding: '12px'}}>{(i + 1).toString().padStart(2, '0')}</td>
                                          <td style={{padding: '12px'}}>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                  <FileText size={18} color={doc.name.endsWith('.pdf') ? '#ef4444' : doc.name.endsWith('.xlsx') ? '#16a34a' : '#3b82f6'} />
                                                  <span className="doc-name-link" onClick={()=>{alert(`Tải file: ${doc.name}`);}}>{doc.name}</span>
                                              </div>
                                          </td>
                                          <td style={{padding: '12px'}}>
                                              <select className="doc-category-select" style={{width: '100%', border: '1px solid #e2e8f0', padding: '4px', borderRadius: '4px'}} value={doc.category} onChange={e => {
                                                  const newDocs = [...documents];
                                                  newDocs[i].category = e.target.value;
                                                  setDocuments(newDocs);
                                              }}>
                                                  <option value="Tài liệu về giá sản phẩm">Tài liệu về giá sản phẩm</option>
                                                  <option value="Hợp đồng">Hợp đồng</option>
                                                  <option value="Biên bản bàn giao">Biên bản bàn giao</option>
                                              </select>
                                          </td>
                                          <td style={{padding: '12px'}}>
                                              <input 
                                                type="text" 
                                                style={{border: 'none', background: 'transparent', width: '100%', borderBottom: '1px solid transparent', outline: 'none'}} 
                                                value={doc.description} 
                                                maxLength={100}
                                                placeholder="Nhập Nội dung tài liệu..."
                                                onChange={e => {
                                                  const newDocs = [...documents];
                                                  newDocs[i].description = e.target.value;
                                                  setDocuments(newDocs);
                                                }} 
                                                onFocus={(e)=>e.target.style.borderBottom='1px solid #cbd5e1'}
                                                onBlur={(e)=>e.target.style.borderBottom='1px solid transparent'}
                                              />
                                          </td>
                                          <td style={{padding: '12px', fontSize: '13px', color: '#64748b'}}>{doc.date} by <strong>{doc.author || 'Author'}</strong></td>
                                          <td style={{textAlign: 'center', padding: '12px'}}>
                                              <Trash2 size={16} color="#94a3b8" style={{cursor: 'pointer'}} onClick={()=>setDocuments(documents.filter((_, idx)=>idx!==i))} />
                                          </td>
                                      </tr>
                                  )) : (
                                      <tr>
                                          <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Chưa có tài liệu nào được tải lên</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
        </div>

        {/* Modal Hoạt động */}
        {activityModal.open && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div style={{background: '#fff', borderRadius: '8px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0'}}>
                  <span style={{fontWeight: 700, fontSize: '18px', color: '#1e293b'}}>Tạo hoạt động mới</span>
                  <button style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b'}} onClick={() => setActivityModal({...activityModal, open: false})}><X size={20}/></button>
              </div>
              <div style={{padding: '20px'}}>
                <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600}}>Tên Hoạt động</label>
                    <input type="text" style={{width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} value={activityModal.title} onChange={e=>setActivityModal({...activityModal, title: e.target.value})} placeholder="VD: Gọi điện tư vấn..." />
                </div>
                <div style={{marginBottom: '16px', position: 'relative'}}>
                    <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600}}>Người thực hiện</label>
                    <input type="text" style={{width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} placeholder="Gõ @ để tag..." value={activityModal.assignee} onChange={e => {
                        const val = e.target.value;
                        setActivityModal({...activityModal, assignee: val, mentionSearch: val.includes('@') ? val.slice(val.lastIndexOf('@')) : ''});
                    }} />
                    {activityModal.mentionSearch && (
                        <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '150px', overflowY: 'auto'}}>
                            {EMPLOYEES.filter(e => e.toLowerCase().includes(activityModal.mentionSearch.slice(1).toLowerCase())).map(e => (
                                <div key={e} style={{padding: '8px 12px', cursor: 'pointer'}} onClick={() => {
                                    const base = activityModal.assignee.substring(0, activityModal.assignee.lastIndexOf('@'));
                                    setActivityModal({...activityModal, assignee: base + e, mentionSearch: ''});
                                }}>{e}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600}}>Ngày đến hạn</label>
                    <input type="date" style={{width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} value={activityModal.dueDate} onChange={e=>setActivityModal({...activityModal, dueDate: e.target.value})} />
                </div>
              </div>
              <div style={{padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                  <button className="btn btn-secondary" onClick={() => setActivityModal({...activityModal, open: false})}>Hủy</button>
                  <button className="btn btn-secondary" onClick={() => handleCreateActivity(false)}>Lưu</button>
                  <button className="btn btn-primary" onClick={() => handleCreateActivity(true)}>Lưu và đánh dấu đã xong</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

};

export default CustomerForm;
