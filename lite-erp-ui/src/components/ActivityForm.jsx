import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Search, 
  Calendar, 
  Trash2, 
  ArrowDownToLine, 
  UploadCloud, 
  MessageSquare, 
  Clock, 
  MoreVertical, 
  Smile, 
  Send 
} from 'lucide-react';
import './ActivityForm.css';
import { mockStore } from '../utils/mockStore';

const EMPLOYEES = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Thị C', 'Mitchell Admin'];

function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: 'Nhập tên nhiệm vụ',
    type: '',
    relatedEntity: '',
    relatedEntityName: '',
    dueDate: '2026-05-08',
    priority: 'low',
    status: 'todo', // 'todo' (Mới), 'processing' (Đang thực hiện), 'done' (Hoàn thành)
    tag: '',
    notes: '',
    reporter: 'Nguyễn Văn A',
    assignees: [
      { name: '', description: '' }
    ]
  });

  const [modalState, setModalState] = useState({ open: false, type: '', searchInput: '' });
  const [activeSidebarTab, setActiveSidebarTab] = useState('comment'); // 'comment' | 'history'
  
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: '2h trước',
      text: 'Cần cập nhật thông tin báo giá cho khách hàng.',
      likes: 45,
      hearts: 25,
      userLiked: false,
      userHearted: false
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      time: '5h trước',
      text: 'Đã liên hệ với khách hàng, họ đang xem xét đề xuất.',
      likes: 45,
      hearts: 25,
      userLiked: false,
      userHearted: false
    }
  ]);
  
  const [historyLogs, setHistoryLogs] = useState([
    { id: 1, author: 'Nguyễn Văn A', time: '08:30 17/04/2026', text: 'Đã tạo nhiệm vụ mới' },
    { id: 2, author: 'Nguyễn Văn A', time: '09:15 17/04/2026', text: 'Đã đính kèm tài liệu Hopdo...' }
  ]);

  const [commentInput, setCommentInput] = useState('');
  
  const [documents, setDocuments] = useState([
    { 
      id: 'DOC-001', 
      name: 'Hopdo...', 
      fullName: 'Hopdong_Cungcap_Dichvu_v1.pdf',
      description: 'Báo giá sơ bộ gửi KH', 
      date: '17/04/2026' 
    }
  ]);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const hf = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      alert('Vui lòng nhập tên nhiệm vụ.');
      return;
    }
    
    // Add log entry
    setHistoryLogs(prev => [
      { id: Date.now(), author: 'Bạn', time: 'Vừa xong', text: 'Đã lưu thông tin nhiệm vụ' },
      ...prev
    ]);
    
    alert('Đã lưu nhiệm vụ thành công!');
  };

  const handleAddAssignee = () => {
    setFormData(prev => ({
      ...prev,
      assignees: [...prev.assignees, { name: '', description: '' }]
    }));
  };

  const handleRemoveAssignee = (index) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter((_, idx) => idx !== index)
    }));
  };

  const handleAssigneeChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.assignees];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, assignees: updated };
    });
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'Bạn',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Vừa xong',
      text: commentInput,
      likes: 0,
      hearts: 0,
      userLiked: false,
      userHearted: false
    };
    setComments(prev => [...prev, newComment]);
    setCommentInput('');
  };

  const toggleReaction = (commentId, type) => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      if (type === 'like') {
        return {
          ...c,
          likes: c.userLiked ? c.likes - 1 : c.likes + 1,
          userLiked: !c.userLiked
        };
      } else if (type === 'heart') {
        return {
          ...c,
          hearts: c.userHearted ? c.hearts - 1 : c.hearts + 1,
          userHearted: !c.userHearted
        };
      }
      return c;
    }));
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map((f, i) => ({
        id: `DOC-${Date.now()}-${i}`,
        name: f.name.length > 10 ? f.name.substring(0, 8) + '...' : f.name,
        fullName: f.name,
        description: 'Tài liệu bổ sung',
        date: new Date().toLocaleDateString('vi-VN')
      }));
      setDocuments(prev => [...prev, ...newDocs]);
    }
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const openSearchModal = (type) => {
    setModalState({ open: true, type, searchInput: '' });
  };

  const closeSearchModal = () => {
    setModalState({ open: false, type: '', searchInput: '' });
  };

  const handleSelectEntity = (id, name) => {
    hf('relatedEntity', id);
    hf('relatedEntityName', name);
    closeSearchModal();
  };

  return (
    <div className="af-page-container">
      <div className="af-inner-content">
        
        {/* HEADER BAR */}
        <div className="af-header-bar">
          <button type="button" className="af-btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>

          {/* STEPPER */}
          <div className="af-stepper-container">
            <div className="af-step-item" onClick={() => hf('status', 'todo')}>
              <div className={`af-step-circle ${formData.status === 'todo' ? 'active' : ''}`}>1</div>
              <span className={`af-step-label ${formData.status === 'todo' ? 'active' : ''}`}>Mới</span>
            </div>

            <div className="af-step-line" />

            <div className="af-step-item" onClick={() => hf('status', 'processing')}>
              <div className={`af-step-circle ${formData.status === 'processing' ? 'active' : ''}`}>2</div>
              <span className={`af-step-label ${formData.status === 'processing' ? 'active' : ''}`}>Đang thực hiện</span>
            </div>

            <div className="af-step-line" />

            <div className="af-step-item" onClick={() => hf('status', 'done')}>
              <div className={`af-step-circle ${formData.status === 'done' ? 'active' : ''}`}>3</div>
              <span className={`af-step-label ${formData.status === 'done' ? 'active' : ''}`}>Hoàn thành</span>
            </div>
          </div>

          <button type="button" className="af-btn-save" onClick={handleSave}>
            <Save size={16} />
            <span>Lưu</span>
          </button>
        </div>

        {/* TASK TITLE SECTION */}
        <div className="af-title-section">
          <div className="af-title-label">
            Tên Nhiệm Vụ<span className="required-star">*</span>
          </div>
          <div className="af-title-input-wrapper">
            <input 
              type="text" 
              className="af-title-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tên nhiệm vụ"
            />
            {formData.title && (
              <div className="af-title-clear-btn" onClick={() => hf('title', '')} title="Xóa">
                <X size={18} />
              </div>
            )}
          </div>
        </div>

        {/* 2-COLUMN MAIN LAYOUT */}
        <div className="af-main-grid">
          
          {/* LEFT COLUMN: 3 MAIN CARDS */}
          <div className="af-left-col">
            
            {/* 1. THÔNG TIN CHUNG */}
            <div>
              <h3 className="af-section-title">Thông tin chung</h3>
              <div className="af-card">
                
                {/* Row 1: Phân Loại & Độ Ưu Tiên */}
                <div className="af-form-grid-2">
                  <div className="af-field-row" style={{ marginBottom: 0 }}>
                    <label className="af-field-label">Phân Loại<span className="required-star">*</span></label>
                    <select 
                      className="af-control-select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn giá trị --</option>
                      <option value="email">Email</option>
                      <option value="call">Cuộc gọi</option>
                      <option value="meeting">Gặp mặt</option>
                      <option value="task">Công việc</option>
                    </select>
                  </div>

                  <div className="af-field-row" style={{ marginBottom: 0 }}>
                    <label className="af-field-label">Độ Ưu Tiên</label>
                    <select 
                      className="af-control-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">★ Thấp</option>
                      <option value="medium">★★ Trung bình</option>
                      <option value="high">★★★ Cao</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Liên Kết Tới */}
                <div className="af-field-row">
                  <label className="af-field-label">Liên Kết Tới<span className="required-star">*</span></label>
                  <div className="af-input-with-icon" style={{ maxWidth: '300px' }}>
                    <input 
                      type="text" 
                      className="af-control-input"
                      placeholder="Chọn cơ hội/KH"
                      value={formData.relatedEntityName || formData.relatedEntity || ''}
                      onChange={handleChange}
                      name="relatedEntityName"
                    />
                    <Search 
                      size={16} 
                      color="#64748b" 
                      style={{ cursor: 'pointer', flexShrink: 0 }} 
                      onClick={() => openSearchModal('entity')}
                    />
                  </div>
                </div>

                {/* Row 3: Tag */}
                <div className="af-field-row">
                  <label className="af-field-label">Tag</label>
                  <div style={{ maxWidth: '100%' }}>
                    <select 
                      className="af-control-select"
                      name="tag"
                      value={formData.tag}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn tag --</option>
                      <option value="vip">Khách hàng VIP</option>
                      <option value="hot">Tiềm năng cao</option>
                      <option value="followup">Cần chăm sóc ngay</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Tóm Tắt Hoạt Động */}
                <div className="af-field-row align-top">
                  <label className="af-field-label" style={{ marginTop: '8px' }}>
                    Tóm Tắt Hoạt<br />Động
                  </label>
                  <textarea 
                    className="af-control-textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Nhập tóm tắt hoạt động"
                  />
                </div>

              </div>
            </div>

            {/* 2. THỜI GIAN & PHÂN CÔNG */}
            <div>
              <h3 className="af-section-title">Thời gian & phân công</h3>
              <div className="af-card">
                
                {/* Row 1: Báo Cáo Bởi & Hạn Chót */}
                <div className="af-form-grid-2">
                  <div className="af-field-row" style={{ marginBottom: 0 }}>
                    <label className="af-field-label">Báo Cáo Bởi</label>
                    <select 
                      className="af-control-select"
                      name="reporter"
                      value={formData.reporter}
                      onChange={handleChange}
                    >
                      {EMPLOYEES.map(emp => (
                        <option key={emp} value={emp}>{emp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="af-field-row" style={{ marginBottom: 0 }}>
                    <label className="af-field-label">Hạn Chót</label>
                    <div className="af-input-with-icon">
                      <input 
                        type="date"
                        className="af-control-input"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-label: Giao Việc Cho */}
                <div className="af-sub-label">Giao Việc Cho</div>

                {/* Assignees Table */}
                <div className="af-assignment-box">
                  <table className="af-assignment-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '38%' }}>Người thực hiện</th>
                        <th>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.assignees.map((assignee, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'center', color: '#64748b' }}>
                            <Trash2 
                              size={16} 
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleRemoveAssignee(idx)}
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <select 
                                className="af-control-select"
                                value={assignee.name}
                                onChange={(e) => handleAssigneeChange(idx, 'name', e.target.value)}
                              >
                                <option value="">-- Chọn liên hệ --</option>
                                {EMPLOYEES.map(emp => (
                                  <option key={emp} value={emp}>{emp}</option>
                                ))}
                              </select>
                              <span className="required-star" style={{ fontSize: '16px' }}>*</span>
                            </div>
                          </td>
                          <td>
                            <input 
                              type="text" 
                              className="af-control-input"
                              placeholder="Mô tả công việc"
                              value={assignee.description}
                              onChange={(e) => handleAssigneeChange(idx, 'description', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="af-assignment-footer">
                    <button type="button" className="af-btn-add-row" onClick={handleAddAssignee}>
                      + Thêm giao việc
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. TÀI LIỆU ĐÍNH KÈM */}
            <div>
              <div className="af-section-header-row">
                <h3 className="af-section-title" style={{ margin: 0 }}>Tài liệu đính kèm</h3>
                <button 
                  type="button" 
                  className="af-btn-download-all"
                  onClick={() => alert('Đang chuẩn bị tải xuống toàn bộ tài liệu...')}
                >
                  <ArrowDownToLine size={15} />
                  <span>Download all</span>
                </button>
              </div>

              <div className="af-card">
                
                {/* Drag and Drop Zone */}
                <div 
                  className="af-upload-dropzone"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    multiple 
                    style={{ display: 'none' }} 
                  />
                  <div className="af-upload-text">Drag and drop or Browse your file</div>
                  <button type="button" className="af-upload-btn" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}>
                    <UploadCloud size={16} />
                    <span>Choose file</span>
                  </button>
                  <div className="af-upload-subtext">Type: xls, xlsx, pdf, doc. Max size: 20MB</div>
                </div>

                {/* Documents Table */}
                <div className="af-doc-table-box">
                  <table className="af-doc-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '60px' }}>No <span className="th-sort-icon">⇅ ▽</span></th>
                        <th style={{ width: '180px' }}>Tài liệu <span className="th-sort-icon">⇅ ▽</span></th>
                        <th>Nội dung tài liệu <span className="th-sort-icon">⇅ ▽</span></th>
                        <th style={{ width: '140px' }}>Thời điểm tải lên <span className="th-sort-icon">⇅ ▽</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, idx) => (
                        <tr key={doc.id}>
                          <td style={{ textAlign: 'center', color: '#64748b' }}>
                            <Trash2 
                              size={16} 
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDeleteDoc(doc.id)}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                          <td>
                            <a 
                              href="#download" 
                              className="af-doc-link" 
                              title={doc.fullName || doc.name}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Tải xuống tài liệu: ${doc.fullName || doc.name}`);
                              }}
                            >
                              {doc.name}
                            </a>
                          </td>
                          <td>{doc.description}</td>
                          <td>{doc.date}</td>
                        </tr>
                      ))}
                      {documents.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                            Chưa có tài liệu đính kèm nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COMMENT & HISTORY SIDEBAR */}
          <div className="af-right-col">
            
            {/* Sidebar Tabs */}
            <div className="af-sidebar-tabs">
              <div 
                className={`af-sidebar-tab ${activeSidebarTab === 'comment' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('comment')}
              >
                <MessageSquare size={14} />
                <span>COMMENT</span>
              </div>
              <div 
                className={`af-sidebar-tab ${activeSidebarTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('history')}
              >
                <Clock size={14} />
                <span>LỊCH SỬ</span>
              </div>
            </div>

            {/* TAB CONTENT: COMMENT */}
            {activeSidebarTab === 'comment' && (
              <>
                {/* Comments List */}
                <div className="af-comments-list">
                  {comments.map((cmt) => (
                    <div key={cmt.id} className="af-comment-item">
                      <div className="af-comment-avatar">
                        <img src={cmt.avatar} alt={cmt.author} />
                      </div>
                      <div className="af-comment-bubble">
                        <div className="af-comment-header">
                          <span className="af-comment-author">{cmt.author}</span>
                          <div className="af-comment-meta">
                            <span className="af-comment-time">{cmt.time}</span>
                            <div className="af-comment-more-btn">
                              <MoreVertical size={14} />
                            </div>
                          </div>
                        </div>
                        <div className="af-comment-text">{cmt.text}</div>
                        <div className="af-comment-reactions">
                          <span className="af-reaction-btn" title="Cảm xúc">
                            😀
                          </span>
                          <span 
                            className="af-reaction-btn" 
                            style={{ color: cmt.userLiked ? '#e11d48' : 'inherit' }}
                            onClick={() => toggleReaction(cmt.id, 'like')}
                          >
                            👍 {cmt.likes}
                          </span>
                          <span 
                            className="af-reaction-btn" 
                            style={{ color: cmt.userHearted ? '#e11d48' : 'inherit' }}
                            onClick={() => toggleReaction(cmt.id, 'heart')}
                          >
                            ❤️ {cmt.hearts}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input Box */}
                <div className="af-comment-input-row">
                  <div className="af-comment-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                      alt="Current User" 
                    />
                  </div>
                  <div className="af-comment-input-box">
                    <textarea 
                      className="af-comment-textarea"
                      placeholder="Viết comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment();
                        }
                      }}
                    />
                    <div className="af-comment-submit-row">
                      <button type="button" className="af-btn-send" onClick={handleSendComment}>
                        <Send size={14} />
                        <span>Gửi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeSidebarTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historyLogs.map(log => (
                  <div key={log.id} style={{ fontSize: '13px', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748b', fontSize: '11px' }}>
                      <strong style={{ color: '#0f172a' }}>{log.author}</strong>
                      <span>{log.time}</span>
                    </div>
                    <div style={{ color: '#334155' }}>{log.text}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* SEARCH MODAL */}
      {modalState.open && modalState.type === 'entity' && (
        <div className="modal-overlay" onClick={closeSearchModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90vw',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Liên kết Khách hàng / Cơ hội</div>
              <button 
                onClick={closeSearchModal}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>
            <div>
              <input 
                type="text" 
                autoFocus
                placeholder="Gõ tên khách hàng để tìm..." 
                className="af-control-input"
                style={{ width: '100%', marginBottom: '16px' }}
                value={modalState.searchInput}
                onChange={e => setModalState({...modalState, searchInput: e.target.value})}
              />
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Tên đối tác</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Mã số thuế</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Phân loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStore.getAllCustomers()
                      .filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase()))
                      .map(cli => (
                        <tr 
                          key={cli.id} 
                          onClick={() => handleSelectEntity(cli.id, cli.name)}
                          style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                        >
                          <td style={{ padding: '8px', fontWeight: 600, color: '#2563eb' }}>{cli.name}</td>
                          <td style={{ padding: '8px', color: '#64748b' }}>{cli.mst || '---'}</td>
                          <td style={{ padding: '8px', color: '#64748b' }}>{cli.type || 'Khách hàng'}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ActivityForm;
