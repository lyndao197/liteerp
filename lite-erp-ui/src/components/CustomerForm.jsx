import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X, MessageSquare, ArrowDownToLine, Save, ArrowLeft, Plus, FileText, Calendar, User, Smile, Paperclip, MoreHorizontal, ChevronRight, ChevronDown, Maximize2, Edit2, Check } from 'lucide-react';
import './CustomerForm.css';
import { mockStore } from '../utils/mockStore';

// --- MOCK DATA FOR SELECTS ---
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
  district: '',
  ward: '',
  website: '',
  priority: '1',
  tag: '',
  source: 'Manual',
  contractNo: '',
  signedDate: '',
  interactionHistory: '',
  revenue: '0 ₫'
};

const FIELD_LABELS = {
  name: 'Tên khách hàng',
  shortName: 'Tên viết tắt',
  mst: 'Mã số thuế',
  classification: 'Phân loại',
  industry: 'Lĩnh vực',
  addressDetail: 'Địa chỉ chi tiết',
  province: 'Tỉnh/Thành phố',
  district: 'Quận/Huyện',
  ward: 'Phường/Xã',
  website: 'Website',
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
    if (field === 'province') setFormData(prev => ({...prev, district: '', ward: ''}));
    if (field === 'district') setFormData(prev => ({...prev, ward: ''}));
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
      chatterMessages: currentMessages
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

  const distOptions = formData.province ? (DISTRICTS[formData.province] || []) : [];
  const wardOptions = formData.district ? (WARDS[formData.district] || []) : [];

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
          <div className="badge-opportunity">{formData.source === 'Lead Conversion' ? 'Cơ hội' : 'Cơ hội'}</div>
        </div>

        <div className="form-card">
          <div className="form-row-modern">
            <div className="form-label-modern">
              <span>Tên khách hàng</span> <span className="asterisk">*</span>
            </div>
            <div className="form-value-modern" style={{position: 'relative'}}>
              <input type="text" className={`input-modern ${errors.name ? 'is-invalid' : ''}`} style={{maxWidth: '150px'}} placeholder="Tên viết tắt" value={formData.shortName} onChange={e=>hf('shortName', e.target.value)} />
              <div style={{flex: 1, position: 'relative'}}>
                  <input type="text" ref={nameRef} className={`input-modern ${errors.name ? 'is-invalid' : ''}`} placeholder="Nhập tên đầy đủ..." value={formData.name} 
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
                                  e.preventDefault(); // Ngăn focus bị mất trước khi click
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
              <input type="text" ref={mstRef} className={`input-modern ${errors.mst ? 'is-invalid' : ''}`} placeholder="Nhập mã số thuế..." value={formData.mst} onChange={e=>hf('mst', e.target.value)} />
            </div>
          </div>

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

          <div className="form-row-modern align-start">
            <div className="form-label-modern" style={{paddingTop: '8px'}}>
              <span>Địa Chỉ</span>
            </div>
            <div className="form-value-modern address-grid-modern">
              <input type="text" className="input-modern" placeholder="Địa chỉ chi tiết (nhà, ngõ ...)" value={formData.addressDetail} onChange={e=>hf('addressDetail', e.target.value)} />
              <div className="address-selectors">
                  <select className="select-modern" value={formData.province} onChange={e=>hf('province', e.target.value)}><option value="">Tỉnh/TP</option>{PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                  <select className="select-modern" value={formData.district} onChange={e=>hf('district', e.target.value)} disabled={!formData.province}><option value="">Quận/Huyện</option>{distOptions.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
                  <select className="select-modern" value={formData.ward} onChange={e=>hf('ward', e.target.value)} disabled={!formData.district}><option value="">Phường/Xã</option>{wardOptions.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select>
              </div>
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

          <div className="form-row-modern">
            <div className="form-label-modern">
              <span>Tag</span>
            </div>
            <div className="form-value-modern">
              <select className="select-modern" style={{maxWidth: '430px'}} value={formData.tag} onChange={e=>hf('tag', e.target.value)}>
                  <option value="">-- Chọn tag --</option>
                  <option value="VIP">VIP</option>
                  <option value="Tiềm năng">Tiềm năng</option>
              </select>
            </div>
          </div>

          <div className="form-row-modern">
            <div className="form-label-modern">
              <span>Nguồn</span>
            </div>
            <div className="form-value-modern">
              <select className={`select-modern select-badge ${formData.source === 'Lead Conversion' ? 'badge-lead' : 'badge-manual'}`} value={formData.source} onChange={e=>hf('source', e.target.value)}>
                  <option value="Manual">Manual</option>
                  <option value="Lead Conversion">Lead Conversion</option>
              </select>
            </div>
          </div>
        </div>

        {/* ONGOING CONTRACTS */}
        <div className="section-header" style={{margin: '32px 0 16px'}}>
           <h2 className="section-title" style={{fontSize: '18px'}}>Hợp đồng đang triển khai</h2>
        </div>
        <div className="table-card">
           <div className="table-header contracts-grid">
               <span>STT</span><span>ID Hợp đồng</span><span>Tên hợp đồng</span>
           </div>
           {id ? (
               contractsList.length > 0 ? contractsList.map((ctr, idx) => (
                   <div className="table-row contracts-grid" key={ctr.id}>
                       <span>{(idx + 1).toString().padStart(2, '0')}</span>
                       <span className="text-link" onClick={() => navigate('/contracts')}>{ctr.id}</span>
                       <span>{ctr.name}</span>
                   </div>
               )) : (
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
                 { id: 'DH-2026-001', status: 'Đang triển khai', revenue: '450,000,000 VNĐ' },
                 { id: 'DH-2026-004', status: 'Đang triển khai', revenue: '125,000,000 VNĐ' }
               ].map((ord, idx) => (
                   <div className="table-row" key={ord.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 150px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center' }}>
                       <span style={{ color: '#94a3b8' }}>{(idx + 1).toString().padStart(2, '0')}</span>
                       <span style={{ color: '#2563eb', fontWeight: 600 }}>{ord.id}</span>
                       <span>
                          <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{ord.status}</span>
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
                <div className="deals-tab">
                   <div className="table-header" style={{display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px'}}>
                        <span>STT</span><span>Tên Dịch vụ</span>
                   </div>
                   {deals.length > 0 ? deals.map((d, index) => (
                       <div key={index} className="table-row" style={{display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px'}}>
                           <span>{index + 1}</span>
                           <span>{d.name}</span>
                       </div>
                   )) : (
                       <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Chưa có deal nào trực thuộc khách hàng này</div>
                   )}
                </div>
              )}
              {activeNotebookTab === 'hoat_dong' && (
                <div className="activity-tab">
                    <div className="activity-list" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        {activities.length > 0 ? activities.map(act => (
                            <div key={act.id} className="activity-item" style={{display: 'flex', gap: '12px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${act.status === 'Done' ? '#10b981' : '#3b82f6'}`}}>
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px'}}>{act.title}<span style={{fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: act.status === 'Done' ? '#dcfce7' : '#dbeafe', color: act.status === 'Done' ? '#166534' : '#1e40af'}}>{act.status}</span></div>
                                    <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{act.assignee} | Hạn: {act.dueDate}</div>
                                </div>
                            </div>
                        )) : (<div style={{textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '12px'}}>Chưa có hoạt động nào được ghi nhận</div>)}
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
