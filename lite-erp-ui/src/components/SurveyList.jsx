import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Settings,
  MoreVertical,
  CheckCircle2,
  Clock,
  PauseCircle,
  Archive,
  ListOrdered,
  ListCheck,
  ListTodo,
  MessageSquareHeart,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Check,
  RotateCcw,
  Share2,
  PlayCircle,
  SlidersHorizontal,
  X,
  Layers,
  List,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import './Surveylist.css';

// Initial survey dataset matching the mockup design with contracts and survey types
const INITIAL_SURVEYS = [
  {
    id: 'SRV-001',
    title: 'Khảo sát dịch vụ FO tháng 8/2026',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/VT-FO01',
    contractName: 'Hợp đồng Vận hành FO Viettel',
    description: 'Đánh giá chất lượng dịch vụ vận hành khai thác (FO) và xử lý sự cố hạ tầng',
    creator: { name: 'Lyn', initial: 'L', color: '#7c3aed', bg: '#f3e8ff' },
    status: 'active',
    statusLabel: 'Đang hoạt động',
    questionsCount: 12,
    completed: 128,
    target: 200,
    completionRate: 64,
    createdDate: '27/08/2026',
    iconType: 'purple-list'
  },
  {
    id: 'SRV-002',
    title: 'Khảo sát dịch vụ Bán hàng tháng 7/2026',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/MB-BH02',
    contractName: 'Hợp đồng Dịch vụ Bán hàng MB',
    description: 'Khảo sát trải nghiệm tiếp xúc, tư vấn và quy trình bán hàng',
    creator: { name: 'Anh Tuấn', initial: 'A', color: '#2563eb', bg: '#dbeafe' },
    status: 'active',
    statusLabel: 'Đang hoạt động',
    questionsCount: 10,
    completed: 85,
    target: 150,
    completionRate: 57,
    createdDate: '25/08/2026',
    iconType: 'teal-list'
  },
  {
    id: 'SRV-003',
    title: 'Khảo sát chất lượng vận hành FO tháng 6/2026',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/VNM-FO03',
    contractName: 'Hợp đồng Vận hành FO Vinamilk',
    description: 'Đánh giá SLA và mức độ đáp ứng hạ tầng kỹ thuật dịch vụ FO',
    creator: { name: 'Phương Linh', initial: 'P', color: '#059669', bg: '#d1fae5' },
    status: 'active',
    statusLabel: 'Đang hoạt động',
    questionsCount: 15,
    completed: 66,
    target: 120,
    completionRate: 55,
    createdDate: '22/08/2026',
    iconType: 'pink-chat'
  },
  {
    id: 'SRV-004',
    title: 'Khảo sát sau bán hàng dịch vụ FO tháng 5/2026',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/BIDV-FO04',
    contractName: 'Hợp đồng FO BIDV Cloud',
    description: 'Thu thập ý kiến sau khi khách hàng sử dụng dịch vụ vận hành FO',
    creator: { name: 'Lyn', initial: 'L', color: '#7c3aed', bg: '#f3e8ff' },
    status: 'paused',
    statusLabel: 'Tạm dừng',
    questionsCount: 8,
    completed: 42,
    target: 100,
    completionRate: 42,
    createdDate: '15/08/2026',
    iconType: 'amber-clock'
  },
  {
    id: 'SRV-005',
    title: 'Khảo sát sự kiện giới thiệu giải pháp Bán hàng & FO',
    surveyType: 'Thường',
    contractCode: 'HĐ-2026/VTB-BH05',
    contractName: 'Hợp đồng Hội thảo Giải pháp',
    description: 'Đánh giá mức độ hài lòng về chương trình hội thảo giải pháp FO & Bán hàng',
    creator: { name: 'Anh Tuấn', initial: 'A', color: '#2563eb', bg: '#dbeafe' },
    status: 'archived',
    statusLabel: 'Đã lưu trữ',
    questionsCount: 7,
    completed: 200,
    target: 200,
    completionRate: 100,
    createdDate: '10/08/2026',
    iconType: 'blue-cal'
  },
  {
    id: 'SRV-006',
    title: 'Khảo sát nội bộ đội ngũ kỹ thuật FO & Kinh doanh',
    surveyType: 'Định kỳ',
    contractCode: 'Nội bộ',
    contractName: 'Khảo sát nội bộ FO - Bán hàng',
    description: 'Đánh giá mức độ gắn kết và phối hợp giữa khối FO và Bán hàng',
    creator: { name: 'Phương Linh', initial: 'P', color: '#059669', bg: '#d1fae5' },
    status: 'archived',
    statusLabel: 'Đã lưu trữ',
    questionsCount: 20,
    completed: 200,
    target: 200,
    completionRate: 100,
    createdDate: '01/08/2026',
    iconType: 'purple-star'
  },
  {
    id: 'SRV-007',
    title: 'Khảo sát nhu cầu tính năng cổng portal FO Q3/2026',
    surveyType: 'Thường',
    contractCode: 'HĐ-2026/FPT-FO06',
    contractName: 'Hợp đồng Nâng cấp FO FPT',
    description: 'Tổng hợp phản hồi về tính năng giám sát FO và ticket bán hàng',
    creator: { name: 'Lyn', initial: 'L', color: '#7c3aed', bg: '#f3e8ff' },
    status: 'active',
    statusLabel: 'Đang hoạt động',
    questionsCount: 14,
    completed: 92,
    target: 160,
    completionRate: 58,
    createdDate: '20/07/2026',
    iconType: 'purple-list'
  },
  {
    id: 'SRV-008',
    title: 'Khảo sát Onboarding quy trình Bán hàng doanh nghiệp',
    surveyType: 'Thường',
    contractCode: 'HĐ-2026/TCB-BH07',
    contractName: 'Hợp đồng Tư vấn Bán hàng TCB',
    description: 'Đánh giá quy trình tiếp nhận và bàn giao nghiệp vụ bán hàng',
    creator: { name: 'Anh Tuấn', initial: 'A', color: '#2563eb', bg: '#dbeafe' },
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    questionsCount: 16,
    completed: 150,
    target: 150,
    completionRate: 100,
    createdDate: '15/07/2026',
    iconType: 'teal-list'
  },
  {
    id: 'SRV-009',
    title: 'Khảo sát SLA hỗ trợ kỹ thuật FO định kỳ',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/VPB-FO08',
    contractName: 'Hợp đồng SLA FO VPBank',
    description: 'Đánh giá tốc độ phản hồi và chất lượng xử lý sự cố FO',
    creator: { name: 'Phương Linh', initial: 'P', color: '#059669', bg: '#d1fae5' },
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    questionsCount: 10,
    completed: 120,
    target: 120,
    completionRate: 100,
    createdDate: '10/07/2026',
    iconType: 'pink-chat'
  },
  {
    id: 'SRV-010',
    title: 'Khảo sát chất lượng đào tạo nghiệp vụ Bán hàng mới',
    surveyType: 'Thường',
    contractCode: 'Nội bộ',
    contractName: 'Đào tạo kỹ năng Bán hàng',
    description: 'Đánh giá giáo trình và kỹ năng tư vấn giải pháp bán hàng',
    creator: { name: 'Lyn', initial: 'L', color: '#7c3aed', bg: '#f3e8ff' },
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    questionsCount: 18,
    completed: 80,
    target: 80,
    completionRate: 100,
    createdDate: '05/07/2026',
    iconType: 'amber-clock'
  },
  {
    id: 'SRV-011',
    title: 'Khảo sát đối tác cung cấp hạ tầng trạm FO',
    surveyType: 'Định kỳ',
    contractCode: 'HĐ-2026/VNPT-FO09',
    contractName: 'Hợp đồng Hạ tầng trạm FO',
    description: 'Đánh giá chất lượng đường truyền và hạ tầng trạm FO',
    creator: { name: 'Anh Tuấn', initial: 'A', color: '#2563eb', bg: '#dbeafe' },
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    questionsCount: 12,
    completed: 50,
    target: 50,
    completionRate: 100,
    createdDate: '28/06/2026',
    iconType: 'blue-cal'
  },
  {
    id: 'SRV-012',
    title: 'Khảo sát an toàn thông tin hệ thống FO & Bán hàng 2026',
    surveyType: 'Định kỳ',
    contractCode: 'Nội bộ',
    contractName: 'An toàn thông tin FO & Bán hàng',
    description: 'Kiểm tra nhận thức an ninh mạng trong vận hành FO và dữ liệu bán hàng',
    creator: { name: 'Phương Linh', initial: 'P', color: '#059669', bg: '#d1fae5' },
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    questionsCount: 25,
    completed: 300,
    target: 300,
    completionRate: 100,
    createdDate: '20/06/2026',
    iconType: 'purple-star'
  }
];

// Participants mock grouped by survey (as shown in reference screenshot)
const INITIAL_PARTICIPANT_GROUPS = [
  {
    id: 'grp-1',
    surveyName: 'Biểu mẫu phản hồi',
    avgScore: '0,00',
    count: 2,
    children: [
      {
        id: 'PT-001',
        createdAt: '27/08/2026 10:15',
        surveyName: 'Biểu mẫu phản hồi',
        contact: 'Nguyễn Văn An',
        company: 'Công ty Cổ phần Công nghệ ABC',
        email: 'an.nv@abc.com.vn',
        attempts: 1,
        deadline: '30/08/2026',
        quizPassed: true,
        score: '85,00',
        status: 'completed',
        statusLabel: 'Đã hoàn thành'
      },
      {
        id: 'PT-002',
        createdAt: '26/08/2026 14:20',
        surveyName: 'Biểu mẫu phản hồi',
        contact: 'Trần Thị Mai',
        company: 'Tập đoàn Đầu tư XYZ',
        email: 'mai.tt@xyz.vn',
        attempts: 1,
        deadline: '30/08/2026',
        quizPassed: false,
        score: '0,00',
        status: 'in_progress',
        statusLabel: 'Đang làm'
      }
    ]
  },
  {
    id: 'grp-2',
    surveyName: 'Khảo sát KH',
    avgScore: '0,00',
    count: 1,
    children: [
      {
        id: 'PT-003',
        createdAt: '25/08/2026 09:00',
        surveyName: 'Khảo sát KH',
        contact: 'Lê Hoàng Long',
        company: 'Tổng công ty Viễn thông Viettel',
        email: 'longlh@viettel.com.vn',
        attempts: 1,
        deadline: '31/08/2026',
        quizPassed: true,
        score: '95,00',
        status: 'completed',
        statusLabel: 'Đã hoàn thành'
      }
    ]
  }
];

export default function Surveylist() {
  const navigate = useNavigate();

  // Navigation top tabs
  const [topTab, setTopTab] = useState('surveys'); // 'surveys' | 'participants' | 'qa'

  // Surveys state (Tab 1)
  const [surveys, setSurveys] = useState(INITIAL_SURVEYS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [surveyTypeFilter, setSurveyTypeFilter] = useState('all');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name' | 'rate'

  // Participants state (Tab 2)
  const [participantGroups, setParticipantGroups] = useState(INITIAL_PARTICIPANT_GROUPS);
  const [expandedGroups, setExpandedGroups] = useState(['grp-1', 'grp-2']);
  const [hasFacetChip, setHasFacetChip] = useState(true);
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantViewMode, setParticipantViewMode] = useState('list'); // 'list' | 'kanban'
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);

  // Dropdowns & popovers state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Pagination for Tab 1
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Close menus on outside click
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Metrics computation for Tab 1
  const metrics = useMemo(() => {
    const total = surveys.length;
    const completed = surveys.filter(s => s.status === 'completed' || s.completionRate === 100).length;
    const active = surveys.filter(s => s.status === 'active').length;
    const paused = surveys.filter(s => s.status === 'paused').length;
    const archived = surveys.filter(s => s.status === 'archived').length;
    return { total, completed, active, paused, archived };
  }, [surveys]);

  // Filtered & sorted surveys (Tab 1)
  const processedSurveys = useMemo(() => {
    let result = surveys.filter(item => {
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.surveyType && item.surveyType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.contractCode && item.contractCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.contractName && item.contractName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.creator.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter ||
        (statusFilter === 'completed' && item.completionRate === 100);

      const matchesType =
        surveyTypeFilter === 'all' || item.surveyType === surveyTypeFilter;

      const matchesCreator =
        creatorFilter === 'all' || item.creator.name === creatorFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCreator;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'rate') return b.completionRate - a.completionRate;
      return 0;
    });

    return result;
  }, [surveys, searchTerm, statusFilter, surveyTypeFilter, creatorFilter, sortBy]);

  // Pagination calculation for Tab 1
  const totalPages = Math.ceil(processedSurveys.length / pageSize) || 1;
  const paginatedSurveys = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedSurveys.slice(start, start + pageSize);
  }, [processedSurveys, currentPage, pageSize]);

  // Selection handlers (Tab 1)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedSurveys.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedSurveys.length > 0 &&
    paginatedSurveys.every(s => selectedIds.includes(s.id));

  // Action handlers
  const handleCopyLink = (survey) => {
    const link = `${window.location.origin}/survey/respond/${survey.id}`;
    navigator.clipboard?.writeText(link);
    showToast(`Đã sao chép liên kết khảo sát ${survey.id}!`);
  };

  const handleDelete = (surveyId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khảo sát này?')) {
      setSurveys(prev => prev.filter(s => s.id !== surveyId));
      setSelectedIds(prev => prev.filter(id => id !== surveyId));
      showToast('Đã xóa khảo sát thành công');
    }
  };

  // Participant Accordion Toggle (Tab 2)
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSelectParticipant = (id) => {
    setSelectedParticipantIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Helper icon renderer
  const renderSurveyIcon = (iconType) => {
    switch (iconType) {
      case 'purple-list':
        return (
          <div className="survey-icon-badge badge-red">
            <ListCheck size={18} />
          </div>
        );
      case 'teal-list':
        return (
          <div className="survey-icon-badge badge-teal">
            <ListTodo size={18} />
          </div>
        );
      case 'pink-chat':
        return (
          <div className="survey-icon-badge badge-pink">
            <MessageSquareHeart size={18} />
          </div>
        );
      case 'amber-clock':
        return (
          <div className="survey-icon-badge badge-amber">
            <Clock size={18} />
          </div>
        );
      case 'blue-cal':
        return (
          <div className="survey-icon-badge badge-blue">
            <Calendar size={18} />
          </div>
        );
      case 'purple-star':
      default:
        return (
          <div className="survey-icon-badge badge-star">
            <Star size={18} />
          </div>
        );
    }
  };

  // Helper progress color
  const getProgressFillClass = (status, rate) => {
    if (rate === 100 || status === 'archived') return 'progress-slate';
    if (status === 'paused') return 'progress-amber';
    return 'progress-green';
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'newest': return 'Sắp xếp: Mới nhất';
      case 'oldest': return 'Sắp xếp: Cũ nhất';
      case 'name': return 'Sắp xếp: Tên A-Z';
      case 'rate': return 'Sắp xếp: Tỷ lệ cao';
      default: return 'Sắp xếp: Mới nhất';
    }
  };

  // Filtered participant groups (Tab 2)
  const filteredParticipantGroups = useMemo(() => {
    if (!participantSearch) return participantGroups;
    return participantGroups
      .map(grp => {
        const matchingChildren = grp.children.filter(
          c =>
            c.contact.toLowerCase().includes(participantSearch.toLowerCase()) ||
            c.email.toLowerCase().includes(participantSearch.toLowerCase()) ||
            c.company.toLowerCase().includes(participantSearch.toLowerCase()) ||
            grp.surveyName.toLowerCase().includes(participantSearch.toLowerCase())
        );
        if (matchingChildren.length > 0) {
          return { ...grp, children: matchingChildren, count: matchingChildren.length };
        }
        return null;
      })
      .filter(Boolean);
  }, [participantGroups, participantSearch]);

  return (
    <div className="survey-page-container">
      <div className="survey-inner-content">
        
        {/* PAGE TITLE */}
        <h1 className="survey-page-title">Quản lý khảo sát khách hàng</h1>

        {/* ================= TOP NAVIGATION BAR ================= */}
        <div className="survey-top-nav-bar">
          <div className="survey-top-tabs">
            <div
              className={`survey-top-tab-item ${topTab === 'surveys' ? 'active' : ''}`}
              onClick={() => setTopTab('surveys')}
            >
              Khảo sát
            </div>
            <div
              className={`survey-top-tab-item ${topTab === 'participants' ? 'active' : ''}`}
              onClick={() => setTopTab('participants')}
            >
              Người tham gia
            </div>
            <div
              className={`survey-top-tab-item ${topTab === 'qa' ? 'active' : ''}`}
              onClick={() => setTopTab('qa')}
            >
              Câu hỏi và trả lời
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: KHẢO SÁT (SURVEYS LIST)                                            */}
        {/* ========================================================================= */}
        {topTab === 'surveys' && (
          <>
            {/* ACTION TOOLBAR ROW */}
            <div className="survey-header-row">
              <div className="survey-toolbar-left">
                {/* Search Box */}
                <div className="survey-search-box">
                  <Search size={16} color="#94a3b8" />
                  <input
                    type="text"
                    className="survey-search-input"
                    placeholder="Tìm kiếm khảo sát..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="survey-header-actions">
                {/* Advanced Search / Filter Button */}
                <div style={{ position: 'relative' }} ref={filterRef}>
                  <button
                    className={`survey-btn-advanced-search ${showFilterDropdown || statusFilter !== 'all' || surveyTypeFilter !== 'all' || creatorFilter !== 'all' ? 'active' : ''}`}
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Filter size={15} />
                    <span>Tìm kiếm nâng cao</span>
                  </button>

                  {showFilterDropdown && (
                    <div className="survey-filter-box">
                      <h4 className="survey-filter-title">Tìm kiếm nâng cao</h4>
                      
                      <div className="survey-filter-group">
                        <label className="survey-filter-label">Loại khảo sát</label>
                        <select
                          className="survey-filter-select"
                          value={surveyTypeFilter}
                          onChange={(e) => {
                            setSurveyTypeFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">Tất cả loại khảo sát</option>
                          <option value="Định kỳ">Định kỳ</option>
                          <option value="Thường">Thường</option>
                        </select>
                      </div>

                      <div className="survey-filter-group">
                        <label className="survey-filter-label">Trạng thái</label>
                        <select
                          className="survey-filter-select"
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="active">Đang hoạt động</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="paused">Tạm dừng</option>
                          <option value="archived">Đã lưu trữ</option>
                        </select>
                      </div>

                      <div className="survey-filter-group">
                        <label className="survey-filter-label">Người tạo</label>
                        <select
                          className="survey-filter-select"
                          value={creatorFilter}
                          onChange={(e) => {
                            setCreatorFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">Tất cả người tạo</option>
                          <option value="Lyn">Lyn</option>
                          <option value="Anh Tuấn">Anh Tuấn</option>
                          <option value="Phương Linh">Phương Linh</option>
                        </select>
                      </div>

                      <div className="survey-filter-actions">
                        <button
                          className="survey-filter-btn-reset"
                          onClick={() => {
                            setStatusFilter('all');
                            setSurveyTypeFilter('all');
                            setCreatorFilter('all');
                            setShowFilterDropdown(false);
                          }}
                        >
                          Đặt lại
                        </button>
                        <button
                          className="survey-filter-btn-apply"
                          onClick={() => setShowFilterDropdown(false)}
                        >
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div style={{ position: 'relative' }} ref={sortRef}>
                  <button
                    className="survey-btn-secondary"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <ArrowUpDown size={15} />
                    <span>{getSortLabel()}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>▼</span>
                  </button>

                  {showSortDropdown && (
                    <div className="survey-popover-menu">
                      <div
                        className="survey-popover-item"
                        onClick={() => {
                          setSortBy('newest');
                          setShowSortDropdown(false);
                        }}
                      >
                        {sortBy === 'newest' && <Check size={14} color="#ee0033" />}
                        <span>Mới nhất</span>
                      </div>
                      <div
                        className="survey-popover-item"
                        onClick={() => {
                          setSortBy('oldest');
                          setShowSortDropdown(false);
                        }}
                      >
                        {sortBy === 'oldest' && <Check size={14} color="#ee0033" />}
                        <span>Cũ nhất</span>
                      </div>
                      <div
                        className="survey-popover-item"
                        onClick={() => {
                          setSortBy('name');
                          setShowSortDropdown(false);
                        }}
                      >
                        {sortBy === 'name' && <Check size={14} color="#ee0033" />}
                        <span>Tên khảo sát (A-Z)</span>
                      </div>
                      <div
                        className="survey-popover-item"
                        onClick={() => {
                          setSortBy('rate');
                          setShowSortDropdown(false);
                        }}
                      >
                        {sortBy === 'rate' && <Check size={14} color="#ee0033" />}
                        <span>Tỷ lệ hoàn thành cao</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Survey Button */}
                <button
                  className="survey-btn-primary"
                  onClick={() => navigate('/survey/new')}
                >
                  <Plus size={16} />
                  <span>Tạo khảo sát</span>
                </button>
              </div>
            </div>

            {/* METRICS STAT CARDS */}
            <div className="survey-metrics-grid">
              <div
                className={`survey-metric-card ${statusFilter === 'all' ? 'active-filter' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <div className="survey-metric-icon-box icon-red">
                  <ListOrdered size={22} />
                </div>
                <div className="survey-metric-info">
                  <span className="survey-metric-label">Tổng khảo sát</span>
                  <span className="survey-metric-value">{metrics.total}</span>
                </div>
              </div>

              <div
                className={`survey-metric-card ${statusFilter === 'completed' ? 'active-filter' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
              >
                <div className="survey-metric-icon-box icon-green">
                  <CheckCircle2 size={22} />
                </div>
                <div className="survey-metric-info">
                  <span className="survey-metric-label">Đã hoàn thành</span>
                  <span className="survey-metric-value">{metrics.completed}</span>
                </div>
              </div>

              <div
                className={`survey-metric-card ${statusFilter === 'active' ? 'active-filter' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
              >
                <div className="survey-metric-icon-box icon-amber">
                  <Clock size={22} />
                </div>
                <div className="survey-metric-info">
                  <span className="survey-metric-label">Đang hoạt động</span>
                  <span className="survey-metric-value">{metrics.active}</span>
                </div>
              </div>

              <div
                className={`survey-metric-card ${statusFilter === 'paused' ? 'active-filter' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'paused' ? 'all' : 'paused')}
              >
                <div className="survey-metric-icon-box icon-blue">
                  <PauseCircle size={22} />
                </div>
                <div className="survey-metric-info">
                  <span className="survey-metric-label">Tạm dừng</span>
                  <span className="survey-metric-value">{metrics.paused}</span>
                </div>
              </div>

              <div
                className={`survey-metric-card ${statusFilter === 'archived' ? 'active-filter' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'archived' ? 'all' : 'archived')}
              >
                <div className="survey-metric-icon-box icon-rose">
                  <Archive size={22} />
                </div>
                <div className="survey-metric-info">
                  <span className="survey-metric-label">Đã lưu trữ</span>
                  <span className="survey-metric-value">{metrics.archived}</span>
                </div>
              </div>
            </div>

            {/* MAIN DATA TABLE */}
            <div className="survey-table-card">
              <div className="survey-table-responsive">
                <table className="survey-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input
                          type="checkbox"
                          className="survey-checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th style={{ minWidth: '280px' }}>Tên khảo sát</th>
                      <th>Loại khảo sát</th>
                      <th>Hợp đồng</th>
                      <th style={{ minWidth: '260px' }}>Mô tả</th>
                      <th>Người tạo</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'center' }}>Số câu hỏi</th>
                      <th style={{ minWidth: '160px' }}>Đã hoàn thành</th>
                      <th>Ngày tạo</th>
                      <th style={{ textAlign: 'center', minWidth: '350px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSurveys.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
                          <RotateCcw size={28} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.5 }} />
                          Không tìm thấy khảo sát nào phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    ) : (
                      paginatedSurveys.map((survey) => {
                        const isSelected = selectedIds.includes(survey.id);

                        return (
                          <tr key={survey.id} className={isSelected ? 'selected' : ''}>
                            {/* Checkbox */}
                            <td>
                              <input
                                type="checkbox"
                                className="survey-checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectOne(survey.id)}
                              />
                            </td>

                            {/* Title without Icon */}
                            <td>
                              <div className="survey-title-cell">
                                <span
                                  className="survey-title-text"
                                  onClick={() => navigate(`/survey/edit/${survey.id}`)}
                                >
                                  {survey.title}
                                </span>
                              </div>
                            </td>

                            {/* Survey Type: Định kỳ / Thường */}
                            <td>
                              <span
                                className={`survey-type-badge ${
                                  survey.surveyType === 'Định kỳ' ? 'type-periodic' : 'type-regular'
                                }`}
                              >
                                {survey.surveyType || 'Thường'}
                              </span>
                            </td>

                            {/* Contract */}
                            <td>
                              <div className="survey-contract-cell">
                                <span className="survey-contract-code">{survey.contractCode}</span>
                                {survey.contractName && survey.contractCode !== 'Nội bộ' && (
                                  <span className="survey-contract-name">{survey.contractName}</span>
                                )}
                              </div>
                            </td>

                            {/* Description */}
                            <td>
                              <div className="survey-desc-cell" title={survey.description}>
                                {survey.description}
                              </div>
                            </td>

                            {/* Creator */}
                            <td>
                              <div className="survey-creator-cell">
                                <div
                                  className="survey-avatar"
                                  style={{ backgroundColor: survey.creator.color }}
                                >
                                  {survey.creator.initial}
                                </div>
                                <span className="survey-creator-name">{survey.creator.name}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`survey-status-badge ${
                                  survey.status === 'active'
                                    ? 'status-active'
                                    : survey.status === 'paused'
                                    ? 'status-paused'
                                    : survey.status === 'completed'
                                    ? 'status-completed'
                                    : 'status-archived'
                                }`}
                              >
                                {survey.statusLabel}
                              </span>
                            </td>

                            {/* Question Count */}
                            <td className="survey-count-cell">{survey.questionsCount}</td>

                            {/* Completed Progress */}
                            <td>
                              <div className="survey-progress-cell">
                                <div className="survey-progress-header">
                                  <span className="survey-progress-fraction">
                                    {survey.completed} / {survey.target}
                                  </span>
                                  <span className="survey-progress-percent">
                                    {survey.completionRate}%
                                  </span>
                                </div>
                                <div className="survey-progress-track">
                                  <div
                                    className={`survey-progress-fill ${getProgressFillClass(
                                      survey.status,
                                      survey.completionRate
                                    )}`}
                                    style={{ width: `${survey.completionRate}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Created Date */}
                            <td className="survey-date-cell">{survey.createdDate}</td>

                            {/* Actions: Chia sẻ, Làm khảo sát, Xem kết quả, Xoá */}
                            <td>
                              <div className="survey-actions-cell">
                                <button
                                  className="survey-btn-share"
                                  onClick={() => handleCopyLink(survey)}
                                  title="Sao chép link chia sẻ"
                                >
                                  <Share2 size={13} />
                                  <span>Chia sẻ</span>
                                </button>

                                <button
                                  className="survey-btn-take"
                                  onClick={() => navigate(`/survey/edit/${survey.id}`)}
                                  title="Thực hiện làm khảo sát"
                                >
                                  <PlayCircle size={14} />
                                  <span>Làm khảo sát</span>
                                </button>

                                <button
                                  className="survey-btn-results"
                                  onClick={() => {
                                    setTopTab('participants');
                                    setParticipantSearch(survey.title);
                                    showToast(`Đang hiển thị kết quả khảo sát: ${survey.id}`);
                                  }}
                                  title="Xem kết quả và thống kê người tham gia"
                                >
                                  <BarChart3 size={13} />
                                  <span>Xem kết quả</span>
                                </button>

                                <button
                                  className="survey-btn-delete-icon"
                                  onClick={() => handleDelete(survey.id)}
                                  title="Xóa khảo sát"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE PAGINATION FOOTER */}
              <div className="survey-pagination-bar">
                <div className="survey-page-size-selector">
                  <span>Hiển thị</span>
                  <select
                    className="survey-select-pagesize"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>khảo sát mỗi trang</span>
                </div>

                <div className="survey-pagination-controls">
                  <span className="survey-page-range-text">
                    {processedSurveys.length === 0
                      ? '0 - 0 / 0'
                      : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                          currentPage * pageSize,
                          processedSurveys.length
                        )} / ${processedSurveys.length}`}
                  </span>

                  <div className="survey-pagination-buttons">
                    <button
                      className="survey-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      title="Trang đầu"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    <button
                      className="survey-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      title="Trang trước"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`survey-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className="survey-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      title="Trang sau"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      className="survey-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      title="Trang cuối"
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: NGƯỜI THAM GIA (PARTICIPANTS VIEW ACCORDION TREE GRID)              */}
        {/* ========================================================================= */}
        {topTab === 'participants' && (
          <div className="participants-view-container">
            {/* Top Toolbar matching screenshot */}
            <div className="participants-top-toolbar">
              <div className="participants-title-box">
                <h2 className="participants-title">Người tham gia</h2>
                <button className="participants-gear-btn" title="Cấu hình danh sách người tham gia">
                  <Settings size={16} />
                </button>
              </div>

              {/* Facet Search Box */}
              <div className="participants-facet-search-box">
                <Search size={16} color="#94a3b8" />
                {hasFacetChip && (
                  <div className="facet-chip">
                    <Layers size={13} />
                    <span>Khảo sát</span>
                    <button
                      className="facet-chip-close"
                      onClick={() => setHasFacetChip(false)}
                      title="Bỏ nhóm theo khảo sát"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  className="participants-search-input"
                  placeholder="Tìm kiếm..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                />
                <button className="participants-search-dropdown-btn" title="Tùy chọn lọc">
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* View switchers & Pager */}
              <div className="participants-view-controls">
                <span className="participants-pager-text">1-2 / 2</span>
                <div className="participants-pager-btns">
                  <button className="participants-pager-btn" title="Trang trước">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="participants-pager-btn" title="Trang sau">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="participants-switch-btns">
                  <button
                    className={`participants-switch-btn ${participantViewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setParticipantViewMode('list')}
                    title="Dạng danh sách"
                  >
                    <List size={16} />
                  </button>
                  <button
                    className={`participants-switch-btn ${participantViewMode === 'kanban' ? 'active' : ''}`}
                    onClick={() => setParticipantViewMode('kanban')}
                    title="Dạng biểu đồ / Kanban"
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Participants Tree Grid Table */}
            <div className="participants-table-card">
              <div className="survey-table-responsive">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th style={{ width: '36px' }}>
                        <input type="checkbox" className="survey-checkbox" />
                      </th>
                      <th style={{ minWidth: '180px' }}>Được tạo vào</th>
                      <th style={{ minWidth: '160px' }}>Khảo sát</th>
                      <th style={{ minWidth: '180px' }}>Liên hệ</th>
                      <th style={{ minWidth: '180px' }}>Email</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Lượt làm</th>
                      <th style={{ minWidth: '110px' }}>Thời hạn</th>
                      <th style={{ minWidth: '110px', textAlign: 'center' }}>Quiz Passed</th>
                      <th style={{ minWidth: '100px', textAlign: 'right' }}>Điểm (%)</th>
                      <th style={{ minWidth: '120px' }}>Trạng thái</th>
                      <th style={{ minWidth: '130px', textAlign: 'right' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          Số tập dữ liệu
                          <SlidersHorizontal size={14} color="#64748b" style={{ cursor: 'pointer' }} />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipantGroups.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                          Không tìm thấy người tham gia nào.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipantGroups.map((group) => {
                        const isExpanded = expandedGroups.includes(group.id);

                        return (
                          <React.Fragment key={group.id}>
                            {/* Accordion Group Row Header */}
                            <tr
                              className="participant-group-header-row"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  className="survey-checkbox"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td colSpan={7}>
                                <div className="group-toggle-title">
                                  {isExpanded ? (
                                    <ChevronDown size={16} className="group-arrow-icon" />
                                  ) : (
                                    <ChevronRight size={16} className="group-arrow-icon" />
                                  )}
                                  <span>{group.surveyName}</span>
                                </div>
                              </td>
                              <td className="group-score-val">{group.avgScore}</td>
                              <td></td>
                              <td className="group-count-val">{group.count}</td>
                            </tr>

                            {/* Expanded Children Records */}
                            {isExpanded &&
                              group.children.map((child) => {
                                const isChildSelected = selectedParticipantIds.includes(child.id);

                                return (
                                  <tr key={child.id} className="participant-child-row">
                                    <td>
                                      <input
                                        type="checkbox"
                                        className="survey-checkbox"
                                        checked={isChildSelected}
                                        onChange={() => handleSelectParticipant(child.id)}
                                      />
                                    </td>
                                    <td style={{ color: '#475569' }}>{child.createdAt}</td>
                                    <td style={{ color: '#64748b' }}>{child.surveyName}</td>
                                    <td>
                                      <div className="participant-contact-info">
                                        <span className="participant-contact-name">{child.contact}</span>
                                        <span className="participant-contact-comp">{child.company}</span>
                                      </div>
                                    </td>
                                    <td style={{ color: '#3b82f6', fontWeight: 500 }}>{child.email}</td>
                                    <td style={{ textAlign: 'center' }}>{child.attempts}</td>
                                    <td style={{ color: '#64748b' }}>{child.deadline}</td>
                                    <td style={{ textAlign: 'center' }}>
                                      {child.quizPassed ? (
                                        <span className="quiz-passed-badge">
                                          <Check size={14} /> Đạt
                                        </span>
                                      ) : (
                                        <span className="quiz-failed-badge">-</span>
                                      )}
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                                      {child.score}
                                    </td>
                                    <td>
                                      <span
                                        className={`survey-status-badge ${
                                          child.status === 'completed'
                                            ? 'status-active'
                                            : child.status === 'in_progress'
                                            ? 'status-paused'
                                            : 'status-archived'
                                        }`}
                                      >
                                        {child.statusLabel}
                                      </span>
                                    </td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CÂU HỎI VÀ TRẢ LỜI (Q&A LIST VIEW)                                 */}
        {/* ========================================================================= */}
        {topTab === 'qa' && (
          <div className="participants-view-container">
            <div className="participants-top-toolbar">
              <div className="participants-title-box">
                <h2 className="participants-title">Ngân hàng câu hỏi & câu trả lời</h2>
              </div>
              <button className="survey-btn-primary" onClick={() => showToast('Mở trình soạn thảo câu hỏi')}>
                <Plus size={16} />
                <span>Thêm câu hỏi mới</span>
              </button>
            </div>

            <div className="participants-table-card">
              <div className="survey-table-responsive">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>STT</th>
                      <th>Câu hỏi</th>
                      <th>Loại câu hỏi</th>
                      <th>Khảo sát áp dụng</th>
                      <th>Bắt buộc</th>
                      <th>Số lượt trả lời</th>
                      <th style={{ textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>Đánh giá mức độ hài lòng chung về chất lượng dịch vụ?</td>
                      <td><span className="survey-status-badge status-active">Đánh giá sao (1-5)</span></td>
                      <td>Khảo sát hài lòng khách hàng tháng 8/2026</td>
                      <td><span style={{ color: '#ee0033', fontWeight: 600 }}>Có</span></td>
                      <td>128</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="survey-btn-share" onClick={() => showToast('Xem chi tiết câu hỏi')}>Xem</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>Bạn có sẵn sàng giới thiệu dịch vụ này cho đối tác không?</td>
                      <td><span className="survey-status-badge status-paused">NPS (0-10)</span></td>
                      <td>Biểu mẫu phản hồi</td>
                      <td><span style={{ color: '#ee0033', fontWeight: 600 }}>Có</span></td>
                      <td>85</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="survey-btn-share" onClick={() => showToast('Xem chi tiết câu hỏi')}>Xem</button>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>Ý kiến đóng góp cải tiến sản phẩm / giải pháp?</td>
                      <td><span className="survey-status-badge status-archived">Văn bản tự do</span></td>
                      <td>Khảo sát KH</td>
                      <td><span>Không</span></td>
                      <td>66</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="survey-btn-share" onClick={() => showToast('Xem chi tiết câu hỏi')}>Xem</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            fontSize: '13.5px',
            fontWeight: 500,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
