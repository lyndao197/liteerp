import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle
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
  'TT VPTD',
  'TT VTT',
  'TT VTNet',
  'TT VTS',
  'TT VDS',
  'TT VAM',
  'TT VTAca',
  'TT VAI',
  'TT VHT',
  'TT VTX',
  'TT VIC',
  'TT VSS',
  'TT VSI',
  'TT VATC',
  'TT VTLimex',
  'TT VTPost',
  'TT VCC',
  'TT XMCP',
  'TT VMC'
];

// Combinations of unit, customer, product to build rows
const MATRIX_ROWS_BASE = [
  // TT VPTD
  { id: 'R-1', unit: 'TT VPTD', customerId: 'C-01', spdvId: 'S-01' },
  { id: 'R-2', unit: 'TT VPTD', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-3', unit: 'TT VPTD', customerId: 'C-05', spdvId: 'S-03' },
  { id: 'R-4', unit: 'TT VPTD', customerId: 'C-10', spdvId: 'S-04' },
  
  // TT VTT
  { id: 'R-5', unit: 'TT VTT', customerId: 'C-01', spdvId: 'S-02' },
  { id: 'R-6', unit: 'TT VTT', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-7', unit: 'TT VTT', customerId: 'C-05', spdvId: 'S-03' },
  { id: 'R-8', unit: 'TT VTT', customerId: 'C-10', spdvId: 'S-05' },

  // TT VTNet
  { id: 'R-9', unit: 'TT VTNet', customerId: 'C-01', spdvId: 'S-01' },
  { id: 'R-10', unit: 'TT VTNet', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-11', unit: 'TT VTNet', customerId: 'C-05', spdvId: 'S-06' },
  { id: 'R-12', unit: 'TT VTNet', customerId: 'C-10', spdvId: 'S-08' },

  // TT VTS
  { id: 'R-13', unit: 'TT VTS', customerId: 'C-01', spdvId: 'S-02' },
  { id: 'R-14', unit: 'TT VTS', customerId: 'C-04', spdvId: 'S-09' },
  { id: 'R-15', unit: 'TT VTS', customerId: 'C-05', spdvId: 'S-07' },
  { id: 'R-16', unit: 'TT VTS', customerId: 'C-10', spdvId: 'S-04' }
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

const GoalResultList = () => {
  const [activeTab, setActiveTab] = useState('san_luong_nghiem_thu'); // 'ket_qua_doanh_thu' or 'san_luong_nghiem_thu'
  
  // Database state to support dynamic excel imports
  const [dbValues, setDbValues] = useState({});

  // Filters State
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedSPDVGroups, setSelectedSPDVGroups] = useState([]);
  const [selectedSPDVs, setSelectedSPDVs] = useState([]);
  const [isNewCustomerFilter, setIsNewCustomerFilter] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('m6'); // Default Month 6
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
    return selectedYear === String(systemYear) && selectedPeriod === `m${systemMonth}`;
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
  }, [computedRows, searchTerm, selectedGroups, selectedCustomers, selectedSPDVGroups, selectedSPDVs, isNewCustomerFilter, sortField, sortDirection]);

  // Summary Metrics calculations
  const summaryStats = useMemo(() => {
    let internalSum = 0;
    let externalSum = 0;
    let internationalSum = 0;

    filteredAndSortedData.forEach(item => {
      // Internal = internal in-country + internal international
      const isInternal = item.customerGroup.includes('nội bộ');
      // External = external in-country + external international
      const isExternal = item.customerGroup.includes('ngoài');
      // International = internal international + external international
      const isInternational = item.customerGroup.includes('nước ngoài');

      if (isInternal) {
        internalSum += item.th;
      }
      if (isExternal) {
        externalSum += item.th;
      }
      if (isInternational) {
        internationalSum += item.th;
      }
    });

    const totalSum = internalSum + externalSum;

    // Apply scale down if it is Revenue Tab vs Production Tab (for cosmetic realism in UI)
    // Actually the user requirements say:
    // Tab "Kết quả doanh thu": Doanh thu KH nội bộ, Doanh thu KH ngoài tập đoàn, Doanh thu KH quốc tế, Tổng doanh thu
    // Tab "Sản lượng nghiệm thu": Sản lượng KH nội bộ, Sản lượng KH ngoài Tập đoàn, Sản lượng KH quốc tế, Tổng Sản lượng
    // Formulas:
    // Doanh thu/Sản lượng KH nội bộ = in-country + international internal
    // Doanh thu/Sản lượng KH ngoài Tập đoàn = in-country + international external
    // Doanh thu/Sản lượng KH quốc tế = internal international + external international
    // Tổng = internal + external
    const formatStat = (val) => {
      // Display in thousands to look like screenshot if tab is revenue, or display normal
      return activeTab === 'ket_qua_doanh_thu' ? Math.round(val * 1.5).toLocaleString('vi-VN') : val.toLocaleString('vi-VN');
    };

    return {
      internal: formatStat(internalSum),
      external: formatStat(externalSum),
      international: formatStat(internationalSum),
      total: formatStat(totalSum)
    };
  }, [filteredAndSortedData, activeTab]);

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
        const thYoY = prevYearData[pKey].th;

        periodsResult[pKey] = {
          kh: cur.kh,
          th: cur.th,
          est: cur.est,
          thPrev,
          thYoY
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

    return {
      newCustomerCount: sumCust,
      newContractCount: sumCont
    };
  }, [selectedYear]);

  const allPeriodsKeys = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'q1', 'q2', 'q3', 'q4', 'y'];
  
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
    setSelectedPeriod('m6');
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

    const targetValHeader = importDataType === 'estimate' ? 'Số ước thực hiện (Ước TH)' : 'Số thực hiện (TH)';

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

    const diffMoM = scaledTh - scaledThPrev;
    const deltaMoM = scaledThPrev > 0 ? Math.round((diffMoM / scaledThPrev) * 100) : 0;
    const diffEstMoM = scaledEst - scaledThPrev;
    const deltaEstMoM = scaledThPrev > 0 ? Math.round((diffEstMoM / scaledThPrev) * 100) : 0;

    // Group 3: YoY
    const yoyPeriodKey = periodKey;
    const yoyYear = parseInt(selectedYear, 10) - 1;
    const yoyValKey = `${row.id}_${yoyYear}_${yoyPeriodKey}`;
    const yoyVal = dbValues[yoyValKey] || { kh: 0, th: 0 };
    const scaledThYoY = Math.round(yoyVal.th * valScale);

    const diffYoY = scaledTh - scaledThYoY;
    const deltaYoY = scaledThYoY > 0 ? Math.round((diffYoY / scaledThYoY) * 100) : 0;
    const diffEstYoY = scaledEst - scaledThYoY;
    const deltaEstYoY = scaledThYoY > 0 ? Math.round((diffEstYoY / scaledThYoY) * 100) : 0;

    return {
      kh: scaledKh,
      th: scaledTh,
      est: scaledEst,
      diffSoKh,
      htkhRate,
      thPrev: scaledThPrev,
      diffMoM,
      deltaMoM,
      diffEstMoM,
      deltaEstMoM,
      thYoY: scaledThYoY,
      diffYoY,
      deltaYoY,
      diffEstYoY,
      deltaEstYoY
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
    const diffEstMoMColor = comp.diffEstMoM > 0 ? '#059669' : comp.diffEstMoM < 0 ? '#dc2626' : '#64748b';
    const deltaEstMoMColor = comp.deltaEstMoM > 0 ? '#0284c7' : comp.deltaEstMoM < 0 ? '#dc2626' : '#64748b';

    const diffYoYColor = comp.diffYoY > 0 ? '#059669' : comp.diffYoY < 0 ? '#dc2626' : '#64748b';
    const deltaYoYColor = comp.deltaYoY > 0 ? '#0284c7' : comp.deltaYoY < 0 ? '#dc2626' : '#64748b';
    const diffEstYoYColor = comp.diffEstYoY > 0 ? '#059669' : comp.diffEstYoY < 0 ? '#dc2626' : '#64748b';
    const deltaEstYoYColor = comp.deltaEstYoY > 0 ? '#0284c7' : comp.deltaEstYoY < 0 ? '#dc2626' : '#64748b';

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
        <td className="cell-right" style={{ background: '#f9fbf9', color: '#475569' }}>
          {comp.thPrev > 0 ? fmt(comp.thPrev) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffMoMColor }}>
          {isClosed ? getDiffText(comp.diffMoM) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaMoMColor }}>
          {isClosed ? getDeltaText(comp.deltaMoM) : '--'}
        </td>
        {isMonth && (
          <>
            <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffEstMoMColor }}>
              {getDiffText(comp.diffEstMoM)}
            </td>
            <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaEstMoMColor }}>
              {getDeltaText(comp.deltaEstMoM)}
            </td>
          </>
        )}

        {/* Group 3 */}
        <td className="cell-right" style={{ background: '#f8fafc', color: '#475569' }}>
          {comp.thYoY > 0 ? fmt(comp.thYoY) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffYoYColor }}>
          {isClosed ? getDiffText(comp.diffYoY) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaYoYColor }}>
          {isClosed ? getDeltaText(comp.deltaYoY) : '--'}
        </td>
        {isMonth && (
          <>
            <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffEstYoYColor }}>
              {getDiffText(comp.diffEstYoY)}
            </td>
            <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaEstYoYColor }}>
              {getDeltaText(comp.deltaEstYoY)}
            </td>
          </>
        )}
      </React.Fragment>
    );
  };

  const renderSummaryPeriodCells = (val, isMonth = false, periodKey = '') => {
    const isClosed = isMonth ? officialMonths.includes(periodKey) : true;
    const kh = val.kh;
    const est = val.est || 0;
    const th = val.th;
    const thPrev = val.thPrev;
    const thYoY = val.thYoY;

    // Group 1
    const diffSoKh = th - kh;
    const htkhRate = kh > 0 ? Math.round((th / kh) * 100) : 0;

    // Group 2
    const diffMoM = th - thPrev;
    const deltaMoM = thPrev > 0 ? Math.round((diffMoM / thPrev) * 100) : 0;
    const diffEstMoM = est - thPrev;
    const deltaEstMoM = thPrev > 0 ? Math.round((diffEstMoM / thPrev) * 100) : 0;

    // Group 3
    const diffYoY = th - thYoY;
    const deltaYoY = thYoY > 0 ? Math.round((diffYoY / thYoY) * 100) : 0;
    const diffEstYoY = est - thYoY;
    const deltaEstYoY = thYoY > 0 ? Math.round((diffEstYoY / thYoY) * 100) : 0;

    // Format helpers
    const fmt = (v) => v.toLocaleString('vi-VN');
    const getDiffText = (v) => v > 0 ? `+${fmt(v)}` : fmt(v);
    const getDeltaText = (v) => v > 0 ? `+${v}%` : `${v}%`;

    const diffSoKhColor = diffSoKh > 0 ? '#059669' : diffSoKh < 0 ? '#dc2626' : '#64748b';
    const htkhRateColor = htkhRate >= 100 ? '#059669' : '#dc2626';

    const diffMoMColor = diffMoM > 0 ? '#059669' : diffMoM < 0 ? '#dc2626' : '#64748b';
    const deltaMoMColor = deltaMoM > 0 ? '#0284c7' : deltaMoM < 0 ? '#dc2626' : '#64748b';
    const diffEstMoMColor = diffEstMoM > 0 ? '#059669' : diffEstMoM < 0 ? '#dc2626' : '#64748b';
    const deltaEstMoMColor = deltaEstMoM > 0 ? '#0284c7' : deltaEstMoM < 0 ? '#dc2626' : '#64748b';

    const diffYoYColor = diffYoY > 0 ? '#059669' : diffYoY < 0 ? '#dc2626' : '#64748b';
    const deltaYoYColor = deltaYoY > 0 ? '#0284c7' : deltaYoY < 0 ? '#dc2626' : '#64748b';
    const diffEstYoYColor = diffEstYoY > 0 ? '#059669' : diffEstYoY < 0 ? '#dc2626' : '#64748b';
    const deltaEstYoYColor = deltaEstYoY > 0 ? '#0284c7' : deltaEstYoY < 0 ? '#dc2626' : '#64748b';

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
        <td className="cell-right" style={{ background: '#f9fbf9', color: '#475569' }}>
          {thPrev > 0 ? fmt(thPrev) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffMoMColor }}>
          {isClosed ? getDiffText(diffMoM) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaMoMColor }}>
          {isClosed ? getDeltaText(deltaMoM) : '--'}
        </td>
        {isMonth && (
          <>
            <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: diffEstMoMColor }}>
              {getDiffText(diffEstMoM)}
            </td>
            <td className="cell-right" style={{ background: '#f9fbf9', fontWeight: '600', color: deltaEstMoMColor }}>
              {getDeltaText(deltaEstMoM)}
            </td>
          </>
        )}

        {/* Group 3 */}
        <td className="cell-right" style={{ background: '#f8fafc', color: '#475569' }}>
          {thYoY > 0 ? fmt(thYoY) : '0'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffYoYColor }}>
          {isClosed ? getDiffText(diffYoY) : '--'}
        </td>
        <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaYoYColor }}>
          {isClosed ? getDeltaText(deltaYoY) : '--'}
        </td>
        {isMonth && (
          <>
            <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: diffEstYoYColor }}>
              {getDiffText(diffEstYoY)}
            </td>
            <td className="cell-right" style={{ background: '#f8fafc', fontWeight: '600', color: deltaEstYoYColor }}>
              {getDeltaText(deltaEstYoY)}
            </td>
          </>
        )}
      </React.Fragment>
    );
  };

  const renderProductionMonthCells = (kh, est, th, isClosed) => {
    const diff = th - kh;
    const delta = kh > 0 ? Math.round((diff / kh) * 100) : 0;
    const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
    const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';
    const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
    const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

    return (
      <React.Fragment key="prod_month">
        <td className="cell-right">{kh > 0 ? kh.toLocaleString('vi-VN') : '0'}</td>
        <td className="cell-right" style={{ color: est > 0 ? '#ea580c' : '#94a3b8', fontStyle: est > 0 ? 'normal' : 'italic' }}>
          {est > 0 ? est.toLocaleString('vi-VN') : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600' }}>
          {isClosed ? (
            <>
              {th > 0 ? th.toLocaleString('vi-VN') : '0'}
              {est > 0 && th > 0 && (
                <span style={{ display: 'block', fontSize: '9px', color: '#64748b', fontWeight: 'normal', marginTop: '2px' }}>
                  Lệch: {Math.round(((th - est) / est) * 100)}%
                </span>
              )}
            </>
          ) : (
            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 'normal' }}>--</span>
          )}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
          {isClosed ? (th > 0 ? diffText : '--') : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
          {isClosed ? (th > 0 ? deltaText : '--') : '--'}
        </td>
      </React.Fragment>
    );
  };

  const renderProductionQuarterCells = (kh, th) => {
    const diff = th - kh;
    const delta = kh > 0 ? Math.round((diff / kh) * 100) : 0;
    const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
    const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';
    const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
    const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

    return (
      <React.Fragment key="prod_quarter">
        <td className="cell-right">{kh > 0 ? kh.toLocaleString('vi-VN') : '0'}</td>
        <td className="cell-right" style={{ fontWeight: '600' }}>
          {th > 0 ? th.toLocaleString('vi-VN') : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
          {th > 0 ? diffText : '--'}
        </td>
        <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
          {th > 0 ? deltaText : '--'}
        </td>
      </React.Fragment>
    );
  };


  return (
    <div className="goal-result-container">
      {/* Header */}
      <div className="page-title-section">
        <h1>Kết quả doanh thu</h1>
        <p>QUẢN LÝ CHI TIẾT CƠ HỘI VÀ KHÁCH HÀNG TIỀM NĂNG</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div 
          className={`tab-item ${activeTab === 'ket_qua_doanh_thu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('ket_qua_doanh_thu');
            setCurrentPage(1);
          }}
        >
          Kết quả doanh thu
        </div>
        <div 
          className={`tab-item ${activeTab === 'san_luong_nghiem_thu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('san_luong_nghiem_thu');
            setCurrentPage(1);
          }}
        >
          Sản lượng nghiệm thu
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu KH nội bộ' : 'Sản lượng KH nội bộ'}
          </span>
          <span className="kpi-card-value">{summaryStats.internal}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu KH ngoài tập đoàn' : 'Sản lượng KH ngoài Tập đoàn'}
          </span>
          <span className="kpi-card-value">{summaryStats.external}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu KH quốc tế' : 'Sản lượng KH quốc tế'}
          </span>
          <span className="kpi-card-value">{summaryStats.international}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-label">
            {activeTab === 'ket_qua_doanh_thu' ? 'Tổng doanh thu' : 'Tổng Sản lượng'}
          </span>
          <span className="kpi-card-value">{summaryStats.total}</span>
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

          {/* Import Ước TH button with hover message/tooltip */}
          <button 
            className={`btn-excel-action ${estimateWindowTooltip ? 'btn-disabled' : ''}`}
            onClick={() => {
              if (estimateWindowTooltip) return;
              setImportDataType('estimate');
              setShowImportModal(true);
            }}
            title={estimateWindowTooltip}
            style={estimateWindowTooltip ? { opacity: 0.6, cursor: 'not-allowed', background: '#e2e8f0', color: '#94a3b8', border: '1px solid #cbd5e1' } : {}}
          >
            <Upload size={16} />
            Import Ước TH
          </button>
          
          <button 
            className="btn-excel-action" 
            onClick={() => {
              setImportDataType('th');
              setShowImportModal(true);
            }}
          >
            <Upload size={16} />
            Import TH chính thức
          </button>

          <button className="btn-excel-action" onClick={() => setShowExportModal(true)}>
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
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-1 matrix-group-title">Đơn vị thực hiện</th>
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-2 matrix-group-title">Nhóm khách hàng</th>
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-3 matrix-group-title">Tên khách hàng</th>
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-4 matrix-group-title">Nhóm SPDV</th>
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-5 matrix-group-title">Tên SPDV</th>
                <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} className="sticky-col-6 matrix-group-title cell-center">KH Mới</th>
                
                {/* Months */}
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 15 : 5} className="matrix-group-title cell-center">
                    Tháng {m}
                  </th>
                ))}

                {/* Quarters */}
                {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                  <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 4} className="matrix-group-title cell-center">
                    Quý {q}
                  </th>
                ))}

                {/* Year */}
                <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="matrix-group-title cell-center">
                  Cả năm
                </th>
              </tr>
              {/* Level 2 & 3 */}
              {activeTab === 'ket_qua_doanh_thu' ? (
                <>
                  {/* Level 2 (for Revenue): Column Groups */}
                  <tr>
                    {/* Months groups */}
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <React.Fragment key={`m_g_${m}`}>
                        <th colSpan={5} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          Thực hiện so với KH Tập đoàn
                        </th>
                        <th colSpan={5} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}
                        </th>
                        <th colSpan={5} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                          So Tháng {m} năm {parseInt(selectedYear, 10) - 1}
                        </th>
                      </React.Fragment>
                    ))}
                    {/* Quarters groups */}
                    {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                      <React.Fragment key={`q_g_${q}`}>
                        <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                          Thực hiện so với KH Tập đoàn
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
                    <React.Fragment key="y_g">
                      <th colSpan={4} className="matrix-indicator-title cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>
                        Thực hiện so với KH Tập đoàn
                      </th>
                      <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>
                        So Cả năm {parseInt(selectedYear, 10) - 1}
                      </th>
                      <th colSpan={3} className="matrix-indicator-title cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>
                        So Cả năm {parseInt(selectedYear, 10) - 1}
                      </th>
                    </React.Fragment>
                  </tr>

                  {/* Level 3 (for Revenue): Specific Indicators */}
                  <tr>
                    {/* Months indicators */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <React.Fragment key={`m_ind_${i}`}>
                        {/* Group 1 */}
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#ea580c' }}>Ước TH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>+/- so KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#475569' }}>% HTKH</th>
                        {/* Group 2 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#047857' }}>% delta</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#ea580c' }}>+/- Ước</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f9fbf9', color: '#ea580c' }}>% d.Ước</th>
                        {/* Group 3 */}
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#ea580c' }}>+/- Ước</th>
                        <th className="matrix-indicator-title cell-right" style={{ background: '#f8fafc', color: '#ea580c' }}>% d.Ước</th>
                      </React.Fragment>
                    ))}
                    {/* Quarters indicators */}
                    {Array.from({ length: 4 }).map((_, i) => (
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
                  </tr>
                </>
              ) : (
                <>
                  {/* Level 2 (for Production): Indicators directly */}
                  <tr>
                    {/* Months: KH, Ước, TH, Tăng/Giảm, % Delta */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <React.Fragment key={`m${i}`}>
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#ea580c' }}>Ước TH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#059669' }}>Tăng/Giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#0284c7' }}>% Delta</th>
                      </React.Fragment>
                    ))}
                    {/* Quarters: KH, TH, Tăng/Giảm, % Delta */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <React.Fragment key={`q${i}`}>
                        <th className="matrix-indicator-title cell-right">KH</th>
                        <th className="matrix-indicator-title cell-right">TH</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#059669' }}>Tăng/Giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#0284c7' }}>% Delta</th>
                      </React.Fragment>
                    ))}
                    {/* Year: KH, TH */}
                    <th className="matrix-indicator-title cell-right">KH</th>
                    <th className="matrix-indicator-title cell-right">TH</th>
                    {activeTab === 'san_luong_nghiem_thu' && (
                      <>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#059669' }}>Tăng/Giảm</th>
                        <th className="matrix-indicator-title cell-right" style={{ color: '#0284c7' }}>% Delta</th>
                      </>
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
                      {isFirstUnit && (
                        <td 
                          className="sticky-col-1 unit-master-cell" 
                          rowSpan={unitSpanCount}
                        >
                          {row.implementationUnit}
                        </td>
                      )}
                      <td className="sticky-col-2">{row.customerGroup}</td>
                      <td className="sticky-col-3">{row.customerName}</td>
                      <td className="sticky-col-4">{row.spdvGroup}</td>
                      <td className="sticky-col-5">{row.spdvName}</td>
                      <td className="sticky-col-6 cell-center">
                        <input 
                          type="checkbox" 
                          className="custom-checkbox" 
                          checked={row.isNewCustomer} 
                          disabled 
                        />
                      </td>
 
                      {/* Render Month columns */}
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                        const periodKey = `m${m}`;
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, true);
                        } else {
                          const valKey = `${row.id}_${selectedYear}_${periodKey}`;
                          const val = dbValues[valKey] || { kh: 0, th: 0 };
                          const estVal = estimatesDb[valKey] || null;
                          const isClosed = officialMonths.includes(periodKey);

                          const scaledKh = Math.round(val.kh * valScale);
                          const scaledTh = Math.round(val.th * valScale);
                          const scaledEst = estVal ? Math.round(estVal * valScale) : 0;

                          return renderProductionMonthCells(scaledKh, scaledEst, scaledTh, isClosed);
                        }
                      })}

                      {/* Render Quarter columns */}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => {
                        const periodKey = `q${q}`;
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, false);
                        } else {
                          const valKey = `${row.id}_${selectedYear}_${periodKey}`;
                          const val = dbValues[valKey] || { kh: 0, th: 0 };
                          const scaledKh = Math.round(val.kh * valScale);
                          const scaledTh = Math.round(val.th * valScale);

                          return renderProductionQuarterCells(scaledKh, scaledTh);
                        }
                      })}

                      {/* Render Year columns */}
                      {(() => {
                        const periodKey = 'y';
                        if (activeTab === 'ket_qua_doanh_thu') {
                          return renderPeriodCompCells(row, periodKey, valScale, false);
                        } else {
                          const valKey = `${row.id}_${selectedYear}_y`;
                          const val = dbValues[valKey] || { kh: 0, th: 0 };
                          const scaledKh = Math.round(val.kh * valScale);
                          const scaledTh = Math.round(val.th * valScale);

                          const diff = scaledTh - scaledKh;
                          const delta = scaledKh > 0 ? Math.round((diff / scaledKh) * 100) : 0;

                          const diffText = diff > 0 ? `+${diff.toLocaleString('vi-VN')}` : diff.toLocaleString('vi-VN');
                          const diffColor = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#64748b';

                          const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
                          const deltaColor = delta > 0 ? '#0284c7' : delta < 0 ? '#dc2626' : '#64748b';

                          return (
                            <React.Fragment key={periodKey}>
                              <td className="cell-right">{scaledKh.toLocaleString('vi-VN')}</td>
                              <td className="cell-right" style={{ fontWeight: '600' }}>
                                {scaledTh > 0 ? scaledTh.toLocaleString('vi-VN') : '--'}
                              </td>
                              {activeTab === 'san_luong_nghiem_thu' && (
                                <>
                                  <td className="cell-right" style={{ fontWeight: '600', color: diffColor }}>
                                    {scaledTh > 0 ? diffText : '--'}
                                  </td>
                                  <td className="cell-right" style={{ fontWeight: '600', color: deltaColor }}>
                                    {scaledTh > 0 ? deltaText : '--'}
                                  </td>
                                </>
                              )}
                            </React.Fragment>
                          );
                        }
                      })()}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={activeTab === 'ket_qua_doanh_thu' ? 236 : (activeTab === 'san_luong_nghiem_thu' ? 86 : 52)} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
              {activeTab === 'ket_qua_doanh_thu' ? 'Biểu mẫu doanh thu nội bộ tổng hợp' : 'Biểu mẫu sản lượng nội bộ tổng hợp'}
            </h2>
            <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>
              Hệ thống tự động tổng hợp từ bảng chi tiết ở trên
            </p>
          </div>

          {/* Section: KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedNewCounts(!collapsedNewCounts)}>
              <h3>KẾT QUẢ THỰC HIỆN - SỐ LƯỢNG KHÁCH HÀNG VÀ HỢP ĐỒNG MỚI</h3>
              <div className="summary-card-header-right">
                <span>{collapsedNewCounts ? 'Mở rộng' : 'Thu gọn'}</span>
                <ChevronDown size={16} style={{ transform: collapsedNewCounts ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedNewCounts && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '220px', textAlign: 'left' }}>Chỉ tiêu</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={`new_head_m_${m}`} className="cell-center">T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <th key={`new_head_q_${q}`} className="cell-center">Q{q}</th>
                      ))}
                      <th className="cell-center">Năm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="summary-col-label">Số lượng khách hàng mới (kế hoạch)</td>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <td key={`new_cust_m_${m}`} className="cell-center" style={{ padding: '6px' }}>
                          <input 
                            type="text" 
                            className="month-grid-input readonly-input cell-center" 
                            style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                            value={newCountsSummary.newCustomerCount[`m${m}`]} 
                            readOnly 
                          />
                        </td>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <td key={`new_cust_q_${q}`} className="cell-center" style={{ padding: '6px' }}>
                          <input 
                            type="text" 
                            className="month-grid-input readonly-input cell-center" 
                            style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                            value={newCountsSummary.newCustomerCount[`q${q}`]} 
                            readOnly 
                          />
                        </td>
                      ))}
                      <td className="cell-center" style={{ padding: '6px' }}>
                        <input 
                          type="text" 
                          className="month-grid-input readonly-input cell-center" 
                          style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontWeight: 'bold' }} 
                          value={newCountsSummary.newCustomerCount.nam} 
                          readOnly 
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="summary-col-label">Số lượng hợp đồng mới (kế hoạch)</td>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <td key={`new_cont_m_${m}`} className="cell-center" style={{ padding: '6px' }}>
                          <input 
                            type="text" 
                            className="month-grid-input readonly-input cell-center" 
                            style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                            value={newCountsSummary.newContractCount[`m${m}`]} 
                            readOnly 
                          />
                        </td>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <td key={`new_cont_q_${q}`} className="cell-center" style={{ padding: '6px' }}>
                          <input 
                            type="text" 
                            className="month-grid-input readonly-input cell-center" 
                            style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                            value={newCountsSummary.newContractCount[`q${q}`]} 
                            readOnly 
                          />
                        </td>
                      ))}
                      <td className="cell-center" style={{ padding: '6px' }}>
                        <input 
                          type="text" 
                          className="month-grid-input readonly-input cell-center" 
                          style={{ width: '60px', height: '30px', margin: '0 auto', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontWeight: 'bold' }} 
                          value={newCountsSummary.newContractCount.nam} 
                          readOnly 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table 2.1: Theo đơn vị thực hiện */}
          <div className="summary-card">
            <div className="summary-card-header" onClick={() => setCollapsedTable1(!collapsedTable1)}>
              <h3>2.1 Biểu tổng hợp kết quả theo đơn vị thực hiện</h3>
              <div className="summary-card-header-right">
                <span>{collapsedTable1 ? 'Mở rộng' : 'Thu gọn'}</span>
                <ChevronDown size={16} style={{ transform: collapsedTable1 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable1 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '180px', verticalAlign: 'middle', textAlign: 'left' }}>Đơn vị thực hiện</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 15 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>% d.Ước</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>% d.Ước</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => (
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
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                        {activeTab === 'san_luong_nghiem_thu' && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
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
                        {Array.from({ length: 4 }, (_, i) => i + 1).map(q => {
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
                <span>{collapsedTable1_2 ? 'Mở rộng' : 'Thu gọn'}</span>
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
                <span>{collapsedTable2 ? 'Mở rộng' : 'Thu gọn'}</span>
                <ChevronDown size={16} style={{ transform: collapsedTable2 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable2 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '220px', verticalAlign: 'middle', textAlign: 'left' }}>Nhóm khách hàng</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 15 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>% d.Ước</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>% d.Ước</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => (
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
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                        {activeTab === 'san_luong_nghiem_thu' && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
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
                        {Array.from({ length: 4 }, (_, i) => i + 1).map(q => {
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
                <span>{collapsedTable3 ? 'Mở rộng' : 'Thu gọn'}</span>
                <ChevronDown size={16} style={{ transform: collapsedTable3 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            {!collapsedTable3 && (
              <div className="table-scroll-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th rowSpan={activeTab === 'ket_qua_doanh_thu' ? 3 : 2} style={{ minWidth: '180px', verticalAlign: 'middle', textAlign: 'left' }}>Nhóm SPDV</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={`m${m}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 15 : 3} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>T{m}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                        <th key={`q${q}`} colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : 2} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Quý {q}</th>
                      ))}
                      <th colSpan={activeTab === 'ket_qua_doanh_thu' ? 10 : (activeTab === 'san_luong_nghiem_thu' ? 4 : 2)} className="cell-center" style={{ borderBottom: '1px solid #cbd5e1' }}>Cả năm</th>
                    </tr>
                    {activeTab === 'ket_qua_doanh_thu' ? (
                      <>
                        <tr>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <React.Fragment key={`m_g_${m}`}>
                              <th colSpan={5} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m === 1 ? `12/${parseInt(selectedYear, 10) - 1}` : m - 1}</th>
                              <th colSpan={5} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Tháng {m} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }, (_, i) => i + 1).map(q => (
                            <React.Fragment key={`q_g_${q}`}>
                              <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Quý {q === 1 ? `4/${parseInt(selectedYear, 10) - 1}` : q - 1}</th>
                              <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Quý {q} năm {parseInt(selectedYear, 10) - 1}</th>
                            </React.Fragment>
                          ))}
                          <th colSpan={4} className="cell-center" style={{ background: '#f1f5f9', fontSize: '11px', borderBottom: '1px solid #cbd5e1' }}>Thực hiện so với KH Tập đoàn</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#ecfdf5', fontSize: '11px', color: '#065f46', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                          <th colSpan={3} className="cell-center" style={{ background: '#eff6ff', fontSize: '11px', color: '#1e40af', borderBottom: '1px solid #cbd5e1' }}>So Cả năm {parseInt(selectedYear, 10) - 1}</th>
                        </tr>
                        <tr>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <React.Fragment key={`m_inds_${i}`}>
                              {/* Group 1 */}
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>+/- so KH</th>
                              <th className="cell-right" style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>% HTKH</th>
                              {/* Group 2 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#047857' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f9fbf9', color: '#ea580c' }}>% d.Ước</th>
                              {/* Group 3 */}
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>TH</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>Tăng/giảm</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#1d4ed8' }}>% delta</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>+/- Ước</th>
                              <th className="cell-right" style={{ fontSize: '11px', background: '#f8fafc', color: '#ea580c' }}>% d.Ước</th>
                            </React.Fragment>
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => (
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
                        </tr>
                      </>
                    ) : (
                      <tr>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <React.Fragment key={`m_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600' }}>Ước</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <React.Fragment key={`q_ind_${i}`}>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
                          </React.Fragment>
                        ))}
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>KH</th>
                        <th className="cell-right" style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>TH</th>
                        {activeTab === 'san_luong_nghiem_thu' && (
                          <>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Tăng/Giảm</th>
                            <th className="cell-right" style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>% Delta</th>
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
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
                        {Array.from({ length: 4 }, (_, i) => i + 1).map(q => {
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
                <span>{collapsedTable4 ? 'Mở rộng' : 'Thu gọn'}</span>
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
          <div className="modal-content">
            <div className="modal-header">
              <h3>Bộ lọc nâng cao</h3>
              <button className="btn-close-modal" onClick={() => setShowAdvancedFilters(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nhóm khách hàng (Multi-select)</label>
                <div className="multi-select-box">
                  {CUSTOMER_GROUPS_LIST.map(g => (
                    <label key={g} className="multi-select-option">
                      <input 
                        type="checkbox" 
                        checked={selectedGroups.includes(g)}
                        onChange={() => handleToggleGroup(g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Tên khách hàng (Multi-select)</label>
                <div className="multi-select-box">
                  {CUSTOMERS_DB.map(c => (
                    <label key={c.id} className="multi-select-option">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(c.name)}
                        onChange={() => handleToggleCustomer(c.name)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Nhóm SPDV (Multi-select)</label>
                <div className="multi-select-box">
                  {Array.from(new Set(SPDVS_DB.map(s => s.group))).map(sg => (
                    <label key={sg} className="multi-select-option">
                      <input 
                        type="checkbox" 
                        checked={selectedSPDVGroups.includes(sg)}
                        onChange={() => handleToggleSPDVGroup(sg)}
                      />
                      {sg}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Tên SPDV (Multi-select)</label>
                <div className="multi-select-box">
                  {SPDVS_DB.map(s => (
                    <label key={s.id} className="multi-select-option">
                      <input 
                        type="checkbox" 
                        checked={selectedSPDVs.includes(s.name)}
                        onChange={() => handleToggleSPDV(s.name)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', gap: '8px', alignItems: 'center', padding: '6px 0' }}>
                <input 
                  type="checkbox" 
                  id="chk-new-cust"
                  checked={isNewCustomerFilter}
                  onChange={(e) => {
                    setIsNewCustomerFilter(e.target.checked);
                    setCurrentPage(1);
                  }}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="chk-new-cust" style={{ cursor: 'pointer' }}>Là khách hàng mới</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleClearAllFilters}>
                Xóa tất cả bộ lọc
              </button>
              <button className="btn-apply" onClick={() => setShowAdvancedFilters(false)}>
                Áp dụng
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
              <h3>{importDataType === 'estimate' ? 'Nhập Excel Ước thực hiện (Ước TH)' : `Nhập Excel Kết quả TH - ${activeTab === 'ket_qua_doanh_thu' ? 'Doanh thu' : 'Sản lượng'}`}</h3>
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
                  <div className="date-selector-row">
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
                  ) : (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#166534', marginBottom: '8px' }}>
                      💡 <strong>Quy tắc TH chính thức:</strong> Cho phép cập nhật kỳ hiện tại và kỳ liền kề trước. Hạn cập nhật kỳ liền kề trước là trước <strong>ngày 10 hàng tháng</strong>.
                    </div>
                  )}

                  <div className="upload-dropzone" onClick={() => handleSimulateUpload('valid')}>
                    <div className="upload-icon-wrapper">
                      <Upload size={28} />
                    </div>
                    <div>
                      <strong>Nhấp để chọn file Excel từ thiết bị của bạn</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Định dạng hỗ trợ: .xls, .xlsx (Tối đa 10.000 bản ghi)</p>
                    </div>
                  </div>

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
                        <td><strong>{importDataType === 'estimate' ? 'Số ước thực hiện (Ước TH)' : 'Số thực hiện (TH)'}</strong></td>
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
                            <li>Loại dữ liệu: <strong>{importDataType === 'estimate' ? 'Số Ước thực hiện (Ước TH)' : 'Số thực hiện chính thức (TH)'}</strong></li>
                            <li>Số lượng dòng nạp: <strong>{uploadedFile.rowsCount} dòng</strong></li>
                            <li>Tổng số liệu tích lũy nạp vào: <strong>{importDataType === 'estimate' ? '9.500' : '9.423'}</strong></li>
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
                  {isImporting ? 'Đang Import...' : 'Nạp dữ liệu (Import)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPORT EXCEL PARAMETERS */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xuất Excel Báo cáo Kết quả</h3>
              <button className="btn-close-modal" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', margin: '0 0 16px 0', color: '#475569' }}>
                Hệ thống sẽ thực hiện kết xuất dữ liệu kết quả doanh thu dựa trên các điều kiện lọc hiện tại.
              </p>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Chọn mẫu báo cáo kết xuất:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                    <input 
                      type="radio" 
                      name="export-template" 
                      value="detail" 
                      checked={exportTemplate === 'detail'} 
                      onChange={() => setExportTemplate('detail')} 
                    />
                    <span>Báo cáo chi tiết Ma trận thực hiện (Matrix Grid)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                    <input 
                      type="radio" 
                      name="export-template" 
                      value="summary" 
                      checked={exportTemplate === 'summary'} 
                      onChange={() => setExportTemplate('summary')} 
                    />
                    <span>Báo cáo tổng hợp doanh thu nội bộ (Internal Revenue Summary)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowExportModal(false)}>
                Hủy
              </button>
              <button className="btn-apply" onClick={handleExportData}>
                Bắt đầu xuất Excel
              </button>
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
