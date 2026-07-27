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
  Upload
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

const serviceQualityRows = [
  { id: '1', name: 'CHẤT LƯỢNG DỊCH VỤ', level: 1 },
  { id: '1.1', name: 'Tỷ lệ cuộc gọi kết nối thành công đến tổng đài', level: 2 },
  { id: '1.1.1', name: 'TLKN kênh Di động Vip/Svip', level: 3 },
  { id: '1.1.2', name: 'TLKN kênh Di động thường/Hotline/CDS', level: 3 },
  { id: '1.1.3', name: 'TLKN kênh SME', level: 3 },
  { id: '1.1.4', name: 'TLKN kênh CĐBR và truyền hình', level: 3 },
  { id: '1.1.5', name: 'TLKN kênh 1789N1', level: 3 },
  { id: '1.1.6', name: 'TLKN kênh Videocall', level: 3 },
  { id: '1.1.7', name: 'TLKN kênh 1789N2', level: 3 },
  { id: '1.2', name: 'Tỷ lệ hài lòng của khách hàng', level: 2 },
  { id: '1.2.1', name: 'Kênh FO', level: 3 },
  { id: '1.2.2', name: 'Kênh BO', level: 3 },
  { id: '1.2.3', name: 'Callbot Inbound', level: 3 }
];

const DEFAULT_SERVICE_QUALITY_PLAN = {
  '1.1.1': { m1: '99.2', m2: '98.8', m3: '99.4', m4: '99.0', m5: '98.6', m6: '99.2', m7: '99.0', m8: '98.8', m9: '99.2', m10: '99.4', m11: '99.0', m12: '99.2' },
  '1.1.2': { m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  '1.1.3': { m1: '97.2', m2: '96.8', m3: '97.4', m4: '97.0', m5: '96.6', m6: '97.2', m7: '97.0', m8: '96.8', m9: '97.2', m10: '97.4', m11: '97.0', m12: '97.2' },
  '1.1.4': { m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  '1.1.5': { m1: '98.2', m2: '97.8', m3: '98.4', m4: '98.0', m5: '97.6', m6: '98.2', m7: '98.0', m8: '97.8', m9: '98.2', m10: '98.4', m11: '98.0', m12: '98.2' },
  '1.1.6': { m1: '95.2', m2: '94.8', m3: '95.4', m4: '95.0', m5: '94.6', m6: '95.2', m7: '95.0', m8: '94.8', m9: '95.2', m10: '95.4', m11: '95.0', m12: '95.2' },
  '1.1.7': { m1: '97.2', m2: '96.8', m3: '97.4', m4: '97.0', m5: '96.6', m6: '97.2', m7: '97.0', m8: '96.8', m9: '97.2', m10: '97.4', m11: '97.0', m12: '97.2' },
  '1.2.1': { m1: '95.2', m2: '94.8', m3: '95.4', m4: '95.0', m5: '94.6', m6: '95.2', m7: '95.0', m8: '94.8', m9: '95.2', m10: '95.4', m11: '95.0', m12: '95.2' },
  '1.2.2': { m1: '94.2', m2: '93.8', m3: '94.4', m4: '94.0', m5: '93.6', m6: '94.2', m7: '94.0', m8: '93.8', m9: '94.2', m10: '94.4', m11: '94.0', m12: '94.2' },
  '1.2.3': { m1: '92.2', m2: '91.8', m3: '92.4', m4: '92.0', m5: '91.6', m6: '92.2', m7: '92.0', m8: '91.8', m9: '92.2', m10: '92.4', m11: '92.0', m12: '92.2' }
};

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

  const { unitSummaryInForm, formTotalCount, formTotalValue } = useMemo(() => {
    const summaryMap = {};
    existingRows.forEach(row => {
      const unit = row.implementationUnit;
      if (unit) {
        if (!summaryMap[unit]) {
          summaryMap[unit] = { unit, count: 0, total: 0 };
        }
        summaryMap[unit].count += 1;
        summaryMap[unit].total += parseFloat(row.nam) || 0;
      }
    });

    const summaryList = Object.values(summaryMap).sort((a, b) => b.total - a.total);
    const totalCount = summaryList.reduce((sum, item) => sum + item.count, 0);
    const totalValue = summaryList.reduce((sum, item) => sum + item.total, 0);

    return {
      unitSummaryInForm: summaryList,
      formTotalCount: totalCount,
      formTotalValue: totalValue
    };
  }, [existingRows]);
  const [newCustomerPlan, setNewCustomerPlan] = useState({
    spdvGroup: '',
    baseline: '0',
    t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
    t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
    q1: 0, q2: 0, q3: 0, q4: 0,
    nam: 0
  });

  const [newCustomerCountPlan, setNewCustomerCountPlan] = useState({
    t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
    t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
    q1: 0, q2: 0, q3: 0, q4: 0,
    nam: 0
  });

  const [newContractCountPlan, setNewContractCountPlan] = useState({
    t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
    t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
    q1: 0, q2: 0, q3: 0, q4: 0,
    nam: 0
  });


  const [serviceQualityPlan, setServiceQualityPlan] = useState(() => DEFAULT_SERVICE_QUALITY_PLAN);

  const computedServiceQualityPlan = useMemo(() => {
    const data = JSON.parse(JSON.stringify(serviceQualityPlan));
    const childIds = ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6', '1.1.7', '1.2.1', '1.2.2', '1.2.3'];
    
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
      data[parentId] = {};
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

    calculateParent('1.1', ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6', '1.1.7']);
    calculateParent('1.2', ['1.2.1', '1.2.2', '1.2.3']);
    calculateParent('1', ['1.1', '1.2']);

    return data;
  }, [serviceQualityPlan]);

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
          setNewCustomerPlan(goal.newCustomerPlan);
        }
        if (goal.newCustomerCountPlan) {
          setNewCustomerCountPlan(goal.newCustomerCountPlan);
        }
        if (goal.newContractCountPlan) {
          setNewContractCountPlan(goal.newContractCountPlan);
        }
        if (goal.serviceQualityPlan) {
          setServiceQualityPlan(goal.serviceQualityPlan);
        } else {
          setServiceQualityPlan(DEFAULT_SERVICE_QUALITY_PLAN);
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

    for (const mKey of MONTH_KEYS) {
      const val = parseFloat(newCustomerPlan[mKey]);
      if (isNaN(val) || val < 0) {
        alert(`Phần chỉ tiêu khách hàng mới, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
        return false;
      }
    }

    if (planType !== 'Kế hoạch nội bộ') {
      for (const mKey of MONTH_KEYS) {
        const val = parseInt(newCustomerCountPlan[mKey], 10);
        if (isNaN(val) || val < 0) {
          alert(`Số lượng khách hàng mới, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }

      for (const mKey of MONTH_KEYS) {
        const val = parseInt(newContractCountPlan[mKey], 10);
        if (isNaN(val) || val < 0) {
          alert(`Số lượng hợp đồng mới, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }

      const childIds = ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6', '1.1.7', '1.2.1', '1.2.2', '1.2.3'];
      for (const cid of childIds) {
        const row = serviceQualityPlan[cid] || {};
        for (let m = 1; m <= 12; m++) {
          const valStr = row[`m${m}`];
          if (valStr) {
            const val = parseFloat(valStr);
            if (isNaN(val) || val < 0 || val > 100) {
              alert(`Chỉ tiêu chất lượng dịch vụ nhập sai định dạng phần trăm (phải từ 0 đến 100).`);
              return false;
            }
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
      newCustomerPlan,
      newCustomerCountPlan,
      newContractCountPlan,
      serviceQualityPlan,
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
      newCustomerPlan,
      newCustomerCountPlan,
      newContractCountPlan,
      serviceQualityPlan,
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

  const updateNewCustomerPlan = (key, value) => {
    setNewCustomerPlan(prev => {
      const updated = { ...prev, [key]: value };
      
      const getVal = (val) => parseFloat(val) || 0;
      const t1 = key === 't1' ? getVal(value) : getVal(prev.t1);
      const t2 = key === 't2' ? getVal(value) : getVal(prev.t2);
      const t3 = key === 't3' ? getVal(value) : getVal(prev.t3);
      const t4 = key === 't4' ? getVal(value) : getVal(prev.t4);
      const t5 = key === 't5' ? getVal(value) : getVal(prev.t5);
      const t6 = key === 't6' ? getVal(value) : getVal(prev.t6);
      const t7 = key === 't7' ? getVal(value) : getVal(prev.t7);
      const t8 = key === 't8' ? getVal(value) : getVal(prev.t8);
      const t9 = key === 't9' ? getVal(value) : getVal(prev.t9);
      const t10 = key === 't10' ? getVal(value) : getVal(prev.t10);
      const t11 = key === 't11' ? getVal(value) : getVal(prev.t11);
      const t12 = key === 't12' ? getVal(value) : getVal(prev.t12);

      updated.q1 = t1 + t2 + t3;
      updated.q2 = t4 + t5 + t6;
      updated.q3 = t7 + t8 + t9;
      updated.q4 = t10 + t11 + t12;
      updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;

      return updated;
    });
  };
  const updateNewCustomerCountPlan = (key, value) => {
    setNewCustomerCountPlan(prev => {
      const updated = { ...prev, [key]: value };
      const getVal = (val) => parseInt(val, 10) || 0;
      const t1 = key === 't1' ? getVal(value) : getVal(prev.t1);
      const t2 = key === 't2' ? getVal(value) : getVal(prev.t2);
      const t3 = key === 't3' ? getVal(value) : getVal(prev.t3);
      const t4 = key === 't4' ? getVal(value) : getVal(prev.t4);
      const t5 = key === 't5' ? getVal(value) : getVal(prev.t5);
      const t6 = key === 't6' ? getVal(value) : getVal(prev.t6);
      const t7 = key === 't7' ? getVal(value) : getVal(prev.t7);
      const t8 = key === 't8' ? getVal(value) : getVal(prev.t8);
      const t9 = key === 't9' ? getVal(value) : getVal(prev.t9);
      const t10 = key === 't10' ? getVal(value) : getVal(prev.t10);
      const t11 = key === 't11' ? getVal(value) : getVal(prev.t11);
      const t12 = key === 't12' ? getVal(value) : getVal(prev.t12);

      updated.q1 = t1 + t2 + t3;
      updated.q2 = t4 + t5 + t6;
      updated.q3 = t7 + t8 + t9;
      updated.q4 = t10 + t11 + t12;
      updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
      return updated;
    });
  };

  const updateNewContractCountPlan = (key, value) => {
    setNewContractCountPlan(prev => {
      const updated = { ...prev, [key]: value };
      const getVal = (val) => parseInt(val, 10) || 0;
      const t1 = key === 't1' ? getVal(value) : getVal(prev.t1);
      const t2 = key === 't2' ? getVal(value) : getVal(prev.t2);
      const t3 = key === 't3' ? getVal(value) : getVal(prev.t3);
      const t4 = key === 't4' ? getVal(value) : getVal(prev.t4);
      const t5 = key === 't5' ? getVal(value) : getVal(prev.t5);
      const t6 = key === 't6' ? getVal(value) : getVal(prev.t6);
      const t7 = key === 't7' ? getVal(value) : getVal(prev.t7);
      const t8 = key === 't8' ? getVal(value) : getVal(prev.t8);
      const t9 = key === 't9' ? getVal(value) : getVal(prev.t9);
      const t10 = key === 't10' ? getVal(value) : getVal(prev.t10);
      const t11 = key === 't11' ? getVal(value) : getVal(prev.t11);
      const t12 = key === 't12' ? getVal(value) : getVal(prev.t12);

      updated.q1 = t1 + t2 + t3;
      updated.q2 = t4 + t5 + t6;
      updated.q3 = t7 + t8 + t9;
      updated.q4 = t10 + t11 + t12;
      updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
      return updated;
    });
  };

  const handleServiceQualityPlanChange = (rowId, monthKey, val) => {
    setServiceQualityPlan(prev => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [monthKey]: val
      }
    }));
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

                <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="field-label">
                    Loại Kế Hoạch <span className="req-star">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select value={planType} onChange={(e) => setPlanType(e.target.value)} disabled={isReadOnlyForm}>
                      <option value="Kế hoạch tập đoàn">Kế hoạch tập đoàn</option>
                      <option value="Kế hoạch nội bộ">Kế hoạch nội bộ</option>
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Bảng chỉ tiêu doanh thu khách hàng hiện hữu */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Bảng chỉ tiêu doanh thu khách hàng hiện hữu (VNĐ)</h3>
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

          {/* Bảng tổng hợp kế hoạch theo Đơn vị thực hiện */}
          {planType !== 'Kế hoạch tập đoàn' && (
            <section className="goal-card" style={{ marginTop: '16px' }}>
              <div className="goal-card-header">
                <h3>Bảng tổng hợp kế hoạch theo Đơn vị thực hiện</h3>
              </div>
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
            </section>
          )}

          {/* Card 3: Chỉ tiêu số lượng khách hàng và hợp đồng mới */}
          {planType !== 'Kế hoạch nội bộ' && (
            <section className="goal-card">
              <div className="goal-card-header" style={{ marginBottom: '16px' }}>
                <h3>Chỉ tiêu số lượng khách hàng và hợp đồng mới</h3>
              </div>

              {/* Unified grid table */}
              <div className="table-container scrollable-table-container">
                <table className="goal-data-table month-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ minWidth: '220px', textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>Chỉ tiêu</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={`head_month_${i+1}`} className="sub-th-month" style={{ borderBottom: '1px solid #cbd5e1' }}>T{i+1}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => (
                        <th key={`head_quarter_${i+1}`} className="sub-th-quarter" style={{ borderBottom: '1px solid #cbd5e1' }}>Q{i+1}</th>
                      ))}
                      <th className="sub-th-year" style={{ borderBottom: '1px solid #cbd5e1' }}>Năm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 2. Số lượng khách hàng mới (kế hoạch) */}
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 16px', fontWeight: '600', color: '#334155', background: '#fafafa', fontSize: '13px' }}>Số lượng khách hàng mới (kế hoạch)</td>
                      {MONTH_KEYS.map((mKey, idx) => (
                        <td key={`cust_m_${mKey}`} className="td-month-input">
                          <input
                            type="text"
                            className={`month-grid-input ${(isReadOnlyForm || isMonthDisabled(idx)) ? 'readonly-input' : ''}`}
                            value={newCustomerCountPlan[mKey]}
                            onChange={(e) => updateNewCustomerCountPlan(mKey, e.target.value)}
                            disabled={isReadOnlyForm || isMonthDisabled(idx)}
                          />
                        </td>
                      ))}
                      {QUARTER_KEYS.map((qKey) => (
                        <td key={`cust_q_${qKey}`} className="td-quarter-input">
                          <input
                            type="text"
                            className="month-grid-input readonly-input"
                            value={newCustomerCountPlan[qKey]}
                            readOnly
                          />
                        </td>
                      ))}
                      <td className="td-year-input">
                        <input
                          type="text"
                          className="month-grid-input readonly-input"
                          value={newCustomerCountPlan.nam}
                          readOnly
                        />
                      </td>
                    </tr>

                    {/* 3. Số lượng hợp đồng mới (kế hoạch) */}
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '10px 16px', fontWeight: '600', color: '#334155', background: '#fafafa', fontSize: '13px' }}>Số lượng hợp đồng mới (kế hoạch)</td>
                      {MONTH_KEYS.map((mKey, idx) => (
                        <td key={`cnt_m_${mKey}`} className="td-month-input">
                          <input
                            type="text"
                            className={`month-grid-input ${(isReadOnlyForm || isMonthDisabled(idx)) ? 'readonly-input' : ''}`}
                            value={newContractCountPlan[mKey]}
                            onChange={(e) => updateNewContractCountPlan(mKey, e.target.value)}
                            disabled={isReadOnlyForm || isMonthDisabled(idx)}
                          />
                        </td>
                      ))}
                      {QUARTER_KEYS.map((qKey) => (
                        <td key={`cnt_q_${qKey}`} className="td-quarter-input">
                          <input
                            type="text"
                            className="month-grid-input readonly-input"
                            value={newContractCountPlan[qKey]}
                            readOnly
                          />
                        </td>
                      ))}
                      <td className="td-year-input">
                        <input
                          type="text"
                          className="month-grid-input readonly-input"
                          value={newContractCountPlan.nam}
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          {/* Card 3.5: Chỉ tiêu chất lượng dịch vụ */}
          {planType !== 'Kế hoạch nội bộ' && (
            <section className="goal-card" style={{ marginTop: '16px' }}>
              <div className="goal-card-header" style={{ marginBottom: '16px' }}>
                <h3>Chỉ tiêu chất lượng dịch vụ</h3>
              </div>

              <div className="table-container scrollable-table-container">
                <table className="goal-data-table month-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ minWidth: '220px', textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #cbd5e1' }}>CHẤT LƯỢNG DỊCH VỤ</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={`sq_head_month_${i+1}`} className="sub-th-month" style={{ borderBottom: '1px solid #cbd5e1' }}>T{i+1}</th>
                      ))}
                      {Array.from({ length: 4 }, (_, i) => (
                        <th key={`sq_head_quarter_${i+1}`} className="sub-th-quarter" style={{ borderBottom: '1px solid #cbd5e1' }}>Q{i+1}</th>
                      ))}
                      <th className="sub-th-year" style={{ borderBottom: '1px solid #cbd5e1' }}>Năm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceQualityRows.map((row, idx) => {
                      const isParent = row.level === 1 || row.level === 2;
                      let paddingLeft = '16px';
                      let fontWeight = 'normal';
                      let color = '#334155';
                      let background = '#ffffff';

                      if (row.level === 1) {
                        paddingLeft = '16px';
                        fontWeight = '800';
                        color = '#1e3a8a';
                        background = '#f8fafc';
                      } else if (row.level === 2) {
                        paddingLeft = '32px';
                        fontWeight = '700';
                        color = '#0f172a';
                        background = '#fafafa';
                      } else if (row.level === 3) {
                        paddingLeft = '48px';
                        color = '#475569';
                      }

                      const itemValues = computedServiceQualityPlan[row.id] || {};

                      return (
                        <tr key={idx} style={{ background, borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px 16px', paddingLeft, fontWeight, color, fontSize: '13px' }}>
                            {row.name}
                          </td>
                          {/* Months */}
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m, mIdx) => {
                            const val = itemValues[`m${m}`] || '';
                            const displayVal = val ? `${val}%` : '';
                            return (
                              <td key={`sq_cell_m_${row.id}_${m}`} className="td-month-input">
                                {isParent ? (
                                  <input
                                    type="text"
                                    className="month-grid-input readonly-input"
                                    value={displayVal || '--'}
                                    readOnly
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    className={`month-grid-input ${(isReadOnlyForm || isMonthDisabled(mIdx)) ? 'readonly-input' : ''}`}
                                    value={val}
                                    onChange={(e) => handleServiceQualityPlanChange(row.id, `m${m}`, e.target.value)}
                                    disabled={isReadOnlyForm || isMonthDisabled(mIdx)}
                                  />
                                )}
                              </td>
                            );
                          })}
                          {/* Quarters */}
                          {Array.from({ length: 4 }, (_, i) => i + 1).map((q) => {
                            const val = itemValues[`q${q}`] || '';
                            return (
                              <td key={`sq_cell_q_${row.id}_${q}`} className="td-quarter-input">
                                <input
                                  type="text"
                                  className="month-grid-input readonly-input"
                                  value={val ? `${val}%` : '--'}
                                  readOnly
                                />
                              </td>
                            );
                          })}
                          {/* Year */}
                          <td className="td-year-input">
                            <input
                              type="text"
                              className="month-grid-input readonly-input"
                              value={itemValues.nam ? `${itemValues.nam}%` : '--'}
                              readOnly
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
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
    </div>
  );
};

export default GoalForm;