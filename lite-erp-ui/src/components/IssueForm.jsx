import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown, 
  Save, 
  User, 
  Phone, 
  Flag, 
  Building2, 
  FileText, 
  Clock, 
  Calendar, 
  Send, 
  MoreVertical, 
  Smile, 
  ThumbsUp, 
  Heart, 
  MessageSquare, 
  CloudUpload, 
  Trash2, 
  Download,
  AlertCircle,
  AlertTriangle,
  Hash,
  Shield,
  MessageCircle,
  Star,
  Plus,
  XCircle,
  Ban,
  X
} from 'lucide-react';
import './IssueForm.css';

const EMPLOYEES = [
  'Nguyễn Văn A',
  'Lê Văn Hưng',
  'Nguyễn Thị Lan',
  'Trần Minh Hải',
  'Phạm Thị Mai',
  'Admin'
];

const RECEPTION_CHANNELS = [
  'Hotline 1800xxxx',
  'Email Chăm sóc khách hàng',
  'Website / Cổng dịch vụ',
  'Gặp trực tiếp / Chi nhánh',
  'Ứng dụng MyViettel / Portal'
];

const PRODUCT_GROUPS = [
  'CC Outsourcing',
  'Hệ thống ERP / CRM',
  'Hạ tầng Cloud / Hosting',
  'Giải pháp Bảo mật An ninh mạng',
  'Dịch vụ Viễn thông'
];

const ISSUE_GROUPS = [
  'PA về hợp đồng, chính sách kinh doanh, tài chính',
  'PA về chất lượng dịch vụ, kỹ thuật vận hành',
  'PA về thái độ phục vụ và quy trình hỗ trợ',
  'PA về thời gian phản hồi và SLA cam kết'
];

const DEPARTMENTS = [
  'Viettel Telecom (VTT)',
  'Viettel Solutions (VTS)',
  'Viettel Cyber Security (VCS)',
  'Viettel Post',
  'Ngân hàng TMCP An Bình (ABBank)',
  'Công ty CP Sữa Việt Nam (Vinamilk)',
  'Khách hàng Doanh nghiệp khác'
];

const PRODUCT_TYPES = [
  'FO',
  'BO',
  'Toàn trình',
  'SaaS',
  'Dịch vụ số',
  'Khác'
];

const ISSUE_CATEGORIES = [
  'Phạm vi hợp đồng',
  'Chất lượng dịch vụ',
  'Tiến độ triển khai',
  'Thanh toán & Cước phí',
  'Kỹ thuật hệ thống',
  'Khác'
];

const BASELINE_SLA_OPTIONS = [
  '2h (Khẩn cấp)',
  '4h (Ưu tiên)',
  '8h (Trong ngày)',
  '24h (1 ngày)',
  '48h (2 ngày)',
  '72h (3 ngày)',
  '5 ngày làm việc',
  '7 ngày làm việc'
];

const calculateActualHours = (ngay, gio) => {
  if (!ngay) return '0 giờ';
  try {
    let year, month, day;
    if (ngay.includes('-')) {
      const parts = ngay.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else if (ngay.includes('/')) {
      const parts = ngay.split('/');
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    } else {
      return '0 giờ';
    }

    let hours = 9, minutes = 0;
    if (gio && gio.includes(':')) {
      const gParts = gio.split(':');
      hours = parseInt(gParts[0], 10) || 0;
      minutes = parseInt(gParts[1], 10) || 0;
    }

    const receptionDate = new Date(year, month, day, hours, minutes);
    const now = new Date();
    const diffMs = Math.max(0, now - receptionDate);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hoursElapsed = diffMs / (1000 * 60 * 60);

    if (totalMinutes === 0) return '0 giờ';
    if (totalMinutes < 60) {
      return `${hoursElapsed.toFixed(1)} giờ (${totalMinutes} phút)`;
    }
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (m === 0) return `${h} giờ`;
    return `${hoursElapsed.toFixed(1)} giờ (${h}h ${m}p)`;
  } catch (err) {
    return '0 giờ';
  }
};

const FEEDBACK_TAGS = [
  'Tốc độ xử lý nhanh',
  'Thái độ chuyên nghiệp',
  'Giải quyết triệt để',
  'Đúng thời hạn cam kết',
  'Cần cải thiện tốc độ'
];

export default function IssueForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Stepper: 1: Mới, 2: Đang thực hiện, 3: Hoàn thành
  const [currentStep, setCurrentStep] = useState(1);

  // Support Type
  const [supportType, setSupportType] = useState('PAKH');

  // Accordion Sections State
  const [expandedSections, setExpandedSections] = useState({
    section1: true,
    section2: true,
    section3: true,
    section4: true,
    section5: true,
    section6: true
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Main Form Data
  const [formData, setFormData] = useState({
    // Section 1: Thông tin phản ánh (10 trường chuẩn)
    nguoiPhanAnh: '',
    donViPhanAnh: '',
    sdtDiaChiPhanHoi: '',
    nhomSpDv: '',
    loaiSpDv: '',
    nhomPhanAnh: '',
    theLoai: '',
    mucDoUuTien: '',
    capDoCanhBao: '',
    noiDungChiTiet: '',

    // Section 2: Thông tin tiếp nhận
    kenhTiepNhan: '',
    nhanVienTiepNhan: 'Lê Văn Hưng',
    ngayTiepNhan: new Date().toISOString().split('T')[0],
    gioTiepNhan: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    tongHopNoiDungXuLy: '',
    thoiGianXuLyBaseline: '24h (1 ngày)',
    thoiGianXuLyActual: '',
    tienDoXuLy: 'Trong hạn',

    // Section 3: Phân loại
    soLanLapPhanAnh: 0,
    daGiaHan: '',

    // Section 4: Thời gian & phân công
    baoCaoBoi: 'Nguyễn Văn A',
    hanChot: '2026-05-08',
    assignees: [
      { id: 1, person: '', description: '' }
    ],

    // Section 6: Đánh giá khách hàng
    rating: 5,
    selectedTags: ['Tốc độ xử lý nhanh', 'Thái độ chuyên nghiệp'],
    danhGiaGhiChu: '',
    ngayDanhGia: '2026-05-10',
    kenhThuThapDanhGia: 'Khảo sát qua cuộc gọi'
  });

  const actualHoursDisplay = useMemo(() => {
    return calculateActualHours(formData.ngayTiepNhan, formData.gioTiepNhan);
  }, [formData.ngayTiepNhan, formData.gioTiepNhan]);

  // Attached Documents (Section 5)
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

  // Chatter Tab: 'comment' | 'history'
  const [activeTab, setActiveTab] = useState('comment');

  // Cancel Issue Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');

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

  const [newComment, setNewComment] = useState('');

  // History logs
  const [historyLogs, setHistoryLogs] = useState([
    { id: 1, author: 'Hệ thống', time: '17/04/2026 09:00', action: 'Khởi tạo hồ sơ phản ánh khách hàng mới' },
    { id: 2, author: 'Nguyễn Văn A', time: '17/04/2026 09:15', action: 'Tiếp nhận thông tin và phân công xử lý' }
  ]);

  // Load existing data if editing
  useEffect(() => {
    if (id && id !== 'new') {
      try {
        const stored = localStorage.getItem('ha_pakh_issues');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find(i => String(i.id) === String(id) || i.maKhieuNai === id);
          if (found) {
            setFormData(prev => ({
              ...prev,
              nguoiPhanAnh: found.nguoiPhanAnh || '',
              donViPhanAnh: found.donViPhanAnh || '',
              sdtDiaChiPhanHoi: found.sdtDiaChiPhanHoi || '',
              nhomSpDv: found.nhomSpDv || '',
              loaiSpDv: found.loaiSpDv || '',
              nhomPhanAnh: found.nhomPhanAnh || '',
              theLoai: found.theLoai || '',
              mucDoUuTien: found.mucDoUuTien || '',
              capDoCanhBao: found.capDoCanhBao || '',
              noiDungChiTiet: found.noiDungKhieuNai || '',
              kenhTiepNhan: found.kenhTiepNhan || '',
              nhanVienTiepNhan: found.nhanVienTiepNhan || found.reporter || 'Lê Văn Hưng',
              ngayTiepNhan: found.ngayTiepNhan ? (found.ngayTiepNhan.includes('/') ? found.ngayTiepNhan.split('/').reverse().join('-') : found.ngayTiepNhan) : new Date().toISOString().split('T')[0],
              gioTiepNhan: found.gioTiepNhan || '09:00',
              tongHopNoiDungXuLy: found.tongHopNoiDungXuLy || '',
              thoiGianXuLyBaseline: found.thoiGianXuLyBaseline || found.thoiHanXuLy || '24h (1 ngày)',
              thoiGianXuLyActual: found.thoiGianXuLyActual || `${found.ngayTiepNhan || '03/09/2026'} 09:30`,
              tienDoXuLy: found.tienDoXuLy || 'Trong hạn',
              baoCaoBoi: found.reporter || 'Nguyễn Văn A',
              hanChot: found.dueDate || '2026-05-08'
            }));

            if (found.trangThaiPhanAnh === 'Đang xử lý' || found.status === 'processing') {
              setCurrentStep(2);
            } else if (found.trangThaiPhanAnh === 'Xử lý xong' || found.trangThaiPhanAnh === 'Đã hoàn thành' || found.status === 'done') {
              setCurrentStep(3);
            } else if (found.trangThaiPhanAnh === 'Đóng' || found.status === 'closed') {
              setCurrentStep(4);
            } else {
              setCurrentStep(1);
            }
          }
        }
      } catch (err) {
        console.error('Error loading issue:', err);
      }
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Assignees handlers
  const handleAddAssignee = () => {
    setFormData(prev => ({
      ...prev,
      assignees: [...prev.assignees, { id: Date.now(), person: '', description: '' }]
    }));
  };

  const handleUpdateAssignee = (idx, key, value) => {
    setFormData(prev => {
      const copy = [...prev.assignees];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, assignees: copy };
    });
  };

  const handleRemoveAssignee = (idx) => {
    if (formData.assignees.length <= 1) {
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

  // Feedback Tags Toggle
  const handleToggleTag = (tag) => {
    setFormData(prev => {
      const exists = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: exists 
          ? prev.selectedTags.filter(t => t !== tag)
          : [...prev.selectedTags, tag]
      };
    });
  };

  // Upload handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const newDocs = files.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name.length > 12 ? file.name.slice(0, 8) + '...' : file.name,
      fullName: file.name,
      description: 'Tài liệu đính kèm',
      uploadDate: todayStr,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    }));

    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleRemoveDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Comments
  const handleSendComment = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    const comm = {
      id: Date.now(),
      author: 'Bạn (Người dùng)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Vừa xong',
      content: newComment.trim(),
      reactions: { smile: 0, like: 0, heart: 0 },
      userReacted: {}
    };

    setComments(prev => [comm, ...prev]);
    setNewComment('');
  };

  const handleReaction = (commentId, type) => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const already = c.userReacted?.[type];
      const count = c.reactions[type] || 0;
      return {
        ...c,
        reactions: {
          ...c.reactions,
          [type]: already ? Math.max(0, count - 1) : count + 1
        },
        userReacted: {
          ...c.userReacted,
          [type]: !already
        }
      };
    }));
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 5: return '5/5 - Rất hài lòng';
      case 4: return '4/5 - Hài lòng';
      case 3: return '3/5 - Bình thường';
      case 2: return '2/5 - Chưa hài lòng';
      case 1: return '1/5 - Rất không hài lòng';
      default: return `${score}/5`;
    }
  };

  // Save full form
  const handleSave = (e) => {
    if (e) e.preventDefault();

    if (!formData.nguoiPhanAnh.trim()) {
      alert('Vui lòng nhập Người phản ánh!');
      return;
    }
    if (!formData.nhomSpDv) {
      alert('Vui lòng chọn Nhóm sản phẩm dịch vụ!');
      return;
    }
    if (!formData.nhomPhanAnh) {
      alert('Vui lòng chọn Nhóm phản ánh!');
      return;
    }
    if (!formData.mucDoUuTien) {
      alert('Vui lòng chọn Mức độ ưu tiên!');
      return;
    }
    if (!formData.donViPhanAnh) {
      alert('Vui lòng chọn Đơn vị phản ánh!');
      return;
    }

    let statusStr = 'Tiếp nhận mới';
    let statusKey = 'todo';
    if (currentStep === 2) {
      statusStr = 'Đang xử lý';
      statusKey = 'processing';
    } else if (currentStep === 3) {
      statusStr = 'Xử lý xong';
      statusKey = 'done';
    } else if (currentStep === 4) {
      statusStr = 'Đóng';
      statusKey = 'closed';
    }

    const newIssueObj = {
      id: id && id !== 'new' ? Number(id) || Date.now() : Date.now(),
      maKhieuNai: `PAKH-2026-${Math.floor(100 + Math.random() * 900)}`,
      nguoiPhanAnh: formData.nguoiPhanAnh,
      donViPhanAnh: formData.donViPhanAnh,
      reporter: formData.baoCaoBoi,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: formData.hanChot,
      nhanVienTiepNhan: formData.nhanVienTiepNhan || formData.baoCaoBoi,
      kenhTiepNhan: formData.kenhTiepNhan || 'Hotline 1800xxxx',
      ngayTiepNhan: formData.ngayTiepNhan || new Date().toLocaleDateString('vi-VN'),
      gioTiepNhan: formData.gioTiepNhan || '09:00',
      mucDoUuTien: formData.mucDoUuTien,
      nhomSpDv: formData.nhomSpDv,
      loaiSpDv: formData.loaiSpDv || 'FO',
      nhomPhanAnh: formData.nhomPhanAnh,
      theLoai: formData.theLoai || 'Phạm vi hợp đồng',
      noiDungKhieuNai: formData.noiDungChiTiet || formData.tongHopNoiDungXuLy || 'Khách hàng phản ánh yêu cầu xử lý',
      tongHopNoiDungXuLy: formData.tongHopNoiDungXuLy || '',
      capDoCanhBao: formData.capDoCanhBao || 'Cấp 1',
      thoiHanXuLy: formData.thoiGianXuLyBaseline || '24h',
      thoiGianXuLyBaseline: formData.thoiGianXuLyBaseline || '24h (1 ngày)',
      thoiGianXuLyActual: actualHoursDisplay,
      ngayHenXuLy: formData.hanChot,
      hinhThucPhanHoi: 'Hotline / Email',
      sdtDiaChiPhanHoi: formData.sdtDiaChiPhanHoi,
      noiDungXuLy: formData.tongHopNoiDungXuLy || 'Đã tiếp nhận hồ sơ',
      donViXuLy: 'Trung tâm Vận hành',
      trangThaiPhanAnh: statusStr,
      nguoiXuLyCuoi: formData.baoCaoBoi,
      ngayDongPhanAnh: '-',
      gioDongPhanAnh: '-',
      tienDoXuLy: formData.tienDoXuLy || 'Trong hạn',
      status: statusKey
    };

    try {
      const existing = localStorage.getItem('ha_pakh_issues');
      let list = existing ? JSON.parse(existing) : [];
      if (id && id !== 'new') {
        list = list.map(item => String(item.id) === String(id) ? newIssueObj : item);
      } else {
        list = [newIssueObj, ...list];
      }
      localStorage.setItem('ha_pakh_issues', JSON.stringify(list));
      window.dispatchEvent(new Event('ha_pakh_updated'));
    } catch (err) {
      console.error(err);
    }

    alert('Đã lưu phản ánh khách hàng thành công!');
    navigate('/issues');
  };

  const handleOpenCancelModal = () => {
    setCancelReason('');
    setCancelReasonError('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      setCancelReasonError('Vui lòng nhập hoặc chọn lý do hủy phản ánh!');
      return;
    }

    const cancelledIssueObj = {
      id: id && id !== 'new' ? Number(id) || Date.now() : Date.now(),
      maKhieuNai: id && id !== 'new' ? id : `PAKH-2026-${Math.floor(100 + Math.random() * 900)}`,
      nguoiPhanAnh: formData.nguoiPhanAnh || 'Khách hàng',
      donViPhanAnh: formData.donViPhanAnh || 'Viettel Telecom (VTT)',
      reporter: formData.nhanVienTiepNhan || 'Lê Văn Hưng',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: formData.hanChot,
      nhanVienTiepNhan: formData.nhanVienTiepNhan || 'Lê Văn Hưng',
      kenhTiepNhan: formData.kenhTiepNhan || 'Hotline 1800xxxx',
      ngayTiepNhan: formData.ngayTiepNhan || new Date().toLocaleDateString('vi-VN'),
      gioTiepNhan: formData.gioTiepNhan || '09:00',
      mucDoUuTien: formData.mucDoUuTien || 'Medium',
      nhomSpDv: formData.nhomSpDv || 'CC Outsourcing',
      loaiSpDv: formData.loaiSpDv || 'FO',
      nhomPhanAnh: formData.nhomPhanAnh || 'PA về hợp đồng',
      theLoai: formData.theLoai || 'Phạm vi hợp đồng',
      noiDungKhieuNai: formData.noiDungChiTiet || 'Khách hàng yêu cầu hủy phản ánh',
      tongHopNoiDungXuLy: `Lý do hủy: ${cancelReason.trim()}`,
      capDoCanhBao: formData.capDoCanhBao || 'Cấp 1',
      thoiHanXuLy: formData.thoiGianXuLyBaseline || '24h',
      thoiGianXuLyBaseline: formData.thoiGianXuLyBaseline || '24h (1 ngày)',
      thoiGianXuLyActual: actualHoursDisplay,
      ngayHenXuLy: formData.hanChot,
      hinhThucPhanHoi: 'Hotline / Email',
      sdtDiaChiPhanHoi: formData.sdtDiaChiPhanHoi,
      noiDungXuLy: `Đã hủy phản ánh (Lý do: ${cancelReason.trim()})`,
      donViXuLy: 'Trung tâm Vận hành',
      trangThaiPhanAnh: 'Hủy phản ánh',
      nguoiXuLyCuoi: formData.nhanVienTiepNhan || 'Lê Văn Hưng',
      ngayDongPhanAnh: new Date().toLocaleDateString('vi-VN'),
      gioDongPhanAnh: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      tienDoXuLy: formData.tienDoXuLy || 'Trong hạn',
      status: 'cancelled'
    };

    try {
      const existing = localStorage.getItem('ha_pakh_issues');
      let list = existing ? JSON.parse(existing) : [];
      if (id && id !== 'new') {
        list = list.map(item => String(item.id) === String(id) ? cancelledIssueObj : item);
      } else {
        list = [cancelledIssueObj, ...list];
      }
      localStorage.setItem('ha_pakh_issues', JSON.stringify(list));
      window.dispatchEvent(new Event('ha_pakh_updated'));
    } catch (err) {
      console.error(err);
    }

    setShowCancelModal(false);
    alert('Đã hủy phản ánh khách hàng thành công!');
    navigate('/issues');
  };

  return (
    <div className="issue-form-page">
      {/* 1. TOP BAR */}
      <div className="issue-top-bar">
        <button 
          type="button" 
          className="issue-btn-back"
          onClick={() => navigate('/issues')}
        >
          <ChevronLeft size={18} />
          <span>Quay lại</span>
        </button>

        {/* STEPPER WITH 4 STATUSES */}
        <div className="issue-stepper">
          <div 
            className={`issue-step ${currentStep === 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-done' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-circle">1</div>
            <span className="step-title">Tiếp nhận mới</span>
          </div>

          <div className={`step-bar ${currentStep >= 2 ? 'bar-active' : ''}`} />

          <div 
            className={`issue-step ${currentStep === 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-done' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <div className="step-circle">2</div>
            <span className="step-title">Đang xử lý</span>
          </div>

          <div className={`step-bar ${currentStep >= 3 ? 'bar-active' : ''}`} />

          <div 
            className={`issue-step ${currentStep === 3 ? 'step-active' : ''} ${currentStep > 3 ? 'step-done' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <div className="step-circle">3</div>
            <span className="step-title">Xử lý xong</span>
          </div>

          <div className={`step-bar ${currentStep >= 4 ? 'bar-active' : ''}`} />

          <div 
            className={`issue-step ${currentStep === 4 ? 'step-active' : ''}`}
            onClick={() => setCurrentStep(4)}
          >
            <div className="step-circle">4</div>
            <span className="step-title">Đóng</span>
          </div>
        </div>

        {/* TOP ACTION BUTTONS: HỦY PHẢN ÁNH & LƯU */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '6px',
              height: '36px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={handleOpenCancelModal}
            title="Bấm để hủy phản ánh này"
          >
            <XCircle size={16} />
            <span>Hủy phản ánh</span>
          </button>

          <button type="button" className="issue-btn-save" onClick={handleSave}>
            <Save size={16} />
            <span>Lưu</span>
          </button>
        </div>
      </div>



      {/* 3. MAIN 2-COLUMN GRID */}
      <div className="issue-main-grid">
        
        {/* LEFT COLUMN: ALL 6 ACCORDION SECTIONS */}
        <div className="issue-left-col">
          
          {/* SECTION 1: THÔNG TIN PHẢN ÁNH */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section1')}
            >
              <h3 className="accordion-title">1. Thông tin phản ánh</h3>
              <button type="button" className="accordion-toggle-btn">
                {expandedSections.section1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {expandedSections.section1 && (
              <div className="accordion-body">
                {/* 1. Người phản ánh (Text / Relation) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Người phản ánh <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="text" 
                      className="issue-field-input" 
                      placeholder="Nhập hoặc chọn người phản ánh..."
                      value={formData.nguoiPhanAnh}
                      onChange={(e) => handleFieldChange('nguoiPhanAnh', e.target.value)}
                      list="customer-relation-list"
                      autoFocus
                    />
                    <User size={18} className="issue-field-icon" />
                    <datalist id="customer-relation-list">
                      <option value="Nguyễn Văn A (Viettel Telecom)" />
                      <option value="Trần Thị Mai (ABBank)" />
                      <option value="Lê Hoàng Nam (Vinamilk)" />
                      <option value="Phạm Thu Hà (VCS)" />
                      <option value="Vũ Đức Thịnh (Viettel Post)" />
                    </datalist>
                  </div>
                </div>

                {/* 2. Đơn vị phản ánh (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Đơn vị phản ánh <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.donViPhanAnh}
                      onChange={(e) => handleFieldChange('donViPhanAnh', e.target.value)}
                    >
                      <option value="">-- Chọn đơn vị phản ánh --</option>
                      {DEPARTMENTS.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <Building2 size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 3. SĐT/Địa chỉ phản hồi (Text) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    SĐT/Địa chỉ phản hồi
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="text" 
                      className="issue-field-input" 
                      placeholder="Nhập SĐT hoặc địa chỉ phản hồi..."
                      value={formData.sdtDiaChiPhanHoi}
                      onChange={(e) => handleFieldChange('sdtDiaChiPhanHoi', e.target.value)}
                    />
                    <Phone size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 4. Nhóm sản phẩm dịch vụ (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Nhóm sản phẩm dịch vụ <span className="star-required">*</span>
                  </label>
                  <div className="issue-select-wrapper">
                    <select 
                      className="issue-field-select"
                      value={formData.nhomSpDv}
                      onChange={(e) => handleFieldChange('nhomSpDv', e.target.value)}
                    >
                      <option value="">-- Chọn nhóm sản phẩm dịch vụ --</option>
                      {PRODUCT_GROUPS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Loại sản phẩm dịch vụ (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Loại sản phẩm dịch vụ <span className="star-required">*</span>
                  </label>
                  <div className="issue-select-wrapper">
                    <select 
                      className="issue-field-select"
                      value={formData.loaiSpDv}
                      onChange={(e) => handleFieldChange('loaiSpDv', e.target.value)}
                    >
                      <option value="">-- Chọn loại sản phẩm dịch vụ --</option>
                      {PRODUCT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Nhóm phản ánh (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Nhóm phản ánh <span className="star-required">*</span>
                  </label>
                  <div className="issue-select-wrapper">
                    <select 
                      className="issue-field-select"
                      value={formData.nhomPhanAnh}
                      onChange={(e) => handleFieldChange('nhomPhanAnh', e.target.value)}
                    >
                      <option value="">-- Chọn nhóm phản ánh --</option>
                      {ISSUE_GROUPS.map(ig => (
                        <option key={ig} value={ig}>{ig}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. Thể loại (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Thể loại <span className="star-required">*</span>
                  </label>
                  <div className="issue-select-wrapper">
                    <select 
                      className="issue-field-select"
                      value={formData.theLoai}
                      onChange={(e) => handleFieldChange('theLoai', e.target.value)}
                    >
                      <option value="">-- Chọn thể loại --</option>
                      {ISSUE_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 8. Mức độ ưu tiên (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Mức độ ưu tiên <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.mucDoUuTien}
                      onChange={(e) => handleFieldChange('mucDoUuTien', e.target.value)}
                    >
                      <option value="">-- Chọn mức độ ưu tiên --</option>
                      <option value="Critical">Critical (Khẩn cấp)</option>
                      <option value="High">High (Cao)</option>
                      <option value="Medium">Medium (Trung bình)</option>
                      <option value="Low">Low (Thấp)</option>
                    </select>
                    <Flag size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 9. Cấp độ cảnh báo (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Cấp độ cảnh báo <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.capDoCanhBao}
                      onChange={(e) => handleFieldChange('capDoCanhBao', e.target.value)}
                    >
                      <option value="">-- Chọn cấp độ cảnh báo --</option>
                      <option value="Cấp 1">Cấp 1 - Nghiêm trọng</option>
                      <option value="Cấp 2">Cấp 2 - Trung bình</option>
                      <option value="Cấp 3">Cấp 3 - Bình thường</option>
                    </select>
                    <AlertTriangle size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 10. Nội dung khiếu nại / Nội dung chi tiết (Long Text) */}
                <div className="issue-form-row align-top">
                  <label className="issue-row-label">
                    Nội dung khiếu nại / Nội dung chi tiết <span className="star-required">*</span>
                  </label>
                  <textarea 
                    className="issue-field-textarea"
                    rows={4}
                    placeholder="Mô tả cụ thể nội dung phản ánh hoặc khiếu nại chi tiết của khách hàng..."
                    value={formData.noiDungChiTiet}
                    onChange={(e) => handleFieldChange('noiDungChiTiet', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: THÔNG TIN TIẾP NHẬN */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section2')}
            >
              <h3 className="accordion-title">2. Thông tin tiếp nhận</h3>
              <button type="button" className="accordion-toggle-btn">
                {expandedSections.section2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {expandedSections.section2 && (
              <div className="accordion-body">
                {/* 1. Kênh tiếp nhận (Single Select - Người dùng chọn) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Kênh tiếp nhận <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.kenhTiepNhan}
                      onChange={(e) => handleFieldChange('kenhTiepNhan', e.target.value)}
                    >
                      <option value="">-- Chọn kênh tiếp nhận --</option>
                      {RECEPTION_CHANNELS.map(ch => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                    <MessageCircle size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 2. Nhân viên tiếp nhận (User/Relation - Tự động lấy người tiếp nhận) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Nhân viên tiếp nhận
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="text" 
                      className="issue-field-input"
                      value={formData.nhanVienTiepNhan}
                      readOnly
                      style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'default' }}
                      title="Hệ thống tự động ghi nhận nhân viên tiếp nhận"
                    />
                    <User size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 3. Ngày tiếp nhận (Date - Tự động ghi nhận) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Ngày tiếp nhận
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="date" 
                      className="issue-field-input"
                      value={formData.ngayTiepNhan}
                      readOnly
                      style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'default' }}
                      title="Hệ thống tự động ghi nhận ngày tiếp nhận"
                    />
                    <Calendar size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 4. Giờ tiếp nhận (Time - Tự động ghi nhận) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Giờ tiếp nhận
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="time" 
                      className="issue-field-input"
                      value={formData.gioTiepNhan}
                      readOnly
                      style={{ backgroundColor: '#f8fafc', color: '#334155', cursor: 'default' }}
                      title="Hệ thống tự động ghi nhận giờ tiếp nhận"
                    />
                    <Clock size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 5. Tổng hợp nội dung xử lý (Long Text - Người dùng nhập) */}
                <div className="issue-form-row align-top">
                  <label className="issue-row-label">
                    Tổng hợp nội dung xử lý
                  </label>
                  <textarea 
                    className="issue-field-textarea"
                    rows={4}
                    placeholder="Nhập tổng hợp nội dung xử lý phản ánh..."
                    value={formData.tongHopNoiDungXuLy}
                    onChange={(e) => handleFieldChange('tongHopNoiDungXuLy', e.target.value)}
                  />
                </div>

                {/* 6. Thời gian xử lý (Baseline) (Single Select - Người dùng chọn) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Thời gian xử lý (Baseline) <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.thoiGianXuLyBaseline}
                      onChange={(e) => handleFieldChange('thoiGianXuLyBaseline', e.target.value)}
                    >
                      <option value="">-- Chọn thời gian xử lý (Baseline) --</option>
                      {BASELINE_SLA_OPTIONS.map(sla => (
                        <option key={sla} value={sla}>{sla}</option>
                      ))}
                    </select>
                    <Clock size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* 7. Thời gian xử lý (Actual) (Tính tự động theo số giờ) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Thời gian xử lý (Actual)
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="text" 
                      className="issue-field-input"
                      value={actualHoursDisplay}
                      readOnly
                      style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 600, cursor: 'default' }}
                      title="Hệ thống tự động tính số giờ từ lúc tiếp nhận đến hiện tại"
                    />
                    <Clock size={18} className="issue-field-icon" style={{ color: '#ee0033' }} />
                  </div>
                </div>

                {/* 8. Tiến độ xử lý (Single Select) */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Tiến độ xử lý <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.tienDoXuLy}
                      onChange={(e) => handleFieldChange('tienDoXuLy', e.target.value)}
                    >
                      <option value="Trong hạn">Trong hạn</option>
                      <option value="Ngoài hạn">Ngoài hạn</option>
                    </select>
                    <Clock size={18} className="issue-field-icon" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: PHÂN LOẠI */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section3')}
            >
              <h3 className="accordion-title">3. Phân loại</h3>
              <button type="button" className="accordion-toggle-btn">
                {expandedSections.section3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {expandedSections.section3 && (
              <div className="accordion-body">
                {/* Số lần bị lặp phản ánh trong 30 ngày */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Số lần bị lặp phản ánh trong 30 ngày <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <input 
                      type="number" 
                      className="issue-field-input"
                      value={formData.soLanLapPhanAnh}
                      onChange={(e) => handleFieldChange('soLanLapPhanAnh', e.target.value)}
                      min="0"
                    />
                    <Hash size={18} className="issue-field-icon" />
                  </div>
                </div>

                {/* Đã gia hạn */}
                <div className="issue-form-row">
                  <label className="issue-row-label">
                    Đã gia hạn <span className="star-required">*</span>
                  </label>
                  <div className="issue-input-with-icon">
                    <select 
                      className="issue-field-select"
                      value={formData.daGiaHan}
                      onChange={(e) => handleFieldChange('daGiaHan', e.target.value)}
                    >
                      <option value="">-- Chọn --</option>
                      <option value="Chưa gia hạn">Chưa gia hạn</option>
                      <option value="Đã gia hạn 1 lần">Đã gia hạn 1 lần</option>
                      <option value="Đã gia hạn 2 lần">Đã gia hạn 2 lần</option>
                      <option value="Không cho phép gia hạn">Không cho phép gia hạn</option>
                    </select>
                    <Shield size={18} className="issue-field-icon" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: THỜI GIAN & PHÂN CÔNG */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section4')}
            >
              <h3 className="accordion-title">Thời gian & phân công</h3>
              <button type="button" className="accordion-toggle-btn">
                {expandedSections.section4 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {expandedSections.section4 && (
              <div className="accordion-body">
                {/* 2-column: Báo Cáo Bởi & Hạn Chót */}
                <div className="issue-split-row">
                  <div className="issue-split-item">
                    <label className="issue-split-label">Báo Cáo Bởi</label>
                    <div className="issue-split-control">
                      <select 
                        className="issue-field-select"
                        value={formData.baoCaoBoi}
                        onChange={(e) => handleFieldChange('baoCaoBoi', e.target.value)}
                      >
                        {EMPLOYEES.map(emp => (
                          <option key={emp} value={emp}>{emp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="issue-split-item">
                    <label className="issue-split-label">Hạn Chót</label>
                    <div className="issue-split-control issue-input-with-icon">
                      <input 
                        type="date"
                        className="issue-field-input"
                        value={formData.hanChot}
                        onChange={(e) => handleFieldChange('hanChot', e.target.value)}
                      />
                      <Calendar size={18} className="issue-field-icon" />
                    </div>
                  </div>
                </div>

                {/* Sub-table: Giao Việc Cho */}
                <div className="assignee-sub-section">
                  <label className="assignee-main-label">Giao Việc Cho</label>
                  <div className="assignee-table-card">
                    <table className="assignee-custom-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}></th>
                          <th style={{ width: '45%' }}>Người thực hiện</th>
                          <th>Mô tả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.assignees.map((item, idx) => (
                          <tr key={item.id || idx}>
                            <td className="cell-trash">
                              <button 
                                type="button" 
                                className="btn-del-assignee"
                                onClick={() => handleRemoveAssignee(idx)}
                                title="Xóa dòng"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                            <td>
                              <select 
                                className="assignee-select"
                                value={item.person}
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
                                className="assignee-input"
                                placeholder="Mô tả công việc"
                                value={item.description}
                                onChange={(e) => handleUpdateAssignee(idx, 'description', e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="assignee-footer-row">
                      <button 
                        type="button" 
                        className="btn-add-assignee-link"
                        onClick={handleAddAssignee}
                      >
                        + Thêm giao việc
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: TÀI LIỆU ĐÍNH KÈM */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section5')}
            >
              <div className="accordion-title-flex">
                <h3 className="accordion-title">Tài liệu đính kèm</h3>
              </div>
              <div className="accordion-actions-right">
                <button 
                  type="button" 
                  className="btn-download-all-red"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Đang tải xuống ${documents.length} tài liệu đính kèm...`);
                  }}
                >
                  <Download size={14} />
                  <span>Download all</span>
                </button>
                <button type="button" className="accordion-toggle-btn">
                  {expandedSections.section5 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {expandedSections.section5 && (
              <div className="accordion-body">
                {/* Drag and drop upload box */}
                <div 
                  className="issue-drag-drop-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileUpload}
                  />
                  <p className="drag-drop-title">Drag and drop or Browse your file</p>
                  <button 
                    type="button" 
                    className="btn-choose-file-red"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <CloudUpload size={15} />
                    <span>Choose file</span>
                  </button>
                  <p className="drag-drop-meta">Type: xls, xlsx, pdf, doc. Max size: 20MB</p>
                </div>

                {/* Table of documents */}
                <div className="docs-table-wrapper">
                  <table className="docs-custom-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '60px' }}>
                          <span className="th-sort-text">No <span>⇅ ⧩</span></span>
                        </th>
                        <th style={{ width: '25%' }}>
                          <span className="th-sort-text">Tài liệu <span>⇅ ⧩</span></span>
                        </th>
                        <th>
                          <span className="th-sort-text">Nội dung tài liệu <span>⇅ ⧩</span></span>
                        </th>
                        <th style={{ width: '22%' }}>
                          <span className="th-sort-text">Thời điểm tải lên <span>⇅ ⧩</span></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, idx) => (
                        <tr key={doc.id}>
                          <td className="cell-trash">
                            <button 
                              type="button" 
                              className="btn-del-assignee"
                              onClick={() => handleRemoveDocument(doc.id)}
                              title="Xóa tài liệu"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                          <td style={{ fontWeight: 500, color: '#475569' }}>{idx + 1}</td>
                          <td>
                            <a 
                              href="#view" 
                              className="doc-link-blue"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Mở tài liệu: ${doc.fullName || doc.name}`);
                              }}
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
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                            Chưa có tài liệu đính kèm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: ĐÁNH GIÁ KHÁCH HÀNG */}
          <div className="issue-accordion-card">
            <div 
              className="accordion-header"
              onClick={() => toggleSection('section6')}
            >
              <h3 className="accordion-title">6. Đánh giá khách hàng</h3>
              <button type="button" className="accordion-toggle-btn">
                {expandedSections.section6 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {expandedSections.section6 && (
              <div className="accordion-body">
                {/* Đánh giá mức độ hài lòng */}
                <div className="issue-form-row align-top">
                  <label className="issue-row-label">
                    Đánh giá mức độ hài lòng <span className="star-required">*</span>
                  </label>
                  <div className="satisfaction-rating-container">
                    {/* 5 Stars Rating */}
                    <div className="stars-row">
                      <div className="stars-group">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <Star 
                            key={starNum}
                            size={22}
                            className={`star-icon-btn ${starNum <= formData.rating ? 'star-filled' : 'star-empty'}`}
                            onClick={() => handleFieldChange('rating', starNum)}
                          />
                        ))}
                      </div>
                      <span className="rating-score-text">
                        {getRatingLabel(formData.rating)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="issue-form-row align-top">
                  <label className="issue-row-label">
                    Ghi chú
                  </label>
                  <textarea 
                    className="issue-field-textarea"
                    rows={3}
                    placeholder="Nhập ghi chú hoặc ý kiến nhận xét của khách hàng sau khi xử lý phản ánh..."
                    value={formData.danhGiaGhiChu}
                    onChange={(e) => handleFieldChange('danhGiaGhiChu', e.target.value)}
                  />
                </div>

                {/* 2-column: Ngày đánh giá & Kênh thu thập đánh giá */}
                <div className="issue-split-row">
                  <div className="issue-split-item">
                    <label className="issue-split-label">Ngày đánh giá</label>
                    <div className="issue-split-control issue-input-with-icon">
                      <input 
                        type="date"
                        className="issue-field-input"
                        value={formData.ngayDanhGia}
                        onChange={(e) => handleFieldChange('ngayDanhGia', e.target.value)}
                      />
                      <Calendar size={18} className="issue-field-icon" />
                    </div>
                  </div>

                  <div className="issue-split-item">
                    <label className="issue-split-label">Kênh thu thập đánh giá</label>
                    <div className="issue-split-control">
                      <select 
                        className="issue-field-select"
                        value={formData.kenhThuThapDanhGia}
                        onChange={(e) => handleFieldChange('kenhThuThapDanhGia', e.target.value)}
                      >
                        <option value="Khảo sát qua cuộc gọi">Khảo sát qua cuộc gọi</option>
                        <option value="Khảo sát qua SMS">Khảo sát qua SMS</option>
                        <option value="Khảo sát qua Email">Khảo sát qua Email</option>
                        <option value="Đánh giá trên ứng dụng / Web">Đánh giá trên ứng dụng / Web</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: CHATTER & AUDIT TRAIL */}
        <div className="issue-right-col">
          <div className="issue-chatter-card">
            {/* Tabs */}
            <div className="issue-tabs-header">
              <button 
                type="button" 
                className={`issue-tab-btn ${activeTab === 'comment' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('comment')}
              >
                <MessageSquare size={15} />
                <span>COMMENT</span>
              </button>
              <button 
                type="button" 
                className={`issue-tab-btn ${activeTab === 'history' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <Clock size={15} />
                <span>LỊCH SỬ</span>
              </button>
            </div>

            {activeTab === 'comment' ? (
              <div className="issue-chatter-pane">
                {/* Comment list */}
                <div className="issue-comments-list">
                  {comments.map((comm) => (
                    <div key={comm.id} className="issue-comment-item">
                      <div className="issue-comment-avatar">
                        <img src={comm.avatar} alt={comm.author} />
                      </div>
                      <div className="issue-comment-content-box">
                        <div className="issue-comment-header">
                          <span className="issue-comment-author">{comm.author}</span>
                          <span className="issue-comment-time">{comm.time}</span>
                          <button type="button" className="issue-comment-more">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                        <div className="issue-comment-text">
                          {comm.content}
                        </div>
                        {/* Reactions */}
                        <div className="issue-comment-reactions">
                          <button 
                            type="button" 
                            className="react-btn"
                            onClick={() => handleReaction(comm.id, 'smile')}
                            title="Cười"
                          >
                            <Smile size={14} />
                          </button>
                          <button 
                            type="button" 
                            className={`react-btn ${comm.userReacted?.like ? 'active' : ''}`}
                            onClick={() => handleReaction(comm.id, 'like')}
                            title="Thích"
                          >
                            <ThumbsUp size={14} />
                            <span>{comm.reactions.like}</span>
                          </button>
                          <button 
                            type="button" 
                            className={`react-btn ${comm.userReacted?.heart ? 'active' : ''}`}
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

                {/* Comment compose box */}
                <div className="issue-compose-box">
                  <div className="issue-compose-row">
                    <div className="issue-compose-avatar">
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                        alt="User" 
                      />
                    </div>
                    <div className="issue-compose-main">
                      <textarea 
                        className="issue-compose-textarea"
                        rows={3}
                        placeholder="Viết comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="issue-compose-actions">
                        <button 
                          type="button" 
                          className="issue-btn-send"
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
              <div className="issue-history-pane">
                <div className="issue-history-timeline">
                  {historyLogs.map(log => (
                    <div key={log.id} className="issue-history-entry">
                      <div className="history-dot" />
                      <div className="history-detail">
                        <div className="history-head">
                          <span className="history-author">{log.author}</span>
                          <span className="history-time">{log.time}</span>
                        </div>
                        <p className="history-desc">{log.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* POPUP MODAL NHẬP LÝ DO HỦY PHẢN ÁNH */}
      {showCancelModal && (
        <div className="pakh-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="pakh-cancel-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="pakh-modal-header">
              <h3 className="pakh-modal-title">
                <AlertCircle size={20} color="#dc2626" />
                <span>Hủy phản ánh khách hàng</span>
              </h3>
              <button 
                type="button" 
                className="pakh-modal-close-btn"
                onClick={() => setShowCancelModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="pakh-modal-body">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                  Lý do hủy <span style={{ color: '#ee0033' }}>*</span>
                </label>
                <textarea 
                  className="issue-field-textarea"
                  rows={4}
                  placeholder="Nhập cụ thể lý do hủy phản ánh khách hàng..."
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (e.target.value.trim()) setCancelReasonError('');
                  }}
                  autoFocus
                />
                {cancelReasonError && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
                    {cancelReasonError}
                  </p>
                )}
              </div>
            </div>

            <div className="pakh-modal-footer">
              <button 
                type="button" 
                className="pakh-modal-btn-cancel"
                onClick={() => setShowCancelModal(false)}
              >
                Bỏ qua
              </button>
              <button 
                type="button" 
                className="pakh-modal-btn-confirm"
                onClick={handleConfirmCancel}
              >
                <XCircle size={16} />
                <span>Xác nhận hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
