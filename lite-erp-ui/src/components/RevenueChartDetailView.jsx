import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft, Download, Search, Filter, CheckCircle2, AlertCircle,
  TrendingUp, TrendingDown, ChevronDown, ChevronLeft, ChevronRight, TableProperties, BarChart2,
  Calendar, Layers, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import './RevenueChartDetailView.css';

import {
  MONTH_OPTIONS,
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA,
  getCustomerSpdvMonthData,
  CUSTOMER_SPDV_MONTH_DATA
} from '../data/revenueMonthData';

import {
  QUARTER_OPTIONS,
  QUARTER_CUMULATIVE_DATA,
  QUARTER_ESTIMATE_DATA,
  QUARTER_PREV_DATA,
  QUARTER_SAME_PERIOD_DATA,
  QUARTER_NEXT_PLAN_DATA
} from '../data/revenueQuarterData';

import {
  CUMULATIVE_MONTH_OPTIONS,
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  YEAR_ESTIMATE_DATA
} from '../data/revenueYearData';

const YEAR_OPTIONS = ['2026', '2025', '2024'];

import { MONTH_TREND_DATA } from '../data/revenueTrendData';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA, SPDV_BAR_COMPARISON_DATA } from '../data/revenueSpdvData';
import { UNIT_CATEGORIES, UNIT_STRUCTURE_DATA } from '../data/revenueUnitData';
import {
  INTERNAL_EXTERNAL_CATEGORIES,
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_CATEGORIES,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';

import {
  DEBT_SUMMARY_METRICS,
  DEBT_AGING_DATA,
  DEBT_BY_CUSTOMER_GROUP,
  DEBT_MONTHLY_RECOVERY,
  DEBT_TOP_CUSTOMERS
} from '../data/revenueDebtData';

// Chart options list per branch for quick switching
const BRANCH_CHART_OPTIONS = {
  month: [
    { id: 'chart1_val', label: 'Biểu đồ 1: Thực hiện tháng so với KH tháng (Giá trị)' },
    { id: 'chart1_rat', label: 'Biểu đồ 1b: Tỷ trọng doanh thu so với KH tháng' },
    { id: 'chart2_val', label: 'Biểu đồ 2: Thực hiện tháng so với tháng trước (Giá trị)' },
    { id: 'chart2_rat', label: 'Biểu đồ 2b: Tỷ trọng doanh thu so với tháng trước' },
    { id: 'chart3_val', label: 'Biểu đồ 3: Thực hiện tháng so với cùng kỳ năm trước (Giá trị)' },
    { id: 'chart3_rat', label: 'Biểu đồ 3b: Tỷ trọng doanh thu so với cùng kỳ năm trước' },
    { id: 'chart4_val', label: 'Biểu đồ 4: Kế hoạch tháng tới so với tháng hiện tại' },
    { id: 'chart4_rat', label: 'Biểu đồ 4b: Tỷ trọng kế hoạch tháng tới' }
  ],
  quarter: [
    { id: 'chart5_cum_val', label: 'Biểu đồ 5: Lũy kế Quý so với KH Quý (Giá trị)' },
    { id: 'chart5_est_val', label: 'Biểu đồ 5b: Ước Quý so với KH Quý (Giá trị)' },
    { id: 'chart6_val', label: 'Biểu đồ 6: Ước Quý so với Quý trước' },
    { id: 'chart7_val', label: 'Biểu đồ 7: Ước Quý so với cùng kỳ năm trước' },
    { id: 'chart7_next', label: 'Biểu đồ 7b: Kế hoạch Quý tiếp theo' }
  ],
  year: [
    { id: 'chart8', label: 'Biểu đồ 8: Lũy kế TH so với KH năm' },
    { id: 'chart9', label: 'Biểu đồ 9: Lũy kế TH so với KH lũy kế' },
    { id: 'chart10', label: 'Biểu đồ 10: Lũy kế TH so với cùng kỳ năm trước' },
    { id: 'chart11', label: 'Biểu đồ 11: Ước TH năm so với KH năm' },
    { id: 'chart12', label: 'Biểu đồ 12: Ước TH năm so với TH năm trước' },
    { id: 'chart13', label: 'Biểu đồ 13: Ước TH năm so với TH năm trước (Tăng trưởng)' }
  ],
  trend: [
    { id: 'trend_prev_year', label: 'Biểu đồ 14: Xu hướng doanh thu từng tháng so với năm trước' },
    { id: 'trend_plan', label: 'Biểu đồ 15: Xu hướng doanh thu từng tháng so với kế hoạch' },
    { id: 'chart14', label: 'Biểu đồ 14: Xu hướng doanh thu 12 tháng so với năm trước & KH' },
    { id: 'chart15', label: 'Biểu đồ 15: Tích lũy doanh thu 12 tháng' }
  ],
  spdv: [
    { id: 'chart16', label: 'Biểu đồ 16: Cơ cấu doanh thu thực hiện theo 6 nhóm SPDV' },
    { id: 'chart17', label: 'Biểu đồ 17: Cơ cấu doanh thu kế hoạch theo 6 nhóm SPDV' },
    { id: 'chart18_m', label: 'Biểu đồ 18: Doanh thu 6 nhóm SPDV so với KH (Tháng)' },
    { id: 'chart18_q', label: 'Biểu đồ 18b: Doanh thu 6 nhóm SPDV so với KH (Quý)' },
    { id: 'chart18_y', label: 'Biểu đồ 18c: Doanh thu 6 nhóm SPDV so với KH (Năm)' }
  ],
  unit: [
    { id: 'chart19', label: 'Biểu đồ 19: Doanh thu theo khối / đơn vị' },
    { id: 'chart20', label: 'Biểu đồ 20: Tỷ lệ hoàn thành kế hoạch theo đơn vị' }
  ],
  plan_progress: [
    { id: 'chart21', label: 'Biểu đồ 21: Cơ cấu DT nội bộ vs Ngoài tập đoàn' },
    { id: 'chart22', label: 'Biểu đồ 22: Chuyển dịch DT nội bộ vs Ngoài tập đoàn' },
    { id: 'chart23', label: 'Biểu đồ 23: Cơ cấu DT trong nước vs Quốc tế' },
    { id: 'chart24', label: 'Biểu đồ 24: Chuyển dịch DT trong nước vs Quốc tế' }
  ],
  debt: [
    { id: 'chart25', label: 'Biểu đồ 25: Phân loại tuổi nợ' },
    { id: 'chart26', label: 'Biểu đồ 26: Top khách hàng công nợ lớn' },
    { id: 'chart27', label: 'Biểu đồ 27: Tiến độ thu hồi công nợ theo tháng' },
    { id: 'chart28', label: 'Biểu đồ 28: Công nợ theo nhóm khách hàng' }
  ]
};

// Master detailed dataset by Customer Group & SPDV (used across Month, Quarter, Year)
const CUSTOMER_SPDV_MASTER_DATA = [
  // 1-7: Khách hàng nội bộ (Internal)
  {
    id: 'row-1',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước',
    customerName: 'Tập đoàn Viettel',
    spdvGroup: 'Viễn thông',
    spdvName: 'FTTH',
    baseKh: 110,
    baseTh: 100,
    baseUoc: 105,
    type: 'internal',
    isInternational: false
  },
  {
    id: 'row-2',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước',
    customerName: 'Tập đoàn Viettel',
    spdvGroup: 'CNTT',
    spdvName: 'Cloud',
    baseKh: 50,
    baseTh: 55,
    baseUoc: 52,
    type: 'internal',
    isInternational: false
  },
  {
    id: 'row-3',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước',
    customerName: 'Tổng công ty X',
    spdvGroup: 'Dịch vụ số',
    spdvName: 'Giải pháp số',
    baseKh: 30,
    baseTh: 25,
    baseUoc: 27,
    type: 'internal',
    isInternational: false
  },
  {
    id: 'row-4',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước',
    customerName: 'Tổng công ty Mạng lưới Viettel',
    spdvGroup: 'Hạ tầng số',
    spdvName: 'Kênh truyền dẫn',
    baseKh: 45,
    baseTh: 46,
    baseUoc: 45,
    type: 'internal',
    isInternational: false
  },
  {
    id: 'row-5',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn nước ngoài',
    customerName: 'Viettel Global',
    spdvGroup: 'Viễn thông',
    spdvName: 'Truyền dẫn',
    baseKh: 75,
    baseTh: 70,
    baseUoc: 72,
    type: 'internal',
    isInternational: true
  },
  {
    id: 'row-6',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn nước ngoài',
    customerName: 'Viettel Overseas',
    spdvGroup: 'CNTT',
    spdvName: 'Data Center',
    baseKh: 55,
    baseTh: 50,
    baseUoc: 52,
    type: 'internal',
    isInternational: true
  },
  {
    id: 'row-7',
    customerGroup: 'Khách hàng nội bộ - Tập đoàn nước ngoài',
    customerName: 'Lumitel Burundi',
    spdvGroup: 'Viễn thông',
    spdvName: 'Roaming quốc tế',
    baseKh: 40,
    baseTh: 38,
    baseUoc: 39,
    type: 'internal',
    isInternational: true
  },
  // 8-15: Khách hàng ngoài Tập đoàn (External)
  {
    id: 'row-8',
    customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
    customerName: 'Sungroup',
    spdvGroup: 'Giải pháp, Dịch vụ CNTT',
    spdvName: 'OmniX CRM',
    baseKh: 160,
    baseTh: 150,
    baseUoc: 155,
    type: 'external',
    isInternational: false
  },
  {
    id: 'row-9',
    customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
    customerName: 'FPT',
    spdvGroup: 'Giải pháp, Dịch vụ CNTT',
    spdvName: 'AI Chatbot',
    baseKh: 110,
    baseTh: 100,
    baseUoc: 105,
    type: 'external',
    isInternational: false
  },
  {
    id: 'row-10',
    customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
    customerName: 'Tập đoàn Vingroup (VinFast)',
    spdvGroup: 'CNTT & IoT',
    spdvName: 'Nền tảng Smart Mobility',
    baseKh: 90,
    baseTh: 85,
    baseUoc: 88,
    type: 'external',
    isInternational: false
  },
  {
    id: 'row-11',
    customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
    customerName: 'Ngân hàng Vietcombank',
    spdvGroup: 'Dịch vụ số',
    spdvName: 'Core Banking Integration',
    baseKh: 85,
    baseTh: 90,
    baseUoc: 88,
    type: 'external',
    isInternational: false
  },
  {
    id: 'row-12',
    customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước',
    customerName: 'Tập đoàn Masan',
    spdvGroup: 'SaaS Platform',
    spdvName: 'Supply Chain Analytics',
    baseKh: 50,
    baseTh: 48,
    baseUoc: 49,
    type: 'external',
    isInternational: false
  },
  {
    id: 'row-13',
    customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài',
    customerName: 'Singtel International',
    spdvGroup: 'Tích hợp Hệ thống',
    spdvName: 'Loyalty App',
    baseKh: 95,
    baseTh: 90,
    baseUoc: 92,
    type: 'external',
    isInternational: true
  },
  {
    id: 'row-14',
    customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài',
    customerName: 'SoftBank',
    spdvGroup: 'SaaS Platform',
    spdvName: 'ERP Custom',
    baseKh: 55,
    baseTh: 50,
    baseUoc: 52,
    type: 'external',
    isInternational: true
  },
  {
    id: 'row-15',
    customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài',
    customerName: 'KDDI Corporation',
    spdvGroup: 'Hạ tầng Cloud',
    spdvName: 'Hybrid Cloud Gateway',
    baseKh: 60,
    baseTh: 62,
    baseUoc: 61,
    type: 'external',
    isInternational: true
  }
];

export default function RevenueChartDetailView({
  initialBranchId = 'month',
  initialChartKey = 'chart1_val',
  initialChartTitle = '',
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  selectedQuarter = 'Quý III',
  setSelectedQuarter,
  selectedCumulativeMonth = '8 tháng',
  setSelectedCumulativeMonth,
  onBack
}) {
  const [activeBranchId, setActiveBranchId] = useState(initialBranchId);
  const [activeChartKey, setActiveChartKey] = useState(initialChartKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pass' | 'fail'

  useEffect(() => {
    if (initialBranchId) setActiveBranchId(initialBranchId);
    if (initialChartKey) setActiveChartKey(initialChartKey);
  }, [initialBranchId, initialChartKey]);

  const chartOptions = BRANCH_CHART_OPTIONS[activeBranchId] || BRANCH_CHART_OPTIONS.month;

  // Resolve current active chart label
  const currentChartObj = chartOptions.find(o => o.id === activeChartKey) || chartOptions[0];
  const chartTitle = (activeChartKey === initialChartKey && initialChartTitle) ? initialChartTitle : (currentChartObj?.label || 'Bảng dữ liệu chi tiết');

  // Branch category helper
  const isMatrixBranch = activeBranchId === 'month' || activeBranchId === 'quarter' || activeBranchId === 'year' || activeBranchId === 'trend';
  const isTrendBranch = activeBranchId === 'trend';

  // Month code computations for dynamic comparison headers
  const monthNum = useMemo(() => {
    return parseInt(selectedMonth.match(/\d+/)?.[0] || '8', 10);
  }, [selectedMonth]);

  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();

  // Quarter code computations
  const quarterNum = useMemo(() => {
    if (selectedQuarter === 'Quý I') return 1;
    if (selectedQuarter === 'Quý II') return 2;
    if (selectedQuarter === 'Quý III') return 3;
    if (selectedQuarter === 'Quý IV') return 4;
    return 3;
  }, [selectedQuarter]);

  const quarterCode = `Q${quarterNum}`;
  const prevQuarterNum = quarterNum === 1 ? 4 : quarterNum - 1;
  const prevQuarterYear = quarterNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const prevQuarterName = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'][prevQuarterNum - 1];
  const prevQuarterCode = `Q${prevQuarterNum}`;
  const nextQuarterNum = quarterNum === 4 ? 1 : quarterNum + 1;
  const nextQuarterYear = quarterNum === 4 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;
  const nextQuarterName = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'][nextQuarterNum - 1];
  const nextQuarterCode = `Q${nextQuarterNum}`;

  // Cumulative month code computations
  const cumulativeShortCode = useMemo(() => {
    const match = selectedCumulativeMonth?.match(/\d+/);
    return match ? `${match[0]}T` : '8T';
  }, [selectedCumulativeMonth]);

  // Check if current chart has estimate data (Ước)
  const hasEstimate = useMemo(() => {
    const keyLower = (activeChartKey || '').toLowerCase();
    const titleLower = (chartTitle || '').toLowerCase();
    const labelLower = (currentChartObj?.label || '').toLowerCase();

    // Cumulative and next-period charts never have estimate column
    if (titleLower.includes('lũy kế') || labelLower.includes('lũy kế')) return false;
    if (titleLower.includes('tiếp theo') || labelLower.includes('tiếp theo')) return false;

    return (
      keyLower.includes('est') ||
      keyLower.includes('uoc') ||
      keyLower === 'chart6_val' ||
      keyLower === 'chart7_val' ||
      keyLower === 'chart8_val' ||
      keyLower === 'chart12' ||
      keyLower === 'chart13' ||
      keyLower === 'chart12_val' ||
      keyLower === 'chart13_val' ||
      titleLower.includes('ước') ||
      labelLower.includes('ước')
    );
  }, [activeChartKey, chartTitle, currentChartObj]);

  // Dynamic header 1: Period title
  const periodHeaderTitle = useMemo(() => {
    if (activeBranchId === 'quarter') {
      return `${selectedQuarter}/${selectedYear}`;
    }
    if (activeBranchId === 'year') {
      if (
        activeChartKey === 'chart11' ||
        activeChartKey === 'chart12' ||
        activeChartKey === 'chart13' ||
        activeChartKey === 'chart12_val' ||
        activeChartKey === 'chart13_val' ||
        chartTitle.includes('năm trước') ||
        chartTitle.includes('kế hoạch năm')
      ) {
        return `Năm ${selectedYear}`;
      }
      return `${selectedCumulativeMonth}/${selectedYear}`;
    }
    return `${selectedMonth}/${selectedYear}`;
  }, [activeBranchId, selectedQuarter, selectedYear, activeChartKey, chartTitle, selectedCumulativeMonth, selectedMonth]);

  // Dynamic header 2: Comparison group title matching chart name with year
  const comparisonGroupTitle = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart6_val' || (activeChartKey === 'chart7_val' && chartTitle.includes('trước'))) {
        return `Ước thực hiện so với TH ${prevQuarterName}/${prevQuarterYear}`;
      }
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart8_val' || chartTitle.includes('cùng kỳ')) {
        return `Ước thực hiện so với cùng kỳ ${selectedQuarter}/${lastYear}`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || chartTitle.includes('tiếp theo')) {
        return `So với kế hoạch ${nextQuarterName}/${nextQuarterYear}`;
      }
      if (activeChartKey === 'chart5_est_val' || (activeChartKey === 'chart6_val' && chartTitle.includes('KH'))) {
        return `Ước thực hiện so với KH ${selectedQuarter}/${selectedYear}`;
      }
      return `Lũy kế thực hiện so với KH ${selectedQuarter}/${selectedYear}`;
    }

    if (activeBranchId === 'year') {
      if (activeChartKey === 'chart10' || chartTitle.includes('cùng kỳ')) {
        return `Lũy kế TH so với cùng kỳ ${cumulativeShortCode}/${lastYear}`;
      }
      if (activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.includes('Ước') && chartTitle.includes('kế hoạch'))) {
        return `Ước thực hiện cả năm so với KH năm ${selectedYear}`;
      }
      if (activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.includes('Ước') && chartTitle.includes('năm trước'))) {
        return `Ước thực hiện năm so với TH năm ${lastYear}`;
      }
      if (activeChartKey === 'chart8' || activeChartKey === 'chart11_val' || chartTitle.includes('cả năm')) {
        return `Lũy kế thực hiện so với KH cả năm ${selectedYear}`;
      }
      const cleanMonth = selectedCumulativeMonth?.replace(/lũy kế\s*/i, '').trim() || '8 tháng';
      return `So với luỹ kế KH ${cleanMonth} ${selectedYear}`;
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') {
      return `So với Tháng ${prevMonthNum}/${prevYear}`;
    }
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') {
      return `So với cùng kỳ Tháng ${monthNum}/${lastYear}`;
    }
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') {
      return `So với kế hoạch Tháng ${nextMonthNum}/${nextYear}`;
    }
    return 'Thực hiện so với KH Tập đoàn';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    monthNum, prevMonthNum, prevYear, nextMonthNum, nextYear, lastYear,
    selectedQuarter, prevQuarterName, prevQuarterYear, nextQuarterName, nextQuarterYear,
    selectedCumulativeMonth, cumulativeShortCode, selectedYear
  ]);

  // Dynamic sub-column labels with year
  const targetColumnLabel = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart6_val' || (activeChartKey === 'chart7_val' && chartTitle.includes('trước'))) {
        return `TH ${prevQuarterCode}/${prevQuarterYear}`;
      }
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart8_val' || chartTitle.includes('cùng kỳ')) {
        return `TH ${quarterCode}/${lastYear}`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || chartTitle.includes('tiếp theo')) {
        return `KH ${nextQuarterCode}/${nextQuarterYear}`;
      }
      return `KH ${quarterCode}/${selectedYear}`;
    }

    if (activeBranchId === 'year') {
      if (activeChartKey === 'chart10' || chartTitle.includes('cùng kỳ')) {
        return `TH LK ${cumulativeShortCode}/${lastYear}`;
      }
      if (activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.includes('Ước') && chartTitle.includes('kế hoạch'))) {
        return `KH Năm ${selectedYear}`;
      }
      if (activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.includes('Ước') && chartTitle.includes('năm trước'))) {
        return `TH Năm ${lastYear}`;
      }
      if (activeChartKey === 'chart8' || activeChartKey === 'chart11_val' || chartTitle.includes('cả năm')) {
        return `KH Năm ${selectedYear}`;
      }
      return `KH LK ${cumulativeShortCode}/${selectedYear}`;
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') return `TH T${prevMonthNum}/${prevYear}`;
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') return `TH T${monthNum}/${lastYear}`;
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') return `KH T${nextMonthNum}/${nextYear}`;
    return 'KH';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    prevMonthNum, prevYear, monthNum, lastYear, nextMonthNum, nextYear,
    quarterCode, prevQuarterCode, prevQuarterYear, nextQuarterCode, nextQuarterYear, selectedYear,
    cumulativeShortCode
  ]);

  const diffColumnLabel = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart6_val' || (activeChartKey === 'chart7_val' && chartTitle.includes('trước'))) {
        return `${prevQuarterCode}/${prevQuarterYear}`;
      }
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart8_val' || chartTitle.includes('cùng kỳ')) {
        return `CK ${lastYear}`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || chartTitle.includes('tiếp theo')) {
        return `${nextQuarterCode}/${nextQuarterYear}`;
      }
      return `KH ${selectedYear}`;
    }

    if (activeBranchId === 'year') {
      if (activeChartKey === 'chart10' || chartTitle.includes('cùng kỳ')) {
        return `CK ${lastYear}`;
      }
      if (activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.includes('Ước') && chartTitle.includes('kế hoạch'))) {
        return `KH Năm`;
      }
      if (activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.includes('Ước') && chartTitle.includes('năm trước'))) {
        return `TH Năm ${lastYear}`;
      }
      if (activeChartKey === 'chart8' || activeChartKey === 'chart11_val' || chartTitle.includes('cả năm')) {
        return `KH Năm`;
      }
      return `KH LK`;
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') return `T${prevMonthNum}/${prevYear}`;
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') return `T${monthNum}/${lastYear}`;
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') return `T${nextMonthNum}/${nextYear}`;
    return 'KH';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    prevMonthNum, prevYear, monthNum, lastYear, nextMonthNum, nextYear,
    prevQuarterCode, prevQuarterYear, nextQuarterCode, nextQuarterYear, selectedYear
  ]);

  const rateSubLabel = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart6_val' || (activeChartKey === 'chart7_val' && chartTitle.includes('trước'))) {
        return `so ${prevQuarterCode}/${prevQuarterYear}`;
      }
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart8_val' || chartTitle.includes('cùng kỳ')) {
        return `so CK ${lastYear}`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || chartTitle.includes('tiếp theo')) {
        return `so ${nextQuarterCode}/${nextQuarterYear}`;
      }
      return 'HTKH';
    }

    if (activeBranchId === 'year') {
      if (activeChartKey === 'chart10' || chartTitle.includes('cùng kỳ')) {
        return `so CK ${lastYear}`;
      }
      if (activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.includes('Ước') && chartTitle.includes('năm trước'))) {
        return `so TH ${lastYear}`;
      }
      return 'HTKH';
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') return `so T${prevMonthNum}/${prevYear}`;
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') return `so T${monthNum}/${lastYear}`;
    return 'HTKH';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    prevMonthNum, prevYear, monthNum, lastYear,
    prevQuarterCode, prevQuarterYear, nextQuarterCode, nextQuarterYear
  ]);

  // Compute table dataset according to active branch and chart
  const tableData = useMemo(() => {
    let rows = [];
    let defaultUnit = 'Tỷ đồng';
    let isRatio = false;

    if (activeBranchId === 'month') {
      const pData = MONTHLY_PLAN_DATA[selectedMonth] || MONTHLY_PLAN_DATA['Tháng 8'];
      const prevData = MONTH_PREV_DATA[selectedMonth] || MONTH_PREV_DATA['Tháng 8'];
      const lyData = MONTH_LAST_YEAR_DATA[selectedMonth] || MONTH_LAST_YEAR_DATA['Tháng 8'];
      const npData = MONTH_NEXT_PLAN_DATA[selectedMonth] || MONTH_NEXT_PLAN_DATA['Tháng 8'];

      if (activeChartKey === 'chart1_rat' || activeChartKey === 'chart2_rat' || activeChartKey === 'chart3_rat' || activeChartKey === 'chart4_rat') {
        isRatio = true;
        defaultUnit = '%';
        const rawRatios = activeChartKey === 'chart1_rat' ? pData?.ratios
          : activeChartKey === 'chart2_rat' ? prevData?.ratios
          : activeChartKey === 'chart3_rat' ? lyData?.ratios
          : npData?.ratios;

        rows = (rawRatios || []).map((item, idx) => ({
          stt: idx + 1,
          name: item.name,
          unit: '%',
          kh: item.kh,
          th: item.th !== undefined ? item.th : item.thCurrent,
          diff: item.diff !== undefined ? item.diff : ((item.th || 0) - (item.kh || 0)).toFixed(1),
          rate: item.rate || (item.kh ? `${Math.round((item.th / item.kh) * 100)}%` : '-'),
          isPass: item.isDiffPositive !== undefined ? item.isDiffPositive : (item.th >= item.kh),
          share: item.th !== undefined ? `${item.th}%` : '-'
        }));
      } else {
        defaultUnit = 'Triệu đồng';
        const rawValues = activeChartKey === 'chart2_val' ? prevData?.values
          : activeChartKey === 'chart3_val' ? lyData?.values
          : activeChartKey === 'chart4_val' ? npData?.values
          : pData?.values;

        rows = (rawValues || []).map((item, idx) => {
          const khVal = item.kh !== undefined ? item.kh : item.thPrev !== undefined ? item.thPrev : item.thLastYear;
          const thVal = item.th !== undefined ? item.th : item.thCurrent;
          const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
          const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
          return {
            stt: idx + 1,
            name: item.name,
            unit: item.unit || 'Triệu đồng',
            kh: khVal,
            th: thVal,
            diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
            diffNum: diffVal,
            rate: item.rate || `${rateVal}%`,
            rateNum: rateVal,
            isPass: diffVal >= 0 || rateVal >= 100,
            share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 389.9) * 100)}%` : '-')
          };
        });
      }
    } else if (activeBranchId === 'quarter') {
      const qCum = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý III'];
      const qEst = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý III'];
      const qPrev = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý III'];
      const qSame = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý III'];
      const qNext = QUARTER_NEXT_PLAN_DATA[selectedQuarter] || QUARTER_NEXT_PLAN_DATA['Quý III'];

      const raw = activeChartKey === 'chart5_est_val' ? qEst?.values
        : activeChartKey === 'chart6_val' ? qPrev?.values
        : activeChartKey === 'chart7_val' ? qSame?.values
        : activeChartKey === 'chart7_next' ? qNext?.values
        : qCum?.values;

      rows = (raw || []).map((item, idx) => {
        const khVal = item.kh !== undefined ? item.kh : item.thPrev !== undefined ? item.thPrev : item.thLastYear;
        const thVal = item.th !== undefined ? item.th : item.thCurrent;
        const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
        const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
        return {
          stt: idx + 1,
          name: item.name,
          unit: item.unit || 'Triệu đồng',
          kh: khVal,
          th: thVal,
          diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: item.rate || `${rateVal}%`,
          rateNum: rateVal,
          isPass: diffVal >= 0 || rateVal >= 100,
          share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 1150) * 100)}%` : '-')
        };
      });
    } else if (activeBranchId === 'year') {
      const yData = YEAR_CUMULATIVE_DATA[selectedYear] || YEAR_CUMULATIVE_DATA['2026'];
      const yFull = YEAR_PLAN_FULL_DATA[selectedYear] || YEAR_PLAN_FULL_DATA['2026'];
      const yEst = YEAR_ESTIMATE_DATA[selectedYear] || YEAR_ESTIMATE_DATA['2026'];

      const raw = activeChartKey === 'chart11' ? yFull?.values
        : (activeChartKey === 'chart12' || activeChartKey === 'chart13') ? yEst?.values
        : yData?.values;

      rows = (raw || []).map((item, idx) => {
        const khVal = item.kh !== undefined ? item.kh : item.thLastYear;
        const thVal = item.th !== undefined ? item.th : item.thCurrent;
        const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
        const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
        return {
          stt: idx + 1,
          name: item.name,
          unit: 'Triệu đồng',
          kh: khVal,
          th: thVal,
          diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: item.rate || `${rateVal}%`,
          rateNum: rateVal,
          isPass: diffVal >= 0 || rateVal >= 100,
          share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 4500) * 100)}%` : '-')
        };
      });
    } else if (activeBranchId === 'trend') {
      const trendList = MONTH_TREND_DATA[selectedYear] || MONTH_TREND_DATA['2026'] || [];
      rows = trendList.map((item, idx) => {
        const diffVal = Number((item.actual - item.target).toFixed(1));
        return {
          stt: idx + 1,
          name: item.month,
          unit: 'Tỷ VNĐ',
          kh: item.target,
          th: item.actual,
          diff: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: `${item.rate}%`,
          rateNum: item.rate,
          isPass: item.rate >= 100,
          share: `${item.growth}% tăng trưởng`
        };
      });
    } else if (activeBranchId === 'spdv') {
      const spdvFull = SPDV_STRUCTURE_DATA[selectedYear] || SPDV_STRUCTURE_DATA['2026'];
      const barCompare = SPDV_BAR_COMPARISON_DATA[selectedYear]?.['Tháng 8'] || SPDV_BAR_COMPARISON_DATA['2026']['Tháng 8'];

      if (activeChartKey === 'chart16') {
        const slices = spdvFull.thMonth.slices || [];
        rows = slices.map((s, idx) => ({
          stt: idx + 1,
          name: s.name,
          unit: 'Triệu đồng',
          kh: '-',
          th: s.value,
          diff: '-',
          diffNum: 0,
          rate: '100%',
          rateNum: 100,
          isPass: true,
          share: `${s.percent}%`
        }));
      } else if (activeChartKey === 'chart17') {
        const slices = spdvFull.khMonth.slices || [];
        rows = slices.map((s, idx) => ({
          stt: idx + 1,
          name: s.name,
          unit: 'Triệu đồng',
          kh: s.value,
          th: '-',
          diff: '-',
          diffNum: 0,
          rate: '-',
          rateNum: 0,
          isPass: true,
          share: `${s.percent}%`
        }));
      } else {
        const barItems = activeChartKey === 'chart18_q' ? barCompare.quarterItems
          : activeChartKey === 'chart18_y' ? barCompare.yearItems
          : barCompare.monthItems;

        rows = (barItems || []).map((item, idx) => {
          const diffVal = Number((item.th - item.kh).toFixed(1));
          const rateNum = parseInt(item.rate.replace('%', ''), 10);
          return {
            stt: idx + 1,
            name: item.name,
            unit: 'Tỷ đ',
            kh: item.kh,
            th: item.th,
            diff: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
            diffNum: diffVal,
            rate: item.rate,
            rateNum: rateNum,
            isPass: item.isRatePositive,
            share: `${Math.round((item.th / (activeChartKey === 'chart18_y' ? 4500 : 389.9)) * 100)}%`
          };
        });
      }
    } else if (activeBranchId === 'unit') {
      const uData = UNIT_STRUCTURE_DATA[selectedYear] || UNIT_STRUCTURE_DATA['2026'];
      const slices = uData?.thMonth?.slices || [];
      rows = slices.map((s, idx) => ({
        stt: idx + 1,
        name: s.name,
        unit: 'Triệu đồng',
        kh: (s.value * 1.05).toFixed(1),
        th: s.value,
        diff: `-${(s.value * 0.05).toFixed(1)}`,
        diffNum: -1,
        rate: '95,2%',
        rateNum: 95.2,
        isPass: false,
        share: `${s.percent}%`
      }));
    } else if (activeBranchId === 'plan_progress') {
      const inEx = INTERNAL_EXTERNAL_DATA[selectedYear] || INTERNAL_EXTERNAL_DATA['2026'];
      const slices = inEx?.thMonth?.slices || [];
      rows = slices.map((s, idx) => ({
        stt: idx + 1,
        name: s.name,
        unit: 'Tỷ đ',
        kh: (s.value * 1.04).toFixed(1),
        th: s.value,
        diff: `-${(s.value * 0.04).toFixed(1)}`,
        diffNum: -1,
        rate: '96,1%',
        rateNum: 96.1,
        isPass: false,
        share: s.formattedPercent || `${s.percent}%`
      }));
    } else if (activeBranchId === 'debt') {
      const aging = DEBT_AGING_DATA[selectedYear] || DEBT_AGING_DATA['2026'] || [];
      rows = aging.map((item, idx) => ({
        stt: idx + 1,
        name: item.period,
        unit: 'Tỷ đ',
        kh: item.target || 20.0,
        th: item.amount,
        diff: item.amount <= (item.target || 20) ? 'Đạt kiểm soát' : 'Vượt ngưỡng nợ',
        diffNum: 0,
        rate: `${Math.round((item.amount / 142.5) * 100)}%`,
        rateNum: Math.round((item.amount / 142.5) * 100),
        isPass: item.amount <= (item.target || 20),
        share: `${item.rate}%`
      }));
    }

    return { rows, defaultUnit, isRatio };
  }, [activeBranchId, activeChartKey, selectedYear, selectedMonth, selectedQuarter, selectedCumulativeMonth]);

  // Filtered rows for Matrix branches (Month, Quarter, Year) - Customer & SPDV matrix
  const filteredMatrixRows = useMemo(() => {
    if (!isMatrixBranch) return [];

    let processedRows = [];

    if (activeBranchId === 'month') {
      const monthFactors = {
        'Tháng 1': 0.75, 'Tháng 2': 0.70, 'Tháng 3': 0.95,
        'Tháng 4': 0.85, 'Tháng 5': 0.88, 'Tháng 6': 1.00,
        'Tháng 7': 0.92, 'Tháng 8': 0.90, 'Tháng 9': 0.96,
        'Tháng 10': 0.94, 'Tháng 11': 0.98, 'Tháng 12': 1.10
      };
      const factor = monthFactors[selectedMonth] || 0.90;
      const prevFactor = monthFactors[`Tháng ${prevMonthNum}`] || (factor * 0.95);
      const nextFactor = monthFactors[`Tháng ${nextMonthNum}`] || (factor * 1.05);

      processedRows = CUSTOMER_SPDV_MASTER_DATA.map((item, idx) => {
        let scaledKh = item.baseKh;
        let scaledTh = item.baseTh;
        let scaledUoc = item.baseUoc;

        if (selectedMonth !== 'Tháng 6') {
          scaledKh = Math.round(item.baseKh * factor);
          const thVariance = idx % 2 === 0 ? 0.93 : 0.97;
          scaledTh = Math.round(scaledKh * thVariance);
          scaledUoc = Math.round((scaledKh * 0.4) + (scaledTh * 0.6));
        }

        let targetVal = scaledKh;
        if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') {
          targetVal = Math.round(item.baseTh * prevFactor);
        } else if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') {
          targetVal = Math.round(scaledTh * 0.90);
        } else if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') {
          targetVal = Math.round(item.baseKh * nextFactor);
        }

        const diff = scaledTh - targetVal;
        const rateNum = targetVal > 0 ? Number(((scaledTh / targetVal) * 100).toFixed(1)) : 100;
        const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
        const isPass = diff >= 0 || rateNum >= 100;

        return {
          ...item,
          id: `m-${selectedMonth}-${idx + 1}`,
          kh: scaledKh,
          uocTh: scaledUoc,
          th: scaledTh,
          targetVal,
          diff,
          diffFormatted: (diff > 0 ? '+' : '') + diff,
          rate,
          rateNum,
          isPass
        };
      });
    } else if (activeBranchId === 'quarter') {
      const quarterFactors = {
        'Quý I': 1.05,
        'Quý II': 1.18,
        'Quý III': 1.12,
        'Quý IV': 1.30
      };
      const currentFactor = quarterFactors[selectedQuarter] || 1.12;
      const prevQuarterFactor = quarterFactors[prevQuarterName] || 1.05;
      const nextQuarterFactor = quarterFactors[nextQuarterName] || 1.25;

      const isVsPrev = activeChartKey === 'chart6_val' || (activeChartKey === 'chart7_val' && chartTitle.includes('trước'));
      const isVsSame = activeChartKey === 'chart7_val' || activeChartKey === 'chart8_val' || chartTitle.includes('cùng kỳ');
      const isVsNext = activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || chartTitle.includes('tiếp theo');

      processedRows = CUSTOMER_SPDV_MASTER_DATA.map((item, idx) => {
        const scaledKh = Math.round(item.baseKh * currentFactor);
        const thVariance = idx % 2 === 0 ? 0.94 : 0.98;
        const scaledTh = Math.round(scaledKh * thVariance);
        const scaledUoc = Math.round((scaledKh * 0.35) + (scaledTh * 0.65));

        let targetVal = scaledKh;
        if (isVsPrev) {
          targetVal = Math.round(item.baseTh * prevQuarterFactor);
        } else if (isVsSame) {
          targetVal = Math.round(item.baseTh * currentFactor * 0.92);
        } else if (isVsNext) {
          targetVal = Math.round(item.baseKh * nextQuarterFactor);
        }

        const valueToCompare = hasEstimate ? scaledUoc : scaledTh;
        const diff = valueToCompare - targetVal;
        const rateNum = targetVal > 0 ? Number(((valueToCompare / targetVal) * 100).toFixed(1)) : 100;
        const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
        const isPass = diff >= 0 || rateNum >= 100;

        return {
          ...item,
          id: `q-${selectedQuarter}-${idx + 1}`,
          kh: scaledKh,
          uocTh: scaledUoc,
          th: scaledTh,
          targetVal,
          diff,
          diffFormatted: (diff > 0 ? '+' : '') + diff,
          rate,
          rateNum,
          isPass
        };
      });
    } else if (activeBranchId === 'year') {
      const yearFactors = {
        'Lũy kế 1 tháng': 0.40,
        'Lũy kế 2 tháng': 0.80,
        'Lũy kế 3 tháng': 1.25,
        'Lũy kế 4 tháng': 1.65,
        'Lũy kế 5 tháng': 2.10,
        'Lũy kế 6 tháng': 2.55,
        'Lũy kế 7 tháng': 2.95,
        'Lũy kế 8 tháng': 3.40,
        'Lũy kế 9 tháng': 3.85,
        'Lũy kế 10 tháng': 4.25,
        'Lũy kế 11 tháng': 4.65,
        'Lũy kế cả năm (12T)': 5.10
      };
      const currentFactor = yearFactors[selectedCumulativeMonth] || 3.40;
      const fullYearFactor = 5.10;

      const isVsSame = activeChartKey === 'chart10' || chartTitle.includes('cùng kỳ');
      const isVsFullYearPlan = activeChartKey === 'chart8' || activeChartKey === 'chart11_val' || (chartTitle.includes('cả năm') && !chartTitle.includes('Ước'));
      const isEstVsFullPlan = activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.includes('Ước') && chartTitle.includes('kế hoạch'));
      const isEstVsLastYear = activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.includes('Ước') && chartTitle.includes('năm trước'));

      processedRows = CUSTOMER_SPDV_MASTER_DATA.map((item, idx) => {
        let scaledKh = Math.round(item.baseKh * currentFactor);
        const thVariance = idx % 2 === 0 ? 0.95 : 0.99;
        let scaledTh = Math.round(scaledKh * thVariance);
        let scaledUoc = Math.round(item.baseKh * fullYearFactor * 1.02);

        if (isEstVsFullPlan || isEstVsLastYear) {
          scaledKh = Math.round(item.baseKh * fullYearFactor);
          scaledTh = Math.round(scaledKh * 0.98);
        }

        let targetVal = scaledKh;
        if (isVsSame) {
          targetVal = Math.round(item.baseTh * currentFactor * 0.92);
        } else if (isVsFullYearPlan) {
          targetVal = Math.round(item.baseKh * fullYearFactor);
        } else if (isEstVsFullPlan) {
          targetVal = Math.round(item.baseKh * fullYearFactor);
        } else if (isEstVsLastYear) {
          targetVal = Math.round(item.baseTh * fullYearFactor * 0.90);
        }

        const valueToCompare = hasEstimate ? scaledUoc : scaledTh;
        const diff = valueToCompare - targetVal;
        const rateNum = targetVal > 0 ? Number(((valueToCompare / targetVal) * 100).toFixed(1)) : 100;
        const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
        const isPass = diff >= 0 || rateNum >= 100;

        return {
          ...item,
          id: `y-${selectedCumulativeMonth}-${idx + 1}`,
          kh: scaledKh,
          uocTh: scaledUoc,
          th: scaledTh,
          targetVal,
          diff,
          diffFormatted: (diff > 0 ? '+' : '') + diff,
          rate,
          rateNum,
          isPass
        };
      });
    } else if (activeBranchId === 'trend') {
      const monthFactors = {
        1: 0.75, 2: 0.70, 3: 0.95,
        4: 0.85, 5: 0.88, 6: 1.00,
        7: 0.92, 8: 0.90, 9: 0.96,
        10: 0.94, 11: 0.98, 12: 1.10
      };
      const isCurrent2026 = selectedYear === '2026';

      processedRows = CUSTOMER_SPDV_MASTER_DATA.map((item, idx) => {
        const monthly = {};
        let totalKh = 0;
        let totalTh = 0;
        let relevantKh = 0;

        for (let m = 1; m <= 12; m++) {
          const factor = monthFactors[m] || 0.90;
          const kh = Math.round(item.baseKh * factor);
          totalKh += kh;

          if (isCurrent2026 && m > 8) {
            monthly[m] = {
              kh,
              th: null,
              rate: '—',
              rateNum: null,
              diff: null
            };
          } else {
            const variance = idx % 2 === 0 ? 0.94 : 0.98;
            const th = Math.round(kh * variance);
            const diff = th - kh;
            const rateNum = kh > 0 ? Number(((th / kh) * 100).toFixed(1)) : 100;
            const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
            totalTh += th;
            relevantKh += kh;
            monthly[m] = {
              kh,
              th,
              diff,
              rate,
              rateNum,
              isPass: diff >= 0 || rateNum >= 100
            };
          }
        }

        const compKh = isCurrent2026 ? relevantKh : totalKh;
        const totalDiff = totalTh - compKh;
        const totalRateNum = compKh > 0 ? Number(((totalTh / compKh) * 100).toFixed(1)) : 100;
        const totalRate = `${totalRateNum.toFixed(1).replace('.', ',')}%`;
        const isPass = totalDiff >= 0 || totalRateNum >= 100;

        // Tỷ lệ tăng trưởng so với cùng kỳ năm trước
        const rowGrowthFactor = 1.10 + ((idx * 3) % 7) * 0.01; // ~1.10 -> 1.16 (+10% đến +16%)
        const prevTh = Math.round(totalTh / rowGrowthFactor);
        const growthRateNum = prevTh > 0 ? Number((((totalTh - prevTh) / prevTh) * 100).toFixed(1)) : 0;
        const growthRate = `${growthRateNum >= 0 ? '+' : ''}${growthRateNum.toFixed(1).replace('.', ',')}%`;

        return {
          ...item,
          id: `trend-${selectedYear}-${idx + 1}`,
          monthly,
          totalKh,
          totalTh,
          totalDiff,
          totalDiffFormatted: (totalDiff > 0 ? '+' : '') + totalDiff,
          totalRate,
          totalRateNum,
          prevTh,
          growthRate,
          growthRateNum,
          isPass
        };
      });
    }

    return processedRows.filter(row => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        row.customerGroup.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.spdvGroup.toLowerCase().includes(q) ||
        row.spdvName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (statusFilter === 'pass') return row.isPass === true;
      if (statusFilter === 'fail') return row.isPass === false;
      return true;
    });
  }, [
    isMatrixBranch, activeBranchId, selectedYear, selectedMonth, selectedQuarter, selectedCumulativeMonth,
    searchQuery, statusFilter, activeChartKey, chartTitle,
    prevMonthNum, nextMonthNum, prevQuarterName, nextQuarterName, hasEstimate
  ]);

  // Totals for Matrix branches (Month, Quarter, Year, Trend) matching screenshot structure
  const matrixTotals = useMemo(() => {
    const targetRows = filteredMatrixRows;

    if (isTrendBranch) {
      const calcTrendGroup = (rows) => {
        const monthly = {};
        let totalKh = 0;
        let totalTh = 0;
        let relevantKh = 0;
        const isCurrent2026 = selectedYear === '2026';

        for (let m = 1; m <= 12; m++) {
          const sumKh = rows.reduce((acc, r) => acc + (r.monthly?.[m]?.kh || 0), 0);
          const hasTh = rows.some(r => r.monthly?.[m]?.th !== null && r.monthly?.[m]?.th !== undefined);
          const sumTh = hasTh ? rows.reduce((acc, r) => acc + (r.monthly?.[m]?.th || 0), 0) : null;
          monthly[m] = {
            kh: sumKh,
            th: sumTh
          };
          totalKh += sumKh;
          if (sumTh !== null) {
            totalTh += sumTh;
            relevantKh += sumKh;
          }
        }

        const compKh = isCurrent2026 ? relevantKh : totalKh;
        const totalDiff = totalTh - compKh;
        const totalRateNum = compKh > 0 ? Number(((totalTh / compKh) * 100).toFixed(1)) : 100;
        const totalRate = `${totalRateNum.toFixed(1).replace('.', ',')}%`;

        const totalPrevTh = rows.reduce((acc, r) => acc + (r.prevTh || 0), 0);
        const growthRateNum = totalPrevTh > 0 ? Number((((totalTh - totalPrevTh) / totalPrevTh) * 100).toFixed(1)) : 0;
        const growthRate = `${growthRateNum >= 0 ? '+' : ''}${growthRateNum.toFixed(1).replace('.', ',')}%`;

        return {
          monthly,
          totalKh,
          totalTh,
          totalDiff,
          totalDiffFormatted: (totalDiff > 0 ? '+' : '') + totalDiff,
          totalRate,
          totalRateNum,
          prevTh: totalPrevTh,
          growthRate,
          growthRateNum,
          isPass: totalDiff >= 0 || totalRateNum >= 100
        };
      };

      const externalRows = targetRows.filter(r => r.type === 'external');
      const internalRows = targetRows.filter(r => r.type === 'internal');
      const internationalRows = targetRows.filter(r => r.isInternational || r.customerGroup?.includes('nước ngoài'));

      return {
        external: calcTrendGroup(externalRows),
        internal: calcTrendGroup(internalRows),
        international: calcTrendGroup(internationalRows),
        total: calcTrendGroup(targetRows)
      };
    }

    const calcGroup = (rows) => {
      const sumTarget = rows.reduce((acc, r) => acc + (r.targetVal !== undefined ? r.targetVal : (r.kh || 0)), 0);
      const sumUocTh = rows.reduce((acc, r) => acc + (r.uocTh || Math.round(((r.targetVal || r.kh || 0) + (r.th || 0)) / 2)), 0);
      const sumTh = rows.reduce((acc, r) => acc + (r.th || 0), 0);
      const valueToCompare = hasEstimate ? sumUocTh : sumTh;
      const diff = valueToCompare - sumTarget;
      const rateNum = sumTarget > 0 ? Number(((valueToCompare / sumTarget) * 100).toFixed(1)) : 100;
      const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
      return {
        kh: sumTarget,
        targetVal: sumTarget,
        uocTh: sumUocTh,
        th: sumTh,
        diff,
        diffFormatted: (diff > 0 ? '+' : '') + diff,
        rate,
        rateNum,
        isPass: diff >= 0 || rateNum >= 100
      };
    };

    const externalRows = targetRows.filter(r => r.type === 'external');
    const internalRows = targetRows.filter(r => r.type === 'internal');
    const internationalRows = targetRows.filter(r => r.isInternational || r.customerGroup?.includes('nước ngoài'));

    return {
      external: calcGroup(externalRows),
      internal: calcGroup(internalRows),
      international: calcGroup(internationalRows),
      total: calcGroup(targetRows)
    };
  }, [filteredMatrixRows, hasEstimate, isTrendBranch, selectedYear]);

  // Filtered rows by search and status for non-matrix branches
  const filteredRows = useMemo(() => {
    return tableData.rows.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (statusFilter === 'pass') return row.isPass === true;
      if (statusFilter === 'fail') return row.isPass === false;
      return true;
    });
  }, [tableData.rows, searchQuery, statusFilter]);

  // Pagination logic matching Báo cáo kết quả doanh thu
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when branch, chart, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeBranchId, activeChartKey, selectedMonth, selectedYear, selectedQuarter, searchQuery, statusFilter]);

  const totalRecords = isMatrixBranch ? filteredMatrixRows.length : filteredRows.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;

  const paginatedMatrixRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMatrixRows.slice(start, start + itemsPerPage);
  }, [filteredMatrixRows, currentPage, itemsPerPage]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage, itemsPerPage]);

  // Compute table totals for non-matrix branches
  const totals = useMemo(() => {
    let sumKh = 0;
    let sumTh = 0;
    let validCount = 0;

    tableData.rows.forEach(r => {
      const numTh = typeof r.th === 'number' ? r.th : parseFloat(r.th);
      const numKh = typeof r.kh === 'number' ? r.kh : parseFloat(r.kh);
      if (!isNaN(numTh)) sumTh += numTh;
      if (!isNaN(numKh)) sumKh += numKh;
      if (!isNaN(numTh) && !isNaN(numKh)) validCount++;
    });

    const diffVal = Number((sumTh - sumKh).toFixed(1));
    const avgRate = sumKh > 0 ? Math.round((sumTh / sumKh) * 100) : 100;

    return {
      sumTh: Number(sumTh.toFixed(1)),
      sumKh: Number(sumKh.toFixed(1)),
      diffVal,
      diffFormatted: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
      avgRate: `${avgRate}%`,
      rateNum: avgRate,
      isPass: avgRate >= 100
    };
  }, [tableData.rows]);

  // Unified KPI tiles totals depending on active branch
  const activeTotals = useMemo(() => {
    if (isMatrixBranch) {
      if (isTrendBranch && matrixTotals?.total?.monthly) {
        return {
          sumTh: matrixTotals.total.totalTh,
          sumKh: matrixTotals.total.totalKh,
          diffVal: matrixTotals.total.totalDiff,
          diffFormatted: matrixTotals.total.totalDiffFormatted,
          avgRate: matrixTotals.total.totalRate,
          rateNum: matrixTotals.total.totalRateNum,
          isPass: matrixTotals.total.isPass
        };
      }
      return {
        sumTh: matrixTotals.total.th,
        sumKh: matrixTotals.total.kh,
        diffVal: matrixTotals.total.diff,
        diffFormatted: matrixTotals.total.diffFormatted,
        avgRate: matrixTotals.total.rate,
        rateNum: matrixTotals.total.rateNum,
        isPass: matrixTotals.total.isPass
      };
    }
    return totals;
  }, [isMatrixBranch, isTrendBranch, matrixTotals, totals]);

  // Export table directly to Excel (.xlsx)
  const handleExportTableExcel = () => {
    try {
      if (isMatrixBranch) {
        if (isTrendBranch) {
          const exportRows = filteredMatrixRows.map(r => {
            const rowObj = {
              'Nhóm khách hàng': r.customerGroup,
              'Tên khách hàng': r.customerName,
              'Nhóm SPDV': r.spdvGroup,
              'Tên SPDV': r.spdvName
            };
            for (let m = 1; m <= 12; m++) {
              rowObj[`T${m} - KH`] = r.monthly?.[m]?.kh ?? 0;
              rowObj[`T${m} - TH`] = (r.monthly?.[m]?.th !== null && r.monthly?.[m]?.th !== undefined)
                ? r.monthly[m].th
                : '';
            }
            rowObj['Tổng KH'] = r.totalKh;
            rowObj['Tổng TH'] = r.totalTh;
            rowObj['+/- Chênh lệch'] = r.totalDiffFormatted;
            rowObj['% HTKH'] = r.totalRate;
            rowObj['Tỷ lệ tăng trưởng'] = r.growthRate;
            return rowObj;
          });

          const buildTrendSummaryExport = (title, data) => {
            const summaryObj = {
              'Nhóm khách hàng': title,
              'Tên khách hàng': '',
              'Nhóm SPDV': '',
              'Tên SPDV': ''
            };
            for (let m = 1; m <= 12; m++) {
              summaryObj[`T${m} - KH`] = data.monthly?.[m]?.kh ?? 0;
              summaryObj[`T${m} - TH`] = (data.monthly?.[m]?.th !== null && data.monthly?.[m]?.th !== undefined)
                ? data.monthly[m].th
                : '';
            }
            summaryObj['Tổng KH'] = data.totalKh;
            summaryObj['Tổng TH'] = data.totalTh;
            summaryObj['+/- Chênh lệch'] = data.totalDiffFormatted;
            summaryObj['% HTKH'] = data.totalRate;
            summaryObj['Tỷ lệ tăng trưởng'] = data.growthRate;
            return summaryObj;
          };

          exportRows.push(buildTrendSummaryExport('Tổng doanh thu ngoài Tập đoàn', matrixTotals.external));
          exportRows.push(buildTrendSummaryExport('Tổng doanh thu nội bộ', matrixTotals.internal));
          exportRows.push(buildTrendSummaryExport('Tổng doanh thu quốc tế', matrixTotals.international));
          exportRows.push(buildTrendSummaryExport('Tổng doanh thu', matrixTotals.total));

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Xu_Huong_Doanh_Thu');
          const cleanFileName = `Bao_cao_xu_huong_doanh_thu_${selectedYear}.xlsx`;
          XLSX.writeFile(wb, cleanFileName);
          return;
        }

        const exportRows = filteredMatrixRows.map(r => {
          const rowObj = {
            'Nhóm khách hàng': r.customerGroup,
            'Tên khách hàng': r.customerName,
            'Nhóm SPDV': r.spdvGroup,
            'Tên SPDV': r.spdvName,
            'KH': r.targetVal !== undefined ? r.targetVal : r.kh
          };
          if (hasEstimate) {
            rowObj['Ước TH'] = r.uocTh;
          }
          rowObj['TH'] = r.th;
          rowObj['+/- so với KH'] = r.diffFormatted;
          rowObj['% HTKH'] = r.rate;
          return rowObj;
        });

        // Summary rows matching screenshot
        const buildSummaryExport = (title, data) => {
          const summaryObj = {
            'Nhóm khách hàng': title,
            'Tên khách hàng': '',
            'Nhóm SPDV': '',
            'Tên SPDV': '',
            'KH': data.kh
          };
          if (hasEstimate) {
            summaryObj['Ước TH'] = data.uocTh;
          }
          summaryObj['TH'] = data.th;
          summaryObj['+/- so với KH'] = data.diffFormatted;
          summaryObj['% HTKH'] = data.rate;
          return summaryObj;
        };

        exportRows.push(buildSummaryExport('Tổng doanh thu ngoài Tập đoàn', matrixTotals.external));
        exportRows.push(buildSummaryExport('Tổng doanh thu nội bộ', matrixTotals.internal));
        exportRows.push(buildSummaryExport('Tổng doanh thu quốc tế', matrixTotals.international));
        exportRows.push(buildSummaryExport('Tổng doanh thu', matrixTotals.total));

        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Thuc_Hien_So_Voi_KH');
        const periodClean = activeBranchId === 'quarter' ? selectedQuarter : (activeBranchId === 'year' ? selectedCumulativeMonth : selectedMonth);
        const cleanFileName = `Bao_cao_chi_tiet_${periodClean}_${selectedYear}.xlsx`;
        XLSX.writeFile(wb, cleanFileName);
        return;
      }

      const exportRows = filteredRows.map((r) => ({
        'STT': r.stt,
        'Chỉ tiêu / Đối tượng': r.name,
        'Đơn vị tính': r.unit,
        'Kế hoạch (KH)': r.kh,
        'Thực hiện (TH)': r.th,
        'Chênh lệch (+/-)': r.diff,
        'Tỷ lệ hoàn thành': r.rate,
        'Tỷ trọng': r.share,
        'Đánh giá': r.isPass ? 'Đạt / Tốt' : 'Chưa đạt'
      }));

      // Add summary row
      exportRows.push({
        'STT': 'TỔNG',
        'Chỉ tiêu / Đối tượng': 'TỔNG CỘNG',
        'Đơn vị tính': tableData.defaultUnit,
        'Kế hoạch (KH)': totals.sumKh,
        'Thực hiện (TH)': totals.sumTh,
        'Chênh lệch (+/-)': totals.diffFormatted,
        'Tỷ lệ hoàn thành': totals.avgRate,
        'Tỷ trọng': '100%',
        'Đánh giá': totals.isPass ? 'Đạt KH chung' : 'Chưa đạt KH'
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bang_Chi_Tiet');

      const cleanFileName = `Bang_chi_tiet_${chartTitle.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_').substring(0, 40)}.xlsx`;
      XLSX.writeFile(wb, cleanFileName);
    } catch (err) {
      console.error('Error exporting table to excel:', err);
      alert('Có lỗi khi xuất file Excel. Vui lòng thử lại!');
    }
  };

  return (
    <div className="revenue-chart-detail-view-page">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & CONTROLS BAR (Hidden in Matrix branches: Month, Quarter, Year) */}
      {/* ========================================================================= */}
      {!isMatrixBranch && (
        <div className="chart-detail-nav-bar">
          <div className="chart-detail-nav-left">
            <button
              type="button"
              className="chart-detail-back-btn"
              onClick={onBack}
              title="Quay lại giao diện biểu đồ"
            >
              <ArrowLeft size={16} />
              <span>Quay lại nhóm biểu đồ</span>
            </button>

            <div className="chart-detail-breadcrumb">
              <span className="crumb-root">Báo cáo doanh thu</span>
              <span className="crumb-divider">/</span>
              <span className="crumb-active">{chartTitle}</span>
            </div>
          </div>

          <div className="chart-detail-nav-right">
            {/* Quick Chart Switcher Dropdown */}
            <div className="clean-filter-item">
              <span className="clean-filter-label">Chọn biểu đồ</span>
              <div className="clean-select-wrapper" style={{ minWidth: '260px' }}>
                <select
                  className="clean-filter-select"
                  value={activeChartKey}
                  onChange={(e) => setActiveChartKey(e.target.value)}
                >
                  {chartOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>

            {/* Time Filters */}
            <div className="clean-filter-item">
              <span className="clean-filter-label">Năm</span>
              <div className="clean-select-wrapper">
                <select
                  className="clean-filter-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear && setSelectedYear(e.target.value)}
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>

            {(activeBranchId === 'spdv' || activeBranchId === 'unit') && (
              <div className="clean-filter-item">
                <span className="clean-filter-label">Tháng</span>
                <div className="clean-select-wrapper">
                  <select
                    className="clean-filter-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth && setSelectedMonth(e.target.value)}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="clean-select-chevron" />
                </div>
              </div>
            )}

            {activeBranchId === 'quarter' && (
              <div className="clean-filter-item">
                <span className="clean-filter-label">Quý</span>
                <div className="clean-select-wrapper">
                  <select
                    className="clean-filter-select"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter && setSelectedQuarter(e.target.value)}
                  >
                    {QUARTER_OPTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="clean-select-chevron" />
                </div>
              </div>
            )}

            {/* Export Excel Button */}
            <button
              type="button"
              className="chart-detail-export-btn"
              onClick={handleExportTableExcel}
              title="Xuất bảng dữ liệu chi tiết ra file Excel"
            >
              <Download size={15} />
              <span>Xuất Excel bảng này</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLE CONTROLS & MAIN DATA TABLE (ONLY TABLE REMAINS IN MATRIX VIEW)  */}
      {/* ========================================================================= */}
      <div className="chart-detail-table-card">
        {!isMatrixBranch && (
          <div className="chart-detail-table-header">
            <div className="table-header-title-box">
              <TableProperties size={18} color="#e11d48" />
              <h3 className="table-header-title">
                Bảng dữ liệu chi tiết số liệu: <span>{chartTitle}</span>
              </h3>
              <span className="table-row-count-badge">
                {isMatrixBranch ? filteredMatrixRows.length : filteredRows.length} dòng
              </span>
            </div>

            <div className="table-header-actions">
              {/* Search Input */}
              <div className="table-search-box">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chỉ tiêu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="table-search-input"
                />
              </div>

              {/* Filter Buttons */}
              <div className="table-filter-group">
                <button
                  type="button"
                  className={`filter-chip-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Tất cả ({isMatrixBranch ? filteredMatrixRows.length : tableData.rows.length})
                </button>
                <button
                  type="button"
                  className={`filter-chip-btn ${statusFilter === 'pass' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('pass')}
                >
                  Đạt ≥ 100%
                </button>
                <button
                  type="button"
                  className={`filter-chip-btn ${statusFilter === 'fail' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('fail')}
                >
                  Chưa đạt &lt; 100%
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. MAIN DATA TABLE                                                        */}
        {/* ========================================================================= */}
        <div className="chart-detail-table-wrapper">
          {isMatrixBranch ? (
            isTrendBranch ? (
              /* ======================================================================= */
              /* MATRIX TABLE: 12 MONTHS TREND (KH & TH PER MONTH)                      */
              /* ======================================================================= */
              <table className="chart-detail-month-table chart-detail-trend-table">
                <thead>
                  <tr>
                    <th rowSpan={2} className="th-customer-group">Nhóm khách hàng</th>
                    <th rowSpan={2} className="th-customer-name">Tên khách hàng</th>
                    <th rowSpan={2} className="th-spdv-group">Nhóm SPDV</th>
                    <th rowSpan={2} className="th-spdv-name">Tên SPDV</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <th key={`th-m-${m}`} colSpan={2} className="th-trend-month-header">
                        Tháng {m}
                      </th>
                    ))}
                    <th colSpan={5} className="th-trend-total-header">
                      Cả năm {selectedYear}
                    </th>
                  </tr>
                  <tr className="th-sub-row">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <React.Fragment key={`sub-m-${m}`}>
                        <th className="th-sub-kh">KH</th>
                        <th className="th-sub-th">TH</th>
                      </React.Fragment>
                    ))}
                    <th className="th-sub-kh">Tổng KH</th>
                    <th className="th-sub-th">Tổng TH</th>
                    <th className="th-sub-diff">+/-</th>
                    <th className="th-sub-rate">% HT</th>
                    <th className="th-sub-growth">Tỷ lệ tăng trưởng</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMatrixRows.length > 0 ? (
                    paginatedMatrixRows.map((row) => (
                      <tr key={row.id} className="month-data-row">
                        <td className="td-customer-group">{row.customerGroup}</td>
                        <td className="td-customer-name font-semibold">{row.customerName}</td>
                        <td className="td-spdv-group">{row.spdvGroup}</td>
                        <td className="td-spdv-name">{row.spdvName}</td>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                          <React.Fragment key={`td-m-${m}`}>
                            <td className="td-kh text-right">{row.monthly?.[m]?.kh ?? 0}</td>
                            <td className="td-th text-right font-medium">
                              {row.monthly?.[m]?.th !== null && row.monthly?.[m]?.th !== undefined
                                ? row.monthly[m].th
                                : <span className="text-muted">—</span>}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className="td-kh text-right font-semibold">{row.totalKh}</td>
                        <td className="td-th text-right font-bold">{row.totalTh}</td>
                        <td className={`td-diff text-right font-medium ${row.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                          {row.totalDiffFormatted}
                        </td>
                        <td className={`td-rate text-right font-bold ${row.isPass ? 'text-green' : 'text-red'}`}>
                          {row.totalRate}
                        </td>
                        <td className={`td-growth text-right font-bold ${row.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                          {row.growthRate}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={33} className="table-empty-row">
                        Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {/* Summary Row 1: Tổng doanh thu ngoài Tập đoàn */}
                  <tr className="month-summary-row row-external">
                    <td colSpan={4} className="summary-title-cell font-bold">
                      Tổng doanh thu ngoài Tập đoàn
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <React.Fragment key={`ext-m-${m}`}>
                        <td className="td-kh text-right font-bold">{matrixTotals.external.monthly?.[m]?.kh ?? 0}</td>
                        <td className="td-th text-right font-bold">
                          {matrixTotals.external.monthly?.[m]?.th !== null && matrixTotals.external.monthly?.[m]?.th !== undefined
                            ? matrixTotals.external.monthly[m].th
                            : <span className="text-muted">—</span>}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="td-kh text-right font-bold">{matrixTotals.external.totalKh}</td>
                    <td className="td-th text-right font-bold">{matrixTotals.external.totalTh}</td>
                    <td className={`td-diff text-right font-bold ${matrixTotals.external.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.external.totalDiffFormatted}
                    </td>
                    <td className={`td-rate text-right font-bold ${matrixTotals.external.isPass ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.external.totalRate}
                    </td>
                    <td className={`td-growth text-right font-bold ${matrixTotals.external.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.external.growthRate}
                    </td>
                  </tr>

                  {/* Summary Row 2: Tổng doanh thu nội bộ */}
                  <tr className="month-summary-row row-internal">
                    <td colSpan={4} className="summary-title-cell font-bold">
                      Tổng doanh thu nội bộ
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <React.Fragment key={`int-m-${m}`}>
                        <td className="td-kh text-right font-bold">{matrixTotals.internal.monthly?.[m]?.kh ?? 0}</td>
                        <td className="td-th text-right font-bold">
                          {matrixTotals.internal.monthly?.[m]?.th !== null && matrixTotals.internal.monthly?.[m]?.th !== undefined
                            ? matrixTotals.internal.monthly[m].th
                            : <span className="text-muted">—</span>}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="td-kh text-right font-bold">{matrixTotals.internal.totalKh}</td>
                    <td className="td-th text-right font-bold">{matrixTotals.internal.totalTh}</td>
                    <td className={`td-diff text-right font-bold ${matrixTotals.internal.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.internal.totalDiffFormatted}
                    </td>
                    <td className={`td-rate text-right font-bold ${matrixTotals.internal.isPass ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.internal.totalRate}
                    </td>
                    <td className={`td-growth text-right font-bold ${matrixTotals.internal.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.internal.growthRate}
                    </td>
                  </tr>

                  {/* Summary Row 3: Tổng doanh thu quốc tế */}
                  <tr className="month-summary-row row-international">
                    <td colSpan={4} className="summary-title-cell font-bold">
                      Tổng doanh thu quốc tế
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <React.Fragment key={`inter-m-${m}`}>
                        <td className="td-kh text-right font-bold">{matrixTotals.international.monthly?.[m]?.kh ?? 0}</td>
                        <td className="td-th text-right font-bold">
                          {matrixTotals.international.monthly?.[m]?.th !== null && matrixTotals.international.monthly?.[m]?.th !== undefined
                            ? matrixTotals.international.monthly[m].th
                            : <span className="text-muted">—</span>}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="td-kh text-right font-bold">{matrixTotals.international.totalKh}</td>
                    <td className="td-th text-right font-bold">{matrixTotals.international.totalTh}</td>
                    <td className={`td-diff text-right font-bold ${matrixTotals.international.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.international.totalDiffFormatted}
                    </td>
                    <td className={`td-rate text-right font-bold ${matrixTotals.international.isPass ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.international.totalRate}
                    </td>
                    <td className={`td-growth text-right font-bold ${matrixTotals.international.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.international.growthRate}
                    </td>
                  </tr>

                  {/* Summary Row 4: Tổng doanh thu (Highlight blue background) */}
                  <tr className="month-summary-row row-grand-total">
                    <td colSpan={4} className="summary-title-cell font-extrabold">
                      Tổng doanh thu
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <React.Fragment key={`tot-m-${m}`}>
                        <td className="td-kh text-right font-extrabold">{matrixTotals.total.monthly?.[m]?.kh ?? 0}</td>
                        <td className="td-th text-right font-extrabold">
                          {matrixTotals.total.monthly?.[m]?.th !== null && matrixTotals.total.monthly?.[m]?.th !== undefined
                            ? matrixTotals.total.monthly[m].th
                            : <span className="text-muted">—</span>}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="td-kh text-right font-extrabold">{matrixTotals.total.totalKh}</td>
                    <td className="td-th text-right font-extrabold">{matrixTotals.total.totalTh}</td>
                    <td className={`td-diff text-right font-extrabold ${matrixTotals.total.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.total.totalDiffFormatted}
                    </td>
                    <td className={`td-rate text-right font-extrabold ${matrixTotals.total.isPass ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.total.totalRate}
                    </td>
                    <td className={`td-growth text-right font-extrabold ${matrixTotals.total.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                      {matrixTotals.total.growthRate}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              /* ======================================================================= */
              /* MATRIX TABLE: CUSTOMER & SPDV (MONTH, QUARTER, YEAR)                    */
              /* ======================================================================= */
              <table className="chart-detail-month-table">
              <thead>
                <tr>
                  <th rowSpan={3} className="th-customer-group">Nhóm khách hàng</th>
                  <th rowSpan={3} className="th-customer-name">Tên khách hàng</th>
                  <th rowSpan={3} className="th-spdv-group">Nhóm SPDV</th>
                  <th rowSpan={3} className="th-spdv-name">Tên SPDV</th>
                  <th colSpan={hasEstimate ? 5 : 4} className="th-month-group">{periodHeaderTitle}</th>
                </tr>
                <tr>
                  <th colSpan={hasEstimate ? 5 : 4} className="th-plan-group">{comparisonGroupTitle}</th>
                </tr>
                <tr className="th-sub-row">
                  <th className="th-sub-kh">{targetColumnLabel}</th>
                  {hasEstimate && (
                    <th className="th-sub-uoc">
                      <span className="th-sub-uoc-line">Ước</span>
                      <span className="th-sub-uoc-line">TH</span>
                    </th>
                  )}
                  <th className="th-sub-th">TH</th>
                  <th className="th-sub-diff">
                    <span className="th-sub-line">+/-</span>
                    <span className="th-sub-line">so</span>
                    <span className="th-sub-line">{diffColumnLabel}</span>
                  </th>
                  <th className="th-sub-rate">
                    <span className="th-sub-line">%</span>
                    <span className="th-sub-line">{rateSubLabel}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMatrixRows.length > 0 ? (
                  paginatedMatrixRows.map((row) => (
                    <tr key={row.id} className="month-data-row">
                      <td className="td-customer-group">{row.customerGroup}</td>
                      <td className="td-customer-name font-semibold">{row.customerName}</td>
                      <td className="td-spdv-group">{row.spdvGroup}</td>
                      <td className="td-spdv-name">{row.spdvName}</td>
                      <td className="td-kh text-right">{row.targetVal !== undefined ? row.targetVal : row.kh}</td>
                      {hasEstimate && (
                        <td className="td-uoc-th text-right font-medium text-orange">
                          {row.uocTh !== undefined ? row.uocTh : Math.round(((row.targetVal || row.kh || 0) + (row.th || 0)) / 2)}
                        </td>
                      )}
                      <td className="td-th text-right font-medium">{row.th}</td>
                      <td className={`td-diff text-right font-medium ${row.diff >= 0 ? 'text-green' : 'text-red'}`}>
                        {row.diffFormatted}
                      </td>
                      <td className={`td-rate text-right font-bold ${row.isPass ? 'text-green' : 'text-red'}`}>
                        {row.rate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={hasEstimate ? 9 : 8} className="table-empty-row">
                      Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {/* Summary Row 1: Tổng doanh thu ngoài Tập đoàn */}
                <tr className="month-summary-row row-external">
                  <td colSpan={4} className="summary-title-cell font-bold">
                    Tổng doanh thu ngoài Tập đoàn
                  </td>
                  <td className="td-kh text-right font-bold">{matrixTotals.external.kh}</td>
                  {hasEstimate && (
                    <td className="td-uoc-th text-right font-bold text-orange">{matrixTotals.external.uocTh}</td>
                  )}
                  <td className="td-th text-right font-bold">{matrixTotals.external.th}</td>
                  <td className={`td-diff text-right font-bold ${matrixTotals.external.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.external.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${matrixTotals.external.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.external.rate}
                  </td>
                </tr>

                {/* Summary Row 2: Tổng doanh thu nội bộ */}
                <tr className="month-summary-row row-internal">
                  <td colSpan={4} className="summary-title-cell font-bold">
                    Tổng doanh thu nội bộ
                  </td>
                  <td className="td-kh text-right font-bold">{matrixTotals.internal.kh}</td>
                  {hasEstimate && (
                    <td className="td-uoc-th text-right font-bold text-orange">{matrixTotals.internal.uocTh}</td>
                  )}
                  <td className="td-th text-right font-bold">{matrixTotals.internal.th}</td>
                  <td className={`td-diff text-right font-bold ${matrixTotals.internal.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.internal.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${matrixTotals.internal.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.internal.rate}
                  </td>
                </tr>

                {/* Summary Row 3: Tổng doanh thu quốc tế */}
                <tr className="month-summary-row row-international">
                  <td colSpan={4} className="summary-title-cell font-bold">
                    Tổng doanh thu quốc tế
                  </td>
                  <td className="td-kh text-right font-bold">{matrixTotals.international.kh}</td>
                  {hasEstimate && (
                    <td className="td-uoc-th text-right font-bold text-orange">{matrixTotals.international.uocTh}</td>
                  )}
                  <td className="td-th text-right font-bold">{matrixTotals.international.th}</td>
                  <td className={`td-diff text-right font-bold ${matrixTotals.international.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.international.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${matrixTotals.international.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.international.rate}
                  </td>
                </tr>

                {/* Summary Row 4: Tổng doanh thu (Highlight blue background) */}
                <tr className="month-summary-row row-grand-total">
                  <td colSpan={4} className="summary-title-cell font-extrabold">
                    Tổng doanh thu
                  </td>
                  <td className="td-kh text-right font-extrabold">{matrixTotals.total.kh}</td>
                  {hasEstimate && (
                    <td className="td-uoc-th text-right font-extrabold text-orange">{matrixTotals.total.uocTh}</td>
                  )}
                  <td className="td-th text-right font-extrabold">{matrixTotals.total.th}</td>
                  <td className={`td-diff text-right font-extrabold ${matrixTotals.total.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.total.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-extrabold ${matrixTotals.total.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.total.rate}
                  </td>
                </tr>
              </tfoot>
            </table>
          )
        ) : (
            <table className="chart-detail-erp-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ textAlign: 'left', minWidth: '220px' }}>Chỉ tiêu / Đối tượng</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Đơn vị</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Kế hoạch (KH)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Thực hiện (TH)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Chênh lệch (+/-)</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>% Hoàn thành</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Tỷ trọng</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row) => (
                    <tr key={`detail-row-${row.stt}`}>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                        {row.stt}
                      </td>
                      <td style={{ textAlign: 'left', fontWeight: '700', color: '#0f172a' }}>
                        {row.name}
                      </td>
                      <td style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                        {row.unit}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#475569' }}>
                        {typeof row.kh === 'number' ? row.kh.toLocaleString('vi-VN') : row.kh}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#e11d48' }}>
                        {typeof row.th === 'number' ? row.th.toLocaleString('vi-VN') : row.th}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: '700',
                          color: row.diffNum >= 0 ? '#15803d' : '#dc2626'
                        }}
                      >
                        {row.diff}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="rate-progress-cell">
                          <span className={`rate-badge-pill ${row.isPass ? 'rate-pass' : 'rate-fail'}`}>
                            {row.rate}
                          </span>
                          {row.rateNum > 0 && (
                            <div className="rate-mini-bar-track">
                              <div
                                className={`rate-mini-bar-fill ${row.isPass ? 'fill-green' : 'fill-red'}`}
                                style={{ width: `${Math.min(row.rateNum, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                        {row.share}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`eval-status-pill ${row.isPass ? 'eval-pass' : 'eval-fail'}`}>
                          {row.isPass ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Đạt</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} />
                              <span>Chưa đạt</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="table-empty-row">
                      Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="chart-detail-table-footer">
                  <td colSpan={3} style={{ textAlign: 'left', fontWeight: '800', paddingLeft: '24px' }}>
                    TỔNG CỘNG
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: '#334155' }}>
                    {totals.sumKh.toLocaleString('vi-VN')}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '900', color: '#e11d48' }}>
                    {totals.sumTh.toLocaleString('vi-VN')}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: '800',
                      color: totals.diffVal >= 0 ? '#15803d' : '#dc2626'
                    }}
                  >
                    {totals.diffFormatted}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`rate-badge-pill large ${totals.avgRate >= 100 ? 'rate-pass' : 'rate-fail'}`}>
                      {totals.avgRate}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '800', color: '#0f172a' }}>
                    100%
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`eval-status-pill ${totals.isPass ? 'eval-pass' : 'eval-fail'}`}>
                      {totals.isPass ? 'Đạt KH' : 'Chưa đạt'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Pagination Bar - Styled identical to Báo cáo kết quả doanh thu */}
        <div className="table-footer">
          <div>
            Hiển thị {totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalRecords)} trong số {totalRecords} bản ghi
          </div>
          <div className="pagination-controls">
            <span className="pagination-info">
              {currentPage}/{totalPages}
            </span>
            <div className="pagination-buttons">
              <button 
                type="button"
                className="btn-paginate" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                title="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                <button 
                  key={`page-${page}`}
                  type="button"
                  className={`btn-paginate ${currentPage === page ? 'active-btn' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                type="button"
                className="btn-paginate" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                title="Trang sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ACTIONS (Hidden in Matrix branches)                             */}
      {/* ========================================================================= */}
      {!isMatrixBranch && (
        <div className="chart-detail-bottom-bar">
          <button
            type="button"
            className="chart-detail-back-btn large"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Quay lại nhóm biểu đồ</span>
          </button>

          <button
            type="button"
            className="chart-detail-export-btn large"
            onClick={handleExportTableExcel}
          >
            <Download size={16} />
            <span>Tải bảng dữ liệu chi tiết (.xlsx)</span>
          </button>
        </div>
      )}
    </div>
  );
}
