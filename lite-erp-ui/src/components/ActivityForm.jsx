import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  X, 
  Search, 
  Trash2, 
  Calendar, 
  CloudUpload, 
  Download, 
  Send, 
  MoreVertical, 
  Smile, 
  ThumbsUp, 
  Heart,
  MessageSquare,
  Clock,
  Plus,
  FileText
} from 'lucide-react';
import './ActivityForm.css';
import { mockStore } from '../utils/mockStore';
import { loadPersonalTasks, savePersonalTasks, notifyTasksUpdated } from '../utils/taskSyncStore';

const EMPLOYEES = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị Lan', 'Admin'];

export default function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Stepper state: 1 = Mới, 2 = Đang thực hiện, 3 = Hoàn thành
  const [currentStep, setCurrentStep] = useState(1);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: '', // Phân loại
    priority: 'low', // Độ ưu tiên: low, medium, high
    relatedTo: '', // Liên kết tới
    relatedToName: '',
    tag: '',
    summary: '', // Tóm tắt hoạt động
    reporter: 'Nguyễn Văn A',
    dueDate: '2026-05-08',
    assignees: [
      { id: 1, person: '', description: '' }
    ]
  });

  // Modal selector for "Liên Kết Tới"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Attached documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Hopdo...',
      fullName: 'Hopdong_kinhdoanh_v1.pdf',
      description: 'Báo giá sơ bộ gửi KH',
      uploadDate: '17/04/2026',
      size: '2.4 MB'
    }
  ]);

  // Right sidebar tab: 'comment' | 'history'
  const [activeTab, setActiveTab] = useState('comment');

  // Comments feed
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '2h trước',
      content: 'Cần cập nhật thông tin báo giá cho khách hàng.',
      reactions: { smile: 0, like: 45, heart: 25 },
      userReacted: {}
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      time: '5h trước',
      content: 'Đã liên hệ với khách hàng, họ đang xem xét để đề xuất.',
      reactions: { smile: 0, like: 45, heart: 25 },
      userReacted: {}
    }
  ]);

  // Comment input
  const [newComment, setNewComment] = useState('');

  // Audit history
  const [historyLogs, setHistoryLogs] = useState([
    { id: 1, author: 'Hệ thống', time: '17/04/2026 09:15', action: 'Khởi tạo nhiệm vụ mới' },
    { id: 2, author: 'Nguyễn Văn A', time: '17/04/2026 09:30', action: 'Đính kèm tài liệu Hopdong_kinhdoanh_v1.pdf' }
  ]);

  // Load existing task if editing
  useEffect(() => {
    if (id && id !== 'new') {
      const allTasks = loadPersonalTasks();
      const found = allTasks.find(t => String(t.id) === String(id));
      if (found) {
        setFormData({
          title: found.title || '',
          category: found.activityType || 'task',
          priority: found.priority || 'low',
          relatedTo: found.dealCode || found.partnerTax || '',
          relatedToName: found.partnerName || found.dealCode || '',
          tag: found.tag || '',
          summary: found.description || found.notes || '',
          reporter: found.reporter || 'Nguyễn Văn A',
          dueDate: found.dueDate ? (found.dueDate.includes('/') ? found.dueDate.split('/').reverse().join('-') : found.dueDate) : '2026-05-08',
          assignees: [
            { id: 1, person: found.assignee || '', description: found.taskDescription || '' }
          ]
        });

        if (found.status === 'processing') setCurrentStep(2);
        else if (found.status === 'done') setCurrentStep(3);
        else setCurrentStep(1);
      }
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearTitle = () => {
    setFormData(prev => ({ ...prev, title: '' }));
  };

  // Assignee table actions
  const handleAddAssignee = () => {
    setFormData(prev => ({
      ...prev,
      assignees: [
        ...prev.assignees,
        { id: Date.now(), person: '', description: '' }
      ]
    }));
  };

  const handleUpdateAssignee = (idx, key, value) => {
    setFormData(prev => {
      const updated = [...prev.assignees];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, assignees: updated };
    });
  };

  const handleRemoveAssignee = (idx) => {
    if (formData.assignees.length <= 1) {
      // Clear instead of removing last row
      setFormData(prev => ({
        ...prev,
        assignees: [{ id: Date.now(), person: '', description: '' }]
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter((_, i) => i !== idx)
    }));
  };

  // Upload file handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const newDocs = files.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name.length > 10 ? file.name.slice(0, 6) + '...' : file.name,
      fullName: file.name,
      description: 'Tài liệu bổ sung',
      uploadDate: todayStr,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    }));

    setDocuments(prev => [...prev, ...newDocs]);
    setHistoryLogs(prev => [
      { id: Date.now(), author: formData.reporter || 'Bạn', time: 'Vừa xong', action: `Tải lên tài liệu: ${files[0].name}` },
      ...prev
    ]);
  };

  const handleRemoveDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleDownloadAll = () => {
    alert(`Đang chuẩn bị nén và tải xuống ${documents.length} tài liệu...`);
  };

  // Comments handler
  const handleSendComment = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: 'Bạn (Người dùng)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Vừa xong',
      content: newComment.trim(),
      reactions: { smile: 0, like: 0, heart: 0 },
      userReacted: {}
    };

    setComments(prev => [commentObj, ...prev]);
    setNewComment('');
  };

  const handleReaction = (commentId, type) => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const alreadyReacted = c.userReacted?.[type];
      const count = c.reactions[type] || 0;
      return {
        ...c,
        reactions: {
          ...c.reactions,
          [type]: alreadyReacted ? Math.max(0, count - 1) : count + 1
        },
        userReacted: {
          ...c.userReacted,
          [type]: !alreadyReacted
        }
      };
    }));
  };

  // Select customer / opportunity modal
  const handleSelectRelatedEntity = (entity) => {
    setFormData(prev => ({
      ...prev,
      relatedTo: entity.id,
      relatedToName: `${entity.name} (${entity.shortName || entity.mst || entity.id})`
    }));
    setIsModalOpen(false);
  };

  // Save task
  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập Tên Nhiệm Vụ!');
      return;
    }

    let statusStr = 'todo';
    if (currentStep === 2) statusStr = 'processing';
    if (currentStep === 3) statusStr = 'done';

    const currentTasks = loadPersonalTasks();
    const primaryAssignee = formData.assignees[0]?.person || formData.reporter || 'Chưa phân công';

    if (id && id !== 'new') {
      // Update existing
      const updated = currentTasks.map(t => {
        if (String(t.id) === String(id)) {
          return {
            ...t,
            title: formData.title,
            activityType: formData.category || t.activityType,
            priority: formData.priority,
            status: statusStr,
            partnerName: formData.relatedToName || t.partnerName,
            reporter: formData.reporter,
            assignee: primaryAssignee,
            dueDate: formData.dueDate,
            description: formData.summary
          };
        }
        return t;
      });
      savePersonalTasks(updated);
    } else {
      // Create new
      const newId = Date.now();
      const newTask = {
        id: newId,
        title: formData.title,
        activityType: formData.category || 'task',
        priority: formData.priority,
        status: statusStr,
        partnerName: formData.relatedToName || 'Khách hàng liên kết',
        partnerTax: formData.relatedTo || '',
        reporter: formData.reporter,
        assignee: primaryAssignee,
        dueDate: formData.dueDate,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        description: formData.summary,
        isDaily: false
      };
      savePersonalTasks([newTask, ...currentTasks]);
    }

    notifyTasksUpdated();
    alert('Đã lưu nhiệm vụ thành công!');
    navigate('/activities');
  };

  // Customers for lookup modal
  const allCustomers = mockStore.getAllCustomers();
  const filteredCustomers = allCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.shortName && c.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.mst && c.mst.includes(searchQuery))
  );

  return (
    <div className="task-detail-page">
      {/* TOP BAR WITH BACK, STEPPER & SAVE */}
      <div className="task-top-bar">
        <button 
          type="button" 
          className="task-btn-back"
          onClick={() => navigate('/activities')}
        >
          <ChevronLeft size={18} />
          <span>Quay lại</span>
        </button>

        {/* STEPPER */}
        <div className="task-stepper-container">
          <div 
            className={`task-stepper-step ${currentStep === 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-badge">1</div>
            <span className="step-text">Mới</span>
          </div>

          <div className={`step-connector ${currentStep >= 2 ? 'connector-active' : ''}`} />

          <div 
            className={`task-stepper-step ${currentStep === 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-completed' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <div className="step-badge">2</div>
            <span className="step-text">Đang thực hiện</span>
          </div>

          <div className={`step-connector ${currentStep >= 3 ? 'connector-active' : ''}`} />

          <div 
            className={`task-stepper-step ${currentStep === 3 ? 'step-active' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <div className="step-badge">3</div>
            <span className="step-text">Hoàn thành</span>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button type="button" className="task-btn-save" onClick={handleSave}>
          <Save size={16} />
          <span>Lưu</span>
        </button>
      </div>

      {/* TASK TITLE SECTION */}
      <div className="task-title-banner">
        <label className="task-title-label">
          Tên Nhiệm Vụ<span className="label-asterisk">*</span>
        </label>
        <div className="task-title-input-box">
          <input
            type="text"
            className="task-title-input"
            placeholder="Nhập tên nhiệm vụ"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            autoFocus
          />
          {formData.title && (
            <button 
              type="button" 
              className="task-title-clear" 
              onClick={handleClearTitle}
              title="Xóa tiêu đề"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT */}
      <div className="task-main-layout">
        {/* LEFT COLUMN: FORM SECTIONS */}
        <div className="task-left-card">
          {/* 1. THÔNG TIN CHUNG */}
          <div className="task-section">
            <h3 className="task-section-heading">Thông tin chung</h3>

            {/* Row 1: Phân Loại & Độ Ưu Tiên */}
            <div className="task-form-row two-cols">
              <div className="task-form-field">
                <label className="task-field-label">
                  Phân Loại<span className="label-asterisk">*</span>
                </label>
                <div className="task-select-wrapper">
                  <select
                    className="task-select"
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                  >
                    <option value="">-- Chọn giá trị --</option>
                    <option value="call">Cuộc gọi</option>
                    <option value="email">Email</option>
                    <option value="meeting">Cuộc họp</option>
                    <option value="task">Công việc</option>
                    <option value="demo">Demo / Giới thiệu</option>
                  </select>
                </div>
              </div>

              <div className="task-form-field">
                <label className="task-field-label">Độ Ưu Tiên</label>
                <div className="task-select-wrapper">
                  <select
                    className="task-select"
                    value={formData.priority}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                  >
                    <option value="low">★ Thấp</option>
                    <option value="normal">★★ Trung bình</option>
                    <option value="high">★★★ Cao</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Liên Kết Tới */}
            <div className="task-form-row">
              <div className="task-form-field full-width">
                <label className="task-field-label">
                  Liên Kết Tới<span className="label-asterisk">*</span>
                </label>
                <div className="task-input-with-action">
                  <input
                    type="text"
                    className="task-text-input"
                    placeholder="Chọn cơ hội/KH"
                    value={formData.relatedToName}
                    readOnly
                    onClick={() => setIsModalOpen(true)}
                  />
                  <button 
                    type="button" 
                    className="task-search-icon-btn"
                    onClick={() => setIsModalOpen(true)}
                    title="Tìm cơ hội hoặc khách hàng"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Tag */}
            <div className="task-form-row">
              <div className="task-form-field full-width">
                <label className="task-field-label">Tag</label>
                <div className="task-select-wrapper">
                  <select
                    className="task-select"
                    value={formData.tag}
                    onChange={(e) => handleFieldChange('tag', e.target.value)}
                  >
                    <option value="">-- Chọn tag --</option>
                    <option value="VIP">VIP</option>
                    <option value="Tiềm năng">Tiềm năng</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                    <option value="Chăm sóc lại">Chăm sóc lại</option>
                    <option value="Báo giá">Báo giá</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: Tóm Tắt Hoạt Động */}
            <div className="task-form-row">
              <div className="task-form-field full-width">
                <label className="task-field-label">Tóm Tắt Hoạt Động</label>
                <textarea
                  className="task-textarea"
                  rows={3}
                  placeholder="Nhập tóm tắt hoạt động"
                  value={formData.summary}
                  onChange={(e) => handleFieldChange('summary', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DOTTED SEPARATOR */}
          <div className="task-dotted-divider" />

          {/* 2. THỜI GIAN & PHÂN CÔNG */}
          <div className="task-section">
            <h3 className="task-section-heading">Thời gian & phân công</h3>

            {/* Row 1: Báo Cáo Bởi & Hạn Chót */}
            <div className="task-form-row two-cols">
              <div className="task-form-field">
                <label className="task-field-label">Báo Cáo Bởi</label>
                <div className="task-select-wrapper">
                  <select
                    className="task-select"
                    value={formData.reporter}
                    onChange={(e) => handleFieldChange('reporter', e.target.value)}
                  >
                    {EMPLOYEES.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="task-form-field">
                <label className="task-field-label">Hạn Chót</label>
                <div className="task-input-with-action">
                  <input
                    type="date"
                    className="task-text-input"
                    value={formData.dueDate}
                    onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                  />
                  <span className="task-calendar-icon">
                    <Calendar size={16} />
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Giao Việc Cho Sub-table */}
            <div className="task-form-row">
              <div className="task-form-field full-width">
                <label className="task-field-label">Giao Việc Cho</label>
                <div className="assignee-table-box">
                  <table className="assignee-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '45%' }}>Người thực hiện</th>
                        <th>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.assignees.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td className="cell-delete">
                            <button
                              type="button"
                              className="btn-trash-row"
                              onClick={() => handleRemoveAssignee(idx)}
                              title="Xóa dòng"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                          <td>
                            <select
                              className="assignee-cell-select"
                              value={row.person}
                              onChange={(e) => handleUpdateAssignee(idx, 'person', e.target.value)}
                            >
                              <option value="">-- Chọn liên hệ -- *</option>
                              {EMPLOYEES.map(emp => (
                                <option key={emp} value={emp}>{emp}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="assignee-cell-input"
                              placeholder="Mô tả công việc"
                              value={row.description}
                              onChange={(e) => handleUpdateAssignee(idx, 'description', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="assignee-add-row-bar">
                    <button
                      type="button"
                      className="btn-add-assignee"
                      onClick={handleAddAssignee}
                    >
                      + Thêm giao việc
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DOTTED SEPARATOR */}
          <div className="task-dotted-divider" />

          {/* 3. TÀI LIỆU ĐÍNH KÈM */}
          <div className="task-section">
            <div className="task-section-header-flex">
              <h3 className="task-section-heading">Tài liệu đính kèm</h3>
              <button 
                type="button" 
                className="btn-download-all"
                onClick={handleDownloadAll}
              >
                <Download size={14} />
                <span>Download all</span>
              </button>
            </div>

            {/* Upload Dropzone */}
            <div 
              className="task-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={handleFileUpload}
              />
              <p className="upload-zone-main-text">Drag and drop or Browse your file</p>
              <button 
                type="button" 
                className="btn-choose-file"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <CloudUpload size={15} />
                <span>Choose file</span>
              </button>
              <p className="upload-zone-sub-text">Type: xls, xlsx, pdf, doc. Max size: 20MB</p>
            </div>

            {/* Documents Table */}
            <div className="task-doc-table-box">
              <table className="task-doc-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th style={{ width: '60px' }}>
                      <span className="th-sortable">No <span>⇅ ⧩</span></span>
                    </th>
                    <th style={{ width: '25%' }}>
                      <span className="th-sortable">Tài liệu <span>⇅ ⧩</span></span>
                    </th>
                    <th>
                      <span className="th-sortable">Nội dung tài liệu <span>⇅ ⧩</span></span>
                    </th>
                    <th style={{ width: '22%' }}>
                      <span className="th-sortable">Thời điểm tải lên <span>⇅ ⧩</span></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={doc.id}>
                      <td className="cell-delete">
                        <button
                          type="button"
                          className="btn-trash-row"
                          onClick={() => handleRemoveDocument(doc.id)}
                          title="Xóa file"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                      <td style={{ color: '#475569', fontWeight: 500 }}>{idx + 1}</td>
                      <td>
                        <a 
                          href="#download" 
                          className="doc-file-link"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Mở tài liệu: ${doc.fullName || doc.name}`);
                          }}
                          title={doc.fullName}
                        >
                          {doc.name}
                        </a>
                      </td>
                      <td style={{ color: '#334155' }}>{doc.description}</td>
                      <td style={{ color: '#64748b' }}>{doc.uploadDate}</td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                        Chưa có tài liệu nào đính kèm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHATTER & AUDIT TRAIL */}
        <div className="task-right-card">
          {/* Tabs: COMMENT & LỊCH SỬ */}
          <div className="task-tabs-header">
            <button
              type="button"
              className={`task-tab-btn ${activeTab === 'comment' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('comment')}
            >
              <MessageSquare size={15} />
              <span>COMMENT</span>
            </button>
            <button
              type="button"
              className={`task-tab-btn ${activeTab === 'history' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={15} />
              <span>LỊCH SỬ</span>
            </button>
          </div>

          {activeTab === 'comment' ? (
            <div className="task-chatter-pane">
              {/* Comment Feed */}
              <div className="task-comments-list">
                {comments.map((comm) => (
                  <div key={comm.id} className="comment-item">
                    <div className="comment-avatar">
                      <img src={comm.avatar} alt={comm.author} />
                    </div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{comm.author}</span>
                        <span className="comment-time">{comm.time}</span>
                        <button type="button" className="comment-more-btn">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      <div className="comment-text">
                        {comm.content}
                      </div>
                      {/* Reactions */}
                      <div className="comment-reactions-bar">
                        <button 
                          type="button" 
                          className="reaction-btn" 
                          onClick={() => handleReaction(comm.id, 'smile')}
                          title="Cười"
                        >
                          <Smile size={14} />
                        </button>
                        <button 
                          type="button" 
                          className={`reaction-btn ${comm.userReacted?.like ? 'reacted' : ''}`}
                          onClick={() => handleReaction(comm.id, 'like')}
                          title="Thích"
                        >
                          <ThumbsUp size={14} />
                          <span>{comm.reactions.like}</span>
                        </button>
                        <button 
                          type="button" 
                          className={`reaction-btn ${comm.userReacted?.heart ? 'reacted' : ''}`}
                          onClick={() => handleReaction(comm.id, 'heart')}
                          title="Tim"
                        >
                          <Heart size={14} />
                          <span>{comm.reactions.heart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compose Box */}
              <div className="task-comment-composer">
                <div className="composer-row">
                  <div className="composer-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                      alt="User avatar" 
                    />
                  </div>
                  <div className="composer-input-area">
                    <textarea
                      className="composer-textarea"
                      rows={3}
                      placeholder="Viết comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="composer-action-row">
                      <button 
                        type="button" 
                        className="btn-send-comment"
                        onClick={handleSendComment}
                      >
                        <Send size={13} />
                        <span>Gửi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="task-history-pane">
              <div className="history-timeline">
                {historyLogs.map((log) => (
                  <div key={log.id} className="history-item">
                    <div className="history-bullet" />
                    <div className="history-content">
                      <div className="history-top">
                        <span className="history-author">{log.author}</span>
                        <span className="history-time">{log.time}</span>
                      </div>
                      <div className="history-action">{log.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL SEARCH LIÊN KẾT KHÁCH HÀNG / CƠ HỘI */}
      {isModalOpen && (
        <div className="entity-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="entity-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="entity-modal-header">
              <h4 className="entity-modal-title">Chọn Khách hàng / Cơ hội liên kết</h4>
              <button 
                type="button" 
                className="entity-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="entity-modal-search-bar">
              <Search size={16} className="modal-search-icon" />
              <input
                type="text"
                className="modal-search-input"
                placeholder="Tìm theo tên khách hàng, tên viết tắt hoặc MST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="entity-modal-list">
              <table className="entity-lookup-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên đối tác</th>
                    <th>MST</th>
                    <th>Phân loại</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust) => (
                    <tr 
                      key={cust.id} 
                      onClick={() => handleSelectRelatedEntity(cust)}
                      className="entity-lookup-row"
                    >
                      <td style={{ fontWeight: 600, color: '#e32b4c' }}>{cust.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{cust.name}</div>
                        {cust.shortName && <div style={{ fontSize: '12px', color: '#64748b' }}>{cust.shortName}</div>}
                      </td>
                      <td style={{ color: '#475569' }}>{cust.mst || '-'}</td>
                      <td>
                        <span className="entity-type-badge">
                          {cust.classification || cust.type || 'Khách hàng'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        Không tìm thấy đối tác phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="entity-modal-footer">
              <button 
                type="button" 
                className="btn-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
