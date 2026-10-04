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

import { MONTH_TREND_DATA, MONTH_PLAN_TREND_DATA } from '../data/revenueTrendData';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA, SPDV_BAR_COMPARISON_DATA, SPDV_STRUCTURE_TABLE_DATA, getSpdvBarComparisonData, getSpdvYoyComparisonData, getSpdvPrevPeriodComparisonData } from '../data/revenueSpdvData';
import SpdvDetailTable from './SpdvDetailTable';
import {
  UNIT_CATEGORIES,
  UNIT_STRUCTURE_DATA,
  UNIT_STRUCTURE_TABLE_DATA,
  UNIT_PLAN_COMPARISON_DATA,
  UNIT_PREV_PERIOD_COMPARISON_DATA
} from '../data/revenueUnitData';
import UnitDetailTable from './UnitDetailTable';
import PlanProgressDetailTable from './PlanProgressDetailTable';
import MonthRatioDetailTable from './MonthRatioDetailTable';
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
    { id: 'chart5_cum_val', label: 'Biểu đồ 5: Lũy kế so với KH Quý (Giá trị)' },
    { id: 'chart5_rat', label: 'Biểu đồ 5b: Tỷ suất / tỷ trọng lũy kế so với KH Quý' },
    { id: 'chart6_val', label: 'Biểu đồ 6: Ước kết quả so với KH Quý (Giá trị)' },
    { id: 'chart6_rat', label: 'Biểu đồ 6b: Tỷ suất / tỷ trọng ước kết quả so với KH Quý' },
    { id: 'chart7_val', label: 'Biểu đồ 7: Ước kết quả so với Quý trước (Giá trị)' },
    { id: 'chart7_rat', label: 'Biểu đồ 7b: Tỷ suất / tỷ trọng ước kết quả so với Quý trước' },
    { id: 'chart8_val', label: 'Biểu đồ 8: Ước kết quả so với Quý cùng kỳ năm trước (Giá trị)' },
    { id: 'chart8_rat', label: 'Biểu đồ 8b: Tỷ suất / tỷ trọng ước kết quả so với Quý cùng kỳ năm trước' },
    { id: 'chart9_val', label: 'Biểu đồ 9: Ước kết quả so với KH Quý tiếp theo (Giá trị)' },
    { id: 'chart9_rat', label: 'Biểu đồ 9b: Tỷ suất / tỷ trọng ước kết quả so với KH Quý tiếp theo' }
  ],
  year: [
    { id: 'chart10_val', label: 'Biểu đồ 10: Lũy kế so với KH lũy kế (Giá trị)' },
    { id: 'chart10_rat', label: 'Biểu đồ 10b: Tỷ suất / tỷ trọng lũy kế so với KH lũy kế' },
    { id: 'chart11_val', label: 'Biểu đồ 11: Lũy kế so với KH cả năm (Giá trị)' },
    { id: 'chart11_rat', label: 'Biểu đồ 11b: Tỷ suất / tỷ trọng lũy kế so với KH cả năm' },
    { id: 'chart12_val', label: 'Biểu đồ 12: Ước kết quả so với KH (Giá trị)' },
    { id: 'chart12_rat', label: 'Biểu đồ 12b: Tỷ suất / tỷ trọng ước kết quả so với KH' },
    { id: 'chart13_val', label: 'Biểu đồ 13: Ước kết quả so với kết quả năm trước (Giá trị)' },
    { id: 'chart13_rat', label: 'Biểu đồ 13b: Tỷ suất / tỷ trọng ước kết quả so với kết quả năm trước' }
  ],
  trend: [
    { id: 'trend_prev_year', label: 'Biểu đồ 14: Xu hướng doanh thu theo từng tháng so với năm trước' },
    { id: 'trend_plan', label: 'Biểu đồ 15: Xu hướng doanh thu theo từng tháng so với kế hoạch' }
  ],
  spdv: [
    { id: 'spdv_th_month', label: 'Biểu đồ 16 (Tháng): Cơ cấu doanh thu thực hiện theo nhóm SPDV' },
    { id: 'spdv_kh_month', label: 'Biểu đồ 17 (Tháng): Cơ cấu doanh thu kế hoạch theo nhóm SPDV' },
    { id: 'spdv_th_quarter', label: 'Biểu đồ 16 (Quý): Cơ cấu doanh thu thực hiện theo nhóm SPDV' },
    { id: 'spdv_kh_quarter', label: 'Biểu đồ 17 (Quý): Cơ cấu doanh thu kế hoạch theo nhóm SPDV' },
    { id: 'spdv_th_year', label: 'Biểu đồ 16 (Năm): Cơ cấu doanh thu thực hiện theo nhóm SPDV' },
    { id: 'spdv_kh_year', label: 'Biểu đồ 17 (Năm): Cơ cấu doanh thu kế hoạch theo nhóm SPDV' },
    { id: 'spdv_bar_month', label: 'Biểu đồ 18 (Tháng): Thực hiện so với kế hoạch theo nhóm SPDV' },
    { id: 'spdv_bar_quarter', label: 'Biểu đồ 18 (Quý): Ước thực hiện so với kế hoạch theo nhóm SPDV' },
    { id: 'spdv_bar_year', label: 'Biểu đồ 18 (Năm): Ước thực hiện so với kế hoạch theo nhóm SPDV' },
    { id: 'spdv_yoy_month', label: 'Biểu đồ 19 (Tháng): Thực hiện so với cùng kỳ theo nhóm SPDV' },
    { id: 'spdv_yoy_quarter', label: 'Biểu đồ 19 (Quý): Ước thực hiện so với cùng kỳ theo nhóm SPDV' },
    { id: 'spdv_yoy_year', label: 'Biểu đồ 19 (Năm): Thực hiện lũy kế so với cùng kỳ theo nhóm SPDV' },
    { id: 'spdv_yoy_comparison', label: 'Biểu đồ 19: Tổng hợp so với cùng kỳ năm trước theo nhóm SPDV' },
    { id: 'spdv_prev_month', label: 'Biểu đồ 20 (Tháng): Thực hiện so với kỳ trước theo nhóm SPDV' },
    { id: 'spdv_prev_quarter', label: 'Biểu đồ 20 (Quý): Ước thực hiện so với kỳ trước theo nhóm SPDV' },
    { id: 'spdv_prev_year', label: 'Biểu đồ 20 (Năm): Ước thực hiện so với kỳ trước theo nhóm SPDV' },
    { id: 'spdv_prev_period', label: 'Biểu đồ 20: Tổng hợp so với kỳ trước theo nhóm SPDV' }
  ],
  unit: [
    { id: 'unit_struct_month', label: 'Biểu đồ 21 (Tháng): Cơ cấu doanh thu TH theo từng đơn vị' },
    { id: 'unit_struct_quarter', label: 'Biểu đồ 21 (Quý): Cơ cấu doanh thu TH theo từng đơn vị' },
    { id: 'unit_struct_year', label: 'Biểu đồ 21 (Năm): Cơ cấu doanh thu TH theo từng đơn vị' },
    { id: 'unit_plan_month', label: 'Biểu đồ 18 (Tháng): Thực hiện so với kế hoạch theo đơn vị' },
    { id: 'unit_plan_quarter', label: 'Biểu đồ 18 (Quý): Ước thực hiện so với kế hoạch theo đơn vị' },
    { id: 'unit_plan_year', label: 'Biểu đồ 18 (Năm): Ước thực hiện so với kế hoạch theo đơn vị' },
    { id: 'unit_prev_month', label: 'Biểu đồ 23 (Tháng): Thực hiện so với kỳ trước theo đơn vị' },
    { id: 'unit_prev_quarter', label: 'Biểu đồ 23 (Quý): Ước thực hiện so với kỳ trước theo đơn vị' },
    { id: 'unit_prev_year', label: 'Biểu đồ 23 (Năm): Ước thực hiện so với kỳ trước theo đơn vị' }
  ],
  plan_progress: [
    { id: 'in_ex_th_month', label: 'Cơ cấu doanh thu TH nội bộ và ngoài Tập đoàn – Tháng' },
    { id: 'in_ex_kh_month', label: 'Cơ cấu doanh thu KH nội bộ và ngoài Tập đoàn – Tháng' },
    { id: 'in_ex_th_quarter', label: 'Cơ cấu doanh thu TH nội bộ và ngoài Tập đoàn – Quý' },
    { id: 'in_ex_kh_quarter', label: 'Cơ cấu doanh thu KH nội bộ và ngoài Tập đoàn – Quý' },
    { id: 'in_ex_th_year', label: 'Cơ cấu doanh thu TH nội bộ và ngoài Tập đoàn – Năm' },
    { id: 'in_ex_kh_year', label: 'Cơ cấu doanh thu KH nội bộ và ngoài Tập đoàn – Năm' },
    { id: 'dom_intl_th_month', label: 'Cơ cấu doanh thu TH trong nước và quốc tế – Tháng' },
    { id: 'dom_intl_kh_month', label: 'Cơ cấu doanh thu KH trong nước và quốc tế – Tháng' },
    { id: 'dom_intl_th_quarter', label: 'Cơ cấu doanh thu TH trong nước và quốc tế – Quý' },
    { id: 'dom_intl_kh_quarter', label: 'Cơ cấu doanh thu KH trong nước và quốc tế – Quý' },
    { id: 'dom_intl_th_year', label: 'Cơ cấu doanh thu TH trong nước và quốc tế – Năm' },
    { id: 'dom_intl_kh_year', label: 'Cơ cấu doanh thu KH trong nước và quốc tế – Năm' },
    { id: 'chart29_30', label: 'Tỷ lệ hoàn thành KH tổng doanh thu (lũy kế Quý / Năm)' },
    { id: 'chart31_32', label: 'Tỷ lệ hoàn thành KH DT ngoài Tập đoàn (lũy kế Quý / Năm)' },
    { id: 'chart33_34', label: 'Tỷ lệ hoàn thành KH DT quốc tế (lũy kế Quý / Năm)' },
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

class TableErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('TableErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '36px 24px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #fee2e2', margin: '16px 0' }}>
          <div style={{ color: '#e11d48', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
            Không thể hiển thị bảng dữ liệu chi tiết
          </div>
          <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            {this.state.error?.message || 'Đã có lỗi xảy ra trong quá trình xử lý dữ liệu.'}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 20px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            Tải lại bảng
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RevenueChartDetailView({
  initialBranchId = 'month',
  initialChartKey = 'chart1_val',
  initialChartTitle = '',
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  selectedQuarter = 'Quý 3',
  setSelectedQuarter,
  selectedCumulativeMonth = '8 tháng',
  setSelectedCumulativeMonth,
  onBack
}) {
  const normalizeChartKey = (key) => {
    if (!key) return key;
    if (key === 'chart18_m') return 'spdv_bar_month';
    if (key === 'chart18_q') return 'spdv_bar_quarter';
    if (key === 'chart18_y') return 'spdv_bar_year';
    if (key === 'chart16') return 'spdv_th_month';
    if (key === 'chart17') return 'spdv_kh_month';
    return key;
  };

  const [activeBranchId, setActiveBranchId] = useState(initialBranchId);
  const [activeChartKey, setActiveChartKey] = useState(() => normalizeChartKey(initialChartKey));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pass' | 'fail'

  useEffect(() => {
    if (initialBranchId) setActiveBranchId(initialBranchId);
    if (initialChartKey) setActiveChartKey(normalizeChartKey(initialChartKey));
  }, [initialBranchId, initialChartKey]);

  const chartOptions = BRANCH_CHART_OPTIONS[activeBranchId] || BRANCH_CHART_OPTIONS.month;

  // Resolve current active chart label
  const currentChartObj = chartOptions.find(o => o.id === activeChartKey) || chartOptions[0];
  const chartTitle = (activeChartKey === initialChartKey && initialChartTitle) ? initialChartTitle : (currentChartObj?.label || 'Bảng dữ liệu chi tiết');

  // Branch category helper
  const isMonthRatioChart = activeBranchId === 'month' && (activeChartKey === 'chart1_rat' || activeChartKey === 'chart2_rat' || activeChartKey === 'chart3_rat' || activeChartKey === 'chart4_rat');
  const isQuarterRatioChart = activeBranchId === 'quarter' && (activeChartKey === 'chart5_rat' || activeChartKey === 'chart6_rat' || activeChartKey === 'chart7_rat' || activeChartKey === 'chart8_rat' || activeChartKey === 'chart9_rat');
  const isYearRatioChart = activeBranchId === 'year' && (activeChartKey === 'chart10_rat' || activeChartKey === 'chart11_rat' || activeChartKey === 'chart12_rat' || activeChartKey === 'chart13_rat');
  const isRatioChart = isMonthRatioChart || isQuarterRatioChart || isYearRatioChart;
  const isMatrixBranch = (activeBranchId === 'month' || activeBranchId === 'quarter' || activeBranchId === 'year' || activeBranchId === 'trend') && !isRatioChart;
  const isTrendBranch = activeBranchId === 'trend';
  const isTrendPrevYear = isTrendBranch && (activeChartKey === 'trend_prev_year' || !activeChartKey || activeChartKey === 'trend' || !chartTitle.includes('kế hoạch'));

  // Month code computations for dynamic comparison headers
  const monthNum = useMemo(() => {
    return parseInt(selectedMonth.match(/\d+/)?.[0] || '8', 10);
  }, [selectedMonth]);

  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();

  const isEstVsFullPlan = activeBranchId === 'year' && (activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.toLowerCase().includes('ước') && chartTitle.toLowerCase().includes('kế hoạch')));
  const isEstVsPrevYear = activeBranchId === 'year' && (activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.toLowerCase().includes('ước') && (chartTitle.toLowerCase().includes('năm trước') || chartTitle.toLowerCase().includes('kết quả năm') || chartTitle.toLowerCase().includes(lastYear))));
  const isEstComparison = isEstVsFullPlan || isEstVsPrevYear;
  const estimateColumnHeader = isEstVsPrevYear ? `Ước ${selectedYear}` : 'Ước TH';

  const isCumulativeChart = activeBranchId === 'year'
    ? (activeChartKey === 'chart10' || activeChartKey === 'chart10_val' || activeChartKey === 'chart11_val' || (!isEstComparison && (chartTitle.toLowerCase().includes('lũy kế') || chartTitle.toLowerCase().includes('luỹ kế'))))
    : activeBranchId === 'quarter'
    ? (activeChartKey === 'chart5_cum_val' || activeChartKey === 'chart5_val' || chartTitle.toLowerCase().includes('lũy kế') || chartTitle.toLowerCase().includes('luỹ kế'))
    : false;

  // Quarter code computations
  const quarterNum = useMemo(() => {
    if (selectedQuarter === 'Quý I' || selectedQuarter === 'Quý 1') return 1;
    if (selectedQuarter === 'Quý II' || selectedQuarter === 'Quý 2') return 2;
    if (selectedQuarter === 'Quý III' || selectedQuarter === 'Quý 3') return 3;
    if (selectedQuarter === 'Quý IV' || selectedQuarter === 'Quý 4') return 4;
    return 3;
  }, [selectedQuarter]);

  const quarterCode = `Q${quarterNum}`;
  const quarterRoman = `${quarterNum}`;
  const prevQuarterNum = quarterNum === 1 ? 4 : quarterNum - 1;
  const prevQuarterRoman = `${prevQuarterNum}`;
  const prevQuarterYear = quarterNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const prevQuarterName = `Quý ${prevQuarterNum}`;
  const prevQuarterCode = `Q${prevQuarterNum}`;
  const nextQuarterNum = quarterNum === 4 ? 1 : quarterNum + 1;
  const nextQuarterRoman = `${nextQuarterNum}`;
  const nextQuarterYear = quarterNum === 4 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;
  const nextQuarterName = `Quý ${nextQuarterNum}`;
  const nextQuarterCode = `Q${nextQuarterNum}`;

  // Cumulative month code computations
  const cumulativeShortCode = useMemo(() => {
    const match = selectedCumulativeMonth?.match(/\d+/);
    return match ? `${match[0]}T` : '8T';
  }, [selectedCumulativeMonth]);

  // Check if current chart has estimate data (Ước)
  const hasEstimate = useMemo(() => {
    // Month charts NEVER have estimate!
    if (activeBranchId === 'month') return false;

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
      keyLower === 'chart9_val' ||
      keyLower === 'chart12' ||
      keyLower === 'chart13' ||
      keyLower === 'chart12_val' ||
      keyLower === 'chart13_val' ||
      titleLower.includes('ước') ||
      labelLower.includes('ước')
    );
  }, [activeBranchId, activeChartKey, chartTitle, currentChartObj]);

  const isCompareWithPlan = useMemo(() => {
    if (activeBranchId === 'month') {
      return activeChartKey === 'chart1_val' || activeChartKey === 'chart1_rat' || activeChartKey === 'chart1';
    }
    if (activeBranchId === 'quarter') {
      return (
        activeChartKey === 'chart5_cum_val' ||
        activeChartKey === 'chart5_rat' ||
        activeChartKey === 'chart6_val' ||
        activeChartKey === 'chart6_rat' ||
        (!chartTitle.includes('trước') && !chartTitle.includes('cùng kỳ') && !chartTitle.includes('tiếp theo'))
      );
    }
    if (activeBranchId === 'year') {
      return (
        activeChartKey === 'chart10_val' ||
        activeChartKey === 'chart10_rat' ||
        activeChartKey === 'chart11_val' ||
        activeChartKey === 'chart11_rat' ||
        activeChartKey === 'chart12_val' ||
        activeChartKey === 'chart12_rat' ||
        (!chartTitle.includes('trước') && !chartTitle.includes('cùng kỳ'))
      );
    }
    return true;
  }, [activeBranchId, activeChartKey, chartTitle]);

  // Determine comparison case based on user specification:
  // 1. TH tháng này vs KH tháng này -> % HTKH
  // 2. TH tháng này vs TH tháng trước/cùng kỳ -> % Delta
  // 3. TH tháng này vs KH tháng sau -> % so KH kỳ sau
  const comparisonType = useMemo(() => {
    if (
      activeChartKey === 'chart4_val' ||
      activeChartKey === 'chart4_rat' ||
      activeChartKey === 'chart4' ||
      activeChartKey === 'chart9_val' ||
      activeChartKey === 'chart9_rat' ||
      activeChartKey === 'chart9' ||
      activeChartKey === 'chart7_next' ||
      chartTitle.toLowerCase().includes('tiếp theo') ||
      chartTitle.toLowerCase().includes('tháng sau') ||
      chartTitle.toLowerCase().includes('kỳ sau')
    ) {
      return 'next_plan';
    }

    if (isCompareWithPlan) {
      return 'current_plan';
    }

    return 'other_period';
  }, [activeChartKey, chartTitle, isCompareWithPlan]);

  const rateHeaderLabel = useMemo(() => {
    if (comparisonType === 'current_plan') return '% HTKH';
    if (comparisonType === 'next_plan') return '% so KH kỳ sau';
    return '% Delta';
  }, [comparisonType]);

  const diffHeaderLabel = useMemo(() => {
    if (comparisonType === 'other_period') return 'Tăng/giảm';
    return '+/- so KH';
  }, [comparisonType]);

  const firstSubColLabel = useMemo(() => {
    if (comparisonType === 'current_plan') {
      if (activeBranchId === 'month') return `TH Tháng ${monthNum}/${selectedYear}`;
      if (activeBranchId === 'quarter') {
        return hasEstimate ? `Ước TH ${selectedQuarter}/${selectedYear}` : `TH LK ${selectedQuarter}/${selectedYear}`;
      }
      if (activeBranchId === 'year') {
        if (isEstVsFullPlan || activeChartKey === 'chart12' || activeChartKey === 'chart12_val' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val') {
          return `Ước TH ${selectedYear}`;
        }
        return `TH LK ${selectedYear}`;
      }
      return hasEstimate ? 'Ước TH' : 'TH';
    }

    if (comparisonType === 'next_plan') {
      if (activeBranchId === 'month') return `TH Tháng ${monthNum}/${selectedYear}`;
      if (activeBranchId === 'quarter') return `Ước TH ${selectedQuarter}/${selectedYear}`;
      if (activeBranchId === 'year') return `Ước TH ${selectedYear}`;
      return hasEstimate ? 'Ước TH' : 'TH';
    }

    // comparisonType === 'other_period' (so kỳ trước hoặc cùng kỳ)
    if (hasEstimate) {
      if (activeBranchId === 'quarter') {
        return `Ước TH ${selectedQuarter}/${selectedYear}`;
      }
      if (activeBranchId === 'year') {
        return `Ước TH ${selectedYear}`;
      }
      return 'Ước TH';
    }

    // Biểu đồ không so sánh ước: Đặt tên theo tiêu chí TH [kỳ báo cáo]
    if (activeBranchId === 'month') {
      return `TH Tháng ${monthNum}/${selectedYear}`;
    }
    if (activeBranchId === 'quarter') {
      return `TH LK ${selectedQuarter}/${selectedYear}`;
    }
    if (activeBranchId === 'year') {
      return `TH LK ${selectedYear}`;
    }
    return 'TH';
  }, [comparisonType, hasEstimate, activeBranchId, quarterRoman, selectedYear, monthNum, selectedCumulativeMonth, isEstVsFullPlan, activeChartKey]);

  const secondSubColLabel = useMemo(() => {
    if (comparisonType === 'current_plan') {
      if (activeBranchId === 'month') return `KH Tháng ${monthNum}/${selectedYear}`;
      if (activeBranchId === 'quarter') return `KH ${selectedQuarter}/${selectedYear}`;
      if (activeBranchId === 'year') {
        if (isEstVsFullPlan || activeChartKey === 'chart12' || activeChartKey === 'chart12_val') {
          return `KH ${selectedYear}`;
        }
        if (activeChartKey === 'chart11' || activeChartKey === 'chart11_val') {
          return `KH cả năm ${selectedYear}`;
        }
        return `KH LK ${selectedYear}`;
      }
      return 'KH';
    }

    if (comparisonType === 'next_plan') {
      if (activeBranchId === 'month') return `KH Tháng ${nextMonthNum}/${nextYear}`;
      if (activeBranchId === 'quarter') return `KH ${nextQuarterName}/${nextQuarterYear}`;
      if (activeBranchId === 'year') return `KH Năm ${parseInt(selectedYear, 10) + 1}`;
      return 'KH';
    }

    // comparisonType === 'other_period' (so kỳ trước hoặc cùng kỳ): Đặt tên theo tiêu chí TH [kỳ báo cáo trước]
    if (activeBranchId === 'month') {
      if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat' || chartTitle.includes('cùng kỳ')) {
        return `TH Tháng ${monthNum}/${lastYear}`;
      }
      return `TH Tháng ${prevMonthNum}/${prevYear}`;
    }

    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart8_val' || activeChartKey === 'chart8_rat' || chartTitle.includes('cùng kỳ')) {
        return `TH ${selectedQuarter}/${lastYear}`;
      }
      return `TH ${prevQuarterName}/${prevYear}`;
    }

    if (activeBranchId === 'year') {
      if (hasEstimate || activeChartKey === 'chart13_val' || activeChartKey === 'chart13_rat' || chartTitle.toLowerCase().includes('kết quả')) {
        return `TH ${lastYear}`;
      }
      return `TH LK ${lastYear}`;
    }

    return 'TH';
  }, [comparisonType, hasEstimate, activeBranchId, activeChartKey, chartTitle, monthNum, lastYear, prevMonthNum, prevYear, nextMonthNum, nextYear, quarterRoman, prevQuarterRoman, prevQuarterYear, nextQuarterRoman, nextQuarterYear, selectedCumulativeMonth, selectedYear, isEstVsFullPlan]);

  // Dynamic header 1: Period title
  const periodHeaderTitle = useMemo(() => {
    if (activeBranchId === 'quarter') {
      return `Quý ${quarterRoman}/${selectedYear}`;
    }
    if (activeBranchId === 'year') {
      return `Năm ${selectedYear}`;
    }
    return `Tháng ${monthNum}/${selectedYear}`;
  }, [activeBranchId, selectedQuarter, quarterRoman, selectedYear, activeChartKey, chartTitle, selectedCumulativeMonth, selectedMonth, monthNum]);

  // Dynamic header 2: Comparison group title matching chart name with year
  const comparisonGroupTitle = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (
        activeChartKey === 'chart6_val' ||
        activeChartKey === 'chart6_rat' ||
        (chartTitle.toLowerCase().includes('ước') && chartTitle.toLowerCase().includes('kh') && !chartTitle.toLowerCase().includes('tiếp theo') && !chartTitle.toLowerCase().includes('kỳ sau'))
      ) {
        return `Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`;
      }
      if (
        activeChartKey === 'chart7_val' ||
        activeChartKey === 'chart7_rat' ||
        chartTitle.toLowerCase().includes('trước')
      ) {
        return `Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${prevQuarterName}/${prevYear}`;
      }
      if (
        activeChartKey === 'chart8_val' ||
        activeChartKey === 'chart8_rat' ||
        chartTitle.toLowerCase().includes('cùng kỳ')
      ) {
        return `Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${selectedQuarter}/${lastYear}`;
      }
      if (
        activeChartKey === 'chart9_val' ||
        activeChartKey === 'chart9_rat' ||
        activeChartKey === 'chart7_next' ||
        chartTitle.toLowerCase().includes('tiếp theo') ||
        chartTitle.toLowerCase().includes('kỳ sau')
      ) {
        return `Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${nextQuarterName}/${nextQuarterYear}`;
      }
      return `Lũy kế ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`;
    }

    if (activeBranchId === 'year') {
      if (
        activeChartKey === 'chart13_val' ||
        activeChartKey === 'chart13_rat' ||
        activeChartKey === 'chart13' ||
        (chartTitle.toLowerCase().includes('ước') && (chartTitle.toLowerCase().includes('năm trước') || chartTitle.toLowerCase().includes('th năm') || chartTitle.toLowerCase().includes('kết quả') || chartTitle.includes(lastYear)))
      ) {
        return `Ước kết quả ${selectedYear} so với kết quả ${lastYear}`;
      }
      if (
        activeChartKey === 'chart12_val' ||
        activeChartKey === 'chart12_rat' ||
        activeChartKey === 'chart12' ||
        (chartTitle.toLowerCase().includes('ước') && (chartTitle.toLowerCase().includes('kh') || chartTitle.toLowerCase().includes('kế hoạch')))
      ) {
        return `Ước kết quả ${selectedYear} so với kế hoạch ${selectedYear}`;
      }
      if (
        activeChartKey === 'chart11_val' ||
        activeChartKey === 'chart11_rat' ||
        activeChartKey === 'chart11' ||
        (chartTitle.toLowerCase().includes('cả năm') || (chartTitle.toLowerCase().includes('lũy kế') && chartTitle.toLowerCase().includes('kh năm')))
      ) {
        return `Lũy kế ${selectedYear} so với kế hoạch cả năm ${selectedYear}`;
      }
      // Default: chart10 (Lũy kế so với KH lũy kế)
      return `Lũy kế ${selectedYear} so với kế hoạch lũy kế ${selectedYear}`;
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') {
      return `So Tháng ${prevMonthNum} năm ${prevYear}`;
    }
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') {
      return `So cùng kỳ Tháng ${monthNum} năm ${lastYear}`;
    }
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') {
      return `So Kế hoạch Tháng ${nextMonthNum} năm ${nextYear}`;
    }
    return 'Thực hiện so với KH Tập đoàn';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    monthNum, prevMonthNum, prevYear, nextMonthNum, nextYear, lastYear,
    selectedQuarter, prevQuarterName, prevQuarterYear, nextQuarterName, nextQuarterYear,
    selectedCumulativeMonth, cumulativeShortCode, selectedYear,
    isEstVsFullPlan, isEstVsPrevYear, prevQuarterRoman, quarterRoman
  ]);

  // Dynamic sub-column labels with year matching matrix table columns
  const actualColumnLabel = firstSubColLabel;
  const targetColumnLabel = secondSubColLabel;

  const diffColumnLabel = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart7_rat' || chartTitle.toLowerCase().includes('trước')) {
        return `so Q${prevQuarterRoman}/${prevQuarterYear}`;
      }
      if (activeChartKey === 'chart8_val' || activeChartKey === 'chart8_rat' || chartTitle.toLowerCase().includes('cùng kỳ')) {
        return `so CK ${lastYear}`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || activeChartKey === 'chart9_rat' || chartTitle.toLowerCase().includes('tiếp theo') || chartTitle.toLowerCase().includes('kỳ sau')) {
        return `so Q${nextQuarterRoman}/${nextQuarterYear}`;
      }
      return `so KH`;
    }

    if (activeBranchId === 'year') {
      if (activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || activeChartKey === 'chart13_rat' || chartTitle.toLowerCase().includes('năm trước') || chartTitle.toLowerCase().includes('th năm') || chartTitle.toLowerCase().includes('kết quả')) {
        return `so Năm ${lastYear}`;
      }
      if (activeChartKey === 'chart12' || activeChartKey === 'chart12_val' || activeChartKey === 'chart12_rat' || isEstVsFullPlan) {
        return `so KH năm`;
      }
      if (activeChartKey === 'chart11' || activeChartKey === 'chart11_val' || activeChartKey === 'chart11_rat') {
        return `so KH năm`;
      }
      return `so KH LK`;
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') return `so T${prevMonthNum}/${prevYear}`;
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') return `so T${monthNum}/${lastYear}`;
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') return `so T${nextMonthNum}/${nextYear}`;
    return `so KH`;
  }, [
    activeBranchId, activeChartKey, chartTitle,
    prevMonthNum, prevYear, monthNum, lastYear, nextMonthNum, nextYear,
    quarterRoman, prevQuarterRoman, prevQuarterYear, nextQuarterRoman, nextQuarterYear, selectedYear,
    isEstVsFullPlan, isEstVsPrevYear
  ]);

  const rateSubLabel = useMemo(() => {
    if (activeBranchId === 'quarter') {
      if (activeChartKey === 'chart7_val' || activeChartKey === 'chart7_rat' || chartTitle.toLowerCase().includes('trước')) {
        return `Tăng trưởng`;
      }
      if (activeChartKey === 'chart8_val' || activeChartKey === 'chart8_rat' || chartTitle.toLowerCase().includes('cùng kỳ')) {
        return `Tăng trưởng`;
      }
      if (activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || activeChartKey === 'chart9_rat' || chartTitle.toLowerCase().includes('tiếp theo') || chartTitle.toLowerCase().includes('kỳ sau')) {
        return `so KH tới`;
      }
      return 'HTKH';
    }

    if (activeBranchId === 'year') {
      if (isEstVsPrevYear || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || activeChartKey === 'chart13_rat' || chartTitle.toLowerCase().includes('năm trước') || chartTitle.toLowerCase().includes('th năm') || chartTitle.toLowerCase().includes('kết quả')) {
        return `Tăng trưởng`;
      }
      return 'HTKH';
    }

    // Month branch
    if (activeChartKey === 'chart2_val' || activeChartKey === 'chart2_rat') return `Tăng trưởng`;
    if (activeChartKey === 'chart3_val' || activeChartKey === 'chart3_rat') return `Tăng trưởng`;
    if (activeChartKey === 'chart4_val' || activeChartKey === 'chart4_rat') return `so KH tới`;
    return 'HTKH';
  }, [
    activeBranchId, activeChartKey, chartTitle,
    isEstVsPrevYear
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
      const qCum = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý 3'] || QUARTER_CUMULATIVE_DATA['Quý III'];
      const qEst = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý 3'] || QUARTER_ESTIMATE_DATA['Quý III'];
      const qPrev = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý 3'] || QUARTER_PREV_DATA['Quý III'];
      const qSame = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý 3'] || QUARTER_SAME_PERIOD_DATA['Quý III'];
      const qNext = QUARTER_NEXT_PLAN_DATA[selectedQuarter] || QUARTER_NEXT_PLAN_DATA['Quý 3'] || QUARTER_NEXT_PLAN_DATA['Quý III'];

      const raw = (activeChartKey === 'chart6_val' || activeChartKey === 'chart6_rat') ? qEst?.values
        : (activeChartKey === 'chart7_val' || activeChartKey === 'chart7_rat') ? qPrev?.values
        : (activeChartKey === 'chart8_val' || activeChartKey === 'chart8_rat') ? qSame?.values
        : (activeChartKey === 'chart9_val' || activeChartKey === 'chart9_rat' || activeChartKey === 'chart7_next') ? qNext?.values
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
      if (activeChartKey === 'trend_plan' || chartTitle.includes('kế hoạch')) {
        const trendPlanList = MONTH_PLAN_TREND_DATA[selectedYear] || MONTH_PLAN_TREND_DATA['2026'] || [];
        rows = trendPlanList.map((item, idx) => {
          const khVal = item.kh !== null && item.kh !== undefined ? item.kh : null;
          const thVal = item.th !== null && item.th !== undefined ? item.th : null;
          const diffVal = (thVal !== null && khVal !== null) ? Number((thVal - khVal).toFixed(1)) : null;
          const isPass = diffVal !== null ? diffVal >= 0 : true;
          return {
            stt: idx + 1,
            name: `${item.name} (${item.month})`,
            unit: 'Triệu đồng',
            kh: khVal !== null ? khVal : '-',
            th: thVal !== null ? thVal : '-',
            diff: diffVal !== null ? (diffVal > 0 ? `+${diffVal.toLocaleString('vi-VN')}` : diffVal.toLocaleString('vi-VN')) : '-',
            diffNum: diffVal || 0,
            rate: item.rate || '-',
            rateNum: parseFloat(item.rate?.replace('%', '').replace(',', '.') || 0),
            isPass,
            share: item.rate || '-'
          };
        });
      } else {
        const trendList = MONTH_TREND_DATA[selectedYear] || MONTH_TREND_DATA['2026'] || [];
        rows = trendList.map((item, idx) => {
          const thCurr = item.th2026 !== null && item.th2026 !== undefined ? item.th2026 : null;
          const thOld = item.th2025 !== null && item.th2025 !== undefined ? item.th2025 : null;
          const diffVal = (thCurr !== null && thOld !== null) ? Number((thCurr - thOld).toFixed(1)) : null;
          const isPass = diffVal !== null ? diffVal >= 0 : true;
          return {
            stt: idx + 1,
            name: `${item.name} (${item.month})`,
            unit: 'Triệu đồng',
            kh: thOld !== null ? thOld : '-',
            th: thCurr !== null ? thCurr : '-',
            diff: diffVal !== null ? (diffVal > 0 ? `+${diffVal.toLocaleString('vi-VN')}` : diffVal.toLocaleString('vi-VN')) : '-',
            diffNum: diffVal || 0,
            rate: item.growth || '-',
            rateNum: parseFloat(item.growth?.replace(',', '.') || 0),
            isPass,
            share: item.growth || '-'
          };
        });
      }
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

        const isNextPlan = comparisonType === 'next_plan';
        const isOtherPeriod = comparisonType === 'other_period';

        let diff = 0;
        let rate = '';
        let rateNum = 100;
        let isPass = false;

        if (isOtherPeriod) {
          // TH tháng này vs TH tháng trước/cùng kỳ -> % Delta
          diff = scaledUoc - targetVal;
          const deltaRateNum = targetVal > 0 ? Number(((diff / targetVal) * 100).toFixed(1)) : 0;
          rateNum = deltaRateNum;
          rate = `${deltaRateNum >= 0 ? '+' : ''}${deltaRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0;
        } else if (isNextPlan) {
          // TH tháng này vs KH tháng sau -> % so KH kỳ sau
          diff = scaledTh - targetVal;
          const nextRateNum = targetVal > 0 ? Number(((scaledTh / targetVal) * 100).toFixed(1)) : 100;
          rateNum = nextRateNum;
          rate = `${nextRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0 || nextRateNum >= 100;
        } else {
          // TH tháng này vs KH tháng này -> % HTKH
          diff = scaledTh - targetVal;
          const planRateNum = targetVal > 0 ? Number(((scaledTh / targetVal) * 100).toFixed(1)) : 100;
          rateNum = planRateNum;
          rate = `${planRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0 || planRateNum >= 100;
        }

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
        'Quý 1': 1.05,
        'Quý 2': 1.18,
        'Quý 3': 1.12,
        'Quý 4': 1.30,
        'Quý I': 1.05,
        'Quý II': 1.18,
        'Quý III': 1.12,
        'Quý IV': 1.30
      };
      const currentFactor = quarterFactors[selectedQuarter] || 1.12;
      const prevQuarterFactor = quarterFactors[prevQuarterName] || 1.05;
      const nextQuarterFactor = quarterFactors[nextQuarterName] || 1.25;

      const isVsPrev = activeChartKey === 'chart7_val' || activeChartKey === 'chart7_rat' || chartTitle.toLowerCase().includes('trước');
      const isVsSame = activeChartKey === 'chart8_val' || activeChartKey === 'chart8_rat' || chartTitle.toLowerCase().includes('cùng kỳ');
      const isVsNext = activeChartKey === 'chart7_next' || activeChartKey === 'chart9_val' || activeChartKey === 'chart9_rat' || chartTitle.toLowerCase().includes('tiếp theo') || chartTitle.toLowerCase().includes('kỳ sau');

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

        let diff = 0;
        let rate = '';
        let rateNum = 100;
        let isPass = false;

        if (isVsPrev || isVsSame) {
          // TH vs TH trước/cùng kỳ -> % Delta
          diff = scaledUoc - targetVal;
          const deltaRateNum = targetVal > 0 ? Number(((diff / targetVal) * 100).toFixed(1)) : 0;
          rateNum = deltaRateNum;
          rate = `${deltaRateNum >= 0 ? '+' : ''}${deltaRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0;
        } else if (isVsNext) {
          // TH vs KH kỳ sau -> % so KH kỳ sau
          diff = scaledTh - targetVal;
          const nextRateNum = targetVal > 0 ? Number(((scaledTh / targetVal) * 100).toFixed(1)) : 100;
          rateNum = nextRateNum;
          rate = `${nextRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0 || nextRateNum >= 100;
        } else {
          // TH vs KH -> % HTKH
          const valueToCompare = hasEstimate ? scaledUoc : scaledTh;
          diff = valueToCompare - targetVal;
          const planRateNum = targetVal > 0 ? Number(((valueToCompare / targetVal) * 100).toFixed(1)) : 100;
          rateNum = planRateNum;
          rate = `${planRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0 || planRateNum >= 100;
        }

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
      const isEstVsFullPlan = activeChartKey === 'chart11' || activeChartKey === 'chart12_val' || (chartTitle.toLowerCase().includes('ước') && chartTitle.toLowerCase().includes('kế hoạch'));
      const isEstVsLastYear = activeChartKey === 'chart12' || activeChartKey === 'chart13' || activeChartKey === 'chart13_val' || (chartTitle.toLowerCase().includes('ước') && (chartTitle.toLowerCase().includes('năm trước') || chartTitle.toLowerCase().includes('kết quả năm') || chartTitle.toLowerCase().includes(lastYear)));

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
          scaledKh = targetVal;
        }

        const valueToCompare = hasEstimate ? scaledUoc : scaledTh;
        const diff = valueToCompare - targetVal;
        let rate = '';
        let rateNum = 100;
        let isPass = false;

        if (isEstVsLastYear) {
          // TH vs TH năm trước -> % Delta
          const deltaRateNum = targetVal > 0 ? Number(((diff / targetVal) * 100).toFixed(1)) : 0;
          rateNum = deltaRateNum;
          rate = `${deltaRateNum >= 0 ? '+' : ''}${deltaRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0;
        } else {
          // TH vs KH -> % HTKH
          const planRateNum = targetVal > 0 ? Number(((valueToCompare / targetVal) * 100).toFixed(1)) : 100;
          rateNum = planRateNum;
          rate = `${planRateNum.toFixed(1).replace('.', ',')}%`;
          isPass = diff >= 0 || planRateNum >= 100;
        }

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

        let totalPrevTh = 0;

        for (let m = 1; m <= 12; m++) {
          const factor = monthFactors[m] || 0.90;
          const kh = Math.round(item.baseKh * factor);
          totalKh += kh;

          // Hệ số tăng trưởng theo tháng từ dữ liệu xu hướng thực tế
          const trendItem = MONTH_TREND_DATA[selectedYear]?.[m - 1];
          const baseGrowthPct = trendItem?.growth
            ? parseFloat(trendItem.growth.replace('+', '').replace('%', '').replace(',', '.'))
            : (10.0 + ((idx * 5 + m * 2) % 8));
          const rowVariance = 1 + (((idx * 7 + m * 3) % 9) - 4) * 0.006;
          const monthGrowthPct = Math.max(0.5, Number((baseGrowthPct * rowVariance).toFixed(1)));
          const growthFactor = 1 + (monthGrowthPct / 100);

          if (isCurrent2026 && m > 8) {
            const thPrev = Math.round(kh * 0.88);
            monthly[m] = {
              kh,
              th: null,
              thCurrent: null,
              thPrev,
              growth: '-',
              growthNum: null,
              rate: '-',
              rateNum: null,
              diff: null
            };
          } else {
            const variance = idx % 2 === 0 ? 0.94 : 0.98;
            const th = Math.round(kh * variance);
            const thCurrent = th;
            const thPrev = Math.round(thCurrent / growthFactor);
            const gNum = thPrev > 0 ? Number((((thCurrent - thPrev) / thPrev) * 100).toFixed(1)) : 0;
            const gStr = `${gNum >= 0 ? '+' : ''}${gNum.toFixed(1).replace('.', ',')}%`;

            const diff = th - kh;
            const rateNum = kh > 0 ? Number(((th / kh) * 100).toFixed(1)) : 100;
            const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
            totalTh += th;
            relevantKh += kh;
            totalPrevTh += thPrev;

            monthly[m] = {
              kh,
              th,
              thCurrent,
              thPrev,
              growth: gStr,
              growthNum: gNum,
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

        // Tỷ lệ tăng trưởng cả kỳ so với năm trước
        const prevTh = totalPrevTh;
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
          const hasTh = rows.some(r => (r.monthly?.[m]?.thCurrent ?? r.monthly?.[m]?.th) !== null && (r.monthly?.[m]?.thCurrent ?? r.monthly?.[m]?.th) !== undefined);
          const sumTh = hasTh ? rows.reduce((acc, r) => acc + (r.monthly?.[m]?.thCurrent ?? r.monthly?.[m]?.th ?? 0), 0) : null;
          const sumThPrev = rows.reduce((acc, r) => acc + (r.monthly?.[m]?.thPrev || 0), 0);
          const monthGrowthNum = (sumTh !== null && sumThPrev > 0)
            ? Number((((sumTh - sumThPrev) / sumThPrev) * 100).toFixed(1))
            : null;
          const monthGrowth = monthGrowthNum !== null
            ? `${monthGrowthNum >= 0 ? '+' : ''}${monthGrowthNum.toFixed(1).replace('.', ',')}%`
            : '-';
          const monthRateNum = (sumTh !== null && sumKh > 0)
            ? Number(((sumTh / sumKh) * 100).toFixed(1))
            : null;
          const monthRate = monthRateNum !== null
            ? `${monthRateNum.toFixed(1).replace('.', ',')}%`
            : '-';
          const monthDiff = sumTh !== null ? sumTh - sumKh : null;
          const monthIsPass = monthRateNum !== null ? monthRateNum >= 100 : false;

          monthly[m] = {
            kh: sumKh,
            th: sumTh,
            thCurrent: sumTh,
            thPrev: sumThPrev,
            growth: monthGrowth,
            growthNum: monthGrowthNum,
            diff: monthDiff,
            rate: monthRate,
            rateNum: monthRateNum,
            isPass: monthIsPass
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

      const totalGroup = calcTrendGroup(targetRows);

      const calcDerivedTrendGroup = (isProfit) => {
        const monthly = {};
        let totalKh = 0;
        let totalTh = 0;
        let relevantKh = 0;
        const isCurrent2026 = selectedYear === '2026';
        const ratioTh = isProfit ? 0.097 : 0.903;
        const ratioKh = isProfit ? 0.098 : 0.902;

        for (let m = 1; m <= 12; m++) {
          const baseM = totalGroup.monthly[m];
          const mKh = Math.round(baseM.kh * ratioKh);
          const mTh = baseM.th !== null ? Math.round(baseM.th * ratioTh) : null;
          const mThPrev = Math.round(baseM.thPrev * ratioTh);
          const mGrowthNum = (mTh !== null && mThPrev > 0)
            ? Number((((mTh - mThPrev) / mThPrev) * 100).toFixed(1))
            : null;
          const mGrowth = mGrowthNum !== null
            ? `${mGrowthNum >= 0 ? '+' : ''}${mGrowthNum.toFixed(1).replace('.', ',')}%`
            : '-';
          const mRateNum = (mTh !== null && mKh > 0)
            ? Number(((mTh / mKh) * 100).toFixed(1))
            : null;
          const mRate = mRateNum !== null
            ? `${mRateNum.toFixed(1).replace('.', ',')}%`
            : '-';
          const mDiff = mTh !== null ? mTh - mKh : null;
          const mIsPass = isProfit
            ? (mRateNum !== null ? mRateNum >= 100 : false)
            : (mTh !== null ? mTh <= mKh : false);

          monthly[m] = {
            kh: mKh,
            th: mTh,
            thCurrent: mTh,
            thPrev: mThPrev,
            growth: mGrowth,
            growthNum: mGrowthNum,
            diff: mDiff,
            rate: mRate,
            rateNum: mRateNum,
            isPass: mIsPass
          };
          totalKh += mKh;
          if (mTh !== null) {
            totalTh += mTh;
            relevantKh += mKh;
          }
        }

        const compKh = isCurrent2026 ? relevantKh : totalKh;
        const totalDiff = totalTh - compKh;
        const totalRateNum = compKh > 0 ? Number(((totalTh / compKh) * 100).toFixed(1)) : 100;
        const totalRate = `${totalRateNum.toFixed(1).replace('.', ',')}%`;
        const totalPrevTh = Math.round(totalGroup.prevTh * ratioTh);
        const growthRateNum = totalPrevTh > 0 ? Number((((totalTh - totalPrevTh) / totalPrevTh) * 100).toFixed(1)) : 0;
        const growthRate = `${growthRateNum >= 0 ? '+' : ''}${growthRateNum.toFixed(1).replace('.', ',')}%`;

        const isPass = isProfit ? (totalDiff >= 0 || totalRateNum >= 100) : (totalDiff <= 0 || totalRateNum <= 100);

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
          isPass
        };
      };

      return {
        external: calcTrendGroup(externalRows),
        internal: calcTrendGroup(internalRows),
        international: calcTrendGroup(internationalRows),
        total: totalGroup,
        cost: calcDerivedTrendGroup(false),
        profit: calcDerivedTrendGroup(true)
      };
    }

    const calcGroup = (rows) => {
      const sumTarget = rows.reduce((acc, r) => acc + (r.targetVal !== undefined ? r.targetVal : (r.kh || 0)), 0);
      const sumUocTh = rows.reduce((acc, r) => acc + (r.uocTh || Math.round(((r.targetVal || r.kh || 0) + (r.th || 0)) / 2)), 0);
      const sumTh = rows.reduce((acc, r) => acc + (r.th || 0), 0);
      const isOtherPeriod = comparisonType === 'other_period';
      const isNextPlan = comparisonType === 'next_plan';

      let diff = 0;
      let rate = '';
      let rateNum = 100;
      let isPass = false;

      if (isOtherPeriod) {
        diff = sumUocTh - sumTarget;
        const deltaRateNum = sumTarget > 0 ? Number(((diff / sumTarget) * 100).toFixed(1)) : 0;
        rateNum = deltaRateNum;
        rate = `${deltaRateNum >= 0 ? '+' : ''}${deltaRateNum.toFixed(1).replace('.', ',')}%`;
        isPass = diff >= 0;
      } else if (isNextPlan) {
        diff = sumTh - sumTarget;
        const nextRateNum = sumTarget > 0 ? Number(((sumTh / sumTarget) * 100).toFixed(1)) : 100;
        rateNum = nextRateNum;
        rate = `${nextRateNum.toFixed(1).replace('.', ',')}%`;
        isPass = diff >= 0 || nextRateNum >= 100;
      } else {
        const valToCompare = hasEstimate ? sumUocTh : sumTh;
        diff = valToCompare - sumTarget;
        const planRateNum = sumTarget > 0 ? Number(((valToCompare / sumTarget) * 100).toFixed(1)) : 100;
        rateNum = planRateNum;
        rate = `${planRateNum.toFixed(1).replace('.', ',')}%`;
        isPass = diff >= 0 || planRateNum >= 100;
      }

      return {
        kh: sumTarget,
        targetVal: sumTarget,
        uocTh: sumUocTh,
        th: sumTh,
        diff,
        diffFormatted: (diff > 0 ? '+' : '') + diff,
        rate,
        rateNum,
        isPass
      };
    };

    const externalRows = targetRows.filter(r => r.type === 'external');
    const internalRows = targetRows.filter(r => r.type === 'internal');
    const internationalRows = targetRows.filter(r => r.isInternational || r.customerGroup?.includes('nước ngoài'));

    const totalGroup = calcGroup(targetRows);

    const isOtherPeriod = comparisonType === 'other_period';
    const isNextPlan = comparisonType === 'next_plan';

    // Lợi nhuận trước thuế: ~9.7% TH, ~9.8% KH
    const profitKh = Math.round(totalGroup.kh * 0.098);
    const profitTargetVal = (isOtherPeriod || isNextPlan) ? Math.round(totalGroup.targetVal * 0.098) : profitKh;
    const profitUocTh = Math.round(totalGroup.uocTh * 0.097);
    const profitTh = Math.round(totalGroup.th * 0.097);

    let profitDiff = 0;
    let profitRate = '';
    let profitRateNum = 100;
    let profitIsPass = false;

    if (isOtherPeriod) {
      profitDiff = profitUocTh - profitTargetVal;
      const profitDeltaRateNum = profitTargetVal > 0 ? Number(((profitDiff / profitTargetVal) * 100).toFixed(1)) : 0;
      profitRateNum = profitDeltaRateNum;
      profitRate = `${profitDeltaRateNum >= 0 ? '+' : ''}${profitDeltaRateNum.toFixed(1).replace('.', ',')}%`;
      profitIsPass = profitDiff >= 0;
    } else if (isNextPlan) {
      profitDiff = profitTh - profitTargetVal;
      const profitNextRateNum = profitTargetVal > 0 ? Number(((profitTh / profitTargetVal) * 100).toFixed(1)) : 100;
      profitRateNum = profitNextRateNum;
      profitRate = `${profitNextRateNum.toFixed(1).replace('.', ',')}%`;
      profitIsPass = profitDiff >= 0 || profitNextRateNum >= 100;
    } else {
      const profitValueToCompare = hasEstimate ? profitUocTh : profitTh;
      profitDiff = profitValueToCompare - profitTargetVal;
      const profitPlanRateNum = profitKh > 0 ? Number(((profitValueToCompare / profitKh) * 100).toFixed(1)) : 100;
      profitRateNum = profitPlanRateNum;
      profitRate = `${profitPlanRateNum.toFixed(1).replace('.', ',')}%`;
      profitIsPass = profitDiff >= 0 || profitRateNum >= 100;
    }

    const profitGroup = {
      kh: profitKh,
      targetVal: profitTargetVal,
      uocTh: profitUocTh,
      th: profitTh,
      diff: profitDiff,
      diffFormatted: (profitDiff > 0 ? '+' : '') + profitDiff,
      rate: profitRate,
      rateNum: profitRateNum,
      isPass: profitIsPass
    };

    // Tổng chi phí = Tổng doanh thu - Lợi nhuận trước thuế
    const costKh = totalGroup.kh - profitKh;
    const costTargetVal = (isOtherPeriod || isNextPlan) ? (totalGroup.targetVal - profitTargetVal) : costKh;
    const costUocTh = totalGroup.uocTh - profitUocTh;
    const costTh = totalGroup.th - profitTh;

    let costDiff = 0;
    let costRate = '';
    let costRateNum = 100;
    let costIsPass = false;

    if (isOtherPeriod) {
      costDiff = costUocTh - costTargetVal;
      const costDeltaRateNum = costTargetVal > 0 ? Number(((costDiff / costTargetVal) * 100).toFixed(1)) : 0;
      costRateNum = costDeltaRateNum;
      costRate = `${costDeltaRateNum >= 0 ? '+' : ''}${costDeltaRateNum.toFixed(1).replace('.', ',')}%`;
      costIsPass = costDiff <= 0;
    } else if (isNextPlan) {
      costDiff = costTh - costTargetVal;
      const costNextRateNum = costTargetVal > 0 ? Number(((costTh / costTargetVal) * 100).toFixed(1)) : 100;
      costRateNum = costNextRateNum;
      costRate = `${costNextRateNum.toFixed(1).replace('.', ',')}%`;
      costIsPass = costDiff <= 0 || costNextRateNum <= 100;
    } else {
      const costValueToCompare = hasEstimate ? costUocTh : costTh;
      costDiff = costValueToCompare - costTargetVal;
      const costPlanRateNum = costKh > 0 ? Number(((costValueToCompare / costKh) * 100).toFixed(1)) : 100;
      costRateNum = costPlanRateNum;
      costRate = `${costPlanRateNum.toFixed(1).replace('.', ',')}%`;
      costIsPass = costDiff <= 0 || costRateNum <= 100;
    }

    const costGroup = {
      kh: costKh,
      targetVal: costTargetVal,
      uocTh: costUocTh,
      th: costTh,
      diff: costDiff,
      diffFormatted: (costDiff > 0 ? '+' : '') + costDiff,
      rate: costRate,
      rateNum: costRateNum,
      isPass: costIsPass
    };

    return {
      external: calcGroup(externalRows),
      internal: calcGroup(internalRows),
      international: calcGroup(internationalRows),
      total: totalGroup,
      cost: costGroup,
      profit: profitGroup
    };
  }, [filteredMatrixRows, hasEstimate, isTrendBranch, selectedYear, isCompareWithPlan, comparisonType]);

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
            if (isTrendPrevYear) {
              for (let m = 1; m <= 12; m++) {
                rowObj[`T${m} - TH ${lastYear}`] = (r.monthly?.[m]?.thPrev !== null && r.monthly?.[m]?.thPrev !== undefined)
                  ? r.monthly[m].thPrev
                  : '';
                rowObj[`T${m} - TH ${selectedYear}`] = (r.monthly?.[m]?.thCurrent !== null && r.monthly?.[m]?.thCurrent !== undefined)
                  ? r.monthly[m].thCurrent
                  : '';
                rowObj[`T${m} - Tỷ lệ tăng trưởng`] = r.monthly?.[m]?.growth ?? '';
              }
              rowObj[`TH ${lastYear}`] = r.prevTh;
              rowObj[`TH ${selectedYear}`] = r.totalTh;
              rowObj['Tỷ lệ tăng trưởng'] = r.growthRate;
            } else {
              for (let m = 1; m <= 12; m++) {
                rowObj[`T${m} - TH ${selectedYear}`] = (r.monthly?.[m]?.th !== null && r.monthly?.[m]?.th !== undefined)
                  ? r.monthly[m].th
                  : '';
                rowObj[`T${m} - KH ${selectedYear}`] = r.monthly?.[m]?.kh ?? 0;
                rowObj[`T${m} - Tỷ lệ (%)`] = r.monthly?.[m]?.rate ?? '';
              }
              rowObj[`TH ${selectedYear}`] = r.totalTh;
              rowObj[`KH ${selectedYear}`] = r.totalKh;
              rowObj['Chênh lệch'] = r.totalDiffFormatted;
              rowObj['Tỷ lệ (%)'] = r.totalRate;
            }
            return rowObj;
          });

          const buildTrendSummaryExport = (title, data) => {
            const summaryObj = {
              'Nhóm khách hàng': title,
              'Tên khách hàng': '',
              'Nhóm SPDV': '',
              'Tên SPDV': ''
            };
            if (isTrendPrevYear) {
              for (let m = 1; m <= 12; m++) {
                summaryObj[`T${m} - TH ${lastYear}`] = (data.monthly?.[m]?.thPrev !== null && data.monthly?.[m]?.thPrev !== undefined)
                  ? data.monthly[m].thPrev
                  : '';
                summaryObj[`T${m} - TH ${selectedYear}`] = (data.monthly?.[m]?.thCurrent !== null && data.monthly?.[m]?.thCurrent !== undefined)
                  ? data.monthly[m].thCurrent
                  : '';
                summaryObj[`T${m} - Tỷ lệ tăng trưởng`] = data.monthly?.[m]?.growth ?? '';
              }
              summaryObj[`TH ${lastYear}`] = data.prevTh;
              summaryObj[`TH ${selectedYear}`] = data.totalTh;
              summaryObj['Tỷ lệ tăng trưởng'] = data.growthRate;
            } else {
              for (let m = 1; m <= 12; m++) {
                summaryObj[`T${m} - TH ${selectedYear}`] = (data.monthly?.[m]?.th !== null && data.monthly?.[m]?.th !== undefined)
                  ? data.monthly[m].th
                  : '';
                summaryObj[`T${m} - KH ${selectedYear}`] = data.monthly?.[m]?.kh ?? 0;
                summaryObj[`T${m} - Tỷ lệ (%)`] = data.monthly?.[m]?.rate ?? '';
              }
              summaryObj[`TH ${selectedYear}`] = data.totalTh;
              summaryObj[`KH ${selectedYear}`] = data.totalKh;
              summaryObj['Chênh lệch'] = data.totalDiffFormatted;
              summaryObj['Tỷ lệ (%)'] = data.totalRate;
            }
            return summaryObj;
          };

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
            'Tên SPDV': r.spdvName
          };
          if (comparisonType === 'current_plan') {
            rowObj[firstSubColLabel] = r.th;
            rowObj[secondSubColLabel] = r.targetVal !== undefined ? r.targetVal : r.kh;
          } else if (comparisonType === 'next_plan') {
            rowObj[firstSubColLabel] = hasEstimate ? (r.uocTh !== undefined ? r.uocTh : r.th) : r.th;
            rowObj[secondSubColLabel] = r.targetVal !== undefined ? r.targetVal : r.kh;
          } else {
            rowObj[firstSubColLabel] = r.uocTh !== undefined ? r.uocTh : r.th;
            rowObj[secondSubColLabel] = r.targetVal !== undefined ? r.targetVal : r.th;
          }
          rowObj[diffHeaderLabel] = r.diffFormatted;
          rowObj[rateHeaderLabel] = r.rate;
          return rowObj;
        });

        // Summary rows matching screenshot
        const buildSummaryExport = (title, data) => {
          const summaryObj = {
            'Nhóm khách hàng': title,
            'Tên khách hàng': '',
            'Nhóm SPDV': '',
            'Tên SPDV': ''
          };
          if (comparisonType === 'current_plan') {
            summaryObj[firstSubColLabel] = data.th;
            summaryObj[secondSubColLabel] = data.kh;
          } else if (comparisonType === 'next_plan') {
            summaryObj[firstSubColLabel] = hasEstimate ? data.uocTh : data.th;
            summaryObj[secondSubColLabel] = data.targetVal;
          } else {
            summaryObj[firstSubColLabel] = data.uocTh !== undefined ? data.uocTh : data.th;
            summaryObj[secondSubColLabel] = data.targetVal;
          }
          summaryObj[diffHeaderLabel] = data.diffFormatted;
          summaryObj[rateHeaderLabel] = data.rate;
          return summaryObj;
        };

        exportRows.push(buildSummaryExport('Tổng doanh thu ngoài Tập đoàn', matrixTotals.external));
        exportRows.push(buildSummaryExport('Tổng doanh thu nội bộ', matrixTotals.internal));
        exportRows.push(buildSummaryExport('Tổng doanh thu quốc tế', matrixTotals.international));
        exportRows.push(buildSummaryExport('Lợi nhuận trước thuế', matrixTotals.profit));
        exportRows.push(buildSummaryExport('Tổng doanh thu', matrixTotals.total));

        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Thuc_Hien_So_Voi_KH');
        const periodClean = activeBranchId === 'quarter' ? selectedQuarter : (activeBranchId === 'year' ? selectedCumulativeMonth : selectedMonth);
        const cleanFileName = `Bao_cao_chi_tiet_${periodClean}_${selectedYear}.xlsx`;
        XLSX.writeFile(wb, cleanFileName);
        return;
      }

      if (activeBranchId === 'spdv') {
        const isYoyCompare = (activeChartKey || '').includes('yoy') || (activeChartKey || '').includes('cung_ky') || (activeChartKey || '') === 'chart19';
        const isPrevPeriodCompare = (activeChartKey || '').includes('prev') || (activeChartKey || '').includes('ky_truoc') || (activeChartKey || '') === 'chart20';
        const isBarCompare = (activeChartKey || '').startsWith('spdv_bar_');
        const spdvMonthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
        const spdvQuarterNum = Math.ceil(spdvMonthNum / 3);
        const spdvQuarterRoman = `${spdvQuarterNum}`;
        const spdvQuarterStartMonth = (spdvQuarterNum - 1) * 3 + 1;
        const spdvQuarterCumText = spdvQuarterStartMonth === spdvMonthNum
          ? `T${spdvQuarterStartMonth}`
          : `T${spdvQuarterStartMonth}-T${spdvMonthNum}`;

        const monthCol = `Tháng ${spdvMonthNum}/${selectedYear}`;
        const quarterCol = `Quý ${spdvQuarterRoman}/${selectedYear} (lũy kế ${spdvQuarterCumText})`;
        const yearCol = `Năm ${selectedYear} (lũy kế ${spdvMonthNum}T)`;

        if (isYoyCompare) {
          const yoyData = getSpdvYoyComparisonData(selectedYear, selectedMonth);
          const mItems = yoyData.monthItems || [];
          const qItems = yoyData.quarterItems || [];
          const yItems = yoyData.yearItems || [];

          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const q = qItems.find((it) => it.id === cat.id) || {};
            const y = yItems.find((it) => it.id === cat.id) || {};

            const mCurr = Number(m.curr ?? 0);
            const mPrev = Number(m.prev ?? 0);
            const mDiff = Number((mCurr - mPrev).toFixed(1));
            const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1) + '%' : '0%');

            const qCurr = Number(q.curr ?? 0);
            const qPrev = Number(q.prev ?? 0);
            const qDiff = Number((qCurr - qPrev).toFixed(1));
            const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1) + '%' : '0%');

            const yCurr = Number(y.curr ?? 0);
            const yPrev = Number(y.prev ?? 0);
            const yDiff = Number((yCurr - yPrev).toFixed(1));
            const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1) + '%' : '0%');

            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`${monthCol} - ${yoyData.monthLegendCurr}`]: mCurr,
              [`${monthCol} - ${yoyData.monthLegendPrev}`]: mPrev,
              [`${monthCol} - +/- Chênh lệch`]: mDiff,
              [`${monthCol} - % delta`]: mRate,
              [`${quarterCol} - ${yoyData.quarterLegendCurr}`]: qCurr,
              [`${quarterCol} - ${yoyData.quarterLegendPrev}`]: qPrev,
              [`${quarterCol} - +/- Chênh lệch`]: qDiff,
              [`${quarterCol} - % delta`]: qRate,
              [`${yearCol} - ${yoyData.yearLegendCurr}`]: yCurr,
              [`${yearCol} - ${yoyData.yearLegendPrev}`]: yPrev,
              [`${yearCol} - +/- Chênh lệch`]: yDiff,
              [`${yearCol} - % delta`]: yRate,
            };
          });

          const mTotalCurr = mItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const mTotalPrev = mItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const qTotalCurr = qItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const qTotalPrev = qItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const yTotalCurr = yItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const yTotalPrev = yItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);

          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`${monthCol} - ${yoyData.monthLegendCurr}`]: mTotalCurr,
            [`${monthCol} - ${yoyData.monthLegendPrev}`]: mTotalPrev,
            [`${monthCol} - +/- Chênh lệch`]: Number((mTotalCurr - mTotalPrev).toFixed(1)),
            [`${monthCol} - % delta`]: mTotalPrev > 0 ? ((mTotalCurr / mTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${quarterCol} - ${yoyData.quarterLegendCurr}`]: qTotalCurr,
            [`${quarterCol} - ${yoyData.quarterLegendPrev}`]: qTotalPrev,
            [`${quarterCol} - +/- Chênh lệch`]: Number((qTotalCurr - qTotalPrev).toFixed(1)),
            [`${quarterCol} - % delta`]: qTotalPrev > 0 ? ((qTotalCurr / qTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${yearCol} - ${yoyData.yearLegendCurr}`]: yTotalCurr,
            [`${yearCol} - ${yoyData.yearLegendPrev}`]: yTotalPrev,
            [`${yearCol} - +/- Chênh lệch`]: Number((yTotalCurr - yTotalPrev).toFixed(1)),
            [`${yearCol} - % delta`]: yTotalPrev > 0 ? ((yTotalCurr / yTotalPrev) * 100).toFixed(1) + '%' : '0%',
          });

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_Cung_Ky');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_cung_ky_${selectedYear}.xlsx`);
          return;
        }

        if (isPrevPeriodCompare) {
          const prevData = getSpdvPrevPeriodComparisonData(selectedYear, selectedMonth);
          const mItems = prevData.monthItems || [];
          const qItems = prevData.quarterItems || [];
          const yItems = prevData.yearItems || [];

          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const q = qItems.find((it) => it.id === cat.id) || {};
            const y = yItems.find((it) => it.id === cat.id) || {};

            const mCurr = Number(m.curr ?? 0);
            const mPrev = Number(m.prev ?? 0);
            const mDiff = Number((mCurr - mPrev).toFixed(1));
            const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1) + '%' : '0%');

            const qCurr = Number(q.curr ?? 0);
            const qPrev = Number(q.prev ?? 0);
            const qDiff = Number((qCurr - qPrev).toFixed(1));
            const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1) + '%' : '0%');

            const yCurr = Number(y.curr ?? 0);
            const yPrev = Number(y.prev ?? 0);
            const yDiff = Number((yCurr - yPrev).toFixed(1));
            const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1) + '%' : '0%');

            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`${monthCol} - ${prevData.monthLegendCurr}`]: mCurr,
              [`${monthCol} - ${prevData.monthLegendPrev}`]: mPrev,
              [`${monthCol} - +/- Chênh lệch`]: mDiff,
              [`${monthCol} - % delta`]: mRate,
              [`${quarterCol} - ${prevData.quarterLegendCurr}`]: qCurr,
              [`${quarterCol} - ${prevData.quarterLegendPrev}`]: qPrev,
              [`${quarterCol} - +/- Chênh lệch`]: qDiff,
              [`${quarterCol} - % delta`]: qRate,
              [`${yearCol} - ${prevData.yearLegendCurr}`]: yCurr,
              [`${yearCol} - ${prevData.yearLegendPrev}`]: yPrev,
              [`${yearCol} - +/- Chênh lệch`]: yDiff,
              [`${yearCol} - % delta`]: yRate,
            };
          });

          const mTotalCurr = mItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const mTotalPrev = mItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const qTotalCurr = qItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const qTotalPrev = qItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const yTotalCurr = yItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const yTotalPrev = yItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);

          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`${monthCol} - ${prevData.monthLegendCurr}`]: mTotalCurr,
            [`${monthCol} - ${prevData.monthLegendPrev}`]: mTotalPrev,
            [`${monthCol} - +/- Chênh lệch`]: Number((mTotalCurr - mTotalPrev).toFixed(1)),
            [`${monthCol} - % delta`]: mTotalPrev > 0 ? ((mTotalCurr / mTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${quarterCol} - ${prevData.quarterLegendCurr}`]: qTotalCurr,
            [`${quarterCol} - ${prevData.quarterLegendPrev}`]: qTotalPrev,
            [`${quarterCol} - +/- Chênh lệch`]: Number((qTotalCurr - qTotalPrev).toFixed(1)),
            [`${quarterCol} - % delta`]: qTotalPrev > 0 ? ((qTotalCurr / qTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${yearCol} - ${prevData.yearLegendCurr}`]: yTotalCurr,
            [`${yearCol} - ${prevData.yearLegendPrev}`]: yTotalPrev,
            [`${yearCol} - +/- Chênh lệch`]: Number((yTotalCurr - yTotalPrev).toFixed(1)),
            [`${yearCol} - % delta`]: yTotalPrev > 0 ? ((yTotalCurr / yTotalPrev) * 100).toFixed(1) + '%' : '0%',
          });

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_Ky_Truoc');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_ky_truoc_${selectedYear}.xlsx`);
          return;
        }

        // Xử lý xuất Excel cho từng biểu đồ đơn lẻ hoặc bảng tổng hợp
        const isSingleStructure = ['spdv_th_month', 'spdv_kh_month', 'spdv_th_quarter', 'spdv_kh_quarter', 'spdv_th_year', 'spdv_kh_year'].includes(activeChartKey);
        
        if (isSingleStructure) {
          const spdvTableData = SPDV_STRUCTURE_TABLE_DATA[selectedYear] || SPDV_STRUCTURE_TABLE_DATA['2026'];
          let period = 'month';
          let metric = 'th';
          let periodLabel = monthCol;
          let metricLabel = 'Doanh thu thực hiện (TH)';
          let shareLabel = 'Tỷ trọng TH (%)';

          if (activeChartKey === 'spdv_th_month') {
            period = 'month'; metric = 'th'; periodLabel = monthCol; metricLabel = 'Doanh thu thực hiện (TH)'; shareLabel = 'Tỷ trọng TH (%)';
          } else if (activeChartKey === 'spdv_kh_month') {
            period = 'month'; metric = 'kh'; periodLabel = monthCol; metricLabel = 'Doanh thu kế hoạch (KH)'; shareLabel = 'Tỷ trọng KH (%)';
          } else if (activeChartKey === 'spdv_th_quarter') {
            period = 'quarter'; metric = 'th'; periodLabel = quarterCol; metricLabel = 'Doanh thu thực hiện (TH)'; shareLabel = 'Tỷ trọng TH (%)';
          } else if (activeChartKey === 'spdv_kh_quarter') {
            period = 'quarter'; metric = 'kh'; periodLabel = quarterCol; metricLabel = 'Doanh thu kế hoạch (KH)'; shareLabel = 'Tỷ trọng KH (%)';
          } else if (activeChartKey === 'spdv_th_year') {
            period = 'year'; metric = 'th'; periodLabel = yearCol; metricLabel = 'Doanh thu thực hiện (TH)'; shareLabel = 'Tỷ trọng TH (%)';
          } else if (activeChartKey === 'spdv_kh_year') {
            period = 'year'; metric = 'kh'; periodLabel = yearCol; metricLabel = 'Doanh thu kế hoạch (KH)'; shareLabel = 'Tỷ trọng KH (%)';
          }

          const exportRows = (spdvTableData.rows || []).map((r, idx) => ({
            'STT': idx + 1,
            'Nhóm SPDV': r.name,
            [`${metricLabel} - ${periodLabel} (Triệu đồng)`]: r[period]?.[metric] ?? '',
            [shareLabel]: r[period]?.[`${metric}Share`] ?? ''
          }));

          if (spdvTableData.total) {
            const tot = spdvTableData.total;
            exportRows.push({
              'STT': 'Σ',
              'Nhóm SPDV': tot.name || 'Tổng doanh thu',
              [`${metricLabel} - ${periodLabel} (Triệu đồng)`]: tot[period]?.[metric] ?? '',
              [shareLabel]: tot[period]?.[`${metric}Share`] ?? '100%'
            });
          }

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Co_Cau_SPDV');
          XLSX.writeFile(wb, `Co_cau_${metric.toUpperCase()}_${activeChartKey}_${selectedYear}.xlsx`);
          return;
        }

        // Biểu đồ 18 đơn lẻ (Tháng, Quý hoặc Năm)
        if (activeChartKey === 'spdv_bar_month') {
          const barCompareData = getSpdvBarComparisonData(selectedYear, selectedMonth);
          const mItems = barCompareData.monthItems || [];
          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const mTh = Number(m.th ?? 0);
            const mKh = Number(m.kh ?? 0);
            const mDiff = Number((mTh - mKh).toFixed(1));
            const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1) + '%' : '0%');
            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`TH ${monthCol} (Tỷ đ)`]: mTh,
              [`KH ${monthCol} (Tỷ đ)`]: mKh,
              [`+/- so KH (Tỷ đ)`]: mDiff,
              [`% HTKH`]: mRate
            };
          });
          const mTotalTh = mItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const mTotalKh = mItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`TH ${monthCol} (Tỷ đ)`]: mTotalTh,
            [`KH ${monthCol} (Tỷ đ)`]: mTotalKh,
            [`+/- so KH (Tỷ đ)`]: Number((mTotalTh - mTotalKh).toFixed(1)),
            [`% HTKH`]: mTotalKh > 0 ? ((mTotalTh / mTotalKh) * 100).toFixed(1) + '%' : '0%'
          });
          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_SPDV_Thang');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_KH_Thang_${selectedYear}.xlsx`);
          return;
        }

        if (activeChartKey === 'spdv_bar_quarter') {
          const barCompareData = getSpdvBarComparisonData(selectedYear, selectedMonth);
          const qItems = barCompareData.quarterItems || [];
          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const q = qItems.find((it) => it.id === cat.id) || {};
            const qTh = Number(q.th ?? 0);
            const qKh = Number(q.kh ?? 0);
            const qDiff = Number((qTh - qKh).toFixed(1));
            const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1) + '%' : '0%');
            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`Ước TH ${quarterCol} (Tỷ đ)`]: qTh,
              [`KH ${quarterCol} (Tỷ đ)`]: qKh,
              [`+/- so KH (Tỷ đ)`]: qDiff,
              [`% HTKH`]: qRate
            };
          });
          const qTotalTh = qItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const qTotalKh = qItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`Ước TH ${quarterCol} (Tỷ đ)`]: qTotalTh,
            [`KH ${quarterCol} (Tỷ đ)`]: qTotalKh,
            [`+/- so KH (Tỷ đ)`]: Number((qTotalTh - qTotalKh).toFixed(1)),
            [`% HTKH`]: qTotalKh > 0 ? ((qTotalTh / qTotalKh) * 100).toFixed(1) + '%' : '0%'
          });
          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_SPDV_Quy');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_KH_Quy_${selectedYear}.xlsx`);
          return;
        }

        if (activeChartKey === 'spdv_bar_year') {
          const barCompareData = getSpdvBarComparisonData(selectedYear, selectedMonth);
          const yItems = barCompareData.yearItems || [];
          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const y = yItems.find((it) => it.id === cat.id) || {};
            const yTh = Number(y.th ?? 0);
            const yKh = Number(y.kh ?? 0);
            const yDiff = Number((yTh - yKh).toFixed(1));
            const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1) + '%' : '0%');
            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`Ước TH ${yearCol} (Tỷ đ)`]: yTh,
              [`KH ${yearCol} (Tỷ đ)`]: yKh,
              [`+/- so KH (Tỷ đ)`]: yDiff,
              [`% HTKH`]: yRate
            };
          });
          const yTotalTh = yItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const yTotalKh = yItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`Ước TH ${yearCol} (Tỷ đ)`]: yTotalTh,
            [`KH ${yearCol} (Tỷ đ)`]: yTotalKh,
            [`+/- so KH (Tỷ đ)`]: Number((yTotalTh - yTotalKh).toFixed(1)),
            [`% HTKH`]: yTotalKh > 0 ? ((yTotalTh / yTotalKh) * 100).toFixed(1) + '%' : '0%'
          });
          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_SPDV_Nam');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_KH_Nam_${selectedYear}.xlsx`);
          return;
        }

        // Bảng tích hợp 3 kỳ Biểu đồ 18
        if (isBarCompare || activeChartKey === 'spdv_bar_integrated') {
          const barCompareData = getSpdvBarComparisonData(selectedYear, selectedMonth);
          const mItems = barCompareData.monthItems || [];
          const qItems = barCompareData.quarterItems || [];
          const yItems = barCompareData.yearItems || [];

          const exportRows = SPDV_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const q = qItems.find((it) => it.id === cat.id) || {};
            const y = yItems.find((it) => it.id === cat.id) || {};

            const mTh = Number(m.th ?? 0);
            const mKh = Number(m.kh ?? 0);
            const mDiff = Number((mTh - mKh).toFixed(1));
            const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1) + '%' : '0%');

            const qTh = Number(q.th ?? 0);
            const qKh = Number(q.kh ?? 0);
            const qDiff = Number((qTh - qKh).toFixed(1));
            const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1) + '%' : '0%');

            const yTh = Number(y.th ?? 0);
            const yKh = Number(y.kh ?? 0);
            const yDiff = Number((yTh - yKh).toFixed(1));
            const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1) + '%' : '0%');

            return {
              'STT': idx + 1,
              'Nhóm SPDV': cat.name,
              [`${monthCol} - TH`]: mTh,
              [`${monthCol} - KH`]: mKh,
              [`${monthCol} - +/- so KH`]: mDiff,
              [`${monthCol} - % HTKH`]: mRate,
              [`${quarterCol} - Ước TH`]: qTh,
              [`${quarterCol} - KH`]: qKh,
              [`${quarterCol} - +/- so KH`]: qDiff,
              [`${quarterCol} - % HTKH`]: qRate,
              [`${yearCol} - Ước TH`]: yTh,
              [`${yearCol} - KH`]: yKh,
              [`${yearCol} - +/- so KH`]: yDiff,
              [`${yearCol} - % HTKH`]: yRate,
            };
          });

          const mTotalTh = mItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const mTotalKh = mItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          const qTotalTh = qItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const qTotalKh = qItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          const yTotalTh = yItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const yTotalKh = yItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);

          exportRows.push({
            'STT': 'Σ',
            'Nhóm SPDV': 'Tổng doanh thu 6 nhóm SPDV',
            [`${monthCol} - TH`]: mTotalTh,
            [`${monthCol} - KH`]: mTotalKh,
            [`${monthCol} - +/- so KH`]: Number((mTotalTh - mTotalKh).toFixed(1)),
            [`${monthCol} - % HTKH`]: mTotalKh > 0 ? ((mTotalTh / mTotalKh) * 100).toFixed(1) + '%' : '0%',
            [`${quarterCol} - Ước TH`]: qTotalTh,
            [`${quarterCol} - KH`]: qTotalKh,
            [`${quarterCol} - +/- so KH`]: Number((qTotalTh - qTotalKh).toFixed(1)),
            [`${quarterCol} - % HTKH`]: qTotalKh > 0 ? ((qTotalTh / qTotalKh) * 100).toFixed(1) + '%' : '0%',
            [`${yearCol} - Ước TH`]: yTotalTh,
            [`${yearCol} - KH`]: yTotalKh,
            [`${yearCol} - +/- so KH`]: Number((yTotalTh - yTotalKh).toFixed(1)),
            [`${yearCol} - % HTKH`]: yTotalKh > 0 ? ((yTotalTh / yTotalKh) * 100).toFixed(1) + '%' : '0%',
          });

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_SPDV');
          XLSX.writeFile(wb, `Doanh_thu_6_nhom_SPDV_so_voi_KH_${selectedYear}.xlsx`);
          return;
        }

        const spdvTableData = SPDV_STRUCTURE_TABLE_DATA[selectedYear] || SPDV_STRUCTURE_TABLE_DATA['2026'];
        const isKhStructureExport = (activeChartKey || '').includes('kh') || (chartTitle || '').toLowerCase().includes('kế hoạch');
        const metricKey = isKhStructureExport ? 'kh' : 'th';
        const metricName = isKhStructureExport ? 'KH' : 'TH';

        const exportRows = (spdvTableData.rows || []).map(r => ({
          'Nhóm SPDV': r.name,
          [`${monthCol} - ${metricName}`]: r.month?.[metricKey] ?? '',
          [`${monthCol} - Tỷ trọng ${metricName}`]: r.month?.[`${metricKey}Share`] ?? '',
          [`${quarterCol} - ${metricName}`]: r.quarter?.[metricKey] ?? '',
          [`${quarterCol} - Tỷ trọng ${metricName}`]: r.quarter?.[`${metricKey}Share`] ?? '',
          [`${yearCol} - ${metricName}`]: r.year?.[metricKey] ?? '',
          [`${yearCol} - Tỷ trọng ${metricName}`]: r.year?.[`${metricKey}Share`] ?? '',
        }));

        if (spdvTableData.total) {
          const tot = spdvTableData.total;
          exportRows.push({
            'Nhóm SPDV': tot.name || 'Tổng doanh thu',
            [`${monthCol} - ${metricName}`]: tot.month?.[metricKey] ?? '',
            [`${monthCol} - Tỷ trọng ${metricName}`]: tot.month?.[`${metricKey}Share`] ?? '100%',
            [`${quarterCol} - ${metricName}`]: tot.quarter?.[metricKey] ?? '',
            [`${quarterCol} - Tỷ trọng ${metricName}`]: tot.quarter?.[`${metricKey}Share`] ?? '100%',
            [`${yearCol} - ${metricName}`]: tot.year?.[metricKey] ?? '',
            [`${yearCol} - Tỷ trọng ${metricName}`]: tot.year?.[`${metricKey}Share`] ?? '100%',
          });
        }

        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Co_Cau_SPDV');
        XLSX.writeFile(wb, `Co_cau_doanh_thu_theo_Nhom_SPDV_${selectedYear}.xlsx`);
        return;
      }

      if (activeBranchId === 'unit') {
        const isBarCompare = !activeChartKey.includes('struct') && !activeChartKey.includes('cơ cấu') && activeChartKey !== 'chart21';
        const unitMonthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
        const unitQuarterNum = Math.ceil(unitMonthNum / 3);
        const unitQuarterRoman = `${unitQuarterNum}`;
        const unitQuarterStartMonth = (unitQuarterNum - 1) * 3 + 1;
        const unitQuarterCumText = unitQuarterStartMonth === unitMonthNum
          ? `T${unitQuarterStartMonth}`
          : `T${unitQuarterStartMonth}-T${unitMonthNum}`;

        const monthCol = `Tháng ${unitMonthNum}/${selectedYear}`;
        const quarterCol = `Quý ${unitQuarterRoman}/${selectedYear} (lũy kế ${unitQuarterCumText})`;
        const yearCol = `Năm ${selectedYear} (lũy kế ${unitMonthNum}T)`;

        const isPrevPeriod = activeChartKey.includes('prev') || activeChartKey.includes('23');
        if (isPrevPeriod) {
          const prevData = UNIT_PREV_PERIOD_COMPARISON_DATA[selectedYear] || UNIT_PREV_PERIOD_COMPARISON_DATA['2026'];
          const mItems = prevData?.month?.items || [];
          const qItems = prevData?.quarter?.items || [];
          const yItems = prevData?.year?.items || [];

          const mLegendCurr = prevData?.month?.primaryLegend || `TH T${unitMonthNum}`;
          const mLegendPrev = prevData?.month?.secondaryLegend || `TH T${unitMonthNum === 1 ? 12 : unitMonthNum - 1}`;
          const qLegendCurr = prevData?.quarter?.primaryLegend || `Ước Q${unitQuarterRoman}`;
          const qLegendPrev = prevData?.quarter?.secondaryLegend || `TH Q${unitQuarterNum === 1 ? 4 : unitQuarterNum - 1}`;
          const yLegendCurr = prevData?.year?.primaryLegend || `Ước ${selectedYear}`;
          const yLegendPrev = prevData?.year?.secondaryLegend || `TH ${parseInt(selectedYear) - 1}`;

          const exportRows = UNIT_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const q = qItems.find((it) => it.id === cat.id) || {};
            const y = yItems.find((it) => it.id === cat.id) || {};

            const mCurr = Number(m.curr ?? 0);
            const mPrev = Number(m.prev ?? 0);
            const mDiff = Number((mCurr - mPrev).toFixed(1));
            const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1) + '%' : '0%');

            const qCurr = Number(q.curr ?? 0);
            const qPrev = Number(q.prev ?? 0);
            const qDiff = Number((qCurr - qPrev).toFixed(1));
            const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1) + '%' : '0%');

            const yCurr = Number(y.curr ?? 0);
            const yPrev = Number(y.prev ?? 0);
            const yDiff = Number((yCurr - yPrev).toFixed(1));
            const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1) + '%' : '0%');

            return {
              'STT': idx + 1,
              'Đơn vị thực hiện': cat.name,
              [`${monthCol} - ${mLegendCurr}`]: mCurr,
              [`${monthCol} - ${mLegendPrev}`]: mPrev,
              [`${monthCol} - +/- Chênh lệch`]: mDiff,
              [`${monthCol} - % delta`]: mRate,
              [`${quarterCol} - ${qLegendCurr}`]: qCurr,
              [`${quarterCol} - ${qLegendPrev}`]: qPrev,
              [`${quarterCol} - +/- Chênh lệch`]: qDiff,
              [`${quarterCol} - % delta`]: qRate,
              [`${yearCol} - ${yLegendCurr}`]: yCurr,
              [`${yearCol} - ${yLegendPrev}`]: yPrev,
              [`${yearCol} - +/- Chênh lệch`]: yDiff,
              [`${yearCol} - % delta`]: yRate,
            };
          });

          const mTotalCurr = mItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const mTotalPrev = mItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const qTotalCurr = qItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const qTotalPrev = qItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
          const yTotalCurr = yItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
          const yTotalPrev = yItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);

          exportRows.push({
            'STT': 'Σ',
            'Đơn vị thực hiện': 'Tổng doanh thu',
            [`${monthCol} - ${mLegendCurr}`]: mTotalCurr,
            [`${monthCol} - ${mLegendPrev}`]: mTotalPrev,
            [`${monthCol} - +/- Chênh lệch`]: Number((mTotalCurr - mTotalPrev).toFixed(1)),
            [`${monthCol} - % delta`]: mTotalPrev > 0 ? ((mTotalCurr / mTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${quarterCol} - ${qLegendCurr}`]: qTotalCurr,
            [`${quarterCol} - ${qLegendPrev}`]: qTotalPrev,
            [`${quarterCol} - +/- Chênh lệch`]: Number((qTotalCurr - qTotalPrev).toFixed(1)),
            [`${quarterCol} - % delta`]: qTotalPrev > 0 ? ((qTotalCurr / qTotalPrev) * 100).toFixed(1) + '%' : '0%',
            [`${yearCol} - ${yLegendCurr}`]: yTotalCurr,
            [`${yearCol} - ${yLegendPrev}`]: yTotalPrev,
            [`${yearCol} - +/- Chênh lệch`]: Number((yTotalCurr - yTotalPrev).toFixed(1)),
            [`${yearCol} - % delta`]: yTotalPrev > 0 ? ((yTotalCurr / yTotalPrev) * 100).toFixed(1) + '%' : '0%',
          });

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_Ky_Truoc_Don_Vi');
          XLSX.writeFile(wb, `Doanh_thu_theo_Don_vi_so_voi_ky_truoc_${selectedYear}.xlsx`);
          return;
        }

        if (isBarCompare) {
          const yearPlanData = UNIT_PLAN_COMPARISON_DATA[selectedYear] || UNIT_PLAN_COMPARISON_DATA['2026'];
          const mItems = yearPlanData?.month?.items || [];
          const qItems = yearPlanData?.quarter?.items || [];
          const yItems = yearPlanData?.year?.items || [];

          const exportRows = UNIT_CATEGORIES.map((cat, idx) => {
            const m = mItems.find((it) => it.id === cat.id) || {};
            const q = qItems.find((it) => it.id === cat.id) || {};
            const y = yItems.find((it) => it.id === cat.id) || {};

            const mTh = Number(m.th ?? 0);
            const mKh = Number(m.kh ?? 0);
            const mDiff = Number((mTh - mKh).toFixed(1));
            const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1) + '%' : '0%');

            const qTh = Number(q.th ?? 0);
            const qKh = Number(q.kh ?? 0);
            const qDiff = Number((qTh - qKh).toFixed(1));
            const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1) + '%' : '0%');

            const yTh = Number(y.th ?? 0);
            const yKh = Number(y.kh ?? 0);
            const yDiff = Number((yTh - yKh).toFixed(1));
            const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1) + '%' : '0%');

            return {
              'STT': idx + 1,
              'Đơn vị thực hiện': cat.name,
              [`${monthCol} - TH`]: mTh,
              [`${monthCol} - KH`]: mKh,
              [`${monthCol} - +/- so KH`]: mDiff,
              [`${monthCol} - % HTKH`]: mRate,
              [`${quarterCol} - Ước TH`]: qTh,
              [`${quarterCol} - KH`]: qKh,
              [`${quarterCol} - +/- so KH`]: qDiff,
              [`${quarterCol} - % HTKH`]: qRate,
              [`${yearCol} - Ước TH`]: yTh,
              [`${yearCol} - KH`]: yKh,
              [`${yearCol} - +/- so KH`]: yDiff,
              [`${yearCol} - % HTKH`]: yRate,
            };
          });

          const mTotalTh = mItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const mTotalKh = mItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          const qTotalTh = qItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const qTotalKh = qItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
          const yTotalTh = yItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
          const yTotalKh = yItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);

          exportRows.push({
            'STT': 'Σ',
            'Đơn vị thực hiện': 'Tổng doanh thu',
            [`${monthCol} - TH`]: mTotalTh,
            [`${monthCol} - KH`]: mTotalKh,
            [`${monthCol} - +/- so KH`]: Number((mTotalTh - mTotalKh).toFixed(1)),
            [`${monthCol} - % HTKH`]: mTotalKh > 0 ? ((mTotalTh / mTotalKh) * 100).toFixed(1) + '%' : '0%',
            [`${quarterCol} - Ước TH`]: qTotalTh,
            [`${quarterCol} - KH`]: qTotalKh,
            [`${quarterCol} - +/- so KH`]: Number((qTotalTh - qTotalKh).toFixed(1)),
            [`${quarterCol} - % HTKH`]: qTotalKh > 0 ? ((qTotalTh / qTotalKh) * 100).toFixed(1) + '%' : '0%',
            [`${yearCol} - Ước TH`]: yTotalTh,
            [`${yearCol} - KH`]: yTotalKh,
            [`${yearCol} - +/- so KH`]: Number((yTotalTh - yTotalKh).toFixed(1)),
            [`${yearCol} - % HTKH`]: yTotalKh > 0 ? ((yTotalTh / yTotalKh) * 100).toFixed(1) + '%' : '0%',
          });

          const ws = XLSX.utils.json_to_sheet(exportRows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'So_Sanh_Don_Vi');
          XLSX.writeFile(wb, `Doanh_thu_theo_Don_vi_so_voi_KH_${selectedYear}.xlsx`);
          return;
        }

        const unitTableData = UNIT_STRUCTURE_TABLE_DATA[selectedYear] || UNIT_STRUCTURE_TABLE_DATA['2026'];
        const exportRows = (unitTableData.rows || []).map(r => ({
          'Đơn vị thực hiện': r.name,
          [`${monthCol} - TH`]: r.month?.th ?? '',
          [`${monthCol} - Tỷ trọng TH`]: r.month?.thShare ?? '',
          [`${quarterCol} - TH`]: r.quarter?.th ?? '',
          [`${quarterCol} - Tỷ trọng TH`]: r.quarter?.thShare ?? '',
          [`${yearCol} - TH`]: r.year?.th ?? '',
          [`${yearCol} - Tỷ trọng TH`]: r.year?.thShare ?? '',
        }));

        if (unitTableData.total) {
          const tot = unitTableData.total;
          exportRows.push({
            'Đơn vị thực hiện': tot.name || 'Tổng doanh thu',
            [`${monthCol} - TH`]: tot.month?.th ?? '',
            [`${monthCol} - Tỷ trọng TH`]: tot.month?.thShare ?? '',
            [`${quarterCol} - TH`]: tot.quarter?.th ?? '',
            [`${quarterCol} - Tỷ trọng TH`]: tot.quarter?.thShare ?? '',
            [`${yearCol} - TH`]: tot.year?.th ?? '',
            [`${yearCol} - Tỷ trọng TH`]: tot.year?.thShare ?? '',
          });
        }

        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Co_Cau_Don_Vi');
        XLSX.writeFile(wb, `Co_cau_doanh_thu_theo_Don_vi_${selectedYear}.xlsx`);
        return;
      }

      const exportRows = filteredRows.map((r) => ({
        'STT': r.stt,
        'Chỉ tiêu / Đối tượng': r.name,
        'Đơn vị tính': r.unit,
        [targetColumnLabel]: r.kh,
        [actualColumnLabel]: r.th,
        [diffHeaderLabel]: r.diff,
        [rateHeaderLabel]: r.rate,
        'Tỷ trọng': r.share,
        'Đánh giá': r.isPass ? 'Đạt / Tốt' : 'Chưa đạt'
      }));

      // Add summary row
      exportRows.push({
        'STT': 'TỔNG',
        'Chỉ tiêu / Đối tượng': 'TỔNG CỘNG',
        'Đơn vị tính': tableData.defaultUnit,
        [targetColumnLabel]: totals.sumKh,
        [actualColumnLabel]: totals.sumTh,
        [diffHeaderLabel]: totals.diffFormatted,
        [rateHeaderLabel]: totals.avgRate,
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

  const renderSummaryCol1 = (group) => {
    if (comparisonType === 'current_plan') return matrixTotals[group]?.th ?? 0;
    if (comparisonType === 'next_plan') return hasEstimate ? (matrixTotals[group]?.uocTh ?? 0) : (matrixTotals[group]?.th ?? 0);
    return hasEstimate ? (matrixTotals[group]?.uocTh ?? 0) : (matrixTotals[group]?.th ?? 0);
  };

  const renderSummaryCol2 = (group) => {
    if (comparisonType === 'current_plan') return matrixTotals[group]?.kh ?? 0;
    return matrixTotals[group]?.targetVal ?? 0;
  };

  return (
    <div className="revenue-chart-detail-view-page">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & CONTROLS BAR (Hidden in Matrix branches: Month, Quarter, Year) */}
      {/* ========================================================================= */}
      {!isMatrixBranch && !isRatioChart && activeBranchId !== 'spdv' && activeBranchId !== 'unit' && (
        <div className="chart-detail-nav-bar">
          <div className="chart-detail-nav-left">
            <button
              type="button"
              className="chart-detail-back-btn"
              onClick={onBack}
              title="Quay lại giao diện biểu đồ"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
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
            </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLE CONTROLS & MAIN DATA TABLE (ONLY TABLE REMAINS IN MATRIX VIEW)  */}
      {/* ========================================================================= */}
      <div className={`chart-detail-table-card ${(activeBranchId === 'spdv' || activeBranchId === 'unit' || activeBranchId === 'plan_progress') ? 'transparent-wrap' : ''}`}>
        {!isMatrixBranch && !isRatioChart && activeBranchId !== 'spdv' && activeBranchId !== 'unit' && activeBranchId !== 'plan_progress' && (
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
          <TableErrorBoundary>
          {isRatioChart ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
              <MonthRatioDetailTable
                branchId={activeBranchId}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedQuarter={selectedQuarter}
                selectedCumulativeMonth={selectedCumulativeMonth}
                activeChartKey={activeChartKey}
                showCardWrapper={false}
              />
            </div>
          ) : isMatrixBranch ? (
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
                      <th key={`th-m-${m}`} colSpan={3} className="th-trend-month-header">
                        Tháng {m}
                      </th>
                    ))}
                    <th colSpan={isTrendPrevYear ? 3 : 4} className="th-trend-total-header">
                      Cả năm {selectedYear}
                    </th>
                  </tr>
                  <tr className="th-sub-row">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      isTrendPrevYear ? (
                        <React.Fragment key={`sub-m-${m}`}>
                          <th className="th-sub-th" style={{ whiteSpace: 'nowrap' }}>TH {selectedYear}</th>
                          <th className="th-sub-prev" style={{ whiteSpace: 'nowrap' }}>TH {lastYear}</th>
                          <th className="th-sub-growth" style={{ whiteSpace: 'nowrap' }}>% Delta</th>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`sub-m-${m}`}>
                          <th className="th-sub-th" style={{ whiteSpace: 'nowrap' }}>TH {selectedYear}</th>
                          <th className="th-sub-kh" style={{ whiteSpace: 'nowrap' }}>KH {selectedYear}</th>
                          <th className="th-sub-rate" style={{ whiteSpace: 'nowrap' }}>% HTKH</th>
                        </React.Fragment>
                      )
                    ))}
                    {isTrendPrevYear ? (
                      <>
                        <th className="th-sub-th" style={{ whiteSpace: 'nowrap' }}>TH {selectedYear}</th>
                        <th className="th-sub-prev" style={{ whiteSpace: 'nowrap' }}>TH {lastYear}</th>
                        <th className="th-sub-growth" style={{ whiteSpace: 'nowrap' }}>% Delta</th>
                      </>
                    ) : (
                      <>
                        <th className="th-sub-th" style={{ whiteSpace: 'nowrap' }}>Tổng TH {selectedYear}</th>
                        <th className="th-sub-kh" style={{ whiteSpace: 'nowrap' }}>Tổng KH {selectedYear}</th>
                        <th className="th-sub-diff" style={{ whiteSpace: 'nowrap' }}>+/- so KH</th>
                        <th className="th-sub-rate" style={{ whiteSpace: 'nowrap' }}>% HTKH</th>
                      </>
                    )}
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
                          isTrendPrevYear ? (
                            <React.Fragment key={`td-m-${m}`}>
                              <td className="td-th text-right font-medium">
                                {row.monthly?.[m]?.thCurrent !== null && row.monthly?.[m]?.thCurrent !== undefined
                                  ? row.monthly[m].thCurrent
                                  : <span className="text-muted">—</span>}
                              </td>
                              <td className="td-prev text-right">
                                {row.monthly?.[m]?.thPrev !== null && row.monthly?.[m]?.thPrev !== undefined
                                  ? row.monthly[m].thPrev
                                  : <span className="text-muted">—</span>}
                              </td>
                              <td className={`td-growth text-right font-bold ${row.monthly?.[m]?.growthNum !== null && row.monthly?.[m]?.growthNum !== undefined ? (row.monthly[m].growthNum >= 0 ? 'text-green' : 'text-red') : ''}`}>
                                {row.monthly?.[m]?.growth || <span className="text-muted">—</span>}
                              </td>
                            </React.Fragment>
                          ) : (
                            <React.Fragment key={`td-m-${m}`}>
                              <td className="td-th text-right font-medium">
                                {row.monthly?.[m]?.th !== null && row.monthly?.[m]?.th !== undefined
                                  ? row.monthly[m].th
                                  : <span className="text-muted">—</span>}
                              </td>
                              <td className="td-kh text-right">{row.monthly?.[m]?.kh ?? 0}</td>
                              <td className={`td-rate text-right font-bold ${row.monthly?.[m]?.rateNum !== null && row.monthly?.[m]?.rateNum !== undefined ? (row.monthly[m].isPass ? 'text-green' : 'text-red') : ''}`}>
                                {row.monthly?.[m]?.rate || <span className="text-muted">—</span>}
                              </td>
                            </React.Fragment>
                          )
                        ))}
                        {isTrendPrevYear ? (
                          <>
                            <td className="td-th text-right font-bold">{row.totalTh}</td>
                            <td className="td-prev text-right font-semibold">{row.prevTh}</td>
                            <td className={`td-growth text-right font-bold ${row.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                              {row.growthRate}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="td-th text-right font-bold">{row.totalTh}</td>
                            <td className="td-kh text-right font-semibold">{row.totalKh}</td>
                            <td className={`td-diff text-right font-medium ${row.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                              {row.totalDiffFormatted}
                            </td>
                            <td className={`td-rate text-right font-bold ${row.isPass ? 'text-green' : 'text-red'}`}>
                              {row.totalRate}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isTrendPrevYear ? 43 : 44} className="table-empty-row">
                        Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {/* Summary Row: Tổng doanh thu (Chỉ giữ lại tổng doanh thu) */}
                  <tr className="month-summary-row row-grand-total">
                    <td colSpan={4} className="summary-title-cell font-extrabold">
                      Tổng doanh thu
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      isTrendPrevYear ? (
                        <React.Fragment key={`tot-m-${m}`}>
                          <td className="td-th text-right font-extrabold">
                            {matrixTotals.total.monthly?.[m]?.thCurrent !== null && matrixTotals.total.monthly?.[m]?.thCurrent !== undefined
                              ? matrixTotals.total.monthly[m].thCurrent
                              : <span className="text-muted">—</span>}
                          </td>
                          <td className="td-prev text-right font-extrabold">
                            {matrixTotals.total.monthly?.[m]?.thPrev ?? 0}
                          </td>
                          <td className={`td-growth text-right font-extrabold ${matrixTotals.total.monthly?.[m]?.growthNum !== null && matrixTotals.total.monthly?.[m]?.growthNum !== undefined ? (matrixTotals.total.monthly[m].growthNum >= 0 ? 'text-green' : 'text-red') : ''}`}>
                            {matrixTotals.total.monthly?.[m]?.growth || <span className="text-muted">—</span>}
                          </td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={`tot-m-${m}`}>
                          <td className="td-th text-right font-extrabold">
                            {matrixTotals.total.monthly?.[m]?.th !== null && matrixTotals.total.monthly?.[m]?.th !== undefined
                              ? matrixTotals.total.monthly[m].th
                              : <span className="text-muted">—</span>}
                          </td>
                          <td className="td-kh text-right font-extrabold">{matrixTotals.total.monthly?.[m]?.kh ?? 0}</td>
                          <td className={`td-rate text-right font-extrabold ${matrixTotals.total.monthly?.[m]?.rateNum !== null && matrixTotals.total.monthly?.[m]?.rateNum !== undefined ? (matrixTotals.total.monthly[m].isPass ? 'text-green' : 'text-red') : ''}`}>
                            {matrixTotals.total.monthly?.[m]?.rate || <span className="text-muted">—</span>}
                          </td>
                        </React.Fragment>
                      )
                    ))}
                    {isTrendPrevYear ? (
                      <>
                        <td className="td-th text-right font-extrabold">{matrixTotals.total.totalTh}</td>
                        <td className="td-prev text-right font-extrabold">{matrixTotals.total.prevTh}</td>
                        <td className={`td-growth text-right font-extrabold ${matrixTotals.total.growthRateNum >= 0 ? 'text-green' : 'text-red'}`}>
                          {matrixTotals.total.growthRate}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="td-th text-right font-extrabold">{matrixTotals.total.totalTh}</td>
                        <td className="td-kh text-right font-extrabold">{matrixTotals.total.totalKh}</td>
                        <td className={`td-diff text-right font-extrabold ${matrixTotals.total.totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                          {matrixTotals.total.totalDiffFormatted}
                        </td>
                        <td className={`td-rate text-right font-extrabold ${matrixTotals.total.isPass ? 'text-green' : 'text-red'}`}>
                          {matrixTotals.total.totalRate}
                        </td>
                      </>
                    )}
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
                  <th colSpan={4} className="th-month-group">
                    {periodHeaderTitle}
                  </th>
                </tr>
                <tr>
                  <th colSpan={4} className="th-plan-group">
                    {comparisonGroupTitle}
                  </th>
                </tr>
                <tr className="th-sub-row">
                  <th className="th-sub-th text-right">{firstSubColLabel}</th>
                  <th className="th-sub-kh text-right">{secondSubColLabel}</th>
                  <th className="th-sub-diff text-right">
                    {diffHeaderLabel}
                  </th>
                  <th className="th-sub-rate text-center">
                    {rateHeaderLabel}
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
                      <td className="td-th text-right font-medium">
                        {comparisonType === 'current_plan'
                          ? row.th
                          : comparisonType === 'next_plan'
                          ? (hasEstimate ? (row.uocTh !== undefined ? row.uocTh : row.th) : row.th)
                          : (hasEstimate ? (row.uocTh !== undefined ? row.uocTh : row.th) : row.th)}
                      </td>
                      <td className="td-kh text-right">
                        {comparisonType === 'current_plan'
                          ? (row.targetVal !== undefined ? row.targetVal : row.kh)
                          : comparisonType === 'next_plan'
                          ? (row.targetVal !== undefined ? row.targetVal : row.kh)
                          : (row.targetVal !== undefined ? row.targetVal : row.th)}
                      </td>
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
                    <td colSpan={8} className="table-empty-row">
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
                  <td className="td-th text-right font-bold">
                    {renderSummaryCol1('external')}
                  </td>
                  <td className="td-kh text-right font-bold">
                    {renderSummaryCol2('external')}
                  </td>
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
                  <td className="td-th text-right font-bold">
                    {renderSummaryCol1('internal')}
                  </td>
                  <td className="td-kh text-right font-bold">
                    {renderSummaryCol2('internal')}
                  </td>
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
                  <td className="td-th text-right font-bold">
                    {renderSummaryCol1('international')}
                  </td>
                  <td className="td-kh text-right font-bold">
                    {renderSummaryCol2('international')}
                  </td>
                  <td className={`td-diff text-right font-bold ${matrixTotals.international.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.international.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${matrixTotals.international.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.international.rate}
                  </td>
                </tr>


                {/* Summary Row 5: Lợi nhuận trước thuế */}
                <tr className="month-summary-row row-profit">
                  <td colSpan={4} className="summary-title-cell font-extrabold">
                    Lợi nhuận trước thuế
                  </td>
                  <td className="td-th text-right font-extrabold">
                    {renderSummaryCol1('profit')}
                  </td>
                  <td className="td-kh text-right font-extrabold">
                    {renderSummaryCol2('profit')}
                  </td>
                  <td className={`td-diff text-right font-extrabold ${matrixTotals.profit.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.profit.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-extrabold ${matrixTotals.profit.isPass ? 'text-green' : 'text-red'}`}>
                    {matrixTotals.profit.rate}
                  </td>
                </tr>

                {/* Summary Row 6: Tổng doanh thu (Highlight blue background - ở cuối cùng) */}
                <tr className="month-summary-row row-grand-total">
                  <td colSpan={4} className="summary-title-cell font-extrabold">
                    Tổng doanh thu
                  </td>
                  <td className="td-th text-right font-extrabold">
                    {renderSummaryCol1('total')}
                  </td>
                  <td className="td-kh text-right font-extrabold">
                    {renderSummaryCol2('total')}
                  </td>
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
        ) : activeBranchId === 'spdv' ? (
          <SpdvDetailTable
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            activeChartKey={activeChartKey}
            chartTitle={chartTitle}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSelectChartKey={(newKey) => setActiveChartKey(newKey)}
          />
        ) : activeBranchId === 'unit' ? (
          <UnitDetailTable
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            activeChartKey={activeChartKey}
            chartTitle={chartTitle}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSelectChartKey={(newKey) => setActiveChartKey(newKey)}
          />
        ) : activeBranchId === 'plan_progress' ? (
          <PlanProgressDetailTable
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            activeChartKey={activeChartKey}
            chartTitle={chartTitle}
          />
        ) : (
            <table className="chart-detail-erp-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ textAlign: 'left', minWidth: '220px' }}>Chỉ tiêu / Đối tượng</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Đơn vị</th>
                  <th style={{ width: '150px', textAlign: 'right', fontWeight: '700' }}>{actualColumnLabel}</th>
                  <th style={{ width: '150px', textAlign: 'right', fontWeight: '700' }}>{targetColumnLabel}</th>
                  <th style={{ width: '125px', textAlign: 'right', fontWeight: '700' }}>
                    {diffHeaderLabel}
                  </th>
                  <th style={{ width: '130px', textAlign: 'center', fontWeight: '700' }}>
                    {rateHeaderLabel}
                  </th>
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
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#e11d48' }}>
                        {typeof row.th === 'number' ? row.th.toLocaleString('vi-VN') : row.th}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#475569' }}>
                        {typeof row.kh === 'number' ? row.kh.toLocaleString('vi-VN') : row.kh}
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
                  <td style={{ textAlign: 'right', fontWeight: '900', color: '#e11d48' }}>
                    {totals.sumTh.toLocaleString('vi-VN')}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: '#334155' }}>
                    {totals.sumKh.toLocaleString('vi-VN')}
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
          </TableErrorBoundary>
        </div>

        {/* Pagination Bar - Styled identical to Báo cáo kết quả doanh thu */}
        {!isMatrixBranch && !isRatioChart && activeBranchId !== 'spdv' && activeBranchId !== 'unit' && (
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ACTIONS (Hidden in Matrix branches)                             */}
      {/* ========================================================================= */}
      {!isMatrixBranch && !isRatioChart && activeBranchId !== 'spdv' && activeBranchId !== 'unit' && (
        <div className="chart-detail-bottom-bar">
          <button
            type="button"
            className="chart-detail-back-btn large"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
        </div>
      )}
    </div>
  );
}
