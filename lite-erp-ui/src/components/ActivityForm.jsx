import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, MessageSquare, Search, Phone, Mail, Calendar, Paperclip, Smile, Maximize2, ArrowDownToLine, FileText, Trash2, ChevronDown, ChevronRight, Edit2, ThumbsUp, Heart } from 'lucide-react';
import './LeadForm.css';
import { mockStore } from '../utils/mockStore';

const EMPLOYEES = ['Trần B (Bạn)', 'Nguyễn Văn A', 'Lê Thị C'];

function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'call',
    relatedEntity: '',
    relatedEntityName: '',
    dueDate: '',
    priority: 'normal',
    status: 'todo',
    isDaily: false,
    notes: '',
    assignee: 'Trần B (Bạn)',
    reporter: 'Trần B (Bạn)'
  });

  const [modalState, setModalState] = useState({ open: false, type: '', searchInput: '' });

  const [activeChatterTab, setActiveChatterTab] = useState('log_note');
  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState('');
  const [showMention, setShowMention] = useState(false);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  
  const [documents, setDocuments] = useState([
    { id: 'DOC-001', name: 'Báo_giá_Cloud_v1.pdf', category: 'Tài liệu về giá sản phẩm', description: 'Báo giá sơ bộ gửi KH', date: '2026-04-10', author: 'Mitchell Admin' }
  ]);
  const [isDocsCollapsed, setIsDocsCollapsed] = useState(false);
  const [activeNotebookTab, setActiveNotebookTab] = useState('notes');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const hf = (field, val) => {
    setFormData(prev => ({...prev, [field]: val}));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.title.trim()) {
      alert('Vui lòng điền Tên nhiệm vụ trước khi lưu.');
      return;
    }

    // Simulate save logic here
    if (!id || id === 'new') {
      const newId = `ACT-${Math.floor(Math.random() * 1000)}`;
      addChatterMessage('log', 'Hệ', 'Đã tạo mới và lưu thành công công việc', 'vừa xong', '#fef3c7');
      alert('Đã tạo nhiệm vụ thành công!');
      // STAY ON SCREEN but transform to Edit mode
      navigate(`/activity/edit/${newId}`, { replace: true });
    } else {
      addChatterMessage('log', 'Hệ', 'Đã lưu mọi thay đổi nội dung công việc', 'vừa xong', '#fef3c7');
      alert('Đã lưu thay đổi!');
    }
  };

  const isReadOnly = id && id !== 'new' && formData.status !== 'todo';

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

  const openSearchModal = (type) => {
    setModalState({ open: true, type, searchInput: '' });
  };
  const closeSearchModal = () => setModalState({ open: false, type: '', searchInput: '' });

  const handleSelectModalItem = (id, name) => {
    if (modalState.type === 'entity') {
      hf('relatedEntity', id);
      hf('relatedEntityName', name);
    }
    closeSearchModal();
  };

  const insertMention = (emp) => {
    if(!textareaRef.current) return;
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
    setChatterMessages(prev => [{ id: Date.now(), type, author, text, time, bg, reactions: [] }, ...prev]);
  };

  const postNote = (e) => {
    e.preventDefault();
    if(!chatterInput) return;
    addChatterMessage('note', 'Bạn', chatterInput, 'vừa xong', '#fef3c7');
    setChatterInput('');
  };

  const handleDeleteNote = (id) => {
    setChatterMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleStartEdit = (msg) => {
    setEditingNoteId(msg.id);
    setEditingNoteText(msg.text);
  };

  const handleSaveEdit = () => {
    setChatterMessages(prev => prev.map(m => m.id === editingNoteId ? { ...m, text: editingNoteText } : m));
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const toggleReaction = (msgId, emoji) => {
    setChatterMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const reactions = m.reactions || [];
      if (reactions.includes(emoji)) {
        return { ...m, reactions: reactions.filter(r => r !== emoji) };
      }
      return { ...m, reactions: [...reactions, emoji] };
    }));
  };

  return (
    <div className="lead-form-container">
      {/* HEADER */}
      <div className="lead-form-header" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/activity')}>Danh sách Nhiệm vụ</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{id ? id : 'Mới'}</span>
        </div>
        <div className="header-actions" style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto'}}>
           <div className="actions-left" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
             {id && id !== 'new' && formData.status === 'todo' && (
               <button type="button" className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => setShowDeleteConfirm(true)}>
                 Xóa
               </button>
             )}
             <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isReadOnly}>Lưu</button>
           </div>
        </div>
      </div>

      <div className="form-chatter-wrapper">
        <div className="lead-form-sheet sheet-inner-wrapper">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <div className="oe_button_box" style={{marginBottom: 0}}></div>
            <div className="statusbar" style={{background: 'transparent', margin: 0, gap: '4px'}}>
               {['todo', 'processing', 'done'].map((st) => {
                  const isCurrent = formData.status === st;
                  const label = st === 'todo' ? 'Mới' : (st === 'processing' ? 'Đang thực hiện' : 'Hoàn thành');
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
                      border: !isCurrent ? '1px solid transparent' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      hf('status', st);
                      addChatterMessage('log', 'Hệ', `Đã chuyển trạng thái sang ${label}`, 'vừa xong', '#fef3c7');
                    }}
                  >
                    {label}
                  </div>
               )})}
            </div>
          </div>

          <div className="sheet-title-section">
            <div className="oe_title">
              <label>Tên nhiệm vụ <span style={{color:'red'}}>*</span></label>
              <input type="text" className="title-input" placeholder="VD: Gọi điện chăm sóc định kỳ..." name="title" value={formData.title} onChange={handleChange} disabled={isReadOnly} />
            </div>
          </div>

          <div className="sheet-main-content">
            {/* L COLUMN */}
            <div className="form-column">
              <div className="column-title">Thông tin chung</div>
              <div className="form-group">
                <label className="form-label">Phân loại</label>
                <select className="form-control" name="type" value={formData.type} onChange={handleChange} disabled={isReadOnly}>
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Liên kết tới</label>
                <div className="autocomplete-container" style={{display: 'flex'}}>
                  <input type="text" className="form-control" name="relatedEntityName" value={formData.relatedEntityName || formData.relatedEntity || ''} onChange={handleChange} placeholder="Chọn cơ hội/khách hàng..." style={{borderRight: 'none'}} disabled={isReadOnly} />
                  <button type="button" className="btn btn-secondary" style={{padding: '4px 8px', borderLeft: 'none', background: 'transparent', borderColor: 'transparent', borderBottom: '1px solid #e2e8f0'}} onClick={() => openSearchModal('entity')} disabled={isReadOnly}>
                    <Search size={16} color="#64748b"/>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Độ ưu tiên</label>
                <div style={{position: 'relative', width: '65%'}}>
                  <select 
                    className="form-control" 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange}
                    style={{width: '100%'}}
                    disabled={isReadOnly}
                  >
                    <option value="normal">⭐ Bình thường</option>
                    <option value="high">⭐ Gấp</option>
                    <option value="critical">⭐ Rất gấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* R COLUMN */}
            <div className="form-column">
              <div className="column-title">Thời gian & Phân công</div>
              <div className="form-group">
                <label className="form-label">Giao việc cho</label>
                <select className="form-control" name="assignee" value={formData.assignee} onChange={handleChange} disabled={isReadOnly}>
                  {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Báo cáo bởi</label>
                <select className="form-control" name="reporter" value={formData.reporter} onChange={handleChange} disabled>
                  {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hạn chót</label>
                <input type="date" className="form-control" name="dueDate" value={formData.dueDate} onChange={handleChange} disabled={isReadOnly} />
              </div>
            </div>
          </div>
        </div>
          

        {/* DOCUMENT SECTION (MOVED UP) */}
        <div className="lead-form-sheet sheet-inner-wrapper" style={{ marginTop: '24px' }}>
          <div className="documents-section-modern">
              <div className="section-header-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div className="section-title-box" onClick={() => setIsDocsCollapsed(!isDocsCollapsed)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}>
                      {isDocsCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                      <span style={{ fontSize: '18px' }}>Tài liệu đính kèm</span>
                  </div>
                  <button onClick={() => alert('Đang chuẩn bị tải xuống toàn bộ...')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', color: '#64748b' }}>
                    <ArrowDownToLine size={16} /> Download All
                  </button>
              </div>

              {!isDocsCollapsed && (
                <div className="docs-wrapper">
                  <div className="upload-header-odoo" onClick={() => document.getElementById('file-upload').click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', transition: 'all 0.2s' }}>
                      <input type="file" id="file-upload" multiple style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length > 0) {
                          const newDoc = {
                            id: `DOC-${Date.now()}`,
                            name: e.target.files[0].name,
                            category: 'Tài liệu khác',
                            description: '',
                            date: 'Vừa xong',
                            author: 'Mitchell Admin'
                          };
                          setDocuments([newDoc, ...documents]);
                          addChatterMessage('log', 'Mitchell Admin', `Đã tải lên tài liệu: ${newDoc.name}`, 'vừa xong', '#fef3c7');
                        }
                      }} />
                      <ArrowDownToLine size={40} color="#e32b4c" />
                      <div style={{ marginTop: '12px', color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>Kéo thả hoặc Duyệt để tải file lên</div>
                      <div style={{ marginTop: '4px', color: '#64748b', fontSize: '13px' }}>Tối đa 20MB mỗi file</div>
                  </div>
                  
                  <div className="doc-table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white' }}>
                    <table className="document-table-modern" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ width: '50px', textAlign: 'center', padding: '12px', fontSize: '13px', color: '#475569' }}>STT</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569' }}>Tài liệu</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569' }}>Nội dung tài liệu</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569' }}>Thời điểm</th>
                                <th style={{ width: '60px', textAlign: 'center', padding: '12px', fontSize: '13px', color: '#475569' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, i) => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ textAlign: 'center', padding: '12px', fontSize: '13px' }}>{(i + 1).toString().padStart(2, '0')}</td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={18} color={doc.name.endsWith('.pdf') ? '#ef4444' : '#3b82f6'} />
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e32b4c', cursor: 'pointer' }}>{doc.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <input type="text" style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '13px', borderBottom: '1px solid transparent' }} placeholder="Ghi chú file..." value={doc.description} onChange={() => {}} />
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8' }}>{doc.date} bởi <strong>{doc.author}</strong></td>
                                    <td style={{ textAlign: 'center', padding: '12px' }}>
                                        <Trash2 size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))} />
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '14px' }}>Chưa có tài liệu nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* BOTTOM NOTEBOOK: NOTES & HISTORY */}
        <div className="lead-form-sheet sheet-inner-wrapper" style={{ marginTop: '24px', marginBottom: '40px' }}>
          <div className="notebook" style={{ border: 'none' }}>
            <div className="notebook-tabs" style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div 
                className={`notebook-tab ${activeNotebookTab === 'notes' ? 'active' : ''}`} 
                onClick={() => setActiveNotebookTab('notes')}
                style={{ 
                    padding: '8px 4px', 
                    cursor: 'pointer', 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    color: activeNotebookTab === 'notes' ? '#e32b4c' : '#64748b',
                    borderBottom: activeNotebookTab === 'notes' ? '2px solid #e32b4c' : 'none'
                }}
              >
                Ghi chú nội bộ
              </div>
              <div 
                className={`notebook-tab ${activeNotebookTab === 'history' ? 'active' : ''}`} 
                onClick={() => setActiveNotebookTab('history')}
                style={{ 
                    padding: '8px 4px', 
                    cursor: 'pointer', 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    color: activeNotebookTab === 'history' ? '#e32b4c' : '#64748b',
                    borderBottom: activeNotebookTab === 'history' ? '2px solid #e32b4c' : 'none'
                }}
              >
                Lịch sử hoạt động
              </div>
            </div>

            <div className="notebook-content">
              {activeNotebookTab === 'notes' && (
                <div className="notes-tab-content">
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <div className="chatter-avatar-small" style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="chatter-input-box" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
                        <textarea 
                          className="chatter-textarea" 
                          placeholder="Ghi chú nội dung trao đổi hoặc log hoạt động..." 
                          value={chatterInput} 
                          onChange={handleChatterChange}
                          ref={textareaRef}
                          style={{ width: '100%', border: 'none', padding: '12px', minHeight: '80px', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                        />
                        <div className="chatter-input-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
                          <div className="chatter-toolbar-left" style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                            <Smile size={18} style={{ cursor: 'pointer' }} />
                            <Paperclip size={18} style={{ cursor: 'pointer' }} onClick={() => document.getElementById('file-upload').click()} />
                          </div>
                          <div className="chatter-toolbar-right">
                            <Maximize2 size={16} style={{ cursor: 'pointer', color: '#64748b' }} />
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn-log-odoo" 
                        onClick={postNote}
                        style={{ marginTop: '12px', background: '#e32b4c', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                      >
                        Ghi
                      </button>
                    </div>
                  </div>

                  <div className="chatter-messages" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {chatterMessages.filter(m => m.type !== 'log').map(msg => (
                      <div key={msg.id} className="message-item-odoo" style={{ display: 'flex', gap: '12px', position: 'relative', group: 'true' }}>
                        <div className="chatter-avatar-small" style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#e0e7ff' }}>
                           <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${msg.author}&backgroundColor=b6e3f4`} alt="Author" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className="message-content-wrapper" style={{ flex: 1 }}>
                          <div className="message-author-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="message-author-name" style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>{msg.author}</span>
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>- {msg.time}</span>
                            </div>
                            
                            {/* ACTION BUTTONS (VISIBLE ON HOVER-ISH) */}
                            <div className="message-actions" style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
                                <Smile size={14} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => toggleReaction(msg.id, '😊')} />
                                <ThumbsUp size={14} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => toggleReaction(msg.id, '👍')} />
                                <Heart size={14} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => toggleReaction(msg.id, '❤️')} />
                                <Edit2 size={14} style={{ cursor: 'pointer', color: '#64748b', marginLeft: '8px' }} onClick={() => handleStartEdit(msg)} />
                                <Trash2 size={14} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDeleteNote(msg.id)} />
                            </div>
                          </div>

                          {editingNoteId === msg.id ? (
                            <div style={{ marginTop: '8px' }}>
                              <textarea 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                              />
                              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={handleSaveEdit}>Lưu</button>
                                <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => setEditingNoteId(null)}>Hủy</button>
                              </div>
                            </div>
                          ) : (
                            <div className="message-body-odoo" style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                               {msg.text}
                            </div>
                          )}

                          {/* REACTIONS DISPLAY */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                              {msg.reactions.map((r, idx) => (
                                <span key={idx} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }} onClick={() => toggleReaction(msg.id, r)}>
                                  {r}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatterMessages.filter(m => m.type !== 'log').length === 0 && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px', fontStyle: 'italic' }}>Chưa có ghi chú nào.</div>
                    )}
                  </div>
                </div>
              )}

              {activeNotebookTab === 'history' && (
                <div className="history-tab-content">
                  <div className="doc-table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white' }}>
                    <table className="document-table-modern" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>Người thao tác</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>Thời gian</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>Nội dung thay đổi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chatterMessages.filter(m => m.type === 'log').map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${log.author}&backgroundColor=f1f5f9`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                                            </div>
                                            {log.author}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{log.time}</td>
                                    <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>
                                        <div style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', border: '1px solid #f1f5f9' }}>
                                            {log.text}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {chatterMessages.filter(m => m.type === 'log').length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '14px' }}>Chưa có lịch sử hoạt động.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL */}
      {modalState.open && modalState.type === 'entity' && (
        <div className="modal-overlay" onClick={() => closeSearchModal()}>
          <div className="modal-content modal-partner" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Liên kết Khách hàng / Cơ hội</div>
              <button className="modal-close" onClick={closeSearchModal}>&times;</button>
            </div>
            <div className="modal-body" style={{padding: 0}}>
              <div className="odoo-search-bar">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Gõ tên khách hàng để tìm..." 
                  className="form-control"
                  style={{width: '300px', borderBottom: '1px solid #cbd5e1'}}
                  value={modalState.searchInput}
                  onChange={e => setModalState({...modalState, searchInput: e.target.value})}
                />
              </div>
              <div className="partner-table-wrapper" style={{maxHeight: '350px'}}>
                <table className="odoo-table">
                  <thead>
                    <tr>
                      <th>Tên đối tác</th>
                      <th>Mã số thuế</th>
                      <th>Phân loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStore.getAllCustomers().filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(cli => (
                      <tr key={cli.id} onClick={() => handleSelectModalItem(cli.id, cli.name)}>
                        <td style={{fontWeight: 600, color: '#0f172a'}}>{cli.name}</td>
                        <td>{cli.mst}</td>
                        <td>{cli.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px' }}>
             <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
               Xác nhận xóa
             </div>
             <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
               Bạn có chắc chắn muốn xóa công việc này không? Thao tác này không thể hoàn tác.
             </p>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Hủy</button>
               <button className="btn btn-primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} onClick={() => {
                 // Simulate delete
                 navigate('/activity');
               }}>Đồng ý</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityForm;
