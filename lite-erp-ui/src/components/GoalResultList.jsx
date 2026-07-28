import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  HelpCircle,
  RefreshCw,
  Edit3,
  CheckCircle,
  Users,
  Building2,
  Globe,
  BarChart2
} from 'lucide-react';
import './GoalResultList.css';
import { mockStore } from '../utils/mockStore';

// Database of customer and products
const CUSTOMERS_DB = [
  { id: 'C-01', name: 'Công ty A (Nội bộ VN)', group: 'Khách hàng nội bộ - Tập đoàn trong nước', isNew: false },
  { id: 'C-02', name: 'Tổng công ty B (Nội bộ VN)', group: 'Khách hàng nội bộ - Tập đoàn trong nước', isNew: false },
  { id: 'C-03', name: 'Viettel Telecom (Nội bộ VN)', group: 'Khách hàng nội bộ - Tập đoàn trong nước', isNew: false },
  { id: 'C-04', name: 'Viettel Global (Nội bộ nước ngoài)', group: 'Khách hàng nội bộ - Tập đoàn nước ngoài', isNew: false },
  { id: 'C-05', name: 'Sungroup (Tập đoàn Sun)', group: 'Khách hàng ngoài - Tập đoàn trong nước', isNew: false },
  { id: 'C-06', name: 'Tập đoàn FPT', group: 'Khách hàng ngoài - Tập đoàn trong nước', isNew: true },
  { id: 'C-07', name: 'Tập đoàn Hòa Phát', group: 'Khách hàng ngoài - Tập đoàn trong nước', isNew: false },
  { id: 'C-08', name: 'Tập đoàn Masan', group: 'Khách hàng ngoài - Tập đoàn trong nước', isNew: false },
  { id: 'C-09', name: 'Tập đoàn Vingroup', group: 'Khách hàng ngoài - Tập đoàn trong nước', isNew: true },
  { id: 'C-10', name: 'Singtel International', group: 'Khách hàng ngoài - Tập đoàn nước ngoài', isNew: false },
  { id: 'C-11', name: 'Toyota Motor VN', group: 'Khách hàng ngoài - Tập đoàn nước ngoài', isNew: true }
];

const SPDVS_DB = [
  { id: 'S-01', name: 'Dịch vụ FO', group: 'DV CC outsourcing' },
  { id: 'S-02', name: 'Dịch vụ Tổng đài', group: 'DV CC outsourcing' },
  { id: 'S-03', name: 'OmniX CRM', group: 'Giải pháp, Platform' },
  { id: 'S-04', name: 'AI Chatbot', group: 'Giải pháp, Platform' },
  { id: 'S-05', name: 'Loyalty App', group: 'Giải pháp, Platform' },
  { id: 'S-06', name: 'SaaS Platform', group: 'Dịch vụ Phần mềm' },
  { id: 'S-07', name: 'Smart City Solution', group: 'Dịch vụ Phần mềm' },
  { id: 'S-08', name: 'ERP Customization', group: 'Tích hợp Hệ thống' },
  { id: 'S-09', name: 'Dịch vụ Cloud', group: 'Tích hợp Hệ thống' }
];

// Helper to generate seed values for the matrix database
const generateMatrixValue = (rowId, year, periodKey) => {
  // Deterministic seed based on rowId length, year and period
  const charSum = rowId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const periodNum = periodKey.startsWith('m') ? parseInt(periodKey.substring(1), 10) 
                  : periodKey.startsWith('q') ? parseInt(periodKey.substring(1), 10) * 3
                  : 12;
  
  const baseKH = 100 + (charSum % 7) * 150 + (year === 2025 ? -50 : 0) + periodNum * 15;
  const baseTH = baseKH + (charSum % 5 === 0 ? -40 : (charSum % 3 === 0 ? 80 : 20)) + (periodNum % 2 === 0 ? 30 : -10);

  return {
    kh: Math.max(10, baseKH),
    th: Math.max(0, baseTH)
  };
};

const UNITS = [
  'Phòng Kinh Doanh',
  'Phòng CNKT',
  'Phòng Kỹ Thuật',
  'Phòng Công Nghệ',
  'Phòng Kế Hoạch',
  'Phòng Dự Án',
  'Phòng Giải Pháp',
  'Phòng Dịch Vụ',
  'Phòng Vận Hành',
  'Phòng Khai Thác',
  'Phòng Truyền Thông',
  'Phòng Tài Chính',
  'Phòng Hành Chính',
  'Phòng Nhân Sự',
  'Phòng An Toàn',
  'Phòng Đối Ngoại',
  'Phòng Hợp Tác',
  'Phòng Nghiên Cứu',
  'Phòng Đào Tạo'
];

// Combinations of unit, customer, product to build rows
const MATRIX_ROWS_BASE = [
  // Phòng Kinh Doanh
  { id: 'R-1', unit: 'Phòng Kinh Doanh', customerId: 'C-01', spdvId: 'S-01' },
  { id: 'R-2', unit: 'Phòng Kinh Doanh', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-3', unit: 'Phòng Kinh Doanh', customerId: 'C-05', spdvId: 'S-03' },
  { id: 'R-4', unit: 'Phòng Kinh Doanh', customerId: 'C-10', spdvId: 'S-04' },
  
  // Phòng CNKT
  { id: 'R-5', unit: 'Phòng CNKT', customerId: 'C-01', spdvId: 'S-02' },
  { id: 'R-6', unit: 'Phòng CNKT', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-7', unit: 'Phòng CNKT', customerId: 'C-05', spdvId: 'S-03' },
  { id: 'R-8', unit: 'Phòng CNKT', customerId: 'C-10', spdvId: 'S-05' },

  // Phòng Kỹ Thuật
  { id: 'R-9', unit: 'Phòng Kỹ Thuật', customerId: 'C-01', spdvId: 'S-01' },
  { id: 'R-10', unit: 'Phòng Kỹ Thuật', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-11', unit: 'Phòng Kỹ Thuật', customerId: 'C-05', spdvId: 'S-06' },
  { id: 'R-12', unit: 'Phòng Kỹ Thuật', customerId: 'C-10', spdvId: 'S-08' },

  // Phòng Công Nghệ
  { id: 'R-13', unit: 'Phòng Công Nghệ', customerId: 'C-01', spdvId: 'S-02' },
  { id: 'R-14', unit: 'Phòng Công Nghệ', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-15', unit: 'Phòng Công Nghệ', customerId: 'C-05', spdvId: 'S-07' },
  { id: 'R-16', unit: 'Phòng Công Nghệ', customerId: 'C-10', spdvId: 'S-04' }
];

const CUSTOMER_GROUPS_LIST = [
  'Khách hàng nội bộ - Tập đoàn trong nước',
  'Khách hàng nội bộ - Tập đoàn nước ngoài',
  'Khách hàng ngoài - Tập đoàn trong nước',
  'Khách hàng ngoài - Tập đoàn nước ngoài'
];

const SPDV_GROUPS = [
  'DV CC outsourcing',
  'Giải pháp, Platform',
  'Dịch vụ Phần mềm',
  'Tích hợp Hệ thống'
];

const PERIOD_OPTIONS = [
  { value: 'm1', label: 'Tháng 1' },
  { value: 'm2', label: 'Tháng 2' },
  { value: 'm3', label: 'Tháng 3' },
  { value: 'm4', label: 'Tháng 4' },
  { value: 'm5', label: 'Tháng 5' },
  { value: 'm6', label: 'Tháng 6' },
  { value: 'm7', label: 'Tháng 7' },
  { value: 'm8', label: 'Tháng 8' },
  { value: 'm9', label: 'Tháng 9' },
  { value: 'm10', label: 'Tháng 10' },
  { value: 'm11', label: 'Tháng 11' },
  { value: 'm12', label: 'Tháng 12' },
  { value: 'q1', label: 'Quý 1' },
  { value: 'q2', label: 'Quý 2' },
  { value: 'q3', label: 'Quý 3' },
  { value: 'q4', label: 'Quý 4' },
  { value: 'y', label: 'Cả năm' }
];

const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => (2023 + i).toString());

const getQtyComparison = (khStr, actStr) => {
  if (actStr === undefined || actStr === null || actStr === '') {
    return { diff: '--', percent: '--', diffColor: '#64748b', pctColor: '#64748b' };
  }
  const khVal = parseInt(khStr, 10) || 0;
  const actVal = parseInt(actStr, 10) || 0;
  const diffVal = actVal - khVal;
  const diffText = diffVal > 0 ? `+${diffVal}` : `${diffVal}`;
  const percentVal = khVal > 0 ? Math.round((actVal / khVal) * 100) : 0;
  
  const diffColor = diffVal > 0 ? '#059669' : diffVal < 0 ? '#dc2626' : '#64748b';
  const pctColor = percentVal >= 100 ? '#059669' : '#dc2626';
  
  return {
    diff: diffText,
    percent: `${percentVal}%`,
    diffColor,
    pctColor
  };
};

const getPctComparison = (khStr, actStr) => {
  if (actStr === undefined || actStr === null || actStr === '' || actStr === '--') {
    return { diff: '--', percent: '--', diffColor: '#64748b', pctColor: '#64748b' };
  }
  const khVal = parseFloat(khStr);
  const actVal = parseFloat(actStr);
  if (isNaN(khVal) || isNaN(actVal)) {
    return { diff: '--', percent: '--', diffColor: '#64748b', pctColor: '#64748b' };
  }
  const diffVal = actVal - khVal;
  const diffText = diffVal > 0 ? `+${diffVal.toFixed(1)}%` : `${diffVal.toFixed(1)}%`;
  const percentVal = khVal > 0 ? (actVal / khVal) * 100 : 0;
  
  const diffColor = diffVal > 0 ? '#059669' : diffVal < 0 ? '#dc2626' : '#64748b';
  const pctColor = percentVal >= 100 ? '#059669' : '#dc2626';
  
  return {
    diff: diffText,
    percent: `${percentVal.toFixed(1)}%`,
    diffColor,
    pctColor
  };
};

const GoalResultList = () => {
  const [activeTab, setActiveTab] = useState('ket_qua_doanh_thu');
  const [activePlanTab, setActivePlanTab] = useState('Kế hoạch tập đoàn');
  
  const planCompareText = `Thực hiện so với ${activePlanTab === 'Kế hoạch tập đoàn' ? 'KH Tập đoàn' : 'KH Nội bộ'}`;
  
  // Database state to support dynamic excel imports
  const [dbValues, setDbValues] = useState({});

  // Filters State
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedSPDVGroups, setSelectedSPDVGroups] = useState([]);
  const [selectedSPDVs, setSelectedSPDVs] = useState([]);
  const [isNewCustomerFilter, setIsNewCustomerFilter] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'groups', 'customers', 'spdvGroups', 'spdvs', 'periods' or null
  const [selectedPeriods, setSelectedPeriods] = useState(['m6']); // Default Month 6
  const selectedPeriod = useMemo(() => {
    return selectedPeriods[0] || 'm6';
  }, [selectedPeriods]);
  const [selectedYear, setSelectedYear] = useState('2026'); // Default Year 2026

  // Instant Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort State
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Modals state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTemplate, setExportTemplate] = useState('detail'); // 'detail' or 'summary'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (tabKey) => {
    if (activePlanTab === 'Kế hoạch nội bộ') {
      navigate(`/goals/results?tab=${tabKey === 'ket_qua_doanh_thu' ? 'doanh_thu_noi_bo' : 'san_luong_noi_bo'}`);
    } else {
      navigate(`/goals/results?tab=${tabKey === 'ket_qua_doanh_thu' ? 'doanh_thu_tap_doan' : 'san_luong_tap_doan'}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'doanh_thu_noi_bo') {
      setActiveTab('ket_qua_doanh_thu');
      setActivePlanTab('Kế hoạch nội bộ');
    } else if (tabParam === 'san_luong_tap_doan') {
      setActiveTab('san_luong_nghiem_thu');
      setActivePlanTab('Kế hoạch tập đoàn');
    } else if (tabParam === 'san_luong_noi_bo') {
      setActiveTab('san_luong_nghiem_thu');
      setActivePlanTab('Kế hoạch nội bộ');
    } else {
      // default: doanh_thu_tap_doan
      setActiveTab('ket_qua_doanh_thu');
      setActivePlanTab('Kế hoạch tập đoàn');
    }
    setCurrentPage(1);
  }, [location.search]);

  // Actual values state for the "KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI" table
  const [actualCounts, setActualCounts] = useState(() => {
    const newCust = {
      m1: '30', m2: '32', m3: '35', m4: '38', m5: '40', m6: '37',
      m7: '36', m8: '35', m9: '37', m10: '39', m11: '34', m12: '38'
    };
    const newCont = {
      m1: '50', m2: '45', m3: '32', m4: '58', m5: '40', m6: '35',
      m7: '50', m8: '46', m9: '28', m10: '52', m11: '45', m12: '33'
    };
    return { newCustomerCount: newCust, newContractCount: newCont };
  });

  const handleActualCountChange = (type, monthKey, value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setActualCounts(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [monthKey]: cleanValue
      }
    }));
  };

  const computedActualSummary = useMemo(() => {
    const actCust = { ...actualCounts.newCustomerCount };
    const actCont = { ...actualCounts.newContractCount };

    // Calculate quarters
    for (let q = 1; q <= 4; q++) {
      const mStart = (q - 1) * 3 + 1;
      actCust[`q${q}`] = String(
        (parseInt(actCust[`m${mStart}`], 10) || 0) +
        (parseInt(actCust[`m${mStart + 1}`], 10) || 0) +
        (parseInt(actCust[`m${mStart + 2}`], 10) || 0)
      );
      actCont[`q${q}`] = String(
        (parseInt(actCont[`m${mStart}`], 10) || 0) +
        (parseInt(actCont[`m${mStart + 1}`], 10) || 0) +
        (parseInt(actCont[`m${mStart + 2}`], 10) || 0)
      );
    }

    // Calculate year
    actCust.nam = String(
      Array.from({ length: 12 }, (_, i) => parseInt(actCust[`m${i + 1}`], 10) || 0).reduce((a, b) => a + b, 0)
    );
    actCont.nam = String(
      Array.from({ length: 12 }, (_, i) => parseInt(actCont[`m${i + 1}`], 10) || 0).reduce((a, b) => a + b, 0)
    );

    // Calculate cumulative
    const cumCust = {};
    const cumCont = {};
    let runningCust = 0;
    let runningCont = 0;
    for (let i = 1; i <= 12; i++) {
      runningCust += parseInt(actCust[`m${i}`], 10) || 0;
      runningCont += parseInt(actCont[`m${i}`], 10) || 0;
      cumCust[`m${i}`] = runningCust;
      cumCont[`m${i}`] = runningCont;
    }

    cumCust.q1 = cumCust.m3;
    cumCust.q2 = cumCust.m6;
    cumCust.q3 = cumCust.m9;
    cumCust.q4 = cumCust.m12;

    cumCont.q1 = cumCont.m3;
    cumCont.q2 = cumCont.m6;
    cumCont.q3 = cumCont.m9;
    cumCont.q4 = cumCont.m12;

    cumCust.nam = cumCust.m12;
    cumCont.nam = cumCont.m12;

    return {
      newCustomerCount: actCust,
      newContractCount: actCont,
      cumCustomerCount: cumCust,
      cumContractCount: cumCont
    };
  }, [actualCounts]);

  // Estimated values state for the "KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI" table
  const [estimatedCounts, setEstimatedCounts] = useState(() => {
    const estCust = {
      m1: '28', m2: '31', m3: '33', m4: '36', m5: '38', m6: '35',
      m7: '34', m8: '33', m9: '35', m10: '37', m11: '32', m12: '36'
    };
    const estCont = {
      m1: '48', m2: '42', m3: '30', m4: '55', m5: '38', m6: '33',
      m7: '47', m8: '43', m9: '26', m10: '49', m11: '42', m12: '30'
    };
    return { newCustomerCount: estCust, newContractCount: estCont };
  });

  const handleEstimatedCountChange = (type, monthKey, value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setEstimatedCounts(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [monthKey]: cleanValue
      }
    }));
  };

  const computedEstimatedSummary = useMemo(() => {
    const estCust = { ...estimatedCounts.newCustomerCount };
    const estCont = { ...estimatedCounts.newContractCount };

    // Calculate quarters
    for (let q = 1; q <= 4; q++) {
      const mStart = (q - 1) * 3 + 1;
      estCust[`q${q}`] = String(
        (parseInt(estCust[`m${mStart}`], 10) || 0) +
        (parseInt(estCust[`m${mStart + 1}`], 10) || 0) +
        (parseInt(estCust[`m${mStart + 2}`], 10) || 0)
      );
      estCont[`q${q}`] = String(
        (parseInt(estCont[`m${mStart}`], 10) || 0) +
        (parseInt(estCont[`m${mStart + 1}`], 10) || 0) +
        (parseInt(estCont[`m${mStart + 2}`], 10) || 0)
      );
    }

    // Calculate year
    estCust.nam = String(
      Array.from({ length: 12 }, (_, i) => parseInt(estCust[`m${i + 1}`], 10) || 0).reduce((a, b) => a + b, 0)
    );
    estCont.nam = String(
      Array.from({ length: 12 }, (_, i) => parseInt(estCont[`m${i + 1}`], 10) || 0).reduce((a, b) => a + b, 0)
    );

    // Calculate cumulative
    const cumCust = {};
    const cumCont = {};
    let runningCust = 0;
    let runningCont = 0;
    for (let i = 1; i <= 12; i++) {
      runningCust += parseInt(estCust[`m${i}`], 10) || 0;
      runningCont += parseInt(estCont[`m${i}`], 10) || 0;
      cumCust[`m${i}`] = runningCust;
      cumCont[`m${i}`] = runningCont;
    }

    cumCust.q1 = cumCust.m3;
    cumCust.q2 = cumCust.m6;
    cumCust.q3 = cumCust.m9;
    cumCust.q4 = cumCust.m12;

    cumCont.q1 = cumCont.m3;
    cumCont.q2 = cumCont.m6;
    cumCont.q3 = cumCont.m9;
    cumCont.q4 = cumCont.m12;

    cumCust.nam = cumCust.m12;
    cumCont.nam = cumCont.m12;

    return {
      newCustomerCount: estCust,
      newContractCount: estCont,
      cumCustomerCount: cumCust,
      cumContractCount: cumCont
    };
  }, [estimatedCounts]);

  // Resizable column widths for frozen columns
  const [colWidths, setColWidths] = useState({
    col1: 120,
    col2: 120,
    col3: 130,
    col4: 70,  // KH Mới
    col5: 110, // Nhóm SPDV
    col6: 110  // Tên SPDV
  });

  const leftOffsets = useMemo(() => {
    const hideUnitColumn = activePlanTab === 'Kế hoạch tập đoàn' || activeTab === 'san_luong_nghiem_thu';
    const c1 = hideUnitColumn ? 0 : colWidths.col1;
    const c2 = colWidths.col2;
    const c3 = colWidths.col3;
    const c4 = colWidths.col4;
    const c5 = colWidths.col5;
    return {
      col1: 0,
      col2: c1,
      col3: c1 + c2,
      col4: c1 + c2 + c3,
      col5: c1 + c2 + c3 + c4,
      col6: c1 + c2 + c3 + c4 + c5
    };
  }, [colWidths, activePlanTab, activeTab]);

  const handleResizeStart = (colKey, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = colWidths[colKey];

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX);
      setColWidths(prev => ({
        ...prev,
        [colKey]: newWidth
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Timeline History state
  const [historyLogs, setHistoryLogs] = useState([
    {
      id: 'h-1',
      user: 'Nguyễn Văn A',
      avatarClass: 'avatar-yellow-pink',
      avatarInitial: 'A',
      time: 'vừa xong',
      type: 'change',
      details: [
        'Nhóm khách hàng: Khách hàng ngoài → Khách hàng nội bộ - Tập đoàn trong nước',
        'Tên khách hàng: Sungroup → Công ty A (Nội bộ VN)',
        'Contact: Xin thông tin → Kí kết hợp đồng'
      ]
    },
    {
      id: 'h-2',
      user: 'Hoàng Trọng G',
      avatarClass: 'avatar-purple',
      avatarInitial: 'G',
      time: 'Cách đây 5h',
      type: 'file',
      fileName: 'Revenue_Performance_June.xlsx',
      details: [
        'Import file số thực tế thành công cho kỳ tháng 6/2026 (7 dòng hợp lệ).'
      ]
    }
  ]);

  // Simulated System Date for testing business rules (Default to 23rd of June so estimate window is active by default)
  const [simulatedSystemDate, setSimulatedSystemDate] = useState('2026-06-23');

  // Official Months list (Months that have official actual TH nạp thành công)
  const [officialMonths, setOfficialMonths] = useState(['m1', 'm2', 'm3', 'm4', 'm5']);

  // Estimates Database state
  const [estimatesDb, setEstimatesDb] = useState({
    'R-1_2026_m6': 300,
    'R-5_2026_m6': 220,
    'R-9_2026_m6': 150
  });

  // Estimate Modal editing states
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [tempEstimates, setTempEstimates] = useState({});


  // Collapse states for summary sub-tables
  const [collapsedTable1, setCollapsedTable1] = useState(false);
  const [collapsedTable1_2, setCollapsedTable1_2] = useState(false);
  const [collapsedTable2, setCollapsedTable2] = useState(false);
  const [collapsedTable3, setCollapsedTable3] = useState(false);
  const [collapsedTable4, setCollapsedTable4] = useState(false);
  const [collapsedNewCounts, setCollapsedNewCounts] = useState(false);
  const [collapsedServiceQuality, setCollapsedServiceQuality] = useState(false);

  const serviceQualityRows = useMemo(() => [
    { id: 0, name: 'Tỷ lệ cuộc gọi kết nối thành công đến tổng đài', level: 1 },
    { id: 1, name: 'TLKN kênh Di động Vip/Svip', level: 2 },
    { id: 2, name: 'TLKN kênh Di động thường/Hotline/CDS', level: 2 },
    { id: 3, name: 'TLKN kênh SME', level: 2 },
    { id: 4, name: 'TLKN kênh CĐBR và truyền hình', level: 2 },
    { id: 5, name: 'TLKN kênh 1789N1', level: 2 },
    { id: 6, name: 'TLKN kênh Videocall', level: 2 },
    { id: 7, name: 'TLKN kênh 1789N2', level: 2 },
    { id: 8, name: 'Tỷ lệ hài lòng của khách hàng', level: 1 },
    { id: 9, name: 'Kênh FO', level: 2 },
    { id: 10, name: 'Kênh BO', level: 2 },
    { id: 11, name: 'Callbot Inbound', level: 2 }
  ], []);

  const [serviceQualityValues, setServiceQualityValues] = useState(() => {
    const initialValues = {};
    const baseIndicators = [
      { id: 1, basePlan: 99, baseAct: 98.8 },
      { id: 2, basePlan: 98, baseAct: 97.9 },
      { id: 3, basePlan: 97, baseAct: 96.5 },
      { id: 4, basePlan: 98, baseAct: 97.4 },
      { id: 5, basePlan: 98, baseAct: 98.2 },
      { id: 6, basePlan: 95, baseAct: 94.3 },
      { id: 7, basePlan: 97, baseAct: 96.8 },
      { id: 9, basePlan: 95, baseAct: 94.8 },
      { id: 10, basePlan: 94, baseAct: 93.7 },
      { id: 11, basePlan: 92, baseAct: 91.6 }
    ];

    baseIndicators.forEach(({ id, basePlan, baseAct }) => {
      initialValues[id] = { plan: {}, actual: {} };
      for (let m = 1; m <= 12; m++) {
        const variancePlan = ((m * 3) % 5 - 2) * 0.2;
        const varianceAct = ((m * 7) % 7 - 3) * 0.3;
        initialValues[id].plan[`m${m}`] = (basePlan + variancePlan).toFixed(1);
        initialValues[id].actual[`m${m}`] = (baseAct + varianceAct).toFixed(1);
      }
    });

    return initialValues;
  });

  const [serviceQualityEstimatedValues, setServiceQualityEstimatedValues] = useState(() => {
    const initialValues = {};
    const baseIndicators = [
      { id: 1, baseEst: 98.6 },
      { id: 2, baseEst: 97.7 },
      { id: 3, baseEst: 96.3 },
      { id: 4, baseEst: 97.2 },
      { id: 5, baseEst: 98.0 },
      { id: 6, baseEst: 94.1 },
      { id: 7, baseEst: 96.5 },
      { id: 9, baseEst: 94.5 },
      { id: 10, baseEst: 93.5 },
      { id: 11, baseEst: 91.3 }
    ];

    baseIndicators.forEach(({ id, baseEst }) => {
      initialValues[id] = { estimate: {} };
      for (let m = 1; m <= 12; m++) {
        const varianceEst = ((m * 9) % 7 - 3) * 0.25;
        initialValues[id].estimate[`m${m}`] = (baseEst + varianceEst).toFixed(1);
      }
    });

    return initialValues;
  });

  const handleServiceQualityChange = (id, monthKey, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setServiceQualityValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        actual: {
          ...prev[id].actual,
          [monthKey]: cleanValue
        }
      }
    }));
  };

  const handleServiceQualityEstimatedChange = (id, monthKey, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setServiceQualityEstimatedValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        estimate: {
          ...prev[id].estimate,
          [monthKey]: cleanValue
        }
      }
    }));
  };

  const computedServiceQuality = useMemo(() => {
    const data = JSON.parse(JSON.stringify(serviceQualityValues));
    const estData = JSON.parse(JSON.stringify(serviceQualityEstimatedValues));
    const baseIds = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
    
    const combined = {};
    baseIds.forEach(id => {
      combined[id] = {
        plan: (data[id] && data[id].plan) ? { ...data[id].plan } : {},
        estimate: (estData[id] && estData[id].estimate) ? { ...estData[id].estimate } : {},
        actual: (data[id] && data[id].actual) ? { ...data[id].actual } : {}
      };
    });

    baseIds.forEach(id => {
      const plan = combined[id].plan;
      const estimate = combined[id].estimate;
      const actual = combined[id].actual;
      
      // Calculate quarters
      for (let q = 1; q <= 4; q++) {
        const mStart = (q - 1) * 3 + 1;
        const qPlanAvg = (
          parseFloat(plan[`m${mStart}`] || 0) +
          parseFloat(plan[`m${mStart + 1}`] || 0) +
          parseFloat(plan[`m${mStart + 2}`] || 0)
        ) / 3;
        const qEstAvg = (
          parseFloat(estimate[`m${mStart}`] || 0) +
          parseFloat(estimate[`m${mStart + 1}`] || 0) +
          parseFloat(estimate[`m${mStart + 2}`] || 0)
        ) / 3;
        const qActAvg = (
          parseFloat(actual[`m${mStart}`] || 0) +
          parseFloat(actual[`m${mStart + 1}`] || 0) +
          parseFloat(actual[`m${mStart + 2}`] || 0)
        ) / 3;
        plan[`q${q}`] = qPlanAvg.toFixed(1);
        estimate[`q${q}`] = qEstAvg.toFixed(1);
        actual[`q${q}`] = qActAvg.toFixed(1);
      }
      
      // Calculate year
      const yPlanAvg = Array.from({ length: 12 }, (_, i) => parseFloat(plan[`m${i + 1}`] || 0)).reduce((a, b) => a + b, 0) / 12;
      const yEstAvg = Array.from({ length: 12 }, (_, i) => parseFloat(estimate[`m${i + 1}`] || 0)).reduce((a, b) => a + b, 0) / 12;
      const yActAvg = Array.from({ length: 12 }, (_, i) => parseFloat(actual[`m${i + 1}`] || 0)).reduce((a, b) => a + b, 0) / 12;
      plan.nam = yPlanAvg.toFixed(1);
      estimate.nam = yEstAvg.toFixed(1);
      actual.nam = yActAvg.toFixed(1);
    });

    const calculateParent = (parentId, childrenIds) => {
      combined[parentId] = { plan: {}, estimate: {}, actual: {} };
      const periods = [
        'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12',
        'q1', 'q2', 'q3', 'q4', 'nam'
      ];
      periods.forEach(p => {
        const pPlanAvg = childrenIds.reduce((sum, cid) => sum + parseFloat(combined[cid]?.plan?.[p] || 0), 0) / childrenIds.length;
        const pEstAvg = childrenIds.reduce((sum, cid) => sum + parseFloat(combined[cid]?.estimate?.[p] || 0), 0) / childrenIds.length;
        const pActAvg = childrenIds.reduce((sum, cid) => sum + parseFloat(combined[cid]?.actual?.[p] || 0), 0) / childrenIds.length;
        combined[parentId].plan[p] = pPlanAvg.toFixed(1);
        combined[parentId].estimate[p] = pEstAvg.toFixed(1);
        combined[parentId].actual[p] = pActAvg.toFixed(1);
      });
    };

    calculateParent(0, [1, 2, 3, 4, 5, 6, 7]);
    calculateParent(8, [9, 10, 11]);

    return combined;
  }, [serviceQualityValues, serviceQualityEstimatedValues]);

  // Initialize DB Values
  useEffect(() => {
    const initial = {};
    MATRIX_ROWS_BASE.forEach(row => {
      // Seed values for 2025 and 2026 for all months/quarters/years
      YEAR_OPTIONS.forEach(yr => {
        const yearNum = parseInt(yr, 10);
        // seed months
        for (let i = 1; i <= 12; i++) {
          const val = generateMatrixValue(row.id, yearNum, `m${i}`);
          initial[`${row.id}_${yearNum}_m${i}`] = val;
        }
        // seed quarters
        for (let i = 1; i <= 4; i++) {
          const val = generateMatrixValue(row.id, yearNum, `q${i}`);
          initial[`${row.id}_${yearNum}_q${i}`] = val;
        }
        // seed year
        const valY = generateMatrixValue(row.id, yearNum, 'y');
        initial[`${row.id}_${yearNum}_y`] = valY;
      });
    });
    setDbValues(initial);
  }, []);

  // --- ESTIMATE TIME WINDOW LOGIC ---
  const systemDateObj = useMemo(() => new Date(simulatedSystemDate), [simulatedSystemDate]);
  const systemYear = systemDateObj.getFullYear();
  const systemMonth = systemDateObj.getMonth() + 1; // 1-indexed
  const systemDay = systemDateObj.getDate();

  const isCurrentMonthSelected = useMemo(() => {
    return selectedYear === String(systemYear) && selectedPeriods.includes(`m${systemMonth}`);
  }, [selectedYear, selectedPeriod, systemYear, systemMonth]);

  const isEstimateWindowActive = useMemo(() => {
    if (!isCurrentMonthSelected) return false;
    return systemDay >= 22 && systemDay <= 25;
  }, [isCurrentMonthSelected, systemDay]);

  const estimateWindowTooltip = useMemo(() => {
    const formattedMonth = String(systemMonth).padStart(2, '0');
    const formattedYear = systemYear;
    
    if (officialMonths.includes(selectedPeriod)) {
      return 'Kỳ báo cáo này đã có số liệu thực tế chính thức (Đã đóng sổ).';
    }
    if (!selectedPeriod.startsWith('m')) {
      return 'Ước thực hiện chỉ áp dụng cho cấp nhập Tháng.';
    }
    if (!isCurrentMonthSelected) {
      return `Chỉ được nhập Ước thực hiện cho tháng hiện tại của hệ thống (${formattedMonth}/${formattedYear}).`;
    }
    if (systemDay < 22) {
      return `Chưa đến thời gian nhập Ước thực hiện. Vui lòng quay lại từ ngày 22 đến ngày 25 hàng tháng.`;
    }
    if (systemDay > 25) {
      return `Đã hết thời gian nhập Ước thực hiện tháng ${formattedMonth}/${formattedYear} (hạn từ ngày 22 đến ngày 25). Vui lòng chờ kỳ nhập Ước thực hiện tiếp theo.`;
    }
    return '';
  }, [isCurrentMonthSelected, selectedPeriod, officialMonths, systemDay, systemMonth, systemYear]);

  const handleOpenEstimateModal = () => {
    const isClosed = officialMonths.includes(selectedPeriod);
    if (isClosed) {
      alert("Kỳ báo cáo này đã có số liệu thực tế chính thức (Đã đóng sổ). Không thể nhập ước tính!");
      return;
    }
    if (!selectedPeriod.startsWith('m')) {
      alert("Ước thực hiện chỉ áp dụng cho cấp nhập Tháng!");
      return;
    }
    if (!isCurrentMonthSelected) {
      const formattedMonth = String(systemMonth).padStart(2, '0');
      alert(`Chỉ được nhập Ước thực hiện cho tháng hiện tại của hệ thống (${formattedMonth}/${systemYear}).`);
      return;
    }
    if (systemDay < 22) {
      alert(`Chưa đến thời gian nhập Ước thực hiện. Vui lòng quay lại từ ngày 22 đến ngày 25 hàng tháng.\n(Ngày hiện tại giả lập: ngày ${systemDay})`);
      return;
    }
    if (systemDay > 25) {
      const formattedMonth = String(systemMonth).padStart(2, '0');
      alert(`Đã hết thời gian nhập Ước thực hiện tháng ${formattedMonth}/${systemYear} (hạn từ ngày 22 đến ngày 25).\nVui lòng chờ kỳ nhập Ước thực hiện tiếp theo.\n(Ngày hiện tại giả lập: ngày ${systemDay})`);
      return;
    }

    // Initialize temporary editing values from estimatesDb
    const initialTemp = {};
    MATRIX_ROWS_BASE.forEach(row => {
      const estKey = `${row.id}_${selectedYear}_${selectedPeriod}`;
      initialTemp[row.id] = estimatesDb[estKey] !== undefined ? estimatesDb[estKey] : '';
    });
    setTempEstimates(initialTemp);
    setShowEstimateModal(true);
  };

  const handleCloseEstimateModal = () => {
    setShowEstimateModal(false);
  };

  const handleTempEstimateChange = (rowId, val) => {
    setTempEstimates(prev => ({
      ...prev,
      [rowId]: val
    }));
  };

  const handleSaveEstimates = () => {
    // Validate values > 1
    const keys = Object.keys(tempEstimates);
    for (let i = 0; i < keys.length; i++) {
      const valStr = tempEstimates[keys[i]];
      if (valStr !== '' && valStr !== null && valStr !== undefined) {
        const val = parseFloat(valStr);
        if (isNaN(val) || val <= 1) {
          alert("Giá trị ước thực hiện phải lớn hơn 1!");
          return;
        }
      }
    }

    // Save to estimatesDb and write to activity logs
    const updatedEstimates = { ...estimatesDb };
    const logsToAdd = [];

    MATRIX_ROWS_BASE.forEach(row => {
      const estKey = `${row.id}_${selectedYear}_${selectedPeriod}`;
      const oldVal = estimatesDb[estKey];
      const newValStr = tempEstimates[row.id];
      const newVal = (newValStr !== '' && newValStr !== undefined && newValStr !== null) ? Math.round(parseFloat(newValStr)) : undefined;

      if (newVal !== oldVal) {
        if (newVal === undefined) {
          delete updatedEstimates[estKey];
        } else {
          updatedEstimates[estKey] = newVal;
        }

        const customer = CUSTOMERS_DB.find(c => c.id === row.customerId) || {};
        const spdv = SPDVS_DB.find(s => s.id === row.spdvId) || {};
        const oldLabel = oldVal !== undefined ? oldVal.toLocaleString('vi-VN') : 'Trống';
        const newLabel = newVal !== undefined ? newVal.toLocaleString('vi-VN') : 'Trống';

        logsToAdd.push({
          id: `h-est-${row.id}-${Date.now()}`,
          user: 'thomnguyen_os',
          avatarClass: 'avatar-blue-green',
          avatarInitial: 'T',
          time: 'vừa xong',
          type: 'change',
          details: [
            `Cập nhật Ước TH đơn vị ${row.unit}, khách hàng ${customer.name}, dịch vụ ${spdv.name}`,
            `Giá trị thay đổi: từ [${oldLabel}] thành [${newLabel}].`
          ]
        });
      }
    });

    setEstimatesDb(updatedEstimates);
    if (logsToAdd.length > 0) {
      setHistoryLogs(prev => [...logsToAdd, ...prev]);
    }

    alert("Đã lưu số liệu ước thực hiện thành công!");
    setShowEstimateModal(false);
  };

  // Compute values based on current Year and Period selection
  const computedRows = useMemo(() => {
    return MATRIX_ROWS_BASE.map(rowBase => {
      const customer = CUSTOMERS_DB.find(c => c.id === rowBase.customerId) || {};
      const spdv = SPDVS_DB.find(s => s.id === rowBase.spdvId) || {};

      // Get values for current period
      const currentValKey = `${rowBase.id}_${selectedYear}_${selectedPeriod}`;
      const currentVal = dbValues[currentValKey] || { kh: 0, th: 0 };

      // Determine previous period key
      let prevPeriodKey = '';
      let prevYearNum = parseInt(selectedYear, 10);
      if (selectedPeriod.startsWith('m')) {
        const monthNum = parseInt(selectedPeriod.substring(1), 10);
        if (monthNum === 1) {
          prevPeriodKey = 'm12';
          prevYearNum -= 1;
        } else {
          prevPeriodKey = `m${monthNum - 1}`;
        }
      } else if (selectedPeriod.startsWith('q')) {
        const quarterNum = parseInt(selectedPeriod.substring(1), 10);
        if (quarterNum === 1) {
          prevPeriodKey = 'q4';
          prevYearNum -= 1;
        } else {
          prevPeriodKey = `q${quarterNum - 1}`;
        }
      } else {
        // year comparison is to the previous year
        prevPeriodKey = 'y';
        prevYearNum -= 1;
      }
      const prevValKey = `${rowBase.id}_${prevYearNum}_${prevPeriodKey}`;
      const prevVal = dbValues[prevValKey] || { kh: 0, th: 0 };

      // Determine same period last year key
      const samePeriodLastYearKey = `${rowBase.id}_${parseInt(selectedYear, 10) - 1}_${selectedPeriod}`;
      const samePeriodLastYearVal = dbValues[samePeriodLastYearKey] || { kh: 0, th: 0 };

      // Estimated TH logic (Rule 6)
      const estKey = `${rowBase.id}_${selectedYear}_${selectedPeriod}`;
      const estimateVal = estimatesDb[estKey];
      const isClosed = officialMonths.includes(selectedPeriod);

      return {
        id: rowBase.id,
        implementationUnit: rowBase.unit,
        customerGroup: customer.group || '',
        customerName: customer.name || '',
        isNewCustomer: customer.isNew || false,
        spdvGroup: spdv.group || '',
        spdvName: spdv.name || '',
        
        // Current values
        kh: currentVal.kh,
        th: currentVal.th,
        isEstimateActive: !isClosed && selectedPeriod.startsWith('m'),
        estimateVal: estimateVal !== undefined && estimateVal !== null ? estimateVal : null,

        // Previous values
        th_prev: prevVal.th,

        // Last year values
        th_last_year: samePeriodLastYearVal.th
      };
    });
  }, [dbValues, selectedYear, selectedPeriod, estimatesDb, officialMonths]);

  // Filters application
  const filteredAndSortedData = useMemo(() => {
    let result = [...computedRows];

    // Filter by Plan Type Tab
    if (activePlanTab === 'Kế hoạch tập đoàn') {
      result = result.filter(item => !item.customerGroup.toLowerCase().includes('nội bộ'));
    } else if (activePlanTab === 'Kế hoạch nội bộ') {
      result = result.filter(item => item.customerGroup.toLowerCase().includes('nội bộ'));
    }

    // Search input: instant search (MST, name, unit)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.customerName.toLowerCase().includes(lower) || 
        item.implementationUnit.toLowerCase().includes(lower) || 
        item.spdvName.toLowerCase().includes(lower) ||
        item.customerGroup.toLowerCase().includes(lower)
      );
    }

    // Advanced Multi-choice filters
    if (selectedGroups.length > 0) {
      result = result.filter(item => selectedGroups.includes(item.customerGroup));
    }
    if (selectedCustomers.length > 0) {
      result = result.filter(item => selectedCustomers.includes(item.customerName));
    }
    if (selectedSPDVGroups.length > 0) {
      result = result.filter(item => selectedSPDVGroups.includes(item.spdvGroup));
    }
    if (selectedSPDVs.length > 0) {
      result = result.filter(item => selectedSPDVs.includes(item.spdvName));
    }
    if (isNewCustomerFilter) {
      result = result.filter(item => item.isNewCustomer === true);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [computedRows, activePlanTab, searchTerm, selectedGroups, selectedCustomers, selectedSPDVGroups, selectedSPDVs, isNewCustomerFilter, sortField, sortDirection]);

  // Data for KPI cards row - does NOT filter by Plan Type Tab (user request: keep statistics panel intact)
  const kpiData = useMemo(() => {
    let result = [...computedRows];

    // Search input: instant search (MST, MST, unit)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.customerName.toLowerCase().includes(lower) || 
        item.implementationUnit.toLowerCase().includes(lower) || 
        item.spdvName.toLowerCase().includes(lower) ||
        item.customerGroup.toLowerCase().includes(lower)
      );
    }

    // Advanced Multi-choice filters
    if (selectedGroups.length > 0) {
      result = result.filter(item => selectedGroups.includes(item.customerGroup));
    }
    if (selectedCustomers.length > 0) {
      result = result.filter(item => selectedCustomers.includes(item.customerName));
    }
    if (selectedSPDVGroups.length > 0) {
      result = result.filter(item => selectedSPDVGroups.includes(item.spdvGroup));
    }
    if (selectedSPDVs.length > 0) {
      result = result.filter(item => selectedSPDVs.includes(item.spdvName));
    }
    if (isNewCustomerFilter) {
      result = result.filter(item => item.isNewCustomer === true);
    }

    return result;
  }, [computedRows, searchTerm, selectedGroups, selectedCustomers, selectedSPDVGroups, selectedSPDVs, isNewCustomerFilter]);

  // Summary Metrics calculations
  const summaryStats = useMemo(() => {
    let internalSum = 0;
    let externalSum = 0;
    let internationalSum = 0;
    let globalSum = 0;
    let newServiceSum = 0;
    const newServicesList = ['AI Chatbot', 'Loyalty App', 'Smart City Solution'];

    kpiData.forEach(item => {
      // Internal = internal in-country + internal international
      const isInternal = item.customerGroup.toLowerCase().includes('nội bộ');
      // External = external in-country + external international
      const isExternal = item.customerGroup.toLowerCase().includes('ngoài');
      // International = internal international + external international
      const isInternational = item.customerGroup.toLowerCase().includes('nước ngoài');
      
      const isGlobal = item.customerName.toLowerCase().includes('global') || item.customerGroup.toLowerCase().includes('nước ngoài');
      const isNewService = newServicesList.includes(item.spdvName);

      if (isInternal) {
        internalSum += item.th;
      }
      if (isExternal) {
        externalSum += item.th;
      }
      if (isInternational) {
        internationalSum += item.th;
      }
      if (isGlobal) {
        globalSum += item.th;
      }
      if (isNewService) {
        newServiceSum += item.th;
      }
    });

    const totalSum = internalSum + externalSum;

    // Apply scale down if it is Revenue Tab vs Production Tab (for cosmetic realism in UI)
    const formatStat = (val) => {
      return activeTab === 'ket_qua_doanh_thu' ? Math.round(val * 1.5).toLocaleString('vi-VN') : val.toLocaleString('vi-VN');
    };

    return {
      internal: formatStat(internalSum),
      external: formatStat(externalSum),
      international: formatStat(internationalSum),
      global: formatStat(globalSum),
      newService: formatStat(newServiceSum),
      total: formatStat(totalSum)
    };
  }, [kpiData, activeTab]);

  // --- 2. BIỂU MẪU DOANH THU NỘI BỘ TỔNG HỢP ---
  const summaryCalculations = useMemo(() => {
    // 12 months, 4 quarters, and Year. We sum Month values and then sum quarters and year from months
    const periods = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
    
    // Scale up values if tab is revenue to make the numbers look distinct and matching the scale
    const valScale = activeTab === 'ket_qua_doanh_thu' ? 1.5 : 1;

    const getVal = (rowId, pKey) => {
      const val = dbValues[`${rowId}_${selectedYear}_${pKey}`] || { kh: 0, th: 0 };
      const est = estimatesDb[`${rowId}_${selectedYear}_${pKey}`] || 0;
      return {
        kh: Math.round(val.kh * valScale),
        th: Math.round(val.th * valScale),
        est: Math.round(est * valScale)
      };
    };

    // Calculate sum of months for quarters and year
    const computeSummedPeriods = (periodsData) => {
      // Q1 = m1 + m2 + m3
      const q1TH = (periodsData.m1?.th || 0) + (periodsData.m2?.th || 0) + (periodsData.m3?.th || 0);
      const q1KH = (periodsData.m1?.kh || 0) + (periodsData.m2?.kh || 0) + (periodsData.m3?.kh || 0);
      const q1EST = (periodsData.m1?.est || 0) + (periodsData.m2?.est || 0) + (periodsData.m3?.est || 0);
      periodsData.q1 = { th: q1TH, kh: q1KH, est: q1EST };

      // Q2 = m4 + m5 + m6
      const q2TH = (periodsData.m4?.th || 0) + (periodsData.m5?.th || 0) + (periodsData.m6?.th || 0);
      const q2KH = (periodsData.m4?.kh || 0) + (periodsData.m5?.kh || 0) + (periodsData.m6?.kh || 0);
      const q2EST = (periodsData.m4?.est || 0) + (periodsData.m5?.est || 0) + (periodsData.m6?.est || 0);
      periodsData.q2 = { th: q2TH, kh: q2KH, est: q2EST };

      // Q3 = m7 + m8 + m9
      const q3TH = (periodsData.m7?.th || 0) + (periodsData.m8?.th || 0) + (periodsData.m9?.th || 0);
      const q3KH = (periodsData.m7?.kh || 0) + (periodsData.m8?.kh || 0) + (periodsData.m9?.kh || 0);
      const q3EST = (periodsData.m7?.est || 0) + (periodsData.m8?.est || 0) + (periodsData.m9?.est || 0);
      periodsData.q3 = { th: q3TH, kh: q3KH, est: q3EST };

      // Q4 = m10 + m11 + m12
      const q4TH = (periodsData.m10?.th || 0) + (periodsData.m11?.th || 0) + (periodsData.m12?.th || 0);
      const q4KH = (periodsData.m10?.kh || 0) + (periodsData.m11?.kh || 0) + (periodsData.m12?.kh || 0);
      const q4EST = (periodsData.m10?.est || 0) + (periodsData.m11?.est || 0) + (periodsData.m12?.est || 0);
      periodsData.q4 = { th: q4TH, kh: q4KH, est: q4EST };

      // Year = sum of all months
      let yearTH = 0;
      let yearKH = 0;
      let yearEST = 0;
      for (let m = 1; m <= 12; m++) {
        yearTH += periodsData[`m${m}`]?.th || 0;
        yearKH += periodsData[`m${m}`]?.kh || 0;
        yearEST += periodsData[`m${m}`]?.est || 0;
      }
      periodsData.y = { th: yearTH, kh: yearKH, est: yearEST };
    };

    const getYearPeriodsData = (yr, filterFn) => {
      const periodsData = {};
      periods.forEach(p => {
        let thSum = 0;
        let khSum = 0;
        let estSum = 0;
        MATRIX_ROWS_BASE.forEach(row => {
          if (filterFn(row)) {
            const val = dbValues[`${row.id}_${yr}_${p}`] || { kh: 0, th: 0 };
            const est = estimatesDb[`${row.id}_${yr}_${p}`] || 0;
            thSum += Math.round(val.th * valScale);
            khSum += Math.round(val.kh * valScale);
            estSum += Math.round(est * valScale);
          }
        });
        periodsData[p] = { th: thSum, kh: khSum, est: estSum };
      });

      computeSummedPeriods(periodsData);
      return periodsData;
    };

    const yrCurrent = parseInt(selectedYear, 10);
    const allPeriodsList = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'q1', 'q2', 'q3', 'q4', 'y'];

    const getFullComparisonPeriods = (filterFn) => {
      const currentData = getYearPeriodsData(yrCurrent, filterFn);
      const prevYearData = getYearPeriodsData(yrCurrent - 1, filterFn);
      const periodsResult = {};

      allPeriodsList.forEach(pKey => {
        const cur = currentData[pKey];
        
        let prevPeriodKey = pKey;
        let prevYear = yrCurrent;
        if (pKey.startsWith('m')) {
          const mNum = parseInt(pKey.substring(1), 10);
          if (mNum === 1) {
            prevPeriodKey = 'm12';
            prevYear -= 1;
          } else {
            prevPeriodKey = `m${mNum - 1}`;
          }
        } else if (pKey.startsWith('q')) {
          const qNum = parseInt(pKey.substring(1), 10);
          if (qNum === 1) {
            prevPeriodKey = 'q4';
            prevYear -= 1;
          } else {
            prevPeriodKey = `q${qNum - 1}`;
          }
        } else if (pKey === 'y') {
          prevPeriodKey = 'y';
          prevYear -= 1;
        }

        const thPrev = prevYear === yrCurrent ? currentData[prevPeriodKey].th : prevYearData[prevPeriodKey].th;
        const estPrev = prevYear === yrCurrent ? currentData[prevPeriodKey].est : prevYearData[prevPeriodKey].est;
        const thYoY = prevYearData[pKey].th;
        const estYoY = prevYearData[pKey].est;

        periodsResult[pKey] = {
          kh: cur.kh,
          th: cur.th,
          est: cur.est,
          thPrev,
          estPrev,
          thYoY,
          estYoY
        };
      });

      return periodsResult;
    };

    // --- 2.1 Biểu tổng hợp kết quả theo đơn vị thực hiện ---
    const unitData = UNITS.map(unit => {
      return {
        unitName: unit,
        periods: getFullComparisonPeriods(row => row.unit === unit)
      };
    });

    // --- 2.2 Tổng hợp số lượng đơn vị hoàn thành kế hoạch ---
    const unitCompletion = {};
    
    allPeriodsList.forEach(p => {
      const totalUnits = UNITS.length;
      let completedUnits = 0;

      unitData.forEach(ud => {
        const val = ud.periods[p];
        if (val.kh > 0 && val.th >= val.kh) {
          completedUnits += 1;
        }
      });

      const rate = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
      unitCompletion[p] = {
        total: totalUnits,
        completed: completedUnits,
        rate: rate
      };
    });

    // --- 2.3 Tổng hợp kết quả thực hiện theo nhóm khách hàng ---
    const customerGroupData = CUSTOMER_GROUPS_LIST.map(group => {
      return {
        groupName: group,
        periods: getFullComparisonPeriods(row => {
          const cust = CUSTOMERS_DB.find(c => c.id === row.customerId) || {};
          return cust.group === group;
        })
      };
    });

    // --- 2.4 Tổng hợp kết quả thực hiện theo nhóm SPDV ---
    const spdvGroupData = SPDV_GROUPS.map(spg => {
      return {
        spgName: spg,
        periods: getFullComparisonPeriods(row => {
          const spdv = SPDVS_DB.find(s => s.id === row.spdvId) || {};
          return spdv.group === spg;
        })
      };
    });

    // --- 2.5 Tỉ lệ nhóm SPDV hoàn thành kế hoạch ---
    const spdvCompletion = {};
    
    allPeriodsList.forEach(p => {
      const totalGroups = SPDV_GROUPS.length;
      let completedGroups = 0;

      spdvGroupData.forEach(sgd => {
        const val = sgd.periods[p];
        if (val.kh > 0 && val.th >= val.kh) {
          completedGroups += 1;
        }
      });

      const rate = totalGroups > 0 ? Math.round((completedGroups / totalGroups) * 100) : 0;
      spdvCompletion[p] = {
        total: totalGroups,
        completed: completedGroups,
        rate: rate
      };
    });

    return {
      unitData,
      unitCompletion,
      customerGroupData,
      spdvGroupData,
      spdvCompletion
    };
  }, [dbValues, selectedYear, activeTab]);

  const newCountsSummary = useMemo(() => {
    const goals = mockStore.getAllGoals();
    
    // Seed default mock goals with some values if they don't have them
    goals.forEach(goal => {
      if (!goal.newCustomerCountPlan) {
        const seedNum = parseInt(goal.id.replace('GOAL-', ''), 10) || 1;
        const newCustomerCountPlan = {};
        const newContractCountPlan = {};
        
        for (let i = 1; i <= 12; i++) {
          const mKey = `m${i}`;
          newCustomerCountPlan[mKey] = String((seedNum * 2 + i) % 5 + 1);
          newContractCountPlan[mKey] = String((seedNum * 3 + i * 2) % 6 + 1);
        }
        
        for (let i = 1; i <= 4; i++) {
          const qKey = `q${i}`;
          const startMonth = (i - 1) * 3 + 1;
          newCustomerCountPlan[qKey] = String(
            parseInt(newCustomerCountPlan[`m${startMonth}`], 10) +
            parseInt(newCustomerCountPlan[`m${startMonth + 1}`], 10) +
            parseInt(newCustomerCountPlan[`m${startMonth + 2}`], 10)
          );
          newContractCountPlan[qKey] = String(
            parseInt(newContractCountPlan[`m${startMonth}`], 10) +
            parseInt(newContractCountPlan[`m${startMonth + 1}`], 10) +
            parseInt(newContractCountPlan[`m${startMonth + 2}`], 10)
          );
        }
        
        newCustomerCountPlan.nam = String(
          Array.from({ length: 12 }, (_, idx) => parseInt(newCustomerCountPlan[`m${idx + 1}`], 10)).reduce((a, b) => a + b, 0)
        );
        newContractCountPlan.nam = String(
          Array.from({ length: 12 }, (_, idx) => parseInt(newContractCountPlan[`m${idx + 1}`], 10)).reduce((a, b) => a + b, 0)
        );
        
        goal.newCustomerCountPlan = newCustomerCountPlan;
        goal.newContractCountPlan = newContractCountPlan;
      }
    });

    const sumCust = {};
    const sumCont = {};
    
    for (let i = 1; i <= 12; i++) {
      sumCust[`m${i}`] = 0;
      sumCont[`m${i}`] = 0;
    }
    for (let i = 1; i <= 4; i++) {
      sumCust[`q${i}`] = 0;
      sumCont[`q${i}`] = 0;
    }
    sumCust.nam = 0;
    sumCont.nam = 0;

    goals.forEach(goal => {
      const yearOfGoal = goal.startDate ? goal.startDate.substring(0, 4) : '2026';
      if (yearOfGoal === selectedYear) {
        const cp = goal.newCustomerCountPlan || {};
        const cnp = goal.newContractCountPlan || {};
        
        for (let i = 1; i <= 12; i++) {
          sumCust[`m${i}`] += parseInt(cp[`m${i}`] || '0', 10);
          sumCont[`m${i}`] += parseInt(cnp[`m${i}`] || '0', 10);
        }
        for (let i = 1; i <= 4; i++) {
          sumCust[`q${i}`] += parseInt(cp[`q${i}`] || '0', 10);
          sumCont[`q${i}`] += parseInt(cnp[`q${i}`] || '0', 10);
        }
        sumCust.nam += parseInt(cp.nam || '0', 10);
        sumCont.nam += parseInt(cnp.nam || '0', 10);
      }
    });

    const cumCust = {};
    const cumCont = {};
    
    let activeCumCust = 0;
    let activeCumCont = 0;
    
    for (let i = 1; i <= 12; i++) {
      activeCumCust += sumCust[`m${i}`];
      activeCumCont += sumCont[`m${i}`];
      cumCust[`m${i}`] = activeCumCust;
      cumCont[`m${i}`] = activeCumCont;
    }
    
    cumCust.q1 = cumCust.m3;
    cumCust.q2 = cumCust.m6;
    cumCust.q3 = cumCust.m9;
    cumCust.q4 = cumCust.m12;
    
    cumCont.q1 = cumCont.m3;
    cumCont.q2 = cumCont.m6;
    cumCont.q3 = cumCont.m9;
    cumCont.q4 = cumCont.m12;
    
    cumCust.nam = cumCust.m12;
    cumCont.nam = cumCont.m12;

    return {
      newCustomerCount: sumCust,
      newContractCount: sumCont,
      cumCustomerCount: cumCust,
      cumContractCount: cumCont
    };
  }, [selectedYear]);

  const allPeriodsKeys = useMemo(() => {
    return [selectedPeriod];
  }, [selectedPeriod]);
  
  const getPeriodLabel = (pKey) => {
    if (pKey.startsWith('m')) {
      const mNum = pKey.substring(1);
      const shortYear = selectedYear.substring(2);
      const monthsNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthsNames[parseInt(mNum, 10)]}-${shortYear}`;
    } else if (pKey.startsWith('q')) {
      return pKey.toUpperCase();
    } else {
      return 'Năm';
    }
  };

  // Pagination computation
  const totalRecords = filteredAndSortedData.length;

  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  // Handling sort column
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Multiple selection helper toggles
  const handleToggleGroup = (groupName) => {
    setSelectedGroups(prev => 
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
    setCurrentPage(1);
  };

  const handleToggleCustomer = (custName) => {
    setSelectedCustomers(prev => 
      prev.includes(custName) ? prev.filter(c => c !== custName) : [...prev, custName]
    );
    setCurrentPage(1);
  };
  const handleToggleSPDVGroup = (spGroup) => {
    setSelectedSPDVGroups(prev => 
      prev.includes(spGroup) ? prev.filter(s => s !== spGroup) : [...prev, spGroup]
    );
    setCurrentPage(1);
  };

  const handleToggleSPDV = (spName) => {
    setSelectedSPDVs(prev => 
      prev.includes(spName) ? prev.filter(s => s !== spName) : [...prev, spName]
    );
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedGroups([]);
    setSelectedCustomers([]);
    setSelectedSPDVGroups([]);
    setSelectedSPDVs([]);
    setIsNewCustomerFilter(false);
    setSearchTerm('');
    setSelectedPeriods(['m6']);
    setSelectedYear('2026');
    setCurrentPage(1);
  };

  // --- IMPORT EXCEL FLOW ---
  const [importStep, setImportStep] = useState(1); // 1: Upload, 2: Mapping, 3: Test Results
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importPeriod, setImportPeriod] = useState('m5'); // Default Month 5
  const [importYear, setImportYear] = useState('2026'); // Default 2026
  const [importDataType, setImportDataType] = useState('th'); // 'th' or 'estimate'

  // Custom headers simulation
  const [fileHeaders, setFileHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    unit: '',
    group: '',
    customer: '',
    isNew: '',
    spdvGroup: '',
    spdvName: '',
    th: ''
  });

  const [excelRowsCount, setExcelRowsCount] = useState(0);
  const [validationResult, setValidationResult] = useState(null); // { status: 'success'|'error', msg: '', errorFileUrl: '', parsedRows: [] }
  const [isTesting, setIsTesting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Toggle for testing server failure / success
  const [simulateServerError, setSimulateServerError] = useState(false);

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setImportStep(1);
    setUploadedFile(null);
    setFileHeaders([]);
    setExcelRowsCount(0);
    setValidationResult(null);
  };

  // Simulating File Selector/Dropzone Upload
  const handleSimulateUpload = (type) => {
    // Determine template name based on active tab
    const templateName = activeTab === 'ket_qua_doanh_thu' 
      ? 'Revenue Performance.xlsx' 
      : 'Accepted Volume Performance.xlsx';

    const targetValHeader = importDataType === 'estimate' 
      ? 'Số ước thực hiện (Ước TH)' 
      : importDataType === 'cust_count'
      ? 'Số lượng KH & HĐ mới'
      : importDataType === 'service_quality'
      ? 'Tỷ lệ chất lượng dịch vụ (%)'
      : 'Số thực hiện (TH)';

    let fileObj = null;
    if (type === 'valid') {
      fileObj = {
        name: templateName,
        size: '14.5 KB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Là khách hàng mới', 'Nhóm SPDV', 'Tên SPDV', targetValHeader],
        rowsCount: 7,
        contentValid: true
      };
    } else if (type === 'invalid_format') {
      fileObj = {
        name: 'Report_Draft.pdf',
        size: '2.1 MB',
        type: 'application/pdf',
        headers: [],
        rowsCount: 0,
        contentValid: false
      };
    } else if (type === 'too_large') {
      fileObj = {
        name: templateName,
        size: '22 MB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Là khách hàng mới', 'Nhóm SPDV', 'Tên SPDV', targetValHeader],
        rowsCount: 12500, // over 10,000 limit
        contentValid: true
      };
    } else if (type === 'extra_columns') {
      fileObj = {
        name: templateName,
        size: '15 KB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Là khách hàng mới', 'Nhóm SPDV', 'Tên SPDV', targetValHeader, 'Người phê duyệt', 'Ghi chú thêm'],
        rowsCount: 6,
        contentValid: true
      };
    } else if (type === 'missing_columns') {
      fileObj = {
        name: templateName,
        size: '12 KB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', targetValHeader], // missing spdv, isNew
        rowsCount: 5,
        contentValid: true
      };
    } else if (type === 'duplicates') {
      fileObj = {
        name: templateName,
        size: '14 KB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Là khách hàng mới', 'Nhóm SPDV', 'Tên SPDV', targetValHeader],
        rowsCount: 8,
        contentValid: true,
        hasDuplicates: true
      };
    }

    // Step 4.2 check format
    if (fileObj.name.endsWith('.pdf')) {
      alert(`File ${fileObj.name} không đúng định dạng file excel. Xin vui lòng kiểm tra lại.`);
      return;
    }

    // Check rows count
    if (fileObj.rowsCount > 10000) {
      alert("File không được phép import quá 10.000 bản ghi. Xin vui lòng kiểm tra lại.");
      return;
    }

    setUploadedFile(fileObj);
    setExcelRowsCount(fileObj.rowsCount);
    setFileHeaders(fileObj.headers);
    
    // Auto-map logic default
    const mapping = {};
    const targets = ['unit', 'group', 'customer', 'isNew', 'spdvGroup', 'spdvName', 'th'];
    const colLabels = ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Là khách hàng mới', 'Nhóm SPDV', 'Tên SPDV', targetValHeader];
    
    targets.forEach((t, index) => {
      const label = colLabels[index];
      if (fileObj.headers.includes(label)) {
        mapping[t] = label;
      } else {
        mapping[t] = '';
      }
    });
    setColumnMapping(mapping);

    // Proceed to Step 2 mapping
    setImportStep(2);
  };

  // Proceed mapping validation (Test step)
  const handleTestImport = () => {
    setIsTesting(true);
    setValidationResult(null);

    setTimeout(() => {
      setIsTesting(false);

      // Business Rule: Check for column mismatch
      const mappedKeys = Object.keys(columnMapping);
      const unmapped = mappedKeys.filter(k => columnMapping[k] === '');
      const reportHeadersCount = 7; // Required fields

      if (uploadedFile.headers.length > reportHeadersCount) {
        const extraCount = uploadedFile.headers.length - reportHeadersCount;
        setValidationResult({
          status: 'error',
          msg: `Cập nhật kết quả cần ${reportHeadersCount}, thừa ${extraCount} cột`
        });
        setImportStep(3);
        return;
      }

      if (unmapped.length > 0) {
        setValidationResult({
          status: 'error',
          msg: `Cập nhật kết quả cần ${reportHeadersCount} cột, thiếu ${unmapped.length} cột`
        });
        setImportStep(3);
        return;
      }

      // Current simulation date
      const sysDate = new Date(simulatedSystemDate);
      const sysYear = sysDate.getFullYear();
      const sysMonth = sysDate.getMonth() + 1; // 1-indexed
      const sysDay = sysDate.getDate();

      // Selected period for import
      const impYearNum = parseInt(importYear, 10);
      const impMonthNum = parseInt(importPeriod.substring(1), 10); // m1 -> 1, m5 -> 5

      if (importDataType === 'cust_count' || importDataType === 'service_quality') {
        setValidationResult({
          status: 'success',
          msg: `Kiểm tra thành công: [${uploadedFile.rowsCount}/${uploadedFile.rowsCount}] dòng hợp lệ. Sẵn sàng nạp dữ liệu.`,
          parsedRows: []
        });
        setImportStep(3);
        return;
      }

      if (importDataType === 'estimate') {
        // Business Rule for Estimate:
        // 1. Time-window: Must be between day 22 and 25
        // 2. Applied period: Must be the current month (same month, same year)
        const isTimeWindowActive = sysDay >= 22 && sysDay <= 25;
        const isCurrentMonth = impMonthNum === sysMonth && impYearNum === sysYear;

        if (!isCurrentMonth || !isTimeWindowActive) {
          const errorMsg = `Chỉ được phép nạp Ước thực hiện từ ngày 22 đến ngày 25 hàng tháng cho kỳ hiện tại (${sysMonth}/${sysYear}). Hiện tại giả lập là ngày ${sysDay}/${sysMonth}/${sysYear}.`;
          setValidationResult({
            status: 'error',
            msg: errorMsg,
            errorFileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Dòng 1: ${errorMsg}\n`)
          });

          // Trigger automatic error log download
          const link = document.createElement('a');
          link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Dòng 1: ${errorMsg}\n`);
          link.download = 'Import_Errors_Estimate_TimeWindow.txt';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setImportStep(3);
          return;
        }

        // Rule: check every row and column value. Values must be > 1.
        if (uploadedFile.hasDuplicates) {
          const errorContent = `Dòng 3 (Khách hàng R-3): Giá trị ước thực hiện (0) phải lớn hơn 1.\nDòng 5 (Khách hàng R-5): Giá trị ước thực hiện (1) phải lớn hơn 1.`;
          setValidationResult({
            status: 'error',
            msg: `Kiểm tra từng dòng: Phát hiện 2 dòng có giá trị ước thực hiện <= 1. Vui lòng kiểm tra file log lỗi.`,
            errorFileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(errorContent)
          });

          // Trigger automatic download
          const link = document.createElement('a');
          link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(errorContent);
          link.download = 'Import_Errors_Estimate_Values.txt';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setImportStep(3);
          return;
        }

        // Clean estimate parsed rows
        const parsed = [
          { rowId: 'R-1', value: 1200 },
          { rowId: 'R-2', value: 1500 },
          { rowId: 'R-3', value: 1100 },
          { rowId: 'R-4', value: 2000 },
          { rowId: 'R-5', value: 1300 },
          { rowId: 'R-6', value: 1000 },
          { rowId: 'R-7', value: 1400 }
        ];

        setValidationResult({
          status: 'success',
          msg: `Kiểm tra thành công: [${uploadedFile.rowsCount}/${uploadedFile.rowsCount}] dòng hợp lệ. Giá trị Ước TH đều lớn hơn 1.`,
          parsedRows: parsed
        });
        setImportStep(3);
        return;
      }

      // -- Official TH Import Logic --
      let isAllowed = true;
      let errorMsg = '';

      if (impYearNum < sysYear) {
        isAllowed = false;
      } else if (impYearNum > sysYear) {
        isAllowed = false;
      } else {
        if (impMonthNum === sysMonth) {
          isAllowed = true;
        } else if (impMonthNum === sysMonth - 1) {
          if (sysDay <= 10) {
            isAllowed = true;
          } else {
            isAllowed = false;
          }
        } else {
          isAllowed = false;
        }
      }

      if (!isAllowed) {
        const invalidMonths = [];
        for (let m = 1; m < sysMonth; m++) {
          if (sysDay > 10 || m < sysMonth - 1) {
            invalidMonths.push(m);
          }
        }
        
        errorMsg = `Hạn cập nhật báo cáo của bạn là ngày 10, Không thể update số TH các kỳ KPI tháng ${invalidMonths.join(',')}`;
        setValidationResult({
          status: 'error',
          msg: errorMsg,
          errorFileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Dòng 1: ${errorMsg}\n`)
        });

        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Dòng 1: ${errorMsg}\n`);
        link.download = 'Import_Errors_Period.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setImportStep(3);
        return;
      }

      if (uploadedFile.hasDuplicates) {
        const errorContent = `Dòng 2: Thông tin bị trùng (Nhóm khách hàng bị duplicated)\nDòng 5: Thông tin bị trùng (Nhóm khách hàng bị duplicated)`;
        setValidationResult({
          status: 'error',
          msg: `2/${uploadedFile.rowsCount} dòng không hợp lệ. Vui lòng xem chi tiết lỗi để kiểm tra.`,
          errorFileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(errorContent)
        });

        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(errorContent);
        link.download = 'Import_Errors_Duplicate.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setImportStep(3);
        return;
      }

      const parsed = [
        { rowId: 'R-1', value: 1450 },
        { rowId: 'R-2', value: 1600 },
        { rowId: 'R-3', value: 850 },
        { rowId: 'R-4', value: 2300 },
        { rowId: 'R-5', value: 1200 },
        { rowId: 'R-6', value: 950 },
        { rowId: 'R-7', value: 1550 }
      ];

      setValidationResult({
        status: 'success',
        msg: `[${uploadedFile.rowsCount}/${uploadedFile.rowsCount}] dòng hợp lệ. Có thể tiến hành nạp dữ liệu!`,
        parsedRows: parsed
      });
      setImportStep(3);

    }, 1500);
  };

  // Perform Final Database integration (Import step)
  const handleImportToDatabase = () => {
    setIsImporting(true);

    setTimeout(() => {
      setIsImporting(false);

      if (simulateServerError) {
        alert("Import thất bại do sự cố máy chủ hoặc xung đột dữ liệu. Không có bản ghi nào được lưu. Vui lòng thử lại!");
        return;
      }

      if (importDataType === 'estimate') {
        // Save to estimatesDb
        const updatedEsts = { ...estimatesDb };
        const logsToAdd = [];
        
        if (validationResult && validationResult.parsedRows) {
          validationResult.parsedRows.forEach(p => {
            const key = `${p.rowId}_${importYear}_${importPeriod}`;
            const oldVal = updatedEsts[key] || 0;
            updatedEsts[key] = p.value;

            // Log details
            logsToAdd.push(`[Excel Import] Mã dòng ${p.rowId}: Số ước cũ ${oldVal.toLocaleString('vi-VN')} -> Số ước mới ${p.value.toLocaleString('vi-VN')}`);
          });
        }
        setEstimatesDb(updatedEsts);

        // Add to history Timeline logs
        const newLog = {
          id: `h-${Date.now()}`,
          user: 'thomnguyen_os',
          avatarClass: 'avatar-purple',
          avatarInitial: 'T',
          time: 'vừa xong',
          type: 'estimate',
          fileName: uploadedFile.name,
          details: [
            `Nạp Excel Ước thực hiện tháng ${importPeriod.toUpperCase()}/${importYear} thành công.`,
            `Tổng số lượng dòng nạp vào: ${uploadedFile.rowsCount} dòng.`,
            ...logsToAdd
          ]
        };
        setHistoryLogs(prev => [newLog, ...prev]);

        alert(`Đã nạp thành công số ước thực hiện cho kỳ KPI ${importPeriod.toUpperCase()}/${importYear}!`);
      } else if (importDataType === 'cust_count') {
        // Add to timeline history
        const newLog = {
          id: `h-${Date.now()}`,
          user: 'thomnguyen_os',
          avatarClass: 'avatar-purple',
          avatarInitial: 'T',
          time: 'vừa xong',
          type: 'file',
          fileName: uploadedFile.name,
          details: [
            `Cập nhật số liệu Số lượng KH & HĐ mới kỳ ${importPeriod.toUpperCase()}/${importYear} thành công.`,
            `Số lượng bản ghi nạp vào CSDL: ${uploadedFile.rowsCount} dòng.`,
          ]
        };
        setHistoryLogs(prev => [newLog, ...prev]);
        alert(`Đã nạp thành công số liệu Số lượng KH & HĐ mới cho kỳ KPI ${importPeriod.toUpperCase()}/${importYear}!`);
      } else if (importDataType === 'service_quality') {
        // Add to timeline history
        const newLog = {
          id: `h-${Date.now()}`,
          user: 'thomnguyen_os',
          avatarClass: 'avatar-purple',
          avatarInitial: 'T',
          time: 'vừa xong',
          type: 'file',
          fileName: uploadedFile.name,
          details: [
            `Cập nhật số liệu Chỉ tiêu Chất lượng dịch vụ kỳ ${importPeriod.toUpperCase()}/${importYear} thành công.`,
            `Số lượng bản ghi nạp vào CSDL: ${uploadedFile.rowsCount} dòng.`,
          ]
        };
        setHistoryLogs(prev => [newLog, ...prev]);
        alert(`Đã nạp thành công số liệu Chất lượng dịch vụ cho kỳ KPI ${importPeriod.toUpperCase()}/${importYear}!`);
      } else {
        // Apply imported values to dbValues
        const updated = { ...dbValues };
        if (validationResult && validationResult.parsedRows) {
          validationResult.parsedRows.forEach(p => {
            const key = `${p.rowId}_${importYear}_${importPeriod}`;
            updated[key] = {
              ...updated[key],
              th: p.value
            };
          });
        }
        setDbValues(updated);

        // Auto-close period: add to officialMonths
        if (!officialMonths.includes(importPeriod)) {
          setOfficialMonths(prev => [...prev, importPeriod]);
        }

        // Add to timeline history
        const newLog = {
          id: `h-${Date.now()}`,
          user: 'thomnguyen_os',
          avatarClass: 'avatar-purple',
          avatarInitial: 'T',
          time: 'vừa xong',
          type: 'file',
          fileName: uploadedFile.name,
          details: [
            `Cập nhật số thực hiện kỳ KPI ${importPeriod.toUpperCase()}/${importYear} thành công.`,
            `Số lượng bản ghi nạp vào CSDL: ${uploadedFile.rowsCount} dòng.`,
            `Trạng thái kỳ ${importPeriod.toUpperCase()}/${importYear} đã được chốt và đóng sổ.`
          ]
        };
        setHistoryLogs(prev => [newLog, ...prev]);

        alert(`Đã nạp thành công số thực hiện cho kỳ KPI ${importPeriod.toUpperCase()}/${importYear}!`);
      }

      handleCloseImportModal();

    }, 2000);
  };

  // --- EXCEL EXPORT FLOW ---
  const [simulateExportOver20s, setSimulateExportOver20s] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setShowExportModal(false);

    setTimeout(() => {
      setIsExporting(false);

      if (simulateExportOver20s) {
        // Send email message
        alert("Hệ thống phát hiện tệp xuất dung lượng lớn (quá 20s). Tiến trình sẽ được xử lý ngầm và gửi link tải về email của bạn (thomnguyen_os@company.vn) sau khi hoàn tất. Vui lòng kiểm tra hộp thư!");
      } else {
        let csvContent = '\ufeff'; // UTF-8 BOM for Excel compatibility to support Vietnamese characters
        let fileName = '';

        if (exportTemplate === 'detail') {
          fileName = `Detailed_Matrix_Report_${selectedYear}.csv`;
          
          let header = 'Đơn vị thực hiện,Nhóm khách hàng,Tên khách hàng,Nhóm SPDV,Tên SPDV,Là khách hàng mới';
          Array.from({ length: 12 }, (_, i) => i + 1).forEach(m => {
            header += `,Tháng ${m} - KH,Tháng ${m} - Ước TH,Tháng ${m} - TH`;
          });
          Array.from({ length: 4 }, (_, i) => i + 1).forEach(q => {
            header += `,Quý ${q} - KH,Quý ${q} - TH`;
          });
          header += ',Cả năm - KH,Cả năm - TH\n';
          csvContent += header;

          filteredAndSortedData.forEach(r => {
            const valScale = activeTab === 'ket_qua_doanh_thu' ? 1.5 : 1;
            let rowCsv = `"${r.implementationUnit}","${r.customerGroup}","${r.customerName}","${r.spdvGroup}","${r.spdvName}",${r.isNewCustomer}`;
            
            // Months
            Array.from({ length: 12 }, (_, i) => i + 1).forEach(m => {
              const periodKey = `m${m}`;
              const valKey = `${r.id}_${selectedYear}_${periodKey}`;
              const val = dbValues[valKey] || { kh: 0, th: 0 };
              const estVal = estimatesDb[valKey] || '';
              const isClosed = officialMonths.includes(periodKey);
              const scaledKh = Math.round(val.kh * valScale);
              const scaledTh = Math.round(val.th * valScale);
              const scaledEst = estVal ? Math.round(estVal * valScale) : '';
              rowCsv += `,${scaledKh},${scaledEst},${isClosed ? scaledTh : ''}`;
            });

            // Quarters
            Array.from({ length: 4 }, (_, i) => i + 1).forEach(q => {
              const periodKey = `q${q}`;
              const valKey = `${r.id}_${selectedYear}_${periodKey}`;
              const val = dbValues[valKey] || { kh: 0, th: 0 };
              const scaledKh = Math.round(val.kh * valScale);
              const scaledTh = Math.round(val.th * valScale);
              rowCsv += `,${scaledKh},${scaledTh}`;
            });

            // Year
            const yearVal = dbValues[`${r.id}_${selectedYear}_y`] || { kh: 0, th: 0 };
            const scaledKh = Math.round(yearVal.kh * valScale);
            const scaledTh = Math.round(yearVal.th * valScale);
            rowCsv += `,${scaledKh},${scaledTh}\n`;

            csvContent += rowCsv;
          });
        } else {
          fileName = `Internal_Revenue_Summary_Report_${selectedYear}.csv`;
          csvContent += 'BIỂU MẪU DOANH THU NỘI BỘ TỔNG HỢP\n\n';
          
          // Helper to format a summary row
          const getSummaryRowCsv = (label, periodsData) => {
            const cols = allPeriodsKeys.map(p => periodsData[p].th);
            return `"${label}",` + cols.join(',') + '\n';
          };

          // 2.1
          csvContent += '2.1 Biểu tổng hợp kết quả theo đơn vị thực hiện\n';
          csvContent += 'Đơn vị thực hiện,' + allPeriodsKeys.map(p => getPeriodLabel(p)).join(',') + '\n';
          summaryCalculations.unitData.forEach(ud => {
            csvContent += getSummaryRowCsv(ud.unitName, ud.periods);
          });
          
          // 2.2
          csvContent += '\n2.2 Số lượng hoàn thành kế hoạch\n';
          csvContent += 'Chỉ tiêu thống kê,' + allPeriodsKeys.map(p => getPeriodLabel(p)).join(',') + '\n';
          csvContent += '"Tổng số lượng đơn vị thực hiện",';
          csvContent += allPeriodsKeys.map(p => summaryCalculations.unitCompletion[p].total).join(',') + '\n';
          csvContent += '"Số lượng đơn vị hoàn thành kế hoạch >= 100%",';
          csvContent += allPeriodsKeys.map(p => summaryCalculations.unitCompletion[p].completed).join(',') + '\n';
          csvContent += '"Tỷ lệ hoàn thành (%)",';
          csvContent += allPeriodsKeys.map(p => `${summaryCalculations.unitCompletion[p].rate}%`).join(',') + '\n\n';

          // 2.3
          csvContent += '2.3 Tổng hợp kết quả thực hiện theo nhóm khách hàng\n';
          csvContent += 'Nhóm khách hàng,' + allPeriodsKeys.map(p => getPeriodLabel(p)).join(',') + '\n';
          summaryCalculations.customerGroupData.forEach(cgd => {
            csvContent += getSummaryRowCsv(cgd.groupName, cgd.periods);
          });
          csvContent += '\n';

          // 2.4
          csvContent += '2.4 Tổng hợp kết quả thực hiện theo nhóm SPDV\n';
          csvContent += 'Nhóm SPDV,' + allPeriodsKeys.map(p => getPeriodLabel(p)).join(',') + '\n';
          summaryCalculations.spdvGroupData.forEach(sgd => {
            csvContent += getSummaryRowCsv(sgd.spgName, sgd.periods);
          });
          csvContent += '\n';

          // 2.5
          csvContent += '2.5 Tỉ lệ nhóm SPDV hoàn thành kế hoạch\n';
          csvContent += 'Chỉ số đánh giá SPDV,' + allPeriodsKeys.map(p => getPeriodLabel(p)).join(',') + '\n';
          csvContent += '"Tổng số nhóm SPDV",';
          csvContent += allPeriodsKeys.map(p => summaryCalculations.spdvCompletion[p].total).join(',') + '\n';
          csvContent += '"Số nhóm SPDV hoàn thành tối thiểu 100%",';
          csvContent += allPeriodsKeys.map(p => summaryCalculations.spdvCompletion[p].completed).join(',') + '\n';
          csvContent += '"Tỷ lệ nhóm SPDV hoàn thành tối thiểu 100%/Tổng số nhóm SPDV (%)",';
          csvContent += allPeriodsKeys.map(p => `${summaryCalculations.spdvCompletion[p].rate}%`).join(',') + '\n';
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Tải file báo cáo Excel về máy thành công!");
      }

    }, 1800);
  };


  const getRowPeriodComparison = (row, periodKey, valScale) => {
    const valKey = `${row.id}_${selectedYear}_${periodKey}`;
    const val = dbValues[valKey] || { kh: 0, th: 0 };
    const scaledKh = Math.round(val.kh * valScale);
    const scaledTh = Math.round(val.th * valScale);
    const estVal = estimatesDb[valKey] || null;
    const scaledEst = estVal ? Math.round(estVal * valScale) : 0;

    // Group 1: Plan comparison
    const diffSoKh = scaledTh - scaledKh;
    const htkhRate = scaledKh > 0 ? Math.round((scaledTh / scaledKh) * 100) : 0;
    
    // Group 2: preceding period
    let prevPeriodKey = periodKey;
    let prevYear = parseInt(selectedYear, 10);
    if (periodKey.startsWith('m')) {
      const mNum = parseInt(periodKey.substring(1), 10);
      if (mNum === 1) {
        prevPeriodKey = 'm12';
        prevYear -= 1;
      } else {
        prevPeriodKey = `m${mNum - 1}`;
      }
    } else if (periodKey.startsWith('q')) {
      const qNum = parseInt(periodKey.substring(1), 10);
      if (qNum === 1) {
        prevPeriodKey = 'q4';
        prevYear -= 1;
      } else {
        prevPeriodKey = `q${qNum - 1}`;
      }
    } else if (periodKey === 'y') {
      prevPeriodKey = 'y';
      prevYear -= 1;
    }
    const prevValKey = `${row.id}_${prevYear}_${prevPeriodKey}`;
    const prevVal = dbValues[prevValKey] || { kh: 0, th: 0 };
    const scaledThPrev = Math.round(prevVal.th * valScale);
    const prevEstVal = estimatesDb[prevValKey] || null;
    const scaledEstPrev = prevEstVal ? Math.round(prevEstVal * valScale) : 0;

    const diffMoM = scaledTh - scaledThPrev;
    const deltaMoM = scaledThPrev > 0 ? Math.round((diffMoM / scaledThPrev) * 100) : 0;

    // Group 3: YoY
    const yoyPeriodKey = periodKey;
    const yoyYear = parseInt(selectedYear, 10) - 1;
    const yoyValKey = `${row.id}_${yoyYear}_${yoyPeriodKey}`;
    const yoyVal = dbValues[yoyValKey] || { kh: 0, th: 0 };
    const scaledThYoY = Math.round(yoyVal.th * valScale);
    const yoyEstVal = estimatesDb[yoyValKey] || null;
    const scaledEstYoY = yoyEstVal ? Math.round(yoyEstVal * valScale) : 0;

    const diffYoY = scaledTh - scaledThYoY;
    const deltaYoY = scaledThYoY > 0 ? Math.round((diffYoY / scaledThYoY) * 100) : 0;

    return {
      kh: scaledKh,
      th: scaledTh,
      est: scaledEst,
      diffSoKh,
      htkhRate,
      thPrev: scaledThPrev,
      estPrev: scaledEstPrev,
      diffMoM,
      deltaMoM,
      thYoY: scaledThYoY,
      estYoY: scaledEstYoY,
      diffYoY,
      deltaYoY
    };
  };

  const renderPeriodCompCells = (row, periodKey, valScale, isMonth = false) => {
    const comp = getRowPeriodComparison(row, periodKey, valScale);
    const isClosed = isMonth ? officialMonths.includes(periodKey) : true;

    const fmt = (val) => val.toLocaleString('vi-VN');
    const getDiffText = (val) => val > 0 ? `+${fmt(val)}` : fmt(val);
    const getDeltaText = (val) => val > 0 ? `+${val}%` : `${val}%`;

    const diffSoKhColor = comp.diffSoKh > 0 ? '#059669' : comp.diffSoKh < 0 ? '#dc2626' : '#64748b';
    const htkhRateColor = comp.htkhRate >= 100 ? '#059669' : '#dc2626';

    const diffMoMColor = comp.diffMoM > 0 ? '#059669' : comp.diffMoM < 0 ? '#dc2626' : '#64748b';
    const deltaMoMColor = comp.deltaMoM > 0 ? '#0284c7' : comp.deltaMoM < 0 ? '#dc2626' : '#64748b';

    const diffYoYColor = comp.diffYoY > 0 ? '#059669' : comp.diffYoY < 0 ? '#dc2626' : '#64748b';
    const deltaYoYColor = comp.deltaYoY > 0 ? '#0284c7' : comp.deltaYoY < 0 ? '#dc2626' : '#64748b';

    return (
      <React.Fragment key={periodKey}>
        {/* Group 1 */}
        <td className="cell-right">{fmt(comp.kh)}</td>
        {isMonth && (
          <td className="cell-right" style={{ color: comp.est > 0 ? '#ea580c' : '#94a3b8', fontStyle: comp.est > 0 ? 'normal' : 'italic' }}>
            {comp.est > 0 ? fmt(comp.est) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ fontWeight: '600' }}>
          {isClosed ? (comp.th > 0 ? fmt(comp.th) : '0') : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: diffSoKhColor }}>
          {isClosed ? getDiffText(comp.diffSoKh) : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: htkhRateColor }}>
          {isClosed ? `${comp.htkhRate}%` : '--'}
        </td>

        {/* Group 2 */}
        {isMonth && (
          <td className="cell-right" style={{ background: '#f9fbf9', color: comp.estPrev > 0 ? '#ea580c' : '#94a3b8', fontStyle: comp.estPrev > 0 ? 'normal' : 'italic' }}>
            {comp.estPrev > 0 ? fmt(comp.estPrev) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ background: '#f9fbf9', color: '#475569' }}>
          {comp.thPrev > 0 ? fmt(comp.thPrev) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffMoMColor }}>
          {isClosed ? getDiffText(comp.diffMoM) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaMoMColor }}>
          {isClosed ? getDeltaText(comp.deltaMoM) : '--'}
        </td>

        {/* Group 3 */}
        {isMonth && (
          <td className="cell-right" style={{ background: '#f8fafc', color: comp.estYoY > 0 ? '#ea580c' : '#94a3b8', fontStyle: comp.estYoY > 0 ? 'normal' : 'italic' }}>
            {comp.estYoY > 0 ? fmt(comp.estYoY) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ background: '#f8fafc', color: '#475569' }}>
          {comp.thYoY > 0 ? fmt(comp.thYoY) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffYoYColor }}>
          {isClosed ? getDiffText(comp.diffYoY) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaYoYColor }}>
          {isClosed ? getDeltaText(comp.deltaYoY) : '--'}
        </td>
      </React.Fragment>
    );
  };

  const renderSummaryPeriodCells = (val, isMonth = false, periodKey = '') => {
    const isClosed = isMonth ? officialMonths.includes(periodKey) : true;
    const kh = val.kh;
    const est = val.est || 0;
    const th = val.th;
    const thPrev = val.thPrev;
    const estPrev = val.estPrev || 0;
    const thYoY = val.thYoY;
    const estYoY = val.estYoY || 0;

    // Group 1
    const diffSoKh = th - kh;
    const htkhRate = kh > 0 ? Math.round((th / kh) * 100) : 0;

    // Group 2
    const diffMoM = th - thPrev;
    const deltaMoM = thPrev > 0 ? Math.round((diffMoM / thPrev) * 100) : 0;

    // Group 3
    const diffYoY = th - thYoY;
    const deltaYoY = thYoY > 0 ? Math.round((diffYoY / thYoY) * 100) : 0;

    // Format helpers
    const fmt = (v) => v.toLocaleString('vi-VN');
    const getDiffText = (v) => v > 0 ? `+${fmt(v)}` : fmt(v);
    const getDeltaText = (v) => v > 0 ? `+${v}%` : `${v}%`;

    const diffSoKhColor = diffSoKh > 0 ? '#059669' : diffSoKh < 0 ? '#dc2626' : '#64748b';
    const htkhRateColor = htkhRate >= 100 ? '#059669' : '#dc2626';

    const diffMoMColor = diffMoM > 0 ? '#059669' : diffMoM < 0 ? '#dc2626' : '#64748b';
    const deltaMoMColor = deltaMoM > 0 ? '#0284c7' : deltaMoM < 0 ? '#dc2626' : '#64748b';

    const diffYoYColor = diffYoY > 0 ? '#059669' : diffYoY < 0 ? '#dc2626' : '#64748b';
    const deltaYoYColor = deltaYoY > 0 ? '#0284c7' : deltaYoY < 0 ? '#dc2626' : '#64748b';

    return (
      <React.Fragment key={periodKey}>
        {/* Group 1 */}
        <td className="cell-right">{fmt(kh)}</td>
        {isMonth && (
          <td className="cell-right" style={{ color: est > 0 ? '#ea580c' : '#94a3b8', fontStyle: est > 0 ? 'normal' : 'italic' }}>
            {est > 0 ? fmt(est) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ fontWeight: '600' }}>
          {isClosed ? (th > 0 ? fmt(th) : '0') : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: diffSoKhColor }}>
          {isClosed ? getDiffText(diffSoKh) : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: htkhRateColor }}>
          {isClosed ? `${htkhRate}%` : '--'}
        </td>

        {/* Group 2 */}
        {isMonth && (
          <td className="cell-right" style={{ background: '#f9fbf9', color: estPrev > 0 ? '#ea580c' : '#94a3b8', fontStyle: estPrev > 0 ? 'normal' : 'italic' }}>
            {estPrev > 0 ? fmt(estPrev) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ background: '#f9fbf9', color: '#475569' }}>
          {thPrev > 0 ? fmt(thPrev) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffMoMColor }}>
          {isClosed ? getDiffText(diffMoM) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaMoMColor }}>
          {isClosed ? getDeltaText(deltaMoM) : '--'}
        </td>

        {/* Group 3 */}
        {isMonth && (
          <td className="cell-right" style={{ background: '#f8fafc', color: estYoY > 0 ? '#ea580c' : '#94a3b8', fontStyle: estYoY > 0 ? 'normal' : 'italic' }}>
            {estYoY > 0 ? fmt(estYoY) : '--'}
          </td>
        )}
        <td className="cell-right" style={{ background: '#f8fafc', color: '#475569' }}>
          {thYoY > 0 ? fmt(thYoY) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffYoYColor }}>
          {isClosed ? getDiffText(diffYoY) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaYoYColor }}>
          {isClosed ? getDeltaText(deltaYoY) : '--'}
        </td>
      </React.Fragment>
    );
  };

  const renderProductionPeriodCells = (row, periodKey, valScale, isMonth = false) => {
    const comp = getRowPeriodComparison(row, periodKey, valScale);
    const isClosed = isMonth ? officialMonths.includes(periodKey) : true;

    const fmt = (val) => val.toLocaleString('vi-VN');
    const getDiffText = (val) => val > 0 ? `+${fmt(val)}` : fmt(val);
    const getDeltaText = (val) => val > 0 ? `+${val}%` : `${val}%`;

    const diffMoMColor = comp.diffMoM > 0 ? '#059669' : comp.diffMoM < 0 ? '#dc2626' : '#64748b';
    const deltaMoMColor = comp.deltaMoM > 0 ? '#0284c7' : comp.deltaMoM < 0 ? '#dc2626' : '#64748b';

    const diffYoYColor = comp.diffYoY > 0 ? '#059669' : comp.diffYoY < 0 ? '#dc2626' : '#64748b';
    const deltaYoYColor = comp.deltaYoY > 0 ? '#0284c7' : comp.deltaYoY < 0 ? '#dc2626' : '#64748b';

    return (
      <React.Fragment key={periodKey}>
        {/* Group 1: Thực hiện so với kế hoạch Tập đoàn */}
        <td className="cell-right" style={{ fontWeight: '600' }}>
          {isClosed ? (comp.th > 0 ? fmt(comp.th) : '0') : '--'}
        </td>

        {/* Group 2: So Tháng trước / Quý trước */}
        <td className="cell-right" style={{ background: '#f9fbf9', color: '#475569' }}>
          {comp.thPrev > 0 ? fmt(comp.thPrev) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffMoMColor }}>
          {isClosed ? getDiffText(comp.diffMoM) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaMoMColor }}>
          {isClosed ? getDeltaText(comp.deltaMoM) : '--'}
        </td>

        {/* Group 3: So cùng kỳ năm trước */}
        <td className="cell-right" style={{ background: '#f8fafc', color: '#475569' }}>
          {comp.thYoY > 0 ? fmt(comp.thYoY) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffYoYColor }}>
          {isClosed ? getDiffText(comp.diffYoY) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaYoYColor }}>
          {isClosed ? getDeltaText(comp.deltaYoY) : '--'}
        </td>
      </React.Fragment>
    );
  };

  const renderCustomMultiSelect = (type, labelText, itemsList, selectedItems, onToggleItem, selectAllFunc, deselectAllFunc) => {
    return (
      <div className="advanced-filter-row">
        <label>{labelText}</label>
        <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
          <div 
            className="custom-select-trigger"
            onClick={() => setActiveDropdown(activeDropdown === type ? null : type)}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: '#f1f5f9', 
              padding: '10px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              color: '#334155',
              height: '40px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
              {selectedItems.length === 0 ? '-- Chọn giá trị --' : selectedItems.join(', ')}
            </span>
            <ChevronDown size={16} style={{ color: '#64748b' }} />
          </div>
          {activeDropdown === type && (
            <div 
              className="custom-select-options-box"
              style={{ 
                position: 'absolute', 
                top: '44px', 
                left: 0, 
                right: 0, 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '6px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
                zIndex: 1001, 
                maxHeight: '200px', 
                overflowY: 'auto',
                padding: '6px 0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', gap: '8px', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span 
                  style={{ color: '#ee0033', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => { selectAllFunc(); setCurrentPage(1); }}
                >
                  Chọn tất cả
                </span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span 
                  style={{ color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => { deselectAllFunc(); setCurrentPage(1); }}
                >
                  Bỏ chọn tất cả
                </span>
              </div>
              {itemsList.map(item => {
                const isSelected = selectedItems.includes(item);
                return (
                  <label 
                    key={item} 
                    className="multi-select-option"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 12px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#334155'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => { onToggleItem(item); setCurrentPage(1); }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPeriodMultiSelect = () => {
    let periodText = '-- Chọn giá trị --';
    if (selectedPeriods.length > 0) {
      const labels = selectedPeriods.map(p => {
        if (p.startsWith('m')) return `T${p.substring(1)}`;
        if (p.startsWith('q')) return `Q${p.substring(1)}`;
        return 'Năm';
      });
      periodText = labels.join(', ');
    }

    return (
      <div className="advanced-filter-row">
        <label>Kỳ Doanh Thu</label>
        <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
          <div 
            className="custom-select-trigger"
            onClick={() => setActiveDropdown(activeDropdown === 'periods' ? null : 'periods')}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: '#f1f5f9', 
              padding: '10px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              color: '#334155',
              height: '40px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
              {periodText}
            </span>
            <ChevronDown size={16} style={{ color: '#64748b' }} />
          </div>
          {activeDropdown === 'periods' && (
            <div 
              className="custom-select-options-box"
              style={{ 
                position: 'absolute', 
                top: '44px', 
                left: 0, 
                right: 0, 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '6px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
                zIndex: 1001, 
                maxHeight: '200px', 
                overflowY: 'auto',
                padding: '6px 0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', gap: '8px', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span 
                  style={{ color: '#ee0033', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => {
                    const allPeriods = [
                      ...Array.from({ length: 12 }, (_, i) => `m${i + 1}`),
                      ...Array.from({ length: 4 }, (_, i) => `q${i + 1}`),
                      'y'
                    ];
                    setSelectedPeriods(allPeriods);
                    setCurrentPage(1);
                  }}
                >
                  Chọn tất cả
                </span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span 
                  style={{ color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => {
                    setSelectedPeriods(['m6']);
                    setCurrentPage(1);
                  }}
                >
                  Bỏ chọn tất cả
                </span>
              </div>

              <div className="multi-select-group-label" style={{ fontWeight: 'bold', fontSize: '11px', padding: '4px 8px', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Tháng</div>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <label key={`m${m}`} className="multi-select-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedPeriods.includes(`m${m}`)}
                    onChange={() => {
                      const val = `m${m}`;
                      setSelectedPeriods(prev => 
                        prev.includes(val) 
                          ? (prev.length > 1 ? prev.filter(p => p !== val) : prev) 
                          : [...prev, val]
                      );
                      setCurrentPage(1);
                    }}
                  />
                  <span>Tháng {m}</span>
                </label>
              ))}

              <div className="multi-select-group-label" style={{ fontWeight: 'bold', fontSize: '11px', padding: '4px 8px', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>Quý</div>
              {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                <label key={`q${q}`} className="multi-select-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedPeriods.includes(`q${q}`)}
                    onChange={() => {
                      const val = `q${q}`;
                      setSelectedPeriods(prev => 
                        prev.includes(val) 
                          ? (prev.length > 1 ? prev.filter(p => p !== val) : prev) 
                          : [...prev, val]
                      );
                      setCurrentPage(1);
                    }}
                  />
                  <span>Quý {q}</span>
                </label>
              ))}

              <div className="multi-select-group-label" style={{ fontWeight: 'bold', fontSize: '11px', padding: '4px 8px', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>Năm</div>
              <label className="multi-select-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={selectedPeriods.includes('y')}
                  onChange={() => {
                    const val = 'y';
                    setSelectedPeriods(prev => 
                      prev.includes(val) 
                        ? (prev.length > 1 ? prev.filter(p => p !== val) : prev) 
                        : [...prev, val]
                    );
                    setCurrentPage(1);
                  }}
                />
                <span>Cả năm</span>
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="goal-result-container">
      {/* Header */}
      <div className="page-title-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0 }}>{activeTab === 'ket_qua_doanh_thu' ? 'Kết quả doanh thu' : 'Sản lượng nghiệm thu'}</h1>
          <span className="badge-plan-type" style={{ padding: '4px 12px', background: '#fef2f2', color: '#EE0033', borderRadius: '16px', fontSize: '13px', fontWeight: '700', border: '1px solid #fee2e2' }}>
            {activePlanTab === 'Kế hoạch nội bộ' ? 'Nội bộ' : 'Tập đoàn'}
          </span>
        </div>
        <p style={{ marginTop: '8px' }}>QUẢN LÝ CHI TIẾT CƠ HỘI VÀ KHÁCH HÀNG TIỀM NĂNG</p>

        {/* Tabs Bar */}
        <div className="tabs-container">
          <div 
            className={`tab-item ${activeTab === 'ket_qua_doanh_thu' ? 'active' : ''}`}
            onClick={() => handleTabClick('ket_qua_doanh_thu')}
          >
            Kết quả doanh thu
          </div>
          <div 
            className={`tab-item ${activeTab === 'san_luong_nghiem_thu' ? 'active' : ''}`}
            onClick={() => handleTabClick('san_luong_nghiem_thu')}
          >
            Sản lượng nghiệm thu
          </div>
        </div>
      </div>



      {/* KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Tổng doanh thu' : 'Tổng sản lượng'}
          </span>
          <span className="kpi-card-value">{summaryStats.total}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu khách hàng VTT' : 'Sản lượng khách hàng VTT'}
          </span>
          <span className="kpi-card-value">{summaryStats.internal}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu từ nội bộ (ngoài VTT)' : 'Sản lượng từ nội bộ (ngoài VTT)'}
          </span>
          <span className="kpi-card-value">{summaryStats.external}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu từ khách hàng ngoài tập đoàn' : 'Sản lượng từ khách hàng ngoài tập đoàn'}
          </span>
          <span className="kpi-card-value">{summaryStats.international}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu Global' : 'Sản lượng Global'}
          </span>
          <span className="kpi-card-value">{summaryStats.global}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu DV mới' : 'Sản lượng DV mới'}
          </span>
          <span className="kpi-card-value">{summaryStats.newService}</span>
        </div>
      </div>

      {/* Instant Actions & Filters */}
      <div className="actions-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Mã/MST/Tên viết tắt/Tên viết đầy đủ..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="action-buttons-group">
          <button className="btn-filter-advanced" onClick={() => setShowAdvancedFilters(true)}>
            <Filter size={16} />
            Lọc nâng cao
          </button>

          {/* Unified Import Excel button */}
          <button 
            className="btn-excel-action" 
            onClick={() => {
              setImportDataType('estimate');
              setImportStep(1);
              setShowImportModal(true);
            }}
          >
            <Upload size={16} />
            Nhập Excel
          </button>

          <button className="btn-excel-action" onClick={handleExportData}>
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Matrix Grid Card Wrapper */}
      <div className="table-card-wrapper">
        <div className="table-scroll-container">
          <table className="result-data-table">
            <thead>
              {/* Level 1: Time period grouping */}
              <tr>
                {activePlanTab !== 'Kế hoạch tập đoàn' && activeTab !== 'san_luong_nghiem_thu' && (
                  <th rowSpan={3} className="sticky-col-1 matrix-group-title" style={{ left: leftOffsets.col1, width: colWidths.col1, minWidth: colWidths.col1, maxWidth: colWidths.col1, position: 'sticky' }} title="Đơn vị thực hiện">
                    Đơn vị thực hiện
                    <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col1', e)} />
                  </th>
                )}
                <th rowSpan={3} className="sticky-col-2 matrix-group-title" style={{ left: leftOffsets.col2, width: colWidths.col2, minWidth: colWidths.col2, maxWidth: colWidths.col2, position: 'sticky' }} title="Nhóm khách hàng">
                  Nhóm khách hàng
                  <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col2', e)} />
                </th>
                <th rowSpan={3} className="sticky-col-3 matrix-group-title" style={{ left: leftOffsets.col3, width: colWidths.col3, minWidth: colWidths.col3, maxWidth: colWidths.col3, position: 'sticky' }} title="Tên khách hàng">
                  Tên khách hàng
                  <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col3', e)} />
                </th>
                <th rowSpan={3} className="sticky-col-4 matrix-group-title cell-center" style={{ left: leftOffsets.col4, width: colWidths.col4, minWidth: colWidths.col4, maxWidth: colWidths.col4, position: 'sticky' }} title="KH Mới">
                  KH Mới
                  <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col4', e)} />
                </th>
                <th rowSpan={3} className="sticky-col-5 matrix-group-title" style={{ left: leftOffsets.col5, width: colWidths.col5, minWidth: colWidths.col5, maxWidth: colWidths.col5, position: 'sticky' }} title="Nhóm SPDV">
                  Nhóm SPDV
                  <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col5', e)} />
                </th>
                <th rowSpan={3} className="sticky-col-6 matrix-group-title" style={{ left: leftOffsets.col6, width: colWidths.col6, minWidth: colWidths.col6, maxWidth: colWidths.col6, position: 'sticky' }} title="Tên SPDV">
                  Tên SPDV
                  <div className="col-resizer" onMouseDown={(e) => handleResizeStart('col6', e)} />
                </th>
                
                {/* Months */}
                {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                  <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 13 : 7} className="matrix-group-title cell-center">
                    Tháng {m}
                  </th>
                ))}

                {/* Quarters */}
                {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                  <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 7} className="matrix-group-title cell-center">
                    Quý {q}
                  </th>
                ))}

                {/* Year */}
                {selectedPeriods.includes('y') && (
                  <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 7} className="matrix-group-title cell-center">
                    Cả năm
                  </th>
                )}
              </tr>
              {/* Level 2 & 3 */}
              {activeTab === 'ket_qua_doanh_thu' ? (
                <>
                  {/* Level 2 (for Revenue): Column Groups */}
                  <tr>
                    {/* Months groups */}
                    {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                      <React.Fragment key={`m_g_${m}`}>
                        <th colSpan={5} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {planCompareText}
                        </th>
                        <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}
                        </th>
                        <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m} năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    ))}
                    {/* Quarters groups */}
                    {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                      <React.Fragment key={`q_g_${q}`}>
                        <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {planCompareText}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Quý {q} năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    ))}
                    {/* Year groups */}
                    {selectedPeriods.includes('y') && (
                      <React.Fragment key="y_g">
                        <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {planCompareText}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Cả năm {parseInt(selectedYear, 10) - 1}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Cả năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    )}
                  </tr>

                  {/* Level 3 (for Revenue): Specific Indicators */}
                  <tr>
                    {/* Months indicators */}
                    {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                      <React.Fragment key={`m_ind_${i}`}>
                        {/* Group 1 */}
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#ea580c' }}>Ước TH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>+/- so KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>% HTKH</th>
                        {/* Group 2 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#ea580c' }}>Ước TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        {/* Group 3 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#ea580c' }}>Ước TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    ))}
                    {/* Quarters indicators */}
                    {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                      <React.Fragment key={`q_ind_${i}`}>
                        {/* Group 1 */}
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>+/- so KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>% HTKH</th>
                        {/* Group 2 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        {/* Group 3 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    ))}
                    {/* Year indicators */}
                    {selectedPeriods.includes('y') && (
                      <React.Fragment key="y_ind">
                        {/* Group 1 */}
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>+/- so KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>% HTKH</th>
                        {/* Group 2 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        {/* Group 3 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    )}
                  </tr>
                </>
              ) : (
                <>
                  {/* Level 2 (for Production): Column Groups */}
                  <tr>
                    {/* Months groups */}
                    {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                      <React.Fragment key={`m_g_${m}`}>
                        <th colSpan={1} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {activePlanTab === 'Kế hoạch nội bộ' ? 'Thực hiện so với kế hoạch Nội bộ' : 'Thực hiện so với kế hoạch Tập đoàn'}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m} năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    ))}
                    {/* Quarters groups */}
                    {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                      <React.Fragment key={`q_g_${q}`}>
                        <th colSpan={1} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {activePlanTab === 'Kế hoạch nội bộ' ? 'Thực hiện so với kế hoạch Nội bộ' : 'Thực hiện so với kế hoạch Tập đoàn'}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Quý {q} năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    ))}
                    {/* Year groups */}
                    {selectedPeriods.includes('y') && (
                      <React.Fragment key="y_g">
                        <th colSpan={1} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          {activePlanTab === 'Kế hoạch nội bộ' ? 'Thực hiện so với kế hoạch Nội bộ' : 'Thực hiện so với kế hoạch Tập đoàn'}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Cả năm {parseInt(selectedYear, 10) - 1}
                        </th>
                        <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Cả năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    )}
                  </tr>

                  {/* Level 3 (for Production): Specific Indicators */}
                  <tr>
                    {/* Months indicators */}
                    {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                      <React.Fragment key={`m_ind_${i}`}>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    ))}
                    {/* Quarters indicators */}
                    {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                      <React.Fragment key={`q_ind_${i}`}>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    ))}
                    {/* Year indicators */}
                    {selectedPeriods.includes('y') && (
                      <React.Fragment key="y_ind">
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                      </React.Fragment>
                    )}
                  </tr>
                </>
              )}
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => {
                  const valScale = activeTab === 'ket_qua_doanh_thu' ? 1.5 : 1;

                  // Contiguous row span logic for units
                  let isFirstUnit = true;
                  let unitSpanCount = 1;
                  if (idx > 0 && paginatedData[idx - 1].implementationUnit === row.implementationUnit) {
                    isFirstUnit = false;
                  } else {
                    let nextIdx = idx + 1;
                    while (nextIdx < paginatedData.length && paginatedData[nextIdx].implementationUnit === row.implementationUnit) {
                      unitSpanCount++;
                      nextIdx++;
                    }
                  }
  
                  return (
                    <tr key={row.id}>
                      {activePlanTab !== 'Kế hoạch tập đoàn' && activeTab !== 'san_luong_nghiem_thu' && isFirstUnit && (
                        <td 
                          className="sticky-col-1 unit-master-cell" 
                          rowSpan={unitSpanCount}
                          style={{ left: leftOffsets.col1, width: colWidths.col1, minWidth: colWidths.col1, maxWidth: colWidths.col1 }}
                          title={row.implementationUnit}
                        >
                          {row.implementationUnit}
                        </td>
                      )}
                      <td className="sticky-col-2" style={{ left: leftOffsets.col2, width: colWidths.col2, minWidth: colWidths.col2, maxWidth: colWidths.col2 }} title={row.customerGroup}>{row.customerGroup}</td>
                      <td className="sticky-col-3" style={{ left: leftOffsets.col3, width: colWidths.col3, minWidth: colWidths.col3, maxWidth: colWidths.col3 }} title={row.customerName}>{row.customerName}</td>
                      <td className="sticky-col-4 cell-center" style={{ left: leftOffsets.col4, width: colWidths.col4, minWidth: colWidths.col4, maxWidth: colWidths.col4 }}>
                        <input 
                          type="checkbox" 
                          className="custom-checkbox" 
                          checked={row.isNewCustomer} 
                          disabled 
                        />
                      </td>
                      <td className="sticky-col-5" style={{ left: leftOffsets.col5, width: colWidths.col5, minWidth: colWidths.col5, maxWidth: colWidths.col5 }} title={row.spdvGroup}>{row.spdvGroup}</td>
                      <td className="sticky-col-6" style={{ left: leftOffsets.col6, width: colWidths.col6, minWidth: colWidths.col6, maxWidth: colWidths.col6 }} title={row.spdvName}>{row.spdvName}</td>
 
                      {/* Render Month columns */}
                      {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                        const periodKey = `m${m}`;
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, true);
                        } else {
                          return renderProductionPeriodCells(row, periodKey, valScale, true);
                        }
                      })}

                      {/* Render Quarter columns */}
                      {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                        const periodKey = `q${q}`;
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, false);
                        } else {
                          return renderProductionPeriodCells(row, periodKey, valScale, false);
                        }
                      })}

                      {/* Render Year columns */}
                      {(() => {
                        if (!selectedPeriods.includes('y')) return null;
                        const periodKey = 'y';
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, false);
                        } else {
                          return renderProductionPeriodCells(row, periodKey, valScale, false);
                        }
                      })()}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={activeTab === 'ket_qua_doanh_thu' ? (activePlanTab === 'Kế hoạch tập đoàn' ? 211 : 212) : 124} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    Không tìm thấy dữ liệu kết quả doanh thu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Pagination bar */}
        <div className="table-footer">
          <div>
            Hiển thị {totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalRecords)} trong số {totalRecords} khách hàng
          </div>
          <div className="pagination-controls">
            <span className="pagination-info">
              {currentPage}/{totalPages}
            </span>
            <div className="pagination-buttons">
              <button 
                className="btn-paginate" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className={`btn-paginate ${currentPage === 1 ? 'active-btn' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              {totalPages > 1 && (
                <button 
                  className={`btn-paginate ${currentPage === 2 ? 'active-btn' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
              )}
              <button 
                className="btn-paginate" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 collapsible summary tables - visible on both tabs */}
      {(activeTab === 'ket_qua_doanh_thu' || activeTab === 'san_luong_nghiem_thu') && (
        <div className="summary-sections-wrapper">
          {activeTab === 'ket_qua_doanh_thu' && activePlanTab === 'Kế hoạch nội bộ' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                Biểu mẫu doanh thu nội bộ tổng hợp
              </h2>
            </div>
          )}

          {/* Section: KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI */}
          {activeTab === 'ket_qua_doanh_thu' && activePlanTab !== 'Kế hoạch nội bộ' && (
            <div className="summary-card">
              <div className="summary-card-header" onClick={() => setCollapsedNewCounts(!collapsedNewCounts)}>
                <h3>KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI</h3>
                <div className="summary-card-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    className="btn-excel-action" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImportDataType('cust_count');
                      setShowImportModal(true);
                    }}
                    style={{ height: '32px', padding: '0 12px', fontSize: '12px', background: '#ffffff', color: '#ee0033', border: '1px solid #ee0033', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    Nhập Excel
                  </button>
                  <ChevronDown size={16} style={{ transform: collapsedNewCounts ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
              {!collapsedNewCounts && (
                <div className="table-scroll-container">
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ minWidth: '220px', textAlign: 'left', verticalAlign: 'middle' }}>Chỉ tiêu</th>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                          <th key={`new_head_m_${m}`} colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                        ))}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                          <th key={`new_head_q_${q}`} colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Q{q}</th>
                        ))}
                        {selectedPeriods.includes('y') && <th colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Năm</th>}
                      </tr>
                      <tr>
                        {Array.from({ length: 17 }, (_, i) => i).filter(idx => {
                          if (idx < 12) return selectedPeriods.includes('m' + (idx + 1));
                          if (idx < 16) return selectedPeriods.includes('q' + (idx - 12 + 1));
                          return selectedPeriods.includes('y');
                        }).map(idx => (
                          <React.Fragment key={`sub_cols_${idx}`}>
                            <th className="cell-center" style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', padding: '4px 2px', background: '#f8fafc' }}>KH</th>
                            <th className="cell-center" style={{ fontSize: '10px', color: '#ea580c', fontWeight: '700', padding: '4px 2px', background: '#fffbeb' }}>Ước TH</th>
                            <th className="cell-center" style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700', padding: '4px 2px', background: '#eff6ff' }}>TH</th>
                            <th className="cell-center" style={{ fontSize: '10px', color: '#475569', fontWeight: '700', padding: '4px 2px', background: '#f1f5f9' }}>+/- so KH</th>
                            <th className="cell-center" style={{ fontSize: '10px', color: '#475569', fontWeight: '700', padding: '4px 2px', background: '#f1f5f9' }}>% HTKH</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1: Số lượng khách hàng mới (kế hoạch) */}
                      <tr>
                        <td className="summary-col-label">Số lượng khách hàng mới (kế hoạch)</td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const khVal = newCountsSummary.newCustomerCount[`m${m}`];
                          const estVal = estimatedCounts.newCustomerCount[`m${m}`];
                          const actVal = actualCounts.newCustomerCount[`m${m}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`new_cust_m_${m}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '4px', fontSize: '12px', color: '#ea580c', fontWeight: '600' }} 
                                  value={estVal} 
                                  onChange={(e) => handleEstimatedCountChange('newCustomerCount', `m${m}`, e.target.value)} 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: 'white', border: '1px solid #3b82f6', borderRadius: '4px', fontSize: '12px', color: '#2563eb', fontWeight: '600' }} 
                                  value={actVal} 
                                  onChange={(e) => handleActualCountChange('newCustomerCount', `m${m}`, e.target.value)} 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: '600' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: '700' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const khVal = newCountsSummary.newCustomerCount[`q${q}`];
                          const estVal = computedEstimatedSummary.newCustomerCount[`q${q}`];
                          const actVal = computedActualSummary.newCustomerCount[`q${q}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`new_cust_q_${q}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '12px', color: '#d97706', fontWeight: 'bold' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: '600' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: '700' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const khVal = newCountsSummary.newCustomerCount.nam;
                          const estVal = computedEstimatedSummary.newCustomerCount.nam;
                          const actVal = computedActualSummary.newCustomerCount.nam;
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '12px', color: '#d97706', fontWeight: 'bold' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: 'bold' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: 'bold' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </>
                          );
                        })()}
                      </tr>

                      {/* Row 2: Số lượng hợp đồng mới (kế hoạch) */}
                      <tr>
                        <td className="summary-col-label">Số lượng hợp đồng mới (kế hoạch)</td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const khVal = newCountsSummary.newContractCount[`m${m}`];
                          const estVal = estimatedCounts.newContractCount[`m${m}`];
                          const actVal = actualCounts.newContractCount[`m${m}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`new_cont_m_${m}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '4px', fontSize: '12px', color: '#ea580c', fontWeight: '600' }} 
                                  value={estVal} 
                                  onChange={(e) => handleEstimatedCountChange('newContractCount', `m${m}`, e.target.value)} 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: 'white', border: '1px solid #3b82f6', borderRadius: '4px', fontSize: '12px', color: '#2563eb', fontWeight: '600' }} 
                                  value={actVal} 
                                  onChange={(e) => handleActualCountChange('newContractCount', `m${m}`, e.target.value)} 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: '600' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: '700' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const khVal = newCountsSummary.newContractCount[`q${q}`];
                          const estVal = computedEstimatedSummary.newContractCount[`q${q}`];
                          const actVal = computedActualSummary.newContractCount[`q${q}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`new_cont_q_${q}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '12px', color: '#d97706', fontWeight: 'bold' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: '600' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: '700' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const khVal = newCountsSummary.newContractCount.nam;
                          const estVal = computedEstimatedSummary.newContractCount.nam;
                          const actVal = computedActualSummary.newContractCount.nam;
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '12px', color: '#d97706', fontWeight: 'bold' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.diffColor, fontWeight: 'bold' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: comp.pctColor, fontWeight: 'bold' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </>
                          );
                        })()}
                      </tr>
                      
                      {/* Row 3: Số lượng khách hàng lũy kế */}
                      <tr style={{ background: '#f8fafc' }}>
                        <td className="summary-col-label" style={{ fontWeight: '600', color: '#1e293b' }}>Số lượng khách hàng lũy kế</td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const khVal = newCountsSummary.cumCustomerCount[`m${m}`];
                          const estVal = computedEstimatedSummary.cumCustomerCount[`m${m}`];
                          const actVal = computedActualSummary.cumCustomerCount[`m${m}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`cum_cust_m_${m}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '600', color: '#475569', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontWeight: '600', color: '#d97706', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: '#0369a1', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const khVal = newCountsSummary.cumCustomerCount[`q${q}`];
                          const estVal = computedEstimatedSummary.cumCustomerCount[`q${q}`];
                          const actVal = computedActualSummary.cumCustomerCount[`q${q}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`cum_cust_q_${q}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '600', color: '#475569', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontWeight: '600', color: '#d97706', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: '#0369a1', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const khVal = newCountsSummary.cumCustomerCount.nam;
                          const estVal = computedEstimatedSummary.cumCustomerCount.nam;
                          const actVal = computedActualSummary.cumCustomerCount.nam;
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#cbd5e1', border: '1px solid #94a3b8', borderRadius: '4px', fontWeight: 'bold', color: '#334155', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#d97706', border: '1px solid #b45309', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </>
                          );
                        })()}
                      </tr>
                      
                      {/* Row 4: Số lượng hợp đồng lũy kế */}
                      <tr style={{ background: '#f8fafc' }}>
                        <td className="summary-col-label" style={{ fontWeight: '600', color: '#1e293b' }}>Số lượng hợp đồng lũy kế</td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const khVal = newCountsSummary.cumContractCount[`m${m}`];
                          const estVal = computedEstimatedSummary.cumContractCount[`m${m}`];
                          const actVal = computedActualSummary.cumContractCount[`m${m}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`cum_cont_m_${m}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '600', color: '#475569', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontWeight: '600', color: '#d97706', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: '#0369a1', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const khVal = newCountsSummary.cumContractCount[`q${q}`];
                          const estVal = computedEstimatedSummary.cumContractCount[`q${q}`];
                          const actVal = computedActualSummary.cumContractCount[`q${q}`];
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <React.Fragment key={`cum_cont_q_${q}`}>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '600', color: '#475569', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontWeight: '600', color: '#d97706', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: '#0369a1', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', fontWeight: '600', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const khVal = newCountsSummary.cumContractCount.nam;
                          const estVal = computedEstimatedSummary.cumContractCount.nam;
                          const actVal = computedActualSummary.cumContractCount.nam;
                          const comp = getQtyComparison(khVal, actVal);
                          return (
                            <>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#cbd5e1', border: '1px solid #94a3b8', borderRadius: '4px', fontWeight: 'bold', color: '#334155', fontSize: '12px' }} 
                                  value={khVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#d97706', border: '1px solid #b45309', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '12px' }} 
                                  value={estVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: 'white', fontSize: '12px' }} 
                                  value={actVal} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: comp.diffColor, fontSize: '12px' }} 
                                  value={comp.diff} 
                                  readOnly 
                                />
                              </td>
                              <td className="cell-center" style={{ padding: '4px' }}>
                                <input 
                                  type="text" 
                                  className="month-grid-input readonly-input cell-center" 
                                  style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#0284c7', border: '1px solid #0369a1', borderRadius: '4px', fontWeight: 'bold', color: comp.pctColor, fontSize: '12px' }} 
                                  value={comp.percent} 
                                  readOnly 
                                />
                              </td>
                            </>
                          );
                        })()}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Section: CHẤT LƯỢNG DỊCH VỤ */}
          {activeTab === 'ket_qua_doanh_thu' && activePlanTab !== 'Kế hoạch nội bộ' && (
            <div className="summary-card" style={{ marginTop: '20px' }}>
              <div className="summary-card-header" onClick={() => setCollapsedServiceQuality(!collapsedServiceQuality)}>
                <h3>CHẤT LƯỢNG DỊCH VỤ</h3>
                <div className="summary-card-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    className="btn-excel-action" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImportDataType('service_quality');
                      setShowImportModal(true);
                    }}
                    style={{ height: '32px', padding: '0 12px', fontSize: '12px', background: '#ffffff', color: '#ee0033', border: '1px solid #ee0033', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    Nhập Excel
                  </button>
                  <ChevronDown size={16} style={{ transform: collapsedServiceQuality ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
              {!collapsedServiceQuality && (
                <div className="table-scroll-container">
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ minWidth: '220px', textAlign: 'left', verticalAlign: 'middle' }}>CHẤT LƯỢNG DỊCH VỤ</th>
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                          <th key={`sq_head_m_${m}`} colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                        ))}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                          <th key={`sq_head_q_${q}`} colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Q{q}</th>
                        ))}
                        {selectedPeriods.includes('y') && <th colSpan={5} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Năm</th>}
                      </tr>
                      <tr>
{Array.from({ length: 17 }, (_, i) => i).filter(idx => {
                          if (idx < 12) return selectedPeriods.includes('m' + (idx + 1));
                          if (idx < 16) return selectedPeriods.includes('q' + (idx - 12 + 1));
                          return selectedPeriods.includes('y');
                        }).map(idx => {
                          const isMonth = idx < 12;
                          return (
                            <React.Fragment key={`sq_sub_cols_${idx}`}>
                              <th className="cell-center" style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', padding: '4px 2px', background: '#f8fafc' }}>KH</th>
                              <th className="cell-center" style={{ fontSize: '10px', color: '#ea580c', fontWeight: '700', padding: '4px 2px', background: '#fffbeb' }}>Ước TH</th>
                              <th className="cell-center" style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700', padding: '4px 2px', background: '#eff6ff' }}>TH</th>
                              <th className="cell-center" style={{ fontSize: '10px', color: '#475569', fontWeight: '700', padding: '4px 2px', background: '#f1f5f9' }}>+/- so KH</th>
                              <th className="cell-center" style={{ fontSize: '10px', color: '#475569', fontWeight: '700', padding: '4px 2px', background: '#f1f5f9' }}>% HTKH</th>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {serviceQualityRows.map((row, idx) => {
                        const isParent = row.level === 1;
                        let paddingLeft = '24px';
                        let fontWeight = isParent ? '700' : 'normal';
                        let color = isParent ? '#0f172a' : '#475569';
                        let background = isParent ? '#f8fafc' : 'transparent';

                        if (row.level === 2) {
                          paddingLeft = '44px';
                        }

                        const itemValues = computedServiceQuality[row.id] || { plan: {}, estimate: {}, actual: {} };

                        return (
                          <tr key={idx} style={{ background }}>
                            <td className="summary-col-label" style={{ paddingLeft, fontWeight, color }}>
                              {row.name}
                            </td>
                            {/* Months 1-12 */}
                            {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                              const planValRaw = itemValues.plan[`m${m}`];
                              const estVal = itemValues.estimate[`m${m}`] || '';
                              const actVal = itemValues.actual[`m${m}`] || '';
                              const planVal = planValRaw ? `${planValRaw}%` : '--';
                              const comp = getPctComparison(planValRaw, actVal);
                              
                              return (
                                <React.Fragment key={`sq_cell_m_${row.id}_${m}`}>
                                  {/* KH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#f1f5f9' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#64748b', fontWeight: isParent ? '700' : 'normal' }} 
                                      value={planVal} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* Ước TH (editable if child, readOnly if parent) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input cell-center" 
                                      style={{ 
                                        width: '42px', 
                                        height: '28px', 
                                        margin: '0 auto', 
                                        textAlign: 'center', 
                                        background: isParent ? '#fffbeb' : 'white', 
                                        border: isParent ? '1px solid #fde68a' : '1px solid #f59e0b', 
                                        borderRadius: '4px', 
                                        fontSize: '11px', 
                                        color: isParent ? '#d97706' : '#ea580c', 
                                        fontWeight: '600' 
                                      }} 
                                      value={isParent ? (estVal ? `${estVal}%` : '--') : estVal}
                                      onChange={(e) => !isParent && handleServiceQualityEstimatedChange(row.id, `m${m}`, e.target.value)} 
                                      readOnly={isParent}
                                    />
                                  </td>
                                  {/* TH (editable if child, readOnly if parent) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input cell-center" 
                                      style={{ 
                                        width: '42px', 
                                        height: '28px', 
                                        margin: '0 auto', 
                                        textAlign: 'center', 
                                        background: isParent ? '#e0f2fe' : 'white', 
                                        border: isParent ? '1px solid #bae6fd' : '1px solid #3b82f6', 
                                        borderRadius: '4px', 
                                        fontSize: '11px', 
                                        color: isParent ? '#0369a1' : '#2563eb', 
                                        fontWeight: '600' 
                                      }} 
                                      value={isParent ? (actVal ? `${actVal}%` : '--') : actVal}
                                      onChange={(e) => !isParent && handleServiceQualityChange(row.id, `m${m}`, e.target.value)} 
                                      readOnly={isParent}
                                    />
                                  </td>
                                  {/* +/- so với KH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#f1f5f9' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: comp.diffColor, fontWeight: '600' }} 
                                      value={comp.diff} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* % HTKH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#f1f5f9' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: comp.pctColor, fontWeight: '700' }} 
                                      value={comp.percent} 
                                      readOnly 
                                    />
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            {/* Quarters 1-4 */}
                            {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                              const planValRaw = itemValues.plan[`q${q}`];
                              const estValRaw = itemValues.estimate[`q${q}`];
                              const actValRaw = itemValues.actual[`q${q}`];
                              const planVal = planValRaw ? `${planValRaw}%` : '--';
                              const estVal = estValRaw ? `${estValRaw}%` : '--';
                              const actVal = actValRaw ? `${actValRaw}%` : '--';
                              const comp = getPctComparison(planValRaw, actValRaw);
                              
                              return (
                                <React.Fragment key={`sq_cell_q_${row.id}_${q}`}>
                                  {/* KH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#f1f5f9' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#64748b', fontWeight: isParent ? '700' : 'normal' }} 
                                      value={planVal} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* Ước TH (readOnly calculated) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '11px', color: '#d97706', fontWeight: 'bold' }} 
                                      value={estVal} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* TH (readOnly calculated) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11px', color: '#1e40af', fontWeight: 'bold' }} 
                                      value={actVal} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* +/- so với KH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11px', color: comp.diffColor, fontWeight: '600' }} 
                                      value={comp.diff} 
                                      readOnly 
                                    />
                                  </td>
                                  {/* % HTKH (readOnly) */}
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11px', color: comp.pctColor, fontWeight: '700' }} 
                                      value={comp.percent} 
                                      readOnly 
                                    />
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            {/* Year */}
                            {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                              const planValRaw = itemValues.plan.nam;
                              const estValRaw = itemValues.estimate.nam;
                              const actValRaw = itemValues.actual.nam;
                              const comp = getPctComparison(planValRaw, actValRaw);
                              return (
                                <>
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#cbd5e1' : '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: isParent ? '#334155' : '#64748b', fontWeight: 'bold' }} 
                                      value={planValRaw ? `${planValRaw}%` : '--'} 
                                      readOnly 
                                    />
                                  </td>
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#d97706' : '#fffbeb', border: '1px solid #b45309', borderRadius: '4px', fontSize: '11px', color: isParent ? 'white' : '#d97706', fontWeight: 'bold' }} 
                                      value={estValRaw ? `${estValRaw}%` : '--'} 
                                      readOnly 
                                    />
                                  </td>
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#0284c7' : '#eff6ff', border: '1px solid #0369a1', borderRadius: '4px', fontSize: '11px', color: isParent ? 'white' : '#1e40af', fontWeight: 'bold' }} 
                                      value={actValRaw ? `${actValRaw}%` : '--'} 
                                      readOnly 
                                    />
                                  </td>
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#0284c7' : '#eff6ff', border: '1px solid #0369a1', borderRadius: '4px', fontSize: '11px', color: comp.diffColor, fontWeight: 'bold' }} 
                                      value={comp.diff} 
                                      readOnly 
                                    />
                                  </td>
                                  <td className="cell-center" style={{ padding: '4px' }}>
                                    <input 
                                      type="text" 
                                      className="month-grid-input readonly-input cell-center" 
                                      style={{ width: '42px', height: '28px', margin: '0 auto', textAlign: 'center', background: isParent ? '#0284c7' : '#eff6ff', border: '1px solid #0369a1', borderRadius: '4px', fontSize: '11px', color: comp.pctColor, fontWeight: 'bold' }} 
                                      value={comp.percent} 
                                      readOnly 
                                    />
                                  </td>
                                </>
                              );
                            })()}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Table 2.1 to 2.5 are visible only for Kế hoạch nội bộ of Doanh thu */}
          {activeTab === 'ket_qua_doanh_thu' && activePlanTab === 'Kế hoạch nội bộ' && (
            <>
              {/* Table 2.1: Theo đơn vị thực hiện */}
              <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable1(!collapsedTable1)}>
              <h3>2.1 Biểu tổng hợp kết quả theo đơn vị thực hiện</h3>
              <div className="summary-card-header-right">
                <ChevronDown size={16} style={{ transform: collapsedTable1 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable1 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '180px', verticalAlign: 'middle', textAlign: 'left' }}>Đơn vị thực hiện</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 13 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      {selectedPeriods.includes('y') && <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>}
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {selectedPeriods.includes('y') && <><th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th><th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th><th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th></>}
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                            <React.Fragment key={`q_inds_${i}`}>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          ))}
{selectedPeriods.includes('y') && (
                            <React.Fragment key="y_inds">
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          )}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
{selectedPeriods.includes('y') && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            {activeTab === 'san_luong_nghiem_thu' && (
                              <>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                              </>
                            )}
                          </>
                        )}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {summaryCalculations.unitData.map(ud => (
                      <tr key={ud.unitName}>
                        <td className="summary-col-label">{ud.unitName}</td>
                        {/* Month values */}
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const p = `m${m}`;
                          const val = ud.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, true, p);
                          } else {
                            const isClosed = officialMonths.includes(p);
                            return renderProductionMonthCells(val.kh, val.est || 0, val.th, isClosed);
                          }
                        })}
                        {/* Quarter values */}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const p = `q${q}`;
                          const val = ud.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            return renderProductionQuarterCells(val.kh, val.th);
                          }
                        })}
                        {/* Year values */}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const p = 'y';
                          const val = ud.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            const diff = val.th - val.kh;
                            const delta = val.kh > 0 ? Math.round((diff / val.kh) * 100) : 0;
                            
                            const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
                            const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';
                            
                            const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
                            const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

                            return (
                              <React.Fragment key={p}>
                                <td className="cell-right">{val.kh > 0 ? val.kh.toLocaleString('vi-VN') : '0'}</td>
                                <td className="cell-right" style={{ fontWeight: '600' }}>
                                  {val.th > 0 ? val.th.toLocaleString('vi-VN') : '0'}
                                </td>
                                {activeTab === 'san_luong_nghiem_thu' && (
                                  <>
                                    <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
                                      {val.th > 0 ? diffText : '--'}
                                    </td>
                                    <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
                                      {val.th > 0 ? deltaText : '--'}
                                    </td>
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                        })()}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table 2.2: Số lượng hoàn thành */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable1_2(!collapsedTable1_2)}>
              <h3>2.2 Số lượng hoàn thành kế hoạch</h3>
              <div className="summary-card-header-right">
                <ChevronDown size={16} style={{ transform: collapsedTable1_2 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable1_2 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '180px' }}>Chỉ tiêu thống kê</th>
                      {allPeriodsKeys.map(p => <th key={p} className="cell-right">{getPeriodLabel(p)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Tổng số lượng đơn vị thực hiện</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right">
                          {summaryCalculations.unitCompletion[p].total}
                        </td>
                      ))}
                    </tr>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Số lượng đơn vị hoàn thành kế hoạch &gt;= 100%</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right" style={{ color: '#16a34a' }}>
                          {summaryCalculations.unitCompletion[p].completed}
                        </td>
                      ))}
                    </tr>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Tỷ lệ hoàn thành (&gt;= 100% / Tổng)</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right">
                          <span className={summaryCalculations.unitCompletion[p].rate >= 50 ? 'badge-green' : 'badge-red'}>
                            {summaryCalculations.unitCompletion[p].rate}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table 2.3: Theo nhóm khách hàng */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable2(!collapsedTable2)}>
              <h3>2.3 Tổng hợp kết quả thực hiện theo nhóm khách hàng</h3>
              <div className="summary-card-header-right">
                <ChevronDown size={16} style={{ transform: collapsedTable2 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable2 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '220px', verticalAlign: 'middle', textAlign: 'left' }}>Nhóm khách hàng</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 13 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      {selectedPeriods.includes('y') && <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>}
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {selectedPeriods.includes('y') && <><th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th><th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th><th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th></>}
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                            <React.Fragment key={`q_inds_${i}`}>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          ))}
{selectedPeriods.includes('y') && (
                            <React.Fragment key="y_inds">
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          )}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
{selectedPeriods.includes('y') && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            {activeTab === 'san_luong_nghiem_thu' && (
                              <>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                              </>
                            )}
                          </>
                        )}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {summaryCalculations.customerGroupData.map(cgd => (
                      <tr key={cgd.groupName}>
                        <td className="summary-col-label">{cgd.groupName}</td>
                        {/* Month values */}
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const p = `m${m}`;
                          const val = cgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, true, p);
                          } else {
                            const isClosed = officialMonths.includes(p);
                            return renderProductionMonthCells(val.kh, val.est || 0, val.th, isClosed);
                          }
                        })}
                        {/* Quarter values */}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const p = `q${q}`;
                          const val = cgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            return renderProductionQuarterCells(val.kh, val.th);
                          }
                        })}
                        {/* Year values */}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const p = 'y';
                          const val = cgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            const diff = val.th - val.kh;
                            const delta = val.kh > 0 ? Math.round((diff / val.kh) * 100) : 0;
                            
                            const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
                            const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';
                            
                            const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
                            const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

                            return (
                              <React.Fragment key={p}>
                                <td className="cell-right">{val.kh > 0 ? val.kh.toLocaleString('vi-VN') : '0'}</td>
                                <td className="cell-right" style={{ fontWeight: '600' }}>
                                  {val.th > 0 ? val.th.toLocaleString('vi-VN') : '0'}
                                </td>
                                {activeTab === 'san_luong_nghiem_thu' && (
                                  <>
                                    <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
                                      {val.th > 0 ? diffText : '--'}
                                    </td>
                                    <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
                                      {val.th > 0 ? deltaText : '--'}
                                    </td>
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                        })()}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table 2.4: Theo nhóm SPDV */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable3(!collapsedTable3)}>
              <h3>2.4 Tổng hợp kết quả thực hiện theo nhóm SPDV</h3>
              <div className="summary-card-header-right">
                <ChevronDown size={16} style={{ transform: collapsedTable3 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable3 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '180px', verticalAlign: 'middle', textAlign: 'left' }}>Nhóm SPDV</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 13 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      {selectedPeriods.includes('y') && <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>}
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={4} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {selectedPeriods.includes('y') && <><th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>{planCompareText}</th><th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th><th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th></>}
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                            <React.Fragment key={`q_inds_${i}`}>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          ))}
{selectedPeriods.includes('y') && (
                            <React.Fragment key="y_inds">
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>%</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>+/-</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>%</th>
                            </React.Fragment>
                          )}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => i).filter(i => selectedPeriods.includes('m' + (i + 1))).map(i => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => i).filter(i => selectedPeriods.includes('q' + (i + 1))).map(i => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
{selectedPeriods.includes('y') && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            {activeTab === 'san_luong_nghiem_thu' && (
                              <>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                                <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                              </>
                            )}
                          </>
                        )}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {summaryCalculations.spdvGroupData.map(sgd => (
                      <tr key={sgd.spgName}>
                        <td className="summary-col-label">{sgd.spgName}</td>
                        {/* Month values */}
                        {Array.from({ length: 12 }, (_, i) => i + 1).filter(m => selectedPeriods.includes('m' + m)).map(m => {
                          const p = `m${m}`;
                          const val = sgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, true, p);
                          } else {
                            const isClosed = officialMonths.includes(p);
                            return renderProductionMonthCells(val.kh, val.est || 0, val.th, isClosed);
                          }
                        })}
                        {/* Quarter values */}
                        {Array.from({ length: 4 }, (_, i) => i + 1).filter(q => selectedPeriods.includes('q' + q)).map(q => {
                          const p = `q${q}`;
                          const val = sgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            return renderProductionQuarterCells(val.kh, val.th);
                          }
                        })}
                        {/* Year values */}
                        {(() => {
                          if (!selectedPeriods.includes('y')) return null;
                          const p = 'y';
                          const val = sgd.periods[p];
                          if (activeTab === 'ket_qua_doanh_thu') {
                            return renderSummaryPeriodCells(val, false, p);
                          } else {
                            const diff = val.th - val.kh;
                            const delta = val.kh > 0 ? Math.round((diff / val.kh) * 100) : 0;
                            
                            const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
                            const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';
                            
                            const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
                            const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

                            return (
                              <React.Fragment key={p}>
                                <td className="cell-right">{val.kh > 0 ? val.kh.toLocaleString('vi-VN') : '0'}</td>
                                <td className="cell-right" style={{ fontWeight: '600' }}>
                                  {val.th > 0 ? val.th.toLocaleString('vi-VN') : '0'}
                                </td>
                                {activeTab === 'san_luong_nghiem_thu' && (
                                  <>
                                    <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
                                      {val.th > 0 ? diffText : '--'}
                                    </td>
                                    <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
                                      {val.th > 0 ? deltaText : '--'}
                                    </td>
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                        })()}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table 2.5: Tỷ lệ nhóm SPDV hoàn thành kế hoạch */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable4(!collapsedTable4)}>
              <h3>2.5 Tỉ lệ nhóm SPDV hoàn thành kế hoạch</h3>
              <div className="summary-card-header-right">
                <ChevronDown size={16} style={{ transform: collapsedTable4 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable4 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '220px' }}>Chỉ số đánh giá SPDV</th>
                      {allPeriodsKeys.map(p => <th key={p} className="cell-right">{getPeriodLabel(p)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Tổng số nhóm SPDV</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right">
                          {summaryCalculations.spdvCompletion[p].total}
                        </td>
                      ))}
                    </tr>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Số nhóm SPDV hoàn thành tối thiểu 100%</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right" style={{ color: '#16a34a' }}>
                          {summaryCalculations.spdvCompletion[p].completed}
                        </td>
                      ))}
                    </tr>
                    <tr className="summary-table-row-highlight">
                      <td className="summary-col-label">Tỷ lệ nhóm SPDV hoàn thành tối thiểu 100%/Tổng số nhóm SPDV</td>
                      {allPeriodsKeys.map(p => (
                        <td key={p} className="cell-right">
                          <span className={summaryCalculations.spdvCompletion[p].rate >= 50 ? 'badge-green' : 'badge-red'}>
                            {summaryCalculations.spdvCompletion[p].rate}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
        </div>
      )}

      {/* Activity Timeline */}
      <div className="history-section-card">

        <div className="history-section-header">
          <h3>
            <Clock size={16} />
            Lịch sử hoạt động
          </h3>
        </div>
        <div className="history-timeline">
          {historyLogs.map(log => (
            <div key={log.id} className="timeline-item">
              <div className={`timeline-avatar ${log.avatarClass}`}>{log.avatarInitial}</div>
              <div className="timeline-content">
                <div className="timeline-content-header">
                  <span className="timeline-user-name">{log.user}</span>
                  <span className="timeline-time">
                    <Clock size={12} />
                    {log.time}
                  </span>
                </div>
                {log.type === 'file' && (
                  <div className="timeline-text-upload">
                    <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
                    Upload file "{log.fileName}"
                    <button className="btn-timeline-download" onClick={() => alert(`Tải xuống file: ${log.fileName}`)}>
                      (Tải file mẫu về)
                    </button>
                  </div>
                )}
                <ul className="timeline-details-list">
                  {log.details.map((detail, idx) => (
                    <li key={idx}>
                      {detail.includes('→') ? (
                        <>
                          {detail.split('→')[0]} →{' '}
                          <span className="timeline-text-highlight">{detail.split('→')[1]}</span>
                        </>
                      ) : (
                        detail
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADVANCED FILTERING */}
      {showAdvancedFilters && (
        <div className="modal-overlay">
          {activeDropdown && (
            <div 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }} 
              onClick={() => setActiveDropdown(null)} 
            />
          )}
          <div className="modal-content" style={{ width: '480px', maxWidth: '90%', zIndex: 1001 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Bộ lọc nâng cao</h3>
              <button className="btn-close-modal" onClick={() => setShowAdvancedFilters(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body advanced-filter-grid" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {renderCustomMultiSelect(
                'groups', 
                'Nhóm Khánh Hàng', 
                CUSTOMER_GROUPS_LIST, 
                selectedGroups, 
                handleToggleGroup, 
                () => setSelectedGroups(CUSTOMER_GROUPS_LIST), 
                () => setSelectedGroups([])
              )}

              {renderCustomMultiSelect(
                'customers', 
                'Tên Khách Hàng', 
                CUSTOMERS_DB.map(c => c.name), 
                selectedCustomers, 
                handleToggleCustomer, 
                () => setSelectedCustomers(CUSTOMERS_DB.map(c => c.name)), 
                () => setSelectedCustomers([])
              )}

              {renderCustomMultiSelect(
                'spdvGroups', 
                'Nhóm SPDV', 
                Array.from(new Set(SPDVS_DB.map(s => s.group))), 
                selectedSPDVGroups, 
                handleToggleSPDVGroup, 
                () => setSelectedSPDVGroups(Array.from(new Set(SPDVS_DB.map(s => s.group)))), 
                () => setSelectedSPDVGroups([])
              )}

              {renderCustomMultiSelect(
                'spdvs', 
                'Tên SPDV', 
                SPDVS_DB.map(s => s.name), 
                selectedSPDVs, 
                handleToggleSPDV, 
                () => setSelectedSPDVs(SPDVS_DB.map(s => s.name)), 
                () => setSelectedSPDVs([])
              )}

              {renderPeriodMultiSelect()}

              <div className="advanced-filter-row">
                <label>Năm</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="advanced-filter-row">
                <label>Là Khách Hàng Mới</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isNewCustomerFilter}
                    onChange={(e) => {
                      setIsNewCustomerFilter(e.target.checked);
                      setCurrentPage(1);
                    }}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      cursor: 'pointer',
                      accentColor: '#ee0033',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

            </div>
            <div className="modal-footer" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn-cancel" 
                onClick={handleClearAllFilters}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Xóa bộ lọc
              </button>
              <button 
                className="btn-apply" 
                onClick={() => setShowAdvancedFilters(false)}
                style={{ padding: '10px 24px', background: '#ee0033', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT EXCEL WIZARD */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '600px' }}>
            <div className="modal-header">
              <h3>
                {importDataType === 'estimate' 
                  ? 'Nhập Excel Ước thực hiện (Ước TH)' 
                  : importDataType === 'cust_count'
                  ? 'Nhập Excel Số lượng KH & HĐ mới'
                  : importDataType === 'service_quality'
                  ? 'Nhập Excel Chỉ tiêu Chất lượng dịch vụ'
                  : `Nhập Excel Kết quả TH - ${activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu' : 'Sản lượng'}`}
              </h3>
              <button className="btn-close-modal" onClick={handleCloseImportModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {/* Wizard progress node */}
              <div className="wizard-steps">
                <div className={`wizard-step-node ${importStep === 1 ? 'active' : ''} ${importStep > 1 ? 'completed' : ''}`}>
                  <div className="step-circle">1</div>
                  <span className="step-label">Upload File</span>
                </div>
                <div className={`wizard-step-node ${importStep === 2 ? 'active' : ''} ${importStep > 2 ? 'completed' : ''}`}>
                  <div className="step-circle">2</div>
                  <span className="step-label">Mapping cột</span>
                </div>
                <div className={`wizard-step-node ${importStep === 3 ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <span className="step-label">Chạy thử & Lưu</span>
                </div>
              </div>

              {/* STEP 1: UPLOAD FILE */}
              {importStep === 1 && (
                <div className="import-wizard-container">
                  <div className="date-selector-row" style={{ gridTemplateColumns: (importDataType === 'estimate' || importDataType === 'th') ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                    {(importDataType === 'estimate' || importDataType === 'th') && (
                      <div className="form-group">
                        <label>Loại dữ liệu nhập</label>
                        <select 
                          value={importDataType} 
                          onChange={(e) => setImportDataType(e.target.value)}
                        >
                          <option value="estimate">Ước thực hiện (Ước TH)</option>
                          <option value="th">Thực tế (TH)</option>
                        </select>
                      </div>
                    )}
                    <div className="form-group">
                      <label>Kỳ KPI cần cập nhật</label>
                      <select value={importPeriod} onChange={(e) => setImportPeriod(e.target.value)}>
                        <option value="m1">Tháng 1</option>
                        <option value="m2">Tháng 2</option>
                        <option value="m3">Tháng 3</option>
                        <option value="m4">Tháng 4</option>
                        <option value="m5">Tháng 5</option>
                        <option value="m6">Tháng 6</option>
                        <option value="m7">Tháng 7</option>
                        <option value="m8">Tháng 8</option>
                        <option value="m9">Tháng 9</option>
                        <option value="m10">Tháng 10</option>
                        <option value="m11">Tháng 11</option>
                        <option value="m12">Tháng 12</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Năm KPI</label>
                      <select value={importYear} onChange={(e) => setImportYear(e.target.value)}>
                        {YEAR_OPTIONS.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>


                  {importDataType === 'estimate' ? (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#b45309', marginBottom: '8px' }}>
                      💡 <strong>Quy tắc Ước TH:</strong> Chỉ được phép nạp số ước thực hiện cho kỳ hiện tại trong khung thời gian từ <strong>ngày 22 đến ngày 25 hàng tháng</strong>. Giá trị nhập từng dòng phải lớn hơn 1.
                    </div>
                  ) : importDataType === 'cust_count' ? (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
                      💡 <strong>Quy tắc Số lượng KH & HĐ mới:</strong> Nạp file Excel cập nhật chỉ tiêu số lượng khách hàng và hợp đồng mới cho các tháng đã chọn.
                    </div>
                  ) : importDataType === 'service_quality' ? (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
                      💡 <strong>Quy tắc Chất lượng dịch vụ:</strong> Nạp file Excel cập nhật tỷ lệ kết nối thành công và tỷ lệ hài lòng của khách hàng.
                    </div>
                  ) : (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#166534', marginBottom: '8px' }}>
                      💡 <strong>Quy tắc TH chính thức:</strong> Cho phép cập nhật kỳ hiện tại và kỳ liền kề trước. Hạn cập nhật kỳ liền kề trước là trước <strong>ngày 10 hàng tháng</strong>.
                    </div>
                  )}

                  {importDataType === 'estimate' && estimateWindowTooltip ? (
                    <div className="upload-dropzone" style={{ opacity: 0.6, cursor: 'not-allowed', background: '#f1f5f9', borderColor: '#cbd5e1' }} onClick={() => alert(estimateWindowTooltip)}>
                      <div className="upload-icon-wrapper" style={{ background: '#e2e8f0', color: '#94a3b8' }}>
                        <Upload size={28} />
                      </div>
                      <div>
                        <strong style={{ color: '#64748b' }}>Không thể nhập Ước thực hiện tại thời điểm này</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>{estimateWindowTooltip}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-dropzone" onClick={() => handleSimulateUpload('valid')}>
                      <div className="upload-icon-wrapper">
                        <Upload size={28} />
                      </div>
                      <div>
                        <strong>Nhấp để chọn file Excel từ thiết bị của bạn</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Định dạng hỗ trợ: .xls, .xlsx (Tối đa 10.000 bản ghi)</p>
                      </div>
                    </div>
                  )}

                  {/* Sandbox helper for developers to simulate other validation rules */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Giả lập test case lỗi:</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <button className="btn-paginate" style={{ width: 'auto', padding: '0 8px', fontSize: '11px' }} onClick={() => handleSimulateUpload('invalid_format')}>
                        Sai định dạng đuôi file (.pdf)
                      </button>
                      <button className="btn-paginate" style={{ width: 'auto', padding: '0 8px', fontSize: '11px' }} onClick={() => handleSimulateUpload('too_large')}>
                        Quá 10.000 bản ghi
                      </button>
                      <button className="btn-paginate" style={{ width: 'auto', padding: '0 8px', fontSize: '11px' }} onClick={() => handleSimulateUpload('extra_columns')}>
                        Thừa cột
                      </button>
                      <button className="btn-paginate" style={{ width: 'auto', padding: '0 8px', fontSize: '11px' }} onClick={() => handleSimulateUpload('missing_columns')}>
                        Thiếu cột
                      </button>
                      <button className="btn-paginate" style={{ width: 'auto', padding: '0 8px', fontSize: '11px' }} onClick={() => handleSimulateUpload('duplicates')}>
                        Trùng lặp nhóm KH
                      </button>
                    </div>
                  </div>

                  <div className="template-download-info">
                    Tải file mẫu tương ứng: <span className="link-template" onClick={() => alert(`Đang tải file mẫu: ${activeTab === 'ket_qua_doanh_thu' ? 'Revenue Performance.xlsx' : 'Accepted Volume Performance.xlsx'}`)}>{activeTab === 'ket_qua_doanh_thu' ? 'Revenue Performance.xlsx' : 'Accepted Volume Performance.xlsx'}</span>
                  </div>
                </div>
              )}

              {/* STEP 2: MAPPING COLUMNS */}
              {importStep === 2 && uploadedFile && (
                <div className="import-wizard-container">
                  <div className="file-info-bar">
                    <div className="file-name-group">
                      <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
                      <span>{uploadedFile.name} ({uploadedFile.size})</span>
                    </div>
                    <button className="btn-remove-file" onClick={() => { setUploadedFile(null); setImportStep(1); }}>
                      <X size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', margin: '0', color: '#64748b' }}>
                    Ánh xạ các trường thông tin cột trong CSDL (cột trái) với cột tương ứng trong file Excel của bạn (cột phải):
                  </p>

                  <table className="mapping-table">
                    <thead>
                      <tr>
                        <th>Trường báo cáo hệ thống</th>
                        <th>Cột trong File Excel</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Đơn vị thực hiện</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.unit} onChange={(e) => setColumnMapping({...columnMapping, unit: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Nhóm khách hàng</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.group} onChange={(e) => setColumnMapping({...columnMapping, group: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Tên khách hàng</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.customer} onChange={(e) => setColumnMapping({...columnMapping, customer: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Là khách hàng mới</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.isNew} onChange={(e) => setColumnMapping({...columnMapping, isNew: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Nhóm SPDV</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.spdvGroup} onChange={(e) => setColumnMapping({...columnMapping, spdvGroup: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Tên SPDV</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.spdvName} onChange={(e) => setColumnMapping({...columnMapping, spdvName: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>{importDataType === 'estimate' ? 'Số ước thực hiện (Ước TH)' : importDataType === 'cust_count' ? 'Số lượng KH & HĐ mới' : importDataType === 'service_quality' ? 'Tỷ lệ chất lượng dịch vụ (%)' : 'Số thực hiện (TH)'}</strong></td>
                        <td>
                          <select className="mapping-select" value={columnMapping.th} onChange={(e) => setColumnMapping({...columnMapping, th: e.target.value})}>
                            <option value="">-- Bỏ qua / Không map --</option>
                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* STEP 3: RUN TEST & SAVE */}
              {importStep === 3 && (
                <div className="import-wizard-container">
                  {isTesting ? (
                    <div className="excel-loader-overlay">
                      <div className="spinner-icon"></div>
                      <div>
                        <strong>Đang chạy thử nghiệm dữ liệu Excel...</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Đang thực hiện quy tắc mapping trường và validate hạn ngày 10.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {validationResult && (
                        <div className={`test-result-wrapper ${validationResult.status === 'success' ? 'test-result-success' : 'test-result-error'}`}>
                          <div className="test-result-header">
                            {validationResult.status === 'success' ? (
                              <>
                                <CheckCircle2 size={20} />
                                <span>Chạy thử thành công!</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={20} />
                                <span>Kiểm thử phát hiện lỗi dữ liệu!</span>
                              </>
                            )}
                          </div>
                          <p style={{ margin: '0 0 8px 0', fontSize: '13.5px' }}>{validationResult.msg}</p>
                          {validationResult.status === 'error' && (
                            <span style={{ fontSize: '12px' }}>
                              ⚠️ Đã tự động tải file chi tiết dòng lỗi về máy của bạn để kiểm tra sửa đổi.
                            </span>
                          )}
                        </div>
                      )}

                      {validationResult && validationResult.status === 'success' && (
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>Dữ liệu chuẩn bị nạp (Simulated):</span>
                          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>Cập nhật kỳ: <strong>{importPeriod.toUpperCase()}/{importYear}</strong></li>
                            <li>Loại dữ liệu: <strong>{importDataType === 'estimate' ? 'Số Ước thực hiện (Ước TH)' : importDataType === 'cust_count' ? 'Số lượng KH & HĐ mới' : importDataType === 'service_quality' ? 'Tỷ lệ chất lượng dịch vụ' : 'Số thực hiện chính thức (TH)'}</strong></li>
                            <li>Số lượng dòng nạp: <strong>{uploadedFile.rowsCount} dòng</strong></li>
                            <li>Tổng số liệu tích lũy nạp vào: <strong>{importDataType === 'estimate' ? '9.500' : importDataType === 'cust_count' ? '120' : importDataType === 'service_quality' ? '95.5%' : '9.423'}</strong></li>
                          </ul>

                          {/* Simulation option for database failure */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                            <input 
                              type="checkbox" 
                              id="chk-db-fail" 
                              checked={simulateServerError} 
                              onChange={(e) => setSimulateServerError(e.target.checked)} 
                            />
                            <label htmlFor="chk-db-fail" style={{ color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}>
                              Giả lập lỗi máy chủ/xung đột dữ liệu CSDL khi Import (Test Rollback)
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Load another file trigger */}
                      <button className="btn-timeline-download" onClick={() => setImportStep(1)}>
                        ← Chọn nạp file khác (Load more data)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseImportModal}>
                Hủy bỏ
              </button>

              {importStep === 2 && (
                <button className="btn-apply" onClick={handleTestImport}>
                  Kiểm tra (Test)
                </button>
              )}

              {importStep === 3 && validationResult && validationResult.status === 'success' && (
                <button 
                  className="btn-apply" 
                  disabled={isImporting} 
                  onClick={handleImportToDatabase}
                >
                  {isImporting ? 'Đang nhập...' : 'Nạp dữ liệu (Nhập)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}





      {/* Spinner layout when background exporting */}
      {isExporting && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '36px', alignItems: 'center', width: '320px' }}>
            <div className="spinner-icon"></div>
            <strong style={{ marginTop: '16px' }}>Đang xuất tệp Excel...</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Vui lòng đợi giây lát.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalResultList;
