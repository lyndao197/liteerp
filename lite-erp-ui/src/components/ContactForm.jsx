import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Smile, Paperclip, Maximize2, ArrowLeft, Save } from 'lucide-react';
import './ContactForm.css'; // Use the new specialized CSS
import { mockStore } from '../utils/mockStore';

const FIELD_LABELS = {
  name: 'Họ tên',
  gender: 'Giới tính',
  rank: 'Cấp bậc',
  position: 'Chức danh thực tế',
  dob: 'Ngày sinh',
  companyId: 'Công ty liên quan',
  phone: 'Số điện thoại',
  email: 'Email',
  status: 'Trạng thái',
  isActive: 'Cờ Active/Deactive'
};

const RANKS = ['Nhân viên', 'Chuyên viên', 'Trưởng phòng', 'Cán bộ cấp cao', 'BGD'];

const ContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const nameInputRef = useRef(null);
  const companyIdInputRef = useRef(null);

  // TABS
  const [activeNotebookTab, setActiveNotebookTab] = useState('notes');

  // STATES
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // FORM DATA
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Nam',
    rank: '',
    position: '',
    dob: '',
    companyId: '',
    phone: '',
    email: '',
    status: 'Doanh nghiệp',
    isActive: true,
    avatars: []
  });
  const [snapshotData, setSnapshotData] = useState({});
  const [customers, setCustomers] = useState([]);
  
  // CHATTER
  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState('');

  // LOAD DATA
  useEffect(() => {
    setCustomers(mockStore.getAllCustomers());
    if (id) {
      const contact = mockStore.getContact(id);
      if (contact) {
        // Fallbacks for missing fields or changes in data structure
        const loadedData = {
           ...formData, 
           ...contact, 
           status: contact.status || 'Doanh nghiệp',
           gender: contact.gender || 'Nam'
        };
        setFormData(loadedData);
        setSnapshotData(loadedData);
        setChatterMessages(contact.chatterMessages || []);
      }
    }
  }, [id]);

  const hf = (field, val) => {
    setFormData(prev => ({...prev, [field]: val}));
  };

  const handleSave = () => {
    // Mandatory fields validation
    const mandatoryFields = ['name', 'companyId'];
    const missingFields = mandatoryFields.filter(f => !formData[f]);
    
    if (missingFields.length > 0) {
      const newErrors = {};
      missingFields.forEach(f => {
        newErrors[f] = `${FIELD_LABELS[f]} là thông tin bắt buộc`;
      });
      setErrors(newErrors);
      
      if (missingFields.includes('name')) nameInputRef.current?.focus();
      else if (missingFields.includes('companyId')) companyIdInputRef.current?.focus();
      return;
    }
    setErrors({});

    // Track changes
    const changes = [];
    Object.keys(FIELD_LABELS).forEach(key => {
      if (formData[key] !== snapshotData[key]) {
        const oldVal = snapshotData[key] || '(trống)';
        const newVal = formData[key] || '(trống)';
        let oldDisplay = oldVal;
        let newDisplay = newVal;
        
        if (key === 'companyId') {
            oldDisplay = customers.find(c => c.id === oldVal)?.name || oldVal;
            newDisplay = customers.find(c => c.id === newVal)?.name || newVal;
        } else if (key === 'isActive') {
            oldDisplay = (oldVal === true) ? "Active" : (oldVal === false ? "Deactive" : "(trống)");
            newDisplay = (newVal === true) ? "Active" : (newVal === false ? "Deactive" : "(trống)");
        }
        
        changes.push({
            label: FIELD_LABELS[key],
            from: oldDisplay,
            to: newDisplay
        });
      }
    });

    let currentMessages = chatterMessages;
    if (!id) {
      const newLog = {
        id: Date.now() + Math.random(),
        type: 'log',
        author: 'Phạm Quang Mạnh',
        changes: null,
        text: 'Tạo mới thành công liên hệ',
        time: 'vừa xong',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
      };
      currentMessages = [newLog, ...chatterMessages];
    } else if (changes.length > 0) {
      const newLog = {
        id: Date.now() + Math.random(),
        type: 'log',
        author: 'Phạm Quang Mạnh',
        changes: changes,
        time: 'vừa xong',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
      };
      currentMessages = [newLog, ...chatterMessages];
    }

    const dataToSave = {
      ...formData,
      chatterMessages: currentMessages
    };

    if (id) {
      mockStore.saveContact(id, dataToSave);
      setSnapshotData(dataToSave);
    } else {
      const existingContacts = mockStore.getAllContacts() || [];
      const currentMax = existingContacts.reduce((max, c) => {
        if (c.id && c.id.startsWith('CON-')) {
          const num = parseInt(c.id.split('-')[1], 10);
          if (!isNaN(num) && num < 100000000) return Math.max(max, num);
        }
        return max;
      }, 0);
      const newId = `CON-${currentMax + 1}`;
      dataToSave.id = newId;
      mockStore.saveContact(newId, dataToSave);
      setSnapshotData(dataToSave);
      navigate(`/contact/edit/${newId}`, { replace: true });
    }
    setToastMessage('Lưu liên hệ thành công!');
    setTimeout(() => setToastMessage(''), 3000);
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

  const handleBack = () => {
    if (id) {
        const cancelLog = {
          id: Date.now() + Math.random(),
          type: 'log',
          author: 'Phạm Quang Mạnh',
          text: 'Đã hủy thao tác cập nhật biểu mẫu',
          time: 'vừa xong',
          avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
        };
        mockStore.saveContact(id, {...formData, chatterMessages: [cancelLog, ...chatterMessages]});
    }
    navigate('/contacts');
  };

  return (
    <div className="contact-form-container">
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', background: '#4bb543', 
          color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {toastMessage}
        </div>
      )}

      <div className="contact-top-bar">
        <div className="contact-breadcrumb">
          <span className="breadcrumb-parent">Quản lý liên hệ khách hàng</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{id ? 'Cập nhật liên hệ' : 'Thêm mới liên hệ'}</span>
        </div>
        <div className="contact-top-actions">
          <button className="btn-back-top" onClick={handleBack}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <button className="btn-save-top" onClick={handleSave}>
            <Save size={16} /> Lưu hồ sơ
          </button>
        </div>
      </div>

      <div className="contact-header">
        <div className="contact-header-left">
          <h1>Thông tin liên hệ chi tiết</h1>
          <div 
            className={formData.isActive ? "status-badge-active" : "status-badge-inactive"}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => hf('isActive', !formData.isActive)}
          >
            {formData.isActive ? "Active" : "Deactive"}
          </div>
        </div>
      </div>

      <div className="contact-box-bor">
        <div className="form-list">
          {/* Row 1: Họ tên */}
          <div className="form-row">
            <div className="form-label">
              <span>Họ tên</span><span className="required">*</span>
            </div>
            <div className="form-input-wrapper">
              <input 
                ref={nameInputRef}
                type="text" 
                className="form-input-text" 
                style={errors.name ? { borderBottom: '1px solid #e32b4c' } : {}}
                value={formData.name} 
                onChange={e => {
                  hf('name', e.target.value);
                  if (errors.name) setErrors({...errors, name: null});
                }} 
                placeholder="Nhập họ tên"
              />
              {errors.name && <div style={{ color: '#e32b4c', fontSize: '13px', marginTop: '4px' }}>{errors.name}</div>}
            </div>
          </div>

          {/* Row 2: Giới tính */}
          <div className="form-row">
            <div className="form-label">
              <span>Giới tính</span>
            </div>
            <div className="form-input-wrapper">
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    checked={formData.gender === 'Nam'} 
                    onChange={() => hf('gender', 'Nam')} 
                  /> Nam
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    checked={formData.gender === 'Nữ'} 
                    onChange={() => hf('gender', 'Nữ')} 
                  /> Nữ
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: Sinh nhật */}
          <div className="form-row">
            <div className="form-label">
              <span>Sinh Nhật</span>
            </div>
            <div className="form-input-wrapper">
              <input 
                type="date" 
                className="form-input-text" 
                value={formData.dob} 
                onChange={e => hf('dob', e.target.value)} 
              />
            </div>
          </div>

          {/* Row 4: Cấp bậc */}
          <div className="form-row">
            <div className="form-label">
              <span>Cấp bậc</span>
            </div>
            <div className="form-input-wrapper">
              <select 
                className="form-select" 
                value={formData.rank} 
                onChange={e => hf('rank', e.target.value)}
              >
                <option value="">-- Chọn cấp bậc --</option>
                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Row 5: Chức danh thực tế */}
          <div className="form-row">
            <div className="form-label">
              <span>Chức danh thực tế</span>
            </div>
            <div className="form-input-wrapper">
              <input 
                type="text" 
                className="form-input-text" 
                value={formData.position} 
                onChange={e => hf('position', e.target.value)} 
                placeholder="Ví dụ: Cán bộ cấp cao"
              />
            </div>
          </div>

          {/* Row 6: Công ty liên quan */}
          <div className="form-row">
            <div className="form-label">
              <span>Công ty liên quan</span><span className="required">*</span>
            </div>
            <div className="form-input-wrapper">
              <select 
                ref={companyIdInputRef}
                className="form-select" 
                style={errors.companyId ? { border: '1px solid #e32b4c' } : {}}
                value={formData.companyId} 
                onChange={e => {
                  hf('companyId', e.target.value);
                  if (errors.companyId) setErrors({...errors, companyId: null});
                }}
              >
                <option value="">-- Chọn công ty --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.companyId && <div style={{ color: '#e32b4c', fontSize: '13px', marginTop: '4px' }}>{errors.companyId}</div>}
            </div>
          </div>

          {/* Row 7: Trạng thái (Classification implicitly) */}
          <div className="form-row">
            <div className="form-label">
              <span>Trạng thái</span>
            </div>
            <div className="form-input-wrapper">
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    checked={formData.status === 'Doanh nghiệp'} 
                    onChange={() => hf('status', 'Doanh nghiệp')} 
                  /> Doanh nghiệp
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    checked={formData.status === 'Nội bộ'} 
                    onChange={() => hf('status', 'Nội bộ')} 
                  /> Nội bộ
                </label>
              </div>
            </div>
          </div>

          {/* Row 8: Email */}
          <div className="form-row">
            <div className="form-label">
              <span>Email</span>
            </div>
            <div className="form-input-wrapper">
              <input 
                type="email" 
                className="form-input-text" 
                value={formData.email} 
                onChange={e => hf('email', e.target.value)} 
                placeholder="example@domain.com"
              />
            </div>
          </div>

          {/* Row 9: Số điện thoại (Missing in Figma but required by user) */}
          <div className="form-row">
            <div className="form-label">
              <span>Số điện thoại</span>
            </div>
            <div className="form-input-wrapper">
              <input 
                type="text" 
                className="form-input-text" 
                value={formData.phone} 
                onChange={e => hf('phone', e.target.value)} 
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notebook Notes */}
      <div className="notebook">
        <div className="notebook-tabs">
          <div 
            className={`notebook-tab ${activeNotebookTab === 'notes' ? 'active' : ''}`} 
            onClick={() => setActiveNotebookTab('notes')}
          >
            Ghi chú
          </div>
          <div 
            className={`notebook-tab ${activeNotebookTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveNotebookTab('history')}
          >
            Lịch sử hoạt động
          </div>
        </div>

        <div className="notebook-content">
          {activeNotebookTab === 'notes' && (
            <div className="chatter-input-wrapper" style={{marginBottom: '24px'}}>
              <div className="chatter-avatar-small">
                <img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
              <div style={{flex: 1}}>
                <div className="chatter-input-box">
                  <textarea 
                    className="chatter-textarea" 
                    placeholder="Ghi chú về người liên hệ này..." 
                    value={chatterInput} 
                    onChange={(e) => setChatterInput(e.target.value)}
                  />
                  <div className="chatter-input-toolbar">
                      <div className="chatter-toolbar-left">
                          <Smile size={18} style={{cursor: 'pointer'}} />
                          <Paperclip size={18} style={{cursor: 'pointer'}} />
                      </div>
                      <div className="chatter-toolbar-right">
                          <Maximize2 size={16} style={{color: '#64748b', cursor: 'pointer'}} />
                      </div>
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  style={{marginTop: '10px', width: 'auto', padding: '0 16px', height: '32px'}} 
                  onClick={postNote}
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {chatterMessages.filter(msg => activeNotebookTab === 'notes' ? msg.type === 'note' : msg.type === 'log').map(msg => (
              <div key={msg.id} className="message-item-odoo">
                <div className="chatter-avatar-small" style={{width: '32px', height: '32px'}}>
                  <img src={msg.avatar} alt="Author" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <div className="message-content-wrapper">
                  <div className="message-author-info">
                      <span className="message-author-name">{msg.author}</span>
                      <span className="message-time">- {msg.time}</span>
                  </div>
                  <div className="message-body-odoo">
                    {msg.type === 'log' ? (
                        <div style={{background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                            {msg.text && <div style={{fontWeight: 600, color: '#334155', marginBottom: msg.changes ? '8px' : '0'}}>{msg.text}</div>}
                            {msg.changes && (
                              <ul style={{margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#64748b'}}>
                                  {msg.changes.map((change, i) => (
                                      <li key={i} style={{marginBottom: '4px'}}>
                                          Đã đổi <span style={{fontWeight: 600, color: '#334155'}}>{change.label}</span> từ <span style={{fontStyle: 'italic', color: '#94a3b8'}}>'{change.from}'</span> thành <span style={{fontWeight: 700, color: '#ed0029'}}>'{change.to}'</span>
                                      </li>
                                  ))}
                              </ul>
                            )}
                        </div>
                    ) : (
                        <div style={{whiteSpace: 'pre-wrap'}}>{msg.text}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {chatterMessages.filter(msg => activeNotebookTab === 'notes' ? msg.type === 'note' : msg.type === 'log').length === 0 && (
              <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0'}}>Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button className="btn-tertiary" onClick={handleBack}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={20} /> Lưu hồ sơ
        </button>
      </div>

    </div>
  );
};

export default ContactForm;
