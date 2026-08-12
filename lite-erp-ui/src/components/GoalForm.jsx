import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  MessageSquare,
  History,
  Trash2,
  Plus,
  ChevronDown,
  ArrowUpDown,
  Filter,
  ArrowDownToLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './GoalForm.css';

const STEPS = [
  { num: 1, label: 'Mới tạo', active: true },
  { num: 2, label: 'Chờ điều chỉnh', active: false },
  { num: 3, label: 'Hiệu lực', active: false }
];

const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => (2024 + i).toString());

const MONTH_KEYS = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12'];
const QUARTER_KEYS = ['q1', 'q2', 'q3', 'q4'];

const INITIAL_SERVICE_QUALITY_ROWS = [
  { id: '1.1', name: 'Tỷ lệ cuộc gọi kết nối thành công đến tổng đài', level: 2, isParent: true },
  { id: '1.1.1', parentId: '1.1', name: 'TLKN kênh Di động Vip/Svip', level: 3, isParent: false, implementationUnit: 'P.QLNV', m1: '99.2', m2: '98.8', m3: '99.4', m4: '99.0', m5: '98.6', m6: '99.2', m7: '99.0', m8: '98.8', m9: '99.2', m10: '99.4', m11: '99.0', m12: '99.2' },
  { id: '1.1.2', parentId: '1.1', name: 'TLKN kênh Di động thường/Hotline/CDS', level: 3, isParent: false, implementationUnit: 'P.QLNV', m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  { id: '1.1.3', parentId: '1.1', name: 'TLKN kênh SME', level: 3, isParent: false, implementationUnit: 'TTCN&KT', m1: '97.2', m2: '96.8', m3: '97.4', m4: '97.0', m5: '96.6', m6: '97.2', m7: '97.0', m8: '96.8', m9: '97.2', m10: '97.4', m11: '97.0', m12: '97.2' },
  { id: '1.1.4', parentId: '1.1', name: 'TLKN kênh CĐBR và truyền hình', level: 3, isParent: false, implementationUnit: 'P.QLNV', m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  { id: '1.1.5', parentId: '1.1', name: 'TLKN kênh 1789N1', level: 3, isParent: false, implementationUnit: 'TTCN&KT', m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  { id: '1.1.6', parentId: '1.1', name: 'TLKN kênh Videocall', level: 3, isParent: false, implementationUnit: 'GĐSP CX BOT', m1: '95.2', m2: '94.8', m3: '95.4', m4: '95.0', m5: '94.6', m6: '95.2', m7: '95.0', m8: '94.8', m9: '95.2', m10: '95.4', m11: '95.0', m12: '95.2' },
  { id: '1.1.7', parentId: '1.1', name: 'TLKN kênh 1789N2', level: 3, isParent: false, implementationUnit: 'TTCN&KT', m1: '97.2', m2: '96.8', m3: '97.4', m4: '97.0', m5: '96.6', m6: '97.2', m7: '97.0', m8: '96.8', m9: '97.2', m10: '97.4', m11: '97.0', m12: '97.2' },
  { id: '1.2', name: 'Tỷ lệ hài lòng của khách hàng', level: 2, isParent: true },
  { id: '1.2.1', parentId: '1.2', name: 'Kênh FO', level: 3, isParent: false, implementationUnit: 'P.DVTN&CSKH', m1: '95.2', m2: '94.8', m3: '95.4', m4: '95.0', m5: '94.6', m6: '95.2', m7: '95.0', m8: '94.8', m9: '95.2', m10: '95.4', m11: '95.0', m12: '95.2' },
  { id: '1.2.2', parentId: '1.2', name: 'Kênh BO', level: 3, isParent: false, implementationUnit: 'P.DVTN&CSKH', m1: '94.2', m2: '93.8', m3: '94.4', m4: '94.0', m5: '93.6', m6: '94.2', m7: '94.0', m8: '93.8', m9: '94.2', m10: '94.4', m11: '94.0', m12: '94.2' },
  { id: '1.2.3', parentId: '1.2', name: 'Callbot Inbound', level: 3, isParent: false, implementationUnit: 'GĐSP CX BOT', m1: '92.2', m2: '91.8', m3: '92.4', m4: '92.0', m5: '91.6', m6: '92.2', m7: '92.0', m8: '91.8', m9: '92.2', m10: '92.4', m11: '92.0', m12: '92.2' }
];

const EMPTY_ROW = {
  implementationUnit: '',
  customerGroup: '',
  customerName: '',
  spdvGroup: '',
  spdvName: '',
  t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
  t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
  q1: 0, q2: 0, q3: 0, q4: 0,
  nam: 0
};

const IMPLEMENTATION_UNITS = [
  'P.CLKD',
  'BP.BÁN HÀNG',
  'P.DVTN&CSKH',
  'P.QLNV',
  'TTCN&KT',
  'KVMB',
  'KVHP',
  'KVTN',
  'KVMT',
  'KVMN',
  'GĐSP BẢO HÀNH',
  'GĐSP CX BOT',
  'GĐSP OMNIX',
  'GĐSP DIGITAL SALE',
  'GĐSP ĐỐI NGOẠI',
  'GĐSP KNOWXHUB',
  'GĐSP SỐ HÓA'
];

const getDefaultUnitForSqRow = (rowId) => {
  if (rowId.startsWith('1.1.1') || rowId.startsWith('1.1.2') || rowId.startsWith('1.1.4')) return 'P.QLNV';
  if (rowId.startsWith('1.1.3') || rowId.startsWith('1.1.5') || rowId.startsWith('1.1.7')) return 'TTCN&KT';
  if (rowId.startsWith('1.1.6')) return 'GĐSP CX BOT';
  if (rowId.startsWith('1.1')) return 'P.DVTN&CSKH';
  if (rowId.startsWith('1.2.1') || rowId.startsWith('1.2.2')) return 'P.DVTN&CSKH';
  if (rowId.startsWith('1.2.3')) return 'GĐSP CX BOT';
  if (rowId.startsWith('1.2')) return 'P.DVTN&CSKH';
  return 'P.DVTN&CSKH';
};

const DOCUMENT_TYPES = [
  'Kế hoạch mục tiêu năm',
  'Hợp đồng',
  'Phụ lục hợp đồng',
  'Biên bản nghiệm thu',
  'Hóa đơn',
  'Phiếu đặt hàng',
  'Báo giá',
  'Đề nghị mua hàng',
  'Biên bản bàn giao',
  'Tờ trình',
  'Công văn',
  'Tài liệu kỹ thuật',
  'Khác'
];

const CUSTOMER_GROUPS = [
  'Khách hàng nội bộ - Tập đoàn trong nước',
  'Khách hàng nội bộ - Tập đoàn nước ngoài',
  'Khách hàng ngoài - Tập đoàn trong nước',
  'Khách hàng ngoài - Tập đoàn nước ngoài'
];

const CUSTOMER_NAMES_MAP = {
  'Khách hàng nội bộ - Tập đoàn trong nước': [
    '0101111222 - Công ty A (Nội bộ)',
    '0101111333 - Tổng công ty B (Nội bộ)',
    '0100109106 - Viettel Telecom (Nội bộ)',
    '0108869738 - Viettel Solution (Nội bộ)',
    '0106685762 - Viettel Post (Nội bộ)',
    '0100109107 - Viettel Digital (Nội bộ)',
    '0108988023 - Viettel HighTech (Nội bộ)',
    '0108988099 - Viettel Networks (Nội bộ)'
  ],
  'Khách hàng nội bộ - Tập đoàn nước ngoài': [
    '0202222333 - Công ty C (Nội bộ FDI)',
    '0202222444 - Công ty D (Nội bộ FDI)',
    '0102660144 - Viettel Global (Nội bộ nước ngoài)'
  ],
  'Khách hàng ngoài - Tập đoàn trong nước': [
    '0107654321 - Viettel (Tập đoàn Viettel)',
    '0109876543 - FPT (Tập đoàn FPT)',
    '0101112223 - Masan (Tập đoàn Masan)',
    '0105556667 - Công ty E (Ngoài)',
    '0300588569 - Vinamilk (Công ty Cổ phần Sữa Việt Nam)',
    '0100283873 - MB Bank (Ngân hàng TMCP Quân đội)'
  ],
  'Khách hàng ngoài - Tập đoàn nước ngoài': [
    '0101234567 - Hakuhodo (Hakuhodo Việt Nam)',
    '0303333444 - Toyota Việt Nam (Toyota)',
    '0404444555 - Samsung Vina (Samsung)'
  ]
};

const SPDV_GROUPS = [
  'DV CC outsourcing',
  'DV BPO',
  'Upsell (Telesale, digital sale)',
  'Loyalty, quà tặng',
  'DV khác',
  'Giải pháp'
];

const SPDV_NAMES_MAP = {
  'DV CC outsourcing': [
    'PRD-001 - Dịch vụ FO',
    'PRD-002 - Happy call',
    'PRD-003 - Hỗ trợ kênh',
    'PRD-004 - BO GQKN',
    'PRD-005 - BO CSKH',
    'PRD-006 - BO Antispam',
    'PRD-007 - BO Reputa'
  ],
  'DV BPO': [
    'PRD-008 - Chỉnh lý, số hóa tài liệu'
  ],
  'Upsell (Telesale, digital sale)': [
    'PRD-009 - DV bán hàng telesale/Kênh TLS/Digital Sales',
    'PRD-010 - Hoa hồng kênh CC'
  ],
  'Loyalty, quà tặng': [
    'PRD-011 - Phòng chờ, đón tiễn',
    'PRD-012 - Quà tặng'
  ],
  'DV khác': [
    'PRD-013 - Bảo hành',
    'PRD-014 - Đo kiểm',
    'PRD-015 - Sự kiện',
    'PRD-016 - Lễ tân',
    'PRD-017 - CX'
  ],
  'Giải pháp': [
    'PRD-018 - OmniX/QualityX',
    'PRD-019 - CXBot/CallBOT',
    'PRD-020 - KnowX Hub & AgentMate',
    'PRD-021 - Camera AI'
  ]
};

const GoalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();

  const [planYear, setPlanYear] = useState('2026');
  const [planType, setPlanType] = useState('Kế hoạch tập đoàn');

  useEffect(() => {
    if (!isEdit) {
      const params = new URLSearchParams(location.search);
      const type = params.get('type');
      if (type === 'internal') {
        setPlanType('Kế hoạch nội bộ');
      } else {
        setPlanType('Kế hoạch tập đoàn');
      }
    }
  }, [location.search, isEdit]);
  const [statusLabel, setStatusLabel] = useState('Mới tạo');
  const [activeSideTab, setActiveSideTab] = useState('comment');
  const [commentInput, setCommentInput] = useState('');
  const [existingRows, setExistingRows] = useState([{ ...EMPTY_ROW }]);
  const [newCustomerPlanRows, setNewCustomerPlanRows] = useState([
    {
      id: `new-rev-${Date.now()}-1`,
      name: 'Doanh thu khách hàng mới (kế hoạch)',
      implementationUnit: 'BP.BÁN HÀNG',
      t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
      t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
      q1: '0', q2: '0', q3: '0', q4: '0',
      nam: '0'
    }
  ]);
  const [collapsedTable1, setCollapsedTable1] = useState(false);
  const [collapsedTable3, setCollapsedTable3] = useState(false);
  const [collapsedTable4, setCollapsedTable4] = useState(false);

  const {
    unitSummaryInForm,
    formTotalCount,
    formTotalValue,
    customerGroupSummaryInForm,
    spdvGroupSummaryInForm
  } = useMemo(() => {
    const summaryMap = {};
    const customerSummaryMap = {};
    const spdvSummaryMap = {};

    existingRows.forEach(row => {
      // 1. Unit Summary
      const unit = row.implementationUnit;
      if (unit) {
        if (!summaryMap[unit]) {
          summaryMap[unit] = { unit, count: 0, total: 0 };
        }
        summaryMap[unit].count += 1;
        summaryMap[unit].total += parseFloat(row.nam) || 0;
      }

      // 2. Customer Group Summary
      const custGroup = row.customerGroup || 'Chưa phân loại';
      if (custGroup) {
        if (!customerSummaryMap[custGroup]) {
          customerSummaryMap[custGroup] = { group: custGroup, total: 0 };
        }
        customerSummaryMap[custGroup].total += parseFloat(row.nam) || 0;
      }

      // 3. SPDV Group Summary
      const spdvGroup = row.spdvGroup || 'Chưa phân loại';
      if (spdvGroup) {
        if (!spdvSummaryMap[spdvGroup]) {
          spdvSummaryMap[spdvGroup] = { group: spdvGroup, total: 0 };
        }
        spdvSummaryMap[spdvGroup].total += parseFloat(row.nam) || 0;
      }
    });

    newCustomerPlanRows.forEach(row => {
      // 1. Unit Summary
      const unit = row.implementationUnit;
      if (unit) {
        if (!summaryMap[unit]) {
          summaryMap[unit] = { unit, count: 0, total: 0 };
        }
        summaryMap[unit].total += parseFloat(row.nam) || 0;
      }

      // 2. Customer Group Summary - treat new customer row as 'Khách hàng mới'
      const custGroup = 'Khách hàng mới';
      if (!customerSummaryMap[custGroup]) {
        customerSummaryMap[custGroup] = { group: custGroup, total: 0 };
      }
      customerSummaryMap[custGroup].total += parseFloat(row.nam) || 0;
    });

    const summaryList = Object.values(summaryMap).sort((a, b) => b.total - a.total);
    const totalCount = summaryList.reduce((sum, item) => sum + item.count, 0);
    const totalValue = summaryList.reduce((sum, item) => sum + item.total, 0);

    const customerList = Object.values(customerSummaryMap).sort((a, b) => b.total - a.total);
    const spdvList = Object.values(spdvSummaryMap).sort((a, b) => b.total - a.total);

    return {
      unitSummaryInForm: summaryList,
      formTotalCount: totalCount,
      formTotalValue: totalValue,
      customerGroupSummaryInForm: customerList,
      spdvGroupSummaryInForm: spdvList
    };
  }, [existingRows, newCustomerPlanRows]);

  const [newCustomerCountPlanRows, setNewCustomerCountPlanRows] = useState([
    {
      id: `new-cust-count-1`,
      name: 'Số lượng khách hàng mới (kế hoạch)',
      implementationUnit: 'BP.BÁN HÀNG',
      t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
      t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
      q1: '0', q2: '0', q3: '0', q4: '0',
      nam: '0'
    },
    {
      id: `new-cust-count-2`,
      name: 'Số lượng hợp đồng mới (kế hoạch)',
      implementationUnit: 'GĐSP ĐỐI NGOẠI',
      t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
      t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
      q1: '0', q2: '0', q3: '0', q4: '0',
      nam: '0'
    }
  ]);

  const [serviceQualityPlanRows, setServiceQualityPlanRows] = useState(INITIAL_SERVICE_QUALITY_ROWS);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importDataType, setImportDataType] = useState('existing_cust'); // existing_cust, new_cust_rev, new_cust_count, service_quality
  const [importStep, setImportStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setImportStep(1);
    setUploadedFile(null);
    setValidationResult(null);
  };

  const handleSimulateUpload = (type) => {
    if (type === 'valid') {
      setUploadedFile({
        name: 'Kehoach_kpi_2026.xlsx',
        size: '22.8 KB',
        rowsCount: 15,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers: ['Đơn vị thực hiện', 'Nhóm khách hàng', 'Tên khách hàng', 'Nhóm SPDV', 'Tên SPDV', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
      });
    }
  };

  const handleTestImport = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setValidationResult({
        status: 'success',
        msg: 'Kiểm thử Excel thành công: Toàn bộ 15 dòng dữ liệu kế hoạch hợp lệ và khớp với danh mục hệ thống.'
      });
      setImportStep(3);
    }, 1500);
  };

  const handleImportToDatabase = () => {
    if (importDataType === 'existing_cust') {
      const mockExisting = [
        {
          id: `row-${Date.now()}-1`,
          implementationUnit: 'Phòng Dự Án',
          customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước',
          customerName: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel',
          spdvGroup: 'Giải pháp, Platform',
          spdvName: 'OmniX CRM',
          t1: '150000000', t2: '150000000', t3: '150000000', t4: '150000000', t5: '150000000', t6: '150000000',
          t7: '150000000', t8: '150000000', t9: '150000000', t10: '150000000', t11: '150000000', t12: '150000000',
          q1: 450000000, q2: 450000000, q3: 450000000, q4: 450000000,
          nam: 1800000000
        },
        {
          id: `row-${Date.now()}-2`,
          implementationUnit: 'BP.BÁN HÀNG',
          customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
          customerName: 'Công ty Cổ phần Sữa Việt Nam',
          spdvGroup: 'DV CC outsourcing',
          spdvName: 'Dịch vụ Tổng đài',
          t1: '80000000', t2: '80000000', t3: '80000000', t4: '120000000', t5: '120000000', t6: '120000000',
          t7: '100000000', t8: '100000000', t9: '100000000', t10: '100000000', t11: '100000000', t12: '100000000',
          q1: 240000000, q2: 360000000, q3: 300000000, q4: 300000000,
          nam: 1200000000
        }
      ];
      setExistingRows(mockExisting);
      alert('Đã nhập thành công số liệu kế hoạch chỉ tiêu doanh thu khách hàng hiện hữu từ file Excel!');
    } else if (importDataType === 'new_cust_rev') {
      setNewCustomerPlanRows([
        {
          id: `new-rev-${Date.now()}-1`,
          name: 'Doanh thu khách hàng mới (kế hoạch)',
          implementationUnit: 'BP.BÁN HÀNG',
          t1: '50000000', t2: '60000000', t3: '70000000', t4: '80000000', t5: '90000000', t6: '100000000',
          t7: '110000000', t8: '120000000', t9: '130000000', t10: '140000000', t11: '150000000', t12: '160000000',
          q1: 180000000, q2: 270000000, q3: 360000000, q4: 450000000,
          nam: 1260000000
        }
      ]);
      alert('Đã nhập thành công số liệu kế hoạch chỉ tiêu doanh thu khách hàng mới từ file Excel!');
      setNewCustomerCountPlanRows([
        {
          id: `new-cust-count-1`,
          name: 'Số lượng khách hàng mới (kế hoạch)',
          implementationUnit: 'BP.BÁN HÀNG',
          t1: '2', t2: '3', t3: '2', t4: '4', t5: '3', t6: '3',
          t7: '2', t8: '4', t9: '3', t10: '5', t11: '3', t12: '4',
          q1: 7, q2: 10, q3: 9, q4: 12,
          nam: 38
        },
        {
          id: `new-cust-count-2`,
          name: 'Số lượng hợp đồng mới (kế hoạch)',
          implementationUnit: 'GĐSP ĐỐI NGOẠI',
          t1: '4', t2: '5', t3: '3', t4: '6', t5: '5', t6: '4',
          t7: '5', t8: '6', t9: '4', t10: '7', t11: '5', t12: '6',
          q1: 12, q2: 15, q3: 15, q4: 18,
          nam: 60
        }
      ]);
      alert('Đã nhập thành công số liệu kế hoạch số lượng khách hàng và hợp đồng mới từ file Excel!');
    } else if (importDataType === 'service_quality') {
      setServiceQualityPlanRows(prev => prev.map(row => {
        if (row.isParent) return row;
        return {
          ...row,
          m1: '98.5', m2: '98.0', m3: '98.5', m4: '99.0', m5: '98.7', m6: '98.5',
          m7: '99.0', m8: '98.8', m9: '98.5', m10: '99.0', m11: '98.5', m12: '99.2'
        };
      }));
      alert('Đã nhập thành công số liệu kế hoạch chỉ tiêu chất lượng dịch vụ từ file Excel!');
    }
    handleCloseImportModal();
  };

  const computedServiceQualityPlan = useMemo(() => {
    const data = {};
    serviceQualityPlanRows.forEach(row => {
      data[row.id] = { ...row };
    });

    const childIds = serviceQualityPlanRows.filter(r => !r.isParent).map(r => r.id);
    
    childIds.forEach(id => {
      const row = data[id] || {};
      const q1Arr = [parseFloat(row.m1), parseFloat(row.m2), parseFloat(row.m3)].filter(v => !isNaN(v));
      row.q1 = q1Arr.length > 0 ? (q1Arr.reduce((s, v) => s + v, 0) / q1Arr.length).toFixed(1) : '';
      
      const q2Arr = [parseFloat(row.m4), parseFloat(row.m5), parseFloat(row.m6)].filter(v => !isNaN(v));
      row.q2 = q2Arr.length > 0 ? (q2Arr.reduce((s, v) => s + v, 0) / q2Arr.length).toFixed(1) : '';
      
      const q3Arr = [parseFloat(row.m7), parseFloat(row.m8), parseFloat(row.m9)].filter(v => !isNaN(v));
      row.q3 = q3Arr.length > 0 ? (q3Arr.reduce((s, v) => s + v, 0) / q3Arr.length).toFixed(1) : '';
      
      const q4Arr = [parseFloat(row.m10), parseFloat(row.m11), parseFloat(row.m12)].filter(v => !isNaN(v));
      row.q4 = q4Arr.length > 0 ? (q4Arr.reduce((s, v) => s + v, 0) / q4Arr.length).toFixed(1) : '';
      
      const yearArr = Array.from({ length: 12 }, (_, i) => parseFloat(row[`m${i + 1}`])).filter(v => !isNaN(v));
      row.nam = yearArr.length > 0 ? (yearArr.reduce((s, v) => s + v, 0) / yearArr.length).toFixed(1) : '';
    });

    const calculateParent = (parentId, childrenIds) => {
      data[parentId] = { ...(data[parentId] || {}) };
      for (let m = 1; m <= 12; m++) {
        const mKey = `m${m}`;
        const vals = childrenIds.map(cid => parseFloat(data[cid]?.[mKey])).filter(v => !isNaN(v));
        data[parentId][mKey] = vals.length > 0 ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '';
      }
      for (let q = 1; q <= 4; q++) {
        const qKey = `q${q}`;
        const vals = childrenIds.map(cid => parseFloat(data[cid]?.[qKey])).filter(v => !isNaN(v));
        data[parentId][qKey] = vals.length > 0 ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '';
      }
      const yearVals = childrenIds.map(cid => parseFloat(data[cid]?.nam)).filter(v => !isNaN(v));
      data[parentId].nam = yearVals.length > 0 ? (yearVals.reduce((s, v) => s + v, 0) / yearVals.length).toFixed(1) : '';
    };

    const techChildIds = serviceQualityPlanRows.filter(r => r.parentId === '1.1').map(r => r.id);
    const serviceChildIds = serviceQualityPlanRows.filter(r => r.parentId === '1.2').map(r => r.id);

    calculateParent('1.1', techChildIds);
    calculateParent('1.2', serviceChildIds);

    data['1'] = { id: '1', name: 'I. CHỈ TIÊU CHẤT LƯỢNG DỊCH VỤ', level: 1, isParent: true };
    calculateParent('1', ['1.1', '1.2']);

    return data;
  }, [serviceQualityPlanRows]);

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [comments, setComments] = useState([]);

  const isReadOnlyForm = statusLabel === 'Hiệu lực';

  const isMonthDisabled = (monthIndex) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const selectedYearNum = parseInt(planYear, 10);

    if (selectedYearNum < currentYear) {
      return true;
    } else if (selectedYearNum === currentYear) {
      return monthIndex < currentMonth;
    }
    return false;
  };

  useEffect(() => {
    if (isEdit) {
      const goal = mockStore.getGoal(id);
      if (goal) {
        setPlanYear(goal.planYear || '2026');
        setStatusLabel(goal.statusLabel || 'Mới tạo');
        
        let defaultType = 'Kế hoạch tập đoàn';
        if (goal.subCategory === 'Nội bộ') {
          defaultType = 'Kế hoạch nội bộ';
        } else if (goal.existingRows && goal.existingRows.some(row => row.customerGroup && row.customerGroup.includes('nội bộ'))) {
          defaultType = 'Kế hoạch nội bộ';
        }
        setPlanType(goal.planType || defaultType);

        if (goal.existingRows && goal.existingRows.length > 0) {
          setExistingRows(goal.existingRows);
        } else {
          setExistingRows([
            {
              ...EMPTY_ROW,
              implementationUnit: goal.implementationUnit || '',
              customerGroup: goal.category || '',
              customerName: goal.name || '',
              spdvGroup: goal.subCategory || '',
              spdvName: goal.unit || '',
            }
          ]);
        }
        if (goal.newCustomerPlan) {
          if (Array.isArray(goal.newCustomerPlan)) {
            setNewCustomerPlanRows(goal.newCustomerPlan);
          } else {
            setNewCustomerPlanRows([
              {
                id: `new-rev-legacy`,
                name: 'Doanh thu khách hàng mới (kế hoạch)',
                implementationUnit: goal.newCustomerPlan.implementationUnit || 'BP.BÁN HÀNG',
                ...goal.newCustomerPlan
              }
            ]);
          }
        }
        if (goal.newCustomerCountPlan) {
          if (Array.isArray(goal.newCustomerCountPlan)) {
            setNewCustomerCountPlanRows(goal.newCustomerCountPlan);
          } else {
            const legacyCust = {
              id: `count-row-legacy-1`,
              name: 'Số lượng khách hàng mới (kế hoạch)',
              implementationUnit: goal.newCustomerCountPlan.implementationUnit || 'BP.BÁN HÀNG',
              ...goal.newCustomerCountPlan
            };
            const legacyCont = goal.newContractCountPlan ? {
              id: `count-row-legacy-2`,
              name: 'Số lượng hợp đồng mới (kế hoạch)',
              implementationUnit: goal.newContractCountPlan.implementationUnit || 'GĐSP ĐỐI NGOẠI',
              ...goal.newContractCountPlan
            } : {
              id: `count-row-legacy-2`,
              name: 'Số lượng hợp đồng mới (kế hoạch)',
              implementationUnit: 'GĐSP ĐỐI NGOẠI',
              t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
              t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
              q1: '0', q2: '0', q3: '0', q4: '0',
              nam: '0'
            };
            setNewCustomerCountPlanRows([legacyCust, legacyCont]);
          }
        }
        if (goal.serviceQualityPlan) {
          if (Array.isArray(goal.serviceQualityPlan)) {
            setServiceQualityPlanRows(goal.serviceQualityPlan);
          } else {
            const mappedRows = INITIAL_SERVICE_QUALITY_ROWS.map(row => {
              if (row.isParent) return row;
              const values = goal.serviceQualityPlan[row.id] || {};
              return {
                ...row,
                ...values,
                implementationUnit: values.implementationUnit || getDefaultUnitForSqRow(row.id)
              };
            });
            setServiceQualityPlanRows(mappedRows);
          }
        } else {
          setServiceQualityPlanRows(INITIAL_SERVICE_QUALITY_ROWS);
        }
        if (goal.attachmentFiles) {
          setAttachmentFiles(goal.attachmentFiles);
        }
        setHistoryLogs(goal.historyLogs || []);
        setComments(goal.comments || []);
      }
    }
  }, [id, isEdit]);

  const validateForm = (saveId) => {
    // Basic verification: Check required fields are not empty
    if (!planYear) {
      alert('Năm kế hoạch là trường bắt buộc.');
      return false;
    }

    for (let i = 0; i < existingRows.length; i++) {
      const r = existingRows[i];
      const isUnitRequired = planType !== 'Kế hoạch tập đoàn';
      if ((isUnitRequired && !r.implementationUnit) || !r.customerGroup || !r.customerName || !r.spdvGroup || !r.spdvName) {
        alert(`Dòng thứ ${i + 1} của Bảng chỉ tiêu doanh thu khách hàng hiện hữu chưa nhập đầy đủ thông tin bắt buộc.`);
        return false;
      }
      
      // Numeric values validation: must be >= 0
      for (const mKey of MONTH_KEYS) {
        const val = parseFloat(r[mKey]);
        if (isNaN(val) || val < 0) {
          alert(`Dòng thứ ${i + 1}, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }
    }

    for (const row of newCustomerPlanRows) {
      for (const mKey of MONTH_KEYS) {
        const val = parseFloat(row[mKey]);
        if (isNaN(val) || val < 0) {
          alert(`Phần chỉ tiêu doanh thu khách hàng mới "${row.name}", tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }
    }

    for (const row of newCustomerCountPlanRows) {
      for (const mKey of MONTH_KEYS) {
        const val = parseInt(row[mKey], 10);
        if (isNaN(val) || val < 0) {
          alert(`Chỉ tiêu "${row.name}", tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }
    }

    for (const row of serviceQualityPlanRows) {
      if (row.isParent) continue;
      for (let m = 1; m <= 12; m++) {
        const valStr = row[`m${m}`];
        if (valStr) {
          const val = parseFloat(valStr);
          if (isNaN(val) || val < 0) {
            alert(`Chỉ tiêu chất lượng dịch vụ "${row.name}", tháng T${m} nhập sai định dạng số (phải >= 0).`);
            return false;
          }
        }
      }
    }

    // BR 2: Check trùng giữa các bản ghi và trong cùng 1 bản ghi
    const seen = new Set();
    for (let i = 0; i < existingRows.length; i++) {
      const row = existingRows[i];
      const key = `${row.customerName}_${row.spdvName}_${planYear}`;
      if (seen.has(key)) {
        alert(`bản ghi đã tồn tại (Lỗi trùng lặp khách hàng + SPDV + năm ở dòng thứ ${i + 1})`);
        return false;
      }
      seen.add(key);
    }

    const allGoals = mockStore.getAllGoals();
    for (let i = 0; i < existingRows.length; i++) {
      const row = existingRows[i];
      const duplicateFound = allGoals.some(goal => {
        if (goal.id === saveId) return false;
        if (goal.planYear === planYear) {
          if (goal.existingRows && goal.existingRows.some(r => r.customerName === row.customerName && r.spdvName === row.spdvName)) {
            return true;
          }
        }
        return false;
      });

      if (duplicateFound) {
        alert(`bản ghi đã tồn tại (Kế hoạch cho khách hàng ${row.customerName.split(' - ')[1]} và sản phẩm ${row.spdvName.split(' - ')[1]} trong năm ${planYear} đã tồn tại trong hệ thống)`);
        return false;
      }
    }

    return true;
  };

  const saveDraft = () => {
    const saveId = isEdit ? id : mockStore.getNextGoalId();
    
    if (!validateForm(saveId)) {
      return;
    }

    mockStore.saveGoal(saveId, {
      id: saveId,
      planYear,
      planType,
      statusLabel: 'Mới tạo',
      existingRows,
      newCustomerPlan: newCustomerPlanRows,
      newCustomerCountPlan: newCustomerCountPlanRows,
      serviceQualityPlan: serviceQualityPlanRows,
      attachmentFiles,
      comments,
      historyLogs: [
        {
          id: Date.now(),
          action: isEdit ? 'Cập nhật mục tiêu doanh số' : 'Tạo mới mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        ...historyLogs
      ]
    });

    alert('Lưu thành công');
    if (!isEdit) {
      navigate(`/goal/edit/${saveId}`);
    } else {
      window.location.reload();
    }
  };

  const submitForm = () => {
    const saveId = isEdit ? id : mockStore.getNextGoalId();

    if (!validateForm(saveId)) {
      return;
    }

    mockStore.saveGoal(saveId, {
      id: saveId,
      planYear,
      planType,
      statusLabel: 'Hiệu lực',
      existingRows,
      newCustomerPlan: newCustomerPlanRows,
      newCustomerCountPlan: newCustomerCountPlanRows,
      serviceQualityPlan: serviceQualityPlanRows,
      attachmentFiles,
      comments,
      historyLogs: [
        {
          id: Date.now() + 1,
          action: 'Gửi phê duyệt mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        {
          id: Date.now(),
          action: isEdit ? 'Cập nhật mục tiêu doanh số' : 'Tạo mới mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        ...historyLogs
      ]
    });

    alert('Tạo mới mục tiêu doanh số thành công');
    if (!isEdit) {
      navigate(`/goal/edit/${saveId}`);
    } else {
      setStatusLabel('Hiệu lực');
      window.location.reload();
    }
  };

  const deleteGoal = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch doanh số này không?')) {
      mockStore.deleteGoal(id);
      alert('Xóa mục tiêu doanh số thành công');
      navigate('/goals');
    }
  };

  const addExistingRow = () => {
    setExistingRows(prev => [...prev, { ...EMPTY_ROW }]);
  };

  const removeExistingRow = (index) => {
    setExistingRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateExistingRow = (index, key, value) => {
    setExistingRows(prev =>
      prev.map((row, idx) => {
        if (idx !== index) return row;

        const updatedRow = { ...row, [key]: value };

        // Cascading reset
        if (key === 'customerGroup') {
          updatedRow.customerName = '';
        } else if (key === 'spdvGroup') {
          updatedRow.spdvName = '';
        }

        // Auto-calculation if monthly target changes
        if (key.startsWith('t')) {
          const getVal = (val) => parseFloat(val) || 0;
          const t1 = key === 't1' ? getVal(value) : getVal(row.t1);
          const t2 = key === 't2' ? getVal(value) : getVal(row.t2);
          const t3 = key === 't3' ? getVal(value) : getVal(row.t3);
          const t4 = key === 't4' ? getVal(value) : getVal(row.t4);
          const t5 = key === 't5' ? getVal(value) : getVal(row.t5);
          const t6 = key === 't6' ? getVal(value) : getVal(row.t6);
          const t7 = key === 't7' ? getVal(value) : getVal(row.t7);
          const t8 = key === 't8' ? getVal(value) : getVal(row.t8);
          const t9 = key === 't9' ? getVal(value) : getVal(row.t9);
          const t10 = key === 't10' ? getVal(value) : getVal(row.t10);
          const t11 = key === 't11' ? getVal(value) : getVal(row.t11);
          const t12 = key === 't12' ? getVal(value) : getVal(row.t12);

          updatedRow.q1 = t1 + t2 + t3;
          updatedRow.q2 = t4 + t5 + t6;
          updatedRow.q3 = t7 + t8 + t9;
          updatedRow.q4 = t10 + t11 + t12;
          updatedRow.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
        }

        return updatedRow;
      })
    );
  };

  const updateNewCustomerPlanRowField = (rowId, key, value) => {
    setNewCustomerPlanRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, [key]: value };
      
      if (MONTH_KEYS.includes(key)) {
        const getVal = (val) => parseFloat(val) || 0;
        const t1 = key === 't1' ? getVal(value) : getVal(row.t1);
        const t2 = key === 't2' ? getVal(value) : getVal(row.t2);
        const t3 = key === 't3' ? getVal(value) : getVal(row.t3);
        const t4 = key === 't4' ? getVal(value) : getVal(row.t4);
        const t5 = key === 't5' ? getVal(value) : getVal(row.t5);
        const t6 = key === 't6' ? getVal(value) : getVal(row.t6);
        const t7 = key === 't7' ? getVal(value) : getVal(row.t7);
        const t8 = key === 't8' ? getVal(value) : getVal(row.t8);
        const t9 = key === 't9' ? getVal(value) : getVal(row.t9);
        const t10 = key === 't10' ? getVal(value) : getVal(row.t10);
        const t11 = key === 't11' ? getVal(value) : getVal(row.t11);
        const t12 = key === 't12' ? getVal(value) : getVal(row.t12);

        updated.q1 = t1 + t2 + t3;
        updated.q2 = t4 + t5 + t6;
        updated.q3 = t7 + t8 + t9;
        updated.q4 = t10 + t11 + t12;
        updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
      }
      
      return updated;
    }));
  };

  const addNewCustomerPlanRow = () => {
    setNewCustomerPlanRows(prev => [
      ...prev,
      {
        id: `new-rev-${Date.now()}`,
        name: `Doanh thu khách hàng mới (kế hoạch) ${prev.length + 1}`,
        implementationUnit: 'BP.BÁN HÀNG',
        t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
        t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
        q1: '0', q2: '0', q3: '0', q4: '0',
        nam: '0'
      }
    ]);
  };

  const removeNewCustomerPlanRow = (rowId) => {
    setNewCustomerPlanRows(prev => prev.filter(row => row.id !== rowId));
  };

  const updateNewCustomerCountPlanRowField = (rowId, key, value) => {
    setNewCustomerCountPlanRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, [key]: value };
      
      if (MONTH_KEYS.includes(key)) {
        const getVal = (val) => parseInt(val, 10) || 0;
        const t1 = key === 't1' ? getVal(value) : getVal(row.t1);
        const t2 = key === 't2' ? getVal(value) : getVal(row.t2);
        const t3 = key === 't3' ? getVal(value) : getVal(row.t3);
        const t4 = key === 't4' ? getVal(value) : getVal(row.t4);
        const t5 = key === 't5' ? getVal(value) : getVal(row.t5);
        const t6 = key === 't6' ? getVal(value) : getVal(row.t6);
        const t7 = key === 't7' ? getVal(value) : getVal(row.t7);
        const t8 = key === 't8' ? getVal(value) : getVal(row.t8);
        const t9 = key === 't9' ? getVal(value) : getVal(row.t9);
        const t10 = key === 't10' ? getVal(value) : getVal(row.t10);
        const t11 = key === 't11' ? getVal(value) : getVal(row.t11);
        const t12 = key === 't12' ? getVal(value) : getVal(row.t12);

        updated.q1 = t1 + t2 + t3;
        updated.q2 = t4 + t5 + t6;
        updated.q3 = t7 + t8 + t9;
        updated.q4 = t10 + t11 + t12;
        updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
      }
      
      return updated;
    }));
  };

  const addNewCustomerCountPlanRow = () => {
    setNewCustomerCountPlanRows(prev => [
      ...prev,
      {
        id: `new-cust-count-${Date.now()}`,
        name: `Chỉ tiêu mới ${prev.length + 1}`,
        implementationUnit: 'BP.BÁN HÀNG',
        t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
        t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
        q1: '0', q2: '0', q3: '0', q4: '0',
        nam: '0'
      }
    ]);
  };

  const removeNewCustomerCountPlanRow = (rowId) => {
    setNewCustomerCountPlanRows(prev => prev.filter(row => row.id !== rowId));
  };

  const handleServiceQualityPlanChange = (rowId, key, value) => {
    setServiceQualityPlanRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return { ...row, [key]: value };
    }));
  };

  const addNewServiceQualityRow = () => {
    setServiceQualityPlanRows(prev => [
      ...prev,
      {
        id: `custom-sq-${Date.now()}`,
        parentId: '1.2',
        name: `Chỉ tiêu chất lượng dịch vụ mới ${prev.filter(r => !r.isParent).length - 9}`,
        level: 3,
        isParent: false,
        implementationUnit: 'P.DVTN&CSKH',
        m1: '', m2: '', m3: '', m4: '', m5: '', m6: '',
        m7: '', m8: '', m9: '', m10: '', m11: '', m12: '',
        q1: '', q2: '', q3: '', q4: '',
        nam: ''
      }
    ]);
  };

  const removeServiceQualityRow = (rowId) => {
    setServiceQualityPlanRows(prev => prev.filter(row => row.id !== rowId));
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'Kế hoạch mục tiêu năm',
      description: '',
      uploadedAt: new Date().toLocaleString('vi-VN')
    }));
    setAttachmentFiles(prev => [...prev, ...newFiles]);
  };

  const postComment = () => {
    if (!commentInput.trim()) return;
    const item = {
      id: Date.now(),
      text: commentInput.trim(),
      author: 'A',
      time: 'vừa xong'
    };
    setComments(prev => [item, ...prev]);
    setCommentInput('');
  };

  const currentStepNum = statusLabel === 'Hiệu lực' ? 3 : (statusLabel === 'Chờ điều chỉnh' ? 2 : 1);

  return (
    <div className="goal-screen">
      {/* Top Navigation & Action Header */}
      <div className="goal-topbar">
        <button className="btn-back" type="button" onClick={() => navigate('/goals')}>
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="goal-stepper">
          {STEPS.map((step) => (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div className={`step-circle ${step.num === currentStepNum ? 'active' : ''}`}>
                  {step.num}
                </div>
                <span className={`step-label ${step.num === currentStepNum ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {step.num < STEPS.length && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="topbar-actions">
          {isEdit && statusLabel === 'Mới tạo' && (
            <button className="btn-delete-goal" type="button" onClick={deleteGoal} style={{ marginRight: '8px' }}>
              Xóa mục tiêu
            </button>
          )}
          <button className="btn-cancel" type="button" onClick={() => navigate('/goals')}>
            Hủy
          </button>
          <button className="btn-save" type="button" onClick={saveDraft} disabled={isReadOnlyForm}>
            <Save size={16} />
            Lưu
          </button>
          <button className="btn-submit" type="button" onClick={submitForm} disabled={isReadOnlyForm}>
            Gửi
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="goal-body-grid">
        {/* Left Main Column */}
        <div className="goal-main-col">
          {/* Card 1: Thông tin kế hoạch */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Thông tin kế hoạch doanh thu năm</h3>
              <span className="badge-status">{statusLabel}</span>
            </div>

            <div className="card-box-inner">
              <div className="field-inline-row" style={{ display: 'flex', gap: '32px' }}>
                {isEdit && (
                  <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="field-label">
                      ID Mục Tiêu
                    </label>
                    <input 
                      type="text" 
                      value={id} 
                      readOnly 
                      disabled
                      style={{ 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '6px', 
                        padding: '6px 12px', 
                        fontSize: '13px', 
                        background: '#f1f5f9', 
                        color: '#64748b', 
                        width: '120px', 
                        fontWeight: '500' 
                      }} 
                    />
                  </div>
                )}
                <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="field-label">
                    Năm Kế Hoạch <span className="req-star">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select value={planYear} onChange={(e) => setPlanYear(e.target.value)} disabled={isReadOnlyForm}>
                      {YEAR_OPTIONS.map((year) => {
                        const isPastYear = parseInt(year, 10) < new Date().getFullYear();
                        return (
                          <option key={year} value={year} disabled={isPastYear}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Kế hoạch doanh thu nội bộ chi tiết */}
          {planType === 'Kế hoạch nội bộ' && (
            <div style={{ margin: '24px 0 12px 0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '-0.3px', borderLeft: '4px solid #3b82f6', paddingLeft: '12px' }}>
                Kế hoạch doanh thu nội bộ chi tiết
              </h2>
            </div>
          )}

          {/* Card 2: Bảng chỉ tiêu doanh thu khách hàng hiện hữu */}
          <section className="goal-card">
            <div className="goal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Bảng chỉ tiêu doanh thu khách hàng hiện hữu (VNĐ)</h3>
              <button 
                className="btn-excel-action" 
                type="button"
                onClick={() => {
                  setImportDataType('existing_cust');
                  setShowImportModal(true);
                }}
                disabled={isReadOnlyForm}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', color: '#f5222d', border: '1px solid #f5222d', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                <Upload size={14} />
                Nhập Excel
              </button>
            </div>


            <div className="table-container scrollable-table-container">
              <table className="goal-data-table unified-grid-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ width: '40px' }}></th>
                    {planType !== 'Kế hoạch tập đoàn' && (
                      <th rowSpan={2} style={{ minWidth: '150px' }}>
                        <div className="th-content">
                          <span>Đơn vị thực hiện</span>
                          <div className="th-icons">
                            <ArrowUpDown size={12} />
                            <Filter size={12} />
                          </div>
                        </div>
                      </th>
                    )}
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Nhóm khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Nhóm SPDV</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Loại SPDV</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th colSpan={17} style={{ textAlign: 'center' }}>
                      Kế hoạch doanh thu năm
                    </th>
                  </tr>
                  <tr>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={`t${i+1}`} className="sub-th-month">T{i+1}</th>
                    ))}
                    {Array.from({ length: 4 }, (_, i) => (
                      <th key={`q${i+1}`} className="sub-th-quarter">Q{i+1}</th>
                    ))}
                    <th className="sub-th-year">Năm</th>
                  </tr>
                </thead>
                <tbody>
                  {existingRows.map((row, rowIndex) => {
                    const availableNames = CUSTOMER_NAMES_MAP[row.customerGroup] || [];
                    const availableSpdvNames = SPDV_NAMES_MAP[row.spdvGroup] || [];

                    return (
                      <tr key={`existing_${rowIndex}`}>
                        <td className="td-action">
                          <button className="btn-icon-delete" type="button" onClick={() => removeExistingRow(rowIndex)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                        {planType !== 'Kế hoạch tập đoàn' && (
                          <td>
                            <div className="select-wrapper table-select">
                              <select
                                value={row.implementationUnit || ''}
                                onChange={(e) => updateExistingRow(rowIndex, 'implementationUnit', e.target.value)}
                              >
                                <option value="">-- Chọn giá trị --</option>
                                {IMPLEMENTATION_UNITS.map((item) => <option key={item} value={item}>{item}</option>)}
                              </select>
                              <ChevronDown className="select-arrow" size={14} />
                            </div>
                          </td>
                        )}
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.customerGroup}
                              onChange={(e) => updateExistingRow(rowIndex, 'customerGroup', e.target.value)}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {CUSTOMER_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.customerName}
                              onChange={(e) => updateExistingRow(rowIndex, 'customerName', e.target.value)}
                              disabled={!row.customerGroup}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {availableNames.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.spdvGroup}
                              onChange={(e) => updateExistingRow(rowIndex, 'spdvGroup', e.target.value)}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {SPDV_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.spdvName}
                              onChange={(e) => updateExistingRow(rowIndex, 'spdvName', e.target.value)}
                              disabled={!row.spdvGroup}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {availableSpdvNames.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>

                        {MONTH_KEYS.map((mKey) => (
                          <td key={mKey} className="td-month-input">
                            <input
                              type="text"
                              className="month-grid-input"
                              value={row[mKey]}
                              onChange={(e) => updateExistingRow(rowIndex, mKey, e.target.value)}
                            />
                          </td>
                        ))}

                        {QUARTER_KEYS.map((qKey) => (
                          <td key={qKey} className="td-quarter-input">
                            <input
                              type="text"
                              className="month-grid-input readonly-input"
                              value={row[qKey]}
                              readOnly
                            />
                          </td>
                        ))}

                        <td className="td-year-input">
                          <input
                            type="text"
                            className="month-grid-input readonly-input"
                            value={row.nam}
                            readOnly
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="table-footer-action">
              <button type="button" className="btn-add-row" onClick={addExistingRow}>
                <Plus size={16} />
                Thêm dòng
              </button>
            </div>
          </section>

          {/* Card 2.5: Chỉ tiêu doanh thu khách hàng mới */}
          <section className="goal-card" style={{ marginTop: '16px' }}>
               <div className="goal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Chỉ tiêu doanh thu khách hàng mới (VNĐ)</h3>
                <button 
                  className="btn-excel-action" 
                  type="button"
                  onClick={() => {
                    setImportDataType('new_cust_rev');
                    setShowImportModal(true);
                  }}
                  disabled={isReadOnlyForm}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', color: '#f5222d', border: '1px solid #f5222d', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  <Upload size={14} />
                  Nhập Excel
                </button>
              </div>

              <div className="table-container scrollable-table-container">
                <table className="goal-data-table month-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ width: '40px' }}></th>
                      {planType === 'Kế hoạch nội bộ' && (
                        <th style={{ minWidth: '150px', textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Đơn vị thực hiện</th>
                      )}
                      {planType !== 'Kế hoạch nội bộ' && (
                        <th style={{ minWidth: '320px', textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Chỉ tiêu</th>
                      )}
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={`new_rev_head_month_${i+1}`} className="sub-th-month" style={{ borderBottom: '1px solid #cbd5e1' }}>T{i+1}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => (
                        <th key={`new_rev_head_quarter_${i+1}`} className="sub-th-quarter" style={{ borderBottom: '1px solid #cbd5e1' }}>Q{i+1}</th>
                      ))}
                      <th className="sub-th-year" style={{ borderBottom: '1px solid #cbd5e1' }}>Năm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newCustomerPlanRows.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ textAlign: 'center', padding: '6px' }}>
                          <button
                            type="button"
                            onClick={() => removeNewCustomerPlanRow(row.id)}
                            disabled={isReadOnlyForm || newCustomerPlanRows.length === 1}
                            style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                        {planType === 'Kế hoạch nội bộ' && (
                          <td style={{ padding: '6px 10px', minWidth: '150px' }}>
                            <select
                              value={row.implementationUnit || 'BP.BÁN HÀNG'}
                              onChange={(e) => updateNewCustomerPlanRowField(row.id, 'implementationUnit', e.target.value)}
                              disabled={isReadOnlyForm}
                              className="month-grid-input"
                              style={{ width: '100%', height: '32px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                            >
                              {IMPLEMENTATION_UNITS.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </td>
                        )}
                        {planType !== 'Kế hoạch nội bộ' && (
                          <td style={{ padding: '6px 10px', minWidth: '320px' }}>
                            <input
                              type="text"
                              className="month-grid-input"
                              style={{ width: '100%', fontWeight: '600', color: '#334155', background: '#fafafa', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '4px', height: '32px', padding: '0 8px', textAlign: 'left' }}
                              value={row.name}
                              onChange={(e) => updateNewCustomerPlanRowField(row.id, 'name', e.target.value)}
                              disabled={isReadOnlyForm}
                            />
                          </td>
                        )}
                        {MONTH_KEYS.map((mKey, idx) => (
                          <td key={`new_rev_m_${row.id}_${mKey}`} className="td-month-input">
                            <input
                              type="text"
                              className={`month-grid-input ${(isReadOnlyForm || isMonthDisabled(idx)) ? 'readonly-input' : ''}`}
                              value={row[mKey]}
                              onChange={(e) => updateNewCustomerPlanRowField(row.id, mKey, e.target.value)}
                              disabled={isReadOnlyForm || isMonthDisabled(idx)}
                            />
                          </td>
                        ))}
                        {QUARTER_KEYS.map((qKey) => (
                          <td key={`new_rev_q_${row.id}_${qKey}`} className="td-quarter-input">
                            <input
                              type="text"
                              className="month-grid-input readonly-input"
                              value={row[qKey]}
                              readOnly
                            />
                          </td>
                        ))}
                        <td className="td-year-input">
                          <input
                            type="text"
                            className="month-grid-input readonly-input"
                            value={row.nam}
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer-action" style={{ marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn-add-row" 
                  onClick={addNewCustomerPlanRow}
                  disabled={isReadOnlyForm}
                >
                  <Plus size={16} />
                  Thêm dòng
                </button>
              </div>
            </section>

          {/* Biểu mẫu doanh thu nội bộ tổng hợp */}
          {planType !== 'Kế hoạch tập đoàn' && (
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#065f46', textTransform: 'uppercase', margin: '0', letterSpacing: '-0.3px' }}>
                  Kế hoạch doanh thu nội bộ tổng hợp
                </h2>
              </div>

              {/* 2.1 Biểu tổng hợp kế hoạch theo đơn vị thực hiện */}
              <section className="goal-card" style={{ marginTop: '0' }}>
                <div 
                  className="goal-card-header" 
                  onClick={() => setCollapsedTable1(!collapsedTable1)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <h3>Tổng hợp kế hoạch theo đơn vị thực hiện</h3>
                  <ChevronDown size={18} style={{ transform: collapsedTable1 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s', color: '#64748b' }} />
                </div>
                {!collapsedTable1 && (
                  <div className="table-container" style={{ padding: '16px' }}>
                    {unitSummaryInForm.length > 0 ? (
                      <table className="goal-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Đơn vị thực hiện</th>
                            <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1', width: '250px' }}>KH Doanh thu cả năm (VNĐ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unitSummaryInForm.map((item) => (
                            <tr key={item.unit} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{item.unit}</td>
                              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                                {item.total.toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: '#f8fafc', fontWeight: 'bold', borderTop: '2px solid #cbd5e1' }}>
                            <td style={{ padding: '10px 16px', color: '#0f172a' }}>Tổng cộng</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e32b4c', fontWeight: 700 }}>
                              {formTotalValue.toLocaleString('vi-VN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>
                        Chưa có đơn vị thực hiện nào được gán chỉ tiêu.
                      </div>
                    )}
                  </div>
                )}
              </section>



              {/* 2.3 Tổng hợp kết quả thực hiện theo nhóm khách hàng */}
              <section className="goal-card" style={{ marginTop: '0' }}>
                <div 
                  className="goal-card-header" 
                  onClick={() => setCollapsedTable3(!collapsedTable3)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <h3>Tổng hợp kế hoạch theo nhóm khách hàng</h3>
                  <ChevronDown size={18} style={{ transform: collapsedTable3 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s', color: '#64748b' }} />
                </div>
                {!collapsedTable3 && (
                  <div className="table-container" style={{ padding: '16px' }}>
                    {customerGroupSummaryInForm.length > 0 ? (
                      <table className="goal-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Nhóm khách hàng</th>
                            <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1', width: '250px' }}>KH Doanh thu cả năm (VNĐ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerGroupSummaryInForm.map((item) => (
                            <tr key={item.group} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{item.group}</td>
                              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                                {item.total.toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: '#f8fafc', fontWeight: 'bold', borderTop: '2px solid #cbd5e1' }}>
                            <td style={{ padding: '10px 16px', color: '#0f172a' }}>Tổng cộng</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e32b4c', fontWeight: 700 }}>
                              {formTotalValue.toLocaleString('vi-VN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>
                        Chưa có dữ liệu nhóm khách hàng.
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* 2.4 Tổng hợp kết quả thực hiện theo nhóm SPDV */}
              <section className="goal-card" style={{ marginTop: '0' }}>
                <div 
                  className="goal-card-header" 
                  onClick={() => setCollapsedTable4(!collapsedTable4)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <h3>Tổng hợp kế hoạch theo nhóm SPDV</h3>
                  <ChevronDown size={18} style={{ transform: collapsedTable4 ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s', color: '#64748b' }} />
                </div>
                {!collapsedTable4 && (
                  <div className="table-container" style={{ padding: '16px' }}>
                    {spdvGroupSummaryInForm.length > 0 ? (
                      <table className="goal-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Nhóm SPDV</th>
                            <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1', width: '250px' }}>KH Doanh thu cả năm (VNĐ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spdvGroupSummaryInForm.map((item) => (
                            <tr key={item.group} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a' }}>{item.group}</td>
                              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                                {item.total.toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: '#f8fafc', fontWeight: 'bold', borderTop: '2px solid #cbd5e1' }}>
                            <td style={{ padding: '10px 16px', color: '#0f172a' }}>Tổng cộng</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', color: '#e32b4c', fontWeight: 700 }}>
                              {formTotalValue.toLocaleString('vi-VN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>
                        Chưa có dữ liệu nhóm sản phẩm dịch vụ.
                      </div>
                    )}
                  </div>
                )}
              </section>

            </div>
          )}



          {/* Card 4: Khối tài liệu */}
          <section className="goal-card" style={{ marginTop: '16px' }}>
            <div className="goal-card-header">
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Tài liệu</h3>
            </div>
            <div className="notebook-content">
              <label
                htmlFor="goal-doc-upload"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  background: '#ffffff',
                  cursor: isReadOnlyForm ? 'not-allowed' : 'pointer',
                  marginBottom: '24px',
                  padding: '24px'
                }}
              >
                <div style={{ fontSize: '14px', color: '#4b5563', fontWeight: '400', marginBottom: '12px' }}>
                  Drag and drop or Browse your file
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 24px',
                    border: '1px solid #ee2d24',
                    borderRadius: '6px',
                    color: '#ee2d24',
                    fontWeight: '500',
                    fontSize: '14px',
                    background: '#ffffff',
                    marginBottom: '12px',
                    cursor: isReadOnlyForm ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Upload size={16} color="#ee2d24" />
                  Choose file
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Type: xls, xlsx, csv. Max size: 20MB
                </div>
              </label>
              <input id="goal-doc-upload" type="file" multiple style={{ display: 'none' }} onChange={handleAttachmentUpload} disabled={isReadOnlyForm} />
              
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                <table className="goal-data-table doc-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 10px', width: '40px' }}></th>
                      <th style={{ padding: '12px 10px', textAlign: 'left', width: '70px', fontWeight: '600', color: '#1f2937' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          No
                          <ArrowUpDown size={12} color="#94a3b8" />
                        </div>
                      </th>
                      <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Tài liệu</th>
                      <th style={{ padding: '12px 10px', textAlign: 'left', width: '220px', fontWeight: '600', color: '#1f2937' }}>Loại chứng từ</th>
                      <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Nội dung tài liệu</th>
                      <th style={{ padding: '12px 10px', textAlign: 'left', width: '180px', fontWeight: '600', color: '#1f2937' }}>Thời điểm tải lên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attachmentFiles.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 10px' }}>
                          Chưa có tài liệu nào được tải lên
                        </td>
                      </tr>
                    ) : (
                      attachmentFiles.map((file, index) => (
                        <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px', textAlign: 'center', width: '40px' }}>
                            <button
                              title="Xóa"
                              type="button"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#4b5563',
                                cursor: isReadOnlyForm ? 'not-allowed' : 'pointer',
                                padding: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={() => setAttachmentFiles((prev) => prev.filter((f) => f.id !== file.id))}
                              disabled={isReadOnlyForm}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                          <td style={{ padding: '10px', color: '#4b5563' }}>{index + 1}</td>
                          <td style={{ padding: '10px', color: '#2563eb' }}>
                            <span style={{ cursor: 'pointer', textDecoration: 'none' }}>
                              {file.name}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div className="select-wrapper table-select" style={{ width: '100%' }}>
                              <select
                                className="form-control"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: 'none',
                                  borderRadius: '6px',
                                  background: '#f3f4f6',
                                  color: '#1f2937',
                                  appearance: 'none',
                                  paddingRight: '32px'
                                }}
                                value={file.type || 'Kế hoạch mục tiêu năm'}
                                onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, type: e.target.value } : f)))}
                                disabled={isReadOnlyForm}
                              >
                                {DOCUMENT_TYPES.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="select-arrow" size={14} style={{ right: '12px' }} />
                            </div>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              type="text"
                              className="form-control"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                background: '#f3f4f6',
                                color: '#1f2937'
                              }}
                              placeholder="Nhập nội dung"
                              value={file.description || ''}
                              onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, description: e.target.value } : f)))}
                              disabled={isReadOnlyForm}
                            />
                          </td>
                          <td style={{ padding: '10px', color: '#4b5563' }}>{file.uploadedAt || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <aside className="goal-side-col">
          <section className="side-card">
            <div className="side-tabs">
              <button
                type="button"
                className={`tab-btn ${activeSideTab === 'comment' ? 'active' : ''}`}
                onClick={() => setActiveSideTab('comment')}
              >
                <MessageSquare size={14} /> COMMENT
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSideTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSideTab('history')}
              >
                <History size={14} /> LỊCH SỬ
              </button>
            </div>

            <div className="side-content">
              {activeSideTab === 'comment' ? (
                comments.length > 0 ? (
                  <div className="comment-list">
                    {comments.map((item) => (
                      <div key={item.id} className="comment-item">
                        <div className="user-avatar">A</div>
                        <div className="comment-bubble">
                          <div className="comment-meta">{item.time}</div>
                          <div className="comment-text">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-text">Chưa có nội dung.</div>
                )
              ) : (
                historyLogs.length > 0 ? (
                  <div className="history-list">
                    {historyLogs.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="history-title">{item.action}</div>
                        <div className="history-user" style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px' }}>
                          Người thực hiện: {item.user || 'Admin'}
                        </div>
                        <div className="history-time">{item.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-text">Chưa có lịch sử.</div>
                )
              )}
            </div>

            <div className="side-comment-footer">
              <div className="comment-input-row">
                <div className="user-avatar olive">A</div>
                <textarea
                  className="comment-textarea"
                  placeholder="Viết comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
              </div>
              <div className="comment-send-row">
                <button className="btn-send-comment" type="button" onClick={postComment}>
                  <Send size={13} /> Gửi
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* MODAL: IMPORT EXCEL WIZARD */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '600px' }}>
            <div className="modal-header">
              <h3>
                {importDataType === 'existing_cust' 
                  ? 'Nhập Excel Kế hoạch doanh thu khách hàng hiện hữu' 
                  : importDataType === 'new_cust_rev'
                  ? 'Nhập Excel Kế hoạch doanh thu khách hàng mới'
                  : importDataType === 'new_cust_count'
                  ? 'Nhập Excel Kế hoạch số lượng khách hàng & hợp đồng mới'
                  : 'Nhập Excel Kế hoạch chất lượng dịch vụ'}
              </h3>
              <button className="btn-close-modal" type="button" onClick={handleCloseImportModal}>
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
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
                    💡 <strong>Quy tắc nạp Kế hoạch:</strong>
                    {importDataType === 'existing_cust' 
                      ? ' File Excel kế hoạch cần có các cột tương ứng với đơn vị thực hiện, nhóm khách hàng, tên khách hàng và kế hoạch chi tiết từ tháng 1 đến tháng 12.'
                      : importDataType === 'new_cust_rev'
                      ? ' File Excel kế hoạch cần chứa chỉ tiêu kế hoạch doanh thu của nhóm khách hàng mới trong năm tài khóa.'
                      : importDataType === 'new_cust_count'
                      ? ' File Excel kế hoạch cần chứa chỉ tiêu số lượng khách hàng mới và số lượng hợp đồng mới cho từng tháng.'
                      : ' File Excel kế hoạch cần chứa chỉ tiêu tỉ lệ kết nối và chỉ tiêu tỉ lệ hài lòng của khách hàng.'}
                  </div>

                  {!uploadedFile ? (
                    <div className="upload-dropzone" onClick={() => handleSimulateUpload('valid')}>
                      <div className="upload-icon-wrapper">
                        <Upload size={32} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <strong>Nhấp để chọn file Excel kế hoạch tải lên</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Hỗ trợ định dạng .xlsx, .xls (Tối đa 10MB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="uploaded-file-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={24} style={{ color: '#10b981' }} />
                        <div>
                          <strong>{uploadedFile.name}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{uploadedFile.size} • {uploadedFile.rowsCount} dòng dữ liệu</div>
                        </div>
                      </div>
                      <button className="btn-cancel" type="button" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setUploadedFile(null)}>
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: FIELD MAPPING */}
              {importStep === 2 && (
                <div className="import-wizard-container">
                  <span style={{ fontSize: '13px', color: '#475569' }}>
                    Ánh xạ (Map) các cột từ file Excel tải lên với các trường tương ứng của hệ thống:
                  </span>
                  <table className="mapping-table">
                    <thead>
                      <tr>
                        <th>Trường hệ thống</th>
                        <th>Cột trong File Excel</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Đơn vị thực hiện</strong></td>
                        <td><select className="mapping-select" defaultValue="Đơn vị thực hiện"><option>Đơn vị thực hiện</option></select></td>
                      </tr>
                      <tr>
                        <td><strong>Nhóm khách hàng</strong></td>
                        <td><select className="mapping-select" defaultValue="Nhóm khách hàng"><option>Nhóm khách hàng</option></select></td>
                      </tr>
                      <tr>
                        <td><strong>Tên khách hàng</strong></td>
                        <td><select className="mapping-select" defaultValue="Tên khách hàng"><option>Tên khách hàng</option></select></td>
                      </tr>
                      <tr>
                        <td><strong>Nhóm sản phẩm dịch vụ</strong></td>
                        <td><select className="mapping-select" defaultValue="Nhóm SPDV"><option>Nhóm SPDV</option></select></td>
                      </tr>
                      <tr>
                        <td><strong>Giá trị kế hoạch</strong></td>
                        <td><select className="mapping-select" defaultValue="Kế hoạch năm (Tổng)"><option>Kế hoạch năm (Tổng)</option></select></td>
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
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Đang thực hiện quy tắc mapping trường và kiểm tra mã danh mục.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {validationResult && (
                        <div className="test-result-wrapper test-result-success" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 size={20} />
                          <div>
                            <strong>Chạy thử thành công!</strong>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{validationResult.msg}</p>
                          </div>
                        </div>
                      )}

                      {validationResult && (
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>Thông tin dữ liệu chuẩn bị nạp:</span>
                          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li>Tệp tin: <strong>{uploadedFile.name}</strong></li>
                            <li>Số lượng dòng nạp: <strong>{uploadedFile.rowsCount} dòng</strong></li>
                            <li>Trạng thái kiểm tra: <strong>Hợp lệ 100%</strong></li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" type="button" onClick={handleCloseImportModal}>
                Hủy bỏ
              </button>
              {importStep === 1 && (
                <button 
                  className="btn-submit" 
                  type="button"
                  disabled={!uploadedFile} 
                  onClick={() => setImportStep(2)}
                >
                  Tiếp tục →
                </button>
              )}
              {importStep === 2 && (
                <button 
                  className="btn-submit" 
                  type="button"
                  onClick={handleTestImport}
                >
                  Kiểm tra dữ liệu →
                </button>
              )}
              {importStep === 3 && (
                <button 
                  className="btn-submit" 
                  type="button"
                  disabled={isTesting}
                  onClick={handleImportToDatabase}
                >
                  Nạp dữ liệu vào form
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalForm;