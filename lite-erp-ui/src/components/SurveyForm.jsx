import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Copy,
  Check,
  Star,
  HelpCircle,
  Send,
  Calendar,
  Clock,
  Settings,
  Users,
  Link2,
  Share2,
  Layers,
  AlertCircle,
  FileText,
  CheckCircle2,
  X,
  Sparkles,
  Smartphone,
  Globe,
  Mail,
  MessageSquare
} from 'lucide-react';
import './SurveyForm.css';

// Initial contracts for select
const CONTRACT_OPTIONS = [
  { code: 'HĐ-2026/VT-FO01', name: 'Hợp đồng Vận hành FO Viettel' },
  { code: 'HĐ-2026/MB-BH02', name: 'Hợp đồng Dịch vụ Bán hàng MB' },
  { code: 'HĐ-2026/VNM-FO03', name: 'Hợp đồng Vận hành FO Vinamilk' },
  { code: 'HĐ-2026/BIDV-FO04', name: 'Hợp đồng FO BIDV Cloud' },
  { code: 'HĐ-2026/VTB-BH05', name: 'Hợp đồng Hội thảo Giải pháp' },
  { code: 'HĐ-2026/FPT-IT06', name: 'Hợp đồng Dịch vụ IT Outsourcing FPT' }
];

const SURVEY_TYPES = ['Định kỳ', 'Thường', 'Đột xuất', 'Sau bán hàng', 'Sự kiện'];

const INITIAL_QUESTIONS = [
  {
    id: 'q_1',
    title: 'Đánh giá mức độ hài lòng chung của Quý khách về chất lượng dịch vụ?',
    type: 'rating_star',
    required: true,
    options: []
  },
  {
    id: 'q_2',
    title: 'Khả năng Quý khách giới thiệu dịch vụ này cho đối tác hoặc đồng nghiệp (NPS)?',
    type: 'nps_score',
    required: true,
    options: []
  },
  {
    id: 'q_3',
    title: 'Thời gian xử lý yêu cầu và hỗ trợ kỹ thuật có đáp ứng kỳ vọng không?',
    type: 'single_choice',
    required: true,
    options: ['Vượt kỳ vọng', 'Đạt yêu cầu', 'Chậm trễ cần cải thiện', 'Rất chậm']
  },
  {
    id: 'q_4',
    title: 'Quý khách mong muốn cải thiện điểm nào trong các đợt vận hành tiếp theo?',
    type: 'multiple_choice',
    required: false,
    options: [
      'Tốc độ phản hồi sự cố',
      'Thái độ chuyên nghiệp của chuyên viên',
      'Báo cáo định kỳ minh bạch hơn',
      'Tối ưu chi phí và gói cước'
    ]
  },
  {
    id: 'q_5',
    title: 'Góp ý hoặc đề xuất khác của Quý khách (nếu có):',
    type: 'text',
    required: false,
    options: []
  }
];

export default function SurveyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Active step in stepper (1: General, 2: Questions, 3: Audience/Channels, 4: Schedule/Settings)
  const [activeStep, setActiveStep] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/VT-FO01',
    contractName: 'Hợp đồng Vận hành FO Viettel',
    description: '',
    status: 'active',
    statusLabel: 'Đang hoạt động',
    target: 200,
    completed: 0,
    completionRate: 0,
    createdDate: new Date().toLocaleDateString('vi-VN'),
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    channels: ['Email', 'DirectLink', 'Portal'],
    sendSchedule: 'immediate',
    sendReminder: true,
    reminderDays: 3,
    allowAnonymous: false,
    questions: INITIAL_QUESTIONS
  });

  // Load survey data if in edit mode
  useEffect(() => {
    if (isEdit) {
      try {
        const savedSurveys = JSON.parse(localStorage.getItem('lite_erp_surveys') || '[]');
        const found = savedSurveys.find(s => s.id === id);
        if (found) {
          setFormData(prev => ({
            ...prev,
            ...found,
            questions: found.questions && found.questions.length > 0 ? found.questions : INITIAL_QUESTIONS
          }));
        } else {
          // Default mock data for edit if not in localStorage
          setFormData(prev => ({
            ...prev,
            id: id,
            title: `Khảo sát dịch vụ ${id}`,
            description: 'Đánh giá chất lượng dịch vụ vận hành và hỗ trợ khách hàng'
          }));
        }
      } catch (e) {
        console.error('Error loading survey:', e);
      }
    } else {
      const generatedId = `SRV-${String(Math.floor(Math.random() * 900) + 100)}`;
      setFormData(prev => ({ ...prev, id: generatedId }));
    }
  }, [id, isEdit]);

  // Handle contract select change
  const handleContractChange = (e) => {
    const selectedCode = e.target.value;
    const contract = CONTRACT_OPTIONS.find(c => c.code === selectedCode);
    setFormData(prev => ({
      ...prev,
      contractCode: selectedCode,
      contractName: contract ? contract.name : ''
    }));
  };

  // Toggle channel
  const toggleChannel = (channel) => {
    setFormData(prev => {
      const current = prev.channels || [];
      const updated = current.includes(channel)
        ? current.filter(c => c !== channel)
        : [...current, channel];
      return { ...prev, channels: updated };
    });
  };

  // Question manipulation
  const addQuestion = (type = 'rating_star') => {
    const newQ = {
      id: `q_${Date.now()}`,
      title: 'Nhập nội dung câu hỏi mới...',
      type: type,
      required: true,
      options: ['Lựa chọn 1', 'Lựa chọn 2', 'Lựa chọn 3']
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQ]
    }));
  };

  const updateQuestion = (qId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => (q.id === qId ? { ...q, [field]: value } : q))
    }));
  };

  const removeQuestion = (qId) => {
    if (formData.questions.length <= 1) {
      alert('Khảo sát cần có ít nhất một câu hỏi.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== qId)
    }));
  };

  const addOptionToQuestion = (qId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === qId) {
          const nextIndex = (q.options || []).length + 1;
          return { ...q, options: [...(q.options || []), `Lựa chọn ${nextIndex}`] };
        }
        return q;
      })
    }));
  };

  const updateOptionText = (qId, optIdx, text) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === qId) {
          const newOpts = [...(q.options || [])];
          newOpts[optIdx] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    }));
  };

  const removeOption = (qId, optIdx) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === qId) {
          return { ...q, options: (q.options || []).filter((_, i) => i !== optIdx) };
        }
        return q;
      })
    }));
  };

  // Save to localStorage & navigate back
  const handleSave = (statusToSet = 'active') => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề khảo sát.');
      setActiveStep(1);
      return;
    }

    const payload = {
      ...formData,
      status: statusToSet,
      statusLabel: statusToSet === 'active' ? 'Đang hoạt động' : 'Bản nháp',
      questionsCount: formData.questions.length,
      creator: { name: 'Lyn', initial: 'L', color: '#7c3aed', bg: '#f3e8ff' }
    };

    try {
      const existing = JSON.parse(localStorage.getItem('lite_erp_surveys') || '[]');
      let updated;
      if (isEdit) {
        updated = existing.map(s => (s.id === formData.id ? payload : s));
      } else {
        updated = [payload, ...existing];
      }
      localStorage.setItem('lite_erp_surveys', JSON.stringify(updated));
    } catch (e) {
      console.error('Save error:', e);
    }

    navigate('/surveys');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/survey/view/${formData.id || 'SRV-001'}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="survey-form-page">
      <div className="survey-form-container">
        
        {/* 1. TOP BAR */}
        <div className="survey-top-bar">
          <div className="survey-top-bar-left">
            <button className="survey-btn-back" onClick={() => navigate('/surveys')}>
              <ChevronLeft size={18} /> Quay lại danh sách
            </button>
            <div className="survey-title-group">
              <h1>{isEdit ? 'Chỉnh sửa khảo sát khách hàng' : 'Tạo khảo sát mới'}</h1>
              <p>{isEdit ? `Cập nhật thông tin mã ${formData.id}` : 'Thiết lập nội dung và cấu hình gửi khảo sát'}</p>
            </div>
          </div>

          <div className="survey-top-actions">
            <button
              type="button"
              className="survey-btn survey-btn-preview"
              onClick={() => setShowPreviewModal(true)}
            >
              <Eye size={16} /> Xem trước
            </button>
            <button
              type="button"
              className="survey-btn survey-btn-secondary"
              onClick={() => handleSave('draft')}
            >
              <FileText size={16} /> Lưu bản nháp
            </button>
            <button
              type="button"
              className="survey-btn survey-btn-primary"
              onClick={() => handleSave('active')}
            >
              <Save size={16} /> {isEdit ? 'Cập nhật khảo sát' : 'Lưu & Kích hoạt'}
            </button>
          </div>
        </div>

        {/* 2. STEPPER */}
        <div className="survey-stepper-wrapper">
          <div className="survey-stepper">
            <div
              className={`survey-step ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              <div className="survey-step-badge">{activeStep > 1 ? <Check size={16} /> : '1'}</div>
              <div className="survey-step-info">
                <span className="survey-step-title">Thông tin chung</span>
                <span className="survey-step-desc">Tiêu đề, loại & hợp đồng</span>
              </div>
            </div>

            <div className={`survey-step-divider ${activeStep > 1 ? 'filled' : ''}`} />

            <div
              className={`survey-step ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}
              onClick={() => setActiveStep(2)}
            >
              <div className="survey-step-badge">{activeStep > 2 ? <Check size={16} /> : '2'}</div>
              <div className="survey-step-info">
                <span className="survey-step-title">Bộ câu hỏi</span>
                <span className="survey-step-desc">{formData.questions.length} câu hỏi thiết kế</span>
              </div>
            </div>

            <div className={`survey-step-divider ${activeStep > 2 ? 'filled' : ''}`} />

            <div
              className={`survey-step ${activeStep === 3 ? 'active' : ''} ${activeStep > 3 ? 'completed' : ''}`}
              onClick={() => setActiveStep(3)}
            >
              <div className="survey-step-badge">{activeStep > 3 ? <Check size={16} /> : '3'}</div>
              <div className="survey-step-info">
                <span className="survey-step-title">Đối tượng & Kênh gửi</span>
                <span className="survey-step-desc">Email, SMS, Portal, Link</span>
              </div>
            </div>

            <div className={`survey-step-divider ${activeStep > 3 ? 'filled' : ''}`} />

            <div
              className={`survey-step ${activeStep === 4 ? 'active' : ''}`}
              onClick={() => setActiveStep(4)}
            >
              <div className="survey-step-badge">4</div>
              <div className="survey-step-info">
                <span className="survey-step-title">Cài đặt & Lịch trình</span>
                <span className="survey-step-desc">Thời gian & Tự động hóa</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MAIN FORM BODY */}
        <div className="survey-form-grid">
          
          {/* LEFT MAIN CONTENT */}
          <div className="survey-main-column">

            {/* TAB 1: THÔNG TIN CHUNG */}
            {activeStep === 1 && (
              <div className="survey-card">
                <div className="survey-card-header">
                  <div className="survey-card-header-left">
                    <div className="survey-card-icon-box">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="survey-card-title">Thông tin cơ bản khảo sát</h3>
                      <p className="survey-card-desc">Thiết lập thông tin định danh và hợp đồng liên quan</p>
                    </div>
                  </div>
                </div>

                <div className="survey-card-body">
                  <div className="form-row single-col">
                    <div className="form-group">
                      <label className="form-label">
                        Tiêu đề khảo sát <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ví dụ: Khảo sát chất lượng dịch vụ vận hành FO tháng 9/2026"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Loại khảo sát</label>
                      <select
                        className="form-select"
                        value={formData.surveyType}
                        onChange={e => setFormData({ ...formData, surveyType: e.target.value })}
                      >
                        {SURVEY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hợp đồng liên kết</label>
                      <select
                        className="form-select"
                        value={formData.contractCode}
                        onChange={handleContractChange}
                      >
                        {CONTRACT_OPTIONS.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row single-col">
                    <div className="form-group">
                      <label className="form-label">Mục đích & Mô tả khảo sát</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Mô tả ngắn gọn mục đích thu thập ý kiến khách hàng và cam kết bảo mật..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                      <span className="form-hint">Mô tả này sẽ hiển thị ở phần mở đầu bảng khảo sát khách hàng nhận được.</span>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mục tiêu số phản hồi (Target)</label>
                      <input
                        type="number"
                        className="form-input"
                        min="10"
                        value={formData.target}
                        onChange={e => setFormData({ ...formData, target: Number(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Người khởi tạo / Phụ trách</label>
                      <input
                        type="text"
                        className="form-input"
                        value="Lyn (daothiphuonglinh197@gmail.com)"
                        disabled
                        style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                      type="button"
                      className="survey-btn survey-btn-primary"
                      onClick={() => setActiveStep(2)}
                    >
                      Tiếp tục: Thiết kế câu hỏi &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THIẾT KẾ CÂU HỎI */}
            {activeStep === 2 && (
              <div className="question-builder-container">
                <div className="survey-card">
                  <div className="survey-card-header">
                    <div className="survey-card-header-left">
                      <div className="survey-card-icon-box">
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <h3 className="survey-card-title">Danh sách câu hỏi khảo sát</h3>
                        <p className="survey-card-desc">Tùy biến câu hỏi, định dạng thang điểm, sao đánh giá hoặc trắc nghiệm</p>
                      </div>
                    </div>
                  </div>

                  <div className="survey-card-body">
                    <div className="question-list">
                      {formData.questions.map((q, idx) => (
                        <div key={q.id} className="question-card">
                          <div className="question-card-header">
                            <div className="question-card-left">
                              <span className="question-number-badge">{idx + 1}</span>
                              <select
                                className="question-type-select-mini"
                                value={q.type}
                                onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                              >
                                <option value="rating_star">⭐ Đánh giá sao (1 - 5 Sao)</option>
                                <option value="nps_score">📊 Thang điểm NPS (1 - 10)</option>
                                <option value="single_choice">🔘 Trắc nghiệm 1 lựa chọn</option>
                                <option value="multiple_choice">☑️ Trắc nghiệm nhiều lựa chọn</option>
                                <option value="text">✍️ Ý kiến văn bản tự do</option>
                              </select>
                            </div>

                            <div className="question-card-actions">
                              <button
                                type="button"
                                className="question-action-btn btn-delete"
                                title="Xóa câu hỏi"
                                onClick={() => removeQuestion(q.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <input
                            type="text"
                            className="question-input-title"
                            value={q.title}
                            placeholder="Nhập tiêu đề câu hỏi..."
                            onChange={e => updateQuestion(q.id, 'title', e.target.value)}
                          />

                          {/* Visualizer for Star Rating */}
                          {q.type === 'rating_star' && (
                            <div className="rating-preview-box">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={24} className="star-icon-gold" />
                              ))}
                              <span style={{ fontSize: '12.5px', color: '#64748b', marginLeft: '8px' }}>
                                (Thang đánh giá 5 mức từ 1 sao đến 5 sao)
                              </span>
                            </div>
                          )}

                          {/* Visualizer for NPS Scale */}
                          {q.type === 'nps_score' && (
                            <div>
                              <div className="nps-scale-preview">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                  <div
                                    key={n}
                                    className={`nps-box ${n <= 6 ? 'detractor' : n <= 8 ? 'passive' : 'promoter'}`}
                                  >
                                    {n}
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                                <span>1 - Hoàn toàn không giới thiệu</span>
                                <span>10 - Chắc chắn giới thiệu</span>
                              </div>
                            </div>
                          )}

                          {/* Options for Choice questions */}
                          {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                            <div className="question-options-wrapper">
                              {(q.options || []).map((opt, optIdx) => (
                                <div key={optIdx} className="question-option-row">
                                  <div className={`option-indicator ${q.type === 'multiple_choice' ? 'square' : ''}`} />
                                  <input
                                    type="text"
                                    className="option-input-text"
                                    value={opt}
                                    onChange={e => updateOptionText(q.id, optIdx, e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    className="btn-remove-option"
                                    onClick={() => removeOption(q.id, optIdx)}
                                    title="Xóa lựa chọn"
                                  >
                                    <X size={15} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn-add-option"
                                onClick={() => addOptionToQuestion(q.id)}
                              >
                                <Plus size={15} /> Thêm tùy chọn
                              </button>
                            </div>
                          )}

                          {/* Visualizer for Text question */}
                          {q.type === 'text' && (
                            <textarea
                              className="form-textarea"
                              disabled
                              placeholder="Khách hàng sẽ nhập phản hồi chi tiết tại đây..."
                              rows={2}
                              style={{ backgroundColor: '#f8fafc' }}
                            />
                          )}

                          <div className="question-card-footer">
                            <label className="question-toggle-required">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                              />
                              Bắt buộc trả lời
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Question Toolbar */}
                    <div className="add-question-toolbar" style={{ marginTop: '24px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>
                        + Thêm câu hỏi mới theo định dạng:
                      </span>
                      <div className="add-question-types-row">
                        <button
                          type="button"
                          className="btn-add-q-type"
                          onClick={() => addQuestion('rating_star')}
                        >
                          <Star size={15} color="#f59e0b" /> Đánh giá sao
                        </button>
                        <button
                          type="button"
                          className="btn-add-q-type"
                          onClick={() => addQuestion('nps_score')}
                        >
                          <Sparkles size={15} color="#3b82f6" /> Điểm NPS (1-10)
                        </button>
                        <button
                          type="button"
                          className="btn-add-q-type"
                          onClick={() => addQuestion('single_choice')}
                        >
                          <CheckCircle2 size={15} color="#10b981" /> Trắc nghiệm 1 đáp án
                        </button>
                        <button
                          type="button"
                          className="btn-add-q-type"
                          onClick={() => addQuestion('multiple_choice')}
                        >
                          <Layers size={15} color="#8b5cf6" /> Nhiều lựa chọn
                        </button>
                        <button
                          type="button"
                          className="btn-add-q-type"
                          onClick={() => addQuestion('text')}
                        >
                          <MessageSquare size={15} color="#ef4444" /> Ý kiến tự do
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="survey-btn survey-btn-secondary"
                        onClick={() => setActiveStep(1)}
                      >
                        &larr; Quay lại thông tin chung
                      </button>
                      <button
                        type="button"
                        className="survey-btn survey-btn-primary"
                        onClick={() => setActiveStep(3)}
                      >
                        Tiếp tục: Kênh gửi & Đối tượng &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ĐỐI TƯỢNG & KÊNH GỬI */}
            {activeStep === 3 && (
              <div className="survey-card">
                <div className="survey-card-header">
                  <div className="survey-card-header-left">
                    <div className="survey-card-icon-box">
                      <Send size={20} />
                    </div>
                    <div>
                      <h3 className="survey-card-title">Kênh phân phối & Đối tượng nhận</h3>
                      <p className="survey-card-desc">Lựa chọn các kênh gửi lời mời khảo sát đến khách hàng</p>
                    </div>
                  </div>
                </div>

                <div className="survey-card-body">
                  <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                    Chọn các kênh phân phối:
                  </h4>
                  <div className="channel-grid">
                    <div
                      className={`channel-card ${formData.channels.includes('Email') ? 'active' : ''}`}
                      onClick={() => toggleChannel('Email')}
                    >
                      <div className="channel-icon-box">
                        <Mail size={20} />
                      </div>
                      <div className="channel-info">
                        <h4>Gửi Email tự động</h4>
                        <p>Gửi thư mời trực tiếp vào hộp thư khách hàng</p>
                      </div>
                    </div>

                    <div
                      className={`channel-card ${formData.channels.includes('DirectLink') ? 'active' : ''}`}
                      onClick={() => toggleChannel('DirectLink')}
                    >
                      <div className="channel-icon-box">
                        <Globe size={20} />
                      </div>
                      <div className="channel-info">
                        <h4>Liên kết trực tiếp (URL)</h4>
                        <p>Chia sẻ qua Zalo, Messenger, QR Code</p>
                      </div>
                    </div>

                    <div
                      className={`channel-card ${formData.channels.includes('Portal') ? 'active' : ''}`}
                      onClick={() => toggleChannel('Portal')}
                    >
                      <div className="channel-icon-box">
                        <Layers size={20} />
                      </div>
                      <div className="channel-info">
                        <h4>Cổng Portal Viettel</h4>
                        <p>Hiển thị pop-up khi khách hàng đăng nhập portal</p>
                      </div>
                    </div>

                    <div
                      className={`channel-card ${formData.channels.includes('SMS') ? 'active' : ''}`}
                      onClick={() => toggleChannel('SMS')}
                    >
                      <div className="channel-icon-box">
                        <Smartphone size={20} />
                      </div>
                      <div className="channel-info">
                        <h4>Tin nhắn SMS Brandname</h4>
                        <p>Gửi SMS kèm link rút gọn đến số điện thoại đại diện</p>
                      </div>
                    </div>
                  </div>

                  {/* Share Link Box */}
                  <div className="survey-share-box">
                    <label className="form-label">
                      <Link2 size={16} /> Đường dẫn liên kết làm bài khảo sát:
                    </label>
                    <div className="share-input-group">
                      <input
                        type="text"
                        className="share-url-input"
                        readOnly
                        value={`${window.location.origin}/survey/view/${formData.id || 'SRV-001'}`}
                      />
                      <button
                        type="button"
                        className="survey-btn survey-btn-secondary"
                        onClick={handleCopyLink}
                      >
                        {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                        {copiedLink ? 'Đã sao chép' : 'Sao chép link'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="survey-btn survey-btn-secondary"
                      onClick={() => setActiveStep(2)}
                    >
                      &larr; Quay lại bộ câu hỏi
                    </button>
                    <button
                      type="button"
                      className="survey-btn survey-btn-primary"
                      onClick={() => setActiveStep(4)}
                    >
                      Tiếp tục: Cài đặt & Lịch trình &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CÀI ĐẶT & LỊCH TRÌNH */}
            {activeStep === 4 && (
              <div className="survey-card">
                <div className="survey-card-header">
                  <div className="survey-card-header-left">
                    <div className="survey-card-icon-box">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h3 className="survey-card-title">Cài đặt lịch trình & Quy tắc gửi</h3>
                      <p className="survey-card-desc">Thiết lập thời gian khảo sát và cơ chế nhắc nhở tự động</p>
                    </div>
                  </div>
                </div>

                <div className="survey-card-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ngày bắt đầu hiệu lực</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ngày kết thúc / Hạn chót</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row single-col">
                    <div className="form-group">
                      <label className="form-label">Cơ chế phát hành khảo sát</label>
                      <select
                        className="form-select"
                        value={formData.sendSchedule}
                        onChange={e => setFormData({ ...formData, sendSchedule: e.target.value })}
                      >
                        <option value="immediate">Gửi ngay khi kích hoạt khảo sát</option>
                        <option value="scheduled">Gửi theo lịch hẹn vào ngày bắt đầu</option>
                        <option value="periodic">Tự động lặp lại định kỳ hàng tháng</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Tự động nhắc nhở khách hàng chưa trả lời</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Gửi email nhắc lại sau 3 ngày nếu chưa hoàn thành khảo sát</div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.sendReminder}
                          onChange={e => setFormData({ ...formData, sendReminder: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Cho phép phản hồi ẩn danh (Anonymous)</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Không thu thập thông tin định danh cá nhân của người làm khảo sát</div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.allowAnonymous}
                          onChange={e => setFormData({ ...formData, allowAnonymous: e.target.checked })}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="survey-btn survey-btn-secondary"
                      onClick={() => setActiveStep(3)}
                    >
                      &larr; Quay lại kênh gửi
                    </button>
                    <button
                      type="button"
                      className="survey-btn survey-btn-primary"
                      onClick={() => handleSave('active')}
                    >
                      <CheckCircle2 size={16} /> Hoàn tất & Kích hoạt khảo sát
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR WIDGETS */}
          <div className="survey-side-column">
            
            {/* Survey Status & Info Widget */}
            <div className="side-widget-card">
              <h4 className="side-widget-title">
                <Layers size={16} color="#ee0033" /> Tổng quan khảo sát
              </h4>

              <div className="side-stat-row">
                <span className="side-stat-label">Mã khảo sát</span>
                <span className="side-stat-val" style={{ color: '#ee0033' }}>{formData.id || 'SRV-001'}</span>
              </div>

              <div className="side-stat-row">
                <span className="side-stat-label">Trạng thái</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '12.5px' }}
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="paused">Tạm dừng</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              <div className="side-stat-row">
                <span className="side-stat-label">Tổng số câu hỏi</span>
                <span className="side-stat-val">{formData.questions.length} câu</span>
              </div>

              <div className="side-stat-row">
                <span className="side-stat-label">Chỉ tiêu phản hồi</span>
                <span className="side-stat-val">{formData.target} lượt</span>
              </div>

              <div className="side-stat-row">
                <span className="side-stat-label">Hợp đồng</span>
                <span className="side-stat-val" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {formData.contractCode}
                </span>
              </div>

              <div className="side-action-buttons">
                <button
                  type="button"
                  className="survey-btn survey-btn-primary btn-full-width"
                  onClick={() => handleSave('active')}
                >
                  <Save size={16} /> Lưu & Kích hoạt
                </button>
                <button
                  type="button"
                  className="survey-btn survey-btn-preview btn-full-width"
                  onClick={() => setShowPreviewModal(true)}
                >
                  <Eye size={16} /> Xem trước bảng hỏi
                </button>
                <button
                  type="button"
                  className="survey-btn survey-btn-secondary btn-full-width"
                  onClick={() => handleSave('draft')}
                >
                  Lưu bản nháp
                </button>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="side-widget-card" style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', color: '#ee0033' }}>
                <AlertCircle size={16} />
                <strong style={{ fontSize: '13px' }}>Mẹo tối ưu khảo sát:</strong>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Các khảo sát từ 5 - 8 câu hỏi có tỷ lệ hoàn thành cao hơn 45% so với bảng hỏi dài. Hãy ưu tiên câu hỏi đánh giá sao và NPS ở phần đầu!
              </p>
            </div>

          </div>

        </div>

        {/* 4. PREVIEW MODAL */}
        {showPreviewModal && (
          <div className="survey-modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="survey-modal-content" onClick={e => e.stopPropagation()}>
              <div className="survey-modal-header">
                <h3 className="survey-modal-title">Xem trước giao diện khách hàng</h3>
                <button
                  type="button"
                  className="survey-modal-close"
                  onClick={() => setShowPreviewModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="survey-modal-body">
                <div className="preview-survey-banner">
                  <h2>{formData.title || 'Tiêu đề khảo sát'}</h2>
                  <p>{formData.description || 'Kính mời Quý khách dành 2 phút để đánh giá chất lượng dịch vụ nhằm giúp chúng tôi phục vụ tốt hơn.'}</p>
                </div>

                <div className="preview-questions-list">
                  {formData.questions.map((q, idx) => (
                    <div key={q.id} className="preview-question-item">
                      <div className="preview-question-title">
                        {idx + 1}. {q.title} {q.required && <span style={{ color: '#ee0033' }}>*</span>}
                      </div>

                      {q.type === 'rating_star' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={28} color="#cbd5e1" style={{ cursor: 'pointer' }} />
                          ))}
                        </div>
                      )}

                      {q.type === 'nps_score' && (
                        <div className="nps-scale-preview">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <div key={n} className="nps-box" style={{ cursor: 'pointer' }}>{n}</div>
                          ))}
                        </div>
                      )}

                      {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(q.options || []).map((opt, i) => (
                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                              <input type={q.type === 'single_choice' ? 'radio' : 'checkbox'} name={`preview_${q.id}`} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'text' && (
                        <textarea
                          className="form-textarea"
                          placeholder="Nhập ý kiến đóng góp của Quý khách..."
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button type="button" className="survey-btn survey-btn-primary" style={{ padding: '10px 32px' }}>
                    Gửi phản hồi khảo sát
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
